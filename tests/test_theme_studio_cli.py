"""Regression tests for the bundled Theme Studio CLI."""

from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CLI_PATH = (
    ROOT
    / "custom_components"
    / "theme_studio"
    / "templates"
    / "theme_studio"
    / "scripts"
    / "theme_studio_cli.py"
)
PACKAGE_PATH = (
    ROOT
    / "custom_components"
    / "theme_studio"
    / "templates"
    / "packages"
    / "theme_studio_dynamic.yaml"
)


def load_cli_module():
    spec = importlib.util.spec_from_file_location("theme_studio_cli", CLI_PATH)
    assert spec is not None
    assert spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_copy_preset_creates_user_theme_without_swapping_variants(tmp_path, monkeypatch, capsys) -> None:
    cli = load_cli_module()
    preset_dir = tmp_path / "presets"
    user_dir = tmp_path / "user_themes"
    preset_dir.mkdir()

    (preset_dir / "source.json").write_text(
        json.dumps(
            {
                "name": "Source",
                "slug": "source",
                "light": {"base_color": "#ffffff"},
                "dark": {"base_color": "#000000"},
            }
        ),
        encoding="utf-8",
    )

    monkeypatch.setattr(cli, "USER_THEME_DIR", str(user_dir))

    cli.cmd_copy_preset(
        argparse.Namespace(
            preset_dir=str(preset_dir),
            source="Source",
            name="My Copy",
        )
    )

    result = json.loads(capsys.readouterr().out)
    copied = json.loads((user_dir / "my_copy.json").read_text(encoding="utf-8"))

    assert result["ok"] is True
    assert copied["name"] == "My Copy"
    assert copied["light"]["base_color"] == "#ffffff"
    assert copied["dark"]["base_color"] == "#000000"


def test_copy_preset_does_not_overwrite_existing_user_theme(tmp_path, monkeypatch, capsys) -> None:
    cli = load_cli_module()
    preset_dir = tmp_path / "presets"
    user_dir = tmp_path / "user_themes"
    preset_dir.mkdir()
    user_dir.mkdir()

    (preset_dir / "source.json").write_text(
        json.dumps({"name": "Source", "light": {"base_color": "#111111"}}),
        encoding="utf-8",
    )
    existing = user_dir / "my_copy.json"
    existing.write_text(json.dumps({"name": "Existing"}), encoding="utf-8")

    monkeypatch.setattr(cli, "USER_THEME_DIR", str(user_dir))

    cli.cmd_copy_preset(
        argparse.Namespace(
            preset_dir=str(preset_dir),
            source="Source",
            name="My Copy",
        )
    )

    result = json.loads(capsys.readouterr().out)
    copied = json.loads(existing.read_text(encoding="utf-8"))

    assert result == {"ok": False, "reason": "target_exists", "name": "My Copy", "slug": "my_copy"}
    assert copied == {"name": "Existing"}


def test_package_keeps_stable_live_command_and_copy_flow() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")

    assert "live-json" not in package
    assert "theme_studio_cli.py live --base" in package
    assert "theme_studio_copy_preset_as_user_theme" in package
    assert "shell_command.theme_studio_copy_preset_as_user_theme" in package
    assert "Save as new handles loading the newly created user theme" in package
    assert "Save as new blocked" in package
    assert "name: theme_studio_selected_preset" in package
    assert "read-preset --preset-dir /config/theme_studio/presets --name '{{" not in package


def test_package_trims_variant_comparisons_before_branching() -> None:
    package = PACKAGE_PATH.read_text(encoding="utf-8")

    assert "current_variant == ''Light''" not in package
    assert "original_variant == ''Light''" not in package
    assert "active_variant == ''Light''" not in package
    assert "current_variant | trim == ''Light''" in package
    assert "original_variant | trim == ''Light''" in package
    assert "active_variant | trim == ''Light''" in package
