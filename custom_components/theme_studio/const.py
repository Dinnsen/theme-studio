"""Constants for Theme Studio."""

from __future__ import annotations

DOMAIN = "theme_studio"
TITLE = "Theme Studio"

PLATFORMS: list[str] = ["button", "number", "select", "sensor", "switch", "text"]

LIVE_THEME_NAME = "Theme Studio Dynamic"

# Paths relative to the Home Assistant config directory.
PRESET_DIR = ("theme_studio", "presets")
USER_THEME_DIR = ("theme_studio", "user_themes")
THEME_OUTPUT_DIR = ("themes", "theme_studio")
LIVE_THEME_FILE = ("themes", "theme_studio", "theme_studio_dynamic.yaml")
BACKGROUND_DIR = ("www", "background")
EXPORT_DIR = ("www", "theme_studio", "exports")
EXPORT_URL = "/local/theme_studio/exports"
IMPORT_DIR = ("theme_studio", "imports")
PREVIEW_DIR = ("www", "theme_studio", "previews")
PREVIEW_URL = "/local/theme_studio/previews"

SELECT_PRESETS = "select.theme_studio_theme_presets"
SELECT_USER_THEMES = "select.theme_studio_user_themes"

SERVICE_INITIALIZE_ASSETS = "initialize_assets"
SERVICE_REINSTALL_ASSETS = "reinstall_assets"
SERVICE_GENERATE = "generate"
SERVICE_SAVE_PRESET = "save_preset"
SERVICE_COPY_PRESET = "copy_preset"
SERVICE_DELETE_USER_THEME = "delete_user_theme"
SERVICE_BUILD_THEME = "build_theme"
SERVICE_REFRESH_CATALOGS = "refresh_catalogs"
SERVICE_SET_OPTIONS = "set_options"
SERVICE_COPY_VARIANT = "copy_variant"
SERVICE_EXPORT_USER_THEME = "export_user_theme"
SERVICE_IMPORT_USER_THEME = "import_user_theme"
SERVICE_UNDO = "undo"
SERVICE_PALETTE_FROM_IMAGE = "palette_from_image"

SIGNAL_CATALOGS_CHANGED = f"{DOMAIN}_catalogs_changed"
SIGNAL_CONTRAST_UPDATED = f"{DOMAIN}_contrast_updated"

# Readable names for the pairs in theme_studio_cli.CONTRAST_PAIRS.
CONTRAST_LABELS: dict[str, str] = {
    "text_page": "Text on page",
    "text_card": "Text on cards",
    "secondary_text_card": "Secondary text on cards",
    "icon_card": "Icons on cards",
    "active_icon_card": "Active icons on cards",
    "text_bubble": "Text on Bubble cards",
    "icon_bubble": "Icons on Bubble cards",
    "text_popup": "Text in pop-ups",
    "navbar_icon": "Navbar icons",
    "header_text": "Header text",
    "sidebar_icon": "Sidebar icons",
    "text_on_accent": "Text on accent (badges, chips)",
    "accent_page": "Accent on page",
    "text_sub_button": "Text on sub-buttons",
}

