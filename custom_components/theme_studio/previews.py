"""The main colours of a built theme variant, for the panel's theme cards."""

from __future__ import annotations

from types import ModuleType
from typing import Any


def _solid(cli: ModuleType, values: dict[str, Any], key: str, backdrop) -> tuple:
    colour = cli.parse_css_color(cli._resolve_var(values, values.get(key, "")))
    return cli.composite(colour, backdrop) if colour else backdrop


def _hex(colour) -> str:
    return "#%02x%02x%02x" % tuple(round(c * 255) for c in colour[:3])


def summary_colours(cli: ModuleType, values: dict[str, Any]) -> dict[str, str]:
    """The main colours of a built variant as opaque hex, as they look on screen."""
    white = (1.0, 1.0, 1.0, 1.0)
    page = _solid(cli, values, "background-color", white)
    card = _solid(cli, values, "ha-card-background", page)
    bubble = _solid(cli, values, "bubble-main-background-color", page)
    navbar = _solid(cli, values, "theme-studio-navbar-background-color", page)
    return {
        "page": _hex(page),
        "card": _hex(card),
        "bubble": _hex(bubble),
        "navbar": _hex(navbar),
        "text": _hex(_solid(cli, values, "primary-text-color", card)),
        "secondary": _hex(_solid(cli, values, "secondary-text-color", card)),
        "icon": _hex(_solid(cli, values, "state-icon-color", card)),
        "active": _hex(_solid(cli, values, "state-icon-active-color", card)),
        "accent": _hex(_solid(cli, values, "accent-color", page)),
        "slider": _hex(_solid(cli, values, "bubble-accent-color", bubble)),
        "nav_icon": _hex(_solid(cli, values, "theme-studio-navbar-primary-color", navbar)),
    }

