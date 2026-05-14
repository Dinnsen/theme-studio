"""Config flow for Theme Studio."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback

from .const import DOMAIN, TITLE

DEFAULT_PACKAGES_PATH = "/config/packages"
DEFAULT_LOVELACE_PATH = "/config/lovelace"
DEFAULT_THEME_STUDIO_PATH = "/config/theme_studio"
DEFAULT_THEMES_PATH = "/config/themes/theme_studio"


class ThemeStudioConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Theme Studio."""

    VERSION = 1

    async def async_step_user(
        self,
        user_input: dict[str, Any] | None = None,
    ) -> config_entries.ConfigFlowResult:
        """Handle the initial step."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is not None:
            return self.async_create_entry(
                title=TITLE,
                data={
                    "packages_path": user_input["packages_path"].strip(),
                    "lovelace_path": user_input["lovelace_path"].strip(),
                    "theme_studio_path": user_input["theme_studio_path"].strip(),
                    "themes_path": user_input["themes_path"].strip(),
                    "overwrite": user_input.get("overwrite", True),
                    "backup": user_input.get("backup", True),
                },
            )

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        "packages_path",
                        default=DEFAULT_PACKAGES_PATH,
                    ): str,
                    vol.Required(
                        "lovelace_path",
                        default=DEFAULT_LOVELACE_PATH,
                    ): str,
                    vol.Required(
                        "theme_studio_path",
                        default=DEFAULT_THEME_STUDIO_PATH,
                    ): str,
                    vol.Required(
                        "themes_path",
                        default=DEFAULT_THEMES_PATH,
                    ): str,
                    vol.Optional("overwrite", default=True): bool,
                    vol.Optional("backup", default=True): bool,
                }
            ),
            errors={},
            description_placeholders={},
        )

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> ThemeStudioOptionsFlow:
        """Return the options flow."""
        return ThemeStudioOptionsFlow(config_entry)


class ThemeStudioOptionsFlow(config_entries.OptionsFlow):
    """Handle Theme Studio options."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self._config_entry = config_entry

    async def async_step_init(
        self,
        user_input: dict[str, Any] | None = None,
    ) -> config_entries.ConfigFlowResult:
        """Manage Theme Studio options."""
        data = {
            **dict(self._config_entry.data),
            **dict(self._config_entry.options),
        }

        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        "overwrite",
                        default=data.get("overwrite", True),
                    ): bool,
                    vol.Optional(
                        "backup",
                        default=data.get("backup", True),
                    ): bool,
                }
            ),
        )
