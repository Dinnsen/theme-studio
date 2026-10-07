import type { IconName } from "./icons";
import type { Settings, Summary } from "./types";

/** A colour the editor shows with an Auto / Manual switch. */
export interface RoleDef {
  id: string;
  label: string;
  /** Where the automatic colour comes from: a summary colour or a CSS variable. */
  summary?: keyof Summary;
  cssVar?: string;
  /** Either an override setting ("auto" or a hex colour) … */
  override?: string;
  /** … or a switch plus a colour setting. */
  toggle?: string;
  colour?: string;
}

export type Control =
  | { type: "base" }
  | { type: "slider"; key: string; label?: string; ends?: [string, string] }
  | { type: "segmented"; key: string; label: string; options: [string, string][]; hint?: string }
  | { type: "roles"; roles: RoleDef[] }
  | { type: "mirror" };

export interface Group {
  id: string;
  title: string;
  hint?: string;
  collapsible?: boolean;
  controls: Control[];
}

export type SectionId = "colours" | "check";

export interface Section {
  id: SectionId;
  label: string;
  icon: IconName;
  description: string;
  groups: Group[];
}

export const MAIN_ROLES: RoleDef[] = [
  {
    id: "page",
    label: "Page background",
    summary: "page",
    toggle: "use_custom_background_color",
    colour: "custom_background_color",
  },
  { id: "card", label: "Cards", summary: "card", override: "card_bg_override" },
  { id: "bubble", label: "Bubble cards", summary: "bubble", override: "bubble_bg_override" },
  { id: "popup", label: "Pop-ups", cssVar: "bubble-pop-up-background-color", override: "popup_bg_override" },
  { id: "navbar", label: "Navbar", summary: "navbar", override: "navbar_bg_override" },
  { id: "accent", label: "Accent", summary: "accent", override: "accent_color_override" },
  { id: "slider", label: "Bubble slider", summary: "slider", override: "bubble_slider_color_override" },
  { id: "text", label: "Text", summary: "text", toggle: "use_custom_text_color", colour: "custom_text_color" },
  { id: "secondary", label: "Secondary text", summary: "secondary", override: "secondary_text_color_override" },
  { id: "icon", label: "Icons", summary: "icon", toggle: "use_custom_icon_color", colour: "custom_icon_color" },
  { id: "active", label: "Active icons", summary: "active", override: "state_icon_active_color_override" },
  {
    id: "navicon",
    label: "Navbar icons",
    summary: "nav_icon",
    toggle: "use_custom_navbar_icon_color",
    colour: "custom_navbar_icon_color",
  },
];

export const MORE_ROLES: RoleDef[] = [
  {
    id: "headerbg",
    label: "Header background",
    cssVar: "app-header-background-color",
    override: "app_header_background_color_override",
  },
  { id: "headertext", label: "Header text", cssVar: "app-header-text-color", override: "app_header_text_color_override" },
  {
    id: "secondarybg",
    label: "Secondary background",
    cssVar: "secondary-background-color",
    override: "secondary_background_color_override",
  },
  { id: "divider", label: "Dividers", cssVar: "divider-color", override: "divider_color_override" },
  { id: "sidebaricon", label: "Sidebar icons", cssVar: "sidebar-icon-color", override: "sidebar_icon_color_override" },
  { id: "disabled", label: "Disabled text", cssVar: "disabled-text-color", override: "disabled_text_color_override" },
];

export const ALL_ROLES = [...MAIN_ROLES, ...MORE_ROLES];

/** Which colours take part in each contrast pair (see CONTRAST_PAIRS in the engine). */
export const PAIR_ROLES: Record<string, string[]> = {
  text_page: ["text", "page"],
  text_card: ["text", "card"],
  secondary_text_card: ["secondary", "text", "card"],
  icon_card: ["icon", "card"],
  active_icon_card: ["active", "card"],
  text_bubble: ["text", "bubble"],
  icon_bubble: ["icon", "bubble"],
  text_popup: ["text", "popup"],
  navbar_icon: ["navicon", "navbar"],
  header_text: ["headertext", "headerbg"],
  sidebar_icon: ["sidebaricon", "page"],
  text_on_accent: ["accent"],
  accent_page: ["accent", "page"],
  text_sub_button: ["text", "bubble"],
};

