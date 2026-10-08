import { css } from "lit";

/** Styles for the editor, the dialogs and the toast. */
export const editorStyles = css`
  .btn.primary {
    background: var(--ts-ink);
    color: var(--ts-panel);
    border-color: var(--ts-ink);
  }
  .btn.primary:hover {
    opacity: 0.9;
    background: var(--ts-ink);
  }
  .btn.danger {
    color: var(--ts-warn);
  }
  .btn:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .name {
    font: inherit;
    font-size: 18px;
    font-weight: 700;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 8px;
    padding: 2px 8px;
    margin-left: -8px;
    color: var(--ts-ink);
    width: 100%;
    max-width: 420px;
    min-width: 0;
  }
  .name:hover:not(:disabled) {
    border-color: var(--ts-line);
  }
  .name:focus {
    outline: 2px solid var(--ts-sel);
  }
  .status.error {
    color: var(--ts-warn);
  }
  .editor {
    flex: 1;
    display: grid;
    grid-template-columns: 88px 384px minmax(0, 1fr);
    min-height: 0;
  }
  .rail {
    background: var(--ts-panel);
    border-right: 1px solid var(--ts-line);
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: auto;
  }
  .rail-btn {
    border: 0;
    background: transparent;
    border-radius: 14px;
    padding: 10px 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    color: var(--ts-muted);
    cursor: pointer;
    position: relative;
    min-height: 62px;
  }
  .rail-btn:hover {
    background: var(--ts-panel2);
  }
  .rail-btn.on {
    background: var(--ts-sel-soft);
    color: var(--ts-sel);
  }
  .count {
    position: absolute;
    top: 5px;
    right: 12px;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    background: var(--ts-warn);
    color: var(--ts-panel);
    font-size: 11px;
    font-weight: 700;
    display: grid;
    place-items: center;
    padding: 0 5px;
  }
  .ctl {
    background: var(--ts-panel);
    border-right: 1px solid var(--ts-line);
    overflow: auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .chips {
    display: none;
    gap: 6px;
    padding: 10px 14px;
    overflow-x: auto;
    border-bottom: 1px solid var(--ts-line);
    flex: none;
  }
  .chip {
    border: 1px solid var(--ts-line);
    background: var(--ts-panel);
    border-radius: 999px;
    min-height: 40px;
    padding: 0 14px;
    font-weight: 600;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
    cursor: pointer;
    color: var(--ts-muted);
    flex: none;
  }
  .chip.on {
    background: var(--ts-ink);
    color: var(--ts-panel);
    border-color: var(--ts-ink);
  }
  .chip .count {
    position: static;
  }
  .banner {
    margin: 16px 20px 0;
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--ts-sel-soft);
    font-size: 13px;
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .banner svg {
    color: var(--ts-sel);
    flex: none;
    margin-top: 1px;
  }
  .sec {
    padding: 20px 20px 48px;
    display: flex;
    flex-direction: column;
    gap: 26px;
  }
  .sh {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .sp {
    color: var(--ts-muted);
    margin-top: 4px;
  }
  .group {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .group-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border: 0;
    background: transparent;
    padding: 0;
    cursor: pointer;
    text-align: left;
  }
  .group-head .h {
    margin: 0;
  }
  .group-head svg {
    color: var(--ts-muted);
    transition: transform 0.15s;
  }
  .group-head.open svg {
    transform: rotate(180deg);
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .lbl {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
    font-weight: 600;
    font-size: 14px;
  }
  .ends {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--ts-muted);
  }
  input[type="range"] {
    width: 100%;
    accent-color: var(--ts-sel);
    height: 28px;
    margin: 0;
  }
  .base {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .swatch-big {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    border: 1px solid var(--ts-line);
    overflow: hidden;
    cursor: pointer;
    flex: none;
    position: relative;
    display: block;
  }
  .cpick {
    -webkit-appearance: none;
    appearance: none;
    border: 0;
    padding: 0;
    margin: 0;
    background: transparent;
    cursor: pointer;
    opacity: 0;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .text-input {
    font-family: var(--ts-mono);
    font-size: 14px;
    height: 44px;
    border: 1px solid var(--ts-line);
    border-radius: 12px;
    padding: 0 12px;
    background: var(--ts-panel2);
    color: var(--ts-ink);
    width: 100%;
  }
  .text-input.plain {
    font-family: var(--ts-font);
  }
  .text-input:focus,
  select:focus {
    outline: 2px solid var(--ts-sel);
  }
  select.text-input {
    font-family: var(--ts-font);
  }
  .seg.full {
    display: flex;
  }
  .seg.full button {
    flex: 1;
  }
  .roles {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--ts-line);
    border-radius: 16px;
    overflow: hidden;
  }
  .role {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-top: 1px solid var(--ts-line);
  }
  .role:first-child {
    border-top: 0;
  }
  .role-text {
    min-width: 0;
  }
  .role-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .badge.small {
    font-size: 11px;
    padding: 1px 6px;
    border-radius: 6px;
  }
  .sec-foot {
    border-top: 1px solid var(--ts-line);
    padding-top: 18px;
    display: flex;
  }
  .rs {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid var(--ts-line);
    overflow: hidden;
    position: relative;
  }
  .rs-lock {
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 18px;
    height: 18px;
    border-radius: 6px;
    background: var(--ts-panel);
    color: var(--ts-ink);
    display: grid;
    place-items: center;
    pointer-events: none;
  }
  .mode {
    display: inline-flex;
    border: 1px solid var(--ts-line);
    border-radius: 10px;
    overflow: hidden;
  }
  .mode button {
    border: 0;
    background: transparent;
    font-size: 12.5px;
    font-weight: 600;
    padding: 0 10px;
    min-height: 36px;
    cursor: pointer;
    color: var(--ts-muted);
  }
  .mode button.on {
    background: var(--ts-ink);
    color: var(--ts-panel);
  }
  .mode button:disabled {
    cursor: default;
  }
  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    text-align: left;
    border: 1px solid var(--ts-line);
    background: var(--ts-panel2);
    border-radius: 16px;
    padding: 12px 14px;
    cursor: pointer;
    width: 100%;
  }
  .tr-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .tr-title {
    font-weight: 600;
    font-size: 14px;
  }
  .switch {
    width: 46px;
    height: 28px;
    border-radius: 14px;
    background: var(--ts-line);
    position: relative;
    flex: none;
    transition: background 0.15s;
  }
  .switch::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ffffff;
    transition: left 0.15s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  }
  .switch.on {
    background: var(--ts-sel);
  }
  .switch.on::after {
    left: 21px;
  }
  .crow {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-top: 1px solid var(--ts-line);
  }
  .crow:first-child {
    border-top: 0;
  }
  .probe {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }
  .scrim {
    position: fixed;
    inset: 0;
    background: rgba(10, 12, 16, 0.48);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 20;
  }
  .dialog {
    width: 560px;
    max-width: 100%;
    max-height: calc(100vh - 32px);
    overflow: auto;
    background: var(--ts-panel);
    color: var(--ts-ink);
    border-radius: 22px;
    border: 1px solid var(--ts-line);
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
  }
  .dhead {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .dfoot {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
  }
  .opts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .opt {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px;
    border: 1px solid var(--ts-line);
    border-radius: 16px;
    cursor: pointer;
    background: var(--ts-panel);
    text-align: left;
  }
  .opt.on {
    border-color: var(--ts-sel);
    box-shadow: 0 0 0 2px var(--ts-sel-soft);
  }
  .opt svg {
    color: var(--ts-sel);
    margin-bottom: 4px;
  }
  .ot {
    font-weight: 700;
    font-size: 14px;
  }
  .images {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .image {
    border: 1px solid var(--ts-line);
    border-radius: 14px;
    padding: 6px;
    background: var(--ts-panel2);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    text-align: left;
    min-width: 0;
  }
  .image.on {
    border-color: var(--ts-sel);
    box-shadow: 0 0 0 2px var(--ts-sel-soft);
  }
  .image img {
    width: 100%;
    height: 64px;
    object-fit: cover;
    border-radius: 10px;
    display: block;
  }
  .image span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }
  .tile {
    border: 1px solid var(--ts-line);
    background: var(--ts-panel2);
    border-radius: 16px;
    padding: 6px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
    font-weight: 600;
    font-size: 12.5px;
    min-width: 0;
  }
  .tile:hover:not(:disabled) {
    border-color: var(--ts-muted);
  }
  .tile.on {
    border-color: var(--ts-sel);
    box-shadow: 0 0 0 2px var(--ts-sel-soft);
    background: var(--ts-panel);
  }
  .tile-label {
    padding: 0 4px 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tile-art {
    height: 64px;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 14px;
    overflow: hidden;
    background-color: var(--primary-background-color, var(--ts-panel));
  }
  .tile-art.overlay {
    background-image: var(--theme-studio-background-overlay-preview, none);
    background-size: cover;
  }
  .tile-card {
    width: 100%;
    height: 100%;
    background: var(--ha-card-background, var(--ts-panel));
    border-radius: min(var(--ha-card-border-radius, 12px), 12px);
    box-shadow: var(--ha-card-box-shadow, none);
    border: var(--ha-card-border-width, 0px) solid var(--ha-card-border-color, transparent);
  }
  .font-art {
    height: 64px;
    border-radius: 11px;
    background: var(--ts-panel);
    border: 1px solid var(--ts-line);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 10px;
    overflow: hidden;
  }
  .font-aa {
    font-size: 22px;
    line-height: 1.1;
    font-weight: 600;
  }
  .font-sm {
    font-size: 11.5px;
    color: var(--ts-muted);
    font-weight: 400;
  }
  .image.none,
  .image.upload {
    position: relative;
    justify-content: flex-start;
  }
  .image-none {
    height: 64px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    color: var(--ts-muted);
    background: var(--ts-panel);
    border: 1px dashed var(--ts-line);
  }
  .image.upload input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  .image.upload.busy {
    opacity: 0.6;
  }
  .toast {
    position: fixed;
    left: 50%;
    bottom: 24px;
    transform: translateX(-50%);
    background: var(--ts-ink);
    color: var(--ts-panel);
    padding: 12px 18px;
    border-radius: 14px;
    font-weight: 600;
    z-index: 30;
    max-width: calc(100% - 32px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    font-size: 13.5px;
  }

  @container (max-width: 1179px) {
    .editor {
      grid-template-columns: 360px minmax(0, 1fr);
    }
    .rail {
      display: none;
    }
    .chips {
      display: flex;
    }
    .hide-t {
      display: none;
    }
  }
  @container (max-width: 719px) {
    .editor {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr);
    }
    .editor .pv {
      order: -1;
    }
    .editor .stage {
      height: 40vh;
    }
    .ctl {
      border-right: 0;
    }
    .sec {
      padding: 16px 16px 48px;
    }
    .name {
      font-size: 16px;
    }
    .scrim {
      align-items: flex-end;
      padding: 0;
    }
    .dialog {
      border-radius: 22px 22px 0 0;
      width: 100%;
      max-height: 88vh;
    }
    .opts {
      grid-template-columns: minmax(0, 1fr);
    }
    .images,
    .tiles {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .toast {
      bottom: 16px;
    }
  }
`;
