"""Copy one variant (light/dark) to the other without carrying over wrong colours.

A plain copy of the dark variant into light keeps white text, light icons and
dark surfaces, which is how several presets ended up with unreadable light
variants. ``mirror_variant`` copies the shape of the theme (radius, effects,
fonts, opacities, accent) but:

* mirrors the lightness of the base colour and the custom background colour,
* flips the sign of tone and surface lift,
* resets colours that depend on light/dark (text, icons, navbar, header,
  surface overrides) to ``auto`` and switches the custom text/icon/navbar
  colours off, so the engine picks readable colours for the new variant.

Only the copy is changed; the source variant is left as it is.
"""

from __future__ import annotations

import colorsys
import re

VARIANTS = ("light", "dark")

# Colours that only make sense for one variant: reset to "auto".
RESET_TO_AUTO = (
    "card_bg_override",
    "bubble_bg_override",
    "popup_bg_override",
    "navbar_bg_override",
    "secondary_background_color_override",
    "secondary_text_color_override",
    "disabled_text_color_override",
    "app_header_background_color_override",
    "app_header_text_color_override",
    "divider_color_override",
    "sidebar_icon_color_override",
    "state_icon_color_override",
)

# Manual colour switches: turned off so the automatic colours apply.
SWITCH_OFF = (
    "use_custom_text_color",
    "use_custom_icon_color",
    "use_custom_navbar_icon_color",
)

MIRROR_LIGHTNESS = ("base_color", "custom_background_color")
NEGATE = ("tone", "surface_lift")

HEX_RE = re.compile(r"^#?([0-9a-fA-F]{6})$")


def other_variant(variant: str) -> str:
    return "dark" if variant == "light" else "light"


def mirror_lightness(value: str, target: str) -> str:
    """Mirror a hex colour's lightness so it suits the target variant."""
    match = HEX_RE.match(str(value or "").strip())
    if not match:
        return value
    raw = match.group(1)
    r, g, b = (int(raw[i:i + 2], 16) / 255 for i in (0, 2, 4))
    h, lightness, s = colorsys.rgb_to_hls(r, g, b)
    is_light = lightness >= 0.5
    if (target == "light") == is_light:
        return f"#{raw.upper()}"
    r, g, b = colorsys.hls_to_rgb(h, 1 - lightness, s)
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))


def _negate(value: str) -> str:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return value
    return str(-number if number else 0.0)


def mirror_variant(values: dict[str, str], target: str) -> dict[str, str]:
    """Return the values for ``target`` built from the other variant's ``values``.

    ``values`` maps setting names (``base_color``, ``tone`` …) to their state
    strings, as the per-variant entities hold them.
    """
    if target not in VARIANTS:
        raise ValueError(f"Unknown variant: {target}")
    result = dict(values)
    for key in MIRROR_LIGHTNESS:
        if key in result:
            result[key] = mirror_lightness(result[key], target)
    for key in NEGATE:
        if key in result:
            result[key] = _negate(result[key])
    for key in RESET_TO_AUTO:
        if key in result:
            result[key] = "auto"
    for key in SWITCH_OFF:
        if key in result:
            result[key] = "off"
    return result
