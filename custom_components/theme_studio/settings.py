"""The per-variant theme settings the panel can edit.

``settings.json`` lists every setting a theme stores for its Light and Dark
variant, with the control the editor shows for it and its limits. Until
v1.0.0 these were helper entities of the YAML dashboard (``helpers.json``).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from functools import cache
import json
from pathlib import Path
from typing import Any

SETTINGS_FILE = Path(__file__).with_name("settings.json")


@dataclass(frozen=True, slots=True)
class SettingDefinition:
    """One theme setting."""

    key: str
    control: str
    label: str
    default: Any = None
    min: float | None = None
    max: float | None = None
    step: float | None = None
    options: tuple[str, ...] = field(default_factory=tuple)


@cache
def load_settings() -> tuple[SettingDefinition, ...]:
    """Load the setting definitions (blocking the first time; cached)."""
    raw = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
    return tuple(
        SettingDefinition(**{**item, "options": tuple(item.get("options", ()))})
        for item in raw["settings"]
    )
