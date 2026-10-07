"""Number entities for the Theme Studio editor."""

from __future__ import annotations

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from . import ThemeStudioConfigEntry
from .entity import ThemeStudioHelperEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ThemeStudioConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up Theme Studio number entities."""
    async_add_entities(
        ThemeStudioNumber(entry, definition)
        for definition in entry.runtime_data.definitions
        if definition.platform == "number"
    )


class ThemeStudioNumber(ThemeStudioHelperEntity, NumberEntity):
    """A slider or box value in the editor."""

    def __init__(self, entry, definition) -> None:
        super().__init__(entry, definition)
        self._attr_native_min_value = float(definition.min)
        self._attr_native_max_value = float(definition.max)
        self._attr_native_step = float(definition.step)
        self._attr_mode = NumberMode.BOX if definition.mode == "box" else NumberMode.SLIDER
        self._attr_native_unit_of_measurement = definition.unit
        self._attr_native_value = float(definition.default)

    async def async_added_to_hass(self) -> None:
        """Restore or migrate the value."""
        await super().async_added_to_hass()
        state = await self.async_initial_state()
        if state is None:
            return
        try:
            value = float(state.state)
        except ValueError:
            return
        self._attr_native_value = min(
            max(value, self._attr_native_min_value), self._attr_native_max_value
        )

    async def async_set_native_value(self, value: float) -> None:
        """Set a new value."""
        self._attr_native_value = value
        self.async_write_ha_state()
