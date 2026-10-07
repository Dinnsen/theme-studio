import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { icon } from "./icons";
import { mockStyles, renderMock } from "./mock";
import { panelStyles } from "./styles";
import type {
  ContrastPair,
  Device,
  Filter,
  Hass,
  Route,
  Summary,
  ThemeCard,
  ThemeDetail,
  Variant,
  VariantCard,
  VariantDetail,
} from "./types";

const DASHBOARD_PATH = "/theme-studio";
const THEME_ROUTE = /^\/theme\/([^/]+)/;
const VARIABLE_NAME = /^[a-z0-9-]+$/;
const UNSAFE_VALUE = /[;{}<>]/;

const COLOUR_ROWS: [keyof Summary, string][] = [
  ["page", "Page background"],
  ["card", "Cards"],
  ["bubble", "Bubble cards"],
  ["navbar", "Navbar"],
  ["accent", "Accent"],
  ["text", "Text"],
  ["secondary", "Secondary text"],
  ["icon", "Icons"],
  ["active", "Active icons"],
];

function errorText(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
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
    _detail: { state: true },
    _detailError: { state: true },
    _variant: { state: true },
    _both: { state: true },
    _device: { state: true },
  };

  static override styles = [panelStyles, mockStyles];

  declare hass?: Hass;
  declare narrow: boolean;
  declare route?: Route;
  declare panel?: unknown;
  declare _themes?: ThemeCard[];
  declare _loading: boolean;
  declare _error?: string;
  declare _filter: Filter;
  declare _detail?: ThemeDetail;
  declare _detailError?: string;
  declare _variant: Variant;
  declare _both: boolean;
  declare _device: Device;

  private _detailSlug?: string;

  constructor() {
    super();
    this.narrow = false;
    this._loading = false;
    this._filter = "all";
    this._variant = "light";
    this._both = false;
    this._device = "phone";
  }

  private get _slug(): string | undefined {
    const match = THEME_ROUTE.exec(this.route?.path ?? "");
    return match ? decodeURIComponent(match[1]) : undefined;
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("hass") && this.hass) {
      this.toggleAttribute("dark", Boolean(this.hass.themes?.darkMode));
      if (!this._themes && !this._loading && !this._error) {
        void this._loadThemes();
      }
    }
    const slug = this._slug;
    if (this.hass && slug && slug !== this._detailSlug) {
      void this._loadDetail(slug);
    }
  }

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

  private async _loadDetail(slug: string): Promise<void> {
    if (!this.hass) {
      return;
    }
    this._detailSlug = slug;
    this._detail = undefined;
    this._detailError = undefined;
    try {
      const detail = await this.hass.callWS<ThemeDetail>({ type: "theme_studio/theme", slug });
      if (this._detailSlug === slug) {
        this._detail = detail;
      }
    } catch (error) {
      if (this._detailSlug === slug) {
        this._detailError = errorText(error);
      }
    }
  }

  private _navigate(path: string): void {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  }

  private _prefix(): string {
    return this.route?.prefix ?? "/theme-studio-panel";
  }

  private _open(slug: string): void {
    this._navigate(`${this._prefix()}/theme/${encodeURIComponent(slug)}`);
  }

  private _back(): void {
    this._navigate(this._prefix());
  }

  private _refresh(): void {
    this._themes = undefined;
    this._error = undefined;
    void this._loadThemes();
  }

  protected override render(): TemplateResult {
    return this._slug ? this._renderTheme(this._slug) : this._renderLibrary();
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
        </header>
        <main class="lib">
          <div class="lib-head">
            <div>
              <h1 class="lib-title">Your themes</h1>
              <p class="sub">Open a theme to see it in light and dark on a phone, a tablet or a computer.</p>
            </div>
            <div class="seg" role="group" aria-label="Show">
              ${this._filterButton("all", "All")} ${this._filterButton("mine", "Mine")}
              ${this._filterButton("builtin", "Built-in")}
            </div>
          </div>
          <div class="notice">
            ${icon("info")}
            <div class="notice-text">
              <strong>This is the new studio, so far for looking only.</strong> Editing moves here in a
              coming version. Until then, change themes in the Theme Studio dashboard.
            </div>
            <button class="btn sm" @click=${() => this._navigate(DASHBOARD_PATH)}>Open dashboard</button>
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
      <button class="tcard" @click=${() => this._open(theme.slug)} aria-label=${`Open ${theme.name}`}>
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

  // Theme view ---------------------------------------------------------------

  private _renderTheme(slug: string): TemplateResult {
    const detail = this._detail?.slug === slug ? this._detail : undefined;
    const card = this._themes?.find((theme) => theme.slug === slug);
    const name = detail?.name ?? card?.name ?? slug;
    const builtin = detail?.builtin ?? card?.builtin ?? false;
    const current = detail?.[this._variant] ?? null;

    return html`
      <div class="shell">
        <header class="bar">
          <button class="btn icon" @click=${this._back} aria-label="Back to all themes">${icon("back")}</button>
          <div class="titlebox">
            <div class="title">${name}</div>
            <div class="status">${builtin ? "Built-in preset" : "Mine"} · read-only preview</div>
          </div>
          <div class="seg" role="group" aria-label="Variant">
            ${this._variantButton("light", "Light")} ${this._variantButton("dark", "Dark")}
          </div>
        </header>
        ${this._detailError
          ? html`<div class="message">
              <strong>Could not load ${name}</strong>
              <span class="hint">${this._detailError}</span>
              <button class="btn sm" @click=${this._back}>Back to all themes</button>
            </div>`
          : html`<div class="ed">
              <section class="info" aria-label="Details">
                ${detail ? this._renderInfo(detail, current) : html`<div class="loading">Loading…</div>`}
              </section>
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
                <div class="stage">${detail ? this._renderFrames(detail) : nothing}</div>
              </section>
            </div>`}
      </div>
    `;
  }

  private _variantButton(variant: Variant, label: string): TemplateResult {
    const on = this._variant === variant && !this._both;
    return html`<button
      class=${on ? "on" : ""}
      aria-pressed=${on ? "true" : "false"}
      @click=${() => {
        this._variant = variant;
        this._both = false;
      }}
    >
      ${icon(variant === "light" ? "sun" : "moon", 17)}<span class="hide-p">${label}</span>
    </button>`;
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

  private _renderFrames(detail: ThemeDetail): TemplateResult[] {
    const variants: Variant[] = this._both ? ["light", "dark"] : [this._variant];
    const device = this._both ? "phone" : this._device;
    return variants.map((variant) => {
      const data = detail[variant];
      return html`
        <div class="fwrap">
          <div class="flabel">${variant === "light" ? "Light" : "Dark"}</div>
          ${data
            ? html`<div class="frame ${device}" style=${styleMap(themeStyle(data.variables))}>${renderMock()}</div>`
            : html`<div class="frame ${device}"><div class="loading">This variant could not be built.</div></div>`}
        </div>
      `;
    });
  }

  private _renderInfo(detail: ThemeDetail, current: VariantDetail | null): TemplateResult {
    const variantName = this._variant === "light" ? "Light" : "Dark";
    return html`
      <div>
        <div class="h">Colours · ${variantName}</div>
        ${current
          ? html`<div class="list">
              ${COLOUR_ROWS.map(
                ([key, label]) => html`
                  <div class="row">
                    <span class="sw" style=${styleMap({ background: String(current.summary[key]) })}></span>
                    <div class="row-text">
                      <div class="rn">${label}</div>
                      <div class="val">${String(current.summary[key]).toUpperCase()}</div>
                    </div>
                  </div>
                `,
              )}
            </div>`
          : html`<p class="hint">This variant could not be built.</p>`}
      </div>
      <div>
        <div class="h">Check</div>
        <div class="sumrow">
          <span class="sumpill">Light · ${detail.light ? readableSummary(detail.light.contrast) : "–"}</span>
          <span class="sumpill">Dark · ${detail.dark ? readableSummary(detail.dark.contrast) : "–"}</span>
        </div>
        ${current
          ? html`<div class="list">
              ${current.contrast.map(
                (pair) => html`
                  <div class="row">
                    <div class="row-text">
                      <div class="rn">${pair.label}</div>
                      <div class="val">${pair.ratio.toFixed(1)}:1 · needs ${pair.minimum}:1</div>
                    </div>
                    <span class=${pair.ok ? "badge" : "badge warn"}>${pair.ok ? "Readable" : "Low"}</span>
                  </div>
                `,
              )}
            </div>`
          : nothing}
      </div>
      <div class="soon">
        <div class="rn">${icon("edit", 18)} Editing comes next</div>
        <p class="hint">
          In a coming version you change colours, surfaces and fonts right here. Until then, use the Theme Studio
          dashboard.
        </p>
        <button class="btn sm" @click=${() => this._navigate(DASHBOARD_PATH)}>Open dashboard</button>
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
