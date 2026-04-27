# Theme Studio

<p align="center">
  <img src="https://raw.githubusercontent.com/Dinnsen/theme-studio/main/docs/assets/logo.png" width="300">
</p>

[![GitHub Release][releases-shield]][releases]
[![GitHub All Releases][download-all-shield]][releases]
[![HACS][hacs-shield]][hacs]
[![BuyMeCoffee][buymecoffee-shield]][buymecoffee]

Theme Studio for Home Assistant is a full dynamic theming system that lets you build, customize, and generate complete Home Assistant themes with live preview.

- generates full themes based on a base color
- live-updating **Theme Studio** while editing
- supports separate **Light** and **Dark** theme workflows
- supports custom background images
- includes 10 **Built-in Themes** and allows custom user themes
- builds final themes as YAML for Home Assistant

## Table of content

- [Requirements](#requirements)
- [Installation](#installation)
- [Workflow](#workflow)
- [Notes](#notes)
- [Fonts](#fonts)
- [Navbar (Theme Studio integration)](#navbar-theme-studio-integration)

## What this package installs

After installing the integration and adding it in Home Assistant, call the service `theme_studio.initialize_assets` once. The integration writes these files into your config directory:


## Requirements

Install these custom cards first:

- [button-card](https://github.com/custom-cards/button-card)
- [bubble-card](https://github.com/Clooos/Bubble-Card)
- [mod-card](https://github.com/thomasloven/lovelace-card-mod)
- [simple-swipe-card](https://github.com/danimart1991/simple-swipe-card)

## Installation

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Dinnsen&repository=theme-studio&category=Integration)

1. Install this repository with HACS as an **integration**.
2. Restart Home Assistant.
3. Add **Theme Studio** in **Settings → Devices & Services**.
4. Call the service `theme_studio.initialize_assets`.
5. Make sure your `configuration.yaml` contains:

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

6. Restart Home Assistant again.
7. In your HA user profile, select **Theme Studio Dynamic** while editing.

## Workflow

1. Open **Theme Studio** dashboard.
2. Create or select a preset.
3. Adjust settings with live preview.
4. Save **Light** and **Dark** slots.
5. Build the final theme YAML.
6. Select the built theme in your HA user profile.

## Notes

- Included starter presets: **Glass** and **MD3**.
- Presets live in `/config/theme_studio/presets`.
- Built themes live in `/config/themes/theme_studio`.
- This package ships a bootstrap dynamic theme so the editor always has a live theme target.

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


[releases-shield]: https://img.shields.io/github/v/release/Dinnsen/theme-studio?style=for-the-badge
[download-all-shield]: https://img.shields.io/github/downloads/Dinnsen/theme-studio/total?style=for-the-badge
[hacs-shield]: https://img.shields.io/badge/HACS-Custom-blue.svg?style=for-the-badge
[buymecoffee-shield]: https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge
[releases]: https://github.com/Dinnsen/theme-studio/releases
[hacs]: https://github.com/hacs/integration
[buymecoffee]: https://buymeacoffee.com/dinnsen

