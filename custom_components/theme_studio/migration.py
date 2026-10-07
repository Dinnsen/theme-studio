"""Clean-up of the YAML helpers Theme Studio used before v0.6.0."""

from __future__ import annotations

from collections.abc import Callable, Iterable
from typing import Any, Protocol

from .definitions import HelperDefinition

ATTR_RESTORED = "restored"


class _RegistryEntry(Protocol):
    platform: str
    unique_id: str
    entity_id: str


def find_orphaned_legacy_entities(
    definitions: Iterable[HelperDefinition],
    get_registry_entry: Callable[[str], _RegistryEntry | None],
    get_state: Callable[[str], Any],
) -> list[str]:
    """Return old input_* helpers that are registered but no longer loaded.

    A helper counts as orphaned when its registry entry still belongs to the
    old helper integration (same platform and unique id) and Home Assistant
    only shows a restored placeholder for it. A helper that is still defined
    in YAML has a live state and is left alone, so the values can be migrated
    on the first restart after the upgrade.
    """
    orphaned: list[str] = []
    for definition in definitions:
        entity_id = definition.legacy_entity_id
        entry = get_registry_entry(entity_id)
        if entry is None:
            continue
        if entry.platform != definition.legacy_domain or entry.unique_id != definition.key:
            continue
        state = get_state(entity_id)
        if state is None or state.attributes.get(ATTR_RESTORED):
            orphaned.append(entity_id)
    return orphaned


# Per-variant mirror entities (theme_studio_light_* / theme_studio_dark_*) were
# only used by the YAML save flow and are gone since v0.9.0.
RETIRED_PREFIXES = ("theme_studio_light_", "theme_studio_dark_")


def find_retired_entities(entries: Iterable[_RegistryEntry], domain: str) -> list[str]:
    """Registry entries of this integration whose entity no longer exists."""
    return [
        entry.entity_id
        for entry in entries
        if entry.platform == domain and str(entry.unique_id).startswith(RETIRED_PREFIXES)
    ]
