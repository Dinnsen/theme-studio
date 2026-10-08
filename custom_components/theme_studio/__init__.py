"""Theme Studio integration for Home Assistant."""

from __future__ import annotations

from dataclasses import dataclass, field
import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import config_validation as cv, entity_registry as er
from homeassistant.helpers.start import async_at_started

from .asset_manager import async_initialize_assets, remove_assets
from .const import CONF_LOAD_FONTS, CONF_REGISTER_THEMES, DOMAIN, PLATFORMS
from .definitions import HelperDefinition, load_definitions
from .engine import ThemeEngine
from .history import EditorHistory
from .migration import find_orphaned_legacy_entities, find_retired_entities
from .fonts import LOADER_FILE
from .fonts_view import async_add_loader, async_register_fonts_view, async_remove_loader
from .panel import async_bundle_tag, async_register_panel, async_register_static, async_unregister_panel
from .services import async_generate, async_setup_services
from .theme_registry import DATA_REGISTRY, ThemeRegistry
from .upload import async_register_upload
from .websocket import async_register_commands

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


@dataclass
class ThemeStudioData:
    """Runtime data for a Theme Studio config entry."""

    engine: ThemeEngine
    definitions: list[HelperDefinition]
    last_asset_install: dict[str, Any]
    contrast: list[dict[str, Any]] = field(default_factory=list)
    history: EditorHistory = field(default_factory=EditorHistory)


type ThemeStudioConfigEntry = ConfigEntry[ThemeStudioData]


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Register Theme Studio services and the panel's WebSocket commands."""
    async_setup_services(hass)
    async_register_commands(hass)
    async_register_upload(hass)
    async_register_fonts_view(hass)
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

    await async_register_static(hass)
    if await async_register_panel(hass, options):
        entry.async_on_unload(lambda: async_unregister_panel(hass))

    if options.get(CONF_LOAD_FONTS, True):
        loader = async_add_loader(hass, f"{engine.version}-{await async_bundle_tag(hass, LOADER_FILE)}")
        entry.async_on_unload(lambda: async_remove_loader(hass, loader))

    if options.get(CONF_REGISTER_THEMES, True):
        registry = ThemeRegistry(hass, engine.config_dir)
        if await registry.async_start():
            hass.data[DATA_REGISTRY] = registry

            def _stop_registry() -> None:
                registry.async_stop()
                hass.data.pop(DATA_REGISTRY, None)

            entry.async_on_unload(_stop_registry)

    @callback
    def _async_remove_legacy_helpers(hass: HomeAssistant) -> None:
        """Remove the pre-0.6.0 input_* helpers once they are no longer loaded."""
        registry = er.async_get(hass)
        orphaned = find_orphaned_legacy_entities(
            definitions, registry.async_get, hass.states.get
        )
        retired = find_retired_entities(
            er.async_entries_for_config_entry(registry, entry.entry_id), DOMAIN
        )
        for entity_id in [*orphaned, *retired]:
            registry.async_remove(entity_id)
        if orphaned or retired:
            _LOGGER.info(
                "Theme Studio removed %s old YAML helpers and %s retired entities",
                len(orphaned),
                len(retired),
            )

    # Runs after start-up, when Home Assistant has marked helpers that are no
    # longer defined in YAML as restored placeholders.
    entry.async_on_unload(async_at_started(hass, _async_remove_legacy_helpers))

    async def _async_initial_generate(hass: HomeAssistant) -> None:
        """Fill the contrast sensor once the editor entities are restored."""
        try:
            await async_generate(hass)
        except (HomeAssistantError, OSError, ValueError) as err:
            _LOGGER.warning("Theme Studio could not build the live theme at start-up: %s", err)
        try:
            written = await hass.async_add_executor_job(entry.runtime_data.engine.write_previews)
        except (OSError, ValueError) as err:
            _LOGGER.warning("Theme Studio could not write preset previews: %s", err)
        else:
            _LOGGER.debug("Theme Studio preset previews written: %s", len(written))

    entry.async_on_unload(async_at_started(hass, _async_initial_generate))
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
