import { css, html, type TemplateResult } from "lit";
import { icon, playIcon } from "./icons";

/**
 * A small dashboard drawn only with the theme's own CSS variables, so the
 * preview shows exactly what Home Assistant will show. The variables are set
 * on the surrounding frame; nothing here has colours of its own.
 */
export function renderMock(scrolls = false): TemplateResult {
  return html`
    <div class="mock ${scrolls ? "scrolls" : ""}">
      <div class="m-scroll">
        <div class="m-head">
          <div class="m-headtext">
            <div class="m-title">Home</div>
            <div class="m-sub">Wednesday · 14° outside</div>
          </div>
          <div class="m-avatar">C</div>
        </div>
        <div class="m-chips">
          <span class="m-chip on">Living room</span>
          <span class="m-chip">Kitchen</span>
          <span class="m-chip">Bedroom</span>
          <span class="m-chip">Garden</span>
        </div>
        <div class="m-grid">
          <div class="m-col">
            <div class="m-tiles">
              <div class="m-card">
                <div class="m-ic on">${icon("bulb", 19)}</div>
                <div class="m-name">Ceiling</div>
                <div class="m-state">On · 70 %</div>
              </div>
              <div class="m-card">
                <div class="m-ic">${icon("bulb", 19)}</div>
                <div class="m-name">Floor lamp</div>
                <div class="m-state">Off</div>
              </div>
            </div>
            <div class="m-bubble">
              <div class="m-fill"></div>
              <div class="m-bic">${icon("sun", 18)}</div>
              <div class="m-btext">
                <div class="m-name">Dining table</div>
                <div class="m-state">60 %</div>
              </div>
            </div>
          </div>
          <div class="m-col">
            <div class="m-card">
              <div class="m-row">
                <div class="m-ic on">${icon("thermo", 19)}</div>
                <div class="m-state">Living room</div>
              </div>
              <div class="m-temp">21.5°</div>
              <div class="m-state">Heating to 22°</div>
              <div class="m-track"><div class="m-tfill"></div></div>
            </div>
            <div class="m-card m-media">
              <div class="m-art"></div>
              <div class="m-btext">
                <div class="m-name">Evening playlist</div>
                <div class="m-state">Kitchen speaker</div>
              </div>
              <div class="m-play">${playIcon()}</div>
            </div>
          </div>
          <div class="m-col m-col3">
            <div class="m-pop">
              <div class="m-name">Front door</div>
              <div class="m-state">Locked · 2 min ago</div>
              <div class="m-track"><div class="m-tfill"></div></div>
            </div>
            <div class="m-card">
              <div class="m-ic">${icon("home", 19)}</div>
              <div class="m-name">Away mode</div>
              <div class="m-state">Off</div>
            </div>
          </div>
        </div>
      </div>
      <div class="m-nav">
        <span class="on">${icon("home", 21)}</span>
        <span>${icon("bulb", 21)}</span>
        <span>${icon("thermo", 21)}</span>
        <span>${icon("image", 21)}</span>
      </div>
    </div>
  `;
}

