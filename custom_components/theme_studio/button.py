"""Button entities for the Theme Studio editor.

Pressing a button only updates its state; the package automations trigger on
that state change, exactly as they did with the former input_button helpers.
"""

from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import ThemeStudioConfigEntry
from .definitions import HelperDefinition
from .entity import device_info


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ThemeStudioConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up Theme Studio button entities."""
    async_add_entities(
        ThemeStudioButton(entry, definition)
        for definition in entry.runtime_data.definitions
        if definition.platform == "button"
    )


class ThemeStudioButton(ButtonEntity):
    """An action button in the editor."""

    _attr_has_entity_name = False

    def __init__(self, entry: ConfigEntry, definition: HelperDefinition) -> None:
        self._attr_unique_id = definition.key
        self._attr_name = definition.name
        self._attr_icon = definition.icon
        self._attr_device_info = device_info(entry)
        self.entity_id = definition.entity_id

    async def async_press(self) -> None:
        """Nothing to do here; automations react to the state change."""
