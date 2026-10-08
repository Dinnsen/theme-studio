## What does this change?

<!-- Describe the change and why it is needed. Link the issue it fixes, if any. -->

## Checklist

- [ ] `python -m pytest` passes.
- [ ] If the panel changed: `npm run typecheck` and `npm run build` in `frontend/`, and the rebuilt `theme-studio-panel.js` is committed.
- [ ] User themes in `/config/theme_studio/user_themes/` are never overwritten, renamed or deleted automatically.
- [ ] Light and Dark stay separate: saving one never changes the other.
- [ ] `strings.json` and `translations/en.json` are in step with `services.yaml`.
- [ ] README and CHANGELOG are updated if behaviour changed.
- [ ] Tested on a Home Assistant instance (which version?).
