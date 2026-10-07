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


def test_theme_from_image_creates_a_readable_new_user_theme(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    cli = engine.cli
    before = {path.name for path in (tmp_path / "theme_studio" / "user_themes").glob("*.json")}

    result = engine.theme_from_image("orange-fade.jpg")

    assert result["ok"], result
    assert result["name"] == "From orange fade"
    assert result["failing"] == {"light": [], "dark": []}
    created = tmp_path / "theme_studio" / "user_themes" / "from_orange_fade.json"
    after = {path.name for path in (tmp_path / "theme_studio" / "user_themes").glob("*.json")}
    assert after - before == {created.name}
    theme = json.loads(created.read_text(encoding="utf-8"))
    for variant in ("light", "dark"):
        settings = theme[variant]
        assert settings["background_image_url"] == "/local/background/orange-fade.jpg"
        assert settings["use_custom_text_color"] == "off"
        values = cli.build(cli.namespace_from_settings(settings, "/tmp/unused.yaml"))
        assert all(pair["ok"] for pair in cli.contrast_report(values)), variant
    # Light surfaces are light, dark surfaces are dark.
    assert cli.hex_to_hsl(theme["light"]["custom_background_color"])[2] > 80
    assert cli.hex_to_hsl(theme["dark"]["custom_background_color"])[2] < 20
    # A second run never overwrites the first theme.
    assert engine.theme_from_image("orange-fade.jpg")["name"] == "From orange fade (2)"


def test_save_variant_keeps_the_other_variant_and_never_writes_presets(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    assert engine.copy_preset("Glass", "Mine")["ok"]
    path = tmp_path / "theme_studio" / "user_themes" / "mine.json"
    before = json.loads(path.read_text(encoding="utf-8"))
    preset_path = tmp_path / "theme_studio" / "presets" / "glass.json"
    preset_before = preset_path.read_text(encoding="utf-8")

    result = engine.save_variant("Mine", "light", {"base_color": "#123456", "radius": 9.0})

    assert result == {"ok": True, "name": "Mine", "variant": "light"}
    after = json.loads(path.read_text(encoding="utf-8"))
    assert after["light"]["base_color"] == "#123456"
    assert after["light"]["radius"] == 9.0
    assert after["dark"] == before["dark"]
    assert "_path" not in after and "_user_theme" not in after

    refused = engine.save_variant("Glass", "light", {"base_color": "#123456"})
    assert refused["ok"] is False and refused["reason"] == "built_in"
    assert preset_path.read_text(encoding="utf-8") == preset_before
    assert engine.save_variant("Nope", "dark", {})["reason"] == "not_found"


def test_read_theme_tells_presets_from_user_themes(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    assert engine.copy_preset("Glass", "Mine")["ok"]
    assert engine.read_theme("Glass")["_user_theme"] is False
    assert engine.read_theme("Mine")["_user_theme"] is True
    assert engine.read_theme("Does not exist") is None


def test_save_as_new_takes_the_other_variant_from_the_source(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    glass = engine.read_theme("Glass")

    result = engine.save_as_new("Fresh", "Glass", "dark", {"base_color": "#222222"})

    assert result["ok"], result
    stored = json.loads((tmp_path / "theme_studio" / "user_themes" / "fresh.json").read_text(encoding="utf-8"))
    assert stored["name"] == "Fresh"
    assert stored["dark"]["base_color"] == "#222222"
    assert stored["light"] == glass["light"]
    # Existing user themes and built-in preset names are never taken.
    assert engine.save_as_new("Fresh", "Glass", "dark", {})["reason"] == "exists"
    assert engine.save_as_new("Glass", "Glass", "dark", {})["reason"] == "exists"
    assert engine.save_as_new("  ", "Glass", "dark", {})["reason"] == "missing_name"


def test_retired_variant_entities_are_found() -> None:
    migration = load_module("migration")
    entry = types.SimpleNamespace
    entries = [
        entry(entity_id="text.theme_studio_light_base_color", platform="theme_studio",
              unique_id="theme_studio_light_base_color"),
        entry(entity_id="number.theme_studio_dark_radius", platform="theme_studio",
              unique_id="theme_studio_dark_radius"),
        entry(entity_id="text.theme_studio_theme_base_color", platform="theme_studio",
              unique_id="theme_studio_theme_base_color"),
        entry(entity_id="text.theme_studio_light_other", platform="other",
              unique_id="theme_studio_light_other"),
    ]
    assert migration.find_retired_entities(entries, "theme_studio") == [
        "text.theme_studio_light_base_color",
        "number.theme_studio_dark_radius",
    ]


def test_every_variant_helper_is_a_theme_setting() -> None:
    definitions = load_module("definitions").load_definitions()
    engine_module = load_module("engine")
    cli = engine_module.ThemeEngine.create("/tmp/unused").cli
    keys = set(engine_module._variant_setting_keys(cli))
    assert not [d.key for d in definitions if d.key.startswith(("theme_studio_light_", "theme_studio_dark_"))]
    for definition in definitions:
        if definition.variant:
            assert definition.setting in keys, definition.key
    assert "color_model" in cli.SETTING_KEYS


def test_oklch_colour_model_gives_valid_and_different_colours() -> None:
    engine_module = load_module("engine")
    cli = engine_module.ThemeEngine.create("/tmp/unused").cli
    for h in range(0, 360, 30):
        for s, l in ((80, 50), (40, 20), (100, 90), (0, 50)):
            value = cli.oklch_hex(h, s, l)
            assert re.fullmatch(r"#[0-9a-f]{6}", value.lower()), value
    preset = json.loads((TEMPLATES / "theme_studio" / "presets" / "default.json").read_text(encoding="utf-8"))
    settings = {**preset["dark"], "base_color": "#3a7bd5"}
    hsl = cli.build(cli.namespace_from_settings({**settings, "color_model": "hsl"}, "/tmp/unused.yaml"))
    oklch = cli.build(cli.namespace_from_settings({**settings, "color_model": "oklch"}, "/tmp/unused.yaml"))
    assert hsl != oklch
    unknown = cli.build(cli.namespace_from_settings({**settings, "color_model": "rgb"}, "/tmp/unused.yaml"))
    assert unknown == hsl


def test_every_live_argument_regenerates_the_preview() -> None:
    """Changing any value the live theme is built from must rebuild it."""
    import yaml

    const = load_module("const")
    package = yaml.safe_load(PACKAGE_PATH.read_text(encoding="utf-8"))
    watched: set[str] = set()
    for automation in package["automation"]:
        if "theme_studio.generate" not in json.dumps(automation.get("action")):
            continue
        for trigger in automation.get("trigger", []):
            entity_ids = trigger.get("entity_id") or []
            watched |= {entity_ids} if isinstance(entity_ids, str) else set(entity_ids)
    # The image URL follows the background image picker, which is watched.
    indirect = {"text.theme_studio_theme_background_image_url"}
    missing = set(const.LIVE_ARGUMENT_ENTITIES.values()) - watched - indirect
    assert not missing, sorted(missing)


def test_panel_theme_cards_list_presets_then_user_themes(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    assert engine.copy_preset("Glass", "Mine")["ok"]

    cards = engine.theme_cards()

    builtin = [card["name"] for card in cards if card["builtin"]]
    assert builtin == list(engine.cli.BUILTIN_PRESET_NAMES)
    assert cards[-1]["name"] == "Mine" and cards[-1]["builtin"] is False
    for card in cards:
        for variant in ("light", "dark"):
            summary = card[variant]["summary"]
            for key in ("page", "card", "text", "accent", "navbar"):
                assert re.fullmatch(r"#[0-9a-f]{6}", summary[key]), (card["name"], key)
            # Cards stay small: no CSS variables in the list.
            assert "variables" not in card[variant]


def test_panel_theme_detail_has_variables_and_labelled_contrast(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    const = load_module("const")

    detail = engine.theme_detail("glass")

    assert detail["name"] == "Glass" and detail["builtin"] is True
    for variant in ("light", "dark"):
        data = detail[variant]
        assert data["variables"]["ha-card-background"]
        assert [pair["key"] for pair in data["contrast"]] == list(const.CONTRAST_LABELS)
        assert all(pair["label"] == const.CONTRAST_LABELS[pair["key"]] for pair in data["contrast"])
        assert data["failing"] == sum(1 for pair in data["contrast"] if not pair["ok"])
    assert engine.theme_detail("does_not_exist") is None


def test_panel_preview_only_uses_known_plain_settings(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    plain = engine.preview({"base_color": "#3a7bd5"})
    ignored = engine.preview({"base_color": "#3a7bd5", "not_a_setting": "x", "radius": {"nested": 1}})
    assert plain["variables"] == ignored["variables"]
    assert engine.preview({"base_color": "#d53a3a"})["variables"] != plain["variables"]
    # Nothing is written by a preview.
    assert not (tmp_path / "themes" / "theme_studio" / "theme_studio_dynamic.yaml").exists()


def test_panel_bundle_and_registration_match() -> None:
    const = load_module("const")
    bundle = COMPONENT / "frontend" / const.PANEL_MODULE
    assert bundle.is_file(), "run npm run build in frontend/"
    text = bundle.read_text(encoding="utf-8")
    assert f'"{const.PANEL_COMPONENT}"' in text
    websocket = (COMPONENT / "websocket.py").read_text(encoding="utf-8")
    for command in re.findall(r'"(theme_studio/[a-z/]+)"', text):
        suffix = command.split("/", 1)[1]
        assert f'f"{{DOMAIN}}/{suffix}"' in websocket, command
    assert "theme_studio/theme/save" in text
    manifest = json.loads((COMPONENT / "manifest.json").read_text(encoding="utf-8"))
    assert "panel_custom" in manifest["dependencies"]
    strings = json.loads((COMPONENT / "strings.json").read_text(encoding="utf-8"))
    options = strings["options"]["step"]["init"]["data"]
    assert {const.CONF_SHOW_PANEL, const.CONF_PANEL_ADMIN_ONLY} <= set(options)


def test_panel_save_merges_one_theme_and_never_writes_presets(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    user_dir = tmp_path / "theme_studio" / "user_themes"
    created = engine.new_theme("glass", "Mine")
    assert created == {"ok": True, "slug": "mine", "name": "Mine"}
    before = json.loads((user_dir / "mine.json").read_text(encoding="utf-8"))

    result = engine.save_theme("mine", None, {"light": {"radius": 9, "unknown": "x"}})

    assert result["ok"]
    after = json.loads((user_dir / "mine.json").read_text(encoding="utf-8"))
    assert after["light"]["radius"] == 9 and "unknown" not in after["light"]
    assert after["dark"] == before["dark"]
    # One backup per run, however often the editor saves.
    engine.save_theme("mine", None, {"light": {"radius": 10}})
    assert len(list(user_dir.glob("mine.json.bak_*"))) == 1

    preset = tmp_path / "theme_studio" / "presets" / "glass.json"
    preset_before = preset.read_text(encoding="utf-8")
    assert engine.save_theme("glass", None, {"light": {"radius": 1}})["reason"] == "built_in"
    assert engine.save_theme("../presets/glass", None, {})["reason"] == "not_found"
    assert preset.read_text(encoding="utf-8") == preset_before


def test_panel_rename_refuses_names_in_use(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    engine.new_theme("glass", "First")
    engine.new_theme("glass", "Second")
    assert engine.save_theme("second", "First", {})["reason"] == "name_taken"
    assert engine.save_theme("second", "Glass", {})["reason"] == "name_taken"
    assert engine.save_theme("second", "  ", {})["reason"] == "invalid_name"
    renamed = engine.save_theme("second", "Evening", {})
    assert renamed["name"] == "Evening"
    # The file keeps its slug, so links and the dashboard keep working.
    stored = json.loads((tmp_path / "theme_studio" / "user_themes" / "second.json").read_text(encoding="utf-8"))
    assert stored["name"] == "Evening"
    assert engine.theme_name("second") == "Evening"


def test_panel_new_theme_gets_a_free_name_and_fits_the_colour(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    variants = load_module("variants")
    first = engine.new_theme("glass", None)
    second = engine.new_theme("glass", None)
    assert first["name"] == "My Glass" and second["name"] == "My Glass (2)"
    assert engine.new_theme("default", "Glass")["name"] == "Glass (2)"
    coloured = engine.new_theme("default", "Ocean", "#1a6fb0")
    stored = json.loads((tmp_path / "theme_studio" / "user_themes" / f"{coloured['slug']}.json").read_text(encoding="utf-8"))
    assert stored["dark"]["base_color"] == variants.mirror_lightness("#1a6fb0", "dark")
    assert stored["light"]["base_color"] == variants.mirror_lightness("#1a6fb0", "light")
    assert engine.new_theme("nope", None)["reason"] == "source_not_found"


def test_panel_delete_keeps_a_backup_and_refuses_presets(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    user_dir = tmp_path / "theme_studio" / "user_themes"
    engine.new_theme("glass", "Gone")
    built = tmp_path / "themes" / "theme_studio" / "gone.yaml"
    built.parent.mkdir(parents=True, exist_ok=True)
    built.write_text("gone: {}\n", encoding="utf-8")

    result = engine.delete_theme("gone")

    assert result["ok"] and result["removed_theme_files"] == ["gone.yaml"]
    assert not (user_dir / "gone.json").exists()
    assert len(list(user_dir.glob("gone.json.bak_*"))) == 1
    assert engine.delete_theme("glass")["reason"] == "not_found"
    assert (tmp_path / "theme_studio" / "presets" / "glass.json").exists()


def test_panel_schema_and_mirror(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    schema = {item["key"]: item for item in engine.schema()}
    assert set(schema) <= set(engine.setting_keys)
    assert schema["color_model"]["options"] == ["hsl", "oklch"]
    assert schema["radius"]["platform"] == "number" and schema["radius"]["max"] == 32
    light = engine.theme_detail("glass")["light"]["settings"]
    mirrored = engine.mirror(light, "dark")
    assert isinstance(mirrored["radius"], float)
    assert mirrored["card_bg_override"] in ("auto", light["card_bg_override"])


def test_panel_option_previews_show_each_value(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    settings = engine.theme_detail("glass")["dark"]["settings"]
    options = engine.preview_options(settings, "border_type", ["none", "glow_line"], {"shadow_type": "none"})
    assert [option["value"] for option in options] == ["none", "glow_line"]
    assert options[0]["variables"]["theme-studio-border-type"] == "none"
    assert options[1]["variables"]["theme-studio-border-type"] == "glow_line"
    assert options[0]["variables"]["theme-studio-shadow-type"] == "none"
    assert engine.preview_options(settings, "not_a_setting", ["x"], {}) == []


def test_panel_background_upload_is_checked_and_never_overwrites(tmp_path) -> None:
    import io

    from PIL import Image

    engine, _ = engine_for(tmp_path)
    buffer = io.BytesIO()
    Image.new("RGB", (8, 8), "#336699").save(buffer, "PNG")
    png = buffer.getvalue()

    first = engine.save_background("../My Photo!.jpeg", png)
    second = engine.save_background("My Photo!.jpeg", png)

    # The name comes from the file, the extension from its real format.
    assert first == {"ok": True, "file": "My-Photo.png", "url": "/local/background/My-Photo.png"}
    assert second["file"] == "My-Photo-2.png"
    assert (tmp_path / "www" / "background" / "My-Photo.png").read_bytes() == png
    svg = b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'
    assert engine.save_background("x.svg", svg)["reason"] == "not_an_image"
    assert engine.save_background("x.png", b"not an image")["reason"] == "not_an_image"
    engine_module = load_module("engine")
    big = b"0" * (engine_module.MAX_BACKGROUND_BYTES + 1)
    assert engine.save_background("big.png", big)["reason"] == "too_large"
