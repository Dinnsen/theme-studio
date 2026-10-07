"""Helper definitions for the Theme Studio editor entities.

The editor state used to live in 276 YAML helpers (input_number, input_text,
input_boolean, input_select, input_button) inside the package. Since v0.6.0
the integration owns these as its own entities; ``helpers.json`` describes
them. ``legacy_domain`` is the old helper domain, used once to migrate the
current value of an existing installation.
"""

from __future__ import annotations

from dataclasses import dataclass, field
import json
from pathlib import Path
from typing import Any

HELPERS_FILE = Path(__file__).with_name("helpers.json")


@dataclass(frozen=True, slots=True)
class HelperDefinition:
    """One editor entity."""

    platform: str
    key: str
    legacy_domain: str
    name: str
    icon: str | None = None
    reset_on_start: bool = False
    default: Any = None
    min: float | None = None
    max: float | None = None
    step: float | None = None
    mode: str | None = None
    unit: str | None = None
    options: tuple[str, ...] = field(default_factory=tuple)

    @property
    def entity_id(self) -> str:
        """Return the entity id this helper is exposed as."""
        return f"{self.platform}.{self.key}"

    @property
    def legacy_entity_id(self) -> str:
        """Return the entity id the YAML helper had before v0.6.0."""
        return f"{self.legacy_domain}.{self.key}"


def load_definitions() -> list[HelperDefinition]:
    """Load helper definitions (blocking; run in the executor)."""
    raw = json.loads(HELPERS_FILE.read_text(encoding="utf-8"))
    definitions: list[HelperDefinition] = []
    for item in raw["helpers"]:
        data = dict(item)
        data["options"] = tuple(data.get("options", ()))
        definitions.append(HelperDefinition(**data))
    return definitions
