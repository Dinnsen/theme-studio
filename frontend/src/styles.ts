import { css } from "lit";

/**
 * The studio's own neutral look. It does not follow the active Home Assistant
 * theme on purpose, so the theme being previewed is never mixed with it. Light
 * or dark follows Home Assistant's dark mode.
 */
export const panelStyles = css`
  :host {
    --ts-bg: #eceef2;
    --ts-panel: #ffffff;
    --ts-panel2: #f5f6f8;
    --ts-ink: #15171c;
    --ts-muted: #555c6a;
    --ts-line: #dcdfe6;
    --ts-sel: #2a55d8;
    --ts-sel-soft: rgba(42, 85, 216, 0.1);
    --ts-ok: #1b6e44;
    --ts-ok-soft: #e2f2e9;
    --ts-warn: #9c3f12;
    --ts-warn-soft: #fbe9df;
    --ts-font: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --ts-mono: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
    display: block;
    height: 100%;
    background: var(--ts-bg);
    color: var(--ts-ink);
    font-family: var(--ts-font);
    font-size: 14px;
    line-height: 1.4;
    -webkit-font-smoothing: antialiased;
  }
  :host([dark]) {
    --ts-bg: #0d0f12;
    --ts-panel: #16191e;
    --ts-panel2: #1d2127;
    --ts-ink: #eceef2;
    --ts-muted: #a1a8b5;
    --ts-line: #2a2f37;
    --ts-sel: #86a4ff;
    --ts-sel-soft: rgba(134, 164, 255, 0.14);
    --ts-ok: #6ad49c;
    --ts-ok-soft: rgba(106, 212, 156, 0.12);
    --ts-warn: #ffa477;
    --ts-warn-soft: rgba(255, 164, 119, 0.13);
  }
  * {
    box-sizing: border-box;
  }
  button {
    font: inherit;
    color: inherit;
  }
  h1,
  h2,
  p {
    margin: 0;
  }
  .shell {
    container-type: inline-size;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .bar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    min-height: 64px;
    background: var(--ts-panel);
    border-bottom: 1px solid var(--ts-line);
    flex: none;
  }
  ha-menu-button {
    color: var(--ts-ink);
    --mdc-icon-button-size: 44px;
  }
  img.logo {
    object-fit: cover;
    display: block;
  }
  .logo {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: var(--ts-ink);
    color: var(--ts-panel);
    flex: none;
  }
  .titlebox {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .title {
    font-size: 18px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .status {
    font-size: 12.5px;
    color: var(--ts-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 16px;
    border-radius: 12px;
    border: 1px solid var(--ts-line);
    background: var(--ts-panel);
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    flex: none;
  }
  .btn:hover {
    background: var(--ts-panel2);
  }
  .btn.icon {
    width: 44px;
    padding: 0;
  }
  .btn.on {
    background: var(--ts-sel-soft);
    color: var(--ts-sel);
    border-color: transparent;
  }
  .btn.sm {
    min-height: 36px;
    padding: 0 12px;
    font-size: 13px;
    border-radius: 10px;
  }
  .btn:focus-visible,
  .seg button:focus-visible,
  .tcard:focus-visible {
    outline: 2px solid var(--ts-sel);
    outline-offset: 2px;
  }
  .seg {
    display: inline-flex;
    padding: 3px;
    border-radius: 13px;
    background: var(--ts-panel2);
    border: 1px solid var(--ts-line);
    gap: 2px;
    flex: none;
  }
  .seg button {
    border: 0;
    background: transparent;
    min-height: 36px;
    min-width: 40px;
    padding: 0 12px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    color: var(--ts-muted);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .seg button.on {
    background: var(--ts-panel);
    color: var(--ts-ink);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--ts-line);
  }

  /* Library */
  .lib {
    flex: 1;
    overflow: auto;
    padding: 28px 32px 56px;
  }
  .lib-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin: 0 auto 18px;
    max-width: 1240px;
  }
  .lib-title {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.015em;
  }
  .sub {
    color: var(--ts-muted);
    margin-top: 4px;
    max-width: 560px;
  }
  .notice {
    max-width: 1240px;
    margin: 0 auto;
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--ts-sel-soft);
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
  .notice > svg {
    color: var(--ts-sel);
    flex: none;
  }
  .notice-text {
    flex: 1;
    min-width: 220px;
  }
  .gtitle {
    max-width: 1240px;
    margin: 26px auto 12px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ts-muted);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 18px;
    max-width: 1240px;
    margin: 0 auto;
  }
  .tcard {
    background: var(--ts-panel);
    border: 1px solid var(--ts-line);
    border-radius: 18px;
    padding: 10px;
    cursor: pointer;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.15s, transform 0.15s;
  }
  .tcard:hover {
    border-color: var(--ts-muted);
    transform: translateY(-1px);
  }
  .mini {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 12px;
    overflow: hidden;
    height: 150px;
  }
  .mini-v {
    padding: 12px 10px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    position: relative;
  }
  .mini-v.empty {
    background: var(--ts-panel2);
    align-items: center;
    justify-content: center;
    color: var(--ts-muted);
  }
  .mini-line {
    height: 7px;
    border-radius: 4px;
    width: 55%;
  }
  .mini-card {
    padding: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .mini-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex: none;
  }
  .mini-bar {
    height: 5px;
    border-radius: 3px;
    flex: 1;
  }
  .mini-nav {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 9px;
    height: 14px;
    border-radius: 7px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
  .tmeta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 2px 4px;
  }
  .tmeta-text {
    min-width: 0;
  }
  .tname {
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tsub {
    font-size: 12.5px;
    color: var(--ts-muted);
  }
  .badge {
    font-family: var(--ts-mono);
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 8px;
    background: var(--ts-ok-soft);
    color: var(--ts-ok);
    white-space: nowrap;
  }
  .badge.warn {
    background: var(--ts-warn-soft);
    color: var(--ts-warn);
  }
  .message {
    max-width: 640px;
    margin: 48px auto;
    padding: 20px;
    border-radius: 16px;
    background: var(--ts-panel);
    border: 1px solid var(--ts-line);
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  /* Theme view */
  .ed {
    flex: 1;
    display: grid;
    grid-template-columns: 380px minmax(0, 1fr);
    min-height: 0;
  }
  .info {
    background: var(--ts-panel);
    border-right: 1px solid var(--ts-line);
    overflow: auto;
    min-height: 0;
    padding: 20px 20px 40px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .h {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ts-muted);
    margin-bottom: 10px;
  }
  .hint {
    font-size: 12.5px;
    color: var(--ts-muted);
  }
  .list {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--ts-line);
    border-radius: 16px;
    overflow: hidden;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 12px;
    border-top: 1px solid var(--ts-line);
  }
  .row:first-child {
    border-top: 0;
  }
  .sw {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 1px solid var(--ts-line);
    flex: none;
  }
  .row-text {
    flex: 1;
    min-width: 0;
  }
  .rn {
    font-weight: 600;
    font-size: 14px;
  }
  .val {
    font-family: var(--ts-mono);
    font-size: 12.5px;
    color: var(--ts-muted);
  }
  .sumrow {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .sumpill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 12px;
    background: var(--ts-panel2);
    border: 1px solid var(--ts-line);
    font-weight: 600;
    font-size: 13px;
  }
  .soon {
    padding: 14px;
    border-radius: 16px;
    background: var(--ts-panel2);
    border: 1px solid var(--ts-line);
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  .pv {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
  }
  .pv-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--ts-line);
    background: var(--ts-panel);
    flex: none;
  }
  .grow {
    flex: 1;
  }
  .stage {
    flex: 1;
    overflow: auto;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 28px;
    padding: 28px;
    min-height: 0;
    background-color: var(--ts-bg);
    background-image: radial-gradient(var(--ts-line) 1px, transparent 1px);
    background-size: 18px 18px;
  }
  .fwrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    flex: none;
    max-width: 100%;
  }
  .flabel {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--ts-muted);
  }
  .frame {
    position: relative;
    overflow: hidden;
    flex: none;
    background: var(--primary-background-color);
    /* One screen in a background that scrolls with the page: the preview's
       height instead of the browser window's (see .mock.scrolls). */
    --theme-studio-background-height: max(100cqh, 75cqw);
  }
  .frame.phone {
    width: 340px;
    height: 680px;
    border: 8px solid #0e0f12;
    border-radius: 42px;
  }
  .frame.tablet {
    width: 600px;
    height: 720px;
    border: 10px solid #0e0f12;
    border-radius: 30px;
  }
  .frame.desktop {
    width: 880px;
    max-width: 100%;
    height: 580px;
    border: 1px solid var(--ts-line);
    border-radius: 14px;
  }
  .loading {
    padding: 40px;
    color: var(--ts-muted);
    text-align: center;
  }

  @container (max-width: 1099px) {
    .ed {
      grid-template-columns: 330px minmax(0, 1fr);
    }
    .frame.desktop,
    .frame.tablet {
      width: 100%;
    }
  }
  @container (max-width: 719px) {
    .bar {
      padding: 6px 10px;
      gap: 8px;
      min-height: 60px;
    }
    .hide-p {
      display: none;
    }
    .lib {
      padding: 18px 14px 40px;
    }
    .lib-title {
      font-size: 24px;
    }
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
    .mini {
      height: 112px;
    }
    .mini-v {
      padding: 9px 7px;
      gap: 5px;
    }
    .tcard {
      padding: 7px;
      border-radius: 15px;
    }
    .tname {
      font-size: 14px;
    }
    .tmeta {
      flex-direction: column;
      align-items: flex-start;
    }
    .ed {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: auto minmax(0, 1fr);
    }
    .pv {
      order: -1;
      border-bottom: 1px solid var(--ts-line);
    }
    .pv-bar {
      padding: 6px 10px;
    }
    .stage {
      flex: none;
      height: 46vh;
      padding: 12px;
      gap: 10px;
      background-image: none;
    }
    .fwrap {
      flex: 1 1 0;
      min-width: 0;
      height: 100%;
    }
    .flabel {
      display: none;
    }
    .frame.phone,
    .frame.tablet,
    .frame.desktop {
      width: 100%;
      max-width: 440px;
      height: 100%;
      border: 1px solid var(--ts-line);
      border-radius: 20px;
    }
    .info {
      border-right: 0;
      padding: 16px 16px 40px;
    }
  }
`;
