"""Theme Studio integration for Home Assistant."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, SupportsResponse
from homeassistant.helpers import config_validation as cv
import voluptuous as vol

from .asset_manager import async_initialize_assets
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

SERVICE_INITIALIZE_ASSETS = "initialize_assets"
SERVICE_REINSTALL_ASSETS = "reinstall_assets"

SERVICE_SCHEMA = vol.Schema(
    {
        vol.Optional("overwrite", default=True): cv.boolean,
        vol.Optional("backup", default=True): cv.boolean,
    }
)


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up Theme Studio services."""

    async def _handle_initialize_assets(call: ServiceCall) -> dict[str, Any]:
        """Install/update bundled Theme Studio assets."""
        overwrite = bool(call.data.get("overwrite", True))
        backup = bool(call.data.get("backup", True))
        return await async_initialize_assets(hass, overwrite=overwrite, backup=backup)

    async def _handle_reinstall_assets(call: ServiceCall) -> dict[str, Any]:
        """Force reinstall bundled Theme Studio assets."""
        backup = bool(call.data.get("backup", True))
        return await async_initialize_assets(hass, overwrite=True, backup=backup)

    hass.services.async_register(
        DOMAIN,
        SERVICE_INITIALIZE_ASSETS,
        _handle_initialize_assets,
        schema=SERVICE_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )

    hass.services.async_register(
        DOMAIN,
        SERVICE_REINSTALL_ASSETS,
        _handle_reinstall_assets,
        schema=vol.Schema({vol.Optional("backup", default=True): cv.boolean}),
        supports_response=SupportsResponse.ONLY,
    )

    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Theme Studio from a config entry and install assets automatically."""
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = dict(entry.data)

    overwrite = bool(entry.data.get("overwrite", True))
    backup = bool(entry.data.get("backup", True))

    try:
        result = await async_initialize_assets(hass, overwrite=overwrite, backup=backup)
        hass.data[DOMAIN][entry.entry_id]["last_asset_install"] = result

        if not result.get("success", False):
            _LOGGER.warning("Theme Studio asset installation completed with errors: %s", result)
        else:
            _LOGGER.info("Theme Studio assets installed during setup: %s", result)

    except Exception:  # noqa: BLE001 - keep integration setup resilient and log full traceback.
        _LOGGER.exception("Theme Studio automatic asset installation failed")
        return False

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload Theme Studio config entry."""
    hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    return True
