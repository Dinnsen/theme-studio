# Changelog

All notable changes to Theme Studio. Versions follow [semantic versioning](https://semver.org/); the version is the one in `custom_components/theme_studio/manifest.json`.

## [1.0.3] - 2026-10-08

### Fixed
- After *Reload themes*, Theme Studio reads its theme files again, so a theme whose file was removed by hand leaves the theme list instead of coming back.

## [1.0.2] - 2026-10-08

### Fixed
- *Use theme → Everyone* now also switches the device you are on to the default theme. Before, a theme picked in your own profile kept winning, so nothing seemed to happen. People who picked their own theme in their profile keep it.
- The release workflow no longer fails when a release was published by hand.

## [1.0.1] - 2026-10-08

### Fixed
- Icons kept the theme's icon colour even where a card sets its own (a lit lamp, a white logo on a dark badge, icons on pictures): themes no longer set `icon-primary-color` and `icon-secondary-color`.
- Theme files you already use are rebuilt when Theme Studio starts, so fixes like this reach them without pressing *Use theme* again. Only themes with a file in `/config/themes/theme_studio/` are rebuilt, and only when their content changes.

## [1.0.0] - 2026-10-08

Theme Studio is now the panel in the sidebar. Installing it is HACS, restart, add the integration; nothing has to be added to `configuration.yaml`.

### Removed
- The YAML dashboard, its package (scripts, automations, template sensors), the 110 editor helpers, the catalog and contrast sensors and the live theme *Theme Studio Dynamic*. The panel does everything they did.
- Services only the dashboard used: `generate`, `save`, `load`, `save_as_new`, `undo`, `copy_variant`, `copy_preset`, `palette_from_image`, `refresh_catalogs`, `set_options`.

### Changed
- `theme_studio.theme_from_image` needs the `image` field.
- The settings the panel edits are defined in `settings.json`.

### Update notes
- On the first start the old dashboard files are renamed to `.bak_YYYYMMDD_HHMMSS`, the generated preset previews are deleted and the old entities are removed. User themes, built themes, images and exports are kept.
- *Settings → Repairs* asks for one more restart, and to remove the `theme-studio` dashboard block from `configuration.yaml` while it is still there.
- See [Updating from 0.x](https://github.com/Dinnsen/theme-studio#updating-from-0x).

## [0.13.0] - 2026-10-08
### Added
- *Use theme* on this device or for everyone, from the panel.
- Share code and theme file download; *Import* on the start page.
- Theme Studio's themes appear in Home Assistant without the YAML include.
- Bundled fonts (Inter, Quicksand, Josefin Sans, Orbitron, Iosevka Charon Mono), loaded on every page without Google Fonts; your own font file is loaded too.

## [0.12.1] - 2026-10-08
### Fixed
- Chip corners show in the panel preview; image visibility comes first in Background.

## [0.12.0] - 2026-10-08
### Added
- Surfaces, Background (with image upload) and Type sections in the panel, with border, shadow and overlay tiles.

## [0.11.0] - 2026-10-08
### Added
- Edit themes in the panel: autosave, Undo/Redo, new theme from a preset, a colour or an image, delete with backup, contrast check with *Use Auto*.

## [0.10.0] - 2026-10-07
### Added
- The Theme Studio panel in the sidebar (view only): theme library and live preview on phone, tablet and computer.

## [0.9.1] - 2026-10-07
### Fixed
- The preview is rebuilt when the colour model changes.

## [0.9.0] - 2026-10-07
### Added
- OKLCH colour model.
### Changed
- Save and load run inside the integration; the per-variant helper copies are removed.

## [0.8.2] - 2026-10-07
### Added
- Theme from image and contrast badges.

## [0.8.1] - 2026-10-07
### Changed
- Undo replaces Reset; previews for user themes.

## [0.8.0] - 2026-10-07
### Added
- Undo, sharing (export, import, share strings), colours from images, preset previews.

## [0.7.1] - 2026-10-07
### Fixed
- Every built-in preset passes the contrast check.

## [0.7.0] - 2026-10-07
### Added
- Automatic colours chosen by WCAG contrast, and contrast warnings.

## [0.6.1] - 2026-10-07
### Fixed
- Leftover helpers are removed; clean entity names.

## [0.6.0] - 2026-10-07
### Changed
- Services in Python instead of shell commands; editor helpers owned by the integration.

## [0.5.1] - 2026-10-07
### Changed
- Card blur is opt-in; the editor keeps its state across restarts.

## [0.5.0] - 2026-10-07
### Changed
- Themes use Home Assistant's native variables; legacy variables removed.

Earlier versions (0.1–0.4, April–May 2026) built the original YAML dashboard and theme generator.

[1.0.3]: https://github.com/Dinnsen/theme-studio/releases/tag/v1.0.3
[1.0.2]: https://github.com/Dinnsen/theme-studio/releases/tag/v1.0.2
[1.0.1]: https://github.com/Dinnsen/theme-studio/releases/tag/v1.0.1
[1.0.0]: https://github.com/Dinnsen/theme-studio/releases/tag/v1.0.0
[0.13.0]: https://github.com/Dinnsen/theme-studio/pull/43
[0.12.1]: https://github.com/Dinnsen/theme-studio/pull/42
[0.12.0]: https://github.com/Dinnsen/theme-studio/pull/41
[0.11.0]: https://github.com/Dinnsen/theme-studio/pull/40
[0.10.0]: https://github.com/Dinnsen/theme-studio/pull/39
[0.9.1]: https://github.com/Dinnsen/theme-studio/pull/38
[0.9.0]: https://github.com/Dinnsen/theme-studio/pull/37
[0.8.2]: https://github.com/Dinnsen/theme-studio/pull/36
[0.8.1]: https://github.com/Dinnsen/theme-studio/pull/35
[0.8.0]: https://github.com/Dinnsen/theme-studio/pull/34
[0.7.1]: https://github.com/Dinnsen/theme-studio/pull/33
[0.7.0]: https://github.com/Dinnsen/theme-studio/pull/32
[0.6.1]: https://github.com/Dinnsen/theme-studio/pull/31
[0.6.0]: https://github.com/Dinnsen/theme-studio/pull/30
[0.5.1]: https://github.com/Dinnsen/theme-studio/releases/tag/v0.5.1
[0.5.0]: https://github.com/Dinnsen/theme-studio/releases/tag/v0.5.0
