"""Regression tests for the generated themes."""

from __future__ import annotations

import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = ROOT / "custom_components" / "theme_studio" / "templates"
CLI_PATH = TEMPLATES / "theme_studio" / "scripts" / "theme_studio_cli.py"
PRESET_DIR = TEMPLATES / "theme_studio" / "presets"
BUNDLED_THEME_PATH = TEMPLATES / "themes" / "theme_studio_standard.yaml"

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
    assert text.startswith("Theme Studio Standard:\n")
    for prefix in REMOVED_PREFIXES:
        assert f"\n  {prefix}" not in text, prefix
    assert "  ha-color-primary-50:" in text


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


def test_every_built_in_preset_passes_contrast() -> None:
    """Built-in presets must be readable: text 4.5:1, icons and accent 3:1 (WCAG)."""
    cli = load_cli_module()
    failures = []
    for name, variant, values in build_preset_variants(cli):
        for pair in cli.contrast_report(values):
            if not pair["ok"]:
                failures.append(f"{name}/{variant}: {pair['key']} {pair['ratio']}:1 (needs {pair['minimum']}:1)")
    assert not failures, "\n".join(failures)
