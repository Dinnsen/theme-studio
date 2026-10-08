"""Rebuild the bundled Theme Studio Standard theme after a change to the engine or the presets.

Run from the repository root:  python scripts/regenerate_bundled_themes.py
The tests in tests/test_theme_output.py fail when these files are out of date.
"""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = ROOT / "custom_components" / "theme_studio" / "templates"
CLI_PATH = TEMPLATES / "theme_studio" / "scripts" / "theme_studio_cli.py"
PRESET_DIR = TEMPLATES / "theme_studio" / "presets"
THEMES_DIR = TEMPLATES / "themes"

# "Theme Studio Standard" with light and dark mode.
STANDARD_SOURCE = "default.json"


def load_cli():
    spec = importlib.util.spec_from_file_location("theme_studio_cli", CLI_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> None:
    cli = load_cli()
    preset = json.loads((PRESET_DIR / STANDARD_SOURCE).read_text(encoding="utf-8"))
    modes = {
        variant: cli.build(cli.namespace_from_settings(preset[variant], "/tmp/unused.yaml"))
        for variant in ("light", "dark")
    }
    cli.write_theme_yaml("Theme Studio Standard", modes, str(THEMES_DIR / "theme_studio_standard.yaml"))
    print("Bundled theme rebuilt.")


if __name__ == "__main__":
    main()
