"""Home Assistant side of the fonts: the stylesheet view and the loader module."""

from __future__ import annotations

from aiohttp import web

from homeassistant.components import frontend
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.helpers.http import KEY_HASS

from .const import DOMAIN, PANEL_STATIC_URL
from .fonts import FONTS_CSS_URL, LOADER_FILE, fonts_css

DATA_FONTS_VIEW = f"{DOMAIN}_fonts_view"


class FontsCssView(HomeAssistantView):
    """The stylesheet with all @font-face rules. Public: it only lists font files."""

    url = FONTS_CSS_URL
    name = f"api:{DOMAIN}:fonts"
    requires_auth = False

    async def get(self, request: web.Request) -> web.Response:
        hass: HomeAssistant = request.app[KEY_HASS]
        entries = hass.config_entries.async_loaded_entries(DOMAIN)
        if not entries:
            return web.Response(text="", content_type="text/css")
        engine = entries[0].runtime_data.engine
        custom = await hass.async_add_executor_job(engine.custom_fonts)
        css = await hass.async_add_executor_job(fonts_css, custom, engine.version)
        return web.Response(text=css, content_type="text/css", headers={"Cache-Control": "no-cache"})


def async_register_fonts_view(hass: HomeAssistant) -> None:
    if hass.data.get(DATA_FONTS_VIEW):
        return
    hass.http.register_view(FontsCssView())
    hass.data[DATA_FONTS_VIEW] = True


def loader_url(tag: str) -> str:
    return f"{PANEL_STATIC_URL}/{LOADER_FILE}?v={tag}"


def async_add_loader(hass: HomeAssistant, tag: str) -> str:
    url = loader_url(tag)
    frontend.add_extra_js_url(hass, url)
    return url


def async_remove_loader(hass: HomeAssistant, url: str) -> None:
    try:
        frontend.remove_extra_js_url(hass, url)
    except KeyError:
        pass
