"""Tests for the v0.6 integration modules that do not need Home Assistant."""

from __future__ import annotations

import importlib.util
import json
import re
import sys
import types
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COMPONENT = ROOT / "custom_components" / "theme_studio"
TEMPLATES = COMPONENT / "templates"
PACKAGE_PATH = TEMPLATES / "packages" / "theme_studio_dynamic.yaml"
DASHBOARD_PATH = TEMPLATES / "lovelace" / "theme_studio_dashboard.yaml"
PKG = "theme_studio_under_test"

HELPER_DOMAINS = ("number", "text", "switch", "select", "button")
SENSORS = {
    "sensor.theme_studio_preset_catalog",
    "sensor.theme_studio_user_theme_catalog",
    "sensor.theme_studio_background_image_catalog",
    "sensor.theme_studio_active_preset",
    # Template sensors defined in the package itself.
    "sensor.theme_studio_theme_summary",
    "sensor.theme_studio_picker_hex",
}


def load_module(name: str):
    """Import one integration module without running __init__.py."""
    if PKG not in sys.modules:
        package = types.ModuleType(PKG)
        package.__path__ = [str(COMPONENT)]
        sys.modules[PKG] = package
    if "homeassistant.core" not in sys.modules:
        core = types.ModuleType("homeassistant.core")
        core.HomeAssistant = object
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


def referenced_entities(text: str) -> set[str]:
    domains = "|".join(HELPER_DOMAINS + ("sensor",))
    return set(re.findall(rf"\b(?:{domains})\.theme_studio_[a-z0-9_]+", text))


def test_helper_definitions_load_and_are_unique() -> None:
    definitions = load_module("definitions").load_definitions()
    keys = [definition.key for definition in definitions]
    assert len(keys) == len(set(keys))
    assert {definition.platform for definition in definitions} == set(HELPER_DOMAINS)
    for definition in definitions:
        if definition.platform == "number":
            assert definition.min <= definition.default <= definition.max, definition.key
        if definition.platform == "select":
            assert str(definition.default) in definition.options, definition.key


def test_every_referenced_entity_is_provided_by_the_integration() -> None:
    definitions = load_module("definitions").load_definitions()
    provided = {definition.entity_id for definition in definitions} | SENSORS
    for path in (PACKAGE_PATH, DASHBOARD_PATH):
        missing = referenced_entities(path.read_text(encoding="utf-8")) - provided
        assert not missing, f"{path.name}: {sorted(missing)}"


def test_no_legacy_helper_or_sensor_references_remain() -> None:
    for path in (PACKAGE_PATH, DASHBOARD_PATH):
        text = path.read_text(encoding="utf-8")
        assert not re.search(r"input_(number|text|boolean|select|button)\.", text), path.name
        for old in ("_preset_index", "_user_theme_index", "_background_image_index", "selected_preset"):
            assert f"sensor.theme_studio{old}" not in text, (path.name, old)


def test_live_arguments_match_the_cli() -> None:
    const = load_module("const")
    engine = load_module("engine")
    cli = engine._load_cli()
    definitions = load_module("definitions").load_definitions()
    provided = {definition.entity_id for definition in definitions}

    assert set(const.LIVE_ARGUMENT_ENTITIES) == set(cli.LIVE_ARGUMENT_KEYS) - {"output"}
    assert set(const.LIVE_ARGUMENT_ENTITIES.values()) <= provided


def test_generate_live_only_rewrites_changed_theme(tmp_path) -> None:
    engine_module = load_module("engine")
    const = load_module("const")
    definitions = load_module("definitions").load_definitions()
    defaults = {definition.entity_id: definition.default for definition in definitions}
    arguments = {}
    for argument, entity_id in const.LIVE_ARGUMENT_ENTITIES.items():
        value = defaults[entity_id]
        if isinstance(value, bool):
            value = "on" if value else "off"
        arguments[argument] = str(value)

    engine = engine_module.ThemeEngine.create(str(tmp_path))
    first = engine.generate_live(arguments)
    second = engine.generate_live(arguments)
    output = tmp_path.joinpath(*const.LIVE_THEME_FILE)

    assert first["changed"] is True
    assert second["changed"] is False
    assert output.read_text(encoding="utf-8").startswith(f"{const.LIVE_THEME_NAME}:\n")
    assert "  primary-color:" in output.read_text(encoding="utf-8")


def test_remove_assets_keeps_user_owned_files(tmp_path) -> None:
    asset_manager = load_module("asset_manager")
    hass = types.SimpleNamespace(
        config=types.SimpleNamespace(path=lambda *parts: str(tmp_path.joinpath(*parts)))
    )
    install = asset_manager.initialize_assets(hass, overwrite=True, backup=True)
    assert install["success"], install

    user_theme = tmp_path / "theme_studio" / "user_themes" / "mine.json"
    user_theme.write_text('{"name": "Mine"}', encoding="utf-8")
    built = tmp_path / "themes" / "theme_studio" / "mine.yaml"
    built.parent.mkdir(parents=True, exist_ok=True)
    built.write_text("Mine:\n  primary-color: red\n", encoding="utf-8")
    package = tmp_path / "packages" / "theme_studio_dynamic.yaml"
    backup = package.with_name(package.name + ".bak_20260101_000000")
    backup.write_text("old", encoding="utf-8")

    result = asset_manager.remove_assets(hass)

    assert result["success"], result
    assert user_theme.exists()
    assert built.exists()
    assert not package.exists()
    assert not backup.exists()
    assert not (tmp_path / "lovelace" / "theme_studio_dashboard.yaml").exists()
    assert not (tmp_path / "theme_studio" / "presets").exists()


def test_strings_cover_every_service() -> None:
    services_yaml = (COMPONENT / "services.yaml").read_text(encoding="utf-8")
    declared = set(re.findall(r"^([a-z_]+):", services_yaml, re.M))
    strings = json.loads((COMPONENT / "strings.json").read_text(encoding="utf-8"))
    translations = json.loads((COMPONENT / "translations" / "en.json").read_text(encoding="utf-8"))

    assert set(strings["services"]) == declared
    assert strings == translations


def test_state_triggered_automations_ignore_entity_reloads() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")
    automations = re.split(r"(?m)^(?=- id: )", package.split("\nautomation:\n", 1)[1])
    for automation in automations:
        if "platform: state" not in automation.split("\n  action:\n", 1)[0]:
            continue
        conditions = automation.split("\n  condition:\n", 1)[1]
        assert conditions.startswith("  - condition: template\n    value_template: \"{{ trigger.platform != 'state'"), (
            automation.splitlines()[0]
        )
