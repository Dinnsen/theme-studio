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
  <a href="https://github.com/Dinnsen/theme-studio/releases"><img src="https://img.shields.io/github/downloads/Dinnsen/theme-studio/total?style=for-the-badge"></a>
  <a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-blue.svg?style=for-the-badge"></a>
  <a href="https://buymeacoffee.com/dinnsen"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-ffdd00?style=for-the-badge"></a>
</p>

---

## ✨ Features

- 🎨 Generate full themes from a **single base color**
- ⚡ Live preview while editing
- 🌗 Separate **Light / Dark** workflows
- 🧩 Built-in presets + custom user themes
- 🖼️ Background images & overlays
- 🧠 Smart color system (Material You inspired)
- 📦 Full YAML theme export



## 🖼️ Preview

> Add screenshots/GIFs here (recommended)

```
/docs/assets/preview-1.png
/docs/assets/preview-2.gif
```



## 🚀 Installation

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Dinnsen&repository=theme-studio&category=integration)

### Step-by-step

1. Install via **HACS (Integration)**
2. Restart Home Assistant
3. Add **Theme Studio** (Settings → Devices & Services)

     👉 Assets install automatically
5. Update `configuration.yaml`

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

5. Restart Home Assistant again

[![Open your Home Assistant profile](https://my.home-assistant.io/badges/profile.svg)](https://my.home-assistant.io/redirect/profile/)

7. In your HA user profile, select **Theme Studio Dynamic** while editing.



## 🧭 Workflow

1. Open Theme Studio dashboard
2. Choose preset or create new
3. Adjust colors, surfaces, FX
4. Save Light & Dark variants
5. Build theme
6. Select in your profile



## 📂 File Structure

```
/config/theme_studio/
  presets/
  user_themes/
  scripts/

/config/themes/theme_studio/
/config/packages/
/config/lovelace/
```



## 🧠 How it works

Theme Studio generates a dynamic theme based on:

- Base color
- Color adjustments
- Manual overrides
- Surface & FX system

Everything updates live using Home Assistant variables.



## 🔤 Fonts

[![Open Home Assistant resources](https://my.home-assistant.io/badges/lovelace_resources.svg)](https://my.home-assistant.io/redirect/lovelace_resources/)

Add these in
Dashboard → ⋮ → Resources → Add resource → Type: Stylesheet

```yaml
https://fonts.googleapis.com/css2?family=Inter
```

```yaml
https://fonts.googleapis.com/css2?family=Orbitron
```

```yaml
https://fonts.googleapis.com/css2?family=Quicksand
```

```yaml
https://fonts.googleapis.com/css2?family=Iosevka+Charon+Mono
```

```yaml
https://fonts.googleapis.com/css2?family=Josefin+Sans
```



## 🧩 Navbar integration

```yaml
decluttering_templates:
  navbar_theme_studio:
    card:
      type: custom:navbar-card
```



## 💡 Tips

- Restart is required after install
- Use dark/light variants properly
- Keep user themes separate from presets



## ❤️ Support

If you like this project:

👉 https://buymeacoffee.com/dinnsen



## 📈 SEO Keywords

home assistant theme  
home assistant themes  
material you home assistant  
home assistant dashboard theme  
lovelace theme generator  

---

