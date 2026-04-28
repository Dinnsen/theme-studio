from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.typing import ConfigType

from .asset_manager import async_initialize_assets
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[str] = []


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up Theme Studio."""
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Theme Studio from a config entry."""
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = entry.data

    async def _handle_initialize_assets(call: ServiceCall) -> None:
        overwrite = bool(call.data.get("overwrite", True))
        backup = bool(call.data.get("backup", True))

        result = await async_initialize_assets(
            hass,
            overwrite=overwrite,
            backup=backup,
        )

        _LOGGER.info(
            "Theme Studio assets processed: copied=%s updated=%s skipped=%s errors=%s",
            len(result.get("copied_files", [])),
            len(result.get("updated_files", [])),
            len(result.get("skipped_files", [])),
            len(result.get("errors", [])),
        )

    async def _handle_reinstall_assets(call: ServiceCall) -> None:
        result = await async_initialize_assets(
            hass,
            overwrite=True,
            backup=True,
        )

        _LOGGER.info(
            "Theme Studio assets reinstalled: copied=%s updated=%s skipped=%s errors=%s",
            len(result.get("copied_files", [])),
            len(result.get("updated_files", [])),
            len(result.get("skipped_files", [])),
            len(result.get("errors", [])),
        )

    if not hass.services.has_service(DOMAIN, "initialize_assets"):
        hass.services.async_register(
            DOMAIN,
            "initialize_assets",
            _handle_initialize_assets,
        )

    if not hass.services.has_service(DOMAIN, "reinstall_assets"):
        hass.services.async_register(
            DOMAIN,
            "reinstall_assets",
            _handle_reinstall_assets,
        )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload Theme Studio."""
    hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)

    if not hass.data.get(DOMAIN):
        for service in ("initialize_assets", "reinstall_assets"):
            if hass.services.has_service(DOMAIN, service):
                hass.services.async_remove(DOMAIN, service)

    return True
