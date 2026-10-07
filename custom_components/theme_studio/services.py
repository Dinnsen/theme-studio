"""Theme Studio services (replace the former shell_command entries)."""

from __future__ import annotations

import ast
import json
from typing import Any

from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_send
import voluptuous as vol

from .asset_manager import async_initialize_assets
from .const import (
    DOMAIN,
    LIVE_ARGUMENT_ENTITIES,
    SERVICE_BUILD_THEME,
    SERVICE_COPY_PRESET,
    SERVICE_DELETE_USER_THEME,
    SERVICE_GENERATE,
    SERVICE_INITIALIZE_ASSETS,
    SERVICE_REFRESH_CATALOGS,
    SERVICE_REINSTALL_ASSETS,
    SERVICE_SAVE_PRESET,
    SIGNAL_CATALOGS_CHANGED,
)
from .engine import ThemeEngine

NAME_SCHEMA = vol.Schema({vol.Required("name"): cv.string})


def _engine(hass: HomeAssistant) -> ThemeEngine:
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="not_loaded"
        )
    return entries[0].runtime_data.engine


def _state(hass: HomeAssistant, entity_id: str) -> str:
    state = hass.states.get(entity_id)
    if state is None or state.state in (STATE_UNKNOWN, STATE_UNAVAILABLE):
        return ""
    return state.state


def _parse_payload(value: Any) -> dict[str, Any]:
    """Accept a dict, JSON text or the Python repr a template renders to."""
    if isinstance(value, dict):
        return value
    text = str(value).strip()
    for parser in (json.loads, ast.literal_eval):
        try:
            parsed = parser(text)
        except (ValueError, SyntaxError):
            continue
        if isinstance(parsed, dict):
            return parsed
    raise ServiceValidationError(
        translation_domain=DOMAIN, translation_key="invalid_payload"
    )


async def _reload_themes(hass: HomeAssistant) -> None:
    await hass.services.async_call("frontend", "reload_themes", blocking=True)


def async_setup_services(hass: HomeAssistant) -> None:
    """Register Theme Studio services."""

    async def initialize_assets(call: ServiceCall) -> ServiceResponse:
        return await async_initialize_assets(
            hass,
            overwrite=bool(call.data.get("overwrite", True)),
            backup=bool(call.data.get("backup", True)),
        )

    async def reinstall_assets(call: ServiceCall) -> ServiceResponse:
        return await async_initialize_assets(
            hass, overwrite=True, backup=bool(call.data.get("backup", True))
        )

    async def generate(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        arguments = {
            argument: _state(hass, entity_id)
            for argument, entity_id in LIVE_ARGUMENT_ENTITIES.items()
        }
        result = await hass.async_add_executor_job(engine.generate_live, arguments)
        # Only push a theme reload to every connected screen when it changed.
        if result.get("changed"):
            await _reload_themes(hass)
        return result

    async def save_preset(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        payload = _parse_payload(call.data["payload"])
        result = await hass.async_add_executor_job(engine.save_preset, payload)
        await hass.async_add_executor_job(engine.write_user_theme_index)
        async_dispatcher_send(hass, SIGNAL_CATALOGS_CHANGED)
        return result

    async def copy_preset(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        result = await hass.async_add_executor_job(
            engine.copy_preset, call.data["source"], call.data["name"]
        )
        await hass.async_add_executor_job(engine.write_user_theme_index)
        async_dispatcher_send(hass, SIGNAL_CATALOGS_CHANGED)
        return result

    async def delete_user_theme(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        result = await hass.async_add_executor_job(
            engine.delete_user_theme, call.data["name"]
        )
        await hass.async_add_executor_job(engine.write_user_theme_index)
        async_dispatcher_send(hass, SIGNAL_CATALOGS_CHANGED)
        await _reload_themes(hass)
        return result

    async def build_theme(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        try:
            result = await hass.async_add_executor_job(engine.build_theme, call.data["name"])
        except SystemExit as err:  # the CLI exits when a preset is missing
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="preset_not_found",
                translation_placeholders={"name": call.data["name"], "error": str(err)},
            ) from err
        await _reload_themes(hass)
        return result

    async def refresh_catalogs(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        result = await hass.async_add_executor_job(engine.write_user_theme_index)
        async_dispatcher_send(hass, SIGNAL_CATALOGS_CHANGED)
        return result

    asset_schema = vol.Schema(
        {
            vol.Optional("overwrite", default=True): cv.boolean,
            vol.Optional("backup", default=True): cv.boolean,
        }
    )
    registrations: list[tuple[str, Any, vol.Schema, SupportsResponse]] = [
        (SERVICE_INITIALIZE_ASSETS, initialize_assets, asset_schema, SupportsResponse.ONLY),
        (
            SERVICE_REINSTALL_ASSETS,
            reinstall_assets,
            vol.Schema({vol.Optional("backup", default=True): cv.boolean}),
            SupportsResponse.ONLY,
        ),
        (SERVICE_GENERATE, generate, vol.Schema({}), SupportsResponse.OPTIONAL),
        (
            SERVICE_SAVE_PRESET,
            save_preset,
            vol.Schema({vol.Required("payload"): vol.Any(dict, cv.string)}),
            SupportsResponse.OPTIONAL,
        ),
        (
            SERVICE_COPY_PRESET,
            copy_preset,
            vol.Schema({vol.Required("source"): cv.string, vol.Required("name"): cv.string}),
            SupportsResponse.OPTIONAL,
        ),
        (SERVICE_DELETE_USER_THEME, delete_user_theme, NAME_SCHEMA, SupportsResponse.OPTIONAL),
        (SERVICE_BUILD_THEME, build_theme, NAME_SCHEMA, SupportsResponse.OPTIONAL),
        (SERVICE_REFRESH_CATALOGS, refresh_catalogs, vol.Schema({}), SupportsResponse.OPTIONAL),
    ]
    for service, handler, schema, supports_response in registrations:
        hass.services.async_register(
            DOMAIN, service, handler, schema=schema, supports_response=supports_response
        )