export const mockStyles = css`
  .mock {
    position: absolute;
    inset: 0;
    overflow: hidden;
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    font-family: var(--primary-font-family, system-ui), system-ui, sans-serif;
    color: var(--primary-text-color);
    background: var(--lovelace-background, var(--primary-background-color));
    background-attachment: scroll;
  }
  /* "Scrolls with the page": the background moves with the content. Home
     Assistant sizes it to one screen; here that is the preview's own height. */
  .mock.scrolls {
    container-type: size;
    background: var(--primary-background-color);
  }
  .mock.scrolls .m-scroll {
    background: var(--lovelace-background, var(--primary-background-color));
    background-attachment: local;
  }
  .m-scroll {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 20px 14px 96px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .m-scroll > * {
    flex: none;
  }
  .m-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .m-headtext {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .m-title {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--primary-text-color);
  }
  .m-sub,
  .m-state {
    font-size: 12.5px;
    color: var(--secondary-text-color);
  }
  .m-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 14px;
    flex: none;
    background: var(--accent-color);
    color: var(--text-primary-color);
  }
  .m-chips {
    display: flex;
    gap: 8px;
    overflow: hidden;
  }
  .m-chip {
    height: 34px;
    padding: 0 14px;
    border-radius: var(--theme-studio-chip-radius, 999px);
    display: inline-flex;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
    flex: none;
    background: var(--bubble-main-background-color, var(--ha-card-background));
    color: var(--primary-text-color);
  }
  .m-chip.on {
    background: var(--accent-color);
    color: var(--text-primary-color);
  }
  .m-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
  .m-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }
  .m-col3 {
    display: none;
  }
  .m-tiles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .m-card {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    background: var(--ha-card-background, var(--card-background-color));
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, none);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, transparent);
    backdrop-filter: var(--theme-studio-card-backdrop-filter, none);
    -webkit-backdrop-filter: var(--theme-studio-card-backdrop-filter, none);
    color: var(--primary-text-color);
  }
  .m-name {
    font-weight: 600;
    font-size: 14px;
  }
  .m-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .m-ic {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    margin-bottom: 6px;
    flex: none;
    color: var(--state-icon-color);
    background: color-mix(in srgb, var(--state-icon-color) 12%, transparent);
  }
  .m-row .m-ic {
    margin-bottom: 0;
  }
  .m-ic.on {
    color: var(--state-icon-active-color);
    background: color-mix(in srgb, var(--state-icon-active-color) 16%, transparent);
  }
  .m-bubble {
    position: relative;
    height: 58px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 10px;
    overflow: hidden;
    background: var(--bubble-main-background-color, var(--ha-card-background));
    border-radius: var(--bubble-border-radius, 32px);
    box-shadow: var(--bubble-box-shadow, none);
    border: var(--bubble-border, none);
    color: var(--primary-text-color);
  }
  .m-fill {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 62%;
    background: var(--bubble-accent-color, var(--accent-color));
  }
  .m-bic,
  .m-btext {
    position: relative;
  }
  .m-btext {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .m-bic {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex: none;
    background: var(--accent-color);
    color: var(--text-primary-color);
  }
  .m-temp {
    font-size: 34px;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-top: 6px;
  }
  .m-track {
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 8px;
    background: var(--divider-color);
  }
  .m-tfill {
    height: 100%;
    width: 72%;
    border-radius: 4px;
    background: var(--accent-color);
  }
  .m-media {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
  .m-art {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    flex: none;
    background: linear-gradient(
      135deg,
      var(--accent-color),
      color-mix(in srgb, var(--accent-color) 45%, var(--primary-background-color))
    );
  }
  .m-play {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex: none;
    margin-left: auto;
    background: var(--accent-color);
    color: var(--text-primary-color);
  }
  .m-pop {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: var(--bubble-pop-up-background-color, var(--ha-card-background));
    border: var(--bubble-pop-up-border, none);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }
  .m-nav {
    position: absolute;
    left: 12px;
    right: 12px;
    bottom: 12px;
    height: 58px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: var(--theme-studio-navbar-background-color, var(--ha-card-background));
    color: var(--theme-studio-navbar-primary-color, var(--primary-text-color));
    box-shadow: var(--ha-card-box-shadow, none);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  .m-nav span {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
  }
  .m-nav .on {
    color: var(--accent-color);
  }
  @container (min-width: 520px) {
    .m-grid {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
    .m-scroll {
      padding: 24px 22px 100px;
    }
    .m-nav {
      left: 50%;
      right: auto;
      width: 360px;
      transform: translateX(-50%);
    }
  }
  @container (min-width: 760px) {
    .m-grid {
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, 1fr);
    }
    .m-col3 {
      display: flex;
    }
  }
`;
