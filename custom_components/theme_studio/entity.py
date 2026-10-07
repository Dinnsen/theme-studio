"""Shared base class for Theme Studio editor entities."""

from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import State
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.restore_state import RestoreEntity

from .const import DOMAIN, TITLE
from .definitions import HelperDefinition


def device_info(entry: ConfigEntry) -> DeviceInfo:
    """Return the single Theme Studio service device."""
    return DeviceInfo(
        identifiers={(DOMAIN, entry.entry_id)},
        name=TITLE,
        manufacturer="Dinnsen",
        entry_type=DeviceEntryType.SERVICE,
    )


class ThemeStudioHelperEntity(RestoreEntity):
    """Editor entity that keeps the entity id of the former YAML helper."""

    _attr_should_poll = False
    _attr_has_entity_name = False

    def __init__(self, entry: ConfigEntry, definition: HelperDefinition) -> None:
        self.definition = definition
        self._attr_unique_id = definition.key
        self._attr_name = definition.name
        self._attr_icon = definition.icon
        self._attr_device_info = device_info(entry)
        self.entity_id = definition.entity_id

    async def async_initial_state(self) -> State | None:
        """Return the state to start from.

        Order: the entity's own restored state, then (first start after the
        v0.6.0 upgrade) the old YAML helper's current state. Helpers marked
        ``reset_on_start`` always start from their default, like the former
        ``initial:`` helpers.
        """
        if self.definition.reset_on_start:
            return None
        last = await self.async_get_last_state()
        if last is not None and last.state not in (STATE_UNKNOWN, STATE_UNAVAILABLE):
            return last
        legacy = self.hass.states.get(self.definition.legacy_entity_id)
        if legacy is not None and legacy.state not in (STATE_UNKNOWN, STATE_UNAVAILABLE):
            return legacy
        return None
