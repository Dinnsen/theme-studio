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
from homeassistant.helpers.event import async_call_later
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
    SERVICE_COPY_VARIANT,
    SERVICE_EXPORT_USER_THEME,
    SERVICE_IMPORT_USER_THEME,
    SERVICE_PALETTE_FROM_IMAGE,
    SERVICE_SET_OPTIONS,
    SERVICE_THEME_FROM_IMAGE,
    SERVICE_UNDO,
    SIGNAL_CATALOGS_CHANGED,
    SIGNAL_CONTRAST_UPDATED,
    SELECT_USER_THEMES,
)
from .engine import ThemeEngine
from .sharing import ImportError_
from .variants import VARIANTS, mirror_variant, other_variant

UNDO_SETTLE_SECONDS = 2.0
NOTIFICATION_ID = "theme_studio_share"

NAME_SCHEMA = vol.Schema({vol.Required("name"): cv.string})


def _entry(hass: HomeAssistant):
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    if not entries:
        raise ServiceValidationError(
            translation_domain=DOMAIN, translation_key="not_loaded"
        )
    return entries[0]


def _engine(hass: HomeAssistant) -> ThemeEngine:
    return _entry(hass).runtime_data.engine


async def async_generate(hass: HomeAssistant) -> dict[str, Any]:
    """Build the live theme from the editor entities and publish its contrast."""
    entry = _entry(hass)
    arguments = {
        argument: _state(hass, entity_id)
        for argument, entity_id in LIVE_ARGUMENT_ENTITIES.items()
    }
    result = await hass.async_add_executor_job(entry.runtime_data.engine.generate_live, arguments)
    entry.runtime_data.contrast = result.get("contrast", [])
    entry.runtime_data.history.record(
        {entity_id: _state(hass, entity_id) for entity_id in LIVE_ARGUMENT_ENTITIES.values()}
    )
    async_dispatcher_send(hass, SIGNAL_CONTRAST_UPDATED)
    # Only push a theme reload to every connected screen when it changed.
    if result.get("changed"):
        await _reload_themes(hass)
    return result


async def _async_notify(hass: HomeAssistant, title: str, message: str) -> None:
    await hass.services.async_call(
        "persistent_notification",
        "create",
        {"title": title, "message": message, "notification_id": NOTIFICATION_ID},
        blocking=True,
    )


