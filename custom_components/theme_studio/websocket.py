"""WebSocket commands used by the Theme Studio panel.

Reading commands list themes, return one theme with its CSS variables and
settings, and build previews. Commands that write (save, new, delete, build)
need an administrator and never touch the built-in presets.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send

from .const import DOMAIN, SIGNAL_CATALOGS_CHANGED
from .engine import ThemeEngine
from .sharing import ImportError_
from .theme_registry import async_reload_themes

WS_THEMES = f"{DOMAIN}/themes"
WS_THEME = f"{DOMAIN}/theme"
WS_PREVIEW = f"{DOMAIN}/preview"
WS_SCHEMA = f"{DOMAIN}/schema"
WS_BACKGROUNDS = f"{DOMAIN}/backgrounds"
WS_MIRROR = f"{DOMAIN}/mirror"
WS_PREVIEW_OPTIONS = f"{DOMAIN}/preview_options"
WS_SAVE = f"{DOMAIN}/theme/save"
WS_NEW = f"{DOMAIN}/theme/new"
WS_DELETE = f"{DOMAIN}/theme/delete"
WS_BUILD = f"{DOMAIN}/theme/build"
WS_USE = f"{DOMAIN}/theme/use"
WS_EXPORT = f"{DOMAIN}/theme/export"
WS_IMPORT = f"{DOMAIN}/theme/import"

SETTING_VALUE = vol.Any(str, int, float, bool)
SETTINGS = vol.All({vol.All(str, vol.Length(max=80)): SETTING_VALUE}, vol.Length(max=300))
SLUG = vol.All(str, vol.Length(min=1, max=120))
NAME = vol.All(str, vol.Length(max=60))


def _engine(hass: HomeAssistant) -> ThemeEngine | None:
    entries = hass.config_entries.async_loaded_entries(DOMAIN)
    return entries[0].runtime_data.engine if entries else None


def _not_loaded(connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    connection.send_error(msg["id"], "not_loaded", "Theme Studio is not set up")


@websocket_api.websocket_command({vol.Required("type"): WS_THEMES})
@websocket_api.async_response
async def ws_themes(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Every preset and user theme with the colours for its card."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    themes = await hass.async_add_executor_job(engine.theme_cards)
    connection.send_result(msg["id"], {"themes": themes, "version": engine.version})


@websocket_api.websocket_command(
    {vol.Required("type"): WS_THEME, vol.Required("slug"): vol.All(str, vol.Length(min=1, max=120))}
)
@websocket_api.async_response
async def ws_theme(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """One theme with every CSS variable and the contrast of both variants."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    theme = await hass.async_add_executor_job(engine.theme_detail, msg["slug"])
    if theme is None:
        connection.send_error(msg["id"], "not_found", f"No theme called {msg['slug']}")
        return
    connection.send_result(msg["id"], theme)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_PREVIEW,
        vol.Required("settings"): SETTINGS,
    }
)
@websocket_api.async_response
async def ws_preview(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Build one variant from settings without writing anything."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    try:
        result = await hass.async_add_executor_job(engine.preview, msg["settings"])
    except (ValueError, TypeError, KeyError, ZeroDivisionError) as err:
        connection.send_error(msg["id"], "invalid_settings", str(err))
        return
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command({vol.Required("type"): WS_SCHEMA})
@websocket_api.async_response
async def ws_schema(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """The settings the editor can change, with their limits and defaults."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    settings = await hass.async_add_executor_job(engine.schema)
    connection.send_result(msg["id"], {"settings": settings})


@websocket_api.websocket_command({vol.Required("type"): WS_BACKGROUNDS})
@websocket_api.async_response
async def ws_backgrounds(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Background images in /config/www/background."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    catalog = await hass.async_add_executor_job(engine.background_image_catalog)
    images = [{"file": name, "url": f"/local/background/{name}"} for name in catalog["options"]]
    connection.send_result(msg["id"], {"images": images})


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_MIRROR,
        vol.Required("settings"): SETTINGS,
        vol.Required("target"): vol.In(["light", "dark"]),
    }
)
@websocket_api.async_response
async def ws_mirror(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Settings for one variant made from the other one; nothing is written."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    settings = await hass.async_add_executor_job(engine.mirror, msg["settings"], msg["target"])
    connection.send_result(msg["id"], {"settings": settings})


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_PREVIEW_OPTIONS,
        vol.Required("settings"): SETTINGS,
        vol.Required("key"): vol.All(str, vol.Length(max=80)),
        vol.Required("values"): vol.All([vol.All(str, vol.Length(max=80))], vol.Length(max=20)),
        vol.Optional("fixed", default={}): SETTINGS,
    }
)
@websocket_api.async_response
async def ws_preview_options(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Previews of one setting's options, for the border, shadow and overlay tiles."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    try:
        options = await hass.async_add_executor_job(
            engine.preview_options, msg["settings"], msg["key"], msg["values"], msg["fixed"]
        )
    except (ValueError, TypeError, KeyError, ZeroDivisionError) as err:
        connection.send_error(msg["id"], "invalid_settings", str(err))
        return
    connection.send_result(msg["id"], {"options": options})


async def _async_catalogs_changed(hass: HomeAssistant, engine: ThemeEngine) -> None:
    """Keep the dashboard's lists and the theme previews in step."""
    await hass.async_add_executor_job(engine.write_user_theme_index)
    async_dispatcher_send(hass, SIGNAL_CATALOGS_CHANGED)


def _send_outcome(
    connection: websocket_api.ActiveConnection, msg: dict[str, Any], result: dict[str, Any]
) -> bool:
    if result.get("ok"):
        connection.send_result(msg["id"], result)
        return True
    connection.send_error(msg["id"], str(result.get("reason", "failed")), str(result))
    return False


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_SAVE,
        vol.Required("slug"): SLUG,
        vol.Optional("name"): NAME,
        vol.Optional("light"): SETTINGS,
        vol.Optional("dark"): SETTINGS,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_save(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Save editor changes into a user theme."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    variants = {variant: msg[variant] for variant in ("light", "dark") if variant in msg}
    result = await hass.async_add_executor_job(engine.save_theme, msg["slug"], msg.get("name"), variants)
    if _send_outcome(connection, msg, result):
        await _async_catalogs_changed(hass, engine)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_NEW,
        vol.Optional("source"): SLUG,
        vol.Optional("image"): vol.All(str, vol.Length(min=1, max=200)),
        vol.Optional("name"): NAME,
        vol.Optional("base_color"): vol.All(str, vol.Length(max=9)),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_new(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Create a user theme from a preset, a theme, one colour or an image."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    if "image" in msg:
        result = await hass.async_add_executor_job(engine.theme_from_image, msg["image"], msg.get("name"))
    else:
        result = await hass.async_add_executor_job(
            engine.new_theme, msg.get("source"), msg.get("name"), msg.get("base_color")
        )
    if _send_outcome(connection, msg, result):
        await _async_catalogs_changed(hass, engine)


@websocket_api.websocket_command({vol.Required("type"): WS_DELETE, vol.Required("slug"): SLUG})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_delete(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Delete a user theme (never a built-in preset)."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    result = await hass.async_add_executor_job(engine.delete_theme, msg["slug"])
    if _send_outcome(connection, msg, result):
        await _async_catalogs_changed(hass, engine)
        if result.get("removed_theme_files"):
            await async_reload_themes(hass)


@websocket_api.websocket_command({vol.Required("type"): WS_BUILD, vol.Required("slug"): SLUG})
@websocket_api.require_admin
@websocket_api.async_response
async def ws_build(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Write the theme file with light and dark mode and reload the themes."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    name = await hass.async_add_executor_job(engine.theme_name, msg["slug"])
    if name is None:
        connection.send_error(msg["id"], "not_found", f"No theme called {msg['slug']}")
        return
    result = await hass.async_add_executor_job(engine.build_theme, name)
    if not result.get("ok", True):
        connection.send_error(msg["id"], "build_failed", str(result))
        return
    await async_reload_themes(hass)
    connection.send_result(msg["id"], {"ok": True, "name": name, **result})


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_USE,
        vol.Required("slug"): SLUG,
        vol.Required("scope"): vol.In(["device", "everyone"]),
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_use(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Build the theme file and, for everyone, make it Home Assistant's default theme.

    "This device" is set by the panel itself, the way the profile page does it.
    """
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    name = await hass.async_add_executor_job(engine.theme_name, msg["slug"])
    if name is None:
        connection.send_error(msg["id"], "not_found", f"No theme called {msg['slug']}")
        return
    result = await hass.async_add_executor_job(engine.build_theme, name)
    if not result.get("ok", True):
        connection.send_error(msg["id"], "build_failed", str(result))
        return
    theme_name = str(result.get("theme") or name)
    await async_reload_themes(hass)
    if msg["scope"] == "everyone":
        for mode in ("light", "dark"):
            await hass.services.async_call(
                "frontend", "set_theme", {"name": theme_name, "mode": mode}, blocking=True
            )
    connection.send_result(msg["id"], {"ok": True, "name": name, "theme": theme_name, "scope": msg["scope"]})


@websocket_api.websocket_command({vol.Required("type"): WS_EXPORT, vol.Required("slug"): SLUG})
@websocket_api.async_response
async def ws_export(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """A theme as a document and share code. Nothing is written to /config/www."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    result = await hass.async_add_executor_job(engine.export_theme, msg["slug"])
    _send_outcome(connection, msg, result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): WS_IMPORT,
        vol.Required("data"): vol.All(str, vol.Length(min=1, max=300_000)),
        vol.Optional("name"): NAME,
    }
)
@websocket_api.require_admin
@websocket_api.async_response
async def ws_import(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """A new user theme from a share code or an exported file. Never overwrites."""
    engine = _engine(hass)
    if engine is None:
        _not_loaded(connection, msg)
        return
    try:
        result = await hass.async_add_executor_job(engine.import_user_theme, msg["data"], msg.get("name"))
    except ImportError_ as err:
        connection.send_error(msg["id"], str(err), "This is not a Theme Studio theme")
        return
    if _send_outcome(connection, msg, result):
        await _async_catalogs_changed(hass, engine)


COMMANDS = (
    ws_themes,
    ws_theme,
    ws_preview,
    ws_schema,
    ws_backgrounds,
    ws_mirror,
    ws_preview_options,
    ws_save,
    ws_new,
    ws_delete,
    ws_build,
    ws_use,
    ws_export,
    ws_import,
)


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    """Register the panel's commands once per Home Assistant run."""
    for command in COMMANDS:
        websocket_api.async_register_command(hass, command)