export const SECTIONS: Section[] = [
  {
    id: "colours",
    label: "Colours",
    icon: "palette",
    description: "Start with one base colour. Everything set to Auto is worked out from it and kept readable.",
    groups: [
      { id: "base", title: "Base colour", controls: [{ type: "base" }] },
      {
        id: "adjust",
        title: "Adjust",
        controls: [
          { type: "slider", key: "contrast", label: "Contrast", ends: ["Soft", "Strong"] },
          { type: "slider", key: "saturation", label: "Saturation", ends: ["Muted", "Vivid"] },
          { type: "slider", key: "tone", label: "Tone", ends: ["Darker", "Lighter"] },
          { type: "slider", key: "hue_shift", label: "Hue shift" },
          { type: "slider", key: "accent_strength", label: "Accent strength" },
          { type: "slider", key: "neutrality", label: "Neutral surfaces", ends: ["Tinted", "Neutral"] },
          {
            type: "segmented",
            key: "preview_mode",
            label: "Style",
            options: [
              ["Relaxed", "Relaxed"],
              ["Focused", "Focused"],
              ["Vibrant", "Vibrant"],
            ],
          },
          {
            type: "segmented",
            key: "color_model",
            label: "Colour model",
            options: [
              ["hsl", "Classic"],
              ["oklch", "Even (OKLCH)"],
            ],
            hint: "Even keeps shades equally bright across colours, so a yellow and a blue theme feel the same.",
          },
        ],
      },
      {
        id: "roles",
        title: "Colours in use",
        hint: "Manual colours are never changed by Theme Studio. Tap a manual swatch to pick a colour.",
        controls: [{ type: "roles", roles: MAIN_ROLES }],
      },
      {
        id: "more",
        title: "More colours",
        collapsible: true,
        controls: [{ type: "roles", roles: MORE_ROLES }],
      },
      {
        id: "finetune",
        title: "Fine-tune per surface",
        collapsible: true,
        controls: [
          { type: "slider", key: "surface_lift" },
          { type: "slider", key: "accent_contrast" },
          { type: "slider", key: "accent_hue_shift" },
          { type: "slider", key: "accent_saturation" },
          { type: "slider", key: "card_bg_contrast" },
          { type: "slider", key: "card_bg_hue_shift" },
          { type: "slider", key: "card_bg_saturation" },
          { type: "slider", key: "bubble_bg_contrast" },
          { type: "slider", key: "bubble_bg_hue_shift" },
          { type: "slider", key: "bubble_bg_saturation" },
          { type: "slider", key: "popup_bg_contrast" },
          { type: "slider", key: "popup_bg_hue_shift" },
          { type: "slider", key: "popup_bg_saturation" },
          { type: "slider", key: "bubble_slider_contrast" },
          { type: "slider", key: "bubble_slider_hue_shift" },
          { type: "slider", key: "bubble_slider_saturation" },
          { type: "slider", key: "bubble_slider_opacity" },
        ],
      },
      { id: "mirror", title: "Light and Dark", controls: [{ type: "mirror" }] },
    ],
  },
  {
    id: "check",
    label: "Check",
    icon: "contrast",
    description: "Every text and icon colour against what it sits on.",
    groups: [],
  },
];

export function isManual(role: RoleDef, settings: Settings): boolean {
  if (role.override) {
    const value = String(settings[role.override] ?? "auto").trim().toLowerCase();
    return value !== "" && value !== "auto";
  }
  if (role.toggle) {
    const value = settings[role.toggle];
    return value === true || value === "on";
  }
  return false;
}

export function manualValue(role: RoleDef, settings: Settings): string {
  const key = role.override ?? role.colour;
  return key ? String(settings[key] ?? "") : "";
}

export function setManual(role: RoleDef, hex: string): Settings {
  if (role.override) {
    return { [role.override]: hex };
  }
  if (role.toggle && role.colour) {
    return { [role.toggle]: "on", [role.colour]: hex };
  }
  return {};
}

export function setAuto(role: RoleDef): Settings {
  if (role.override) {
    return { [role.override]: "auto" };
  }
  if (role.toggle) {
    return { [role.toggle]: "off" };
  }
  return {};
}
