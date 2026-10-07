"""Catalog sensors for Theme Studio.

These replace the former ``command_line`` sensors, which ran python3 in a
subprocess every hour. The entity ids are new (``*_catalog`` / ``active_preset``)
so they cannot collide with the old command_line sensors during the upgrade.
"""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.helpers.event import async_track_state_change_event

from . import ThemeStudioConfigEntry
from .const import (
    CONTRAST_LABELS,
    SELECT_PRESETS,
    SELECT_USER_THEMES,
    SIGNAL_CATALOGS_CHANGED,
    SIGNAL_CONTRAST_UPDATED,
)
from .engine import ThemeEngine
from .entity import device_info

SCAN_INTERVAL = timedelta(hours=1)
PARALLEL_UPDATES = 1

EMPTY = {"", "None", STATE_UNKNOWN, STATE_UNAVAILABLE}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ThemeStudioConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up Theme Studio catalog sensors."""
    engine = entry.runtime_data.engine
    async_add_entities(
        [
            PresetCatalogSensor(entry, engine),
            UserThemeCatalogSensor(entry, engine),
            BackgroundImageCatalogSensor(entry, engine),
            ActivePresetSensor(entry, engine),
            ContrastSensor(entry),
        ],
        update_before_add=True,
    )


class ThemeStudioCatalogSensor(SensorEntity):
    """Base class: state is a count, options live in attributes."""

    _attr_has_entity_name = True
    _key: str
    _name: str
    _icon: str

    def __init__(self, entry: ConfigEntry, engine: ThemeEngine) -> None:
        self._engine = engine
        self._attr_unique_id = self._key
        self._attr_name = self._name
        self._attr_icon = self._icon
        self._attr_device_info = device_info(entry)
        self.entity_id = f"sensor.{self._key}"
        self._attr_extra_state_attributes: dict[str, Any] = {}

    async def async_added_to_hass(self) -> None:
        """Refresh when a service changed files on disk."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_CATALOGS_CHANGED, self._async_schedule_refresh
            )
        )

    @callback
    def _async_schedule_refresh(self) -> None:
        self.async_schedule_update_ha_state(force_refresh=True)

    def _read(self) -> dict[str, Any]:
        raise NotImplementedError

    async def async_update(self) -> None:
        """Read the catalog from disk."""
        data = await self.hass.async_add_executor_job(self._read)
        self._attr_native_value = int(data.get("count", len(data.get("options", []))))
        self._attr_extra_state_attributes = {
            key: value for key, value in data.items() if key != "count"
        }


class PresetCatalogSensor(ThemeStudioCatalogSensor):
    """Built-in presets."""

    _key = "theme_studio_preset_catalog"
    _name = "Preset catalog"
    _icon = "mdi:palette-swatch-outline"

    def _read(self) -> dict[str, Any]:
        return self._engine.preset_catalog()


class UserThemeCatalogSensor(ThemeStudioCatalogSensor):
    """User themes in /config/theme_studio/user_themes."""

    _key = "theme_studio_user_theme_catalog"
    _name = "User theme catalog"
    _icon = "mdi:palette-swatch-variant"

    def _read(self) -> dict[str, Any]:
        return self._engine.user_theme_catalog()


class BackgroundImageCatalogSensor(ThemeStudioCatalogSensor):
    """Images in /config/www/background."""

    _key = "theme_studio_background_image_catalog"
    _name = "Background image catalog"
    _icon = "mdi:image-multiple-outline"

    def _read(self) -> dict[str, Any]:
        return self._engine.background_image_catalog()


class ActivePresetSensor(SensorEntity):
    """The preset or user theme currently selected in the studio."""

    _attr_has_entity_name = True
    _attr_icon = "mdi:palette"
    # The full preset JSON is large; keep it out of the recorder.
    _unrecorded_attributes = frozenset({"slug", "theme", "light", "dark"})

    def __init__(self, entry: ConfigEntry, engine: ThemeEngine) -> None:
        self._engine = engine
        self._attr_unique_id = "theme_studio_active_preset"
        self._attr_name = "Active preset"
        self._attr_device_info = device_info(entry)
        self.entity_id = "sensor.theme_studio_active_preset"
        self._attr_native_value = "none"
        self._attr_extra_state_attributes: dict[str, Any] = {}

    async def async_added_to_hass(self) -> None:
        """Follow the preset and user theme selects."""
        self.async_on_remove(
            async_track_state_change_event(
                self.hass, [SELECT_PRESETS, SELECT_USER_THEMES], self._async_selection_changed
            )
        )
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass, SIGNAL_CATALOGS_CHANGED, self._async_schedule_refresh
            )
        )

    @callback
    def _async_selection_changed(self, event: Event[EventStateChangedData]) -> None:
        self.async_schedule_update_ha_state(force_refresh=True)

    @callback
    def _async_schedule_refresh(self) -> None:
        self.async_schedule_update_ha_state(force_refresh=True)

    def _selected_name(self) -> str:
        for entity_id in (SELECT_USER_THEMES, SELECT_PRESETS):
            state = self.hass.states.get(entity_id)
            if state is not None and state.state not in EMPTY:
                return state.state
        return "Default"

    async def async_update(self) -> None:
        """Load the selected preset."""
        name = self._selected_name()
        data = await self.hass.async_add_executor_job(self._engine.read_preset, name)
        self._attr_native_value = data.get("name") or "none"
        self._attr_extra_state_attributes = {
            key: data[key] for key in ("name", "slug", "theme", "light", "dark") if key in data
        }


class ContrastSensor(SensorEntity):
    """Contrast of the live theme: the number of text/icon pairs below WCAG.

    State is the number of failing pairs (0 is good). Attributes hold every
    pair with its ratio, so the studio can show the numbers next to the
    colours.
    """

    _attr_has_entity_name = True
    _attr_icon = "mdi:contrast-circle"
    _attr_should_poll = False
    # The pair list changes with every slider move; keep it out of the recorder.
    _unrecorded_attributes = frozenset({"pairs", "failing"})

    def __init__(self, entry: ThemeStudioConfigEntry) -> None:
        self._entry = entry
        self._attr_unique_id = "theme_studio_contrast"
        self._attr_name = "Contrast warnings"
        self._attr_device_info = device_info(entry)
        self.entity_id = "sensor.theme_studio_contrast"

    async def async_added_to_hass(self) -> None:
        """Follow every live theme generation."""
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_CONTRAST_UPDATED, self._async_updated)
        )

    @callback
    def _async_updated(self) -> None:
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return bool(self._entry.runtime_data.contrast)

    @property
    def native_value(self) -> int | None:
        report = self._entry.runtime_data.contrast
        if not report:
            return None
        return sum(1 for pair in report if not pair["ok"])

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        report = self._entry.runtime_data.contrast
        return {
            "pairs": [
                {
                    "key": pair["key"],
                    "label": CONTRAST_LABELS.get(pair["key"], pair["key"]),
                    "ratio": pair["ratio"],
                    "minimum": pair["minimum"],
                    "ok": pair["ok"],
                }
                for pair in report
            ],
            "failing": [
                CONTRAST_LABELS.get(pair["key"], pair["key"]) for pair in report if not pair["ok"]
            ],
        }
