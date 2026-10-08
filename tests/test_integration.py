"""Tests for the integration modules that do not need Home Assistant."""

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
PKG = "theme_studio_under_test"

def load_module(name: str):
    """Import one integration module without running __init__.py."""
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
    if "homeassistant.const" not in sys.modules:
        const = types.ModuleType("homeassistant.const")
        const.EVENT_THEMES_UPDATED = "themes_updated"
        sys.modules["homeassistant.const"] = const
    full_name = f"{PKG}.{name}"
    if full_name in sys.modules:
        return sys.modules[full_name]
    spec = importlib.util.spec_from_file_location(full_name, COMPONENT / f"{name}.py")
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[full_name] = module
    spec.loader.exec_module(module)
    return module


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
    # A backup of the old dashboard package, left by the v1.0.0 update.
    package = tmp_path / "packages" / "theme_studio_dynamic.yaml"
    package.parent.mkdir()
    backup = package.with_name(package.name + ".bak_20260101_000000")
    backup.write_text("old", encoding="utf-8")
    standard = tmp_path / "themes" / "theme_studio_standard.yaml"
    assert standard.exists()

    result = asset_manager.remove_assets(hass)

    assert result["success"], result
    assert user_theme.exists()
    assert built.exists()
    assert not backup.exists()
    assert not standard.exists()
    assert not (tmp_path / "theme_studio" / "presets").exists()


def test_fresh_install_has_no_dashboard_files(tmp_path) -> None:
    asset_manager = load_module("asset_manager")
    hass = types.SimpleNamespace(
        config=types.SimpleNamespace(path=lambda *parts: str(tmp_path.joinpath(*parts)))
    )

    result = asset_manager.initialize_assets(hass, overwrite=True, backup=True)

    assert result["success"], result
    assert result["retired_files"] == []
    assert not (tmp_path / "packages").exists()
    assert not (tmp_path / "lovelace").exists()
    assert not (tmp_path / "themes" / "theme_studio_dynamic.yaml").exists()
    assert (tmp_path / "themes" / "theme_studio_standard.yaml").exists()
    assert (tmp_path / "theme_studio" / "presets" / "default.json").exists()


def test_update_moves_the_classic_dashboard_aside(tmp_path) -> None:
    asset_manager = load_module("asset_manager")
    hass = types.SimpleNamespace(
        config=types.SimpleNamespace(path=lambda *parts: str(tmp_path.joinpath(*parts)))
    )
    old_files = {
        tmp_path / "packages" / "theme_studio_dynamic.yaml": "script: {}\n",
        tmp_path / "lovelace" / "theme_studio_dashboard.yaml": "views: []\n",
        tmp_path / "themes" / "theme_studio_dynamic.yaml": "Theme Studio Dynamic:\n  a: b\n",
        tmp_path / "themes" / "theme_studio" / "theme_studio_dynamic.yaml": "Theme Studio Dynamic:\n  c: d\n",
    }
    for path, text in old_files.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    other_package = tmp_path / "packages" / "mine.yaml"
    other_package.write_text("input_boolean: {}\n", encoding="utf-8")
    user_theme = tmp_path / "theme_studio" / "user_themes" / "mine.json"
    user_theme.parent.mkdir(parents=True)
    user_theme.write_text('{"name": "Mine"}', encoding="utf-8")
    index = user_theme.with_name("index.json")
    index.write_text("{}", encoding="utf-8")
    previews = tmp_path / "www" / "theme_studio" / "previews"
    previews.mkdir(parents=True)
    (previews / "glass_light.svg").write_text("<svg/>", encoding="utf-8")

    result = asset_manager.initialize_assets(hass, overwrite=True, backup=True)

    assert result["success"], result
    assert sorted(result["retired_files"]) == sorted(str(path) for path in old_files)
    for path, text in old_files.items():
        assert not path.exists()
        backups = list(path.parent.glob(f"{path.name}.bak_*"))
        assert len(backups) == 1
        assert backups[0].read_text(encoding="utf-8") == text
        # The backups are not picked up as YAML by Home Assistant.
        assert not backups[0].name.endswith(".yaml")
    # Other files, user themes and their index are never touched.
    assert other_package.read_text(encoding="utf-8") == "input_boolean: {}\n"
    assert user_theme.read_text(encoding="utf-8") == '{"name": "Mine"}'
    assert index.exists()
    assert not previews.exists()
    # Nothing is moved twice.
    again = asset_manager.initialize_assets(hass, overwrite=True, backup=True)
    assert again["retired_files"] == []


