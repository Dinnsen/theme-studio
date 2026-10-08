"""Constants for Theme Studio."""

from __future__ import annotations

DOMAIN = "theme_studio"
TITLE = "Theme Studio"

# Sidebar panel. Kept at /theme-studio-panel: until v1.0.0 the YAML dashboard
# used /theme-studio, and an old dashboard block in configuration.yaml would
# otherwise clash with it.
PANEL_URL_PATH = "theme-studio-panel"
PANEL_COMPONENT = "theme-studio-panel"
PANEL_TITLE = "Theme Studio"
PANEL_ICON = "mdi:palette-swatch-variant"
PANEL_STATIC_URL = "/theme_studio_static"
PANEL_MODULE = "theme-studio-panel.js"
CONF_SHOW_PANEL = "show_panel"
CONF_PANEL_ADMIN_ONLY = "panel_admin_only"
CONF_REGISTER_THEMES = "register_themes"
CONF_LOAD_FONTS = "load_fonts"

# Paths relative to the Home Assistant config directory.
PRESET_DIR = ("theme_studio", "presets")
USER_THEME_DIR = ("theme_studio", "user_themes")
THEME_OUTPUT_DIR = ("themes", "theme_studio")
BACKGROUND_DIR = ("www", "background")
EXPORT_DIR = ("www", "theme_studio", "exports")
EXPORT_URL = "/local/theme_studio/exports"
IMPORT_DIR = ("theme_studio", "imports")

SERVICE_INITIALIZE_ASSETS = "initialize_assets"
SERVICE_REINSTALL_ASSETS = "reinstall_assets"
SERVICE_SAVE_PRESET = "save_preset"
SERVICE_DELETE_USER_THEME = "delete_user_theme"
SERVICE_BUILD_THEME = "build_theme"
SERVICE_EXPORT_USER_THEME = "export_user_theme"
SERVICE_IMPORT_USER_THEME = "import_user_theme"
SERVICE_THEME_FROM_IMAGE = "theme_from_image"

# Removed in v1.0.0 together with the YAML dashboard (see retirement.py).
RETIRED_THEME_NAME = "Theme Studio Dynamic"

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
