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
    "ha-card-backdrop-filter",
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


def test_every_called_shell_command_is_defined() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")
    block = package.split("\nshell_command:\n", 1)[1].split("\ntemplate:\n", 1)[0]
    defined = set(re.findall(r"^  ([a-z0-9_]+):", block, re.M))
    called = set(re.findall(r"shell_command\.([a-z0-9_]+)", package))
    assert called <= defined, f"Undefined shell_commands: {sorted(called - defined)}"


def test_delete_flow_passes_explicit_theme_name() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")
    assert '--name "{{ name }}"' in package
    assert 'name: "{{ delete_name | trim }}"' in package


def test_managed_preset_index_is_never_rewritten() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")
    assert "presets/index.json" not in package


def test_default_theme_is_only_set_when_enabled() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")
    assert "theme_studio_set_as_default_theme:" in package
    assert package.count("frontend.set_theme") == package.count(
        "entity_id: input_boolean.theme_studio_set_as_default_theme"
    )


def test_dashboard_views_use_dynamic_theme_and_no_legacy_vars() -> None:
    dashboard = DASHBOARD_PATH.read_text(encoding="utf-8")
    views = dashboard.split("\nviews:", 1)[1]
    view_starts = re.findall(r"^  - (?:title|type): ", views, re.M)
    assert views.count("    theme: Theme Studio Dynamic") == len(view_starts)
    for legacy in ("--d1nnsen-", "--my-", "ha-textfield", "--bubble-slider-main-background-color"):
        assert legacy not in dashboard, legacy
