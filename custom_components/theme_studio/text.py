"""Text entities for the Theme Studio editor."""

from __future__ import annotations

from homeassistant.components.text import TextEntity, TextMode
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import ThemeStudioConfigEntry
from .entity import ThemeStudioHelperEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ThemeStudioConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up Theme Studio text entities."""
    async_add_entities(
        ThemeStudioText(entry, definition)
        for definition in entry.runtime_data.definitions
        if definition.platform == "text"
    )


class ThemeStudioText(ThemeStudioHelperEntity, TextEntity):
    """A colour, name, URL or font value in the editor."""

    _attr_mode = TextMode.TEXT
    _attr_native_min = 0

    def __init__(self, entry, definition) -> None:
        super().__init__(entry, definition)
        self._attr_native_max = int(definition.max)
        self._attr_native_value = str(definition.default or "")

    async def async_added_to_hass(self) -> None:
        """Restore or migrate the value."""
        await super().async_added_to_hass()
        state = await self.async_initial_state()
        if state is not None:
            self._attr_native_value = state.state[: self._attr_native_max]

    async def async_set_value(self, value: str) -> None:
        """Set a new value."""
        self._attr_native_value = value
        self.async_write_ha_state()
