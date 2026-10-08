"""The Theme Studio sidebar panel.

The panel is a web component bundled in ``frontend/``. It talks to the
integration through the commands in ``websocket.py``.
"""

from __future__ import annotations

import hashlib
import logging
from pathlib import Path

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import (
    CONF_PANEL_ADMIN_ONLY,
    CONF_SHOW_PANEL,
    DOMAIN,
    PANEL_COMPONENT,
    PANEL_ICON,
    PANEL_MODULE,
    PANEL_STATIC_URL,
    PANEL_TITLE,
    PANEL_URL_PATH,
)
from .messages import panel_language

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = Path(__file__).parent / "frontend"
DATA_STATIC_REGISTERED = f"{DOMAIN}_panel_static"


def _bundle_tag(path: Path) -> str:
    """Short hash of the bundle so browsers load a new version after an update."""
    try:
        return hashlib.sha256(path.read_bytes()).hexdigest()[:12]
    except OSError:
        return "missing"


async def async_register_static(hass: HomeAssistant) -> None:
    """Serve frontend/ (panel, fonts). Static paths cannot be removed, so once per run."""
    if hass.data.get(DATA_STATIC_REGISTERED):
        return
    await hass.http.async_register_static_paths(
        [StaticPathConfig(PANEL_STATIC_URL, str(FRONTEND_DIR), cache_headers=False)]
    )
    hass.data[DATA_STATIC_REGISTERED] = True


async def async_bundle_tag(hass: HomeAssistant, name: str) -> str:
    return await hass.async_add_executor_job(_bundle_tag, FRONTEND_DIR / name)


async def async_register_panel(hass: HomeAssistant, options: dict) -> bool:
    """Add the panel to the sidebar unless it is switched off."""
    if not options.get(CONF_SHOW_PANEL, True):
        return False
    bundle = FRONTEND_DIR / PANEL_MODULE
    if not bundle.is_file():
        _LOGGER.warning("Theme Studio panel files are missing: %s", bundle)
        return False
    await async_register_static(hass)
    tag = await hass.async_add_executor_job(_bundle_tag, bundle)
    try:
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_URL_PATH,
            webcomponent_name=PANEL_COMPONENT,
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            module_url=f"{PANEL_STATIC_URL}/{PANEL_MODULE}?v={tag}",
            require_admin=bool(options.get(CONF_PANEL_ADMIN_ONLY, True)),
            config={"domain": DOMAIN, "language": panel_language(options)},
        )
    except ValueError as err:
        # Another panel already uses the path; keep the integration running.
        _LOGGER.warning("Theme Studio could not add its sidebar panel: %s", err)
        return False
    return True


def async_unregister_panel(hass: HomeAssistant) -> None:
    """Remove the panel from the sidebar."""
    frontend.async_remove_panel(hass, PANEL_URL_PATH, warn_if_unknown=False)
