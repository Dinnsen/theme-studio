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
  type Control,
  type Group,
  type RoleDef,
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
  declare _dialog?: "new" | "delete";
  declare _toast?: string;
  declare _busy: boolean;
  declare _newMode: NewMode;
  declare _newSource: string;
  declare _newColour: string;
  declare _newImage?: string;
  declare _newName: string;
  declare _backgrounds?: Background[];

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
    if (!slug && this._libraryStale && changed.has("route")) {
      this._libraryStale = false;
      void this._loadThemes();
    }
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has("_previews")) {
      this._resolveProbe();
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
    } catch (error) {
      this._error = errorText(error);
    } finally {
      this._loading = false;
    }
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

  private async _build(): Promise<void> {
    if (!this.hass || !this._edit) {
      return;
    }
    this._busy = true;
    try {
      await this._flush();
      const result = await this.hass.callWS<{ name: string }>({ type: "theme_studio/theme/build", slug: this._edit.slug });
      this._showToast(`“${result.name}” is updated in Home Assistant. Pick it in your profile to use it.`);
    } catch (error) {
      this._showToast(`Could not update the theme: ${errorText(error)}`);
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
          ${failing ? html`<span class="badge warn">${failing} to check</span>` : nothing}
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
          ${edit && !edit.builtin && this._canEdit
            ? html`
                <button class="btn icon hide-p" aria-label="Delete theme" title="Delete theme" @click=${() => (this._dialog = "delete")}>
                  ${icon("trash", 19)}
                </button>
                <button class="btn primary" ?disabled=${this._busy} @click=${() => void this._build()} title="Write the theme file so Home Assistant uses your changes">
                  ${icon("upload", 18)}<span class="hide-t">Update in HA</span>
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
                      ${section.id === "check" ? this._renderCheck() : section.groups.map((group) => this._renderGroup(group))}
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

  private _renderGroup(group: Group): TemplateResult {
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
        ${open ? group.controls.map((control) => this._renderControl(control)) : nothing}
        ${open && group.hint ? html`<p class="hint">${group.hint}</p>` : nothing}
      </div>
    `;
  }

  private _renderControl(control: Control): TemplateResult | typeof nothing {
    const settings = this._edit?.settings[this._variant];
    if (!settings) {
      return nothing;
    }
    switch (control.type) {
      case "base":
        return this._renderBase(settings);
      case "slider":
        return this._renderSlider(control, settings);
      case "segmented":
        return this._renderSegmented(control, settings);
      case "roles":
        return html`<div class="roles">${control.roles.map((role) => this._renderRole(role, settings))}</div>`;
      case "mirror":
        return this._renderMirror();
    }
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

  private _renderSlider(control: Extract<Control, { type: "slider" }>, settings: Settings): TemplateResult | typeof nothing {
    const item = this._schema.get(control.key);
    if (!item) {
      return nothing;
    }
    const value = Number(settings[control.key] ?? item.default ?? 0);
    const id = `ts-${control.key}`;
    return html`
      <div class="field">
        <div class="lbl"><label for=${id}>${control.label ?? item.label}</label><span class="val">${Math.round(value)}</span></div>
        <input
          id=${id}
          type="range"
          min=${item.min ?? 0}
          max=${item.max ?? 100}
          step=${item.step ?? 1}
          .value=${String(value)}
          ?disabled=${!this._canEdit}
          @input=${(event: Event) =>
            this._change([this._variant], { [control.key]: Number((event.target as HTMLInputElement).value) }, `${control.key}-${this._variant}`)}
        />
        ${control.ends ? html`<div class="ends"><span>${control.ends[0]}</span><span>${control.ends[1]}</span></div>` : nothing}
      </div>
    `;
  }

  private _renderSegmented(control: Extract<Control, { type: "segmented" }>, settings: Settings): TemplateResult | typeof nothing {
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
                @click=${() => this._change([this._variant], { [control.key]: value }, undefined)}
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
        <div style="min-width: 0">
          <div class="rn">${role.label}</div>
          <div class="val">${manual ? "Manual" : "Auto"} · ${colour || "–"}</div>
        </div>
        ${worst
          ? html`<span class=${good ? "badge" : "badge warn"} title=${`Lowest contrast: ${worst.label} (needs ${worst.minimum}:1)`}>${worst.ratio.toFixed(1)}:1</span>`
          : html`<span></span>`}
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
