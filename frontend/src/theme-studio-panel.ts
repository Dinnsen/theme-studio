import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import {
  ALL_ROLES,
  PAIR_ROLES,
  SECTIONS,
  isManual,
  manualValue,
  setAuto,
  setManual,
  FONTS,
  type Control,
  type Group,
  type RoleDef,
  type Section,
  type SectionId,
} from "./editor-config";
import { editorStyles } from "./editor-styles";
import { icon } from "./icons";
import { mockStyles, renderMock } from "./mock";
import { panelStyles } from "./styles";
import type {
  Background,
  ContrastPair,
  Device,
  Filter,
  Hass,
  Route,
  SchemaItem,
  Settings,
  Summary,
  ThemeCard,
  ThemeDetail,
  Variant,
  VariantCard,
  VariantPreview,
} from "./types";

const THEME_ROUTE = /^\/theme\/([^/]+)/;
const VARIABLE_NAME = /^[a-z0-9-]+$/;
const UNSAFE_VALUE = /[;{}<>]/;
const HEX = /^#?([0-9a-f]{6})$/i;
const VARIANTS: Variant[] = ["light", "dark"];
const SAVE_DELAY = 900;
const PREVIEW_DELAY = 90;
const COALESCE_MS = 800;
const HISTORY_LIMIT = 60;
const TILE_DELAY = 250;
const LINK_STORAGE = "theme-studio-linked";
const UPLOAD_URL = "/api/theme_studio/background";
const UPLOAD_ERRORS: Record<string, string> = {
  not_an_image: "That file is not an image.",
  unsupported_format: "Use a PNG, JPEG, WebP or GIF image.",
  too_large: "The image is larger than 15 MB.",
};

interface EditState {
  slug: string;
  name: string;
  builtin: boolean;
  settings: Record<Variant, Settings>;
}

interface Snapshot {
  name: string;
  settings: Record<Variant, Settings>;
}

type SaveState = "saved" | "unsaved" | "saving" | "error";
type NewMode = "preset" | "colour" | "image";

function errorText(error: unknown): string {
  if (error && typeof error === "object") {
    const record = error as { code?: unknown; message?: unknown };
    if (record.code === "name_taken") {
      return "That name is already used by another theme.";
    }
    if (record.code === "unauthorized") {
      return "Only administrators can change themes.";
    }
    if ("message" in record) {
      return String(record.message);
    }
  }
  return String(error);
}

/** The theme's variables as CSS custom properties, skipping anything unsafe. */
function themeStyle(variables: Record<string, string>): Record<string, string> {
  const style: Record<string, string> = {};
  for (const [name, value] of Object.entries(variables)) {
    if (VARIABLE_NAME.test(name) && !UNSAFE_VALUE.test(value)) {
      style[`--${name}`] = value;
    }
  }
  return style;
}

