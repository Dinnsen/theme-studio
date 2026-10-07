"""Save and load between the studio editor and theme files.

Until v0.9.0 this lived in about 3,000 lines of package automations that
copied every editor value one service call at a time, through a second set of
per-variant helper entities. Here the editor entities are read and written
directly and the theme file is the only store.

Rules kept from the YAML flows:
* Saving writes only the loaded variant (light or dark); the other variant in
  the file is left alone.
* Built-in presets are never written.
* Loading only changes editor values that the theme file contains.
"""

from __future__ import annotations

from typing import Any

from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import HomeAssistant

from .definitions import HelperDefinition

EMPTY = {"", "None", STATE_UNKNOWN, STATE_UNAVAILABLE}

SELECT_PRESETS = "select.theme_studio_theme_presets"
SELECT_USER_THEMES = "select.theme_studio_user_themes"
SELECT_BACKGROUND_IMAGE = "select.theme_studio_theme_background_image_select"
TEXT_SELECTED_USER_THEME = "text.theme_studio_selected_user_theme"
TEXT_THEME_NAME = "text.theme_studio_theme_name"
TEXT_LOADED_VARIANT = "text.theme_studio_loaded_variant"
TEXT_BUSY_MESSAGE = "text.theme_studio_busy_message"
SWITCH_BUSY = "switch.theme_studio_busy"
BACKGROUND_PREFIX = "/local/background/"


def _state(hass: HomeAssistant, entity_id: str) -> str:
    state = hass.states.get(entity_id)
    return "" if state is None else str(state.state).strip()


def selected_user_theme(hass: HomeAssistant) -> str | None:
    for entity_id in (SELECT_USER_THEMES, TEXT_SELECTED_USER_THEME):
        value = _state(hass, entity_id)
        if value not in EMPTY:
            return value
    return None


def selected_theme(hass: HomeAssistant) -> str:
    """The user theme if one is selected, else the preset, else Default."""
    user = selected_user_theme(hass)
    if user:
        return user
    preset = _state(hass, SELECT_PRESETS)
    return preset if preset not in EMPTY else "Default"


def loaded_variant(hass: HomeAssistant) -> str:
    return "light" if _state(hass, TEXT_LOADED_VARIANT).lower() == "light" else "dark"


def variant_definitions(definitions: list[HelperDefinition]) -> list[HelperDefinition]:
    return [definition for definition in definitions if definition.setting]


def read_editor(hass: HomeAssistant, definitions: list[HelperDefinition]) -> dict[str, Any]:
    """Editor values in the form theme files store them."""
    values: dict[str, Any] = {}
    for definition in variant_definitions(definitions):
        state = hass.states.get(definition.entity_id)
        if state is None or state.state in (STATE_UNKNOWN, STATE_UNAVAILABLE):
            continue
        if definition.platform == "number":
            try:
                values[definition.setting] = float(state.state)
            except ValueError:
                continue
        else:
            values[definition.setting] = state.state
    return values


def _coerce(definition: HelperDefinition, value: Any, hass: HomeAssistant) -> Any | None:
    """Value an editor entity accepts, or None to leave the entity alone."""
    if value is None:
        return None
    if definition.platform == "number":
        try:
            number = float(value)
        except (TypeError, ValueError):
            return None
        low = definition.min if definition.min is not None else number
        high = definition.max if definition.max is not None else number
        return min(max(number, low), high)
    if definition.platform == "switch":
        if isinstance(value, bool):
            return "on" if value else "off"
        return "on" if str(value).strip().lower() in ("1", "true", "on", "yes") else "off"
    if definition.platform == "select":
        state = hass.states.get(definition.entity_id)
        options = (state.attributes.get("options") if state else None) or list(definition.options)
        return str(value) if str(value) in options else None
    text = str(value)
    if definition.max is not None:
        text = text[: int(definition.max)]
    return text


async def async_set(hass: HomeAssistant, entity_id: str, value: Any) -> None:
    domain = entity_id.split(".", 1)[0]
    if domain == "switch":
        service = "turn_on" if value == "on" else "turn_off"
        await hass.services.async_call("switch", service, {"entity_id": entity_id}, blocking=True)
    elif domain == "select":
        await hass.services.async_call(
            "select", "select_option", {"entity_id": entity_id, "option": value}, blocking=True
        )
    elif domain == "number":
        await hass.services.async_call(
            "number", "set_value", {"entity_id": entity_id, "value": value}, blocking=True
        )
    else:
        await hass.services.async_call(
            "text", "set_value", {"entity_id": entity_id, "value": value}, blocking=True
        )


async def async_write_editor(
    hass: HomeAssistant, definitions: list[HelperDefinition], values: dict[str, Any]
) -> int:
    """Put theme file values into the editor; returns how many entities changed."""
    changed = 0
    image_url = values.get("background_image_url")
    if isinstance(image_url, str) and image_url.startswith(BACKGROUND_PREFIX):
        # Keep the image picker in step; its own automation then sets the URL.
        picker = hass.states.get(SELECT_BACKGROUND_IMAGE)
        image = image_url[len(BACKGROUND_PREFIX):]
        if picker is not None and image in (picker.attributes.get("options") or []) and picker.state != image:
            await async_set(hass, SELECT_BACKGROUND_IMAGE, image)
    for definition in variant_definitions(definitions):
        if definition.setting not in values:
            continue
        value = _coerce(definition, values[definition.setting], hass)
        if value is None:
            continue
        current = hass.states.get(definition.entity_id)
        if current is not None:
            if definition.platform == "number":
                try:
                    if float(current.state) == float(value):
                        continue
                except ValueError:
                    pass
            elif current.state == value:
                continue
        await async_set(hass, definition.entity_id, value)
        changed += 1
    return changed


async def async_busy(hass: HomeAssistant, message: str) -> None:
    if hass.states.get(SWITCH_BUSY) is not None:
        await async_set(hass, SWITCH_BUSY, "on")
    if hass.states.get(TEXT_BUSY_MESSAGE) is not None:
        await async_set(hass, TEXT_BUSY_MESSAGE, message[:255])


async def async_idle(hass: HomeAssistant, message: str = "Idle") -> None:
    if hass.states.get(TEXT_BUSY_MESSAGE) is not None:
        await async_set(hass, TEXT_BUSY_MESSAGE, message[:255])
    if hass.states.get(SWITCH_BUSY) is not None:
        await async_set(hass, SWITCH_BUSY, "off")
