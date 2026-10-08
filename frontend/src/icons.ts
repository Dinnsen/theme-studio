import { html, svg, type TemplateResult } from "lit";

/** Stroke icons drawn for Theme Studio (24 × 24 grid). */
const PATHS = {
  palette:
    "M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.7-1.6 1.6-1.6H16a5 5 0 0 0 5-5C21 6.4 17 3 12 3zM7.5 11.5h.01M10 7.5h.01M15 7.8h.01",
  back: "m15 18-6-6 6-6",
  refresh: "M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",
  sun: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
  moon: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
  split:
    "M5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11A2.5 2.5 0 0 1 5.5 4zM12 4v16",
  phone:
    "M9.5 2.5h5A2.5 2.5 0 0 1 17 5v14a2.5 2.5 0 0 1-2.5 2.5h-5A2.5 2.5 0 0 1 7 19V5a2.5 2.5 0 0 1 2.5-2.5zM11 18h2",
  tablet:
    "M6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3zM11 18h2",
  desktop: "M4.5 4h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 21h8M12 17v4",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
  thermo: "M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z",
  home: "M3 11 12 4l9 7M5 10v10h14V10",
  image:
    "M5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11A2.5 2.5 0 0 1 5.5 4zM9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM21 16l-5-5-9 9",
  lock: "M7 11h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM8 11V8a4 4 0 0 1 8 0v3",
  edit: "M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4",
  contrast: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 3v18M12 7h4.5M12 11h6M12 15h5.5",
  plus: "M12 5v14M5 12h14",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  layers: "M12 3 3 8l9 5 9-5-9-5zM3 13l9 5 9-5",
  type: "M4 7V5h16v2M12 5v14M9 19h6",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  undo: "M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11",
  redo: "m15 14 5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13",
  upload: "M12 15V4M7 9l5-5 5 5M5 20h14",
  download: "M12 4v11M7 10l5 5 5-5M5 20h14",
  copy: "M9 9h10v11H9zM5 15V4h10",
  swap: "M7 7h11l-3-3M17 17H6l3 3",
  check: "m5 12 5 5 9-10",
  close: "M6 6l12 12M18 6 6 18",
  chevron: "m6 9 6 6 6-6",
  wand: "m4 20 11-11M14 3l1 2.2 2.2 1-2.2 1L14 9.4l-1-2.2-2.2-1 2.2-1z",
} as const;

export type IconName = keyof typeof PATHS;

export function icon(name: IconName, size = 20): TemplateResult {
  return html`<svg
    width=${size}
    height=${size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.9"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    ${svg`<path d=${PATHS[name]}></path>`}
  </svg>`;
}

export function playIcon(size = 16): TemplateResult {
  return html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    ${svg`<path d="M8 5v14l11-7z"></path>`}
  </svg>`;
}
