"""Basic HACS metadata tests for Theme Studio."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_hacs_json_exists() -> None:
    """hacs.json must exist in repository root."""
    assert (ROOT / "hacs.json").is_file()


def test_hacs_json_is_valid_json() -> None:
    """hacs.json must be valid JSON."""
    data = json.loads((ROOT / "hacs.json").read_text(encoding="utf-8"))
    assert isinstance(data, dict)


def test_hacs_json_required_fields() -> None:
    """hacs.json should contain the fields used for HACS display/compatibility."""
    data = json.loads((ROOT / "hacs.json").read_text(encoding="utf-8"))

    assert data.get("name") == "Theme Studio"
    assert "homeassistant" in data
    assert data.get("render_readme") is True

    if "country" in data:
        assert isinstance(data["country"], list)
