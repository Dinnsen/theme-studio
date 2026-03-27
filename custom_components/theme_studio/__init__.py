from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.typing import ConfigType

from .asset_manager import install_assets
from .const import (
    CONF_LOVELACE_PATH,
    CONF_PACKAGES_PATH,
    CONF_THEMES_PATH,
    CONF_WORKDIR_PATH,
    DEFAULT_LOVELACE_PATH,
    DEFAULT_PACKAGES_PATH,
    DEFAULT_THEMES_PATH,
    DEFAULT_WORKDIR_PATH,
    DOMAIN,
)

_LOGGER = logging.getLogger(__name__)
PLATFORMS: list[str] = []


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = entry.data
    template_root = Path(__file__).parent / 'templates'

    async def _handle_install(call: ServiceCall) -> None:
        overwrite = bool(call.data.get('overwrite', False))
        data = entry.data
        result = await hass.async_add_executor_job(
            install_assets,
            template_root,
            Path(hass.config.path()),
            data.get(CONF_PACKAGES_PATH, DEFAULT_PACKAGES_PATH),
            data.get(CONF_LOVELACE_PATH, DEFAULT_LOVELACE_PATH),
            data.get(CONF_WORKDIR_PATH, DEFAULT_WORKDIR_PATH),
            data.get(CONF_THEMES_PATH, DEFAULT_THEMES_PATH),
            overwrite,
        )
        _LOGGER.info('Theme Studio assets processed: changed=%s skipped=%s', len(result['changed']), len(result['skipped']))

    if not hass.services.has_service(DOMAIN, 'initialize_assets'):
        hass.services.async_register(DOMAIN, 'initialize_assets', _handle_install)
    if not hass.services.has_service(DOMAIN, 'reinstall_assets'):
        hass.services.async_register(DOMAIN, 'reinstall_assets', _handle_install)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
    if not hass.data.get(DOMAIN):
        for service in ('initialize_assets', 'reinstall_assets'):
            if hass.services.has_service(DOMAIN, service):
                hass.services.async_remove(DOMAIN, service)
    return True
