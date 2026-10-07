"""Regression tests for the generated theme and package wiring (v0.5.0)."""

from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = ROOT / "custom_components" / "theme_studio" / "templates"
CLI_PATH = TEMPLATES / "theme_studio" / "scripts" / "theme_studio_cli.py"
PRESET_DIR = TEMPLATES / "theme_studio" / "presets"
PACKAGE_PATH = TEMPLATES / "packages" / "theme_studio_dynamic.yaml"
DASHBOARD_PATH = TEMPLATES / "lovelace" / "theme_studio_dashboard.yaml"
BUNDLED_THEME_PATH = TEMPLATES / "themes" / "theme_studio_dynamic.yaml"

REMOVED_PREFIXES = (
    "card-mod-",
    "d1nnsen-",
    "my-",
    "paper-",
    "pbs-",
    "ch-",
    "switch-",
    "ha-textfield-",
    "text-field-",
)

REQUIRED_NATIVE_KEYS = {
    "ha-font-family-body",
    "ha-font-family-heading",
    "theme-studio-card-backdrop-filter",
    "ha-card-border-radius",
    "ha-card-border-width",
    "ha-card-box-shadow",
    "ha-dialog-surface-background",
    "ha-dialog-border-radius",
    "ha-dialog-scrim-backdrop-filter",
    "ha-switch-checked-background-color",
    "theme-studio-soft-background-color",
    "theme-studio-panel-background-color",
    "theme-studio-sub-button-background-color",
    "theme-studio-chip-radius",
    "theme-studio-bubble-slider-color",
}


def load_cli_module():
    spec = importlib.util.spec_from_file_location("theme_studio_cli", CLI_PATH)
    assert spec is not None
    assert spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def build_preset_variants(cli):
    for preset_file in sorted(PRESET_DIR.glob("*.json")):
        if preset_file.name == "index.json":
            continue
        preset = json.loads(preset_file.read_text(encoding="utf-8"))
        for variant in ("light", "dark"):
            settings = preset.get(variant) or preset.get("theme")
            if not settings:
                continue
            yield preset_file.name, variant, cli.build(cli.namespace_from_settings(settings, "/tmp/unused.yaml"))


def test_generated_theme_has_no_legacy_or_card_mod_keys() -> None:
    cli = load_cli_module()
    for name, variant, values in build_preset_variants(cli):
        leftovers = [key for key in values if key.startswith(REMOVED_PREFIXES)]
        assert not leftovers, f"{name}/{variant} still emits {leftovers}"


def test_generated_theme_emits_native_variables() -> None:
    cli = load_cli_module()
    for name, variant, values in build_preset_variants(cli):
        missing = REQUIRED_NATIVE_KEYS - set(values)
        assert not missing, f"{name}/{variant} is missing {sorted(missing)}"
        assert values["ha-card-border-width"] == "0px"
        assert "!important" not in "".join(str(v) for v in values.values())


def test_accent_palette_matches_home_assistant_steps() -> None:
    cli = load_cli_module()
    palette = cli.accent_palette("#18bcf2")
    assert list(palette) == [
        f"ha-color-primary-{step:02d}" for step in (5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95)
    ]
    assert palette["ha-color-primary-50"] == "#18bcf2"
    for value in palette.values():
        assert re.fullmatch(r"#[0-9a-f]{6}", value)


def test_bundled_theme_is_current() -> None:
    text = BUNDLED_THEME_PATH.read_text(encoding="utf-8")
    assert text.startswith("Theme Studio Dynamic:\n")
    for prefix in REMOVED_PREFIXES:
        assert f"\n  {prefix}" not in text, prefix
    assert "  ha-color-primary-50:" in text


def test_every_called_theme_studio_service_is_registered() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")
    services_yaml = (ROOT / "custom_components" / "theme_studio" / "services.yaml").read_text(encoding="utf-8")
    declared = set(re.findall(r"^([a-z_]+):", services_yaml, re.M))
    called = set(re.findall(r"service: theme_studio\.([a-z_]+)", package))
    assert called
    assert called <= declared, f"Undeclared services: {sorted(called - declared)}"


def test_delete_flow_passes_explicit_theme_name() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")
    block = package.split("- service: theme_studio.delete_user_theme\n", 1)[1]
    assert block.startswith('    data:\n      name: "{{ delete_name | trim }}"\n')


def test_managed_preset_index_is_never_rewritten() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")
    assert "presets/index.json" not in package


def test_default_theme_is_only_set_when_enabled() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")
    assert package.count("frontend.set_theme") == package.count(
        "entity_id: switch.theme_studio_set_as_default_theme"
    )


def test_dashboard_views_use_dynamic_theme_and_no_legacy_vars() -> None:
    dashboard = DASHBOARD_PATH.read_text(encoding="utf-8")
    views = dashboard.split("\nviews:", 1)[1]
    view_starts = re.findall(r"^  - (?:title|type): ", views, re.M)
    assert views.count("    theme: Theme Studio Dynamic") == len(view_starts)
    for legacy in ("--d1nnsen-", "--my-", "ha-textfield", "--bubble-slider-main-background-color"):
        assert legacy not in dashboard, legacy


