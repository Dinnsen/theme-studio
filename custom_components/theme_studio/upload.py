"""Upload of background images from the panel."""

from __future__ import annotations

from http import HTTPStatus

from aiohttp import web

from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
from homeassistant.helpers.http import KEY_HASS

from .const import DOMAIN
from .engine import MAX_BACKGROUND_BYTES

UPLOAD_URL = f"/api/{DOMAIN}/background"
DATA_UPLOAD_REGISTERED = f"{DOMAIN}_upload_view"


class BackgroundUploadView(HomeAssistantView):
    """Store an uploaded image in /config/www/background (administrators only)."""

    url = UPLOAD_URL
    name = f"api:{DOMAIN}:background"
    requires_auth = True

    async def post(self, request: web.Request) -> web.Response:
        user = request.get("hass_user")
        if user is None or not user.is_admin:
            return self.json_message("Only administrators can upload images", HTTPStatus.UNAUTHORIZED)
        hass: HomeAssistant = request.app[KEY_HASS]
        entries = hass.config_entries.async_loaded_entries(DOMAIN)
        if not entries:
            return self.json_message("Theme Studio is not set up", HTTPStatus.SERVICE_UNAVAILABLE)
        engine = entries[0].runtime_data.engine

        reader = await request.multipart()
        field = await reader.next()
        if field is None or getattr(field, "name", None) != "file":
            return self.json_message("Send the image as the field 'file'", HTTPStatus.BAD_REQUEST)
        filename = getattr(field, "filename", None) or "image"
        data = bytearray()
        while chunk := await field.read_chunk(256 * 1024):
            data.extend(chunk)
            if len(data) > MAX_BACKGROUND_BYTES:
                return self.json_message("The image is larger than 15 MB", HTTPStatus.REQUEST_ENTITY_TOO_LARGE)

        result = await hass.async_add_executor_job(engine.save_background, filename, bytes(data))
        if not result.get("ok"):
            return self.json(result, HTTPStatus.BAD_REQUEST)
        return self.json(result)


def async_register_upload(hass: HomeAssistant) -> None:
    """Register the upload view once per Home Assistant run."""
    if hass.data.get(DATA_UPLOAD_REGISTERED):
        return
    hass.http.register_view(BackgroundUploadView())
    hass.data[DATA_UPLOAD_REGISTERED] = True