async def _async_set_entity_value(hass: HomeAssistant, entity_id: str, value: str) -> None:
    domain = entity_id.split(".", 1)[0]
    if domain == "switch":
        service = "turn_on" if str(value).lower() in ("on", "true", "1") else "turn_off"
        await hass.services.async_call("switch", service, {"entity_id": entity_id}, blocking=True)
    elif domain == "select":
        await hass.services.async_call(
            "select", "select_option", {"entity_id": entity_id, "option": value}, blocking=True
        )
    elif domain == "number":
        await hass.services.async_call(
            "number", "set_value", {"entity_id": entity_id, "value": float(value)}, blocking=True
        )
    else:
        await hass.services.async_call(
            "text", "set_value", {"entity_id": entity_id, "value": value}, blocking=True
        )


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
        return await async_generate(hass)

    async def copy_variant(call: ServiceCall) -> ServiceResponse:
        source = call.data["source"]
        target = other_variant(source)
        definitions = _entry(hass).runtime_data.definitions
        prefix = f"theme_studio_{source}_"
        source_values: dict[str, str] = {}
        entity_ids: dict[str, str] = {}
        for definition in definitions:
            if definition.platform == "button" or not definition.key.startswith(prefix):
                continue
            setting = definition.key[len(prefix):]
            state = hass.states.get(definition.entity_id)
            if state is None or state.state in (STATE_UNKNOWN, STATE_UNAVAILABLE):
                continue
            source_values[setting] = state.state
            entity_ids[setting] = f"{definition.platform}.theme_studio_{target}_{setting}"
        target_values = mirror_variant(source_values, target)
        for setting, value in target_values.items():
            if hass.states.get(entity_ids[setting]) is not None:
                await _async_set_entity_value(hass, entity_ids[setting], value)
        # Open the copy in the editor; it is written to the theme file on the next save.
        load_button = f"button.theme_studio_theme_load_{target}_theme"
        if hass.states.get(load_button) is not None:
            await hass.services.async_call(
                "button", "press", {"entity_id": load_button}, blocking=True
            )
        return {"ok": True, "source": source, "target": target, "copied": len(target_values)}

    async def undo(call: ServiceCall) -> ServiceResponse:
        history = _entry(hass).runtime_data.history
        previous = history.undo()
        if previous is None:
            raise ServiceValidationError(translation_domain=DOMAIN, translation_key="nothing_to_undo")
        history.restoring = True
        try:
            for entity_id, value in previous.items():
                state = hass.states.get(entity_id)
                if state is None or state.state == value or value == "":
                    continue
                await _async_set_entity_value(hass, entity_id, value)
        finally:
            # The live theme is rebuilt a moment after the last change; ignore
            # that rebuild so the restored step is not recorded twice.
            def _done(_now) -> None:
                history.restoring = False

            async_call_later(hass, UNDO_SETTLE_SECONDS, _done)
        return {"ok": True, "steps_left": len(history) - 1}

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
            "Share string (paste it into *Import user theme*):\n\n"
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
        await hass.async_add_executor_job(engine.write_user_theme_index)
        async_dispatcher_send(hass, SIGNAL_CATALOGS_CHANGED)
        lines = [f"- {item['name']}" for item in imported] or ["Nothing imported."]
        lines += [f"- {item.get('file', item.get('name', ''))}: {item.get('reason', '')}" for item in failed]
        if not data:
            lines.append("\nPut .json or share-string .txt files in `/config/theme_studio/imports/`.")
        await _async_notify(hass, "Theme Studio import", "\n".join(lines))
        return result

    async def theme_from_image(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        image = call.data.get("image") or _state(hass, "select.theme_studio_theme_background_image_select")
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
        await hass.async_add_executor_job(engine.write_user_theme_index)
        async_dispatcher_send(hass, SIGNAL_CATALOGS_CHANGED)
        # Make the new theme selectable and open it in the studio.
        state = hass.states.get(SELECT_USER_THEMES)
        if state is not None:
            options = list(state.attributes.get("options") or [])
            if result["name"] not in options:
                await hass.services.async_call(
                    DOMAIN,
                    SERVICE_SET_OPTIONS,
                    {"entity_id": SELECT_USER_THEMES, "options": [*options, result["name"]]},
                    blocking=True,
                )
            await hass.services.async_call(
                "select",
                "select_option",
                {"entity_id": SELECT_USER_THEMES, "option": result["name"]},
                blocking=True,
            )
        return result

    async def palette_from_image(call: ServiceCall) -> ServiceResponse:
        engine = _engine(hass)
        image = call.data.get("image") or _state(hass, "select.theme_studio_theme_background_image_select")
        try:
            result = await hass.async_add_executor_job(engine.palette_from_image, image)
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
        if call.data.get("apply"):
            # Editor values only; Undo brings the previous colours back.
            await _async_set_entity_value(
                hass, "text.theme_studio_theme_base_color", result["suggested_base_color"]
            )
            await _async_set_entity_value(
                hass, "text.theme_studio_theme_accent_color_override", result["suggested_accent_color"]
            )
            await _async_set_entity_value(
                hass,
                "number.theme_studio_theme_background_contrast",
                str(result["suggested_background_contrast"]),
            )
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
        (SERVICE_UNDO, undo, vol.Schema({}), SupportsResponse.OPTIONAL),
        (
            SERVICE_EXPORT_USER_THEME,
            export_user_theme,
            NAME_SCHEMA,
            SupportsResponse.OPTIONAL,
        ),
        (
            SERVICE_IMPORT_USER_THEME,
            import_user_theme,
            vol.Schema({vol.Optional("data"): cv.string, vol.Optional("name"): cv.string}),
            SupportsResponse.OPTIONAL,
        ),
        (
            SERVICE_THEME_FROM_IMAGE,
            theme_from_image,
            vol.Schema({vol.Optional("image"): cv.string, vol.Optional("name"): cv.string}),
            SupportsResponse.OPTIONAL,
        ),
        (
            SERVICE_PALETTE_FROM_IMAGE,
            palette_from_image,
            vol.Schema({vol.Optional("image"): cv.string, vol.Optional("apply", default=False): cv.boolean}),
            SupportsResponse.OPTIONAL,
        ),
        (
            SERVICE_COPY_VARIANT,
            copy_variant,
            vol.Schema({vol.Required("source"): vol.In(VARIANTS)}),
            SupportsResponse.OPTIONAL,
        ),
    ]
    for service, handler, schema, supports_response in registrations:
        hass.services.async_register(
            DOMAIN, service, handler, schema=schema, supports_response=supports_response
        )
