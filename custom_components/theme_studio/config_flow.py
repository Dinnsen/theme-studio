from __future__ import annotations

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback

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
    TITLE,
)

STEP_USER_DATA_SCHEMA = vol.Schema({
    vol.Required(CONF_PACKAGES_PATH, default=DEFAULT_PACKAGES_PATH): str,
    vol.Required(CONF_LOVELACE_PATH, default=DEFAULT_LOVELACE_PATH): str,
    vol.Required(CONF_WORKDIR_PATH, default=DEFAULT_WORKDIR_PATH): str,
    vol.Required(CONF_THEMES_PATH, default=DEFAULT_THEMES_PATH): str,
})


class ThemeStudioConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input=None):
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title=TITLE, data=user_input)

        return self.async_show_form(step_id="user", data_schema=STEP_USER_DATA_SCHEMA)
