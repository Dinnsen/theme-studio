"""Basic Home Assistant manifest tests for Theme Studio."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "custom_components" / "theme_studio" / "manifest.json"


def test_manifest_exists() -> None:
    """manifest.json must exist inside the integration folder."""
    assert MANIFEST.is_file()


def test_manifest_is_valid_json() -> None:
    """manifest.json must be valid JSON."""
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    assert isinstance(data, dict)


def test_manifest_required_fields() -> None:
    """Theme Studio manifest must include expected HACS/Home Assistant fields."""
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))

    assert data.get("domain") == "theme_studio"
    assert data.get("name") == "Theme Studio"
    assert data.get("config_flow") is True
    assert "version" in data
    assert "documentation" in data
    assert "issue_tracker" in data
    assert "codeowners" in data
    assert isinstance(data["codeowners"], list)
    assert "@Dinnsen" in data["codeowners"]


def test_manifest_links_are_not_placeholders() -> None:
    """Repository links should not use placeholder example values."""
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))

    assert "example" not in data.get("documentation", "")
    assert "example" not in data.get("issue_tracker", "")
