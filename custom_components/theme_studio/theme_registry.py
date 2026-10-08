"""Add Theme Studio's themes to Home Assistant without a YAML include.

Home Assistant only reads themes from ``frontend: themes:`` in
configuration.yaml. This module puts the theme files from
/config/themes/theme_studio/ into the frontend's theme list itself, adds them
again after *Reload themes* (which only re-reads YAML) and restores a saved
default theme that Home Assistant dropped at start-up because the theme did
not exist yet.

It uses the frontend's internal data (``hass.data["frontend_themes"]``). If
that ever changes, the module switches itself off and logs it; the YAML line
keeps working as before.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import yaml

from homeassistant.const import EVENT_THEMES_UPDATED
from homeassistant.core import Event, HomeAssistant, callback

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

DATA_REGISTRY = f"{DOMAIN}_theme_registry"
FRONTEND_THEMES = "frontend_themes"
FRONTEND_DEFAULT = "frontend_default_theme"
FRONTEND_DEFAULT_DARK = "frontend_default_dark_theme"
FRONTEND_STORE = "frontend_themes_store"


def theme_sources(config_dir: Path) -> list[Path]:
    """Theme Studio's theme files: the bundled ones, then the built and live ones.

    Later files win, the same way ``!include_dir_merge_named`` merges them.
    """
    themes_dir = config_dir / "themes"
    bundled = sorted(themes_dir.glob("theme_studio_*.yaml")) if themes_dir.is_dir() else []
    built_dir = themes_dir / "theme_studio"
    built = sorted(built_dir.glob("*.yaml")) if built_dir.is_dir() else []
    return [*bundled, *built]


def read_theme_files(paths: list[Path]) -> dict[str, dict[str, Any]]:
    """Theme name -> theme from the given YAML files (blocking)."""
    themes: dict[str, dict[str, Any]] = {}
    for path in paths:
        try:
            data = yaml.safe_load(path.read_text(encoding="utf-8"))
        except (OSError, yaml.YAMLError) as err:
            _LOGGER.warning("Theme Studio could not read %s: %s", path.name, err)
            continue
        if not isinstance(data, dict):
            continue
        for name, theme in data.items():
            if isinstance(name, str) and _valid_theme(theme):
                themes[name] = _as_strings(theme)
    return themes


def _as_strings(theme: dict[str, Any]) -> dict[str, Any]:
    """Values as strings, the way Home Assistant stores themes from YAML."""
    result: dict[str, Any] = {}
    for key, value in theme.items():
        if key == "modes":
            result[key] = {mode: _as_strings(values) for mode, values in value.items()}
        else:
            result[key] = "" if value is None else str(value)
    return result


def _valid_theme(theme: Any) -> bool:
    """A flat mapping of variables, optionally with light/dark modes."""
    if not isinstance(theme, dict):
        return False
    for key, value in theme.items():
        if key == "modes":
            if not isinstance(value, dict) or not all(
                mode in ("light", "dark") and isinstance(values, dict) for mode, values in value.items()
            ):
                return False
        elif not isinstance(key, str) or isinstance(value, (dict, list)):
            return False
    return True


class ThemeRegistry:
    """Keeps Theme Studio's themes in Home Assistant's theme list."""

    def __init__(self, hass: HomeAssistant, config_dir: Path) -> None:
        self.hass = hass
        self.config_dir = config_dir
        self.active = False
        self._themes: dict[str, dict[str, Any]] = {}
        self._added: set[str] = set()
        self._unsub = None
        self._rereading = False

    @property
    def supported(self) -> bool:
        return isinstance(self.hass.data.get(FRONTEND_THEMES), dict)

    async def async_start(self) -> bool:
        if not self.supported:
            _LOGGER.warning(
                "Theme Studio cannot add its themes to Home Assistant on this version; "
                "add 'frontend: themes: !include_dir_merge_named themes' to configuration.yaml instead"
            )
            return False
        self.active = True
        self._unsub = self.hass.bus.async_listen(EVENT_THEMES_UPDATED, self._handle_themes_updated)
        await self.async_refresh(restore_defaults=True)
        return True

    @callback
    def async_stop(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None
        self.active = False

    async def async_refresh(self, restore_defaults: bool = False) -> None:
        """Re-read the theme files and update Home Assistant's list."""
        if not self.active:
            return
        self._themes = await self.hass.async_add_executor_job(
            lambda: read_theme_files(theme_sources(self.config_dir))
        )
        changed = self._apply()
        if restore_defaults:
            changed = await self._async_restore_defaults() or changed
        if changed:
            self.hass.bus.async_fire(EVENT_THEMES_UPDATED)

    @callback
    def _apply(self) -> bool:
        themes = self.hass.data.get(FRONTEND_THEMES)
        if not isinstance(themes, dict):
            return False
        changed = False
        for name in list(self._added - set(self._themes)):
            # A theme Theme Studio added earlier whose file is gone.
            if themes.pop(name, None) is not None:
                changed = True
            self._added.discard(name)
        for name, theme in self._themes.items():
            if themes.get(name) != theme:
                themes[name] = theme
                changed = True
            self._added.add(name)
        return changed

    @callback
    def _handle_themes_updated(self, event: Event) -> None:
        """Reload themes replaces the list with the YAML themes; add ours again.

        The themes are added back straight away from what was read last, then
        the files are read again, so a theme whose file is gone leaves the list.
        """
        if self._apply():
            self.hass.bus.async_fire(EVENT_THEMES_UPDATED)
        if self.active and not self._rereading:
            self._rereading = True
            self.hass.async_create_task(self._async_reread())

    async def _async_reread(self) -> None:
        try:
            await self.async_refresh()
        finally:
            self._rereading = False

    async def _async_restore_defaults(self) -> bool:
        store = self.hass.data.get(FRONTEND_STORE)
        if store is None:
            return False
        try:
            saved = await store.async_load() or {}
        except Exception:  # noqa: BLE001 - never let this stop the integration
            _LOGGER.debug("Theme Studio could not read the saved default theme", exc_info=True)
            return False
        changed = False
        for key in (FRONTEND_DEFAULT, FRONTEND_DEFAULT_DARK):
            wanted = saved.get(key) if isinstance(saved, dict) else None
            if wanted in self._themes and self.hass.data.get(key) != wanted:
                self.hass.data[key] = wanted
                changed = True
        return changed


def get_registry(hass: HomeAssistant) -> ThemeRegistry | None:
    registry = hass.data.get(DATA_REGISTRY)
    return registry if isinstance(registry, ThemeRegistry) else None


async def async_reload_themes(hass: HomeAssistant) -> None:
    """Make Home Assistant show the current theme files."""
    registry = get_registry(hass)
    if registry is not None and registry.active:
        await registry.async_refresh()
        return
    if hass.services.has_service("frontend", "reload_themes"):
        await hass.services.async_call("frontend", "reload_themes", blocking=True)
