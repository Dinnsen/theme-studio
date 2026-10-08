"""Theme Studio services, for automations and scripts.

The Theme Studio panel does not use these; it talks to the integration over
its WebSocket commands (websocket.py).
"""

from __future__ import annotations

import ast
import json
from typing import Any

from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv
import voluptuous as vol

from .asset_manager import async_initialize_assets
from .const import (
    DOMAIN,
    SERVICE_BUILD_THEME,
    SERVICE_DELETE_USER_THEME,
    SERVICE_EXPORT_USER_THEME,
    SERVICE_IMPORT_USER_THEME,
    SERVICE_INITIALIZE_ASSETS,
    SERVICE_REINSTALL_ASSETS,
    SERVICE_SAVE_PRESET,
    SERVICE_THEME_FROM_IMAGE,
)
from .engine import ThemeEngine
from .sharing import ImportError_
from .theme_registry import async_reload_themes

NOTIFICATION_ID = "theme_studio_share"

NAME_SCHEMA = vol.Schema({vol.Required("name"): cv.string})


def _engine(hass: HomeAssistant) -> ThemeEngine:
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="not_loaded"
        )
    return entries[0].runtime_data.engine


async def _async_notify(hass: HomeAssistant, title: str, message: str) -> None:
    await hass.services.async_call(
        "persistent_notification",
        "create",
        {"title": title, "message": message, "notification_id": NOTIFICATION_ID},
        blocking=True,
    )


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

    async def export_user_theme(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        name = call.data["name"]
        result = await hass.async_add_executor_job(engine.export_user_theme, name)
        if not result.get("ok"):
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="user_theme_not_found",
                translation_placeholders={"name": name},
            )
        await _async_notify(
            hass,
            f"Theme Studio: {result['name']} exported",
            f"[Download {result['url'].rsplit('/', 1)[-1]}]({result['url']})\n\n"
            "Share code (paste it into Import in the Theme Studio panel):\n\n"
            f"`{result['share_string']}`",
        )
        return result

    async def import_user_theme(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        data = call.data.get("data")
        try:
            if data:
                result = await hass.async_add_executor_job(
                    engine.import_user_theme, data, call.data.get("name")
                )
                imported = [result] if result.get("ok") else []
                failed = [] if result.get("ok") else [result]
            else:
                result = await hass.async_add_executor_job(engine.import_folder)
                imported, failed = result["imported"], result["failed"]
        except ImportError_ as err:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="invalid_import",
                translation_placeholders={"reason": str(err)},
            ) from err
        lines = [f"- {item['name']}" for item in imported] or ["Nothing imported."]
        lines += [f"- {item.get('file', item.get('name', ''))}: {item.get('reason', '')}" for item in failed]
        if not data:
            lines.append("\nPut .json or share-code .txt files in `/config/theme_studio/imports/`.")
        await _async_notify(hass, "Theme Studio import", "\n".join(lines))
        return result

    async def theme_from_image(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        image = call.data["image"]
        try:
            result = await hass.async_add_executor_job(
                engine.theme_from_image, image, call.data.get("name")
            )
        except (OSError, ValueError) as err:
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="image_not_readable",
                translation_placeholders={"image": str(image), "error": str(err)},
            ) from err
        if not result.get("ok"):
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="image_not_readable",
                translation_placeholders={"image": str(image), "error": result.get("reason", "")},
            )
        return result

    async def save_preset(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        payload = _parse_payload(call.data["payload"])
        return await hass.async_add_executor_job(engine.save_preset, payload)

    async def delete_user_theme(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        # Same as Delete in the panel: a .bak copy of the user theme is kept.
        slug = engine.cli.slugify(call.data["name"])
        result = await hass.async_add_executor_job(engine.delete_theme, slug)
        if not result.get("ok"):
            raise ServiceValidationError(
                translation_domain=DOMAIN,
                translation_key="user_theme_not_found",
                translation_placeholders={"name": call.data["name"]},
            )
        await async_reload_themes(hass)
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
        await async_reload_themes(hass)
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
        (
            SERVICE_SAVE_PRESET,
            save_preset,
            vol.Schema({vol.Required("payload"): vol.Any(dict, cv.string)}),
            SupportsResponse.OPTIONAL,
        ),
        (SERVICE_DELETE_USER_THEME, delete_user_theme, NAME_SCHEMA, SupportsResponse.OPTIONAL),
        (SERVICE_BUILD_THEME, build_theme, NAME_SCHEMA, SupportsResponse.OPTIONAL),
        (SERVICE_EXPORT_USER_THEME, export_user_theme, NAME_SCHEMA, SupportsResponse.OPTIONAL),
        (
            SERVICE_IMPORT_USER_THEME,
            import_user_theme,
            vol.Schema({vol.Optional("data"): cv.string, vol.Optional("name"): cv.string}),
            SupportsResponse.OPTIONAL,
        ),
        (
            SERVICE_THEME_FROM_IMAGE,
            theme_from_image,
            vol.Schema({vol.Required("image"): cv.string, vol.Optional("name"): cv.string}),
            SupportsResponse.OPTIONAL,
        ),
    ]
    for service, handler, schema, supports_response in registrations:
        hass.services.async_register(
            DOMAIN, service, handler, schema=schema, supports_response=supports_response
        )
