# AGENTS.md

Repository: `Dinnsen/theme-studio`
Project: **Theme Studio**
Domain: `theme_studio`
Platform: Home Assistant custom integration + bundled YAML assets.

These instructions apply to the entire repository unless a more specific `AGENTS.md` exists in a subdirectory.

---

# Project purpose

Theme Studio is a Home Assistant theming system that installs and manages bundled assets for a visual theme generator dashboard.

Core goals:

- Generate complete Home Assistant themes from a base color.
- Support separate Light and Dark workflows.
- Support built-in presets and custom user themes.
- Provide live preview for:
  - colors
  - overlays
  - backgrounds
  - borders
  - shadows
  - fonts
  - navbar styling
  - card styling
- Export/build a usable Home Assistant YAML theme.
- Keep installation friendly for HACS users.

---

# Repository structure

Important paths:

```text
custom_components/theme_studio/
  __init__.py
  asset_manager.py
  config_flow.py
  const.py
  manifest.json
  services.yaml
  strings.json
  translations/
  brand/
  templates/
    lovelace/
    packages/
    theme_studio/
      presets/
      scripts/
      user_themes/
    themes/
    www/background/

docs/assets/
tests/
.github/workflows/
hacs.json
README.md
```

---

# Home Assistant integration rules

- Follow Home Assistant custom integration patterns.
- Keep the integration domain as `theme_studio`.
- Keep the config flow enabled unless there is a very specific reason to change it.
- Keep the integration HACS-compatible.
- Do not add runtime dependencies unless absolutely necessary.
- Keep:
  - `manifest.json`
  - `services.yaml`
  - `strings.json`
  - translations
  - config flow
  aligned and synchronized.
- Prefer async Home Assistant APIs when inside the event loop.
- Preserve service response behavior for asset install services.
- Do not remove backward-compatible aliases unless all references and tests are updated.

---

# Asset installation rules

Theme Studio installs bundled files from:

```text
custom_components/theme_studio/templates/
```

into Home Assistant `/config` locations such as:

```text
/config/packages/
/config/lovelace/
/config/themes/
/config/theme_studio/presets/
/config/theme_studio/scripts/
/config/theme_studio/user_themes/
/config/www/background/
```

---

# Critical safety rules

## Never overwrite user themes

Protected runtime path:

```text
/config/theme_studio/user_themes/
```

User themes are runtime data and must never be:

- overwritten
- reset
- deleted
- renamed automatically

Built-in presets are managed assets.

User themes are user-owned runtime data.

---

# Preserve backup behavior

Managed bundled files may be updated with backup support.

Preserve:

```text
.bak_YYYYMMDD_HHMMSS
```

style backups unless intentionally refactored everywhere consistently.

---

# Built-in presets vs user themes

Built-in presets:

```text
custom_components/theme_studio/templates/theme_studio/presets/
/config/theme_studio/presets/
```

User themes:

```text
custom_components/theme_studio/templates/theme_studio/user_themes/
/config/theme_studio/user_themes/
```

Rules:

- Built-in presets are read-only from the user perspective.
- User themes are editable and user-owned.
- Never mix preset files and user theme files.
- Never save user themes into the preset folder.
- Never save presets into the user theme folder.
- Do not make presets depend on generated runtime user themes.
- Do not hardcode `auto` decisions into preset JSON when Theme Studio build logic should resolve them dynamically.

---

# Theme logic rules

## Manual overrides must stay manual

Color adjustments should affect:

- auto-generated colors

Manual color overrides must NOT be modified by adjustment logic except intentional opacity handling.

---

# Light/Dark workflow rules

Theme Studio supports separate:

- Light variants
- Dark variants

Rules:

- Saving Light must not overwrite Dark.
- Saving Dark must not overwrite Light.
- Loading a variant must populate the correct helpers.
- Generated themes must preserve Light/Dark separation.

---

# Theme metadata rules

Generated user themes should not include unnecessary Home Assistant root theme internals unless intentionally required.

Avoid automatically injecting:

```yaml
card-mod-theme:
card-mod-root-yaml:
```

into generated user themes unless the export/build architecture explicitly requires it.

Keep:

- runtime dynamic theme metadata
- exported/generated user themes
- built-in presets

separated when possible.

---

# YAML rules

This repository is heavily YAML-based.

Rules:

