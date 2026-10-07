"""WebSocket commands used by the Theme Studio panel.

All commands in v0.10 only read: they list themes, return one theme with its
CSS variables and build a preview from settings. Nothing is written to disk.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .engine import ThemeEngine

WS_THEMES = f"{DOMAIN}/themes"
WS_THEME = f"{DOMAIN}/theme"
WS_PREVIEW = f"{DOMAIN}/preview"

SETTING_VALUE = vol.Any(str, int, float, bool)


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
        vol.Required("settings"): vol.All(
            {vol.All(str, vol.Length(max=80)): SETTING_VALUE}, vol.Length(max=300)
        ),
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


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    """Register the panel's commands once per Home Assistant run."""
    for command in (ws_themes, ws_theme, ws_preview):
        websocket_api.async_register_command(hass, command)