def _load_retirement():
    """retirement.py with just enough of Home Assistant stubbed out."""
    for name in ("homeassistant.config_entries", "homeassistant.helpers"):
        sys.modules.setdefault(name, types.ModuleType(name))
    sys.modules["homeassistant.config_entries"].ConfigEntry = object
    helpers = sys.modules["homeassistant.helpers"]
    for name in ("device_registry", "entity_registry", "issue_registry"):
        module = sys.modules.setdefault(f"homeassistant.helpers.{name}", types.ModuleType(name))
        setattr(helpers, name, module)
    issues = sys.modules["homeassistant.helpers.issue_registry"]
    issues.IssueSeverity = types.SimpleNamespace(WARNING="warning")
    return load_module("retirement")


def test_retirement_removes_entities_and_raises_repairs(tmp_path) -> None:
    import asyncio

    retirement = _load_retirement()
    er = sys.modules["homeassistant.helpers.entity_registry"]
    dr = sys.modules["homeassistant.helpers.device_registry"]
    ir = sys.modules["homeassistant.helpers.issue_registry"]
    removed_entities, removed_devices, issues = [], [], {}
    entity_registry = types.SimpleNamespace(async_remove=removed_entities.append)
    device_registry = types.SimpleNamespace(async_remove_device=removed_devices.append)
    er.async_get = lambda hass: entity_registry
    er.async_entries_for_config_entry = lambda registry, entry_id: [
        types.SimpleNamespace(entity_id="text.theme_studio_theme_base_color"),
        types.SimpleNamespace(entity_id="sensor.theme_studio_contrast"),
    ]
    dr.async_get = lambda hass: device_registry
    dr.async_entries_for_config_entry = lambda registry, entry_id: [types.SimpleNamespace(id="device1")]
    ir.async_create_issue = lambda hass, domain, issue_id, **kwargs: issues.__setitem__(issue_id, kwargs)
    ir.async_delete_issue = lambda hass, domain, issue_id: issues.pop(issue_id, None)

    async def executor(func, *args):
        return func(*args)

    hass = types.SimpleNamespace(
        config=types.SimpleNamespace(path=lambda *parts: str(tmp_path.joinpath(*parts))),
        async_add_executor_job=executor,
    )
    entry = types.SimpleNamespace(entry_id="abc")
    (tmp_path / "configuration.yaml").write_text(
        "lovelace:\n  dashboards:\n    theme-studio:\n      mode: yaml\n"
        "      filename: /config/lovelace/theme_studio_dashboard.yaml\n",
        encoding="utf-8",
    )

    asyncio.run(retirement.async_retire(hass, entry, ["/config/packages/theme_studio_dynamic.yaml"]))

    assert removed_entities == ["text.theme_studio_theme_base_color", "sensor.theme_studio_contrast"]
    assert removed_devices == ["device1"]
    assert issues[retirement.ISSUE_RESTART]["is_persistent"] is False
    assert retirement.ISSUE_DASHBOARD_CONFIG in issues

    # Once the block is gone (or only commented out) the repair goes away by itself.
    (tmp_path / "configuration.yaml").write_text(
        "#      filename: /config/lovelace/theme_studio_dashboard.yaml\n", encoding="utf-8"
    )
    issues.clear()
    asyncio.run(retirement.async_retire(hass, entry, []))
    assert issues == {}