# CLI argument -> entity that feeds it when the live theme is generated.
# Mirrors the former shell_command.generate_theme_studio_theme one to one.
LIVE_ARGUMENT_ENTITIES: dict[str, str] = {
    "base": "text.theme_studio_theme_base_color",
    "contrast": "number.theme_studio_theme_contrast",
    "hue_shift": "number.theme_studio_theme_hue_shift",
    "saturation": "number.theme_studio_theme_saturation",
    "tone": "number.theme_studio_theme_tone",
    "accent_strength": "number.theme_studio_theme_accent_strength",
    "neutrality": "number.theme_studio_theme_neutrality",
    "card_opacity": "number.theme_studio_theme_card_opacity",
    "blur_strength": "number.theme_studio_theme_blur_strength",
    "radius": "number.theme_studio_theme_radius",
    "chip_radius": "number.theme_studio_theme_chip_radius",
    "use_custom_background_color": "switch.theme_studio_theme_use_custom_background_color",
    "custom_background_color": "text.theme_studio_theme_custom_background_color",
    "use_background_image": "switch.theme_studio_theme_use_background_image",
    "background_image_url": "text.theme_studio_theme_background_image_url",
    "background_overlay": "select.theme_studio_theme_background_overlay",
    "background_overlay_strength": "number.theme_studio_theme_overlay_contrast",
    "background_contrast": "number.theme_studio_theme_background_contrast",
    "enable_header_blend": "switch.theme_studio_theme_enable_header_blend",
    "header_blend_height": "number.theme_studio_theme_header_blend_height",
    "overlay_offset_y": "number.theme_studio_theme_overlay_offset_y",
    "overlay_scale": "number.theme_studio_theme_overlay_scale",
    "overlay_spread": "number.theme_studio_theme_overlay_spread",
    "use_custom_text_color": "switch.theme_studio_theme_use_custom_text_color",
    "custom_text_color": "text.theme_studio_theme_custom_text_color",
    "use_custom_icon_color": "switch.theme_studio_theme_use_custom_icon_color",
    "custom_icon_color": "text.theme_studio_theme_custom_icon_color",
    "use_custom_navbar_icon_color": "switch.theme_studio_theme_use_custom_navbar_icon_color",
    "custom_navbar_icon_color": "text.theme_studio_theme_custom_navbar_icon_color",
    "navbar_bg_override": "text.theme_studio_theme_navbar_bg_override",
    "navbar_bg_opacity": "number.theme_studio_theme_navbar_bg_opacity",
    "bubble_slider_color_override": "text.theme_studio_theme_bubble_slider_color_override",
    "bubble_slider_contrast": "number.theme_studio_theme_bubble_slider_contrast",
    "bubble_slider_hue_shift": "number.theme_studio_theme_bubble_slider_hue_shift",
    "bubble_slider_saturation": "number.theme_studio_theme_bubble_slider_saturation",
    "bubble_slider_opacity": "number.theme_studio_theme_bubble_slider_opacity",
    "accent_contrast": "number.theme_studio_theme_accent_contrast",
    "card_bg_contrast": "number.theme_studio_theme_card_bg_contrast",
    "bubble_bg_contrast": "number.theme_studio_theme_bubble_bg_contrast",
    "popup_bg_contrast": "number.theme_studio_theme_popup_bg_contrast",
    "accent_color_override": "text.theme_studio_theme_accent_color_override",
    "card_bg_override": "text.theme_studio_theme_card_bg_override",
    "bubble_bg_override": "text.theme_studio_theme_bubble_bg_override",
    "popup_bg_override": "text.theme_studio_theme_popup_bg_override",
    "secondary_background_color_override": "text.theme_studio_theme_secondary_background_color_override",
    "secondary_text_color_override": "text.theme_studio_theme_secondary_text_color_override",
    "disabled_text_color_override": "text.theme_studio_theme_disabled_text_color_override",
    "app_header_background_color_override": "text.theme_studio_theme_app_header_background_color_override",
    "app_header_text_color_override": "text.theme_studio_theme_app_header_text_color_override",
    "divider_color_override": "text.theme_studio_theme_divider_color_override",
    "sidebar_icon_color_override": "text.theme_studio_theme_sidebar_icon_color_override",
    "state_icon_color_override": "text.theme_studio_theme_state_icon_color_override",
    "state_icon_active_color_override": "text.theme_studio_theme_state_icon_active_color_override",
    "primary_font_family": "text.theme_studio_theme_primary_font_family",
    "use_custom_font": "switch.theme_studio_theme_use_custom_font",
    "custom_font_family": "text.theme_studio_theme_custom_font_family",
    "custom_font_path": "text.theme_studio_theme_custom_font_path",
    "surface_lift": "number.theme_studio_theme_surface_lift",
    "accent_hue_shift": "number.theme_studio_theme_accent_hue_shift",
    "accent_saturation": "number.theme_studio_theme_accent_saturation",
    "card_bg_hue_shift": "number.theme_studio_theme_card_bg_hue_shift",
    "card_bg_saturation": "number.theme_studio_theme_card_bg_saturation",
    "bubble_bg_hue_shift": "number.theme_studio_theme_bubble_bg_hue_shift",
    "bubble_bg_saturation": "number.theme_studio_theme_bubble_bg_saturation",
    "popup_bg_hue_shift": "number.theme_studio_theme_popup_bg_hue_shift",
    "popup_bg_saturation": "number.theme_studio_theme_popup_bg_saturation",
    "bubble_bg_opacity": "number.theme_studio_theme_bubble_bg_opacity",
    "popup_bg_opacity": "number.theme_studio_theme_popup_bg_opacity",
    "border_type": "select.theme_studio_theme_border_type",
    "shadow_type": "select.theme_studio_theme_shadow_type",
    "bubble_use_fx": "switch.theme_studio_theme_bubble_use_fx",
    "popup_use_fx": "switch.theme_studio_theme_popup_use_fx",
    "border_contrast": "number.theme_studio_theme_border_contrast",
    "border_hue_shift": "number.theme_studio_theme_border_hue_shift",
    "border_saturation": "number.theme_studio_theme_border_saturation",
    "border_opacity": "number.theme_studio_theme_border_opacity",
    "border_size": "number.theme_studio_theme_border_size",
    "shadow_contrast": "number.theme_studio_theme_shadow_contrast",
    "shadow_hue_shift": "number.theme_studio_theme_shadow_hue_shift",
    "shadow_saturation": "number.theme_studio_theme_shadow_saturation",
    "shadow_opacity": "number.theme_studio_theme_shadow_opacity",
    "shadow_size": "number.theme_studio_theme_shadow_size",
}