def test_bundled_standard_theme_matches_default_preset(tmp_path) -> None:
    cli = load_cli_module()
    preset = json.loads((PRESET_DIR / "default.json").read_text(encoding="utf-8"))
    modes = {
        variant: cli.build(cli.namespace_from_settings(preset[variant], "/tmp/unused.yaml"))
        for variant in ("light", "dark")
    }
    expected = tmp_path / "theme_studio_standard.yaml"
    cli.write_theme_yaml("Theme Studio Standard", modes, str(expected))

    bundled = TEMPLATES / "themes" / "theme_studio_standard.yaml"
    assert bundled.read_text(encoding="utf-8") == expected.read_text(encoding="utf-8")


def test_theme_does_not_blur_every_card() -> None:
    cli = load_cli_module()
    for name, variant, values in build_preset_variants(cli):
        assert "ha-card-backdrop-filter" not in values, f"{name}/{variant}"
        assert "ha-dialog-surface-backdrop-filter" not in values, f"{name}/{variant}"


def test_editor_helpers_survive_restart() -> None:
    helpers = json.loads(
        (ROOT / "custom_components" / "theme_studio" / "helpers.json").read_text(encoding="utf-8")
    )["helpers"]
    reset_on_start = {helper["key"] for helper in helpers if helper.get("reset_on_start")}
    assert reset_on_start == {
        "theme_studio_busy",
        "theme_studio_busy_message",
        "theme_studio_pending_new_theme_name",
        "theme_studio_picker_red",
        "theme_studio_picker_green",
        "theme_studio_picker_blue",
    }


def test_default_preset_is_not_forced_over_a_selected_user_theme() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")
    block = package.split("- id: theme_studio_apply_default_when_none_selected", 1)[1].split("\n- id:", 1)[0]
    assert "text.theme_studio_selected_user_theme" in block


def contrast_of(cli, values, key):
    return next(pair for pair in cli.contrast_report(values) if pair["key"] == key)


def test_text_on_accent_uses_the_more_readable_colour() -> None:
    cli = load_cli_module()
    for name, variant, values in build_preset_variants(cli):
        accent = cli.parse_css_color(cli._resolve_var(values, values["primary-color"]))
        best = max(
            cli.contrast_ratio(cli.parse_css_color(colour), accent)
            for colour in (cli.DARK_TEXT, cli.LIGHT_TEXT)
        )
        ratio = contrast_of(cli, values, "text_on_accent")["ratio"]
        assert abs(ratio - round(best, 2)) < 0.02, f"{name}/{variant}"


def test_automatic_accent_reaches_three_to_one() -> None:
    cli = load_cli_module()
    for preset_file in sorted(PRESET_DIR.glob("*.json")):
        if preset_file.name == "index.json":
            continue
        preset = json.loads(preset_file.read_text(encoding="utf-8"))
        for variant in ("light", "dark"):
            settings = dict(preset[variant])
            settings["accent_color_override"] = "auto"
            values = cli.build(cli.namespace_from_settings(settings, "/tmp/unused.yaml"))
            assert contrast_of(cli, values, "accent_page")["ratio"] >= 3.0, f"{preset_file.name}/{variant}"


def test_automatic_text_is_readable_on_page_and_cards() -> None:
    cli = load_cli_module()
    for preset_file in sorted(PRESET_DIR.glob("*.json")):
        if preset_file.name == "index.json":
            continue
        preset = json.loads(preset_file.read_text(encoding="utf-8"))
        for variant in ("light", "dark"):
            settings = dict(preset[variant])
            settings["use_custom_text_color"] = "off"
            values = cli.build(cli.namespace_from_settings(settings, "/tmp/unused.yaml"))
            worst = min(contrast_of(cli, values, key)["ratio"] for key in ("text_page", "text_card"))
            # The better of white/near-black; mid-tone surfaces can still sit below 4.5.
            assert worst >= 3.0, f"{preset_file.name}/{variant}: {worst}"


def test_custom_icon_switch_reaches_the_theme() -> None:
    cli = load_cli_module()
    preset = json.loads((PRESET_DIR / "default.json").read_text(encoding="utf-8"))
    settings = dict(preset["light"])
    settings.update({"use_custom_icon_color": "on", "custom_icon_color": "#123456"})
    values = cli.build(cli.namespace_from_settings(settings, "/tmp/unused.yaml"))
    assert values["state-icon-color"] == "#123456"
    settings["use_custom_icon_color"] = "off"
    values = cli.build(cli.namespace_from_settings(settings, "/tmp/unused.yaml"))
    assert values["state-icon-color"] != "#123456"


def test_bundled_dynamic_theme_matches_engine() -> None:
    spec = importlib.util.spec_from_file_location(
        "regenerate_bundled_themes", ROOT / "scripts" / "regenerate_bundled_themes.py"
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    assert BUNDLED_THEME_PATH.read_text(encoding="utf-8") == module.dynamic_theme(module.load_cli())
