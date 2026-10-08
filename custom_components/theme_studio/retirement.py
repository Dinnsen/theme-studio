"""Clean up after the YAML dashboard, which was removed in v1.0.0.

The files are moved aside by the asset manager. This module removes the
editor entities the dashboard used from Home Assistant's registries and tells
the user, under Settings -> Repairs, what is left for them to do.
"""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    device_registry as dr,
    entity_registry as er,
    issue_registry as ir,
)

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

ISSUE_RESTART = "classic_dashboard_removed"
ISSUE_DASHBOARD_CONFIG = "classic_dashboard_configured"
DASHBOARD_FILE = "theme_studio_dashboard.yaml"


def dashboard_still_configured(config_dir: Path) -> bool:
    """True if configuration.yaml still points a dashboard at the removed file (blocking)."""
    try:
        text = (config_dir / "configuration.yaml").read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return False
    return any(
        DASHBOARD_FILE in line and not line.lstrip().startswith("#")
        for line in text.splitlines()
    )


def async_remove_editor_entities(hass: HomeAssistant, entry: ConfigEntry) -> int:
    """Remove the dashboard's editor entities and their device. Returns the count."""
    entity_registry = er.async_get(hass)
    entities = er.async_entries_for_config_entry(entity_registry, entry.entry_id)
    for entity in entities:
        entity_registry.async_remove(entity.entity_id)
    device_registry = dr.async_get(hass)
    for device in dr.async_entries_for_config_entry(device_registry, entry.entry_id):
        device_registry.async_remove_device(device.id)
    return len(entities)


async def async_retire(hass: HomeAssistant, entry: ConfigEntry, retired_files: list[str]) -> None:
    """Remove what is left of the dashboard and raise the matching repairs."""
    removed = async_remove_editor_entities(hass, entry)
    if removed or retired_files:
        _LOGGER.info(
            "Theme Studio removed the classic dashboard: %s entities, files moved aside: %s",
            removed,
            ", ".join(retired_files) or "none",
        )

    if retired_files:
        # Not persistent: it disappears after the restart it asks for.
        ir.async_create_issue(
            hass,
            DOMAIN,
            ISSUE_RESTART,
            is_fixable=False,
            is_persistent=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key=ISSUE_RESTART,
            translation_placeholders={"files": ", ".join(retired_files)},
        )

    configured = await hass.async_add_executor_job(
        dashboard_still_configured, Path(hass.config.path())
    )
    if configured:
        ir.async_create_issue(
            hass,
            DOMAIN,
            ISSUE_DASHBOARD_CONFIG,
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key=ISSUE_DASHBOARD_CONFIG,
        )
    else:
        ir.async_delete_issue(hass, DOMAIN, ISSUE_DASHBOARD_CONFIG)
