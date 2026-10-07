"""Select entities for the Theme Studio editor."""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv, entity_platform
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
import voluptuous as vol

from . import ThemeStudioConfigEntry
from .const import DOMAIN, SERVICE_SET_OPTIONS
from .entity import ThemeStudioHelperEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ThemeStudioConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up Theme Studio select entities."""
    async_add_entities(
        ThemeStudioSelect(entry, definition)
        for definition in entry.runtime_data.definitions
        if definition.platform == "select"
    )

    platform = entity_platform.async_get_current_platform()
    platform.async_register_entity_service(
        SERVICE_SET_OPTIONS,
        {vol.Required("options"): vol.All(cv.ensure_list, [cv.string], vol.Length(min=1))},
        "async_set_options",
    )


class ThemeStudioSelect(ThemeStudioHelperEntity, SelectEntity):
    """A list choice in the editor (presets, user themes, styles)."""

    def __init__(self, entry, definition) -> None:
        super().__init__(entry, definition)
        self._attr_options = list(definition.options)
        self._attr_current_option = str(definition.default)

    async def async_added_to_hass(self) -> None:
        """Restore or migrate options and choice.

        Dynamic option lists (user themes, background images) are restored
        too, so a selection survives a restart.
        """
        await super().async_added_to_hass()
        state = await self.async_initial_state()
        if state is None:
            return
        options = state.attributes.get("options")
        if isinstance(options, list) and options:
            merged = list(dict.fromkeys([*self._attr_options, *map(str, options)]))
            self._attr_options = merged
        if state.state in self._attr_options:
            self._attr_current_option = state.state

    async def async_select_option(self, option: str) -> None:
        """Select an option."""
        if option not in self._attr_options:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="invalid_option",
                translation_placeholders={"option": option, "entity_id": self.entity_id},
            )
        self._attr_current_option = option
        self.async_write_ha_state()

    async def async_set_options(self, options: list[str]) -> None:
        """Replace the option list (like input_select.set_options)."""
        unique = list(dict.fromkeys(str(option) for option in options))
        self._attr_options = unique
        if self._attr_current_option not in unique:
            self._attr_current_option = unique[0]
        self.async_write_ha_state()