def test_settings_are_complete_and_valid() -> None:
    settings = load_module("settings").load_settings()
    engine_module = load_module("engine")
    cli = engine_module._load_cli()
    keys = [setting.key for setting in settings]
    assert len(keys) == len(set(keys))
    assert set(keys) <= set(engine_module._variant_setting_keys(cli))
    assert "color_model" in keys
    for setting in settings:
        assert setting.control in ("number", "text", "switch", "select"), setting.key
        assert setting.label[:1].isupper(), setting.key
        if setting.control == "number":
            assert setting.min <= setting.default <= setting.max, setting.key
        if setting.control == "select":
            assert str(setting.default) in setting.options, setting.key


def test_strings_cover_every_service() -> None:
    services_yaml = (COMPONENT / "services.yaml").read_text(encoding="utf-8")
    declared = set(re.findall(r"^([a-z_]+):", services_yaml, re.M))
    strings = json.loads((COMPONENT / "strings.json").read_text(encoding="utf-8"))
    translations = json.loads((COMPONENT / "translations" / "en.json").read_text(encoding="utf-8"))

    assert set(strings["services"]) == declared
    assert strings == translations
    retirement_source = (COMPONENT / "retirement.py").read_text(encoding="utf-8")
    for issue in re.findall(r'^ISSUE_[A-Z_]+ = "([a-z_]+)"', retirement_source, re.M):
        assert {"title", "description"} <= set(strings["issues"][issue]), issue


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
    copied = engine.new_theme("glass", "My Glass")
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


