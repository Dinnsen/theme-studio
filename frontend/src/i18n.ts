import da from "./locales/da.json";
import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import nb from "./locales/nb.json";
import sv from "./locales/sv.json";

/**
 * The panel's texts. English is the source; every other file has the same
 * keys (tests/test_translations.py checks it). Unknown keys fall back to
 * English and then to the key itself.
 */
export type Lang = "da" | "de" | "en" | "es" | "fr" | "nb" | "sv";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "da", label: "Dansk" },
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "nb", label: "Norsk" },
  { code: "sv", label: "Svenska" },
];

const TABLES: Record<Lang, Record<string, string>> = { da, de, en, es, fr, nb, sv };

let current: Lang = "en";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && value in TABLES;
}

/** Home Assistant's language code (for example "da", "nb", "en-GB") as one of ours. */
export function fromHomeAssistant(code: string | undefined): Lang {
  const base = (code ?? "").toLowerCase().split(/[-_]/)[0];
  if (base === "no" || base === "nn") {
    return "nb";
  }
  return isLang(base) ? base : "en";
}

export function setLanguage(lang: Lang): void {
  current = lang;
}

export function language(): Lang {
  return current;
}

/** The translation of `key`, or `fallback` when there is no text for it. */
export function tOr(key: string, fallback: string): string {
  return key in TABLES.en ? t(key) : fallback;
}

export function t(key: string, params?: Record<string, string | number>): string {
  const text = TABLES[current][key] ?? TABLES.en[key] ?? key;
  if (!params) {
    return text;
  }
  return text.replace(/\{([a-z_]+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match));
}
