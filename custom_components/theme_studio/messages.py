"""Texts Theme Studio writes itself (notifications), in the chosen language.

The panel has its own texts (frontend/src/locales); Home Assistant translates
the config flow and service errors from translations/. The texts here are the
few that Theme Studio puts together on its own: the notifications from the
export and import services. Each file in messages/ has the same keys as
messages/en.json (tests/test_translations.py checks it).
"""

from __future__ import annotations

from functools import lru_cache
import json
from pathlib import Path
from typing import Any

from homeassistant.core import HomeAssistant

from .const import CONF_LANGUAGE, DOMAIN, LANGUAGE_AUTO, LANGUAGES

MESSAGES_DIR = Path(__file__).parent / "messages"
FALLBACK = "en"


def resolve_language(option: Any, home_assistant_language: str | None) -> str:
    """The language option, or Home Assistant's language when it is "auto"."""
    if option in LANGUAGES:
        return str(option)
    base = (home_assistant_language or "").lower().replace("_", "-").split("-")[0]
    if base in ("no", "nn"):
        return "nb"
    return base if base in LANGUAGES else FALLBACK


def panel_language(options: dict[str, Any]) -> str:
    """What the panel gets: a fixed language, or "auto" for each person's own."""
    value = options.get(CONF_LANGUAGE, LANGUAGE_AUTO)
    return value if value in LANGUAGES else LANGUAGE_AUTO


@lru_cache(maxsize=len(LANGUAGES))
def _table(language: str) -> dict[str, str]:
    """One messages file (blocking: run it in the executor)."""
    try:
        data = json.loads((MESSAGES_DIR / f"{language}.json").read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    return {str(key): str(value) for key, value in data.items()} if isinstance(data, dict) else {}


def _messages(language: str) -> dict[str, str]:
    table = dict(_table(FALLBACK))
    if language != FALLBACK:
        table.update(_table(language))
    return table


async def async_messages(hass: HomeAssistant) -> dict[str, str]:
    """The notification texts in the language set for Theme Studio."""
    entries = hass.config_entries.async_entries(DOMAIN)
    option = None
    if entries:
        option = {**entries[0].data, **entries[0].options}.get(CONF_LANGUAGE)
    language = resolve_language(option, hass.config.language)
    return await hass.async_add_executor_job(_messages, language)
