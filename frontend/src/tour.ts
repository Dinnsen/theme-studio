import { css, html, nothing, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import type { SectionId } from "./editor-config";
import { t } from "./i18n";
import { icon, type IconName } from "./icons";
import type { Summary } from "./types";

/**
 * The guides: a short Quick start and a tour of every function. Each step
 * points at elements marked with data-tour="…" in the panel and shows a small
 * live drawing ("clip") of the control it explains.
 */
export type TourKind = "quick" | "full";
export type Chapter = "quick" | "overview" | "top" | "colours" | "surfaces" | "background" | "type" | "check" | "preview" | "finish";
export type Side = "below" | "right" | "left" | "center";

export interface TourStep {
  id: string;
  chapter: Chapter;
  screen: "library" | "editor";
  section?: SectionId;
  targets: string[];
  /** Shown instead when none of the targets is on screen (on a phone Import sits under +). */
  fallback?: string[];
  limit?: number;
  side: Side;
  clip: ClipName;
}

type ClipName =
  | "newDialog"
  | "importDialog"
  | "useDialog"
  | "useShare"
  | "cards"
  | "filter"
  | "reload"
  | "status"
  | "undo"
  | "variant"
  | "swatch"
  | "sliders"
  | "model"
  | "roles"
  | "collapsed"
  | "mirror"
  | "link"
  | "shape"
  | "border"
  | "shadow"
  | "bubble"
  | "images"
  | "overlay"
  | "header"
  | "scroll"
  | "fonts"
  | "ownFont"
  | "checks"
  | "devices"
  | "delete"
  | "help";

const ADJUST = ["contrast", "saturation", "tone", "hue_shift", "accent_strength", "neutrality"].map((key) => `ctl-${key}`);

export const TOURS: Record<TourKind, TourStep[]> = {
  quick: [
    { id: "q.new", chapter: "quick", screen: "library", targets: ["new"], side: "below", clip: "newDialog" },
    { id: "q.base", chapter: "quick", screen: "editor", section: "colours", targets: ["group-base"], side: "right", clip: "swatch" },
    { id: "q.variant", chapter: "quick", screen: "editor", section: "colours", targets: ["variant"], side: "below", clip: "variant" },
    { id: "q.check", chapter: "quick", screen: "editor", section: "colours", targets: ["section-check"], side: "right", clip: "checks" },
    { id: "q.preview", chapter: "quick", screen: "editor", section: "colours", targets: ["preview"], side: "left", clip: "devices" },
    { id: "q.use", chapter: "quick", screen: "editor", section: "colours", targets: ["use"], side: "below", clip: "useDialog" },
    { id: "q.end", chapter: "quick", screen: "editor", section: "colours", targets: ["help"], side: "below", clip: "help" },
  ],
  full: [
    { id: "f.cards", chapter: "overview", screen: "library", targets: ["card"], limit: 2, side: "right", clip: "cards" },
    { id: "f.filter", chapter: "overview", screen: "library", targets: ["filter"], side: "below", clip: "filter" },
    { id: "f.new", chapter: "overview", screen: "library", targets: ["new"], side: "below", clip: "newDialog" },
    { id: "f.import", chapter: "overview", screen: "library", targets: ["import"], fallback: ["new"], side: "below", clip: "importDialog" },
    { id: "f.reload", chapter: "overview", screen: "library", targets: ["reload"], side: "below", clip: "reload" },
    { id: "f.name", chapter: "top", screen: "editor", section: "colours", targets: ["name"], side: "below", clip: "status" },
    { id: "f.undo", chapter: "top", screen: "editor", section: "colours", targets: ["undo"], side: "below", clip: "undo" },
    { id: "f.variant", chapter: "top", screen: "editor", section: "colours", targets: ["variant"], side: "below", clip: "variant" },
    { id: "f.use", chapter: "top", screen: "editor", section: "colours", targets: ["use"], side: "below", clip: "useShare" },
    { id: "f.base", chapter: "colours", screen: "editor", section: "colours", targets: ["group-base"], side: "right", clip: "swatch" },
    { id: "f.adjust", chapter: "colours", screen: "editor", section: "colours", targets: ADJUST, side: "right", clip: "sliders" },
    { id: "f.style", chapter: "colours", screen: "editor", section: "colours", targets: ["ctl-preview_mode", "ctl-color_model"], side: "right", clip: "model" },
    { id: "f.roles", chapter: "colours", screen: "editor", section: "colours", targets: ["group-roles"], side: "right", clip: "roles" },
    { id: "f.more", chapter: "colours", screen: "editor", section: "colours", targets: ["group-more", "group-finetune"], side: "right", clip: "collapsed" },
    { id: "f.mirror", chapter: "colours", screen: "editor", section: "colours", targets: ["group-mirror"], side: "right", clip: "mirror" },
    { id: "f.link", chapter: "surfaces", screen: "editor", section: "surfaces", targets: ["link"], side: "right", clip: "link" },
    { id: "f.shape", chapter: "surfaces", screen: "editor", section: "surfaces", targets: ["group-shape", "group-glass"], side: "right", clip: "shape" },
    { id: "f.border", chapter: "surfaces", screen: "editor", section: "surfaces", targets: ["group-border"], side: "right", clip: "border" },
    { id: "f.shadow", chapter: "surfaces", screen: "editor", section: "surfaces", targets: ["group-shadow"], side: "right", clip: "shadow" },
    { id: "f.bubble", chapter: "surfaces", screen: "editor", section: "surfaces", targets: ["group-bubble"], side: "right", clip: "bubble" },
    { id: "f.image", chapter: "background", screen: "editor", section: "background", targets: ["ctl-background_contrast", "images"], side: "right", clip: "images" },
    { id: "f.overlay", chapter: "background", screen: "editor", section: "background", targets: ["group-overlay"], side: "right", clip: "overlay" },
    { id: "f.header", chapter: "background", screen: "editor", section: "background", targets: ["group-header"], side: "right", clip: "header" },
    { id: "f.scroll", chapter: "background", screen: "editor", section: "background", targets: ["ctl-background_attachment"], side: "right", clip: "scroll" },
    { id: "f.fonts", chapter: "type", screen: "editor", section: "type", targets: ["group-font"], side: "right", clip: "fonts" },
    { id: "f.ownfont", chapter: "type", screen: "editor", section: "type", targets: ["group-custom-font"], side: "right", clip: "ownFont" },
    { id: "f.check", chapter: "check", screen: "editor", section: "check", targets: ["check-list"], side: "right", clip: "checks" },
    { id: "f.preview", chapter: "preview", screen: "editor", section: "colours", targets: ["preview"], side: "left", clip: "devices" },
    { id: "f.delete", chapter: "finish", screen: "editor", section: "colours", targets: [], side: "center", clip: "delete" },
    { id: "f.end", chapter: "finish", screen: "editor", section: "colours", targets: ["help"], side: "below", clip: "help" },
  ],
};

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function visible(root: ParentNode, name: string): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`)].filter((element) => {
    const box = element.getBoundingClientRect();
    return box.width > 0 && box.height > 0;
  });
}

/** The step's targets, or its fallback when none of them is shown on this screen size. */
function targetsOf(root: ParentNode, step: TourStep): string[] {
  if (step.fallback && !step.targets.some((name) => visible(root, name).length)) {
    return step.fallback;
  }
  return step.targets;
}

/** The union of the visible elements marked with these data-tour names, relative to `origin`. */
export function measureTargets(root: ParentNode, origin: DOMRect, step: TourStep): Rect | undefined {
  const rects: DOMRect[] = [];
  for (const name of targetsOf(root, step)) {
    const found = [...root.querySelectorAll<HTMLElement>(`[data-tour="${name}"]`)].filter((element) => {
      const box = element.getBoundingClientRect();
      return box.width > 0 && box.height > 0;
    });
    for (const element of found.slice(0, step.limit ?? found.length)) {
      rects.push(element.getBoundingClientRect());
    }
  }
  if (!rects.length) {
    return undefined;
  }
  const left = Math.max(origin.left, Math.min(...rects.map((box) => box.left)));
  const top = Math.max(origin.top, Math.min(...rects.map((box) => box.top)));
  const right = Math.min(origin.right, Math.max(...rects.map((box) => box.right)));
  const bottom = Math.min(origin.bottom, Math.max(...rects.map((box) => box.bottom)));
  if (right <= left || bottom <= top) {
    return undefined;
  }
  return { x: left - origin.left - 6, y: top - origin.top - 6, w: right - left + 12, h: bottom - top + 12 };
}

/**
 * Scrolls the first element of a step to the top of its scrolling column, so
 * the rest of the step's elements follow below it. Elements in the top bar
 * stay where they are. False while the element is not rendered yet.
 */
export function revealTarget(root: ParentNode, step: TourStep): boolean {
  const element = visible(root, targetsOf(root, step)[0])[0];
  if (!element) {
    return false;
  }
  element.scrollIntoView({ block: element.closest("header") ? "nearest" : "start", inline: "nearest" });
  return true;
}

export interface Placement {
  style: Record<string, string>;
  arrow: Record<string, string> | undefined;
  sheet: boolean;
}

const POP_HEIGHT = 420;

/** Where the bubble goes: next to the target, or as a sheet on a narrow screen. */
export function placePopover(rect: Rect | undefined, side: Side, width: number, height: number): Placement {
  if (width < 720) {
    const middle = rect ? rect.y + rect.h / 2 : height;
    const edge: Record<string, string> = middle > height / 2 ? { top: "8px" } : { bottom: "8px" };
    return { style: { left: "8px", right: "8px", maxHeight: "62%", ...edge }, arrow: undefined, sheet: true };
  }
  const popWidth = width < 1180 ? 380 : 400;
  const maxX = width - 16 - popWidth;
  const maxY = Math.max(16, height - 16 - POP_HEIGHT);
  const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
  if (!rect || side === "center") {
    return {
      style: { left: `${Math.round((width - popWidth) / 2)}px`, top: `${Math.round(Math.max(16, (height - POP_HEIGHT) / 2))}px`, width: `${popWidth}px` },
      arrow: undefined,
      sheet: false,
    };
  }
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + Math.min(rect.h, 140) / 2;
  let effective = side;
  if (side === "right" && rect.x + rect.w + 14 > maxX) {
    effective = rect.x - 14 - popWidth >= 16 ? "left" : "below";
  }
  if (side === "left" && rect.x - 14 - popWidth < 16) {
    effective = rect.x + rect.w + 14 <= maxX ? "right" : "below";
  }
  if (effective === "below" && rect.y + rect.h + 12 > maxY) {
    // No room anywhere: beside the target on its wider side, covering as
    // little of it as possible (the preview on a tablet).
    const roomLeft = rect.x;
    const roomRight = width - rect.x - rect.w;
    const top = `${clamp(cy - 70, 16, maxY)}px`;
    if (Math.max(roomLeft, roomRight) >= 200) {
      const x = roomLeft >= roomRight ? 16 : maxX;
      return { style: { left: `${x}px`, top, width: `${popWidth}px` }, arrow: undefined, sheet: false };
    }
    const x = clamp(cx - popWidth / 2, 16, maxX);
    return { style: { left: `${x}px`, top: `${maxY}px`, width: `${popWidth}px` }, arrow: undefined, sheet: false };
  }
  if (effective === "below") {
    const x = clamp(cx - popWidth / 2, 16, maxX);
    return {
      style: { left: `${x}px`, top: `${rect.y + rect.h + 12}px`, width: `${popWidth}px` },
      arrow: { left: `${clamp(cx - x - 7, 18, popWidth - 32)}px`, top: "-7px" },
      sheet: false,
    };
  }
  const y = clamp(cy - 70, 16, maxY);
  const arrowTop = `${clamp(cy - y - 7, 18, POP_HEIGHT - 60)}px`;
  if (effective === "left") {
    const x = rect.x - 14 - popWidth;
    return { style: { left: `${x}px`, top: `${y}px`, width: `${popWidth}px` }, arrow: { left: `${popWidth - 7}px`, top: arrowTop }, sheet: false };
  }
  const x = rect.x + rect.w + 14;
  return { style: { left: `${x}px`, top: `${y}px`, width: `${popWidth}px` }, arrow: { left: "-7px", top: arrowTop }, sheet: false };
}

// Clips ------------------------------------------------------------------------

export interface ClipContext {
  base: string;
  cards: { name: string; light?: Summary; dark?: Summary }[];
  variant: "light" | "dark";
}

function seg(labels: string[], animate: boolean, icons?: IconName[], label?: string): TemplateResult {
  return html`<div class="c-field">
    ${label ? html`<div class="c-lbl">${label}</div>` : nothing}
    <div class="c-seg">
      ${labels.map(
        (text, index) => html`<span class=${animate ? (index === 0 ? "a" : index === 1 ? "b" : "") : index === 0 ? "on" : ""}
          >${icons ? icon(icons[index], 16) : nothing}${text}</span
        >`,
      )}
    </div>
  </div>`;
}

function slider(label: string, value: string, percent: number, animate = false): TemplateResult {
  return html`<div class="c-slider">
    <div class="c-srow"><span>${label}</span><span class="c-val">${value}</span></div>
    <div class="c-track">
      <div class="c-fill ${animate ? "anim" : ""}" style="width: ${percent}%"></div>
      <div class="c-knob ${animate ? "anim" : ""}" style="left: calc(${percent}% - 9px)"></div>
    </div>
  </div>`;
}

function buttons(list: { label?: string; icon?: IconName; kind?: string }[]): TemplateResult {
  return html`<div class="c-row">
    ${list.map(
      (item) => html`<span class="c-btn ${item.kind ?? ""} ${item.label ? "" : "icon"}">
        ${item.icon ? icon(item.icon, 18) : nothing}${item.label ?? nothing}
      </span>`,
    )}
  </div>`;
}

function switchRow(label: string, state: "on" | "off" | "anim"): TemplateResult {
  return html`<div class="c-switch-row"><span>${label}</span><span class="c-switch ${state}"><span></span></span></div>`;
}

function tiles(prefix: string, values: string[], selected: number, tapped: number, art: string[]): TemplateResult {
  return html`<div class="c-tiles">
    ${values.map(
      (value, index) => html`<div class="c-tile ${index === selected ? "sel" : ""} ${index === tapped ? "tap" : ""}">
        <div class="c-art" style=${art[index]}></div>
        <span>${t(`${prefix}.${value}`)}</span>
      </div>`,
    )}
  </div>`;
}

function dialog(title: string, options: { icon: IconName; title: string; hint: string }[], tapped: number, extra?: TemplateResult): TemplateResult {
  return html`<div class="c-dialog">
    <div class="c-dtitle">${title}</div>
    ${options.map(
      (option, index) => html`<div class="c-opt ${index === tapped ? "tap" : ""}">
        ${icon(option.icon, 20)}
        <div><div class="c-ot">${option.title}</div><div class="c-oh">${option.hint}</div></div>
      </div>`,
    )}
    ${extra ?? nothing}
  </div>`;
}

function miniCard(card: ClipContext["cards"][number], badge: string, warn: boolean): TemplateResult {
  const half = (summary?: Summary) =>
    summary
      ? html`<div class="c-half" style=${styleMap({ background: summary.page })}>
          <i style=${styleMap({ background: summary.text, width: "55%", height: "5px" })}></i>
          <i style=${styleMap({ background: summary.card })}></i>
          <i style=${styleMap({ background: summary.card })}></i>
        </div>`
      : html`<div class="c-half"></div>`;
  return html`<div class="c-card">
    <div class="c-mini">${half(card.light)}${half(card.dark)}</div>
    <strong>${card.name}</strong>
    <span class="c-badge ${warn ? "warn" : ""}">${badge}</span>
  </div>`;
}

const BORDER_ART = [
  "background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.22)",
  "background:linear-gradient(#fafbfc,#eef0f3);box-shadow:inset 0 1px 0 rgba(255,255,255,.9),inset 0 -1px 0 rgba(0,0,0,.14),0 0 0 1px rgba(0,0,0,.12)",
  "background:#fff;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2),inset 0 0 0 3px #fff,inset 0 0 0 4px rgba(0,0,0,.14)",
];
const SHADOW_ART = [
  "background:#fff;box-shadow:0 6px 14px rgba(0,0,0,.2)",
  "background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 0 16px rgba(120,150,255,.5)",
  "background:#fff;box-shadow:5px 7px 0 rgba(0,0,0,.18)",
];
const OVERLAY_ART = [
  "background:radial-gradient(80% 60% at 30% 30%,rgba(120,200,255,.6),transparent),radial-gradient(70% 60% at 75% 70%,rgba(200,120,255,.5),transparent),#dfe3e8",
  "background:repeating-radial-gradient(circle at 50% 40%,rgba(0,0,0,.09) 0 3px,transparent 3px 9px),#e6e9ec",
  "background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.95),rgba(255,255,255,0) 55%),#c9d0d7",
];
const IMAGE_ART = [
  "background:linear-gradient(160deg,#8e98a1,#e6e9ec 58%,#c3c9cf)",
  "background:linear-gradient(200deg,#f4f6f8,#d5dbe1 50%,#a7b0b9)",
  "background:linear-gradient(135deg,#ff9a3c,#ffcf8a 55%,#fff2dc)",
];

export function renderClip(step: TourStep, context: ClipContext): TemplateResult {
  const light = t("variant.light");
  const dark = t("variant.dark");
  const source = context.variant === "light" ? light : dark;
  const target = context.variant === "light" ? dark : light;
  switch (step.clip) {
    case "newDialog":
      return dialog(
        t("new.title"),
        [
          { icon: "grid", title: t("new.preset"), hint: t("new.preset_hint") },
          { icon: "palette", title: t("new.colour"), hint: t("new.colour_hint") },
          { icon: "image", title: t("new.image"), hint: t("new.image_hint") },
        ],
        1,
      );
    case "importDialog":
      return dialog(
        t("import.title"),
        [],
        -1,
        html`<div class="c-lbl">${t("import.field")}</div>
          <div class="c-input">TS1:eJyrVkrOT0lVslJKz8nPS1WqBQ…</div>
          <div class="c-row">${buttons([{ label: t("import.file"), icon: "upload", kind: "sm tap" }])}</div>`,
      );
    case "useDialog":
    case "useShare":
      return dialog(
        t("use.title", { name: context.cards[0]?.name ?? "Glass" }),
        [
          { icon: "phone", title: t("use.me"), hint: t("use.me_hint") },
          { icon: "home", title: t("use.everyone"), hint: t("use.everyone_hint") },
        ],
        1,
        step.clip === "useShare"
          ? html`<div class="c-lbl">${t("use.share")}</div>
              ${buttons([
                { label: t("use.copy"), icon: "copy", kind: "sm" },
                { label: t("use.download"), icon: "download", kind: "sm" },
              ])}`
          : undefined,
      );
    case "cards":
      return html`<div class="c-cards">
        ${context.cards[0] ? miniCard(context.cards[0], t("lib.in_use_everyone"), false) : nothing}
        ${context.cards[1] ? miniCard(context.cards[1], t("lib.to_check", { count: 2 }), true) : nothing}
      </div>`;
    case "filter":
      return seg([t("lib.all"), t("lib.mine"), t("lib.builtin")], true);
    case "reload":
      return buttons([{ icon: "refresh", kind: "tap" }, { label: t("lib.reload") }]);
    case "status":
      return html`<div class="c-status">
        <span class="c-name">${context.cards[0]?.name ?? "Glass"}<i class="c-caret"></i></span>
        <span class="c-saved">${icon("check", 16)}${t("status.saved")}</span>
      </div>`;
    case "undo":
      return buttons([{ icon: "undo", kind: "tap" }, { icon: "redo" }, { label: `${t("editor.undo")} · ${t("editor.redo")}` }]);
    case "variant":
      return seg([light, dark], true, ["sun", "moon"]);
    case "swatch":
      return html`<div class="c-swatch">
        <span style=${styleMap({ background: context.base })}></span>
        <div><div class="c-mono">${context.base}</div><div class="c-hint">${t("base.pick")}</div></div>
      </div>`;
    case "sliders":
      return html`${slider(t("ctl.contrast"), "58", 58, true)}${slider(t("ctl.saturation"), "+11", 61)}`;
    case "model":
      return html`${seg([t("opt.hsl"), t("opt.oklch")], true, undefined, t("ctl.color_model"))}
      ${seg([t("opt.Relaxed"), t("opt.Focused"), t("opt.Vibrant")], false, undefined, t("ctl.preview_mode"))}`;
    case "roles":
      return html`${[
        ["role.page", "#dbdfe1", false],
        ["role.card", "#e7eaeb", false],
        ["role.accent", "#a85a00", true],
      ].map(
        ([key, colour, animate]) => html`<div class="c-role">
          <span class="c-rsw" style=${styleMap({ background: String(colour) })}></span>
          <span class="c-rlabel">${t(String(key))}</span>
          <span class="c-mini-seg"
            ><span class=${animate ? "a" : "on"}>${t("role.auto")}</span><span class=${animate ? "b" : ""}>${t("role.manual")}</span></span
          >
        </div>`,
      )}`;
    case "collapsed":
      return html`<div class="c-collapsed">${t("group.more")}${icon("chevron", 18)}</div>
        <div class="c-collapsed">${t("group.finetune")}${icon("chevron", 18)}</div>`;
    case "mirror":
      return buttons([{ label: t("mirror.button", { target, source }), icon: "swap", kind: "tap" }]);
    case "link":
      return html`${switchRow(t("link.title"), "anim")}<p class="c-hint">${t("link.on")}</p>`;
    case "shape":
      return html`${slider(t("ctl.radius"), "28 px", 56, true)}${slider(t("ctl.blur_strength"), "17 px", 34)}`;
    case "border":
      return tiles("border", ["soft_hairline", "glass_edge", "etched"], 0, 1, BORDER_ART);
    case "shadow":
      return tiles("shadow", ["soft_depth", "glass_glow", "drop_shadow"], 1, 2, SHADOW_ART);
    case "bubble":
      return html`${switchRow(t("ctl.bubble_use_fx"), "anim")}${switchRow(t("ctl.popup_use_fx"), "on")}`;
    case "images":
      return html`<div class="c-tiles">
          ${IMAGE_ART.map((art, index) => html`<div class="c-img ${index === 0 ? "sel" : ""}" style=${art}></div>`)}
          <div class="c-upload">${icon("upload", 18)}<span>${t("images.upload")}</span></div>
        </div>
        ${slider(t("ctl.background_contrast"), "35", 35, true)}`;
    case "overlay":
      return tiles("overlay", ["aurora", "topographic", "halo"], 1, 2, OVERLAY_ART);
    case "header":
      return html`${switchRow(t("ctl.enable_header_blend"), "anim")}${slider(t("ctl.header_blend_height"), "170 px", 37, true)}`;
    case "scroll":
      return seg([t("opt.fixed"), t("opt.scroll")], true, undefined, t("ctl.background_attachment"));
    case "fonts":
      return html`<div class="c-fonts">
        ${[
          ["system-ui", t("font.system-ui")],
          ["Quicksand", "Quicksand"],
          ["Josefin Sans", "Josefin Sans"],
          ["Orbitron", "Orbitron"],
        ].map(
          ([family, label], index) => html`<div class="c-font ${index === 1 ? "sel" : ""}">
            <b style=${styleMap({ fontFamily: `"${family}", system-ui, sans-serif` })}>Aa</b><span>${label}</span>
          </div>`,
        )}
      </div>`;
    case "ownFont":
      return html`${switchRow(t("ctl.use_custom_font"), "anim")}
        <div class="c-lbl">${t("ctl.custom_font_family")}</div>
        <div class="c-input">My Font</div>`;
    case "checks":
      return html`<div class="c-check">
          <div><div class="c-rn">${t("pair.text_card")}</div><div class="c-hint">${t("check.ratio", { ratio: "12.1", minimum: 4.5 })}</div></div>
          <span class="c-badge">${t("check.readable")}</span>
        </div>
        <div class="c-check">
          <div><div class="c-rn">${t("pair.active_icon_card")}</div><div class="c-hint">${t("check.ratio", { ratio: "2.6", minimum: 3 })}</div></div>
          <span class="c-btn sm tap">${icon("wand", 16)}${t("check.use_auto")}</span>
        </div>`;
    case "devices":
      return html`${seg([t("device.phone"), t("device.tablet"), t("device.desktop")], true, ["phone", "tablet", "desktop"])}
      ${buttons([{ label: t("preview.both"), icon: "split" }])}`;
    case "delete":
      return buttons([{ label: t("editor.delete"), icon: "trash", kind: "danger tap" }]);
    case "help":
      return buttons([{ icon: "help", kind: "help tap" }, { label: t("tour.help") }]);
  }
}

export const tourStyles = css`
  :host {
    position: relative;
  }
  [data-tour] {
    scroll-margin: 14px;
  }
  .tour-layer,
  .tour-hint-layer {
    position: fixed;
    z-index: 20;
    overflow: hidden;
  }
  .tour-hint-layer {
    z-index: 21;
    pointer-events: none;
  }
  .tour-hint-layer .tour-hint {
    pointer-events: auto;
  }
  .tour-spot {
    position: absolute;
    border-radius: 16px;
    box-shadow:
      0 0 0 9999px rgba(10, 12, 16, 0.55),
      0 0 0 3px #ffffff,
      0 0 0 7px rgba(134, 164, 255, 0.75);
    pointer-events: none;
    transition: all 0.25s ease;
  }
  .tour-dim {
    position: absolute;
    inset: 0;
    background: rgba(10, 12, 16, 0.55);
  }
  .tour-pop {
    position: absolute;
    box-sizing: border-box;
    max-height: calc(100% - 16px);
    display: flex;
    flex-direction: column;
    background: var(--ts-panel);
    color: var(--ts-ink);
    border-radius: 18px;
    box-shadow:
      0 18px 50px rgba(0, 0, 0, 0.28),
      0 0 0 1px rgba(0, 0, 0, 0.06);
  }
  .tour-inner {
    min-height: 0;
    overflow: auto;
    padding: 16px 18px;
    overscroll-behavior: contain;
  }
  .tour-pop:focus {
    outline: none;
  }
  .tour-arrow {
    position: absolute;
    width: 14px;
    height: 14px;
    background: var(--ts-panel);
    transform: rotate(45deg);
    border-radius: 3px;
  }
  .tour-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }
  .tour-count {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ts-sel);
  }
  .tour-title {
    font-size: 18px;
    font-weight: 700;
    margin: 0 0 6px;
  }
  .tour-body {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }
  .tour-progress {
    height: 4px;
    border-radius: 2px;
    background: var(--ts-line);
    margin: 14px 0 12px;
    overflow: hidden;
  }
  .tour-progress span {
    display: block;
    height: 4px;
    background: var(--ts-sel);
  }
  .tour-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .tour-foot .grow {
    flex: 1;
  }
  .linkish {
    border: 0;
    background: transparent;
    padding: 8px 6px;
    font-weight: 600;
    font-size: 13px;
    color: var(--ts-muted);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .tour-choices {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin: 4px 0 6px;
  }
  .tour-choice {
    border: 1px solid var(--ts-line);
    background: var(--ts-panel);
    border-radius: 16px;
    padding: 13px 14px;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .tour-choice.main {
    border-color: var(--ts-ink);
    box-shadow: 0 0 0 1px var(--ts-ink);
  }
  .tour-choice strong {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
  }
  .tour-meta {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ts-sel);
  }
  .tour-langs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .tour-lang {
    border: 1px solid var(--ts-line);
    background: var(--ts-panel);
    border-radius: 999px;
    height: 36px;
    padding: 0 13px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
  }
  .tour-lang.on {
    background: var(--ts-ink);
    color: var(--ts-panel);
    border-color: var(--ts-ink);
  }
  .tour-ring {
    position: absolute;
    border-radius: 14px;
    box-shadow:
      0 0 0 3px var(--ts-panel),
      0 0 0 7px rgba(42, 85, 216, 0.55);
    pointer-events: none;
    z-index: 21;
  }
  .tour-hint {
    position: absolute;
    z-index: 21;
    width: 280px;
    max-width: calc(100% - 16px);
    box-sizing: border-box;
  }
  .tour-choices.narrow {
    grid-template-columns: minmax(0, 1fr);
  }
  .tour-welcome .tour-note {
    margin: 0;
    font-size: 12.5px;
    color: var(--ts-muted);
  }
  .tour-welcome .tour-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .tour-welcome .dfoot {
    justify-content: space-between;
    align-items: center;
  }
  .btn.help {
    color: var(--ts-sel);
  }
  .only-p {
    display: none;
  }
  .opts.one {
    grid-template-columns: minmax(0, 1fr);
  }
  .lib-tools {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .tour-welcome:focus {
    outline: none;
  }
  .tour-scrim.sheet {
    align-items: flex-end;
    padding: 0;
  }
  .tour-scrim.sheet .dialog {
    border-radius: 22px 22px 0 0;
    width: 100%;
    max-height: 88vh;
  }
  .chips .btn.help {
    min-height: 40px;
    width: 40px;
    border-radius: 999px;
  }
  @container (max-width: 719px) {
    .only-p {
      display: inline-flex;
    }
  }

  /* Clips: small live drawings of the control a step explains. */
  .clip {
    background: var(--ts-panel2);
    border: 1px solid var(--ts-line);
    border-radius: 14px;
    padding: 12px 14px;
    margin: 2px 0 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    pointer-events: none;
    font-size: 13px;
  }
  .c-lbl {
    font-size: 13px;
    font-weight: 600;
  }
  .c-hint {
    font-size: 12px;
    color: var(--ts-muted);
    margin: 0;
  }
  .c-mono {
    font-family: var(--ts-mono);
    font-weight: 600;
    font-size: 15px;
  }
  .c-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .c-seg,
  .c-mini-seg {
    display: flex;
    padding: 3px;
    border-radius: 12px;
    background: var(--ts-panel);
    border: 1px solid var(--ts-line);
    gap: 2px;
  }
  .c-seg span {
    flex: 1;
    min-width: 0;
    height: 32px;
    padding: 0 8px;
    border-radius: 9px;
    font-weight: 600;
    font-size: 12.5px;
    color: var(--ts-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    white-space: nowrap;
    overflow: hidden;
  }
  .c-seg .on,
  .c-mini-seg .on {
    background: var(--ts-ink);
    color: var(--ts-panel);
  }
  .c-seg .a,
  .c-mini-seg .a {
    animation: c-a 3s steps(1) infinite;
  }
  .c-seg .b,
  .c-mini-seg .b {
    animation: c-b 3s steps(1) infinite;
  }
  @keyframes c-a {
    0% {
      background: var(--ts-ink);
      color: var(--ts-panel);
    }
    50% {
      background: transparent;
      color: var(--ts-muted);
    }
  }
  @keyframes c-b {
    0% {
      background: transparent;
      color: var(--ts-muted);
    }
    50% {
      background: var(--ts-ink);
      color: var(--ts-panel);
    }
  }
  .c-mini-seg {
    display: inline-flex;
    border-radius: 9px;
    font-size: 12px;
    font-weight: 600;
  }
  .c-mini-seg span {
    padding: 4px 9px;
    border-radius: 7px;
    color: var(--ts-muted);
  }
  .c-slider {
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding: 4px 0;
  }
  .c-srow {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
  }
  .c-val {
    font-family: var(--ts-mono);
    color: var(--ts-muted);
    font-size: 12.5px;
  }
  .c-track {
    position: relative;
    height: 6px;
    border-radius: 3px;
    background: var(--ts-line);
  }
  .c-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 6px;
    border-radius: 3px;
    background: var(--ts-sel);
  }
  .c-knob {
    position: absolute;
    top: -6px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--ts-panel);
    border: 2px solid var(--ts-sel);
    box-sizing: border-box;
  }
  .c-fill.anim {
    animation: c-fill 2.6s ease-in-out infinite;
  }
  .c-knob.anim {
    animation: c-knob 2.6s ease-in-out infinite;
  }
  @keyframes c-fill {
    0%,
    100% {
      width: 30%;
    }
    50% {
      width: 72%;
    }
  }
  @keyframes c-knob {
    0%,
    100% {
      left: calc(30% - 9px);
    }
    50% {
      left: calc(72% - 9px);
    }
  }
  .c-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }
  .c-btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    height: 40px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1px solid var(--ts-line);
    background: var(--ts-panel);
    font-weight: 600;
    white-space: nowrap;
  }
  .c-btn.icon {
    width: 40px;
    padding: 0;
  }
  .c-btn.sm {
    height: 32px;
    padding: 0 10px;
    font-size: 12.5px;
    border-radius: 9px;
  }
  .c-btn.danger {
    color: var(--ts-warn);
  }
  .c-btn.help {
    color: var(--ts-sel);
    background: var(--ts-sel-soft);
  }
  .tap::after {
    content: "";
    position: absolute;
    right: 6px;
    bottom: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(42, 85, 216, 0.55);
    animation: c-tap 1.8s ease-out infinite;
  }
  @keyframes c-tap {
    0% {
      transform: scale(0.4);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: scale(1.9);
      opacity: 0;
    }
  }
  .c-switch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-weight: 600;
    min-height: 40px;
  }
  .c-switch {
    position: relative;
    width: 40px;
    height: 24px;
    border-radius: 12px;
    background: var(--ts-line);
    flex: none;
  }
  .c-switch span {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
  .c-switch.on {
    background: var(--ts-sel);
  }
  .c-switch.on span {
    left: 19px;
  }
  .c-switch.anim {
    animation: c-sw 3s steps(1) infinite;
  }
  .c-switch.anim span {
    animation: c-swk 3s ease-in-out infinite;
  }
  @keyframes c-sw {
    0% {
      background: var(--ts-line);
    }
    50% {
      background: var(--ts-sel);
    }
  }
  @keyframes c-swk {
    0%,
    40% {
      left: 3px;
    }
    50%,
    90% {
      left: 19px;
    }
    100% {
      left: 3px;
    }
  }
  .c-tiles {
    display: flex;
    gap: 8px;
    height: 86px;
  }
  .c-tile {
    position: relative;
    flex: 1;
    min-width: 0;
    border: 1px solid var(--ts-line);
    border-radius: 12px;
    padding: 6px;
    background: var(--ts-panel);
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
  }
  .c-tile span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .c-tile.sel,
  .c-img.sel,
  .c-font.sel {
    border-color: var(--ts-sel);
    box-shadow: 0 0 0 2px var(--ts-sel-soft);
  }
  .c-art {
    flex: 1;
    border-radius: 8px;
  }
  .c-img {
    flex: 1;
    border-radius: 10px;
    border: 1px solid var(--ts-line);
  }
  .c-upload {
    flex: 1;
    min-width: 0;
    border: 1px dashed var(--ts-muted);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    color: var(--ts-muted);
  }
  .c-fonts {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }
  .c-font {
    border: 1px solid var(--ts-line);
    border-radius: 12px;
    background: var(--ts-panel);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 2px;
    font-size: 11px;
    font-weight: 600;
    min-width: 0;
  }
  .c-font b {
    font-size: 24px;
  }
  .c-font span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .c-input {
    border: 1px solid var(--ts-line);
    border-radius: 10px;
    background: var(--ts-panel);
    padding: 8px 10px;
    font-family: var(--ts-mono);
    font-size: 12.5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .c-dialog {
    background: var(--ts-panel);
    border-radius: 14px;
    padding: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .c-dtitle {
    font-weight: 700;
    font-size: 14px;
  }
  .c-opt {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid var(--ts-line);
    border-radius: 11px;
    padding: 7px 10px;
  }
  .c-ot {
    font-weight: 700;
    font-size: 12.5px;
  }
  .c-oh {
    font-size: 11.5px;
    color: var(--ts-muted);
  }
  .c-cards {
    display: flex;
    gap: 10px;
  }
  .c-card {
    flex: 1;
    min-width: 0;
    background: var(--ts-panel);
    border: 1px solid var(--ts-line);
    border-radius: 14px;
    padding: 7px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .c-mini {
    display: grid;
    grid-template-columns: 1fr 1fr;
    height: 62px;
    border-radius: 9px;
    overflow: hidden;
  }
  .c-half {
    padding: 7px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: var(--ts-panel2);
  }
  .c-half i {
    display: block;
    height: 15px;
    border-radius: 5px;
  }
  .c-badge {
    width: max-content;
    font-family: var(--ts-mono);
    font-size: 11px;
    padding: 3px 7px;
    border-radius: 8px;
    background: var(--ts-ok-soft);
    color: var(--ts-ok);
  }
  .c-badge.warn {
    background: var(--ts-warn-soft);
    color: var(--ts-warn);
  }
  .c-status {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .c-name {
    display: inline-flex;
    align-items: center;
    width: max-content;
    font-size: 18px;
    font-weight: 700;
    border: 1px solid var(--ts-line);
    border-radius: 8px;
    padding: 2px 8px;
    background: var(--ts-panel);
  }
  .c-caret {
    display: inline-block;
    width: 2px;
    height: 20px;
    margin-left: 2px;
    background: var(--ts-sel);
    animation: c-blink 1.1s steps(1) infinite;
  }
  @keyframes c-blink {
    50% {
      opacity: 0;
    }
  }
  .c-saved {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--ts-ok);
    font-weight: 600;
    font-size: 12.5px;
  }
  .c-swatch {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .c-swatch > span {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
  }
  .c-role {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 40px;
  }
  .c-rsw {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
    flex: none;
  }
  .c-rlabel {
    flex: 1;
    font-weight: 600;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .c-collapsed {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid var(--ts-line);
    border-radius: 11px;
    padding: 9px 12px;
    background: var(--ts-panel);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ts-muted);
  }
  .c-check {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-height: 44px;
    border-top: 1px solid var(--ts-line);
  }
  .c-check:first-child {
    border-top: 0;
  }
  .c-rn {
    font-weight: 600;
  }
  @media (prefers-reduced-motion: reduce) {
    .clip *,
    .clip *::after,
    .tour-spot {
      animation: none !important;
      transition: none !important;
    }
  }
`;
