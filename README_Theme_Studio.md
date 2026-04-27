# Theme Studio

![Theme Studio](https://raw.githubusercontent.com/Dinnsen/theme-studio/main/docs/assets/logo.png)

[![GitHub Release][releases-shield]][releases]
[![GitHub All Releases][download-all-shield]][releases]
[![HACS][hacs-shield]][hacs]
[![BuyMeCoffee][buymecoffee-shield]][buymecoffee]

Theme Studio for Home Assistant is a full dynamic theming system that lets you build, customize, and generate complete Home Assistant themes with live preview.

The integration:
- generates full themes based on a base color
- supports separate Light and Dark theme workflows
- provides automatic Material You–inspired color systems
- allows full manual color overrides
- includes advanced controls (contrast, hue, saturation, tone, neutrality)
- includes Surface FX (borders, shadows, blur)
- supports background images and overlays
- stores presets as JSON
- allows custom user themes
- builds final themes as YAML for Home Assistant

---

## Table of content
- Installation
- Setup
- Basic usage
- Fonts
- Navbar (Theme Studio integration)
- Presets & themes
- Generated files
- Development
- Removal

---

# Installation

### Option 1 - HACS
- Ensure HACS is installed.
- Add this repository as a custom repository in HACS with category Integration.
- Install Theme Studio.
- Restart Home Assistant.

### Option 2 - Manual
- Download the latest release.
- Copy `custom_components/theme_studio` into your Home Assistant `custom_components` folder.
- Restart Home Assistant.

---

# Setup

1. Go to Settings → Devices & Services
2. Add Theme Studio
3. Call service:

theme_studio.initialize_assets

4. Ensure your configuration.yaml contains required includes

5. Restart Home Assistant

---

# Basic usage

1. Open Theme Studio dashboard
2. Select or create a preset
3. Adjust settings (live preview updates instantly)
4. Save Light theme
5. Switch to Dark mode and configure
6. Save Dark theme
7. Build theme
8. Select built theme in your profile

---

# Fonts

Navigate to:
Edit Dashboard → ⋮ → Manage resources

Add:

https://fonts.googleapis.com/css2?family=Inter
https://fonts.googleapis.com/css2?family=Iosevka+Charon+Mono
https://fonts.googleapis.com/css2?family=Josefin+Sans
https://fonts.googleapis.com/css2?family=Orbitron
https://fonts.googleapis.com/css2?family=Quicksand

Set as Stylesheet and reload browser.

---

# Navbar (Theme Studio integration)

Use decluttering template:

decluttering_templates:
  navbar_theme_studio:
    card:
      type: custom:navbar-card

Then apply CSS variables via theme or card_mod.

---

# Presets & themes

Stored in:
/config/theme_studio/
/config/themes/theme_studio/

---

# Generated files

Dynamic theme:
/config/themes/theme_studio/theme_studio_dynamic.yaml

---

# Development

/config/theme_studio/scripts/theme_studio_cli.py

---

# Removal

Delete integration from Home Assistant settings.

---

[releases-shield]: https://img.shields.io/github/v/release/Dinnsen/theme-studio?style=for-the-badge
[download-all-shield]: https://img.shields.io/github/downloads/Dinnsen/theme-studio/total?style=for-the-badge
[hacs-shield]: https://img.shields.io/badge/HACS-Custom-blue.svg?style=for-the-badge
[buymecoffee-shield]: https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge
[releases]: https://github.com/Dinnsen/theme-studio/releases
[hacs]: https://github.com/hacs/integration
[buymecoffee]: https://buymeacoffee.com/dinnsen
