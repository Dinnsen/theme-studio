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
    "sensor.theme_studio_contrast",
    "button.theme_studio_undo",
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


def test_orphaned_legacy_helpers_are_found_but_live_ones_kept() -> None:
    migration = load_module("migration")
    definitions = load_module("definitions").load_definitions()
    by_key = {definition.key: definition for definition in definitions}
    orphan = by_key["theme_studio_theme_base_color"]
    live = by_key["theme_studio_theme_contrast"]
    foreign = by_key["theme_studio_delete_theme"]
    missing = by_key["theme_studio_theme_name"]

    entry = types.SimpleNamespace
    registry = {
        orphan.legacy_entity_id: entry(platform="input_text", unique_id=orphan.key),
        live.legacy_entity_id: entry(platform="input_number", unique_id=live.key),
        # Same entity id, but owned by another integration: never touched.
        foreign.legacy_entity_id: entry(platform="template", unique_id="something"),
        missing.legacy_entity_id: entry(platform="input_text", unique_id=missing.key),
    }
    states = {
        orphan.legacy_entity_id: types.SimpleNamespace(state="unavailable", attributes={"restored": True}),
        live.legacy_entity_id: types.SimpleNamespace(state="50.0", attributes={}),
        foreign.legacy_entity_id: types.SimpleNamespace(state="unavailable", attributes={"restored": True}),
    }

    orphaned = migration.find_orphaned_legacy_entities(definitions, registry.get, states.get)

    assert sorted(orphaned) == sorted([orphan.legacy_entity_id, missing.legacy_entity_id])


def test_entity_names_do_not_repeat_the_device_name() -> None:
    definitions = load_module("definitions").load_definitions()
    names = [definition.name for definition in definitions]
    assert len(names) == len(set(names))
    for name in names:
        assert not re.match(r"theme[ _]studio", name, re.I), name
        assert name[:1].isupper(), name


def test_generate_live_reports_contrast(tmp_path) -> None:
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

    result = engine_module.ThemeEngine.create(str(tmp_path)).generate_live(arguments)

    keys = [pair["key"] for pair in result["contrast"]]
    assert keys == list(const.CONTRAST_LABELS)
    for pair in result["contrast"]:
        assert pair["ok"] == (pair["ratio"] >= pair["minimum"])


def test_copy_variant_mirrors_lightness_and_resets_variant_colours() -> None:
    variants = load_module("variants")
    dark = {
        "base_color": "#1F2F46",
        "custom_background_color": "#0E1510",
        "tone": "-12.0",
        "surface_lift": "3.0",
        "radius": "24.0",
        "accent_color_override": "#53B7FF",
        "card_bg_override": "#1F2F57",
        "state_icon_color_override": "#ffffff",
        "use_custom_text_color": "on",
        "custom_text_color": "#ffffff",
        "border_type": "etched",
    }

    light = variants.mirror_variant(dark, "light")

    assert light["base_color"] == variants.mirror_lightness("#1F2F46", "light")
    assert light["base_color"] != "#1F2F46"
    assert light["tone"] == "12.0"
    assert light["surface_lift"] == "-3.0"
    assert light["card_bg_override"] == "auto"
    assert light["state_icon_color_override"] == "auto"
    assert light["use_custom_text_color"] == "off"
    # The theme's shape and identity are kept.
    assert light["radius"] == "24.0"
    assert light["accent_color_override"] == "#53B7FF"
    assert light["border_type"] == "etched"
    # The source is not touched.
    assert dark["card_bg_override"] == "#1F2F57"
    # A colour that already suits the target is kept.
    assert variants.mirror_lightness("#EEF3EC", "light") == "#EEF3EC"


def test_obsolete_cli_copy_is_removed_and_not_reinstalled(tmp_path) -> None:
    asset_manager = load_module("asset_manager")
    hass = types.SimpleNamespace(
        config=types.SimpleNamespace(path=lambda *parts: str(tmp_path.joinpath(*parts)))
    )
    old = tmp_path / "theme_studio" / "scripts" / "theme_studio_cli.py"
    old.parent.mkdir(parents=True)
    old.write_text("# old copy", encoding="utf-8")
    (old.parent / "theme_studio_cli.py.bak_20260101_000000").write_text("# old", encoding="utf-8")

    result = asset_manager.initialize_assets(hass, overwrite=True, backup=True)

    assert result["success"], result
    assert not old.exists()
    assert not old.parent.exists()
    assert len(result["removed_files"]) == 2


def engine_for(tmp_path):
    asset_manager = load_module("asset_manager")
    hass = types.SimpleNamespace(
        config=types.SimpleNamespace(path=lambda *parts: str(tmp_path.joinpath(*parts)))
    )
    asset_manager.initialize_assets(hass, overwrite=True, backup=True)
    return load_module("engine").ThemeEngine.create(str(tmp_path)), hass


