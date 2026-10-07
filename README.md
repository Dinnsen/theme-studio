# Theme Studio

<p align="center">
  <img src="https://raw.githubusercontent.com/Dinnsen/theme-studio/main/docs/assets/logo.png" width="300">
</p>

<p align="center">
  <b>Advanced dynamic theming system for Home Assistant</b><br>
  Build, customize and generate complete themes with live preview.
</p>

<p align="center">
  <a href="https://github.com/Dinnsen/theme-studio/releases"><img src="https://img.shields.io/github/v/release/Dinnsen/theme-studio?style=for-the-badge"></a>
  <a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-blue.svg?style=for-the-badge"></a>
  <a href="https://buymeacoffee.com/dinnsen"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge"></a>
</p>

---

## Features

- Generate full themes from a **single base color**
- Live preview while editing
- Separate **Light / Dark** workflows
- Built-in presets + custom user themes
- Background images & overlays
- Smart color system, including Home Assistant's own primary color scale (buttons, switches and sliders follow your accent)
- Full YAML theme export that works on its own – no card-mod needed for the exported theme

## Table of Content

- [Requirements](#requirements)
- [Installation](#installation)
- [Workflow](#workflow)
- [What Theme Studio changes](#what-theme-studio-changes)
- [File Structure](#file-structure)
- [Fonts](#fonts)
- [Theme variables for your own dashboards](#theme-variables-for-your-own-dashboards)
- [Recommended recorder settings](#recommended-recorder-settings)
- [Uninstall](#uninstall)

## Preview

<p align="center">
  <img src="docs/assets/preview.png" alt="Preview" width="500">
</p>

## Requirements

- Home Assistant **2026.3** or newer.
- These custom cards (used by the Theme Studio dashboard – not by the generated themes):
  - [button-card](https://github.com/custom-cards/button-card)
  - [Bubble Card](https://github.com/Clooos/Bubble-Card) 3.x
  - [card-mod](https://github.com/thomasloven/lovelace-card-mod) 4.2 or newer (also provides `mod-card`)
  - [Simple Swipe Card](https://github.com/nutteloost/simple-swipe-card)
  - [Navbar card](https://github.com/joseluis9595/lovelace-navbar-card)
  - [Decluttering card](https://github.com/custom-cards/decluttering-card)

## Installation

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Dinnsen&repository=theme-studio&category=integration)

### Step-by-step

1. Install via **HACS (Integration)**.
2. Restart Home Assistant.
3. Add **Theme Studio** from Settings -> Devices & Services. Assets install automatically into the standard `/config` folders.
4. Update `configuration.yaml`.

```yaml
homeassistant:
  packages: !include_dir_named packages

frontend:
  themes: !include_dir_merge_named themes

lovelace:
  dashboards:
    theme-studio:
      mode: yaml
      title: Theme Studio
      icon: mdi:palette
      show_in_sidebar: true
      filename: /config/lovelace/theme_studio_dashboard.yaml
```

The dashboard path **must** be `theme-studio`; the navigation bar links to `/theme-studio/...`.

5. Add [Fonts](#fonts) as **Resources**.
6. Restart Home Assistant again.
7. Open the Theme Studio dashboard. Every view uses the **Theme Studio Dynamic** theme, so the live preview works without changing your profile.
8. For the rest of Home Assistant, pick **Theme Studio Standard** (or one of your own built themes) in your profile or as the default theme. It has a light and a dark mode and is not affected while you experiment in the studio.

### Which theme is which

| Theme | Use it for |
| --- | --- |
| Theme Studio Dynamic | Live preview. Changes the moment you move a slider and shows one variant (light or dark) at a time. Used automatically by the Theme Studio dashboard. |
| Theme Studio Standard | Ready-made theme with light and dark mode, built from the default values. A safe default for your dashboards. |
| Your built themes | Press **Build theme** to export a user theme with both its light and dark variant. |

### Updating

Theme Studio copies its managed files into `/config` when the integration starts. Home Assistant has already loaded the package by then, so **restart twice after an update** to run the new package.

## Workflow

1. Open Theme Studio dashboard.
2. Choose a **Built-In Preset** as starting point.
3. Type in a **Theme Name** and press **Save as new**.
4. Adjust colors, surfaces, and FX.
5. Save Light/Dark **Preset Mode** before switching.
6. **Build theme**.
7. Select **Theme** in your user profile or use Theme Studio directly.

<p align="center">
  <img src="docs/assets/startup.png" alt="Startup" width="700">
</p>

## What Theme Studio changes

- **Managed files are overwritten on start.** The package, dashboard, presets, CLI script and bundled theme are refreshed every time the integration starts. A changed file is backed up first as `<file>.bak_YYYYMMDD_HHMMSS`. Turn off *Overwrite managed files* in the integration options to keep your own edits. User themes in `/config/theme_studio/user_themes/` are never touched.
- **Your default theme is left alone.** Theme Studio only sets *Theme Studio Dynamic* as the Home Assistant default theme when `input_boolean.theme_studio_set_as_default_theme` is on (off by default).
- **No global layout CSS.** Themes no longer hide the header, change view padding or limit the width of sidebar views. Use [Kiosk Mode](https://github.com/NemesisRE/kiosk-mode) or your own card-mod if you want that.

## File Structure

Theme Studio automatically installs the following folders:

```text
/config/theme_studio/
  presets/            built-in presets (managed)
  user_themes/        your themes (never overwritten)
  scripts/            theme_studio_cli.py (managed)

/config/themes/theme_studio_dynamic.yaml          bundled fallback (managed)
/config/themes/theme_studio_standard.yaml         Theme Studio Standard, light + dark (managed)
/config/themes/theme_studio/theme_studio_dynamic.yaml   live preview theme
/config/themes/theme_studio/<your_theme>.yaml     built themes
/config/packages/theme_studio_dynamic.yaml        helpers, scripts, automations (managed)
/config/lovelace/theme_studio_dashboard.yaml      dashboard (managed)
/config/www/background/                           background images
```

## Fonts

[![Open Home Assistant resources](https://my.home-assistant.io/badges/lovelace_resources.svg)](https://my.home-assistant.io/redirect/lovelace_resources/)

Add these in Dashboard -> menu -> Resources -> Add resource -> Type: Stylesheet.

```text
https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700
https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700
https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700
https://fonts.googleapis.com/css2?family=Iosevka+Charon+Mono:wght@400;500;700
https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;700
```

**Custom font:** Theme Studio sets the font family name, but it does not load the font file. Put the file in `/config/www/fonts/` and add a stylesheet resource with an `@font-face` rule that points to `/local/fonts/<file>`.

## Theme variables for your own dashboards

Generated themes expose these variables for use in card-mod, button-card and Bubble Card styles:

| Variable | Purpose |
| --- | --- |
| `--theme-studio-soft-background-color` | Raised surface (chips, tiles) |
| `--theme-studio-panel-background-color` | Recessed panel surface |
| `--theme-studio-sub-button-background-color` | Bubble sub-button surface |
| `--theme-studio-chip-radius` | Chip/button radius |
| `--theme-studio-bubble-slider-color` | Bubble slider fill |
| `--theme-studio-navbar-background-color` | Navbar background |
| `--theme-studio-navbar-primary-color` | Navbar icon color |
| `--theme-studio-card-shadow-css` | Card border effect + shadow |
| `--theme-studio-header-blend-height` | Height of the header fade |
| `--theme-studio-header-blend-enabled` | `1` or `0` |

Cards also get Home Assistant's native variables directly (`--ha-card-background`, `--ha-card-border-radius`, `--ha-card-box-shadow`, `--ha-card-backdrop-filter`, dialog and switch colors and `--ha-color-primary-05` … `--ha-color-primary-95`), so standard cards follow the theme without card-mod.

## Recommended recorder settings

Theme Studio uses about 280 helpers that change often while you edit. Keep them out of the database:

```yaml
recorder:
  exclude:
    entity_globs:
      - "*.theme_studio_*"
```

## Uninstall

1. Remove the integration in Settings -> Devices & Services and uninstall it in HACS.
2. Remove the `theme-studio` dashboard block from `configuration.yaml`.
3. Delete the managed files listed under [File Structure](#file-structure). Keep `/config/theme_studio/user_themes/` and `/config/themes/theme_studio/` if you want your themes.
4. Restart Home Assistant.

## Functions

<p align="center">
  <img src="docs/assets/functions.png" alt="Functions">
</p>

## Presets

<p align="center">
  <img src="docs/assets/tablet_presets.png" alt="TabletPresets">
</p>

<p align="center">
  <img src="docs/assets/iphone_presets.png" alt="iPhonePresets">
</p>

## Color Palettes

<p align="center">
  <img src="docs/assets/color_palette.png" alt="ColorPalette">
</p>

## Support

If you like this project:

https://buymeacoffee.com/dinnsen
