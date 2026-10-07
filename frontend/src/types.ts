export interface Hass {
  callWS<T>(message: { type: string; [key: string]: unknown }): Promise<T>;
  themes?: { darkMode?: boolean };
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

export interface VariantDetail extends VariantCard {
  variables: Record<string, string>;
  contrast: ContrastPair[];
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
