"""Switch entities for the Theme Studio editor."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.const import STATE_ON
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import ThemeStudioConfigEntry
from .entity import ThemeStudioHelperEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ThemeStudioConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up Theme Studio switch entities."""
    async_add_entities(
        ThemeStudioSwitch(entry, definition)
        for definition in entry.runtime_data.definitions
        if definition.platform == "switch"
    )


class ThemeStudioSwitch(ThemeStudioHelperEntity, SwitchEntity):
    """An on/off option in the editor."""

    def __init__(self, entry, definition) -> None:
        super().__init__(entry, definition)
        self._attr_is_on = bool(definition.default)

    async def async_added_to_hass(self) -> None:
        """Restore or migrate the value."""
        await super().async_added_to_hass()
        state = await self.async_initial_state()
        if state is not None:
            self._attr_is_on = state.state == STATE_ON

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the option on."""
        self._attr_is_on = True
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the option off."""
        self._attr_is_on = False
        self.async_write_ha_state()