- Preserve indentation exactly.
- Avoid compact inline YAML mappings when nesting is involved.
- Avoid placeholders.
- Generate complete copy/paste-ready blocks.
- Preserve existing card structure unless intentionally refactoring.
- Do not convert working YAML into pseudo-cleaned YAML that breaks Home Assistant parsing.

---

# Lovelace rules

Common custom cards:

- `custom:button-card`
- `custom:bubble-card`
- `custom:mod-card`
- `custom:simple-swipe-card`
- `custom:navbar-card`
- `custom:decluttering-card`

Rules:

- Be careful with `card_mod:` nesting.
- Be careful with:
  - `style:`
  - `card_mod: style:`
- Preserve existing dynamic templates unless intentionally refactoring.
- Avoid changing card structure globally unless necessary.

---

# CSS/card-mod rules

Theme Studio uses advanced:

- CSS variables
- card-mod
- Bubble Card styling
- dynamic previews
- live theme rendering

Rules:

- Do not simplify CSS just to make it cleaner.
- Preserve CSS variable fallbacks.
- Preserve dynamic `color-mix()` behavior unless replacing it consistently everywhere.
- Border preview cards must show border effects only.
- Shadow preview cards must show shadow effects only.
- Bubble Card styling may require separate handling from standard Home Assistant cards.
- Do not make global CSS changes that unintentionally affect all dashboard cards.

Navbar styling should use Theme Studio variables where possible:

```css
--theme-studio-navbar-background-color
--theme-studio-navbar-primary-color
```

---

# Helper/entity naming rules

Do not rename helpers unless ALL references are updated.

Common helpers include:

```text
input_text.theme_studio_theme_base_color
input_text.theme_studio_theme_accent_color_override
input_text.theme_studio_theme_card_bg_override
input_text.theme_studio_theme_bubble_bg_override
input_text.theme_studio_theme_popup_bg_override
input_text.theme_studio_theme_navbar_bg_override
input_text.theme_studio_selected_user_theme
input_text.theme_studio_theme_name
input_text.theme_studio_loaded_variant
input_text.theme_studio_busy_message

input_select.theme_studio_theme_presets
input_select.theme_studio_user_themes
input_select.theme_studio_theme_border_type
input_select.theme_studio_theme_shadow_type

input_boolean.theme_studio_theme_bubble_use_fx
input_boolean.theme_studio_theme_popup_use_fx

sensor.theme_studio_preset_index
sensor.theme_studio_selected_preset
```

Rules:

- When adding a helper:
  - update scripts
  - automations
  - templates
  - dashboards
  - docs
  - tests
- When deleting a helper:
  - verify nothing still references it.

---

# Python rules

- Use modern Python typing compatible with the targeted Home Assistant version.
- Keep code explicit and readable.
- Avoid broad exception handling unless setup resilience is required and the exception is logged.
- Keep file operations safe.
- Do not introduce unnecessary network calls.
- Do not add secrets or user-specific paths.

---

# Testing and validation

When changing code:

Recommended checks:

```bash
python -m pytest
python -m compileall custom_components/theme_studio tests
```

Also validate:

- YAML syntax
- Jinja template validity
- Home Assistant entity names
- service names
- Lovelace nesting
- generated paths
- HACS compatibility

---

# Documentation rules

- Keep README aligned with actual behavior.
- Update README if:
  - install flow changes
  - paths change
  - required cards change
  - generated files change
- Prefer relative GitHub image paths where possible.

---

# Output style for AI-generated changes

When generating changes:

- Prefer complete files.
- Prefer complete copy/paste-ready blocks.
- Include exact file paths.
- Avoid vague instructions.
- Avoid placeholders like `...`
- Mention when Home Assistant VM testing is recommended.

---

# High-risk areas

Be extra careful when modifying:

- `asset_manager.py`
- user theme save/load logic
- preset sync logic
- generated theme builder logic
- Light/Dark save/load flows
- dashboard YAML
- card-mod root styling
- Bubble Card border/shadow CSS
- HACS metadata/versioning

---

# Never do these things

- Never overwrite user themes.
- Never merge preset and user theme folders.
- Never remove backup behavior.
- Never change the integration domain.
- Never replace working YAML with pseudo-code.
- Never remove service response support from asset services.
- Never assume Bubble Card styling behaves like standard HA cards.
- Never auto-merge large refactors without review.
