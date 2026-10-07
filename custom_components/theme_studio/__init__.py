"""Theme Studio integration for Home Assistant."""

from __future__ import annotations

from dataclasses import dataclass
import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv

from .asset_manager import async_initialize_assets, remove_assets
from .const import DOMAIN, PLATFORMS
from .definitions import HelperDefinition, load_definitions
from .engine import ThemeEngine
from .services import async_setup_services

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


@dataclass
class ThemeStudioData:
    """Runtime data for a Theme Studio config entry."""

    engine: ThemeEngine
    definitions: list[HelperDefinition]
    last_asset_install: dict[str, Any]


type ThemeStudioConfigEntry = ConfigEntry[ThemeStudioData]


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Register Theme Studio services."""
    async_setup_services(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ThemeStudioConfigEntry) -> bool:
    """Set up Theme Studio from a config entry."""
    entry.async_on_unload(entry.add_update_listener(_async_update_listener))

    options = {**entry.data, **entry.options}
    try:
        install = await async_initialize_assets(
            hass,
            overwrite=bool(options.get("overwrite", True)),
            backup=bool(options.get("backup", True)),
        )
    except Exception:  # noqa: BLE001 - keep setup resilient and log the traceback.
        _LOGGER.exception("Theme Studio automatic asset installation failed")
        return False

    if not install.get("success", False):
        _LOGGER.warning("Theme Studio asset installation completed with errors: %s", install)

    definitions = await hass.async_add_executor_job(load_definitions)
    engine = await hass.async_add_executor_job(ThemeEngine.create, hass.config.path())
    entry.runtime_data = ThemeStudioData(engine, definitions, install)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def _async_update_listener(hass: HomeAssistant, entry: ThemeStudioConfigEntry) -> None:
    """Reload Theme Studio when its options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ThemeStudioConfigEntry) -> bool:
    """Unload Theme Studio."""
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Remove the files Theme Studio installed when the integration is deleted.

    User themes, built themes and background images are kept. The package
    stays loaded until the next restart.
    """
    result = await hass.async_add_executor_job(remove_assets, hass)
    _LOGGER.info("Theme Studio removed its managed files: %s", result)
    if hass.services.has_service("frontend", "reload_themes"):
        await hass.services.async_call("frontend", "reload_themes", blocking=True)
