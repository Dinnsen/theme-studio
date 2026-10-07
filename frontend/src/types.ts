export interface Hass {
  callWS<T>(message: { type: string; [key: string]: unknown }): Promise<T>;
  themes?: { darkMode?: boolean };
  user?: { is_admin?: boolean };
}

export type SettingValue = string | number | boolean;
export type Settings = Record<string, SettingValue>;

export interface SchemaItem {
  key: string;
  platform: "number" | "text" | "switch" | "select";
  label: string;
  min: number | null;
  max: number | null;
  step: number | null;
  options: string[];
  default: SettingValue | null;
}

export interface Background {
  file: string;
  url: string;
}

export interface Route {
  prefix: string;
  path: string;
}

export interface Summary {
  page: string;
  card: string;
  bubble: string;
  navbar: string;
  text: string;
  secondary: string;
  icon: string;
  active: string;
  accent: string;
  slider: string;
  nav_icon: string;
  radius: number;
  image: string;
}

export interface VariantCard {
  summary: Summary;
  failing: number;
}

export interface ContrastPair {
  key: string;
  label: string;
  ratio: number;
  minimum: number;
  ok: boolean;
}

export interface VariantPreview extends VariantCard {
  variables: Record<string, string>;
  contrast: ContrastPair[];
}

export interface VariantDetail extends VariantPreview {
  settings: Settings;
}

export interface ThemeCard {
  name: string;
  slug: string;
  builtin: boolean;
  light: VariantCard | null;
  dark: VariantCard | null;
}

export interface ThemeDetail {
  name: string;
  slug: string;
  builtin: boolean;
  light: VariantDetail | null;
  dark: VariantDetail | null;
}

export type Variant = "light" | "dark";
export type Device = "phone" | "tablet" | "desktop";
export type Filter = "all" | "mine" | "builtin";
