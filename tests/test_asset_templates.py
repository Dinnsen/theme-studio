"""Template and bundled asset tests for Theme Studio."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INTEGRATION = ROOT / "custom_components" / "theme_studio"
TEMPLATES = INTEGRATION / "templates"

REQUIRED_TEMPLATE_DIRS = [
    TEMPLATES,
    TEMPLATES / "packages",
    TEMPLATES / "lovelace",
    TEMPLATES / "themes",
    TEMPLATES / "theme_studio",
    TEMPLATES / "theme_studio" / "presets",
    TEMPLATES / "theme_studio" / "scripts",
    TEMPLATES / "theme_studio" / "user_themes",
]

REQUIRED_TEMPLATE_FILES = [
    TEMPLATES / "packages" / "theme_studio_dynamic.yaml",
    TEMPLATES / "lovelace" / "theme_studio_dashboard.yaml",
    TEMPLATES / "themes" / "theme_studio_dynamic.yaml",
    TEMPLATES / "theme_studio" / "scripts" / "theme_studio_cli.py",
    TEMPLATES / "theme_studio" / "user_themes" / ".gitkeep",
]

EXPECTED_PRESETS = [
    "default.json",
    "glass.json",
    "md3.json",
    "dark_blue.json",
    "flavors.json",
    "vision.json",
    "dark_green.json",
    "purple.json",
    "pink_mono.json",
    "black_white.json",
    "aurora.json",
]


def test_required_template_directories_exist() -> None:
    """All template directories used by asset_manager.py must exist."""
    for directory in REQUIRED_TEMPLATE_DIRS:
        assert directory.is_dir(), f"Missing template directory: {directory}"


def test_required_template_files_exist() -> None:
    """Important bundled files must exist."""
    for file_path in REQUIRED_TEMPLATE_FILES:
        assert file_path.is_file(), f"Missing template file: {file_path}"


def test_user_themes_placeholder_exists() -> None:
    """Git must track the otherwise-empty user_themes template directory."""
    assert (TEMPLATES / "theme_studio" / "user_themes" / ".gitkeep").is_file()


def test_expected_preset_files_exist_and_are_valid_json() -> None:
    """All bundled preset JSON files should exist and parse as JSON."""
    preset_dir = TEMPLATES / "theme_studio" / "presets"

    for filename in EXPECTED_PRESETS:
        file_path = preset_dir / filename
        assert file_path.is_file(), f"Missing preset: {filename}"
        data = json.loads(file_path.read_text(encoding="utf-8"))
        assert isinstance(data, dict), f"Preset must be a JSON object: {filename}"


def test_no_user_theme_json_files_are_bundled() -> None:
    """Runtime user theme JSON files should not be shipped inside the integration."""
    user_theme_dir = TEMPLATES / "theme_studio" / "user_themes"
    json_files = list(user_theme_dir.glob("*.json"))
    assert not json_files, f"Do not bundle user theme files: {json_files}"