def test_export_and_import_round_trip_never_overwrites(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    copied = engine.copy_preset("Glass", "My Glass")
    assert copied["ok"], copied
    original = (tmp_path / "theme_studio" / "user_themes" / "my_glass.json").read_text(encoding="utf-8")

    exported = engine.export_user_theme("My Glass")
    assert exported["ok"]
    assert (tmp_path / "www" / "theme_studio" / "exports" / "my_glass.json").exists()
    assert exported["url"] == "/local/theme_studio/exports/my_glass.json"
    assert exported["share_string"].startswith("TS1:")

    from_share = engine.import_user_theme(exported["share_string"])
    from_json = engine.import_user_theme(
        (tmp_path / "www" / "theme_studio" / "exports" / "my_glass.json").read_text(encoding="utf-8")
    )
    assert from_share["name"] == "My Glass (2)"
    assert from_json["name"] == "My Glass (3)"
    # The original user theme is untouched.
    assert (tmp_path / "theme_studio" / "user_themes" / "my_glass.json").read_text(encoding="utf-8") == original
    imported = json.loads((tmp_path / "theme_studio" / "user_themes" / "my_glass_2.json").read_text(encoding="utf-8"))
    stored = json.loads(original)
    assert imported["light"] == stored["light"]
    assert imported["dark"] == stored["dark"]


def test_import_cannot_take_a_built_in_preset_name(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    sharing = load_module("sharing")
    document = {"name": "Glass", "light": {"base_color": "#ffffff"}, "dark": {"base_color": "#000000"}}
    result = engine.import_user_theme(json.dumps(document))
    assert result["name"] == "Glass (2)"
    assert (tmp_path / "theme_studio" / "presets" / "glass.json").exists()
    try:
        sharing.parse_import("not a theme", [])
    except sharing.ImportError_ as err:
        assert str(err) == "bad_json"
    else:
        raise AssertionError("garbage was accepted")


def test_share_string_decompression_is_bounded() -> None:
    import base64
    import zlib

    sharing = load_module("sharing")
    bomb = zlib.compress(b"{" + b" " * (sharing.MAX_IMPORT_BYTES * 4) + b"}", 9)
    text = sharing.SHARE_PREFIX + base64.urlsafe_b64encode(bomb).decode()
    try:
        sharing.parse_import(text, [])
    except sharing.ImportError_ as err:
        assert str(err) == "too_large"
    else:
        raise AssertionError("oversized share string was accepted")


def test_import_folder_marks_files_as_imported(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    folder = tmp_path / "theme_studio" / "imports"
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "one.json").write_text(
        json.dumps({"name": "Shared", "light": {"base_color": "#eeeeee"}, "dark": {"base_color": "#111111"}}),
        encoding="utf-8",
    )
    (folder / "broken.txt").write_text("TS1:not-base64!!", encoding="utf-8")

    result = engine.import_folder()

    assert [item["name"] for item in result["imported"]] == ["Shared"]
    assert [item["file"] for item in result["failed"]] == ["broken.txt"]
    assert (folder / "one.json.imported").exists()
    assert (folder / "broken.txt").exists()


def test_undo_history_steps_back_and_ignores_restores() -> None:
    history = load_module("history").EditorHistory(max_steps=3)
    assert history.undo() is None
    for value in ("a", "b", "b", "c"):
        history.record({"text.x": value})
    assert len(history) == 3
    assert history.undo() == {"text.x": "b"}
    history.restoring = True
    assert history.record({"text.x": "b2"}) is False
    history.restoring = False
    assert history.undo() == {"text.x": "a"}
    assert history.undo() is None


def test_palette_from_bundled_image(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    result = engine.palette_from_image("orange-fade.jpg")
    assert result["ok"]
    assert re.fullmatch(r"#[0-9A-F]{6}", result["suggested_base_color"])
    assert re.fullmatch(r"#[0-9A-F]{6}", result["suggested_accent_color"])
    assert 10 <= result["suggested_background_contrast"] <= 100
    assert abs(sum(colour["share"] for colour in result["colours"]) - 1) < 0.01
    # Only names inside /config/www/background are accepted.
    assert engine.palette_from_image("../../secrets.yaml")["ok"] is False


def test_preset_previews_are_written_and_removed_on_uninstall(tmp_path) -> None:
    import xml.etree.ElementTree as ElementTree

    engine, hass = engine_for(tmp_path)
    written = engine.write_previews()
    folder = tmp_path / "www" / "theme_studio" / "previews"
    files = sorted(folder.glob("*.svg"))
    assert len(files) == 22
    assert len(written) == 22
    assert engine.write_previews() == []  # unchanged files are not rewritten
    for path in files:
        ElementTree.parse(path)

    load_module("asset_manager").remove_assets(hass)
    assert not folder.exists()


def test_user_theme_previews_follow_the_user_themes(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    folder = tmp_path / "www" / "theme_studio" / "previews"
    assert engine.copy_preset("Purple", "Evening")["ok"]
    engine.write_user_theme_index()
    assert (folder / "user_evening_light.svg").exists()
    assert (folder / "user_evening_dark.svg").exists()

    assert engine.delete_user_theme("Evening")["ok"]
    engine.write_user_theme_index()
    assert not (folder / "user_evening_light.svg").exists()
    # Built-in previews are not touched by the user theme clean-up.
    engine.write_previews()
    assert (folder / "purple_light.svg").exists()