function miniBackground(summary: Summary): string {
  if (!summary.image || !summary.image.startsWith("/")) {
    return summary.page;
  }
  const url = encodeURI(summary.image).replace(/'/g, "%27");
  return `linear-gradient(${summary.page}cc, ${summary.page}cc), url('${url}') center / cover`;
}

function readableSummary(pairs: ContrastPair[]): string {
  const failing = pairs.filter((pair) => !pair.ok).length;
  return failing === 0 ? `all ${pairs.length} readable` : `${failing} of ${pairs.length} to check`;
}

/** rgb(), rgba() or color(srgb …) from getComputedStyle as #RRGGBB. */
function cssColourToHex(value: string): string {
  const rgb = /rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i.exec(value);
  let parts: number[] | undefined;
  if (rgb) {
    parts = [rgb[1], rgb[2], rgb[3]].map(Number);
  } else {
    const srgb = /color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/i.exec(value);
    if (srgb) {
      parts = [srgb[1], srgb[2], srgb[3]].map((part) => Number(part) * 255);
    }
  }
  if (!parts) {
    return "";
  }
  return `#${parts
    .map((part) => Math.round(Math.min(255, Math.max(0, part))).toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

function normaliseHex(value: string): string | undefined {
  const match = HEX.exec(value.trim());
  return match ? `#${match[1].toUpperCase()}` : undefined;
}

function cloneSettings(settings: Record<Variant, Settings>): Record<Variant, Settings> {
  return { light: { ...settings.light }, dark: { ...settings.dark } };
}

export class ThemeStudioPanel extends LitElement {
  static override properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    route: { attribute: false },
    panel: { attribute: false },
    _themes: { state: true },
    _loading: { state: true },
    _error: { state: true },
    _filter: { state: true },
    _detailError: { state: true },
    _variant: { state: true },
    _both: { state: true },
    _device: { state: true },
    _edit: { state: true },
    _previews: { state: true },
    _probe: { state: true },
    _section: { state: true },
    _open: { state: true },
    _saveState: { state: true },
    _saveError: { state: true },
    _history: { state: true },
    _future: { state: true },
    _hexDraft: { state: true },
    _dialog: { state: true },
    _toast: { state: true },
    _busy: { state: true },
    _newMode: { state: true },
    _newSource: { state: true },
    _newColour: { state: true },
    _newImage: { state: true },
    _newName: { state: true },
    _backgrounds: { state: true },
    _linked: { state: true },
    _useScope: { state: true },
    _importText: { state: true },
    _inUse: { state: true },
    _tiles: { state: true },
  };

  static override styles = [panelStyles, mockStyles, editorStyles];

  declare hass?: Hass;
  declare narrow: boolean;
  declare route?: Route;
  declare panel?: unknown;
  declare _themes?: ThemeCard[];
  declare _loading: boolean;
  declare _error?: string;
  declare _filter: Filter;
  declare _detailError?: string;
  declare _variant: Variant;
  declare _both: boolean;
  declare _device: Device;
  declare _edit?: EditState;
  declare _previews: Partial<Record<Variant, VariantPreview>>;
  declare _probe: Partial<Record<Variant, Record<string, string>>>;
  declare _section: SectionId;
  declare _open: Set<string>;
  declare _saveState: SaveState;
  declare _saveError?: string;
  declare _history: Snapshot[];
  declare _future: Snapshot[];
  declare _hexDraft?: string;
  declare _dialog?: "new" | "delete" | "use" | "import";
  declare _useScope: "device" | "everyone";
  declare _importText: string;
  declare _inUse: { everyone: string[]; device?: string };
  declare _toast?: string;
  declare _busy: boolean;
  declare _newMode: NewMode;
  declare _newSource: string;
  declare _newColour: string;
  declare _newImage?: string;
  declare _newName: string;
  declare _backgrounds?: Background[];
  declare _linked: Set<string>;
  declare _tiles: Record<string, { signature: string; options: Record<string, Record<string, string>> }>;

  private _schema = new Map<string, SchemaItem>();
  private _schemaLoading = false;
  private _detailSlug?: string;
  private _dirty = new Set<Variant>();
  private _nameDirty = false;
  private _saving = false;
  private _saveAgain = false;
  private _saveTimer?: number;
  private _previewTimers: Partial<Record<Variant, number>> = {};
  private _previewSeq: Record<Variant, number> = { light: 0, dark: 0 };
  private _lastKey?: string;
  private _lastTime = 0;
  private _libraryStale = false;
  private _toastTimer?: number;
  private _wantedTiles = new Map<string, Extract<Control, { type: "tiles" }>>();
  private _tileTimer?: number;
  private _tileSeq = 0;

  constructor() {
    super();
    this.narrow = false;
    this._loading = false;
    this._filter = "all";
    this._variant = "light";
    this._both = false;
    this._device = "phone";
    this._previews = {};
    this._probe = {};
    this._section = "colours";
    this._open = new Set();
    this._saveState = "saved";
    this._history = [];
    this._future = [];
    this._busy = false;
    this._newMode = "preset";
    this._newSource = "default";
    this._newColour = "#3A6EA5";
    this._newName = "";
    this._tiles = {};
    this._useScope = "device";
    this._importText = "";
    this._inUse = { everyone: [] };
    this._linked = new Set();
    try {
      const stored = JSON.parse(window.localStorage.getItem(LINK_STORAGE) ?? "[]");
      if (Array.isArray(stored)) {
        this._linked = new Set(stored.map(String));
      }
    } catch {
      // Private mode or blocked storage: links are not remembered.
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    void this._flush();
  }

  private get _slug(): string | undefined {
    const match = THEME_ROUTE.exec(this.route?.path ?? "");
    return match ? decodeURIComponent(match[1]) : undefined;
  }

  private get _canEdit(): boolean {
    return this.hass?.user?.is_admin !== false;
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("hass") && this.hass) {
      this.toggleAttribute("dark", Boolean(this.hass.themes?.darkMode));
      if (!this._themes && !this._loading && !this._error) {
        void this._loadThemes();
      }
      if (!this._schema.size && !this._schemaLoading) {
        void this._loadSchema();
      }
    }
    const slug = this._slug;
    if (this.hass && slug && slug !== this._detailSlug) {
      void this._loadDetail(slug);
    }
    if (changed.has("_section") && this._section === "background") {
      void this._loadBackgrounds();
    }
    if (!slug && this._libraryStale && changed.has("route")) {
      this._libraryStale = false;
      void this._loadThemes();
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has("_previews")) {
      this._resolveProbe();
    }
    if (this._wantedTiles.size) {
      window.clearTimeout(this._tileTimer);
      this._tileTimer = window.setTimeout(() => void this._loadTiles(), TILE_DELAY);
    }
  }

  // Data ---------------------------------------------------------------------

  private async _loadThemes(): Promise<void> {
    if (!this.hass) {
      return;
    }
    this._loading = true;
    this._error = undefined;
    try {
      const result = await this.hass.callWS<{ themes: ThemeCard[] }>({ type: "theme_studio/themes" });
      this._themes = result.themes;
      void this._loadInUse();
    } catch (error) {
      this._error = errorText(error);
    } finally {
      this._loading = false;
    }
  }

  private async _loadInUse(): Promise<void> {
    if (!this.hass) {
      return;
    }
    try {
      const result = await this.hass.callWS<{ default_theme?: string; default_dark_theme?: string | null }>({
        type: "frontend/get_themes",
      });
      const everyone = [result.default_theme, result.default_dark_theme].filter(
        (name): name is string => Boolean(name) && name !== "default",
      );
      this._inUse = { everyone, device: this.hass.selectedTheme?.theme };
    } catch {
      this._inUse = { everyone: [], device: this.hass.selectedTheme?.theme };
    }
  }

  private _inUseText(name: string): string | undefined {
    if (this._inUse.everyone.includes(name)) {
      return "In use · everyone";
    }
    if (this._inUse.device === name) {
      return "In use · you";
    }
    return undefined;
  }

  private async _loadSchema(): Promise<void> {
    if (!this.hass) {
      return;
    }
    this._schemaLoading = true;
    try {
      const result = await this.hass.callWS<{ settings: SchemaItem[] }>({ type: "theme_studio/schema" });
      this._schema = new Map(result.settings.map((item) => [item.key, item]));
      this.requestUpdate();
    } catch (error) {
      this._error = errorText(error);
    } finally {
      this._schemaLoading = false;
    }
  }

  private async _loadDetail(slug: string): Promise<void> {
    if (!this.hass) {
      return;
    }
    await this._flush();
    this._detailSlug = slug;
    this._edit = undefined;
    this._previews = {};
    this._probe = {};
    this._detailError = undefined;
    this._history = [];
    this._future = [];
    this._hexDraft = undefined;
    this._saveState = "saved";
    this._saveError = undefined;
    try {
      const detail = await this.hass.callWS<ThemeDetail>({ type: "theme_studio/theme", slug });
      if (this._detailSlug !== slug) {
        return;
      }
      if (!detail.light || !detail.dark) {
        this._detailError = "This theme could not be built.";
        return;
      }
      this._edit = {
        slug: detail.slug,
        name: detail.name,
        builtin: detail.builtin,
        settings: { light: { ...detail.light.settings }, dark: { ...detail.dark.settings } },
      };
      this._previews = { light: detail.light, dark: detail.dark };
    } catch (error) {
      if (this._detailSlug === slug) {
        this._detailError = errorText(error);
      }
    }
  }

  private async _loadBackgrounds(): Promise<void> {
    if (!this.hass || this._backgrounds) {
      return;
    }
    try {
      const result = await this.hass.callWS<{ images: Background[] }>({ type: "theme_studio/backgrounds" });
      this._backgrounds = result.images;
      this._newImage = this._newImage ?? result.images[0]?.file;
    } catch {
      this._backgrounds = [];
    }
  }

  // Navigation ---------------------------------------------------------------

  private _navigate(path: string, replace = false): void {
    if (replace) {
      window.history.replaceState(null, "", path);
    } else {
      window.history.pushState(null, "", path);
    }
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace } }));
  }

  private _prefix(): string {
    return this.route?.prefix ?? "/theme-studio-panel";
  }

  private _openTheme(slug: string): void {
    this._navigate(`${this._prefix()}/theme/${encodeURIComponent(slug)}`);
  }

  private async _back(): Promise<void> {
    await this._flush();
    this._detailSlug = undefined;
    this._edit = undefined;
    this._navigate(this._prefix());
  }

  private _refresh(): void {
    this._themes = undefined;
    this._error = undefined;
    void this._loadThemes();
  }

  private _showToast(text: string): void {
    this._toast = text;
    window.clearTimeout(this._toastTimer);
    this._toastTimer = window.setTimeout(() => {
      this._toast = undefined;
    }, 3600);
  }

  // Editing ------------------------------------------------------------------

  private _snapshot(): Snapshot | undefined {
    return this._edit ? { name: this._edit.name, settings: cloneSettings(this._edit.settings) } : undefined;
  }

  private _pushHistory(key?: string): void {
    const now = Date.now();
    const coalesce = key !== undefined && key === this._lastKey && now - this._lastTime < COALESCE_MS;
    this._lastKey = key;
    this._lastTime = now;
    if (coalesce) {
      return;
    }
    const snapshot = this._snapshot();
    if (snapshot) {
      this._history = [...this._history, snapshot].slice(-HISTORY_LIMIT);
      this._future = [];
    }
  }

  private _change(variants: Variant[], patch: Settings, key?: string): void {
    if (!this._edit || !this._canEdit) {
      return;
    }
    this._pushHistory(key);
    const settings = cloneSettings(this._edit.settings);
    for (const variant of variants) {
      settings[variant] = { ...settings[variant], ...patch };
      this._dirty.add(variant);
      this._schedulePreview(variant);
    }
    this._edit = { ...this._edit, settings };
    this._scheduleSave();
  }

  private _replaceVariant(variant: Variant, values: Settings): void {
    if (!this._edit || !this._canEdit) {
      return;
    }
    this._pushHistory();
    const settings = cloneSettings(this._edit.settings);
    settings[variant] = { ...settings[variant], ...values };
    this._dirty.add(variant);
    this._edit = { ...this._edit, settings };
    this._schedulePreview(variant);
    this._scheduleSave();
  }

  private _rename(name: string): void {
    if (!this._edit || !this._canEdit) {
      return;
    }
    this._pushHistory("name");
    this._edit = { ...this._edit, name };
    this._nameDirty = true;
    if (name.trim()) {
      this._scheduleSave();
    }
  }

  private _restore(from: "_history" | "_future"): void {
    const list = this[from];
    const current = this._snapshot();
    if (!list.length || !this._edit || !current) {
      return;
    }
    const target = list[list.length - 1];
    if (from === "_history") {
      this._history = list.slice(0, -1);
      this._future = [...this._future, current];
    } else {
      this._future = list.slice(0, -1);
      this._history = [...this._history, current];
    }
    this._lastKey = undefined;
    this._hexDraft = undefined;
    this._edit = { ...this._edit, name: target.name, settings: cloneSettings(target.settings) };
    this._nameDirty = this._nameDirty || target.name !== current.name;
    for (const variant of VARIANTS) {
      this._dirty.add(variant);
      this._schedulePreview(variant);
    }
    this._scheduleSave();
  }

  private _schedulePreview(variant: Variant): void {
    window.clearTimeout(this._previewTimers[variant]);
    this._previewTimers[variant] = window.setTimeout(() => void this._runPreview(variant), PREVIEW_DELAY);
  }

  private async _runPreview(variant: Variant): Promise<void> {
    if (!this.hass || !this._edit) {
      return;
    }
    const sequence = ++this._previewSeq[variant];
    try {
      const result = await this.hass.callWS<VariantPreview>({
        type: "theme_studio/preview",
        settings: this._edit.settings[variant],
      });
      if (sequence === this._previewSeq[variant]) {
        this._previews = { ...this._previews, [variant]: result };
      }
    } catch (error) {
      this._showToast(`Preview failed: ${errorText(error)}`);
    }
  }

  private _scheduleSave(delay = SAVE_DELAY): void {
    this._saveState = "unsaved";
    window.clearTimeout(this._saveTimer);
    this._saveTimer = window.setTimeout(() => void this._save(), delay);
  }

  private async _flush(): Promise<void> {
    window.clearTimeout(this._saveTimer);
    if (this._dirty.size || this._nameDirty) {
      await this._save();
    }
  }

  private async _save(): Promise<void> {
    if (!this.hass || !this._edit || !this._canEdit) {
      return;
    }
    if (this._saving) {
      this._saveAgain = true;
      return;
    }
    if (!this._dirty.size && !this._nameDirty) {
      this._saveState = "saved";
      return;
    }
    this._saving = true;
    this._saveState = "saving";
    const dirty = new Set(this._dirty);
    const nameDirty = this._nameDirty;
    this._dirty.clear();
    this._nameDirty = false;
    try {
      if (this._edit.builtin) {
        await this._fork();
        VARIANTS.forEach((variant) => dirty.add(variant));
      }
      const edit = this._edit;
      const message: { type: string; [key: string]: unknown } = { type: "theme_studio/theme/save", slug: edit.slug };
      if (nameDirty && edit.name.trim()) {
        message.name = edit.name.trim();
      }
      for (const variant of dirty) {
        message[variant] = edit.settings[variant];
      }
      await this.hass.callWS(message);
      this._libraryStale = true;
      this._saveError = undefined;
      this._saveState = this._dirty.size || this._nameDirty ? "unsaved" : "saved";
    } catch (error) {
      dirty.forEach((variant) => this._dirty.add(variant));
      this._nameDirty = this._nameDirty || nameDirty;
      this._saveState = "error";
      this._saveError = errorText(error);
    } finally {
      this._saving = false;
      if (this._saveAgain) {
        this._saveAgain = false;
        this._scheduleSave(200);
      }
    }
  }

  /** The first change to a built-in preset makes the user's own copy. */
  private async _fork(): Promise<void> {
    if (!this.hass || !this._edit) {
      return;
    }
    const wanted = this._edit.name !== this._presetName() ? this._edit.name : `${this._edit.name} (copy)`;
    const result = await this.hass.callWS<{ slug: string; name: string }>({
      type: "theme_studio/theme/new",
      source: this._edit.slug,
      name: wanted.trim() || `${this._presetName()} (copy)`,
    });
    this._edit = { ...this._edit, slug: result.slug, name: result.name, builtin: false };
    this._detailSlug = result.slug;
    this._navigate(`${this._prefix()}/theme/${encodeURIComponent(result.slug)}`, true);
    this._showToast(`Built-in presets stay as they are. Your changes are saved in “${result.name}”.`);
  }

  private _presetName(): string {
    const card = this._themes?.find((theme) => theme.slug === this._edit?.slug);
    return card?.name ?? this._edit?.name ?? "";
  }

  private async _use(): Promise<void> {
    if (!this.hass || !this._edit) {
      return;
    }
    this._busy = true;
    const scope = this._useScope;
    try {
      await this._flush();
      const result = await this.hass.callWS<{ name: string; theme: string }>({
        type: "theme_studio/theme/use",
        slug: this._edit.slug,
        scope,
      });
      // The same event the profile page's theme picker sends, so the change
      // shows at once. For everyone this user follows the default theme (a
      // theme picked in the profile would otherwise win).
      this.dispatchEvent(
        new CustomEvent("settheme", {
          detail: { theme: scope === "everyone" ? "" : result.theme },
          bubbles: true,
          composed: true,
        }),
      );
      this._dialog = undefined;
      this._libraryStale = true;
      this._inUse =
        scope === "everyone"
          ? { everyone: [result.theme], device: "" }
          : { ...this._inUse, device: result.theme };
      this._showToast(
        scope === "everyone"
          ? `“${result.theme}” is now the theme for everyone.`
          : `“${result.theme}” is now your theme.`,
      );
    } catch (error) {
      this._showToast(`Could not use the theme: ${errorText(error)}`);
    } finally {
      this._busy = false;
    }
  }

  private async _export(action: "copy" | "download"): Promise<void> {
    if (!this.hass || !this._edit) {
      return;
    }
    try {
      await this._flush();
      const result = await this.hass.callWS<{ name: string; file_name: string; document: unknown; share_string: string }>({
        type: "theme_studio/theme/export",
        slug: this._edit.slug,
      });
      if (action === "copy") {
        try {
          await navigator.clipboard.writeText(result.share_string);
          this._showToast("Share code copied. Paste it into Import in another Theme Studio.");
        } catch {
          this._importText = result.share_string;
          this._showToast("Copying is blocked here; the share code is in Import on the start page.");
        }
        return;
      }
      const blob = new Blob([`${JSON.stringify(result.document, null, 2)}\n`], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = result.file_name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 2000);
      this._showToast(`${result.file_name} is downloaded.`);
    } catch (error) {
      this._showToast(`Could not share: ${errorText(error)}`);
    }
  }

  private async _import(): Promise<void> {
    if (!this.hass || !this._importText.trim()) {
      return;
    }
    this._busy = true;
    try {
      const result = await this.hass.callWS<{ slug: string; name: string; renamed?: boolean }>({
        type: "theme_studio/theme/import",
        data: this._importText.trim(),
      });
      this._dialog = undefined;
      this._importText = "";
      this._libraryStale = true;
      this._themes = undefined;
      void this._loadThemes();
      this._openTheme(result.slug);
      this._showToast(
        result.renamed ? `Imported as “${result.name}”, because the name was taken.` : `“${result.name}” is imported.`,
      );
    } catch (error) {
      const record = error as { code?: string };
      this._showToast(
        record?.code && record.code !== "unknown_error"
          ? "That is not a Theme Studio share code or theme file."
          : `Could not import: ${errorText(error)}`,
      );
    } finally {
      this._busy = false;
    }
  }

  private async _delete(): Promise<void> {
    if (!this.hass || !this._edit) {
      return;
    }
    this._busy = true;
    const { slug, name } = this._edit;
    try {
      window.clearTimeout(this._saveTimer);
      this._dirty.clear();
      this._nameDirty = false;
      await this.hass.callWS({ type: "theme_studio/theme/delete", slug });
      this._dialog = undefined;
      this._libraryStale = true;
      this._detailSlug = undefined;
      this._edit = undefined;
      this._navigate(this._prefix());
      this._showToast(`“${name}” is deleted. A backup copy stays in the user_themes folder.`);
    } catch (error) {
      this._showToast(`Could not delete: ${errorText(error)}`);
    } finally {
      this._busy = false;
    }
  }

  private async _mirror(): Promise<void> {
    if (!this.hass || !this._edit) {
      return;
    }
    const source = this._variant;
    const target: Variant = source === "light" ? "dark" : "light";
    try {
      const result = await this.hass.callWS<{ settings: Settings }>({
        type: "theme_studio/mirror",
        settings: this._edit.settings[source],
        target,
      });
      this._replaceVariant(target, result.settings);
      this._showToast(`${target === "dark" ? "Dark" : "Light"} is now a copy of ${source === "light" ? "Light" : "Dark"}. Undo brings the old one back.`);
    } catch (error) {
      this._showToast(`Could not copy: ${errorText(error)}`);
    }
  }

  private async _createNew(): Promise<void> {
    if (!this.hass) {
      return;
    }
    const message: { type: string; [key: string]: unknown } = { type: "theme_studio/theme/new" };
    if (this._newName.trim()) {
      message.name = this._newName.trim();
    }
    if (this._newMode === "image") {
      if (!this._newImage) {
        return;
      }
      message.image = this._newImage;
    } else {
      message.source = this._newMode === "colour" ? "default" : this._newSource;
      if (this._newMode === "colour") {
        message.base_color = this._newColour;
      }
    }
    this._busy = true;
    try {
      const result = await this.hass.callWS<{ slug: string; name: string }>(message);
      this._dialog = undefined;
      this._newName = "";
      this._libraryStale = true;
      this._themes = undefined;
      void this._loadThemes();
      this._openTheme(result.slug);
      this._showToast(`“${result.name}” is created with a light and a dark variant.`);
    } catch (error) {
      this._showToast(`Could not create the theme: ${errorText(error)}`);
    } finally {
      this._busy = false;
    }
  }

  private _isLinked(section: Section): boolean {
    return Boolean(section.linkable && this._edit && this._linked.has(this._edit.slug));
  }

  private _targets(section: Section): Variant[] {
    return this._isLinked(section) ? [...VARIANTS] : [this._variant];
  }

  private _toggleLinked(): void {
    if (!this._edit) {
      return;
    }
    const next = new Set(this._linked);
    if (next.has(this._edit.slug)) {
      next.delete(this._edit.slug);
    } else {
      next.add(this._edit.slug);
    }
    this._linked = next;
    try {
      window.localStorage.setItem(LINK_STORAGE, JSON.stringify([...next]));
    } catch {
      // Not remembered; it still works until the page is reloaded.
    }
  }

  private _tileSignature(control: Extract<Control, { type: "tiles" }>): string {
    const settings = this._edit?.settings[this._variant] ?? {};
    return `${this._edit?.slug}|${this._variant}|${JSON.stringify({ ...settings, [control.key]: "" })}`;
  }

  private async _loadTiles(): Promise<void> {
    if (!this.hass || !this._edit) {
      return;
    }
    const wanted = [...this._wantedTiles.values()];
    this._wantedTiles.clear();
    const sequence = ++this._tileSeq;
    const settings = this._edit.settings[this._variant];
    const updates: typeof this._tiles = {};
    for (const control of wanted) {
      const signature = this._tileSignature(control);
      try {
        const result = await this.hass.callWS<{ options: { value: string; variables: Record<string, string> }[] }>({
          type: "theme_studio/preview_options",
          settings,
          key: control.key,
          values: control.options.map(([value]) => value),
          fixed: control.fixed ?? {},
        });
        updates[control.key] = {
          signature,
          options: Object.fromEntries(result.options.map((option) => [option.value, option.variables])),
        };
      } catch {
        updates[control.key] = { signature, options: {} };
      }
    }
    if (sequence === this._tileSeq) {
      this._tiles = { ...this._tiles, ...updates };
    }
  }

  private async _upload(file: File, section: Section): Promise<void> {
    if (!this.hass?.fetchWithAuth) {
      this._showToast("Uploading needs a newer Home Assistant frontend.");
      return;
    }
    const body = new FormData();
    body.append("file", file, file.name);
    this._busy = true;
    try {
      const response = await this.hass.fetchWithAuth(UPLOAD_URL, { method: "POST", body });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; url?: string; file?: string; reason?: string; message?: string };
      if (!response.ok || !result.ok || !result.url) {
        throw new Error(UPLOAD_ERRORS[result.reason ?? ""] ?? result.message ?? response.statusText);
      }
      this._backgrounds = undefined;
      await this._loadBackgrounds();
      this._change(this._targets(section), { use_background_image: "on", background_image_url: result.url });
      this._showToast(`${result.file} is uploaded and in use.`);
    } catch (error) {
      this._showToast(`Could not upload: ${errorText(error)}`);
    } finally {
      this._busy = false;
    }
  }

  /** Colours that only exist as CSS variables are read back from the browser. */
  private _resolveProbe(): void {
    const box = this.renderRoot.querySelector<HTMLElement>(".probe");
    const dot = box?.querySelector<HTMLElement>("span");
    if (!box || !dot) {
      return;
    }
    const resolved: Partial<Record<Variant, Record<string, string>>> = {};
    for (const variant of VARIANTS) {
      const preview = this._previews[variant];
      if (!preview) {
        continue;
      }
      box.removeAttribute("style");
      for (const [name, value] of Object.entries(themeStyle(preview.variables))) {
        box.style.setProperty(name, value);
      }
      const colours: Record<string, string> = {};
      for (const role of ALL_ROLES) {
        if (role.cssVar) {
          dot.style.color = `var(--${role.cssVar})`;
          colours[role.id] = cssColourToHex(getComputedStyle(dot).color);
        }
      }
      resolved[variant] = colours;
    }
    this._probe = resolved;
  }

  private _roleColour(role: RoleDef, variant: Variant): string {
    const settings = this._edit?.settings[variant];
    if (settings && isManual(role, settings)) {
      return normaliseHex(manualValue(role, settings)) ?? manualValue(role, settings);
    }
    const preview = this._previews[variant];
    if (role.summary && preview) {
      return String(preview.summary[role.summary]).toUpperCase();
    }
    return this._probe[variant]?.[role.id] ?? "";
  }

  // Rendering ----------------------------------------------------------------

  protected override render(): TemplateResult {
    return html`
      ${this._slug ? this._renderEditor(this._slug) : this._renderLibrary()}
      ${this._dialog === "new" ? this._renderNewDialog() : nothing}
      ${this._dialog === "delete" ? this._renderDeleteDialog() : nothing}
      ${this._dialog === "use" ? this._renderUseDialog() : nothing}
      ${this._dialog === "import" ? this._renderImportDialog() : nothing}
      ${this._toast ? html`<div class="toast" role="status">${this._toast}</div>` : nothing}
    `;
  }

  // Library ------------------------------------------------------------------

  private _renderLibrary(): TemplateResult {
    const themes = this._themes ?? [];
    const visible = themes.filter((theme) =>
      this._filter === "all" ? true : this._filter === "mine" ? !theme.builtin : theme.builtin,
    );
    const groups = [
      { title: "Mine", items: visible.filter((theme) => !theme.builtin) },
      { title: "Built-in presets", items: visible.filter((theme) => theme.builtin) },
    ].filter((group) => group.items.length > 0);

    return html`
      <div class="shell">
        <header class="bar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="logo">${icon("palette", 22)}</div>
          <div class="titlebox">
            <div class="title">Theme Studio</div>
            <div class="status">${themes.length ? `${themes.length} themes · light and dark` : "Themes for Home Assistant"}</div>
          </div>
          <button class="btn icon" @click=${this._refresh} aria-label="Reload themes" title="Reload themes">
            ${icon("refresh")}
          </button>
          ${this._canEdit
            ? html`<button class="btn" aria-label="Import a theme" @click=${() => (this._dialog = "import")}>
                ${icon("download", 18)}<span class="hide-p">Import</span>
              </button>`
            : nothing}
          ${this._canEdit
            ? html`<button
                class="btn primary"
                aria-label="New theme"
                @click=${() => {
                  this._dialog = "new";
                  void this._loadBackgrounds();
                }}
              >
                ${icon("plus", 18)}<span class="hide-p">New theme</span>
              </button>`
            : nothing}
        </header>
        <main class="lib">
          <div class="lib-head">
            <div>
              <h1 class="lib-title">Your themes</h1>
              <p class="sub">
                Open a theme to change it. Built-in presets are copied the first time you change them, so they always
                stay as they are.
              </p>
            </div>
            <div class="seg" role="group" aria-label="Show">
              ${this._filterButton("all", "All")} ${this._filterButton("mine", "Mine")}
              ${this._filterButton("builtin", "Built-in")}
            </div>
          </div>
          ${this._error
            ? html`<div class="message">
                <strong>Could not load the themes</strong>
                <span class="hint">${this._error}</span>
                <button class="btn sm" @click=${this._refresh}>Try again</button>
              </div>`
            : nothing}
          ${this._loading && !this._themes ? html`<div class="loading">Loading themes…</div>` : nothing}
          ${groups.map(
            (group) => html`
              <div class="gtitle">${group.title} · ${group.items.length}</div>
              <div class="grid">${group.items.map((theme) => this._renderCard(theme))}</div>
            `,
          )}
        </main>
      </div>
    `;
  }

  private _filterButton(filter: Filter, label: string): TemplateResult {
    return html`<button
      class=${this._filter === filter ? "on" : ""}
      aria-pressed=${this._filter === filter ? "true" : "false"}
      @click=${() => {
        this._filter = filter;
      }}
    >
      ${label}
    </button>`;
  }

  private _renderCard(theme: ThemeCard): TemplateResult {
    const failing = (theme.light?.failing ?? 0) + (theme.dark?.failing ?? 0);
    return html`
      <button class="tcard" @click=${() => this._openTheme(theme.slug)} aria-label=${`Open ${theme.name}`}>
        <div class="mini">${this._renderMini(theme.light)}${this._renderMini(theme.dark)}</div>
        <div class="tmeta">
          <div class="tmeta-text">
            <div class="tname">${theme.name}</div>
            <div class="tsub">${theme.builtin ? "Built-in preset" : "Mine"}</div>
          </div>
          ${this._inUseText(theme.name)
            ? html`<span class="badge">${this._inUseText(theme.name)}</span>`
            : failing
              ? html`<span class="badge warn">${failing} to check</span>`
              : nothing}
        </div>
      </button>
    `;
  }

  private _renderMini(variant: VariantCard | null): TemplateResult {
    if (!variant) {
      return html`<div class="mini-v empty">–</div>`;
    }
    const s = variant.summary;
    const radius = `${Math.min(s.radius, 14) * 0.5}px`;
    return html`
      <div class="mini-v" style=${styleMap({ background: miniBackground(s) })}>
        <div class="mini-line" style=${styleMap({ background: s.text })}></div>
        <div class="mini-card" style=${styleMap({ background: s.card, borderRadius: radius })}>
          <span class="mini-dot" style=${styleMap({ background: s.accent })}></span>
          <span class="mini-bar" style=${styleMap({ background: s.text })}></span>
        </div>
        <div class="mini-card" style=${styleMap({ background: s.card, borderRadius: radius })}>
          <span class="mini-dot" style=${styleMap({ background: s.icon })}></span>
          <span class="mini-bar" style=${styleMap({ background: s.secondary })}></span>
        </div>
        <div class="mini-nav" style=${styleMap({ background: s.navbar })}></div>
      </div>
    `;
  }

  // Editor -------------------------------------------------------------------

  private _statusText(): string {
    if (!this._canEdit) {
      return "View only · ask an administrator to change themes";
    }
    if (!this._edit) {
      return "Loading…";
    }
    if (this._edit.builtin && this._saveState === "saved") {
      return "Built-in preset · your first change makes a copy";
    }
    switch (this._saveState) {
      case "saving":
        return "Saving…";
      case "unsaved":
        return "Unsaved changes";
      case "error":
        return `Not saved: ${this._saveError ?? "unknown error"}`;
      default:
        return "All changes saved";
    }
  }

  private _failing(variant: Variant): number {
    return this._previews[variant]?.contrast.filter((pair) => !pair.ok).length ?? 0;
  }

  private _renderEditor(slug: string): TemplateResult {
    const edit = this._edit?.slug === slug || this._detailSlug === slug ? this._edit : undefined;
    const card = this._themes?.find((theme) => theme.slug === slug);
    const name = edit?.name ?? card?.name ?? slug;
    const failing = this._failing(this._variant);
    const section = SECTIONS.find((item) => item.id === this._section) ?? SECTIONS[0];

    return html`
      <div class="shell">
        <header class="bar">
          <button class="btn icon" @click=${() => void this._back()} aria-label="Back to all themes">${icon("back")}</button>
          <div class="titlebox">
            <input
              class="name"
              .value=${name}
              ?disabled=${!edit || !this._canEdit}
              aria-label="Theme name"
              spellcheck="false"
              maxlength="60"
              @input=${(event: Event) => this._rename((event.target as HTMLInputElement).value)}
            />
            <div class="status ${this._saveState === "error" ? "error" : ""}">${this._statusText()}</div>
          </div>
          <button class="btn icon" aria-label="Undo" title="Undo" ?disabled=${!this._history.length} @click=${() => this._restore("_history")}>
            ${icon("undo", 19)}
          </button>
          <button class="btn icon hide-p" aria-label="Redo" title="Redo" ?disabled=${!this._future.length} @click=${() => this._restore("_future")}>
            ${icon("redo", 19)}
          </button>
          <div class="seg" role="group" aria-label="Variant to edit">
            ${this._variantButton("light", "Light")} ${this._variantButton("dark", "Dark")}
          </div>
          ${edit && this._canEdit
            ? html`
                <button class="btn primary" ?disabled=${this._busy} aria-label="Use theme" @click=${() => (this._dialog = "use")}>
                  ${icon("check", 18)}<span class="hide-t">Use theme</span>
                </button>
              `
            : nothing}
        </header>
        ${this._detailError
          ? html`<div class="message">
              <strong>Could not load ${name}</strong>
              <span class="hint">${this._detailError}</span>
              <button class="btn sm" @click=${() => void this._back()}>Back to all themes</button>
            </div>`
          : html`<div class="editor">
              <nav class="rail" aria-label="Sections">
                ${SECTIONS.map(
                  (item) => html`<button class="rail-btn ${item.id === section.id ? "on" : ""}" @click=${() => (this._section = item.id)}>
                    ${icon(item.icon, 22)}${item.label}
                    ${item.id === "check" && failing ? html`<span class="count">${failing}</span>` : nothing}
                  </button>`,
                )}
              </nav>
              <section class="ctl" aria-label="Controls">
                <div class="chips" role="group" aria-label="Sections">
                  ${SECTIONS.map(
                    (item) => html`<button class="chip ${item.id === section.id ? "on" : ""}" @click=${() => (this._section = item.id)}>
                      ${item.label}
                      ${item.id === "check" && failing ? html`<span class="count">${failing}</span>` : nothing}
                    </button>`,
                  )}
                </div>
                ${edit?.builtin && this._canEdit
                  ? html`<div class="banner">
                      ${icon("lock", 18)}
                      <span>This is a built-in preset. Change anything and Theme Studio makes your own copy; the preset itself stays untouched.</span>
                    </div>`
                  : nothing}
                ${edit && this._schema.size
                  ? html`<div class="sec">
                      <div>
                        <h2 class="sh">${section.label}</h2>
                        <p class="sp">${section.description}</p>
                      </div>
                      ${section.linkable && this._canEdit ? this._renderLinkRow(section) : nothing}
                      ${section.id === "check" ? this._renderCheck() : section.groups.map((group) => this._renderGroup(group, section))}
                      ${!edit.builtin && this._canEdit
                        ? html`<div class="sec-foot">
                            <button class="btn danger" @click=${() => (this._dialog = "delete")}>${icon("trash", 18)}Delete theme</button>
                          </div>`
                        : nothing}
                    </div>`
                  : html`<div class="loading">Loading…</div>`}
              </section>
              ${this._renderPreview()}
              <div class="probe" aria-hidden="true"><span></span></div>
            </div>`}
      </div>
    `;
  }

  private _variantButton(variant: Variant, label: string): TemplateResult {
    const on = this._variant === variant;
    return html`<button
      class=${on ? "on" : ""}
      aria-pressed=${on ? "true" : "false"}
      @click=${() => {
        this._variant = variant;
        this._hexDraft = undefined;
      }}
    >
      ${icon(variant === "light" ? "sun" : "moon", 17)}<span class="hide-p">${label}</span>
    </button>`;
  }

  private _renderLinkRow(section: Section): TemplateResult {
    const linked = this._isLinked(section);
    return html`<button class="toggle-row" aria-pressed=${linked ? "true" : "false"} @click=${() => this._toggleLinked()}>
      <span class="tr-text">
        <span class="tr-title">Same for Light and Dark</span>
        <span class="hint">${linked ? "Changes here apply to both variants." : `Changes here only apply to ${this._variant === "light" ? "Light" : "Dark"}.`}</span>
      </span>
      <span class="switch ${linked ? "on" : ""}" aria-hidden="true"></span>
    </button>`;
  }

  private _renderGroup(group: Group, section: Section): TemplateResult {
    const open = !group.collapsible || this._open.has(group.id);
    const toggle = () => {
      const next = new Set(this._open);
      if (next.has(group.id)) {
        next.delete(group.id);
      } else {
        next.add(group.id);
      }
      this._open = next;
    };
    return html`
      <div class="group">
        ${group.collapsible
          ? html`<button class="group-head ${open ? "open" : ""}" aria-expanded=${open ? "true" : "false"} @click=${toggle}>
              <span class="h">${group.title}</span>${icon("chevron", 18)}
            </button>`
          : html`<div class="h">${group.title}</div>`}
        ${open ? group.controls.map((control) => this._renderControl(control, section)) : nothing}
        ${open && group.hint ? html`<p class="hint">${group.hint}</p>` : nothing}
      </div>
    `;
  }

  private _renderControl(control: Control, section: Section): TemplateResult | typeof nothing {
    const settings = this._edit?.settings[this._variant];
    if (!settings) {
      return nothing;
    }
    const targets = this._targets(section);
    switch (control.type) {
      case "base":
        return this._renderBase(settings);
      case "slider":
        return this._renderSlider(control, settings, targets);
      case "segmented":
        return this._renderSegmented(control, settings, targets);
      case "roles":
        return html`<div class="roles">${control.roles.map((role) => this._renderRole(role, settings))}</div>`;
      case "mirror":
        return this._renderMirror();
      case "switch":
        return this._renderSwitch(control, settings, targets);
      case "text":
        return this._renderText(control, settings, targets);
      case "tiles":
        return this._renderTiles(control, settings, targets);
      case "images":
        return this._renderImages(settings, targets, section);
      case "fonts":
        return this._renderFonts(settings, targets);
    }
  }

  private _renderSwitch(control: Extract<Control, { type: "switch" }>, settings: Settings, targets: Variant[]): TemplateResult {
    const on = settings[control.key] === "on" || settings[control.key] === true;
    return html`<button
      class="toggle-row"
      aria-pressed=${on ? "true" : "false"}
      ?disabled=${!this._canEdit}
      @click=${() => this._change(targets, { [control.key]: on ? "off" : "on" })}
    >
      <span class="tr-text">
        <span class="tr-title">${control.label}</span>
        ${control.hint ? html`<span class="hint">${control.hint}</span>` : nothing}
      </span>
      <span class="switch ${on ? "on" : ""}" aria-hidden="true"></span>
    </button>`;
  }

  private _renderText(control: Extract<Control, { type: "text" }>, settings: Settings, targets: Variant[]): TemplateResult {
    const id = `ts-${control.key}`;
    return html`<div class="field">
      <label class="lbl" for=${id}>${control.label}</label>
      <input
        id=${id}
        class="text-input plain"
        maxlength="255"
        spellcheck="false"
        .value=${String(settings[control.key] ?? "")}
        placeholder=${control.placeholder ?? ""}
        ?disabled=${!this._canEdit}
        @input=${(event: Event) => this._change(targets, { [control.key]: (event.target as HTMLInputElement).value }, `${control.key}-text`)}
      />
      ${control.hint ? html`<p class="hint">${control.hint}</p>` : nothing}
    </div>`;
  }

  private _renderTiles(control: Extract<Control, { type: "tiles" }>, settings: Settings, targets: Variant[]): TemplateResult {
    const current = String(settings[control.key] ?? "");
    const cached = this._tiles[control.key];
    if (!cached || cached.signature !== this._tileSignature(control)) {
      this._wantedTiles.set(control.key, control);
    }
    return html`<div class="tiles">
      ${control.options.map(([value, label]) => {
        const variables = cached?.options[value];
        const style = variables ? styleMap(themeStyle(variables)) : nothing;
        return html`<button
          class="tile ${current === value ? "on" : ""}"
          aria-pressed=${current === value ? "true" : "false"}
          ?disabled=${!this._canEdit}
          @click=${() => this._change(targets, { [control.key]: value })}
        >
          <div class="tile-art ${control.preview}" style=${style}>
            ${control.preview === "overlay" ? nothing : html`<div class="tile-card"></div>`}
          </div>
          <span class="tile-label">${label}</span>
        </button>`;
      })}
    </div>`;
  }

  private _renderImages(settings: Settings, targets: Variant[], section: Section): TemplateResult {
    const enabled = settings.use_background_image === "on" || settings.use_background_image === true;
    const url = String(settings.background_image_url ?? "");
    const images = this._backgrounds;
    return html`<div class="images">
      <button
        class="image none ${enabled ? "" : "on"}"
        aria-pressed=${enabled ? "false" : "true"}
        ?disabled=${!this._canEdit}
        @click=${() => this._change(targets, { use_background_image: "off" })}
      >
        <span class="image-none">${icon("close", 22)}</span><span>No image</span>
      </button>
      ${(images ?? []).map(
        (item) => html`<button
          class="image ${enabled && url === item.url ? "on" : ""}"
          aria-pressed=${enabled && url === item.url ? "true" : "false"}
          ?disabled=${!this._canEdit}
          @click=${() => this._change(targets, { use_background_image: "on", background_image_url: item.url })}
        >
          <img src=${item.url} alt="" loading="lazy" /><span>${item.file}</span>
        </button>`,
      )}
      ${this._canEdit
        ? html`<label class="image upload ${this._busy ? "busy" : ""}">
            <span class="image-none">${icon("upload", 22)}</span><span>${this._busy ? "Uploading…" : "Upload image"}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              ?disabled=${this._busy}
              @change=${(event: Event) => {
                const input = event.target as HTMLInputElement;
                const file = input.files?.[0];
                input.value = "";
                if (file) {
                  void this._upload(file, section);
                }
              }}
            />
          </label>`
        : nothing}
    </div>
    ${images === undefined ? html`<p class="hint">Loading images…</p>` : nothing}`;
  }

  private _renderFonts(settings: Settings, targets: Variant[]): TemplateResult {
    const custom = settings.use_custom_font === "on" || settings.use_custom_font === true;
    const current = String(settings.primary_font_family ?? "");
    return html`<div class="tiles">
      ${FONTS.map(([value, label]) => {
        const on = !custom && current === value;
        return html`<button
          class="tile ${on ? "on" : ""}"
          aria-pressed=${on ? "true" : "false"}
          ?disabled=${!this._canEdit}
          @click=${() => this._change(targets, { primary_font_family: value, use_custom_font: "off" })}
        >
          <div class="font-art" style=${styleMap({ fontFamily: `"${value}", system-ui, sans-serif` })}>
            <span class="font-aa">Aa 21°</span><span class="font-sm">Living room</span>
          </div>
          <span class="tile-label">${label}</span>
        </button>`;
      })}
    </div>`;
  }

  private _renderBase(settings: Settings): TemplateResult {
    const base = normaliseHex(String(settings.base_color ?? "")) ?? "#344334";
    const pick = (value: string) => {
      const hex = normaliseHex(value);
      if (hex) {
        this._change([this._variant], { base_color: hex }, `base_color-${this._variant}`);
      }
    };
    return html`
      <div class="base">
        <label class="swatch-big" style=${styleMap({ background: base })}>
          <input
            type="color"
            class="cpick"
            .value=${base.toLowerCase()}
            ?disabled=${!this._canEdit}
            aria-label="Pick base colour"
            @input=${(event: Event) => {
              this._hexDraft = undefined;
              pick((event.target as HTMLInputElement).value);
            }}
          />
        </label>
        <div class="field" style="flex: 1; min-width: 0">
          <label class="lbl" for="ts-hex">Hex code</label>
          <input
            id="ts-hex"
            class="text-input"
            .value=${this._hexDraft ?? base}
            ?disabled=${!this._canEdit}
            spellcheck="false"
            maxlength="7"
            @input=${(event: Event) => {
              const value = (event.target as HTMLInputElement).value;
              this._hexDraft = value;
              pick(value);
            }}
            @blur=${() => (this._hexDraft = undefined)}
          />
        </div>
      </div>
    `;
  }

  private _renderSlider(
    control: Extract<Control, { type: "slider" }>,
    settings: Settings,
    targets: Variant[],
  ): TemplateResult | typeof nothing {
    const item = this._schema.get(control.key);
    if (!item) {
      return nothing;
    }
    const value = Number(settings[control.key] ?? item.default ?? 0);
    const id = `ts-${control.key}`;
    return html`
      <div class="field">
        <div class="lbl">
          <label for=${id}>${control.label ?? item.label}</label><span class="val">${Math.round(value)}${control.unit ? ` ${control.unit}` : ""}</span>
        </div>
        <input
          id=${id}
          type="range"
          min=${item.min ?? 0}
          max=${item.max ?? 100}
          step=${item.step ?? 1}
          .value=${String(value)}
          ?disabled=${!this._canEdit}
          @input=${(event: Event) =>
            this._change(targets, { [control.key]: Number((event.target as HTMLInputElement).value) }, `${control.key}-${targets.join()}`)}
        />
        ${control.ends ? html`<div class="ends"><span>${control.ends[0]}</span><span>${control.ends[1]}</span></div>` : nothing}
      </div>
    `;
  }

  private _renderSegmented(
    control: Extract<Control, { type: "segmented" }>,
    settings: Settings,
    targets: Variant[],
  ): TemplateResult | typeof nothing {
    const item = this._schema.get(control.key);
    if (!item) {
      return nothing;
    }
    const current = String(settings[control.key] ?? item.default ?? "");
    return html`
      <div class="field">
        <div class="lbl">${control.label}</div>
        <div class="seg full" role="group" aria-label=${control.label}>
          ${control.options
            .filter(([value]) => item.options.includes(value))
            .map(
              ([value, label]) => html`<button
                class=${current === value ? "on" : ""}
                aria-pressed=${current === value ? "true" : "false"}
                ?disabled=${!this._canEdit}
                @click=${() => this._change(targets, { [control.key]: value })}
              >
                ${label}
              </button>`,
            )}
        </div>
        ${control.hint ? html`<p class="hint">${control.hint}</p>` : nothing}
      </div>
    `;
  }

  private _roleContrast(role: RoleDef): ContrastPair | undefined {
    const pairs = this._previews[this._variant]?.contrast ?? [];
    const involved = pairs.filter((pair) => PAIR_ROLES[pair.key]?.includes(role.id));
    return involved.reduce<ContrastPair | undefined>(
      (worst, pair) => (!worst || pair.ratio / pair.minimum < worst.ratio / worst.minimum ? pair : worst),
      undefined,
    );
  }

  private _renderRole(role: RoleDef, settings: Settings): TemplateResult {
    const manual = isManual(role, settings);
    const colour = this._roleColour(role, this._variant);
    const worst = this._roleContrast(role);
    const pairs = (this._previews[this._variant]?.contrast ?? []).filter((pair) => PAIR_ROLES[pair.key]?.includes(role.id));
    const good = pairs.every((pair) => pair.ok);
    const variant = this._variant;
    return html`
      <div class="role">
        <div class="rs" style=${styleMap({ background: colour || "transparent" })}>
          ${manual
            ? html`<input
                  type="color"
                  class="cpick"
                  .value=${(normaliseHex(colour) ?? "#000000").toLowerCase()}
                  ?disabled=${!this._canEdit}
                  aria-label=${`Pick ${role.label.toLowerCase()} colour`}
                  @input=${(event: Event) =>
                    this._change([variant], setManual(role, (event.target as HTMLInputElement).value.toUpperCase()), `role-${role.id}-${variant}`)}
                /><span class="rs-lock" aria-hidden="true">${icon("lock", 12)}</span>`
            : nothing}
        </div>
        <div class="role-text">
          <div class="rn">${role.label}</div>
          <div class="role-meta">
            <span class="val">${manual ? "Manual" : "Auto"} · ${colour || "–"}</span>
            ${worst
              ? html`<span class=${good ? "badge small" : "badge small warn"} title=${`Lowest contrast: ${worst.label} (needs ${worst.minimum}:1)`}>${worst.ratio.toFixed(1)}:1</span>`
              : nothing}
          </div>
        </div>
        <div class="mode" role="group" aria-label=${`${role.label} colour mode`}>
          <button class=${manual ? "" : "on"} ?disabled=${!this._canEdit} @click=${() => manual && this._change([variant], setAuto(role))}>Auto</button>
          <button
            class=${manual ? "on" : ""}
            ?disabled=${!this._canEdit || !normaliseHex(colour)}
            @click=${() => {
              const hex = normaliseHex(colour);
              if (!manual && hex) {
                this._change([variant], setManual(role, hex));
              }
            }}
          >
            Manual
          </button>
        </div>
      </div>
    `;
  }

  private _renderMirror(): TemplateResult {
    const source = this._variant === "light" ? "Light" : "Dark";
    const target = this._variant === "light" ? "Dark" : "Light";
    return html`
      <button class="btn" ?disabled=${!this._canEdit} @click=${() => void this._mirror()}>
        ${icon("swap", 18)}Make ${target} from ${source}
      </button>
      <p class="hint">
        Copies ${source} to ${target} with the lightness turned around, so the copy stays readable. ${target}-specific
        colours go back to Auto. Undo brings the old ${target} back.
      </p>
    `;
  }

  private _renderCheck(): TemplateResult {
    const settings = this._edit?.settings[this._variant];
    const preview = this._previews[this._variant];
    if (!settings || !preview) {
      return html`<div class="loading">Loading…</div>`;
    }
    const light = this._previews.light;
    const dark = this._previews.dark;
    return html`
      <div class="sumrow">
        <span class="sumpill">Light · ${light ? readableSummary(light.contrast) : "–"}</span>
        <span class="sumpill">Dark · ${dark ? readableSummary(dark.contrast) : "–"}</span>
      </div>
      <div class="roles">
        ${preview.contrast.map((pair) => {
          const manualRoles = (PAIR_ROLES[pair.key] ?? [])
            .map((id) => ALL_ROLES.find((role) => role.id === id))
            .filter((role): role is RoleDef => Boolean(role && isManual(role, settings)));
          return html`
            <div class="crow">
              <div class="row-text">
                <div class="rn">${pair.label}</div>
                <div class="val">${pair.ratio.toFixed(1)}:1 · needs ${pair.minimum}:1</div>
                ${!pair.ok && manualRoles.length
                  ? html`<div class="hint">Manual: ${manualRoles.map((role) => role.label).join(", ")}</div>`
                  : nothing}
              </div>
              ${pair.ok
                ? html`<span class="badge">Readable</span>`
                : manualRoles.length && this._canEdit
                  ? html`<button
                      class="btn sm"
                      @click=${() => {
                        const patch = Object.assign({}, ...manualRoles.map((role) => setAuto(role)));
                        this._change([this._variant], patch);
                        this._showToast(`${manualRoles.map((role) => role.label).join(", ")} set to Auto.`);
                      }}
                    >
                      ${icon("wand", 16)}Use Auto
                    </button>`
                  : html`<span class="badge warn">Low</span>`}
            </div>
          `;
        })}
      </div>
      <p class="hint">
        Automatic colours are always made readable. Use Auto switches the manual colours of a pair back to automatic;
        Undo brings them back.
      </p>
    `;
  }

  private _renderPreview(): TemplateResult {
    return html`
      <section class="pv" aria-label="Preview">
        <div class="pv-bar">
          <span class="grow"></span>
          <button
            class=${this._both ? "btn on" : "btn"}
            aria-pressed=${this._both ? "true" : "false"}
            @click=${() => {
              this._both = !this._both;
            }}
          >
            ${icon("split", 18)}<span class="hide-p">Light + Dark</span>
          </button>
          <div class="seg hide-p" role="group" aria-label="Preview size">
            ${this._deviceButton("phone", "Phone")} ${this._deviceButton("tablet", "Tablet")}
            ${this._deviceButton("desktop", "Computer")}
          </div>
        </div>
        <div class="stage">${this._renderFrames()}</div>
      </section>
    `;
  }

  private _deviceButton(device: Device, label: string): TemplateResult {
    const on = this._device === device && !this._both;
    return html`<button
      class=${on ? "on" : ""}
      aria-pressed=${on ? "true" : "false"}
      aria-label=${label}
      title=${label}
      @click=${() => {
        this._device = device;
        this._both = false;
      }}
    >
      ${icon(device, 17)}
    </button>`;
  }

  private _renderFrames(): TemplateResult[] {
    const variants: Variant[] = this._both ? ["light", "dark"] : [this._variant];
    const device = this._both ? "phone" : this._device;
    return variants.map((variant) => {
      const data = this._previews[variant];
      return html`
        <div class="fwrap">
          <div class="flabel">${variant === "light" ? "Light" : "Dark"}</div>
          ${data
            ? html`<div class="frame ${device}" style=${styleMap(themeStyle(data.variables))}>${renderMock()}</div>`
            : html`<div class="frame ${device}"><div class="loading">Loading…</div></div>`}
        </div>
      `;
    });
  }

  // Dialogs ------------------------------------------------------------------

  private _closeDialog = (): void => {
    if (!this._busy) {
      this._dialog = undefined;
    }
  };

  private _renderNewDialog(): TemplateResult {
    const themes = this._themes ?? [];
    const sourceName = themes.find((theme) => theme.slug === this._newSource)?.name ?? "theme";
    const image = this._backgrounds?.find((item) => item.file === this._newImage);
    const placeholder =
      this._newMode === "preset"
        ? `My ${sourceName}`
        : this._newMode === "image"
          ? `From ${(image?.file ?? "image").replace(/\.[a-z0-9]+$/i, "")}`
          : "My theme";
    const option = (mode: NewMode, title: string, text: string, glyph: "grid" | "palette" | "image") => html`<button
      class="opt ${this._newMode === mode ? "on" : ""}"
      aria-pressed=${this._newMode === mode ? "true" : "false"}
      @click=${() => (this._newMode = mode)}
    >
      ${icon(glyph, 22)}<span class="ot">${title}</span><span class="hint">${text}</span>
    </button>`;
    return html`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label="New theme" @click=${(event: Event) => event.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">New theme</h2>
              <p class="sp">You get a light and a dark variant. Everything can be changed afterwards.</p>
            </div>
            <button class="btn icon" aria-label="Close" @click=${this._closeDialog}>${icon("close", 18)}</button>
          </div>
          <div class="opts">
            ${option("preset", "From a theme", "Copy a preset or one of your themes.", "grid")}
            ${option("colour", "From one colour", "Pick a base colour; the rest is worked out.", "palette")}
            ${option("image", "From an image", "Colours come from a background image.", "image")}
          </div>
          ${this._newMode === "preset"
            ? html`<div class="field">
                <label class="lbl" for="ts-source">Start from</label>
                <select
                  id="ts-source"
                  class="text-input"
                  .value=${this._newSource}
                  @change=${(event: Event) => (this._newSource = (event.target as HTMLSelectElement).value)}
                >
                  ${themes.map(
                    (theme) => html`<option value=${theme.slug} ?selected=${theme.slug === this._newSource}>
                      ${theme.name}${theme.builtin ? "" : " (mine)"}
                    </option>`,
                  )}
                </select>
              </div>`
            : nothing}
          ${this._newMode === "colour"
            ? html`<div class="base">
                <label class="swatch-big" style=${styleMap({ background: this._newColour })}>
                  <input
                    type="color"
                    class="cpick"
                    .value=${this._newColour.toLowerCase()}
                    aria-label="Pick base colour"
                    @input=${(event: Event) => (this._newColour = (event.target as HTMLInputElement).value.toUpperCase())}
                  />
                </label>
                <div class="field">
                  <span class="lbl">Base colour</span>
                  <span class="val">${this._newColour}</span>
                </div>
              </div>`
            : nothing}
          ${this._newMode === "image"
            ? this._backgrounds === undefined
              ? html`<div class="loading">Loading images…</div>`
              : this._backgrounds.length
                ? html`<div class="images">
                    ${this._backgrounds.map(
                      (item) => html`<button
                        class="image ${item.file === this._newImage ? "on" : ""}"
                        aria-pressed=${item.file === this._newImage ? "true" : "false"}
                        @click=${() => (this._newImage = item.file)}
                      >
                        <img src=${item.url} alt="" loading="lazy" /><span>${item.file}</span>
                      </button>`,
                    )}
                  </div>`
                : html`<p class="hint">No images in /config/www/background yet.</p>`
            : nothing}
          <div class="field">
            <label class="lbl" for="ts-newname">Name</label>
            <input
              id="ts-newname"
              class="text-input plain"
              maxlength="60"
              .value=${this._newName}
              placeholder=${placeholder}
              @input=${(event: Event) => (this._newName = (event.target as HTMLInputElement).value)}
            />
          </div>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>Cancel</button>
            <button class="btn primary" ?disabled=${this._busy || (this._newMode === "image" && !this._newImage)} @click=${() => void this._createNew()}>
              Create and open
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderUseDialog(): TemplateResult {
    const name = this._edit?.name ?? "";
    const option = (scope: "device" | "everyone", glyph: "phone" | "home", title: string, text: string) => html`<button
      class="opt ${this._useScope === scope ? "on" : ""}"
      aria-pressed=${this._useScope === scope ? "true" : "false"}
      @click=${() => (this._useScope = scope)}
    >
      ${icon(glyph, 22)}<span class="ot">${title}</span><span class="hint">${text}</span>
    </button>`;
    return html`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label="Use theme" @click=${(event: Event) => event.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">Use “${name}”</h2>
              <p class="sp">Light and Dark come together. Home Assistant switches between them with the device's dark mode.</p>
            </div>
            <button class="btn icon" aria-label="Close" @click=${this._closeDialog}>${icon("close", 18)}</button>
          </div>
          <div class="opts two">
            ${option("device", "phone", "Just me", "Your profile, on all your devices. Others keep their theme.")}
            ${option("everyone", "home", "Everyone", "The default theme. You follow it too; people who picked their own theme in their profile keep it.")}
          </div>
          <p class="hint">After more changes, use the theme again to update it everywhere it is used.</p>
          <div class="field">
            <div class="lbl">Share</div>
            <div class="share-row">
              <button class="btn" @click=${() => void this._export("copy")}>${icon("copy", 18)}Copy share code</button>
              <button class="btn" @click=${() => void this._export("download")}>${icon("download", 18)}Download file</button>
            </div>
            <p class="hint">Others can import the code or file in their Theme Studio. It holds colours and settings only.</p>
          </div>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>Cancel</button>
            <button class="btn primary" ?disabled=${this._busy} @click=${() => void this._use()}>
              ${this._busy ? "Working…" : "Use theme"}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderImportDialog(): TemplateResult {
    return html`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label="Import a theme" @click=${(event: Event) => event.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">Import a theme</h2>
              <p class="sp">Paste a share code (TS1:…) or choose a theme file. It becomes a new theme; nothing is overwritten.</p>
            </div>
            <button class="btn icon" aria-label="Close" @click=${this._closeDialog}>${icon("close", 18)}</button>
          </div>
          <div class="field">
            <label class="lbl" for="ts-import">Share code or file content</label>
            <textarea
              id="ts-import"
              class="text-input area"
              rows="5"
              spellcheck="false"
              placeholder="TS1:…"
              .value=${this._importText}
              @input=${(event: Event) => (this._importText = (event.target as HTMLTextAreaElement).value)}
            ></textarea>
          </div>
          <label class="btn file-btn">
            ${icon("upload", 18)}Choose file
            <input
              type="file"
              accept=".json,.txt,application/json,text/plain"
              @change=${async (event: Event) => {
                const input = event.target as HTMLInputElement;
                const file = input.files?.[0];
                input.value = "";
                if (file) {
                  this._importText = (await file.text()).slice(0, 300000);
                }
              }}
            />
          </label>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>Cancel</button>
            <button class="btn primary" ?disabled=${this._busy || !this._importText.trim()} @click=${() => void this._import()}>
              Import and open
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderDeleteDialog(): TemplateResult {
    const name = this._edit?.name ?? "";
    return html`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="alertdialog" aria-modal="true" aria-label="Delete theme" @click=${(event: Event) => event.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">Delete “${name}”?</h2>
              <p class="sp">
                The theme and its theme file are removed from Home Assistant. A backup copy of the theme stays in
                /config/theme_studio/user_themes.
              </p>
            </div>
          </div>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>Cancel</button>
            <button class="btn primary" ?disabled=${this._busy} @click=${() => void this._delete()}>${icon("trash", 18)}Delete</button>
          </div>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("theme-studio-panel")) {
  customElements.define("theme-studio-panel", ThemeStudioPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    "theme-studio-panel": ThemeStudioPanel;
  }
}