def test_palette_from_bundled_image(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    result = engine._image_palette("orange-fade.jpg")
    assert result["ok"]
    assert re.fullmatch(r"#[0-9A-F]{6}", result["suggested_base_color"])
    assert re.fullmatch(r"#[0-9A-F]{6}", result["suggested_accent_color"])
    assert 10 <= result["suggested_background_contrast"] <= 100
    assert abs(sum(colour["share"] for colour in result["colours"]) - 1) < 0.01
    # Only names inside /config/www/background are accepted.
    assert engine._image_palette("../../secrets.yaml")["ok"] is False


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


def test_panel_theme_cards_list_presets_then_user_themes(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    assert engine.new_theme("glass", "Mine")["ok"]

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


def test_bundled_fonts_and_their_stylesheet() -> None:
    fonts = load_module("fonts")
    bundled = fonts.bundled_fonts()
    families = {entry["family"] for entry in bundled}
    assert families == {"Inter", "Quicksand", "Josefin Sans", "Orbitron", "Iosevka Charon Mono"}
    for entry in bundled:
        assert (fonts.FONTS_DIR / entry["file"]).stat().st_size < 200_000
        assert (fonts.FONTS_DIR / entry["licence"]).is_file()
    css = fonts.fonts_css([("My Font", "/local/fonts/my-font.woff2")], "1")
    assert css.count("@font-face") == len(bundled) + 1
    assert 'font-family:"Josefin Sans"' in css and "/theme_studio_static/fonts/" in css
    assert 'src:url("/local/fonts/my-font.woff2") format("woff2")' in css
    # The loader module the integration registers is there too.
    assert (COMPONENT / "frontend" / fonts.LOADER_FILE).is_file()


def test_custom_fonts_only_take_safe_values(tmp_path) -> None:
    fonts = load_module("fonts")
    good = {"use_custom_font": "on", "custom_font_family": "My Font", "custom_font_path": "/local/fonts/a.woff2"}
    assert fonts.custom_font(good) == ("My Font", "/local/fonts/a.woff2")
    assert fonts.custom_font({**good, "use_custom_font": "off"}) is None
    for path in ("/local/../secrets.yaml", "javascript:alert(1)", '/local/a.woff2") ; x("', "/api/a.woff2", "/local/a.css"):
        assert fonts.custom_font({**good, "custom_font_path": path}) is None, path
    assert fonts.custom_font({**good, "custom_font_family": 'Bad"Name'}) is None

    engine, _ = engine_for(tmp_path)
    engine.new_theme("glass", "Fonty")
    engine.save_theme("fonty", None, {"dark": good})
    assert engine.custom_fonts() == [("My Font", "/local/fonts/a.woff2")]


def test_export_writes_nothing_and_imports_back(tmp_path) -> None:
    engine, _ = engine_for(tmp_path)
    engine.new_theme("glass", "Shared")
    exported = engine.export_theme("shared")
    assert exported["ok"] and exported["share_string"].startswith("TS1:")
    assert exported["document"]["name"] == "Shared"
    assert not (tmp_path / "www" / "theme_studio" / "exports").exists()
    assert engine.export_theme("glass")["ok"]  # presets can be shared too
    imported = engine.import_user_theme(exported["share_string"])
    assert imported["name"] == "Shared (2)"
    assert engine.export_theme("nope")["reason"] == "not_found"


class _FakeBus:
    def __init__(self) -> None:
        self.fired: list[str] = []
        self.listeners = []

    def async_listen(self, event, handler):
        self.listeners.append(handler)
        return lambda: self.listeners.remove(handler)

    def async_fire(self, event, data=None) -> None:
        self.fired.append(event)


class _FakeStore:
    def __init__(self, data) -> None:
        self.data = data

    async def async_load(self):
        return self.data


class _FakeHass:
    def __init__(self, data) -> None:
        self.data = data
        self.bus = _FakeBus()

    async def async_add_executor_job(self, func, *args):
        return func(*args)


def test_theme_registry_adds_themes_and_survives_reload(tmp_path) -> None:
    import asyncio

    registry_module = load_module("theme_registry")
    engine, _ = engine_for(tmp_path)
    engine.new_theme("glass", "Evening")
    engine.build_theme("Evening")
    hass = _FakeHass(
        {
            "frontend_themes": {"Other": {"primary-color": "red"}},
            "frontend_default_theme": "default",
            "frontend_themes_store": _FakeStore({"frontend_default_theme": "Evening"}),
        }
    )
    registry = registry_module.ThemeRegistry(hass, engine.config_dir)

    assert asyncio.run(registry.async_start())

    themes = hass.data["frontend_themes"]
    assert {"Evening", "Theme Studio Standard", "Other"} <= set(themes)
    assert "Theme Studio Dynamic" not in themes
    assert set(themes["Evening"]["modes"]) == {"light", "dark"}
    assert all(isinstance(value, str) for value in themes["Evening"]["modes"]["dark"].values())
    # A saved default that Home Assistant dropped at start-up is restored.
    assert hass.data["frontend_default_theme"] == "Evening"
    assert hass.bus.fired == ["themes_updated"]

    # "Reload themes" replaces the list with the YAML themes only.
    hass.data["frontend_themes"] = {"Other": {"primary-color": "red"}}
    registry._handle_themes_updated(None)
    assert "Evening" in hass.data["frontend_themes"]
    assert hass.bus.fired == ["themes_updated", "themes_updated"]
    # Its own event changes nothing more, so there is no loop.
    registry._handle_themes_updated(None)
    assert len(hass.bus.fired) == 2

    # A deleted theme leaves the list again; themes from YAML stay.
    engine.delete_theme("evening")
    asyncio.run(registry.async_refresh())
    assert "Evening" not in hass.data["frontend_themes"]
    assert "Other" in hass.data["frontend_themes"]

    registry.async_stop()
    assert not hass.bus.listeners


def test_theme_registry_stays_off_when_unsupported(tmp_path) -> None:
    import asyncio

    registry_module = load_module("theme_registry")
    hass = _FakeHass({})
    registry = registry_module.ThemeRegistry(hass, tmp_path)
    assert asyncio.run(registry.async_start()) is False
    assert registry.active is False


def test_panel_options_include_themes_and_fonts() -> None:
    const = load_module("const")
    strings = json.loads((COMPONENT / "strings.json").read_text(encoding="utf-8"))
    options = strings["options"]["step"]["init"]["data"]
    assert {const.CONF_REGISTER_THEMES, const.CONF_LOAD_FONTS} <= set(options)
