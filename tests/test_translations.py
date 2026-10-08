"""Every language has every text, with the same placeholders as English."""

from __future__ import annotations

import importlib.util
import json
import re
import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMPONENT = ROOT / "custom_components" / "theme_studio"
FRONTEND = ROOT / "frontend" / "src"
LOCALES = FRONTEND / "locales"
PKG = "theme_studio_under_test"
LANGUAGES = ("da", "de", "en", "es", "fr", "nb", "sv")
PLACEHOLDER = re.compile(r"\{([a-z_]+)\}")


def _load(name: str):
    """Import one integration module without Home Assistant (as test_integration does)."""
    if PKG not in sys.modules:
        package = types.ModuleType(PKG)
        package.__path__ = [str(COMPONENT)]
        sys.modules[PKG] = package
    if "homeassistant.core" not in sys.modules:
        core = types.ModuleType("homeassistant.core")
        core.HomeAssistant = object
        core.Event = object
        core.callback = lambda func: func
        sys.modules.setdefault("homeassistant", types.ModuleType("homeassistant"))
        sys.modules["homeassistant.core"] = core
    full_name = f"{PKG}.{name}"
    if full_name in sys.modules:
        return sys.modules[full_name]
    spec = importlib.util.spec_from_file_location(full_name, COMPONENT / f"{name}.py")
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[full_name] = module
    spec.loader.exec_module(module)
    return module


def _read(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _flatten(data: dict, prefix: str = "") -> dict[str, str]:
    flat: dict[str, str] = {}
    for key, value in data.items():
        name = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            flat.update(_flatten(value, name))
        else:
            flat[name] = str(value)
    return flat


def _same_texts(english: dict[str, str], other: dict[str, str], label: str) -> None:
    assert set(other) == set(english), (label, sorted(set(english) ^ set(other))[:10])
    for key, text in english.items():
        assert set(PLACEHOLDER.findall(other[key])) == set(PLACEHOLDER.findall(text)), (label, key)
        assert other[key].strip(), (label, key)


def test_panel_locales_match_english() -> None:
    english = _read(LOCALES / "en.json")
    assert {path.stem for path in LOCALES.glob("*.json")} == set(LANGUAGES)
    i18n = (FRONTEND / "i18n.ts").read_text(encoding="utf-8")
    for language in LANGUAGES:
        _same_texts(english, _read(LOCALES / f"{language}.json"), f"locales/{language}")
        assert f'import {language} from "./locales/{language}.json";' in i18n, language


def test_every_panel_text_key_exists() -> None:
    english = _read(LOCALES / "en.json")
    used: set[str] = set()
    for source in FRONTEND.glob("*.ts"):
        used.update(re.findall(r'\bt\("([^"]+)"', source.read_text(encoding="utf-8")))
    assert used and not used - set(english), sorted(used - set(english))

    tour = (FRONTEND / "tour.ts").read_text(encoding="utf-8")
    steps = re.findall(r'\{ id: "([a-z]\.[a-z]+)", chapter: "([a-z]+)"', tour)
    assert len(steps) > 30
    for step, chapter in steps:
        assert f"tour.{step}.title" in english and f"tour.{step}.body" in english, step
        assert f"tour.chapter.{chapter}" in english, chapter
    for kind in ("quick", "full"):
        assert {f"tour.{kind}", f"tour.{kind}.meta", f"tour.{kind}.desc"} <= set(english)

    config = (FRONTEND / "editor-config.ts").read_text(encoding="utf-8")
    for key in re.findall(r'ends: \["([a-z_.]+)", "([a-z_.]+)"\]', config):
        assert set(key) <= set(english), key


def test_integration_translations_match_strings() -> None:
    strings = _flatten(_read(COMPONENT / "strings.json"))
    files = {path.stem for path in (COMPONENT / "translations").glob("*.json")}
    assert files == set(LANGUAGES)
    for language in LANGUAGES:
        _same_texts(strings, _flatten(_read(COMPONENT / "translations" / f"{language}.json")), f"translations/{language}")


def test_language_option_offers_every_language() -> None:
    const = _load("const")
    assert set(const.LANGUAGES) == set(LANGUAGES)
    strings = _read(COMPONENT / "strings.json")
    assert set(strings["selector"]["language"]["options"]) == {const.LANGUAGE_AUTO, *LANGUAGES}
    for step in (strings["config"]["step"]["user"], strings["options"]["step"]["init"]):
        assert const.CONF_LANGUAGE in step["data"]
        assert const.CONF_LANGUAGE in step["data_description"]
    flow = (COMPONENT / "config_flow.py").read_text(encoding="utf-8")
    assert flow.count("LANGUAGE_SELECTOR") == 3
    panel = (COMPONENT / "panel.py").read_text(encoding="utf-8")
    assert '"language": panel_language(options)' in panel


def test_notification_messages_in_every_language() -> None:
    english = _read(COMPONENT / "messages" / "en.json")
    assert {path.stem for path in (COMPONENT / "messages").glob("*.json")} == set(LANGUAGES)
    for language in LANGUAGES:
        _same_texts(english, _read(COMPONENT / "messages" / f"{language}.json"), f"messages/{language}")
    services = (COMPONENT / "services.py").read_text(encoding="utf-8")
    for key in english:
        assert f'"{key}"' in services or f"'{key}'" in services, key


def test_language_is_resolved_from_option_or_home_assistant() -> None:
    messages = _load("messages")
    assert messages.resolve_language("da", "en") == "da"
    assert messages.resolve_language("auto", "nn") == "nb"
    assert messages.resolve_language("auto", "no") == "nb"
    assert messages.resolve_language("auto", "en-GB") == "en"
    assert messages.resolve_language("auto", "pt-BR") == "en"
    assert messages.resolve_language(None, "sv") == "sv"
    assert messages.resolve_language("xx", None) == "en"
    assert messages.panel_language({}) == "auto"
    assert messages.panel_language({"language": "fr"}) == "fr"
    assert messages.panel_language({"language": "zz"}) == "auto"
    assert messages._messages("de")["import_title"]
    assert messages._messages("en") == _read(COMPONENT / "messages" / "en.json")
