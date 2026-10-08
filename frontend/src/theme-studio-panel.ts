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
import { LANGUAGES, fromHomeAssistant, isLang, setLanguage, t, tOr, type Lang } from "./i18n";
import { icon } from "./icons";
import { mockStyles, renderMock } from "./mock";
import { panelStyles } from "./styles";
import {
  TOURS,
  measureTargets,
  placePopover,
  renderClip,
  revealTarget,
  tourStyles,
  type ClipContext,
  type Rect,
  type TourKind,
  type TourStep,
} from "./tour";
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
const LOGO_URL = "/theme_studio_static/logo-mark.png";
const USER_DATA_KEY = "theme_studio";
const HELP_STEP: TourStep = { id: "help", chapter: "finish", screen: "library", targets: ["help"], limit: 1, side: "below", clip: "help" };
const UPLOAD_ERRORS: Record<string, string> = {
  not_an_image: "upload.not_an_image",
  unsupported_format: "upload.unsupported_format",
  too_large: "upload.too_large",
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
type TourState = { kind: "welcome" } | { kind: TourKind; step: number };

/** What Theme Studio keeps per Home Assistant user (frontend user data). */
interface UserData {
  language?: Lang;
  tour?: "done";
}

function sameRect(a?: Rect, b?: Rect): boolean {
  return a === b || Boolean(a && b && a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h);
}
type NewMode = "preset" | "colour" | "image";

function errorText(error: unknown): string {
  if (error && typeof error === "object") {
    const record = error as { code?: unknown; message?: unknown };
    if (record.code === "name_taken") {
      return t("error.name_taken");
    }
    if (record.code === "unauthorized") {
      return t("error.unauthorized");
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
  return failing === 0
    ? t("check.all_readable", { count: pairs.length })
    : t("check.some_low", { failing, count: pairs.length });
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

function roleLabel(role: RoleDef): string {
  return tOr(`role.${role.id}`, role.label);
}

function pairLabel(pair: ContrastPair): string {
  return tOr(`pair.${pair.key}`, pair.label);
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
    _userData: { state: true },
    _tour: { state: true },
    _tourRect: { state: true },
    _hintRect: { state: true },
    _size: { state: true },
    _hint: { state: true },
  };

  static override styles = [panelStyles, mockStyles, editorStyles, tourStyles];

  declare hass?: Hass;
  declare narrow: boolean;
  declare route?: Route;
  declare panel?: { config?: { language?: string } };
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
  declare _userData?: UserData;
  declare _tour?: TourState;
  declare _tourRect?: Rect;
  declare _hintRect?: Rect;
  declare _size: { width: number; height: number };
  declare _hint: boolean;

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
  private _userDataLoading = false;
  private _tourFrame?: number;
  private _revealed?: string;
  private _hintRevealed = false;
  private _resizer?: ResizeObserver;

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
    this._size = { width: 0, height: 0 };
    this._hint = false;
    try {
      const stored = JSON.parse(window.localStorage.getItem(LINK_STORAGE) ?? "[]");
      if (Array.isArray(stored)) {
        this._linked = new Set(stored.map(String));
      }
    } catch {
      // Private mode or blocked storage: links are not remembered.
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("keydown", this._tourKey);
    if (typeof ResizeObserver !== "undefined") {
      this._resizer = new ResizeObserver(() => {
        this._size = { width: this.clientWidth, height: this.clientHeight };
      });
      this._resizer.observe(this);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this._tourKey);
    this._resizer?.disconnect();
    this._resizer = undefined;
    if (this._tourFrame !== undefined) {
      window.cancelAnimationFrame(this._tourFrame);
      this._tourFrame = undefined;
    }
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
      if (!this._userData && !this._userDataLoading) {
        void this._loadUserData();
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
    if (changed.has("_tour") && this._tour) {
      this.renderRoot.querySelector<HTMLElement>(".tour-pop, .tour-welcome")?.focus({ preventScroll: true });
    }
    if ((this._tour && this._tour.kind !== "welcome") || this._hint) {
      if (this._tourFrame === undefined) {
        this._tourFrame = window.requestAnimationFrame(this._measureTour);
      }
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
      return t("lib.in_use_everyone");
    }
    if (this._inUse.device === name) {
      return t("lib.in_use_you");
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
        this._detailError = t("editor.not_built");
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
      this._showToast(t("toast.preview_failed", { error: errorText(error) }));
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
    const wanted = this._edit.name !== this._presetName() ? this._edit.name : t("editor.copy_name", { name: this._edit.name });
    const result = await this.hass.callWS<{ slug: string; name: string }>({
      type: "theme_studio/theme/new",
      source: this._edit.slug,
      name: wanted.trim() || t("editor.copy_name", { name: this._presetName() }),
    });
    this._edit = { ...this._edit, slug: result.slug, name: result.name, builtin: false };
    this._detailSlug = result.slug;
    this._navigate(`${this._prefix()}/theme/${encodeURIComponent(result.slug)}`, true);
    this._showToast(t("toast.forked", { name: result.name }));
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
          ? t("toast.used_everyone", { name: result.theme })
          : t("toast.used_you", { name: result.theme }),
      );
    } catch (error) {
      this._showToast(t("toast.use_failed", { error: errorText(error) }));
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
          this._showToast(t("toast.share_copied"));
        } catch {
          this._importText = result.share_string;
          this._showToast(t("toast.share_blocked"));
        }
        return;
      }
      const blob = new Blob([`${JSON.stringify(result.document, null, 2)}\n`], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = result.file_name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(link.href), 2000);
      this._showToast(t("toast.downloaded", { file: result.file_name }));
    } catch (error) {
      this._showToast(t("toast.share_failed", { error: errorText(error) }));
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
        result.renamed ? t("toast.imported_renamed", { name: result.name }) : t("toast.imported", { name: result.name }),
      );
    } catch (error) {
      const record = error as { code?: string };
      this._showToast(
        record?.code && record.code !== "unknown_error"
          ? t("toast.import_invalid")
          : t("toast.import_failed", { error: errorText(error) }),
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
      this._showToast(t("toast.deleted", { name }));
    } catch (error) {
      this._showToast(t("toast.delete_failed", { error: errorText(error) }));
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
      this._showToast(t("toast.mirrored", { target: t(`variant.${target}`), source: t(`variant.${source}`) }));
    } catch (error) {
      this._showToast(t("toast.mirror_failed", { error: errorText(error) }));
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
      this._showToast(t("toast.created", { name: result.name }));
    } catch (error) {
      this._showToast(t("toast.create_failed", { error: errorText(error) }));
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
      this._showToast(t("toast.upload_unsupported"));
      return;
    }
    const body = new FormData();
    body.append("file", file, file.name);
    this._busy = true;
    try {
      const response = await this.hass.fetchWithAuth(UPLOAD_URL, { method: "POST", body });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; url?: string; file?: string; reason?: string; message?: string };
      if (!response.ok || !result.ok || !result.url) {
        const known = UPLOAD_ERRORS[result.reason ?? ""];
        throw new Error(known ? t(known) : (result.message ?? response.statusText));
      }
      this._backgrounds = undefined;
      await this._loadBackgrounds();
      this._change(this._targets(section), { use_background_image: "on", background_image_url: result.url });
      this._showToast(t("toast.uploaded", { file: result.file ?? "" }));
    } catch (error) {
      this._showToast(t("toast.upload_failed", { error: errorText(error) }));
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

  // Language and guide -------------------------------------------------------

  /** The user's own choice, then the integration option, then Home Assistant's language. */
  private _language(): Lang {
    if (isLang(this._userData?.language)) {
      return this._userData.language;
    }
    const option = this.panel?.config?.language;
    if (isLang(option)) {
      return option;
    }
    return fromHomeAssistant(this.hass?.locale?.language ?? this.hass?.language);
  }

  private async _loadUserData(): Promise<void> {
    if (!this.hass) {
      return;
    }
    this._userDataLoading = true;
    try {
      const result = await this.hass.callWS<{ value?: UserData | null }>({ type: "frontend/get_user_data", key: USER_DATA_KEY });
      const value = result?.value && typeof result.value === "object" ? result.value : {};
      this._userData = {
        language: isLang(value.language) ? value.language : undefined,
        tour: value.tour === "done" ? "done" : undefined,
      };
      if (this._canEdit && this._userData.tour !== "done" && !this._tour) {
        this._tour = { kind: "welcome" };
      }
    } catch {
      // Older Home Assistant or no access: no remembered language, and the
      // guide only opens from the ? button.
      this._userData = { tour: "done" };
    } finally {
      this._userDataLoading = false;
    }
  }

  private async _saveUserData(patch: UserData): Promise<void> {
    this._userData = { ...this._userData, ...patch };
    if (!this.hass) {
      return;
    }
    try {
      await this.hass.callWS({ type: "frontend/set_user_data", key: USER_DATA_KEY, value: this._userData });
    } catch {
      // Not remembered on this device; everything still works.
    }
  }

  private _pickLanguage(lang: Lang): void {
    void this._saveUserData({ language: lang });
  }

  private _openGuide(): void {
    this._hint = false;
    this._hintRect = undefined;
    this._dialog = undefined;
    this._tour = { kind: "welcome" };
  }

  /** The theme the guide shows in the editor: the open one, else one of the user's, else a preset. */
  private _tourTheme(): string | undefined {
    if (this._slug) {
      return this._slug;
    }
    const themes = this._themes ?? [];
    return (themes.find((theme) => !theme.builtin) ?? themes.find((theme) => theme.slug === "glass") ?? themes[0])?.slug;
  }

  private async _showStep(kind: TourKind, index: number): Promise<void> {
    const step = TOURS[kind][index];
    if (!step) {
      return;
    }
    this._dialog = undefined;
    this._tourRect = undefined;
    this._revealed = undefined;
    this._tour = { kind, step: index };
    if (step.screen === "library") {
      if (this._slug) {
        await this._back();
      }
      return;
    }
    if (!this._slug) {
      const slug = this._tourTheme();
      if (slug) {
        this._openTheme(slug);
      }
    }
    if (step.section) {
      this._section = step.section;
    }
  }

  private _tourNext(): void {
    const tour = this._tour;
    if (!tour || tour.kind === "welcome") {
      return;
    }
    if (tour.step + 1 < TOURS[tour.kind].length) {
      void this._showStep(tour.kind, tour.step + 1);
    } else {
      this._endTour();
    }
  }

  private _tourBack(): void {
    const tour = this._tour;
    if (tour && tour.kind !== "welcome" && tour.step > 0) {
      void this._showStep(tour.kind, tour.step - 1);
    }
  }

  /** Finished or skipped. The first time, the ? button is pointed out. */
  private _endTour(): void {
    const first = this._userData?.tour !== "done";
    this._tour = undefined;
    this._tourRect = undefined;
    this._revealed = undefined;
    void this._saveUserData({ tour: "done" });
    if (first) {
      this._hintRevealed = false;
      this._hint = true;
    }
  }

  private _dismissHint = (): void => {
    this._hint = false;
    this._hintRect = undefined;
  };

  private _tourKey = (event: KeyboardEvent): void => {
    if (!this._tour) {
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      this._endTour();
      return;
    }
    const origin = event.composedPath()[0];
    if (origin instanceof HTMLInputElement || origin instanceof HTMLTextAreaElement || origin instanceof HTMLSelectElement) {
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      this._tourNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      this._tourBack();
    }
  };

  /** Finds the highlighted element after each render; only stores a new box when it moved. */
  private _measureTour = (): void => {
    this._tourFrame = undefined;
    const origin = this.getBoundingClientRect();
    const tour = this._tour;
    if (tour && tour.kind !== "welcome") {
      const step = TOURS[tour.kind][tour.step];
      const key = `${tour.kind}:${tour.step}`;
      // The editor may still be loading; the target is scrolled into view the
      // first time it exists.
      if (step.targets.length && this._revealed !== key && revealTarget(this.renderRoot, step)) {
        this._revealed = key;
      }
      const rect = step.targets.length ? measureTargets(this.renderRoot, origin, step) : undefined;
      if (!sameRect(rect, this._tourRect)) {
        this._tourRect = rect;
      }
    }
    if (this._hint) {
      if (!this._hintRevealed && revealTarget(this.renderRoot, HELP_STEP)) {
        this._hintRevealed = true;
      }
      const rect = measureTargets(this.renderRoot, origin, HELP_STEP);
      if (!sameRect(rect, this._hintRect)) {
        this._hintRect = rect;
      }
    }
  };

  private _clipContext(): ClipContext {
    const themes = [...(this._themes ?? [])].sort((a, b) => Number(a.builtin) - Number(b.builtin));
    const base = normaliseHex(String(this._edit?.settings[this._variant]?.base_color ?? "")) ?? "#3A6EA5";
    return {
      base,
      cards: themes.slice(0, 2).map((theme) => ({ name: theme.name, light: theme.light?.summary, dark: theme.dark?.summary })),
      variant: this._variant,
    };
  }

  private _renderWelcome(): TemplateResult {
    const current = this._language();
    const narrow = this._size.width > 0 && this._size.width < 720;
    const choice = (kind: TourKind, main: boolean) => html`<button class="tour-choice ${main ? "main" : ""}" @click=${() => void this._showStep(kind, 0)}>
      <span class="tour-meta">${t(`tour.${kind}.meta`, { count: TOURS[kind].length })}</span>
      <strong>${icon(kind === "quick" ? "wand" : "grid", 18)}${t(`tour.${kind}`)}</strong>
      <span class="hint">${t(`tour.${kind}.desc`)}</span>
    </button>`;
    return html`
      <div class="scrim tour-scrim ${narrow ? "sheet" : ""}">
        <div class="dialog tour-welcome" role="dialog" aria-modal="true" aria-labelledby="ts-welcome" tabindex="-1">
          <div class="dhead">
            <div>
              <h2 class="sh" id="ts-welcome">${t("tour.welcome.title")}</h2>
              <p class="sp">${t("tour.welcome.body")}</p>
            </div>
            <button class="btn icon" aria-label=${t("tour.skip_all")} @click=${() => this._endTour()}>${icon("close", 18)}</button>
          </div>
          <div class="tour-choices ${narrow ? "narrow" : ""}">${choice("quick", true)}${choice("full", false)}</div>
          <div class="tour-section">
            <div class="lbl">${t("tour.language")}</div>
            <div class="tour-langs" role="group" aria-label=${t("tour.language")}>
              ${LANGUAGES.map(
                (item) => html`<button
                  class="tour-lang ${item.code === current ? "on" : ""}"
                  lang=${item.code}
                  aria-pressed=${item.code === current ? "true" : "false"}
                  @click=${() => this._pickLanguage(item.code)}
                >
                  ${item.label}
                </button>`,
              )}
            </div>
            <p class="tour-note">${t("tour.language.note")}</p>
          </div>
          <div class="dfoot">
            <button class="linkish" @click=${() => this._endTour()}>${t("tour.skip_all")}</button>
            <span class="hint">${t("tour.help_later")}</span>
          </div>
        </div>
      </div>
    `;
  }

  private _renderTourStep(kind: TourKind, index: number): TemplateResult {
    const steps = TOURS[kind];
    const step = steps[index];
    const rect = this._tourRect;
    const width = this._size.width || this.clientWidth;
    const height = this._size.height || this.clientHeight;
    const place = placePopover(rect, rect ? step.side : "center", width, height);
    const last = index === steps.length - 1;
    return html`
      <div class="tour-layer" @click=${(event: Event) => event.stopPropagation()}>
        ${rect
          ? html`<div class="tour-spot" style=${styleMap({ left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.w}px`, height: `${rect.h}px` })}></div>`
          : html`<div class="tour-dim"></div>`}
        <div class="tour-pop" style=${styleMap(place.style)} role="dialog" aria-modal="true" aria-labelledby="ts-tour-title" tabindex="-1">
          ${place.arrow ? html`<div class="tour-arrow" style=${styleMap(place.arrow)}></div>` : nothing}
          <div class="tour-inner">
            <div class="tour-top">
              <span class="tour-count">${t(`tour.chapter.${step.chapter}`)} · ${t("tour.step_of", { n: index + 1, total: steps.length })}</span>
            </div>
            <div class="clip" aria-hidden="true">${renderClip(step, this._clipContext())}</div>
            <h2 class="tour-title" id="ts-tour-title">${t(`tour.${step.id}.title`)}</h2>
            <p class="tour-body">${t(`tour.${step.id}.body`)}</p>
            <div class="tour-progress"><span style=${styleMap({ width: `${Math.round(((index + 1) / steps.length) * 100)}%` })}></span></div>
            <div class="tour-foot">
              ${last ? nothing : html`<button class="linkish" @click=${() => this._endTour()}>${t("tour.skip")}</button>`}
              <span class="grow"></span>
              ${index > 0 ? html`<button class="btn sm" @click=${() => this._tourBack()}>${t("tour.back")}</button>` : nothing}
              ${last && kind === "quick" ? html`<button class="btn sm" @click=${() => void this._showStep("full", 0)}>${t("tour.see_all")}</button>` : nothing}
              <button class="btn sm primary" @click=${() => this._tourNext()}>${last ? t("tour.done") : t("tour.next")}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderHint(): TemplateResult | typeof nothing {
    const rect = this._hintRect;
    if (!rect) {
      return nothing;
    }
    const width = this._size.width || this.clientWidth;
    const left = Math.max(8, Math.min(width - 288, rect.x + rect.w - 280));
    return html`
      <div class="tour-ring" style=${styleMap({ left: `${rect.x}px`, top: `${rect.y}px`, width: `${rect.w}px`, height: `${rect.h}px` })}></div>
      <div class="tour-hint tour-pop" role="status" style=${styleMap({ left: `${left}px`, top: `${rect.y + rect.h + 10}px` })}>
        <div class="tour-inner">
          <p class="tour-body">${t("tour.hint")}</p>
          <div class="tour-foot"><span class="grow"></span><button class="btn sm primary" @click=${this._dismissHint}>${t("tour.got_it")}</button></div>
        </div>
      </div>
    `;
  }

  private _helpButton(where: "bar" | "phone"): TemplateResult {
    return html`<button
      class="btn icon help ${where === "bar" ? "hide-p" : "only-p"}"
      data-tour="help"
      aria-label=${t("tour.help")}
      title=${t("tour.help")}
      @click=${() => this._openGuide()}
    >
      ${icon("help", 20)}
    </button>`;
  }

  // Rendering ----------------------------------------------------------------

  protected override render(): TemplateResult {
    setLanguage(this._language());
    const tour = this._tour;
    return html`
      ${this._slug ? this._renderEditor(this._slug) : this._renderLibrary()}
      ${this._dialog === "new" ? this._renderNewDialog() : nothing}
      ${this._dialog === "delete" ? this._renderDeleteDialog() : nothing}
      ${this._dialog === "use" ? this._renderUseDialog() : nothing}
      ${this._dialog === "import" ? this._renderImportDialog() : nothing}
      ${tour?.kind === "welcome" ? this._renderWelcome() : nothing}
      ${tour && tour.kind !== "welcome" ? this._renderTourStep(tour.kind, tour.step) : nothing}
      ${this._hint && !tour ? this._renderHint() : nothing}
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
      { title: t("lib.group_mine"), items: visible.filter((theme) => !theme.builtin) },
      { title: t("lib.group_builtin"), items: visible.filter((theme) => theme.builtin) },
    ].filter((group) => group.items.length > 0);

    return html`
      <div class="shell">
        <header class="bar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <img class="logo" src=${LOGO_URL} alt="" width="40" height="40" />
          <div class="titlebox">
            <div class="title">Theme Studio</div>
            <div class="status">${themes.length ? t("lib.themes_count", { count: themes.length }) : t("lib.tagline")}</div>
          </div>
          ${this._helpButton("bar")}
          <button class="btn icon" data-tour="reload" @click=${this._refresh} aria-label=${t("lib.reload")} title=${t("lib.reload")}>
            ${icon("refresh")}
          </button>
          ${this._canEdit
            ? html`<button class="btn" data-tour="import" aria-label=${t("lib.import_label")} @click=${() => (this._dialog = "import")}>
                ${icon("download", 18)}<span class="hide-p">${t("lib.import")}</span>
              </button>`
            : nothing}
          ${this._canEdit
            ? html`<button
                class="btn primary"
                data-tour="new"
                aria-label=${t("lib.new_theme")}
                @click=${() => {
                  this._dialog = "new";
                  void this._loadBackgrounds();
                }}
              >
                ${icon("plus", 18)}<span class="hide-p">${t("lib.new_theme")}</span>
              </button>`
            : nothing}
        </header>
        <main class="lib">
          <div class="lib-head">
            <div>
              <h1 class="lib-title">${t("lib.title")}</h1>
              <p class="sub">${t("lib.sub")}</p>
            </div>
            <div class="lib-tools">
              <div class="seg" data-tour="filter" role="group" aria-label=${t("lib.filter")}>
                ${this._filterButton("all", t("lib.all"))} ${this._filterButton("mine", t("lib.mine"))}
                ${this._filterButton("builtin", t("lib.builtin"))}
              </div>
              ${this._helpButton("phone")}
            </div>
          </div>
          ${this._error
            ? html`<div class="message">
                <strong>${t("lib.load_failed")}</strong>
                <span class="hint">${this._error}</span>
                <button class="btn sm" @click=${this._refresh}>${t("common.try_again")}</button>
              </div>`
            : nothing}
          ${this._loading && !this._themes ? html`<div class="loading">${t("lib.loading")}</div>` : nothing}
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
      <button class="tcard" data-tour="card" @click=${() => this._openTheme(theme.slug)} aria-label=${t("lib.open", { name: theme.name })}>
        <div class="mini">${this._renderMini(theme.light)}${this._renderMini(theme.dark)}</div>
        <div class="tmeta">
          <div class="tmeta-text">
            <div class="tname">${theme.name}</div>
            <div class="tsub">${theme.builtin ? t("lib.card_builtin") : t("lib.card_mine")}</div>
          </div>
          ${this._inUseText(theme.name)
            ? html`<span class="badge">${this._inUseText(theme.name)}</span>`
            : failing
              ? html`<span class="badge warn">${t("lib.to_check", { count: failing })}</span>`
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
      return t("status.view_only");
    }
    if (!this._edit) {
      return t("common.loading");
    }
    if (this._edit.builtin && this._saveState === "saved") {
      return t("status.builtin");
    }
    switch (this._saveState) {
      case "saving":
        return t("status.saving");
      case "unsaved":
        return t("status.unsaved");
      case "error":
        return t("status.error", { error: this._saveError ?? t("error.unknown") });
      default:
        return t("status.saved");
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
          <button class="btn icon" @click=${() => void this._back()} aria-label=${t("editor.back")}>${icon("back")}</button>
          <div class="titlebox" data-tour="name">
            <input
              class="name"
              .value=${name}
              ?disabled=${!edit || !this._canEdit}
              aria-label=${t("editor.name")}
              spellcheck="false"
              maxlength="60"
              @input=${(event: Event) => this._rename((event.target as HTMLInputElement).value)}
            />
            <div class="status ${this._saveState === "error" ? "error" : ""}">${this._statusText()}</div>
          </div>
          <button class="btn icon" data-tour="undo" aria-label=${t("editor.undo")} title=${t("editor.undo")} ?disabled=${!this._history.length} @click=${() => this._restore("_history")}>
            ${icon("undo", 19)}
          </button>
          <button class="btn icon hide-p" data-tour="undo" aria-label=${t("editor.redo")} title=${t("editor.redo")} ?disabled=${!this._future.length} @click=${() => this._restore("_future")}>
            ${icon("redo", 19)}
          </button>
          ${this._helpButton("bar")}
          <div class="seg" data-tour="variant" role="group" aria-label=${t("editor.variant")}>
            ${this._variantButton("light", t("variant.light"))} ${this._variantButton("dark", t("variant.dark"))}
          </div>
          ${edit && this._canEdit
            ? html`
                <button class="btn primary" data-tour="use" ?disabled=${this._busy} aria-label=${t("editor.use")} @click=${() => (this._dialog = "use")}>
                  ${icon("check", 18)}<span class="hide-t">${t("editor.use")}</span>
                </button>
              `
            : nothing}
        </header>
        ${this._detailError
          ? html`<div class="message">
              <strong>${t("editor.load_failed", { name })}</strong>
              <span class="hint">${this._detailError}</span>
              <button class="btn sm" @click=${() => void this._back()}>${t("editor.back")}</button>
            </div>`
          : html`<div class="editor">
              <nav class="rail" aria-label=${t("editor.sections")}>
                ${SECTIONS.map(
                  (item) => html`<button class="rail-btn ${item.id === section.id ? "on" : ""}" data-tour=${`section-${item.id}`} @click=${() => (this._section = item.id)}>
                    ${icon(item.icon, 22)}${t(`section.${item.id}`)}
                    ${item.id === "check" && failing ? html`<span class="count">${failing}</span>` : nothing}
                  </button>`,
                )}
              </nav>
              <section class="ctl" aria-label=${t("editor.controls")}>
                <div class="chips" role="group" aria-label=${t("editor.sections")}>
                  ${SECTIONS.map(
                    (item) => html`<button class="chip ${item.id === section.id ? "on" : ""}" data-tour=${`section-${item.id}`} @click=${() => (this._section = item.id)}>
                      ${t(`section.${item.id}`)}
                      ${item.id === "check" && failing ? html`<span class="count">${failing}</span>` : nothing}
                    </button>`,
                  )}
                  ${this._helpButton("phone")}
                </div>
                ${edit?.builtin && this._canEdit
                  ? html`<div class="banner">
                      ${icon("lock", 18)}
                      <span>${t("editor.builtin_banner")}</span>
                    </div>`
                  : nothing}
                ${edit && this._schema.size
                  ? html`<div class="sec">
                      <div>
                        <h2 class="sh">${t(`section.${section.id}`)}</h2>
                        <p class="sp">${t(`section.${section.id}.description`)}</p>
                      </div>
                      ${section.linkable && this._canEdit ? this._renderLinkRow(section) : nothing}
                      ${section.id === "check" ? this._renderCheck() : section.groups.map((group) => this._renderGroup(group, section))}
                      ${!edit.builtin && this._canEdit
                        ? html`<div class="sec-foot">
                            <button class="btn danger" data-tour="delete" @click=${() => (this._dialog = "delete")}>${icon("trash", 18)}${t("editor.delete")}</button>
                          </div>`
                        : nothing}
                    </div>`
                  : html`<div class="loading">${t("common.loading")}</div>`}
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
    return html`<button class="toggle-row" data-tour="link" aria-pressed=${linked ? "true" : "false"} @click=${() => this._toggleLinked()}>
      <span class="tr-text">
        <span class="tr-title">${t("link.title")}</span>
        <span class="hint">${linked ? t("link.on") : t("link.off", { variant: t(`variant.${this._variant}`) })}</span>
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
      <div class="group" data-tour=${`group-${group.id}`}>
        ${group.collapsible
          ? html`<button class="group-head ${open ? "open" : ""}" aria-expanded=${open ? "true" : "false"} @click=${toggle}>
              <span class="h">${tOr(`group.${group.id}`, group.title)}</span>${icon("chevron", 18)}
            </button>`
          : html`<div class="h">${tOr(`group.${group.id}`, group.title)}</div>`}
        ${open ? group.controls.map((control) => this._renderControl(control, section)) : nothing}
        ${open && group.hint ? html`<p class="hint">${tOr(`group.${group.id}.hint`, group.hint)}</p>` : nothing}
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
      data-tour=${`ctl-${control.key}`}
      aria-pressed=${on ? "true" : "false"}
      ?disabled=${!this._canEdit}
      @click=${() => this._change(targets, { [control.key]: on ? "off" : "on" })}
    >
      <span class="tr-text">
        <span class="tr-title">${tOr(`ctl.${control.key}`, control.label)}</span>
        ${control.hint ? html`<span class="hint">${control.hint}</span>` : nothing}
      </span>
      <span class="switch ${on ? "on" : ""}" aria-hidden="true"></span>
    </button>`;
  }

  private _renderText(control: Extract<Control, { type: "text" }>, settings: Settings, targets: Variant[]): TemplateResult {
    const id = `ts-${control.key}`;
    return html`<div class="field" data-tour=${`ctl-${control.key}`}>
      <label class="lbl" for=${id}>${tOr(`ctl.${control.key}`, control.label)}</label>
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
    return html`<div class="tiles" data-tour=${`ctl-${control.key}`}>
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
          <span class="tile-label">${tOr(`${control.preview}.${value}`, label)}</span>
        </button>`;
      })}
    </div>`;
  }

  private _renderImages(settings: Settings, targets: Variant[], section: Section): TemplateResult {
    const enabled = settings.use_background_image === "on" || settings.use_background_image === true;
    const url = String(settings.background_image_url ?? "");
    const images = this._backgrounds;
    return html`<div class="images" data-tour="images">
      <button
        class="image none ${enabled ? "" : "on"}"
        aria-pressed=${enabled ? "false" : "true"}
        ?disabled=${!this._canEdit}
        @click=${() => this._change(targets, { use_background_image: "off" })}
      >
        <span class="image-none">${icon("close", 22)}</span><span>${t("images.none")}</span>
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
            <span class="image-none">${icon("upload", 22)}</span><span>${this._busy ? t("images.uploading") : t("images.upload")}</span>
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
    ${images === undefined ? html`<p class="hint">${t("images.loading")}</p>` : nothing}`;
  }

  private _renderFonts(settings: Settings, targets: Variant[]): TemplateResult {
    const custom = settings.use_custom_font === "on" || settings.use_custom_font === true;
    const current = String(settings.primary_font_family ?? "");
    return html`<div class="tiles" data-tour="fonts">
      ${FONTS.map(([value, label]) => {
        const on = !custom && current === value;
        return html`<button
          class="tile ${on ? "on" : ""}"
          aria-pressed=${on ? "true" : "false"}
          ?disabled=${!this._canEdit}
          @click=${() => this._change(targets, { primary_font_family: value, use_custom_font: "off" })}
        >
          <div class="font-art" style=${styleMap({ fontFamily: `"${value}", system-ui, sans-serif` })}>
            <span class="font-aa">Aa 21°</span><span class="font-sm">${t("mock.living_room")}</span>
          </div>
          <span class="tile-label">${tOr(`font.${value}`, label)}</span>
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
            aria-label=${t("base.pick")}
            @input=${(event: Event) => {
              this._hexDraft = undefined;
              pick((event.target as HTMLInputElement).value);
            }}
          />
        </label>
        <div class="field" style="flex: 1; min-width: 0">
          <label class="lbl" for="ts-hex">${t("base.hex")}</label>
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
      <div class="field" data-tour=${`ctl-${control.key}`}>
        <div class="lbl">
          <label for=${id}>${tOr(`ctl.${control.key}`, control.label ?? item.label)}</label><span class="val">${Math.round(value)}${control.unit ? ` ${control.unit}` : ""}</span>
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
        ${control.ends ? html`<div class="ends"><span>${t(control.ends[0])}</span><span>${t(control.ends[1])}</span></div>` : nothing}
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
      <div class="field" data-tour=${`ctl-${control.key}`}>
        <div class="lbl">${tOr(`ctl.${control.key}`, control.label)}</div>
        <div class="seg full" role="group" aria-label=${tOr(`ctl.${control.key}`, control.label)}>
          ${control.options
            .filter(([value]) => item.options.includes(value))
            .map(
              ([value, label]) => html`<button
                class=${current === value ? "on" : ""}
                aria-pressed=${current === value ? "true" : "false"}
                ?disabled=${!this._canEdit}
                @click=${() => this._change(targets, { [control.key]: value })}
              >
                ${tOr(`opt.${value}`, label)}
              </button>`,
            )}
        </div>
        ${control.hint ? html`<p class="hint">${tOr(`ctl.${control.key}.hint`, control.hint)}</p>` : nothing}
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
    const label = roleLabel(role);
    return html`
      <div class="role">
        <div class="rs" style=${styleMap({ background: colour || "transparent" })}>
          ${manual
            ? html`<input
                  type="color"
                  class="cpick"
                  .value=${(normaliseHex(colour) ?? "#000000").toLowerCase()}
                  ?disabled=${!this._canEdit}
                  aria-label=${t("role.pick", { role: label })}
                  @input=${(event: Event) =>
                    this._change([variant], setManual(role, (event.target as HTMLInputElement).value.toUpperCase()), `role-${role.id}-${variant}`)}
                /><span class="rs-lock" aria-hidden="true">${icon("lock", 12)}</span>`
            : nothing}
        </div>
        <div class="role-text">
          <div class="rn">${label}</div>
          <div class="role-meta">
            <span class="val">${manual ? t("role.manual") : t("role.auto")} · ${colour || "–"}</span>
            ${worst
              ? html`<span class=${good ? "badge small" : "badge small warn"} title=${t("role.lowest", { pair: pairLabel(worst), minimum: worst.minimum })}>${worst.ratio.toFixed(1)}:1</span>`
              : nothing}
          </div>
        </div>
        <div class="mode" role="group" aria-label=${t("role.mode", { role: label })}>
          <button class=${manual ? "" : "on"} ?disabled=${!this._canEdit} @click=${() => manual && this._change([variant], setAuto(role))}>${t("role.auto")}</button>
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
            ${t("role.manual")}
          </button>
        </div>
      </div>
    `;
  }

  private _renderMirror(): TemplateResult {
    const source = t(`variant.${this._variant}`);
    const target = t(`variant.${this._variant === "light" ? "dark" : "light"}`);
    return html`
      <button class="btn" ?disabled=${!this._canEdit} @click=${() => void this._mirror()}>
        ${icon("swap", 18)}${t("mirror.button", { target, source })}
      </button>
      <p class="hint">${t("mirror.hint", { target, source })}</p>
    `;
  }

  private _renderCheck(): TemplateResult {
    const settings = this._edit?.settings[this._variant];
    const preview = this._previews[this._variant];
    if (!settings || !preview) {
      return html`<div class="loading">${t("common.loading")}</div>`;
    }
    const light = this._previews.light;
    const dark = this._previews.dark;
    return html`
      <div class="sumrow">
        <span class="sumpill">${t("check.light", { summary: light ? readableSummary(light.contrast) : "–" })}</span>
        <span class="sumpill">${t("check.dark", { summary: dark ? readableSummary(dark.contrast) : "–" })}</span>
      </div>
      <div class="roles" data-tour="check-list">
        ${preview.contrast.map((pair) => {
          const manualRoles = (PAIR_ROLES[pair.key] ?? [])
            .map((id) => ALL_ROLES.find((role) => role.id === id))
            .filter((role): role is RoleDef => Boolean(role && isManual(role, settings)));
          return html`
            <div class="crow">
              <div class="row-text">
                <div class="rn">${pairLabel(pair)}</div>
                <div class="val">${t("check.ratio", { ratio: pair.ratio.toFixed(1), minimum: pair.minimum })}</div>
                ${!pair.ok && manualRoles.length
                  ? html`<div class="hint">${t("check.manual", { roles: manualRoles.map(roleLabel).join(", ") })}</div>`
                  : nothing}
              </div>
              ${pair.ok
                ? html`<span class="badge">${t("check.readable")}</span>`
                : manualRoles.length && this._canEdit
                  ? html`<button
                      class="btn sm"
                      @click=${() => {
                        const patch = Object.assign({}, ...manualRoles.map((role) => setAuto(role)));
                        this._change([this._variant], patch);
                        this._showToast(t("toast.set_auto", { roles: manualRoles.map(roleLabel).join(", ") }));
                      }}
                    >
                      ${icon("wand", 16)}${t("check.use_auto")}
                    </button>`
                  : html`<span class="badge warn">${t("check.low")}</span>`}
            </div>
          `;
        })}
      </div>
      <p class="hint">${t("check.hint")}</p>
    `;
  }

  private _renderPreview(): TemplateResult {
    return html`
      <section class="pv" data-tour="preview" aria-label=${t("preview.label")}>
        <div class="pv-bar">
          <span class="grow"></span>
          <button
            class=${this._both ? "btn on" : "btn"}
            aria-pressed=${this._both ? "true" : "false"}
            @click=${() => {
              this._both = !this._both;
            }}
          >
            ${icon("split", 18)}<span class="hide-p">${t("preview.both")}</span>
          </button>
          <div class="seg hide-p" role="group" aria-label=${t("preview.size")}>
            ${this._deviceButton("phone", t("device.phone"))} ${this._deviceButton("tablet", t("device.tablet"))}
            ${this._deviceButton("desktop", t("device.desktop"))}
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
          <div class="flabel">${t(`variant.${variant}`)}</div>
          ${data
            ? html`<div class="frame ${device}" style=${styleMap(themeStyle(data.variables))}>${renderMock(data.variables["theme-studio-background-attachment"] === "scroll")}</div>`
            : html`<div class="frame ${device}"><div class="loading">${t("common.loading")}</div></div>`}
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
    const sourceName = themes.find((theme) => theme.slug === this._newSource)?.name;
    const image = this._backgrounds?.find((item) => item.file === this._newImage);
    const placeholder =
      this._newMode === "preset" && sourceName
        ? t("new.placeholder_preset", { name: sourceName })
        : this._newMode === "image" && image
          ? t("new.placeholder_image", { name: image.file.replace(/\.[a-z0-9]+$/i, "") })
          : t("new.placeholder");
    const option = (mode: NewMode, title: string, text: string, glyph: "grid" | "palette" | "image") => html`<button
      class="opt ${this._newMode === mode ? "on" : ""}"
      aria-pressed=${this._newMode === mode ? "true" : "false"}
      @click=${() => (this._newMode = mode)}
    >
      ${icon(glyph, 22)}<span class="ot">${title}</span><span class="hint">${text}</span>
    </button>`;
    return html`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${t("new.title")} @click=${(event: Event) => event.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">${t("new.title")}</h2>
              <p class="sp">${t("new.sub")}</p>
            </div>
            <button class="btn icon" aria-label=${t("common.close")} @click=${this._closeDialog}>${icon("close", 18)}</button>
          </div>
          <div class="opts">
            ${option("preset", t("new.preset"), t("new.preset_hint"), "grid")}
            ${option("colour", t("new.colour"), t("new.colour_hint"), "palette")}
            ${option("image", t("new.image"), t("new.image_hint"), "image")}
          </div>
          ${this._newMode === "preset"
            ? html`<div class="field">
                <label class="lbl" for="ts-source">${t("new.start_from")}</label>
                <select
                  id="ts-source"
                  class="text-input"
                  .value=${this._newSource}
                  @change=${(event: Event) => (this._newSource = (event.target as HTMLSelectElement).value)}
                >
                  ${themes.map(
                    (theme) => html`<option value=${theme.slug} ?selected=${theme.slug === this._newSource}>
                      ${theme.builtin ? theme.name : t("new.mine_option", { name: theme.name })}
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
                    aria-label=${t("base.pick")}
                    @input=${(event: Event) => (this._newColour = (event.target as HTMLInputElement).value.toUpperCase())}
                  />
                </label>
                <div class="field">
                  <span class="lbl">${t("new.base")}</span>
                  <span class="val">${this._newColour}</span>
                </div>
              </div>`
            : nothing}
          ${this._newMode === "image"
            ? this._backgrounds === undefined
              ? html`<div class="loading">${t("images.loading")}</div>`
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
                : html`<p class="hint">${t("new.no_images")}</p>`
            : nothing}
          <div class="field">
            <label class="lbl" for="ts-newname">${t("new.name")}</label>
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
            <button class="btn" @click=${this._closeDialog}>${t("common.cancel")}</button>
            <button class="btn primary" ?disabled=${this._busy || (this._newMode === "image" && !this._newImage)} @click=${() => void this._createNew()}>
              ${t("new.create")}
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
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${t("editor.use")} @click=${(event: Event) => event.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">${t("use.title", { name })}</h2>
              <p class="sp">${t("use.sub")}</p>
            </div>
            <button class="btn icon" aria-label=${t("common.close")} @click=${this._closeDialog}>${icon("close", 18)}</button>
          </div>
          <div class="opts two">
            ${option("device", "phone", t("use.me"), t("use.me_hint"))}
            ${option("everyone", "home", t("use.everyone"), t("use.everyone_hint"))}
          </div>
          <p class="hint">${t("use.again")}</p>
          <div class="field">
            <div class="lbl">${t("use.share")}</div>
            <div class="share-row">
              <button class="btn" @click=${() => void this._export("copy")}>${icon("copy", 18)}${t("use.copy")}</button>
              <button class="btn" @click=${() => void this._export("download")}>${icon("download", 18)}${t("use.download")}</button>
            </div>
            <p class="hint">${t("use.share_hint")}</p>
          </div>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>${t("common.cancel")}</button>
            <button class="btn primary" ?disabled=${this._busy} @click=${() => void this._use()}>
              ${this._busy ? t("use.working") : t("editor.use")}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderImportDialog(): TemplateResult {
    return html`
      <div class="scrim" @click=${this._closeDialog}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label=${t("import.title")} @click=${(event: Event) => event.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">${t("import.title")}</h2>
              <p class="sp">${t("import.sub")}</p>
            </div>
            <button class="btn icon" aria-label=${t("common.close")} @click=${this._closeDialog}>${icon("close", 18)}</button>
          </div>
          <div class="field">
            <label class="lbl" for="ts-import">${t("import.field")}</label>
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
            ${icon("upload", 18)}${t("import.file")}
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
            <button class="btn" @click=${this._closeDialog}>${t("common.cancel")}</button>
            <button class="btn primary" ?disabled=${this._busy || !this._importText.trim()} @click=${() => void this._import()}>
              ${t("import.button")}
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
        <div class="dialog" role="alertdialog" aria-modal="true" aria-label=${t("editor.delete")} @click=${(event: Event) => event.stopPropagation()}>
          <div class="dhead">
            <div>
              <h2 class="sh">${t("delete.title", { name })}</h2>
              <p class="sp">${t("delete.sub")}</p>
            </div>
          </div>
          <div class="dfoot">
            <button class="btn" @click=${this._closeDialog}>${t("common.cancel")}</button>
            <button class="btn primary" ?disabled=${this._busy} @click=${() => void this._delete()}>${icon("trash", 18)}${t("delete.button")}</button>
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
