# Theme Studio panel

Source of the sidebar panel. The built file is committed in
`custom_components/theme_studio/frontend/theme-studio-panel.js`, so HACS users
never build anything.

```bash
cd frontend
npm ci
npm run typecheck
npm run build
```

Commit the rebuilt `theme-studio-panel.js` together with the source change.
The *Panel* workflow fails when the committed file does not match the source.
