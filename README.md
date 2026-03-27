# Theme Studio

Theme Studio is a Home Assistant custom integration that bootstraps a live theme editor, preset storage, and build workflow for generated Home Assistant themes.

## What this package installs

After installing the integration and adding it in Home Assistant, call the service `theme_studio.initialize_assets` once. The integration writes these files into your config directory:

- `/config/packages/theme_studio.yaml`
- `/config/lovelace/theme_studio_dashboard.yaml`
- `/config/theme_studio/scripts/theme_studio_cli.py`
- `/config/theme_studio/presets/glass.json`
- `/config/theme_studio/presets/md3.json`
- `/config/themes/theme_studio/theme_studio_dynamic.yaml`

The installed assets then provide:

- live-updating **Theme Studio Dynamic** while editing
- save/load **Light** and **Dark** editor slots
- preset files as JSON
- built theme YAML output in `/config/themes/theme_studio`
- a YAML dashboard for the Theme Studio UI

## Requirements

Install these custom cards first:

- `button-card`
- `bubble-card`
- `mod-card`
- `simple-swipe-card`

## Installation

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

## Before publishing your own fork

Update these files with your real GitHub repository details:

- `custom_components/theme_studio/manifest.json`
  - `documentation`
  - `issue_tracker`
  - `codeowners`

