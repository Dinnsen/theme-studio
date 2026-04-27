#!/usr/bin/env python3
import argparse, colorsys, json, re
from pathlib import Path

THEME_NAME = 'Theme Studio Dynamic'
BUILTIN_PRESET_NAMES = [
    'Default', 'Glass', 'MD3', 'Dark Blue', 'Flavors', 'Vision',
    'Dark Green', 'Purple', 'Pink Mono', 'Black White', 'Aurora',
]

def clamp(v, lo, hi):
    return max(lo, min(hi, v))

def wrap_h(h):
    return h % 360

def parse_hex(v: str, fallback='#344334') -> str:
    v = (v or '').strip()
    if not v or v.lower() == 'auto':
        return fallback
    if not v.startswith('#'):
        v = '#' + v
    if re.fullmatch(r'#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})', v):
        if len(v) == 4:
            v = '#' + ''.join(ch * 2 for ch in v[1:])
        return v.lower()
    return fallback

def hex_to_rgb(hex_color: str):
    c = parse_hex(hex_color)
    return int(c[1:3], 16), int(c[3:5], 16), int(c[5:7], 16)

def hex_to_hsl(hex_color: str):
    c = parse_hex(hex_color)
    r = int(c[1:3], 16) / 255
    g = int(c[3:5], 16) / 255
    b = int(c[5:7], 16) / 255
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    return h * 360, s * 100, l * 100

def hsl(h, s, l):
    return f"hsl({round(wrap_h(h))}, {round(clamp(s, 0, 100))}%, {round(clamp(l, 0, 100))}%)"

def hsla(h, s, l, a):
    return f"hsla({round(wrap_h(h))}, {round(clamp(s, 0, 100))}%, {round(clamp(l, 0, 100))}%, {clamp(a, 0, 1):.2f})"

def rgba_from_hex(hex_color: str, a: float):
    r, g, b = hex_to_rgb(hex_color)
    return f"rgba({r}, {g}, {b}, {clamp(a, 0, 1):.2f})"

def text_on(lightness: float) -> str:
    return '#111111' if lightness >= 58 else '#ffffff'

def rgba_text_on(lightness: float, alpha: float) -> str:
    if lightness >= 58:
        return f'rgba(17, 17, 17, {clamp(alpha, 0, 1):.2f})'
    return f'rgba(255, 255, 255, {clamp(alpha, 0, 1):.2f})'

def boolish(v: str) -> bool:
    return str(v).strip().lower() in {'1', 'true', 'on', 'yes', 'y'}

def safe_float(value, fallback=0.0):
    try:
        if value is None:
            return float(fallback)
        s = str(value).strip().lower()
        if s in {"", "unknown", "unavailable", "none", "null"}:
            return float(fallback)
        return float(value)
    except (TypeError, ValueError):
        return float(fallback)

def scale_css_px(css: str, factor: float) -> str:
    value = str(css or '').strip()
    if not value or value.lower() == 'none':
        return 'none'

    def repl(match):
        num = float(match.group(1))
        scaled = num * factor
        if abs(scaled) < 0.01:
            scaled = 0.0
        txt = f"{scaled:.2f}".rstrip('0').rstrip('.')
        if txt == '-0':
            txt = '0'
        return f"{txt}px"

    return re.sub(r'(-?\d*\.?\d+)px', repl, value)

def border_css_to_ring_shadow(border_css: str) -> str:
    value = str(border_css or '').strip()
    if not value or value.lower() == 'none':
        return 'none'
    m = re.match(r'(-?\d*\.?\d+)px\s+solid\s+(.+)', value)
    if not m:
        return 'none'
    px = float(m.group(1))
    color = m.group(2).strip()
    if abs(px) < 0.01:
        return 'none'
    txt = f"{px:.2f}".rstrip('0').rstrip('.')
    if txt == '-0':
        txt = '0'
    return f"0 0 0 {txt}px {color}"

def build_font_face_css(enabled: bool, font_family: str, font_path: str) -> str:
    if not enabled:
        return ''
    family = (font_family or '').strip()
    path = (font_path or '').strip()
    if not family or not path:
        return ''
    safe_family = family.replace('"', '\\"')
    return (
        "@font-face {\n"
        f"  font-family: \"{safe_family}\";\n"
        f"  src: url(\"{path}\");\n"
        "  font-display: swap;\n"
        "}\n"
    )

def normalize_bg_url(url: str) -> str:
    u = (url or '').strip().replace('\\', '/')
    if not u or u.lower() in {'none', 'off', 'false'}:
        return ''
    if u.startswith('/config/www/'):
        u = '/local/' + u[len('/config/www/'):]
    elif u.startswith('config/www/'):
        u = '/local/' + u[len('config/www/'):]
    elif u.startswith('/www/'):
        u = '/local/' + u[len('/www/'):]
    elif u.startswith('www/'):
        u = '/local/' + u[len('www/'):]
    elif u.startswith('background/'):
        u = '/local/' + u
    elif not u.startswith('/local/') and '/' not in u:
        u = '/local/background/' + u
    if u.startswith('/local/backgrounds/'):
        u = '/local/background/' + u[len('/local/backgrounds/'):]
    u = re.sub(r'(?<!:)/{2,}', '/', u)
    return u

def css_url(url: str) -> str:
    u = normalize_bg_url(url)
    if not u:
        return 'none'
    u = u.replace('"', '%22')
    return f"url('{u}')"

def background_scrim(bg_hex: str, strength: float):
    s = clamp(strength, 0, 100) / 100.0
    value = (bg_hex or '').strip()

    if value.lower().startswith('hsl'):
        h, sat, light = parse_hsl_like(value)

        # Intet scrim = billedet fuldt synligt
        if s <= 0.001:
            return 'none'

        # Fuld skjul = billedet helt væk
        if s >= 0.999:
            return hsla(h, sat, light, 1.0)

        # Blød kurve mellem skjult og synligt
        curve = s ** 1.35
        top_a = 0.18 * curve
        mid_a = 0.72 * curve
        end_a = 1.00 * curve

        top = hsla(h, sat, light, top_a)
        mid = hsla(h, sat, light, mid_a)
        end = hsla(h, sat, light, end_a)

    else:
        bg = parse_hex(value, '#344334')

        # Intet scrim = billedet fuldt synligt
        if s <= 0.001:
            return 'none'

        # Fuld skjul = billedet helt væk
        if s >= 0.999:
            return rgba_from_hex(bg, 1.0)

        # Blød kurve mellem skjult og synligt
        curve = s ** 1.35
        top = rgba_from_hex(bg, 0.18 * curve)
        mid = rgba_from_hex(bg, 0.72 * curve)
        end = rgba_from_hex(bg, 1.00 * curve)

    return (
        f"linear-gradient(180deg, "
        f"{top} 0%, "
        f"{mid} 54%, "
        f"{end} 100%)"
    )

def overlay_css(bg_hex: str, overlay: str, accent_h: float, surface_s: float, strength: float,
                offset_y: float = 72, scale: float = 100, spread: float = 100):
    bg_value = (bg_hex or '').strip()

    if bg_value.lower().startswith('hsl'):
        _, _, bg_l = parse_hsl_like(bg_value)
    else:
        bg = parse_hex(bg_value, '#344334')
        _, _, bg_l = hex_to_hsl(bg)

    s = clamp(strength, 0, 100) / 100.0
    scale_f = clamp(scale, 50, 200) / 100.0
    spread_f = clamp(spread, 50, 200) / 100.0
    y0 = clamp(offset_y, 0, 100)

    # True = lys baggrund, False = mørk baggrund
    overlay_is_light_bg = bg_l >= 58

    # Ekstra boost til meget mørke baggrunde
    if bg_l <= 10:
        dark_bg_boost = 1.65
    elif bg_l <= 18:
        dark_bg_boost = 1.45
    elif bg_l <= 28:
        dark_bg_boost = 1.22
    else:
        dark_bg_boost = 1.00

    # Farvede overlays får også lidt ekstra punch på mørke baggrunde
    color_alpha_boost = 1.00 if overlay_is_light_bg else dark_bg_boost

    if overlay_is_light_bg:
        # LYS BAGGRUND = SORT OVERLAY/FADES
        ink = '0,0,0'
        transparent = 'rgba(0,0,0,0.00)'
        clear = f"{transparent} 0px, {transparent} {round(40 + y0 * 1.95)}px"

        deep1 = f"rgba(0,0,0,{clamp(0.04 + 0.20 * s, 0, 0.72):.2f})"
        deep2 = f"rgba(0,0,0,{clamp(0.10 + 0.30 * s, 0, 0.82):.2f})"
        soft = f"rgba(0,0,0,{clamp(0.04 + 0.14 * s, 0, 0.52):.2f})"
        medium = f"rgba(0,0,0,{clamp(0.08 + 0.18 * s, 0, 0.62):.2f})"

        dark_soft = f"rgba(0,0,0,{clamp(0.02 + 0.06 * s, 0, 0.24):.2f})"
        cinematic_top = f"rgba(0,0,0,{clamp(0.08 + 0.14 * s, 0, 0.62):.2f})"
        cinematic_bottom = f"rgba(0,0,0,{clamp(0.12 + 0.18 * s, 0, 0.72):.2f})"
    else:
        # MØRK BAGGRUND = HVID OVERLAY/FADES
        ink = '255,255,255'
        transparent = 'rgba(255,255,255,0.00)'
        clear = f"{transparent} 0px, {transparent} {round(40 + y0 * 1.95)}px"

        deep1 = f"rgba(255,255,255,{clamp((0.07 + 0.22 * s) * dark_bg_boost, 0, 0.78):.2f})"
        deep2 = f"rgba(255,255,255,{clamp((0.12 + 0.32 * s) * dark_bg_boost, 0, 0.90):.2f})"
        soft = f"rgba(255,255,255,{clamp((0.06 + 0.16 * s) * dark_bg_boost, 0, 0.58):.2f})"
        medium = f"rgba(255,255,255,{clamp((0.10 + 0.22 * s) * dark_bg_boost, 0, 0.70):.2f})"

        dark_soft = f"rgba(0,0,0,{clamp(0.01 + 0.04 * s, 0, 0.12):.2f})"
        cinematic_top = f"rgba(255,255,255,{clamp((0.10 + 0.16 * s) * dark_bg_boost, 0, 0.74):.2f})"
        cinematic_bottom = f"rgba(255,255,255,{clamp((0.16 + 0.22 * s) * dark_bg_boost, 0, 0.86):.2f})"

    left_x = round(clamp(50 - 32 * spread_f, 5, 95))
    mid_x = 50
    right_x = round(clamp(50 + 32 * spread_f, 5, 95))
    far_left_x = round(clamp(50 - 28 * spread_f, 5, 95))
    far_right_x = round(clamp(50 + 28 * spread_f, 5, 95))

    y_main = round(clamp(y0, 0, 100))
    y_low = round(clamp(y0 + 8 * spread_f, 0, 100))
    y_center = round(clamp(y0 - 10, 0, 100))

    av_top_x = round(clamp(50 - 10 * spread_f, 8, 92))
    av_mid_x = round(clamp(50 + 5 * spread_f, 8, 92))
    av_bot_x = round(clamp(50 - 7 * spread_f, 8, 92))
    av_top_y = round(clamp(y0 - 18, 0, 100))
    av_mid_y = y_main
    av_bot_y = round(clamp(y0 + 22, 0, 100))

    r_sm = round(22 * scale_f)
    r_md = round(28 * scale_f)
    r_lg = round(35 * scale_f)
    stripe_a = round(10 * scale_f)
    stripe_b = round(22 * scale_f)
    topo_a = round(18 * scale_f)
    topo_b = round(22 * scale_f)

    veil_curve = s ** 1.10
    mist_curve = s ** 1.18
    frost_curve = s ** 1.22
    stripes_curve = s ** 1.35
    topo_curve = s ** 1.55

    if overlay_is_light_bg:
        veil_deep1 = f"rgba(0,0,0,{clamp(0.00 + 0.22 * veil_curve, 0, 0.44):.2f})"
        veil_deep2 = f"rgba(0,0,0,{clamp(0.02 + 0.30 * veil_curve, 0, 0.58):.2f})"

        mist_soft = f"rgba(0,0,0,{clamp(0.00 + 0.10 * mist_curve, 0, 0.22):.2f})"
        mist_medium = f"rgba(0,0,0,{clamp(0.01 + 0.15 * mist_curve, 0, 0.30):.2f})"
        mist_fade = f"rgba(0,0,0,{clamp(0.01 + 0.16 * mist_curve, 0, 0.34):.2f})"

        frost_soft = f"rgba(0,0,0,{clamp(0.00 + 0.10 * frost_curve, 0, 0.22):.2f})"
        frost_medium = f"rgba(0,0,0,{clamp(0.01 + 0.15 * frost_curve, 0, 0.30):.2f})"
        frost_fade = f"rgba(0,0,0,{clamp(0.01 + 0.16 * frost_curve, 0, 0.34):.2f})"

        stripes_line = f"rgba(0,0,0,{clamp(0.00 + 0.12 * stripes_curve, 0, 0.22):.2f})"
        stripes_fade = f"rgba(0,0,0,{clamp(0.00 + 0.14 * stripes_curve, 0, 0.26):.2f})"

        topo_line = f"rgba(0,0,0,{clamp(0.00 + 0.10 * topo_curve, 0, 0.16):.2f})"
        topo_fade = f"rgba(0,0,0,{clamp(0.00 + 0.12 * topo_curve, 0, 0.20):.2f})"
    else:
        veil_deep1 = f"rgba(255,255,255,{clamp((0.00 + 0.24 * veil_curve) * dark_bg_boost, 0, 0.54):.2f})"
        veil_deep2 = f"rgba(255,255,255,{clamp((0.02 + 0.34 * veil_curve) * dark_bg_boost, 0, 0.68):.2f})"

        mist_soft = f"rgba(255,255,255,{clamp((0.00 + 0.10 * mist_curve) * dark_bg_boost, 0, 0.26):.2f})"
        mist_medium = f"rgba(255,255,255,{clamp((0.01 + 0.16 * mist_curve) * dark_bg_boost, 0, 0.34):.2f})"
        mist_fade = f"rgba(255,255,255,{clamp((0.01 + 0.18 * mist_curve) * dark_bg_boost, 0, 0.38):.2f})"

        frost_soft = f"rgba(255,255,255,{clamp((0.00 + 0.10 * frost_curve) * dark_bg_boost, 0, 0.26):.2f})"
        frost_medium = f"rgba(255,255,255,{clamp((0.01 + 0.16 * frost_curve) * dark_bg_boost, 0, 0.34):.2f})"
        frost_fade = f"rgba(255,255,255,{clamp((0.01 + 0.18 * frost_curve) * dark_bg_boost, 0, 0.40):.2f})"

        stripes_line = f"rgba(255,255,255,{clamp((0.00 + 0.12 * stripes_curve) * dark_bg_boost, 0, 0.24):.2f})"
        stripes_fade = f"rgba(255,255,255,{clamp((0.00 + 0.15 * stripes_curve) * dark_bg_boost, 0, 0.30):.2f})"

        topo_line = f"rgba(255,255,255,{clamp((0.00 + 0.10 * topo_curve) * dark_bg_boost, 0, 0.18):.2f})"
        topo_fade = f"rgba(255,255,255,{clamp((0.00 + 0.13 * topo_curve) * dark_bg_boost, 0, 0.24):.2f})"

    def ah(h_off, sat_add, light, alpha):
        return hsla(
            accent_h + h_off,
            surface_s + sat_add,
            light,
            clamp(alpha * color_alpha_boost, 0, 1)
        )

    overlays = {
        'none': 'none',

        'soft_veil':
            f"linear-gradient(180deg, {clear}, {veil_deep1} 52%, {veil_deep2} 100%)",

        'mesh_glow':
            f"radial-gradient(circle at {left_x}% {y_low}%, {ah(-10, 28, 46, 0.10 + 0.55*s)} 0%, transparent {r_md}%), "
            f"radial-gradient(circle at {right_x}% {y_low}%, {ah(34, 24, 48, 0.08 + 0.48*s)} 0%, transparent {r_sm}%), "
            f"linear-gradient(180deg, {clear}, {deep1} 56%, {deep2} 100%)",

        'vignette':
            f"radial-gradient(ellipse at center, {transparent} {round(34*scale_f)}%, {deep1} 74%, {deep2} 100%), "
            f"linear-gradient(180deg, {clear}, {dark_soft} 100%)",

        'aurora':
            f"radial-gradient(circle at {left_x}% {y_low}%, {ah(-12, 32, 44, 0.14 + 0.50*s)} 0%, transparent {r_md}%), "
            f"radial-gradient(circle at {mid_x}% {y_main}%, {ah(46, 28, 42, 0.12 + 0.46*s)} 0%, transparent {round(24*scale_f)}%), "
            f"radial-gradient(circle at {right_x}% {y_low}%, {ah(88, 26, 44, 0.12 + 0.46*s)} 0%, transparent {round(26*scale_f)}%), "
            f"linear-gradient(180deg, {clear}, {deep1} 52%, {deep2} 100%)",

        'aurora_vertical':
            f"radial-gradient(ellipse at {av_top_x}% {av_top_y}%, {ah(-10, 32, 46, 0.16 + 0.54*s)} 0%, transparent {round(34*scale_f*spread_f)}%), "
            f"radial-gradient(ellipse at {av_mid_x}% {av_mid_y}%, {ah(34, 28, 44, 0.14 + 0.50*s)} 0%, transparent {round(38*scale_f*spread_f)}%), "
            f"radial-gradient(ellipse at {av_bot_x}% {av_bot_y}%, {ah(86, 26, 46, 0.14 + 0.50*s)} 0%, transparent {round(42*scale_f*spread_f)}%), "
            f"linear-gradient(180deg, {clear}, {deep1} 52%, {deep2} 100%)",

        'spotlight':
            f"radial-gradient(circle at 50% {y_center}%, {transparent} 0%, {transparent} {round(18*scale_f)}%, {medium} {round(42*scale_f)}%, {deep2} 100%)",

        'diagonal_fade':
            f"linear-gradient(135deg, {transparent} 0%, {transparent} 26%, {deep1} 62%, {deep2} 100%)",

        'topographic':
            f"repeating-radial-gradient(circle at 50% {y_low}%, {topo_line} 0 {topo_a}px, transparent {topo_a}px {round(topo_a + topo_b)}px), "
            f"linear-gradient(180deg, {clear}, {topo_fade} 100%)",

        'mist':
            f"radial-gradient(ellipse at {far_left_x}% {y_low}%, {mist_medium} 0%, transparent {r_lg}%), "
            f"radial-gradient(ellipse at {far_right_x}% {round(clamp(y_low + 6, 0, 100))}%, {mist_soft} 0%, transparent {round(32*scale_f)}%), "
            f"linear-gradient(180deg, {clear}, {mist_fade} 100%)",

        'frost':
            f"linear-gradient(180deg, {transparent} 0px, {transparent} {round(40 + y0 * 1.95)}px, {frost_soft} 42%, {frost_medium} 100%), "
            f"linear-gradient(180deg, {clear}, {frost_fade} 100%)",

        'dual_orb':
            f"radial-gradient(circle at {far_left_x}% {y_low}%, {ah(0, 28, 44, 0.14 + 0.48*s)} 0%, transparent {round(24*scale_f)}%), "
            f"radial-gradient(circle at {far_right_x}% {y_low}%, {ah(58, 28, 48, 0.12 + 0.46*s)} 0%, transparent {round(22*scale_f)}%), "
            f"linear-gradient(180deg, {clear}, {deep1} 100%)",

        'soft_stripes':
            f"repeating-linear-gradient(120deg, {stripes_line} 0 {stripe_a}px, transparent {stripe_a}px {stripe_b}px), "
            f"linear-gradient(180deg, {clear}, {stripes_fade} 100%)",

        'cinematic':
            f"linear-gradient(180deg, {cinematic_top} 0%, {transparent} 28%, {cinematic_bottom} 100%), "
            f"linear-gradient(180deg, {clear}, {deep1} 48%, {deep2} 100%)",

        'halo':
            f"radial-gradient(circle at 50% {y_main}%, {ah(20, 22, 46, 0.10 + 0.40*s)} 0%, transparent {r_md}%), "
            f"linear-gradient(180deg, {clear}, {deep1} 100%)",
    }

    return overlays.get(overlay, 'none')
# contrast helpers layered on top of v11 core model
def adjust_hsl_light(color: str, delta: float, alpha=None):
    h, s, l = hex_to_hsl(color) if color.startswith('#') else parse_hsl_like(color)
    if alpha is None:
        return hsl(h, s, clamp(l + delta, 0, 100))
    return hsla(h, s, clamp(l + delta, 0, 100), alpha)

def adjust_hsl(color: str, delta_l: float = 0, delta_s: float = 0, alpha=None):
    h, s, l = hex_to_hsl(color) if color.startswith('#') else parse_hsl_like(color)
    if alpha is None:
        return hsl(h, clamp(s + delta_s, 0, 100), clamp(l + delta_l, 0, 100))
    return hsla(h, clamp(s + delta_s, 0, 100), clamp(l + delta_l, 0, 100), alpha)



def build_surface_fx(
    border_type: str,
    shadow_type: str,
    surface_h: float,
    surface_s: float,
    surface_l: float,
    backdrop_l: float,
    border_hue_shift: float,
    border_saturation: float,
    border_contrast: float,
    border_opacity: float,
    border_size: float,
    shadow_hue_shift: float,
    shadow_saturation: float,
    shadow_contrast: float,
    shadow_opacity: float,
    shadow_size: float,
):
    # Border palette should be vivid and independently controllable
    border_h = wrap_h(surface_h + border_hue_shift)
    border_s_base = max(surface_s * 0.45 + 18, 18)
    border_s = clamp(
        border_s_base + border_saturation * (2.20 if border_saturation < 0 else 1.85),
        0,
        100
    )
    border_light_dir = 18 if surface_l < 54 else -16
    border_backdrop_bias = -8 if backdrop_l >= 58 else 10 if backdrop_l <= 32 else 0
    border_l = clamp(
        surface_l + border_light_dir + border_backdrop_bias + border_contrast * 0.22,
        0,
        100
    )
    border_a = clamp(border_opacity / 100.0, 0, 1)

    # Shadow palette should react to the backdrop behind the card, not only the card surface itself.
    shadow_h = wrap_h(surface_h + shadow_hue_shift)
    shadow_s_base = max(surface_s * 0.32 + 8, 8)
    shadow_s = clamp(
        shadow_s_base + shadow_saturation * (1.95 if shadow_saturation < 0 else 1.35),
        0,
        100
    )
    shadow_a = clamp(shadow_opacity / 100.0, 0, 1)

    bsz = clamp(border_size, 0, 12)
    ssz = clamp(shadow_size, 0, 100) / 100.0
    size_n = bsz / 12.0

    border_px = max(1, round(1 + bsz * 0.34))
    border_px_soft = max(1, round(1 + bsz * 0.18))
    border_px_hair = max(1, round(1 + bsz * 0.10))
    accent_px = max(2, round(2 + bsz * 0.24))
    glow_px = round(10 + 30 * size_n)
    glow_outer_px = round(14 + 40 * size_n)

    border_visibility_boost = 1.0 + max(border_contrast, 0) / 100.0 * 0.55
    base_alpha = clamp(border_a * border_visibility_boost, 0, 1)
    line = hsla(border_h, border_s, border_l, base_alpha)
    line_soft = hsla(border_h, clamp(border_s * 0.70, 0, 100), clamp(border_l + 4, 0, 100), clamp(base_alpha * 0.72, 0, 1))
    line_hair = hsla(border_h, clamp(border_s * 0.56, 0, 100), clamp(border_l + 8, 0, 100), clamp(base_alpha * 0.52, 0, 1))
    line_inner = hsla(border_h, clamp(border_s * 0.82 + 4, 0, 100), clamp(border_l + 16, 0, 100), clamp(base_alpha * 0.70, 0, 1))
    line_shadow = hsla(border_h, clamp(border_s * 0.76, 0, 100), clamp(border_l - 22, 0, 100), clamp(base_alpha * 0.42, 0, 1))
    accent_line = hsla(border_h, clamp(border_s + 18, 0, 100), clamp(border_l + 6, 0, 100), clamp(base_alpha * 1.06, 0, 1))
    accent_glow = hsla(border_h, clamp(border_s + 24, 0, 100), clamp(border_l + 10, 0, 100), clamp(base_alpha * 0.40, 0, 1))
    glow_line = hsla(border_h, clamp(border_s + 10, 0, 100), clamp(border_l + 10, 0, 100), clamp(base_alpha * 0.30, 0, 1))
    inner_glow = hsla(border_h, clamp(border_s + 16, 0, 100), clamp(border_l + 16, 0, 100), clamp(base_alpha * 0.44, 0, 1))

    if border_type == 'none':
        border_css = 'none'
        border_effect_css = 'none'
    elif border_type == 'soft_hairline':
        border_css = f"{border_px_hair}px solid {line_hair}"
        border_effect_css = f"0 0 0 {border_px_hair}px {line_hair}"
    elif border_type == 'glass_edge':
        border_css = 'none'
        border_effect_css = (
            f"inset 0 1px 0 {line_inner}, "
            f"inset 1px 0 0 {hsla(border_h, clamp(border_s * 0.60, 0, 100), clamp(border_l + 8, 0, 100), clamp(base_alpha * 0.30, 0, 1))}, "
            f"inset 0 -1px 0 {line_shadow}, "
            f"0 0 0 1px {hsla(border_h, clamp(border_s * 0.55, 0, 100), clamp(border_l + 2, 0, 100), clamp(base_alpha * 0.16, 0, 1))}"
        )
    elif border_type == 'etched':
        border_css = 'none'
        bevel_px = max(1, round(1 + bsz * 0.18))
        border_effect_css = f"inset 0 {bevel_px}px 0 {line_inner}, inset 0 -{bevel_px}px 0 {line_shadow}"
    elif border_type == 'inner_glow':
        border_css = 'none'
        border_effect_css = (
            f"inset 0 0 {round(8 + 26 * size_n)}px {inner_glow}, "
            f"inset 0 0 {round(2 + 10 * size_n)}px {hsla(border_h, clamp(border_s + 8, 0, 100), clamp(border_l + 20, 0, 100), clamp(base_alpha * 0.54, 0, 1))}"
        )
    elif border_type == 'accent_line':
        border_css = f"{accent_px}px solid {accent_line}"
        border_effect_css = (
            f"0 0 0 {accent_px}px {accent_line}, "
            f"0 0 {round(8 + 30 * size_n)}px {accent_glow}"
        )
    elif border_type == 'double_line':
        outer_px = max(1, round(1 + bsz * 0.22))
        inner_px = max(2, round(2 + bsz * 0.32))
        border_css = f"{outer_px}px solid {line}"
        border_effect_css = (
            f"0 0 0 {outer_px}px {line}, "
            f"inset 0 0 0 {inner_px}px {hsla(border_h, clamp(border_s + 6, 0, 100), clamp(border_l + 10, 0, 100), clamp(base_alpha * 0.52, 0, 1))}"
        )
    elif border_type == 'bevel_edge':
        border_css = 'none'
        bevel_px = max(1, round(1 + bsz * 0.24))
        border_effect_css = (
            f"inset 0 {bevel_px}px 0 {line_inner}, "
            f"inset {bevel_px}px 0 0 {line_inner}, "
            f"inset 0 -{bevel_px}px 0 {line_shadow}, "
            f"inset -{bevel_px}px 0 0 {line_shadow}"
        )
    elif border_type == 'glow_line':
        border_css = f"{border_px_soft}px solid {line_soft}"
        border_effect_css = (
            f"0 0 {round(10 + 34 * size_n)}px {glow_line}, "
            f"inset 0 0 {round(8 + 26 * size_n)}px {inner_glow}, "
            f"inset 0 0 {round(2 + 10 * size_n)}px {hsla(border_h, clamp(border_s + 8, 0, 100), clamp(border_l + 20, 0, 100), clamp(base_alpha * 0.54, 0, 1))}"
        )
    else:
        border_css = f"{border_px_soft}px solid {line}"
        border_effect_css = f"inset 0 0 0 {border_px_soft}px {line_soft}"

    sep = abs(surface_l - backdrop_l)
    closeness = 1.0 - clamp(sep / 28.0, 0, 1)
    contrast_factor = shadow_contrast / 100.0
    visibility_boost = clamp(1.0 + contrast_factor * 0.85 + closeness * 0.85, 0.25, 2.35)
    light_backdrop = backdrop_l >= 58
    dark_backdrop = backdrop_l <= 34

    shadow_y_1 = round(2 + 8 * ssz)
    shadow_blur_1 = round(8 + 16 * ssz)
    shadow_y_2 = round(8 + 18 * ssz)
    shadow_blur_2 = round(18 + 32 * ssz)
    shadow_y_3 = round(16 + 28 * ssz)
    shadow_blur_3 = round(30 + 46 * ssz)
    spread_2 = round(0 + 4 * ssz)
    spread_3 = round(2 + 8 * ssz)

    dark_base_l = clamp(min(surface_l, backdrop_l) - 22 - shadow_contrast * 0.10, 0, 100)
    dark_mid_l = clamp(dark_base_l - 10, 0, 100)
    dark_far_l = clamp(dark_base_l - 20, 0, 100)
    light_base_l = clamp(max(surface_l, backdrop_l) + 18 + shadow_contrast * 0.10, 0, 100)
    light_far_l = clamp(light_base_l + 10, 0, 100)

    dark_shadow_1 = hsla(shadow_h, shadow_s, dark_base_l, clamp(shadow_a * 0.34 * visibility_boost, 0, 1))
    dark_shadow_2 = hsla(shadow_h, shadow_s, dark_mid_l, clamp(shadow_a * 0.24 * visibility_boost, 0, 1))
    dark_shadow_3 = hsla(shadow_h, shadow_s, dark_far_l, clamp(shadow_a * 0.16 * visibility_boost, 0, 1))

    light_shadow_1 = hsla(shadow_h, clamp(shadow_s * 0.72 + 10, 0, 100), light_base_l, clamp(shadow_a * 0.22 * visibility_boost, 0, 1))
    light_shadow_2 = hsla(shadow_h, clamp(shadow_s * 0.66 + 12, 0, 100), light_far_l, clamp(shadow_a * 0.14 * visibility_boost, 0, 1))
    glow_color_1 = hsla(shadow_h, clamp(shadow_s + 18, 0, 100), clamp(light_base_l + 4, 0, 100), clamp(shadow_a * 0.24 * visibility_boost, 0, 1))
    glow_color_2 = hsla(shadow_h, clamp(shadow_s + 24, 0, 100), clamp(light_far_l + 8, 0, 100), clamp(shadow_a * 0.14 * visibility_boost, 0, 1))

    subtle_rim = 'none'
    if dark_backdrop or closeness > 0.35:
        subtle_rim = f"0 0 {round(8 + 18 * ssz)}px {light_shadow_1}"

    if shadow_type == 'none':
        shadow_css = 'none'
    elif shadow_type == 'soft_depth':
        shadow_css = ', '.join([
            f"0 {shadow_y_1}px {shadow_blur_1}px {dark_shadow_1}",
            f"0 {shadow_y_2}px {shadow_blur_2}px -{spread_2}px {dark_shadow_2}",
            *([] if subtle_rim == 'none' else [subtle_rim]),
        ])
    elif shadow_type == 'glass_glow':
        shadow_css = ', '.join([
            f"0 {shadow_y_1}px {round(10 + 14 * ssz)}px {dark_shadow_1}",
            f"0 {shadow_y_2}px {round(18 + 22 * ssz)}px -{spread_2}px {dark_shadow_2}",
            f"0 0 {round(12 + 28 * ssz)}px {glow_color_1}",
            f"0 0 {round(26 + 44 * ssz)}px {glow_color_2}",
        ])
    elif shadow_type == 'ambient_lift':
        ambient_key = dark_shadow_1 if light_backdrop else light_shadow_1
        shadow_css = ', '.join([
            f"0 1px 2px {hsla(shadow_h, shadow_s, dark_base_l if light_backdrop else light_base_l, clamp(shadow_a * 0.10 * visibility_boost, 0, 1))}",
            f"0 {round(2 + 5 * ssz)}px {round(10 + 14 * ssz)}px {ambient_key}",
            *([] if subtle_rim == 'none' else [subtle_rim]),
        ])
    elif shadow_type == 'neon_glow':
        sat_pull = clamp((-shadow_saturation) / 50.0, 0, 1)
        neon_s_vivid = clamp(max(68, shadow_s + 34), 0, 100)
        neon_s = clamp(neon_s_vivid * (1.0 - sat_pull), 0, 100)
        neon_s_core = clamp(neon_s + (6 * (1.0 - sat_pull)), 0, 100)
        neon_s_outer = clamp(max(neon_s - (6 * (1.0 - sat_pull)), 0), 0, 100)

        neon_core_l = 52 if light_backdrop else 60
        neon_outer_l = 46 if light_backdrop else 54

        neon_a_1 = clamp(max(0.42, shadow_a * 0.72) * visibility_boost, 0, 1)
        neon_a_2 = clamp(max(0.24, shadow_a * 0.46) * visibility_boost, 0, 1)
        neon_a_3 = clamp(max(0.12, shadow_a * 0.26) * visibility_boost, 0, 1)

        shadow_css = ', '.join([
            f"0 0 {round(10 + 14 * ssz)}px {hsla(shadow_h, neon_s_core, neon_core_l + 10, neon_a_1)}",
            f"0 0 {round(22 + 30 * ssz)}px {hsla(shadow_h, neon_s, neon_core_l, neon_a_2)}",
            f"0 0 {round(42 + 58 * ssz)}px {hsla(shadow_h, neon_s_outer, neon_outer_l, neon_a_3)}",
        ])
    elif shadow_type == 'studio_depth':
        shadow_css = ', '.join([
            f"0 {shadow_y_1}px {round(10 + 12 * ssz)}px {dark_shadow_1}",
            f"0 {shadow_y_2}px {round(18 + 20 * ssz)}px -{spread_2}px {dark_shadow_2}",
            f"0 {shadow_y_3}px {round(28 + 38 * ssz)}px -{spread_3}px {dark_shadow_3}",
            *([] if subtle_rim == 'none' else [subtle_rim]),
        ])
    elif shadow_type == 'drop_shadow':
        shadow_css = ', '.join([
            f"0 {round(10 + 22 * ssz)}px {round(18 + 30 * ssz)}px {dark_shadow_2}",
            *([] if subtle_rim == 'none' else [f"0 0 {round(6 + 14 * ssz)}px {light_shadow_1}"]),
        ])
    elif shadow_type == 'soft_float':
        shadow_css = ', '.join([
            f"0 {round(6 + 10 * ssz)}px {round(12 + 14 * ssz)}px {dark_shadow_1}",
            f"0 {round(14 + 18 * ssz)}px {round(20 + 30 * ssz)}px -{round(2 + 4 * ssz)}px {dark_shadow_2}",
            *([] if subtle_rim == 'none' else [subtle_rim]),
        ])
    elif shadow_type == 'cinematic_depth':
        shadow_css = ', '.join([
            f"0 {round(18 + 20 * ssz)}px {round(22 + 22 * ssz)}px -{round(2 + 4 * ssz)}px {dark_shadow_2}",
            f"0 {round(36 + 30 * ssz)}px {round(48 + 42 * ssz)}px -{round(10 + 12 * ssz)}px {dark_shadow_3}",
            *([] if subtle_rim == 'none' else [f"0 0 {round(10 + 18 * ssz)}px {light_shadow_2}"]),
        ])
    else:
        shadow_css = ', '.join([
            f"0 {shadow_y_1}px {round(10 + 14 * ssz)}px {dark_shadow_1}",
            f"0 {shadow_y_2}px {round(18 + 22 * ssz)}px -{spread_2}px {dark_shadow_2}",
            f"0 0 {round(12 + 28 * ssz)}px {glow_color_1}",
        ])

    return border_css, border_effect_css, shadow_css, line, line_inner

def parse_hsl_like(value: str):
    m = re.match(r'hsla?\(([-\d.]+),\s*([\d.]+)%?,\s*([\d.]+)%?(?:,\s*([\d.]+))?\)', value.strip())
    if not m:
        return 0.0, 0.0, 0.0
    return float(m.group(1)), float(m.group(2)), float(m.group(3))

def compute_accent_offset(base_s: float, base_l: float, neutrality: float, accent_strength: float) -> float:
    sat_n = clamp(base_s, 0, 100) / 100.0
    light_n = clamp(base_l, 0, 100) / 100.0
    neutral_n = clamp(neutrality, 0, 100) / 100.0
    accent_n = clamp(accent_strength, 0, 100) / 100.0

    # More neutral bases (black/white/gray) can tolerate a stronger complementary shift.
    complement_bias = (1.0 - sat_n) * 0.90

    # Very dark and very light bases benefit from a bit more hue distance.
    dark_bias = clamp((0.22 - light_n) / 0.22, 0, 1) * 0.16
    light_bias = clamp((light_n - 0.78) / 0.22, 0, 1) * 0.10

    # Stronger accent intent and neutrality settings should push accent away from surfaces.
    intent_bias = accent_n * 0.08 + neutral_n * 0.06

    # Start from a gentle split-complementary offset and move toward complementary.
    offset = 34 + (complement_bias + dark_bias + light_bias + intent_bias) * 118
    return clamp(offset, 34, 152)

def build_override_surface(hex_value: str, alpha: float):
    h0, s0, l0 = hex_to_hsl(hex_value)
    return hsla(h0, s0, l0, alpha)

def build_override_color(hex_value: str):
    h0, s0, l0 = hex_to_hsl(hex_value)
    return hsl(h0, s0, l0)

def build(args):
    base_h, base_s, base_l = hex_to_hsl(args.base)
    contrast = clamp(float(args.contrast), 0, 100)
    hue_shift = float(args.hue_shift)
    saturation = clamp(float(args.saturation), -50, 50)
    tone = clamp(float(args.tone), -25, 25)
    accent_strength = clamp(float(args.accent_strength), 0, 100)
    neutrality = clamp(float(args.neutrality), 0, 100)
    card_opacity = clamp(float(args.card_opacity), 0, 100) / 100
    blur_strength = clamp(float(args.blur_strength), 0, 30)
    radius = clamp(float(args.radius), 0, 32)
    chip_radius = clamp(float(args.chip_radius), 0, 32)
    surface_lift = clamp(float(args.surface_lift), -30, 30)
    accent_hue_shift = float(getattr(args, 'accent_hue_shift', 0) or 0)
    accent_saturation_shift = clamp(float(getattr(args, 'accent_saturation', 0) or 0), -50, 50)
    card_bg_hue_shift = float(getattr(args, 'card_bg_hue_shift', 0) or 0)
    card_bg_saturation_shift = clamp(float(getattr(args, 'card_bg_saturation', 0) or 0), -50, 50)
    bubble_bg_hue_shift = float(getattr(args, 'bubble_bg_hue_shift', 0) or 0)
    bubble_bg_saturation_shift = clamp(float(getattr(args, 'bubble_bg_saturation', 0) or 0), -50, 50)
    popup_bg_hue_shift = float(getattr(args, 'popup_bg_hue_shift', 0) or 0)
    popup_bg_saturation_shift = clamp(float(getattr(args, 'popup_bg_saturation', 0) or 0), -50, 50)
    bubble_bg_opacity = clamp(float(getattr(args, 'bubble_bg_opacity', 92) or 92), 0, 100) / 100
    popup_bg_opacity = clamp(float(getattr(args, 'popup_bg_opacity', 92) or 92), 0, 100) / 100
    navbar_bg_opacity = clamp(float(getattr(args, 'navbar_bg_opacity', 95) or 95), 0, 100) / 100

    # Bubble slider has its own auto-adjustments.
    # Auto starts from the resolved Accent color, but is adjusted independently.
    bubble_slider_contrast = clamp(safe_float(getattr(args, 'bubble_slider_contrast', 0), 0), -100, 100)
    bubble_slider_hue_shift = safe_float(getattr(args, 'bubble_slider_hue_shift', 0), 0)
    bubble_slider_saturation_shift = clamp(safe_float(getattr(args, 'bubble_slider_saturation', 0), 0), -50, 50)
    bubble_slider_opacity = clamp(safe_float(getattr(args, 'bubble_slider_opacity', 100), 100), 0, 100) / 100

    border_type = (getattr(args, 'border_type', 'soft_hairline') or 'soft_hairline').strip()
    shadow_type = (getattr(args, 'shadow_type', 'glass_glow') or 'glass_glow').strip()
    bubble_use_fx = boolish(getattr(args, 'bubble_use_fx', 'on'))
    popup_use_fx = boolish(getattr(args, 'popup_use_fx', 'on'))

    border_contrast = clamp(safe_float(getattr(args, 'border_contrast', 0), 0), -100, 100)
    border_hue_shift = safe_float(getattr(args, 'border_hue_shift', 0), 0)
    border_saturation = clamp(safe_float(getattr(args, 'border_saturation', 0), 0), -50, 50)
    border_opacity = clamp(safe_float(getattr(args, 'border_opacity', 28), 28), 0, 100)
    border_size = clamp(safe_float(getattr(args, 'border_size', 4), 4), 0, 12)

    shadow_contrast = clamp(safe_float(getattr(args, 'shadow_contrast', 0), 0), -100, 100)
    shadow_hue_shift = safe_float(getattr(args, 'shadow_hue_shift', 0), 0)
    shadow_saturation = clamp(safe_float(getattr(args, 'shadow_saturation', 0), 0), -50, 50)
    shadow_opacity = clamp(safe_float(getattr(args, 'shadow_opacity', 42), 42), 0, 100)
    shadow_size = clamp(safe_float(getattr(args, 'shadow_size', 40), 40), 0, 100)

    is_very_dark_base = base_l <= 10
    is_dark_base = base_l <= 18

    surface_sat_mul = 0.28 if is_very_dark_base else 0.45 if is_dark_base else 1.0
    surface_sat_cap = 8 if is_very_dark_base else 12 if is_dark_base else 24

    card_sat_cap = 10 if is_very_dark_base else 14 if is_dark_base else 100
    bubble_sat_cap = 9 if is_very_dark_base else 13 if is_dark_base else 100
    popup_sat_cap = 9 if is_very_dark_base else 13 if is_dark_base else 100

    accent_hue_push = compute_accent_offset(base_s, base_l, neutrality, accent_strength)
    accent_separation = clamp((accent_hue_push - 34) / (152 - 34), 0, 1)
    accent_sat_boost = (18 if is_very_dark_base else 12 if is_dark_base else 0) + (6 * accent_separation)
    accent_light_boost = (10 if is_very_dark_base else 6 if is_dark_base else 0) + (4 * accent_separation)

    use_custom_bg = boolish(args.use_custom_background_color)
    custom_bg_hex = parse_hex(args.custom_background_color, '#344334')
    use_bg_image = boolish(args.use_background_image)
    bg_image_url = normalize_bg_url(args.background_image_url) if use_bg_image else ''
    overlay = (args.background_overlay or 'none').strip().lower()
    overlay_strength = clamp(float(args.background_overlay_strength), 1, 100)
    background_contrast = clamp(float(args.background_contrast), 0, 100)
    enable_header_blend = boolish(args.enable_header_blend)
    header_blend_height = clamp(float(args.header_blend_height), 80, 320)
    overlay_offset_y = clamp(float(args.overlay_offset_y), 0, 100)
    overlay_scale = clamp(float(args.overlay_scale), 50, 200)
    overlay_spread = clamp(float(args.overlay_spread), 50, 200)
    use_custom_text = boolish(args.use_custom_text_color)
    custom_text_hex = parse_hex(args.custom_text_color, '#f2f2f2')
    use_custom_icon = boolish(args.use_custom_icon_color)
    custom_icon_hex = parse_hex(args.custom_icon_color, '#e5e5e5')
    use_custom_nav_icon = boolish(args.use_custom_navbar_icon_color)
    custom_nav_icon_hex = parse_hex(args.custom_navbar_icon_color, '#ffffff')
    accent_contrast = clamp(float(args.accent_contrast), -100, 100)
    card_bg_contrast = clamp(float(args.card_bg_contrast), -100, 100)
    bubble_bg_contrast = clamp(float(args.bubble_bg_contrast), -100, 100)
    popup_bg_contrast = clamp(float(args.popup_bg_contrast), -100, 100)

    accent_h = wrap_h(base_h + hue_shift + accent_hue_shift + accent_hue_push)
    secondary_h = wrap_h(accent_h + (22 if accent_separation < 0.35 else 18 if accent_separation < 0.65 else 14))
    tertiary_h = wrap_h(accent_h - (46 if accent_separation < 0.35 else 58 if accent_separation < 0.65 else 72))
    surface_h = base_h

    surface_s = clamp(
        ((base_s * 0.22) + (saturation * 0.22) - (neutrality * 0.34) + 6) * surface_sat_mul,
        0,
        surface_sat_cap
    )
    surface_l = clamp(base_l + (tone * 0.55) + ((contrast - 58) * 0.22), 4, 96)
    surface_step = clamp(2.5 + (contrast * 0.08), 2, 14)

    accent_s = clamp(
        base_s + (saturation * 1.00) + accent_saturation_shift + (accent_strength * 0.42) - (neutrality * 0.28) + accent_sat_boost,
        18, 96
    )
    secondary_s = clamp(accent_s * 0.76, 16, 84)
    tertiary_s = clamp(accent_s * 0.70, 16, 80)

    accent_light_shift = accent_contrast * 0.12

    primary_l = clamp(base_l + 6 + (tone * 0.18) + accent_light_shift, 18, 88)
    secondary_l = clamp(base_l + 4 + (tone * 0.14) + (accent_light_shift * 0.82), 16, 84)
    tertiary_l = clamp(base_l + 5 + (tone * 0.12) + (accent_light_shift * 0.74), 16, 86)

    primary_container_l = clamp(surface_l + 12 + (accent_strength * 0.08) + (accent_contrast * 0.05), 10, 90)
    secondary_container_l = clamp(surface_l + 10 + (accent_strength * 0.07) + (accent_contrast * 0.04), 10, 88)
    tertiary_container_l = clamp(surface_l + 11 + (accent_strength * 0.07) + (accent_contrast * 0.04), 10, 89)

    primary_container_s = clamp(accent_s * (1 - neutrality / 140), 8, 80)
    secondary_container_s = clamp(secondary_s * (1 - neutrality / 150), 8, 74)
    tertiary_container_s = clamp(tertiary_s * (1 - neutrality / 150), 8, 72)

    primary = hsl(accent_h, accent_s, primary_l)
    secondary = hsl(secondary_h, secondary_s, secondary_l)
    tertiary = hsl(tertiary_h, tertiary_s, tertiary_l)
    primary_container = hsl(accent_h, primary_container_s, primary_container_l)
    secondary_container = hsl(secondary_h, secondary_container_s, secondary_container_l)
    tertiary_container = hsl(tertiary_h, tertiary_container_s, tertiary_container_l)

    # -------------------------------------------------
    # Theme surfaces styres ALTID af Base Color
    # Custom BG Override må kun ændre den synlige baggrund
    # -------------------------------------------------
    theme_surface_h = wrap_h(base_h + hue_shift)
    theme_surface_sat = surface_s
    theme_surface_base_l = surface_l

    theme_surface_bg_l = clamp(theme_surface_base_l + surface_lift, 2, 98)
    theme_surface_dim_l = clamp(theme_surface_base_l + surface_lift - 2, 2, 96)
    theme_surface_low_l = clamp(theme_surface_base_l + surface_lift + surface_step - 1.2, 2, 98)
    theme_surface_mid_l = clamp(theme_surface_base_l + surface_lift + surface_step + 1.4, 2, 98)
    theme_surface_high_l = clamp(theme_surface_base_l + surface_lift + surface_step + 4.4, 2, 98)
    theme_surface_highest_l = clamp(theme_surface_base_l + surface_lift + surface_step + 7.5, 2, 98)

    # Theme-derived surfaces
    theme_background = hsl(theme_surface_h, theme_surface_sat, theme_surface_bg_l)
    theme_background2 = hsl(theme_surface_h, theme_surface_sat, theme_surface_dim_l)
    surface_container_low = hsl(theme_surface_h, theme_surface_sat, theme_surface_low_l)
    surface_container = hsl(theme_surface_h, theme_surface_sat, theme_surface_mid_l)
    surface_container_high = hsl(theme_surface_h, theme_surface_sat, theme_surface_high_l)
    surface_container_highest = hsl(theme_surface_h, theme_surface_sat, theme_surface_highest_l)

    # Visible page background only
    if use_custom_bg:
        background = custom_bg_hex
        bg_h, bg_s, bg_l = hex_to_hsl(custom_bg_hex)
    else:
        background = theme_background
        bg_h, bg_s, bg_l = theme_surface_h, theme_surface_sat, theme_surface_bg_l

    # Keep secondary/theme surfaces based on Base Color
    background2 = theme_background2

    # Keep text/icon logic based on the visible background so light custom backgrounds stay readable
    background_l = bg_l
    navbar_bg_l = clamp(theme_surface_base_l + surface_lift + surface_step + 4.4, 4, 98)

    text = custom_text_hex if use_custom_text else text_on(background_l)
    secondary_text = rgba_text_on(background_l, 0.74)
    text_medium_light = rgba_text_on(background_l, 0.62)
    text_medium = rgba_text_on(background_l, 0.52)
    disabled_text = rgba_text_on(background_l, 0.38)
    outline = rgba_text_on(background_l, 0.18)

    navbar_bg = hsla(
        theme_surface_h,
        theme_surface_sat,
        clamp(theme_surface_base_l + surface_lift + surface_step + 4.4, 2, 98),
        navbar_bg_opacity
    )
    navbar_bg_override = (args.navbar_bg_override or 'auto').strip()
    if navbar_bg_override.lower() != 'auto':
        nv = parse_hex(navbar_bg_override, '#344334')
        nh, ns, nl = hex_to_hsl(nv)
        navbar_bg = hsla(nh, ns, nl, navbar_bg_opacity)
    icon_color = custom_icon_hex if use_custom_icon else rgba_text_on(background_l, 0.72)
    navbar_primary = custom_nav_icon_hex if use_custom_nav_icon else rgba_text_on(navbar_bg_l, 0.92)

    accent_override = (args.accent_color_override or 'auto').strip()
    card_bg_override = (args.card_bg_override or 'auto').strip()
    bubble_bg_override = (args.bubble_bg_override or 'auto').strip()
    popup_bg_override = (args.popup_bg_override or 'auto').strip()

    secondary_background_override = (args.secondary_background_color_override or 'auto').strip()
    secondary_text_override = (args.secondary_text_color_override or 'auto').strip()
    disabled_text_override = (args.disabled_text_color_override or 'auto').strip()
    app_header_background_override = (args.app_header_background_color_override or 'auto').strip()
    app_header_text_override = (args.app_header_text_color_override or 'auto').strip()
    divider_override = (args.divider_color_override or 'auto').strip()
    sidebar_icon_override = (args.sidebar_icon_color_override or 'auto').strip()
    state_icon_override = (args.state_icon_color_override or 'auto').strip()
    state_icon_active_override = (args.state_icon_active_color_override or 'auto').strip()

    primary_font_family = (args.primary_font_family or 'sans-serif').strip() or 'sans-serif'

    use_custom_font = boolish(args.use_custom_font)
    custom_font_family = (args.custom_font_family or '').strip()
    custom_font_path = (args.custom_font_path or '').strip()

    resolved_primary_font_family = (
        custom_font_family if use_custom_font and custom_font_family else primary_font_family
    )

    font_face_css = build_font_face_css(
        use_custom_font,
        custom_font_family,
        custom_font_path
    )

    card_h = wrap_h(theme_surface_h + card_bg_hue_shift)
    card_s = clamp(theme_surface_sat + card_bg_saturation_shift, 0, card_sat_cap)
    bubble_h = wrap_h(theme_surface_h + bubble_bg_hue_shift)
    bubble_s = clamp(theme_surface_sat + bubble_bg_saturation_shift, 0, bubble_sat_cap)
    popup_h = wrap_h(theme_surface_h + popup_bg_hue_shift)
    popup_s = clamp(theme_surface_sat + popup_bg_saturation_shift, 0, popup_sat_cap)

    default_accent = hsl(
        accent_h,
        clamp(accent_s + (accent_strength * 0.18), 18, 96),
        clamp(primary_l + accent_light_boost + (accent_strength * 0.06), 22, 90)
    )

    card_bg_l = clamp((theme_surface_base_l + surface_lift + surface_step + (1.0 if is_dark_base else 2.0)) + card_bg_contrast * 0.10, 2, 98)
    bubble_bg_l = clamp((theme_surface_base_l + surface_lift + surface_step + (0.2 if is_dark_base else 1.0)) + bubble_bg_contrast * 0.10, 2, 98)
    popup_bg_l = clamp((theme_surface_base_l + surface_lift + surface_step + (0.2 if is_dark_base else 1.0)) + popup_bg_contrast * 0.10, 2, 98)

    default_card_bg = hsla(
        theme_surface_h,
        theme_surface_sat,
        clamp(theme_surface_base_l + surface_lift + surface_step + 2.0, 2, 98),
        card_opacity
    )
    default_popup_bg = hsla(
        theme_surface_h,
        theme_surface_sat,
        clamp(theme_surface_base_l + surface_lift + surface_step + 1.0, 2, 98),
        min(card_opacity + 0.04, 1.0)
    )
    default_bubble_bg = default_popup_bg
    bubble_sub = hsla(
        theme_surface_h,
        theme_surface_sat,
        clamp(theme_surface_base_l + surface_lift + surface_step + 5.8 + (bubble_bg_contrast * 0.08), 2, 98),
        0.90
    )
    chip_bg = hsla(
        theme_surface_h,
        theme_surface_sat,
        clamp(theme_surface_base_l + surface_lift + surface_step + 5.8, 2, 98),
        min(card_opacity + 0.04, 1.0)
    )

    card_text_color = text_on(card_bg_l)
    bubble_text_color = text_on(bubble_bg_l)
    popup_text_color = text_on(popup_bg_l)
    font_label_color = rgba_text_on(background_l, 0.74)

    if card_bg_override.lower() != 'auto':
        cv = parse_hex(card_bg_override, '#344334')
        ha_card_bg = build_override_surface(cv, card_opacity)
    else:
        ha_card_bg = hsla(
            card_h,
            card_s,
            card_bg_l,
            card_opacity
        )

    if bubble_bg_override.lower() != 'auto':
        bv = parse_hex(bubble_bg_override, '#344334')
        bubble_bg = build_override_surface(bv, bubble_bg_opacity)
    else:
        # IMPORTANT:
        # Do not fall back to ha_card_bg here.
        # Bubble BG must follow the same base palette as Card BG,
        # but it must react to its own Contrast/Hue/Saturation/Opacity helpers.
        bubble_bg = hsla(
            bubble_h,
            bubble_s,
            bubble_bg_l,
            bubble_bg_opacity
        )

    if popup_bg_override.lower() != 'auto':
        pv = parse_hex(popup_bg_override, '#344334')
        popup_bg = build_override_surface(pv, popup_bg_opacity)
    else:
        popup_bg = hsla(
            popup_h,
            popup_s,
            popup_bg_l,
            popup_bg_opacity
        )

    border_css, border_effect_css, shadow_css, border_color_css, border_highlight_css = build_surface_fx(
        border_type=border_type,
        shadow_type=shadow_type,
        surface_h=theme_surface_h,
        surface_s=theme_surface_sat,
        surface_l=card_bg_l,
        backdrop_l=background_l,
        border_hue_shift=border_hue_shift,
        border_saturation=border_saturation,
        border_contrast=border_contrast,
        border_opacity=border_opacity,
        border_size=border_size,
        shadow_hue_shift=shadow_hue_shift,
        shadow_saturation=shadow_saturation,
        shadow_contrast=shadow_contrast,
        shadow_opacity=shadow_opacity,
        shadow_size=shadow_size,
    )

    def combine_shadow(*parts):
        usable = [p for p in parts if str(p).strip() and str(p).strip().lower() != 'none']
        return ', '.join(usable) if usable else 'none'

    card_shadow_css = combine_shadow(border_effect_css, shadow_css)

    bubble_ring_css = border_css_to_ring_shadow(border_css) if bubble_use_fx else 'none'
    bubble_border_css = 'none'
    bubble_border_effect_css = border_effect_css if border_type in {'double_line', 'glow_line'} else ('none' if border_type in {'soft_hairline', 'accent_line'} else border_effect_css)
    bubble_shadow_css = combine_shadow(bubble_ring_css, bubble_border_effect_css, shadow_css) if bubble_use_fx else 'none'

    popup_border_css = border_css if popup_use_fx else 'none'
    popup_shadow_css = card_shadow_css if popup_use_fx else 'none'

    bubble_fx_combined_css = bubble_shadow_css
    popup_fx_combined_css = popup_shadow_css


    if accent_override.lower() != 'auto':
        av = parse_hex(accent_override, '#88cc88')
        resolved_accent = build_override_color(av)
    else:
        resolved_accent = default_accent

    default_secondary_background = surface_container_low
    header_bg_l = clamp(theme_surface_base_l + surface_lift + 1.2, 2, 98)
    default_app_header_background = hsl(
        theme_surface_h,
        theme_surface_sat,
        header_bg_l
    )
    default_app_header_text = text_on(header_bg_l)
    default_divider = rgba_text_on(background_l, 0.14)
    default_sidebar_icon = rgba_text_on(background_l, 0.70)
    default_state_icon = rgba_text_on(background_l, 0.70)
    default_state_icon_active = resolved_accent

    if secondary_background_override.lower() != 'auto':
        sv = parse_hex(secondary_background_override, '#344334')
        sh, ss, sl = hex_to_hsl(sv)
        resolved_secondary_background = hsl(sh, ss, sl)
    else:
        resolved_secondary_background = default_secondary_background

    if secondary_text_override.lower() != 'auto':
        sv = parse_hex(secondary_text_override, '#c5c5c5')
        sh, ss, sl = hex_to_hsl(sv)
        resolved_secondary_text = hsl(sh, ss, sl)
    else:
        resolved_secondary_text = secondary_text

    if disabled_text_override.lower() != 'auto':
        sv = parse_hex(disabled_text_override, '#8a8a8a')
        sh, ss, sl = hex_to_hsl(sv)
        resolved_disabled_text = hsl(sh, ss, sl)
    else:
        resolved_disabled_text = disabled_text

    if app_header_background_override.lower() != 'auto':
        sv = parse_hex(app_header_background_override, '#344334')
        sh, ss, sl = hex_to_hsl(sv)
        resolved_app_header_background = hsl(sh, ss, sl)
    else:
        resolved_app_header_background = default_app_header_background

    if app_header_text_override.lower() != 'auto':
        sv = parse_hex(app_header_text_override, '#ffffff')
        sh, ss, sl = hex_to_hsl(sv)
        resolved_app_header_text = hsl(sh, ss, sl)
    else:
        resolved_app_header_text = default_app_header_text

    if divider_override.lower() != 'auto':
        sv = parse_hex(divider_override, '#444444')
        sh, ss, sl = hex_to_hsl(sv)
        resolved_divider = hsl(sh, ss, sl)
    else:
        resolved_divider = default_divider

    if sidebar_icon_override.lower() != 'auto':
        sv = parse_hex(sidebar_icon_override, '#aaaaaa')
        sh, ss, sl = hex_to_hsl(sv)
        resolved_sidebar_icon = hsl(sh, ss, sl)
    else:
        resolved_sidebar_icon = default_sidebar_icon

    if state_icon_override.lower() != 'auto':
        sv = parse_hex(state_icon_override, '#aaaaaa')
        sh, ss, sl = hex_to_hsl(sv)
        resolved_state_icon = hsl(sh, ss, sl)
    else:
        resolved_state_icon = default_state_icon

    if state_icon_active_override.lower() != 'auto':
        sv = parse_hex(state_icon_active_override, '#88cc88')
        sh, ss, sl = hex_to_hsl(sv)
        resolved_state_icon_active = hsl(sh, ss, sl)
    else:
        resolved_state_icon_active = default_state_icon_active

    bubble_slider_override = (args.bubble_slider_color_override or 'auto').strip()
    if bubble_slider_override.lower() != 'auto':
        bv = parse_hex(bubble_slider_override, '#888888')
        bh, bs, bl = hex_to_hsl(bv)
        bubble_slider_color = hsla(bh, bs, bl, bubble_slider_opacity)
    else:
        # Auto follows Accent as its source, but is adjustable independently.
        slider_h = wrap_h(accent_h + bubble_slider_hue_shift)
        slider_s = clamp(
            accent_s + bubble_slider_saturation_shift * (1.65 if bubble_slider_saturation_shift < 0 else 1.25),
            0,
            100
        )
        slider_l = clamp(
            primary_l + accent_light_boost + (accent_strength * 0.06) + bubble_slider_contrast * 0.12,
            8,
            94
        )
        bubble_slider_color = hsla(slider_h, slider_s, slider_l, bubble_slider_opacity)

    alarm_armed = hsl(accent_h + 4, clamp(accent_s * 0.58, 18, 72), clamp(primary_container_l + 4, 20, 46))
    alarm_night = hsl(accent_h + 28, clamp(accent_s * 0.55, 18, 72), clamp(secondary_container_l + 5, 20, 48))
    alarm_disarmed = hsl(accent_h + 96, clamp(accent_s * 0.52, 18, 70), clamp(tertiary_container_l + 5, 22, 50))

    bg_image_css = css_url(bg_image_url) if bg_image_url else 'none'

    bg_overlay_css_preview = overlay_css(
        background,
        overlay,
        accent_h,
        theme_surface_sat,
        overlay_strength,
        overlay_offset_y,
        overlay_scale,
        overlay_spread
    )

    bg_overlay_css = bg_overlay_css_preview

    if enable_header_blend and bg_overlay_css != 'none':
        header_fade_px = round(header_blend_height + 200)
        bg_overlay_css = (
            f"linear-gradient(180deg, "
            f"{hsl(bg_h, bg_s, bg_l)} 0px, "
            f"{hsl(bg_h, bg_s, bg_l)} {round(header_fade_px * 0.34)}px, "
            f"{hsla(bg_h, bg_s, bg_l, 0.96)} {round(header_fade_px * 0.58)}px, "
            f"{hsla(bg_h, bg_s, bg_l, 0.00)} {header_fade_px}px), "
            f"{bg_overlay_css}"
        )

    bg_scrim_css = background_scrim(background, 100 - background_contrast) if bg_image_css != 'none' else 'none'

    card_mod_root = font_face_css + f"""
ha-card:not(.theme-studio-no-fx) {{
  border-radius: {round(radius)}px !important;
  --ha-card-border-radius: {round(radius)}px !important;
  overflow: hidden;
  border: var(--theme-studio-card-border-css, none) !important;
  box-shadow: var(--theme-studio-card-shadow-css, none) !important;
}}

ha-card.theme-studio-no-fx {{
  border: none !important;
  box-shadow: none !important;
}}

button-card,
.button-card-main,
button-card > * {{
  border-radius: {round(chip_radius)}px !important;
}}
""" + """
@media only screen and (max-width: 768px) {
  .header {
    display: none;
    opacity: 0;
  }

  #view {
    padding-top: 0 !important;
    margin-top: 0 !important;
    min-height: calc(100vh - env(safe-area-inset-top)) !important;
  }
}

#root {
  --masonry-view-card-margin: 0px 0px 0px;
}

#root > hui-card[hidden],
#root > hui-vertical-stack-card[hidden] {
  margin: 0 !important;
}

home-assistant,
home-assistant-main,
ha-app-layout,
app-drawer-layout,
partial-panel-resolver,
ha-panel-lovelace,
hui-root,
hui-view,
grid-layout,
.view,
#root,
hui-card {
  --lovelace-background: transparent !important;
  background: transparent !important;
  background-color: transparent !important;
}

.background {
  position: fixed !important;
  inset: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  height: 100dvh !important;
  background-position: center top !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  pointer-events: none !important;
  z-index: 0 !important;
}

#view {
  --lovelace-background: transparent !important;
  position: relative;
  min-height: 100vh !important;
  min-height: 100dvh !important;
  background: transparent !important;
  background-color: transparent !important;
  z-index: 1 !important;
}
""".strip() + "\n"

    vals = {
        'primary-font-family': resolved_primary_font_family,
	'ha-font-family-body': 'var(--primary-font-family)',
        'paper-font-common-base_-_font-family': 'var(--primary-font-family)',
        'paper-font-common-code_-_font-family': 'var(--primary-font-family)',
        'paper-font-body1_-_font-family': 'var(--primary-font-family)',
        'paper-font-subhead_-_font-family': 'var(--primary-font-family)',
        'paper-font-headline_-_font-family': 'var(--primary-font-family)',
        'paper-font-caption_-_font-family': 'var(--primary-font-family)',
        'paper-font-title_-_font-family': 'var(--primary-font-family)',
        'ha-card-header-font-family': 'var(--primary-font-family)',
        'text-color': text,
        'primary-text-color': 'var(--text-color)',
        'text-primary-color': 'var(--text-color)',
        'sidebar-text-color': 'var(--text-color)',
        'pbs-button-color': 'var(--text-color)',
        'pbs-button-rgb-color': 'var(--text-color)',
        'pbs-button-rgb-state-color': 'var(--text-color)',
        'pbs-button-rgb-default-color': 'var(--text-color)',
        'rgb-state-default-color': 'var(--text-color)',
        'pbs-button-rgb-fallback': 'var(--text-color)',
        'secondary-text-color': resolved_secondary_text,
        'text-medium-light-color': text_medium_light,
        'text-medium-color': text_medium,
        'disabled-text-color': resolved_disabled_text,
        'primary-color': 'var(--accent-color)',
        'mdc-text-field-fill-color': 'var(--ha-card-background)',
        'mdc-text-field-ink-color': 'var(--primary-text-color)',
        'mdc-select-fill-color': 'var(--ha-card-background)',
        'mdc-text-field-label-ink-color': 'var(--secondary-text-color)',
        'input-background-color': 'var(--ha-card-background)',
        'ha-color-form-background': 'var(--ha-card-background)',
        'ha-color-form-background-hover': 'color-mix(in srgb, var(--primary-text-color) 8%, var(--ha-card-background))',
        'input-fill-color': 'var(--ha-card-background)',
        'input-ink-color': 'var(--primary-text-color)',
        'input-label-ink-color': 'var(--secondary-text-color)',
        'input-disabled-fill-color': 'color-mix(in srgb, var(--ha-card-background) 70%, transparent)',
        'input-disabled-ink-color': 'var(--disabled-text-color)',
        'input-disabled-label-ink-color': 'var(--disabled-text-color)',
        'input-idle-line-color': 'color-mix(in srgb, var(--secondary-text-color) 28%, transparent)',
        'input-dropdown-icon-color': 'var(--secondary-text-color)',
        'input-hover-line-color': 'var(--primary-color)',
        'code-editor-background-color': background2,
        'codemirror-property': 'var(--accent-color)',
        'app-header-background-color': resolved_app_header_background,
        'app-header-text-color': resolved_app_header_text,
        'header-height': '48px',
        'accent-color': resolved_accent,
        'accent-medium-color': 'var(--accent-color)',
        'background-color': background,
        'primary-background-color': 'var(--background-color)',
        'background-color-2': background2,
        'secondary-background-color': resolved_secondary_background,
        'markdown-code-background-color': 'var(--background-color)',
        'theme-studio-navbar-background-color': navbar_bg,
        'theme-studio-navbar-primary-color': navbar_primary,
        'card-background-color': 'var(--ha-card-background)',
        'ha-card-background': ha_card_bg,
        'ha-card-box-shadow': 'var(--theme-studio-card-shadow-css)',
        'ha-card-border-radius': f'{round(radius)}px',
        'ha-card-border-style': 'none !important',
        'ha-card-border-width': 'none !important',
        'ha-card-border-color': 'none !important',
        'border-color': 'none',
        'grid-card-gap': '14px',
        'border-style': 'none !important',
        'paper-item-icon-color': resolved_state_icon,
        'paper-item-icon-active-color': resolved_state_icon_active,
        'state-icon-color': resolved_state_icon,
        'state-icon-active-color': resolved_state_icon_active,
        'sidebar-background-color': 'var(--background-color)',
        'sidebar-icon-color': resolved_sidebar_icon,
        'sidebar-selected-icon-color': resolved_state_icon_active,
        'sidebar-selected-text-color': 'var(--text-color)',
        'paper-listbox-background-color': 'var(--sidebar-background-color)',
        'divider-color': resolved_divider,
        'light-primary-color': 'var(--ha-card-background)',
        'paper-slider-knob-color': 'var(--accent-color)',
        'paper-slider-pin-color': 'var(--background-color-2)',
        'paper-slider-active-color': bubble_slider_color,
        'paper-slider-container-color': 'var(--background-color-2)',
        'paper-toggle-button-checked-bar-color': 'var(--accent-color)',
        'mdc-theme-primary': 'var(--accent-color)',
        'switch-unchecked-color': text_medium,
        'switch-checked-button-color': 'var(--accent-color)',
        'switch-unchecked-track-color': 'var(--background-color-2)',
        'switch-checked-track-color': 'var(--background-color-2)',
        'paper-radio-button-checked-color': 'var(--accent-color)',
        'more-info-header-background': 'var(--secondary-background-color)',
        'paper-dialog-background-color': 'var(--background-color)',
        'table-row-background-color': 'var(--background-color)',
        'table-row-alternative-background-color': 'var(--ha-card-background)',
        'label-badge-background-color': 'var(--background-color)',
        'label-badge-text-color': 'var(--text-primary-color)',
        'label-badge-red': alarm_armed,
        'label-badge-blue': alarm_night,
        'label-badge-green': alarm_disarmed,
        'label-badge-yellow': tertiary,
        'paper-input-container-focus-color': 'var(--accent-color)',
        'ha-textfield-fill-color': 'var(--ha-card-background)',
        'ha-textfield-input-text-color': 'var(--primary-text-color)',
        'ha-textfield-text-color': 'var(--primary-text-color)',
        'ha-textfield-label-text-color': resolved_secondary_text,
        'ha-textfield-caret-color': 'var(--accent-color)',
        'ha-selector-fill-color': 'var(--ha-card-background)',
        'input-background-color': 'var(--ha-card-background)',
        'ha-color-form-background': 'var(--ha-card-background)',
        'ha-color-form-background-hover': 'color-mix(in srgb, var(--primary-text-color) 8%, var(--ha-card-background))',
        'md-filled-field-container-color': 'var(--ha-card-background)',
        'md-filled-field-label-text-color': resolved_secondary_text,
        'md-filled-field-input-text-color': 'var(--primary-text-color)',
        'md-filled-field-focus-label-text-color': 'var(--accent-color)',
        'md-filled-field-caret-color': 'var(--accent-color)',
        'md-filled-text-field-container-color': 'var(--ha-card-background)',
        'md-filled-text-field-label-text-color': resolved_secondary_text,
        'md-filled-text-field-input-text-color': 'var(--primary-text-color)',
        'md-filled-text-field-focus-label-text-color': 'var(--accent-color)',
        'md-filled-text-field-caret-color': 'var(--accent-color)',
        'md-outlined-field-label-text-color': resolved_secondary_text,
        'md-outlined-field-input-text-color': 'var(--primary-text-color)',
        'md-outlined-field-focus-label-text-color': 'var(--accent-color)',
        'mdc-theme-surface': 'var(--ha-card-background)',
        'mdc-theme-on-surface': 'var(--primary-text-color)',
        'mdc-select-fill-color': 'var(--ha-card-background)',
        'mdc-select-ink-color': 'var(--primary-text-color)',
        'mdc-select-label-ink-color': resolved_secondary_text,
        'mdc-select-idle-line-color': 'color-mix(in srgb, var(--secondary-text-color) 28%, transparent)',
        'mdc-select-hover-line-color': 'var(--accent-color)',
        'mdc-select-dropdown-icon-color': resolved_secondary_text,
        'mdc-text-field-fill-color': 'var(--ha-card-background)',
        'mdc-text-field-ink-color': 'var(--primary-text-color)',
        'mdc-text-field-label-ink-color': resolved_secondary_text,
        'mdc-text-field-idle-line-color': 'color-mix(in srgb, var(--secondary-text-color) 28%, transparent)',
        'mdc-text-field-hover-line-color': 'var(--accent-color)',
        'text-field-fill-color': 'var(--ha-card-background)',
        'text-field-ink-color': 'var(--primary-text-color)',
        'text-field-label-ink-color': resolved_secondary_text,
        'input-fill-color': 'var(--ha-card-background)',
        'input-ink-color': 'var(--primary-text-color)',
        'input-label-ink-color': resolved_secondary_text,
        'ch-background': 'var(--background-color)',
        'ch-active-tab-color': 'var(--accent-color)',
        'ch-notification-dot-color': 'var(--accent-color)',
        'ch-all-tabs-color': 'var(--sidebar-icon-color)',
        'ch-tab-indicator-color': 'var(--accent-color)',
        'mini-media-player-base-color': 'var(--text-color)',
        'mini-media-player-accent-color': 'var(--accent-color)',
        'alarm-color-armed': alarm_armed,
        'alarm-color-disarmed': alarm_disarmed,
        'alarm-color-night': alarm_night,
        'card-mod-theme': THEME_NAME,
	'theme-studio-signature': THEME_NAME.lower().replace(' ', '-'),
        'card-mod-root-yaml': card_mod_root,
        'card-mod-more-info-yaml': "$: |\n  .mdc-dialog .mdc-dialog__scrim,\n  ha-dialog .mdc-dialog__scrim,\n  md-dialog::part(scrim) {\n    backdrop-filter: blur(15px);\n    -webkit-backdrop-filter: blur(15px);\n    background: rgba(0,0,0,.6);\n  }\n  .mdc-dialog .mdc-dialog__container .mdc-dialog__surface,\n  ha-dialog .mdc-dialog__surface,\n  md-dialog {\n    box-shadow: none !important;\n    border-radius: var(--ha-card-border-radius);\n    background: var(--ha-card-background) !important;\n    color: var(--primary-text-color) !important;\n    --mdc-theme-surface: var(--ha-card-background);\n    --mdc-theme-on-surface: var(--primary-text-color);\n    --mdc-dialog-content-ink-color: var(--primary-text-color);\n    --mdc-dialog-heading-ink-color: var(--primary-text-color);\n    --mdc-text-button-label-text-color: var(--accent-color);\n    --md-sys-color-surface: var(--ha-card-background);\n    --md-sys-color-on-surface: var(--primary-text-color);\n    --md-sys-color-primary: var(--accent-color);\n  }\n  .mdc-dialog__title,\n  .mdc-dialog__content,\n  .mdc-dialog__button,\n  .mdc-button,\n  .mdc-button__label,\n  ha-dialog *,\n  md-dialog * {\n    color: var(--primary-text-color) !important;\n  }\n.: |\n  :host {\n    --ha-card-box-shadow: none;\n  }\n",
        'card-mod-view-yaml': "hui-sidebar-view:\n  $: |\n    @media only screen and (min-width: 768px) {\n        .container {\n          max-width: 520px;\n          margin: auto !important;\n          width: -webkit-fill-available;\n        }\n    }\n    #wrapper: |\n      $: |\n        #progressContainer {\n            border-radius: 14px !important;\n    }\n  .: |\n    \"#view>hui-view>hui-sidebar-view$#main>hui-card-options:nth-child(7)>vertical-stack-in-card$ha-card>div>hui-horizontal-stack-card$#root>hui-grid-card$#root>hui-entities-card$#states>div:nth-child(4)>slider-entity-row$div>ha-slider$#sliderBar$#progressContainer\" {\n        border-radius: 14px !important;\n    }\n",
        'card-mod-card': 'ha-card {\n  transition: none;\n  border-style: none !important\n}',
        'md-sys-color-primary': 'var(--accent-color)',
        'md-sys-color-on-primary': text_on(primary_l),
        'md-sys-color-primary-container': primary_container,
        'md-sys-color-on-primary-container': text_on(primary_container_l),
        'md-sys-color-secondary': secondary,
        'md-sys-color-on-secondary': '#ffffff',
        'md-sys-color-secondary-container': secondary_container,
        'md-sys-color-on-secondary-container': '#ffffff',
        'md-sys-color-tertiary': tertiary,
        'md-sys-color-on-tertiary': text_on(tertiary_l),
        'md-sys-color-tertiary-container': tertiary_container,
        'md-sys-color-on-tertiary-container': '#ffffff',
        'md-sys-color-surface': background,
        'md-sys-color-surface-dim': background2,
        'md-sys-color-surface-bright': hsl(
            theme_surface_h,
            theme_surface_sat,
            clamp(theme_surface_base_l + surface_lift + 10, 2, 98)
        ),        'md-sys-color-surface-container-low': surface_container_low,
        'md-sys-color-surface-container': surface_container,
        'md-sys-color-surface-container-high': surface_container_high,
        'md-sys-color-surface-container-highest': surface_container_highest,
        'md-sys-color-on-surface': text,
        'md-sys-color-on-surface-variant': secondary_text,
        'md-sys-color-outline': outline,
        'md-sys-color-inverse-surface': hsl(accent_h, surface_s, clamp(94 - surface_l * 0.15, 86, 98)),
        'md-sys-color-inverse-on-surface': background,
        'md-sys-color-inverse-primary': 'var(--accent-color)',
        'icon-primary-color': 'var(--state-icon-color)',
        'icon-secondary-color': 'var(--state-icon-active-color)',
        'my-card-blur': f'{round(blur_strength)}px',
        'my-card-opacity': f'{card_opacity:.2f}',
        'my-chip-radius': f'{round(chip_radius)}px',
        'my-navbar-bg': navbar_bg,
        'my-glass-bg': hsla(accent_h, surface_s, surface_l + surface_step + 2.2, min(card_opacity + 0.04, 1.0)),
        'my-chip-bg': chip_bg,
        'd1nnsen-bubble-bg-color': bubble_bg,
        'd1nnsen-bubble-sub-button-bg': bubble_sub,
        'd1nnsen-bubble-accent-color': bubble_slider_color,
        'd1nnsen-bubble-text-color': bubble_text_color,
        'd1nnsen-card-text-color': card_text_color,
        'd1nnsen-popup-text-color': popup_text_color,
        'd1nnsen-font-label-color': font_label_color,
        'd1nnsen-popup-bg-color': popup_bg,
        'd1nnsen-header-fade-color': background,
        'd1nnsen-soft-bg-color': surface_container_high,
        'd1nnsen-panel-bg': background2,
        'd1nnsen-muted-icon-color': resolved_secondary_text,
        'theme-studio-border-type': border_type,
        'theme-studio-shadow-type': shadow_type,
        'theme-studio-border-css': border_css,
        'theme-studio-card-border-css': border_css,
        'theme-studio-shadow-css': card_shadow_css,
        'theme-studio-card-shadow-css': card_shadow_css,
        'theme-studio-bubble-border-css': bubble_border_css,
        'theme-studio-bubble-shadow-css': bubble_shadow_css,
        'theme-studio-popup-border-css': popup_border_css,
        'theme-studio-popup-shadow-css': popup_shadow_css,
        'theme-studio-border-effect-css': border_effect_css,
        'theme-studio-border-color': border_color_css,
        'theme-studio-border-highlight': border_highlight_css,
        'theme-studio-background-image': bg_image_css,
        'theme-studio-background-scrim': bg_scrim_css,
        'theme-studio-background-overlay': bg_overlay_css,
        'theme-studio-background-overlay-preview': bg_overlay_css_preview,
        'd1nnsen-background-image': 'var(--theme-studio-background-image)',
        'd1nnsen-background-scrim': 'var(--theme-studio-background-scrim)',
        'd1nnsen-background-overlay': 'var(--theme-studio-background-overlay)',
        'theme-studio-overlay-name': overlay,
        'theme-studio-overlay-contrast': f'{round(overlay_strength)}',
        'theme-studio-background-contrast': f'{round(background_contrast)}',
        'theme-studio-background-image-url': bg_image_url if bg_image_url else 'none',
        'theme-studio-header-blend-enabled': '1' if enable_header_blend else '0',
        'theme-studio-header-blend-height': f'{round(header_blend_height)}px',
        'theme-studio-overlay-offset-y': f'{round(overlay_offset_y)}',
        'theme-studio-overlay-scale': f'{round(overlay_scale)}',
        'theme-studio-overlay-spread': f'{round(overlay_spread)}',
	'lovelace-background': (
   	    "center top / cover no-repeat fixed var(--theme-studio-background-overlay), "
	    "center top / cover no-repeat fixed var(--theme-studio-background-scrim), "
	    "center top / cover no-repeat fixed var(--theme-studio-background-image)"
	),
        'bubble-main-background-color': bubble_bg,
        'bubble-border-css': bubble_border_css,
        'bubble-shadow-css': bubble_shadow_css,
        'bubble-button-main-background-color': bubble_bg,
        'bubble-main-box-shadow': bubble_fx_combined_css,
        'bubble-box-shadow': bubble_fx_combined_css,
        'bubble-main-border': bubble_border_css,
        'bubble-border': bubble_border_css,
        'bubble-select-main-background-color': bubble_bg,
        'bubble-climate-main-background-color': bubble_bg,
        'bubble-sub-button-background-color': bubble_sub,
	'bubble-accent-color': bubble_slider_color,
        'bubble-slider-main-background-color': bubble_slider_color,
        'bubble-pop-up-main-background-color': popup_bg,
        'bubble-pop-up-box-shadow': popup_fx_combined_css,
        'bubble-pop-up-border': popup_border_css,
        'bubble-popup-border-css': popup_border_css,
        'bubble-popup-shadow-css': popup_shadow_css,
        'bubble-pop-up-background-color': popup_bg,
    }
    return vals

def emit_value(key, value, indent=2):
    prefix = ' ' * indent
    if '\n' in str(value):
        indented = '\n'.join((' ' * (indent + 2)) + line for line in str(value).splitlines())
        return f'{prefix}{key}: |\n{indented}\n'
    escaped = str(value).replace('"', '\\"')
    return f'{prefix}{key}: "{escaped}"\n'

SETTING_KEYS = ['base_color', 'custom_background_color', 'background_image_url', 'custom_text_color', 'custom_icon_color', 'custom_navbar_icon_color', 'navbar_bg_override', 'bubble_slider_color_override', 'bubble_slider_contrast', 'bubble_slider_hue_shift', 'bubble_slider_saturation', 'bubble_slider_opacity', 'accent_color_override', 'card_bg_override', 'bubble_bg_override', 'popup_bg_override', 'secondary_background_color_override', 'secondary_text_color_override', 'disabled_text_color_override', 'app_header_background_color_override', 'app_header_text_color_override', 'divider_color_override', 'sidebar_icon_color_override', 'state_icon_color_override', 'state_icon_active_color_override', 'primary_font_family', 'custom_font_family', 'custom_font_path', 'contrast', 'hue_shift', 'saturation', 'tone', 'accent_strength', 'neutrality', 'surface_lift', 'card_opacity', 'blur_strength', 'radius', 'chip_radius', 'overlay_contrast', 'background_contrast', 'header_blend_height', 'overlay_offset_y', 'overlay_scale', 'overlay_spread', 'accent_contrast', 'card_bg_contrast', 'bubble_bg_contrast', 'popup_bg_contrast', 'accent_hue_shift', 'accent_saturation', 'card_bg_hue_shift', 'card_bg_saturation', 'bubble_bg_hue_shift', 'bubble_bg_saturation', 'popup_bg_hue_shift', 'popup_bg_saturation', 'bubble_bg_opacity', 'popup_bg_opacity', 'navbar_bg_opacity', 'use_custom_background_color', 'use_background_image', 'enable_header_blend', 'use_custom_text_color', 'use_custom_icon_color', 'use_custom_navbar_icon_color', 'preview_toggle', 'use_custom_font', 'background_overlay', 'preview_mode']

def slugify(name: str) -> str:
    name = (name or '').strip().lower()
    name = re.sub(r'[^a-z0-9]+', '_', name).strip('_')
    return name or 'theme_studio_theme'

RESERVED_PRESETS = {slugify(name) for name in BUILTIN_PRESET_NAMES}
USER_THEME_DIR = '/config/theme_studio/user_themes'

def namespace_from_settings(settings: dict, output_path: str):
    values = {}
    for key in SETTING_KEYS:
        values[key] = settings.get(key, '')

    mapped = {
        'base': settings.get('base_color', values.get('base_color', '')),
        'custom_background_color': settings.get('custom_background_color', values.get('custom_background_color', '')),
        'background_image_url': settings.get('background_image_url', values.get('background_image_url', '')),
        'custom_text_color': settings.get('custom_text_color', values.get('custom_text_color', '')),
        'custom_icon_color': settings.get('custom_icon_color', values.get('custom_icon_color', '')),
        'custom_navbar_icon_color': settings.get('custom_navbar_icon_color', values.get('custom_navbar_icon_color', '')),
        'navbar_bg_override': settings.get('navbar_bg_override', values.get('navbar_bg_override', '')),
        'navbar_bg_opacity': settings.get('navbar_bg_opacity', values.get('navbar_bg_opacity', '')),
        'bubble_slider_color_override': settings.get('bubble_slider_color_override', values.get('bubble_slider_color_override', '')),
        'bubble_slider_contrast': settings.get('bubble_slider_contrast', values.get('bubble_slider_contrast', '')),
        'bubble_slider_hue_shift': settings.get('bubble_slider_hue_shift', values.get('bubble_slider_hue_shift', '')),
        'bubble_slider_saturation': settings.get('bubble_slider_saturation', values.get('bubble_slider_saturation', '')),
        'bubble_slider_opacity': settings.get('bubble_slider_opacity', values.get('bubble_slider_opacity', '')),
        'accent_color_override': settings.get('accent_color_override', values.get('accent_color_override', '')),
        'card_bg_override': settings.get('card_bg_override', values.get('card_bg_override', '')),
        'bubble_bg_override': settings.get('bubble_bg_override', values.get('bubble_bg_override', '')),
        'popup_bg_override': settings.get('popup_bg_override', values.get('popup_bg_override', '')),
        'secondary_background_color_override': settings.get('secondary_background_color_override', values.get('secondary_background_color_override', '')),
        'secondary_text_color_override': settings.get('secondary_text_color_override', values.get('secondary_text_color_override', '')),
        'disabled_text_color_override': settings.get('disabled_text_color_override', values.get('disabled_text_color_override', '')),
        'app_header_background_color_override': settings.get('app_header_background_color_override', values.get('app_header_background_color_override', '')),
        'app_header_text_color_override': settings.get('app_header_text_color_override', values.get('app_header_text_color_override', '')),
        'divider_color_override': settings.get('divider_color_override', values.get('divider_color_override', '')),
        'sidebar_icon_color_override': settings.get('sidebar_icon_color_override', values.get('sidebar_icon_color_override', '')),
        'state_icon_color_override': settings.get('state_icon_color_override', values.get('state_icon_color_override', '')),
        'state_icon_active_color_override': settings.get('state_icon_active_color_override', values.get('state_icon_active_color_override', '')),
        'primary_font_family': settings.get('primary_font_family', values.get('primary_font_family', '')),
        'custom_font_family': settings.get('custom_font_family', values.get('custom_font_family', '')),
        'custom_font_path': settings.get('custom_font_path', values.get('custom_font_path', '')),
        'contrast': settings.get('contrast', values.get('contrast', '')),
        'hue_shift': settings.get('hue_shift', values.get('hue_shift', '')),
        'saturation': settings.get('saturation', values.get('saturation', '')),
        'tone': settings.get('tone', values.get('tone', '')),
        'accent_strength': settings.get('accent_strength', values.get('accent_strength', '')),
        'neutrality': settings.get('neutrality', values.get('neutrality', '')),
        'card_opacity': settings.get('card_opacity', values.get('card_opacity', '')),
        'blur_strength': settings.get('blur_strength', values.get('blur_strength', '')),
        'radius': settings.get('radius', values.get('radius', '')),
        'chip_radius': settings.get('chip_radius', values.get('chip_radius', '')),
        'background_overlay_strength': settings.get('overlay_contrast', values.get('overlay_contrast', '')),
        'background_contrast': settings.get('background_contrast', values.get('background_contrast', '')),
        'header_blend_height': settings.get('header_blend_height', values.get('header_blend_height', '')),
        'overlay_offset_y': settings.get('overlay_offset_y', values.get('overlay_offset_y', '')),
        'overlay_scale': settings.get('overlay_scale', values.get('overlay_scale', '')),
        'overlay_spread': settings.get('overlay_spread', values.get('overlay_spread', '')),
        'accent_contrast': settings.get('accent_contrast', values.get('accent_contrast', '')),
        'card_bg_contrast': settings.get('card_bg_contrast', values.get('card_bg_contrast', '')),
        'bubble_bg_contrast': settings.get('bubble_bg_contrast', values.get('bubble_bg_contrast', '')),
        'popup_bg_contrast': settings.get('popup_bg_contrast', values.get('popup_bg_contrast', '')),
        'surface_lift': settings.get('surface_lift', values.get('surface_lift', '')),
        'accent_hue_shift': settings.get('accent_hue_shift', values.get('accent_hue_shift', '')),
        'accent_saturation': settings.get('accent_saturation', values.get('accent_saturation', '')),
        'card_bg_hue_shift': settings.get('card_bg_hue_shift', values.get('card_bg_hue_shift', '')),
        'card_bg_saturation': settings.get('card_bg_saturation', values.get('card_bg_saturation', '')),
        'bubble_bg_hue_shift': settings.get('bubble_bg_hue_shift', values.get('bubble_bg_hue_shift', '')),
        'bubble_bg_saturation': settings.get('bubble_bg_saturation', values.get('bubble_bg_saturation', '')),
        'popup_bg_hue_shift': settings.get('popup_bg_hue_shift', values.get('popup_bg_hue_shift', '')),
        'popup_bg_saturation': settings.get('popup_bg_saturation', values.get('popup_bg_saturation', '')),
        'bubble_bg_opacity': settings.get('bubble_bg_opacity', values.get('bubble_bg_opacity', '')),
        'popup_bg_opacity': settings.get('popup_bg_opacity', values.get('popup_bg_opacity', '')),
        'use_custom_background_color': settings.get('use_custom_background_color', values.get('use_custom_background_color', '')),
        'use_background_image': settings.get('use_background_image', values.get('use_background_image', '')),
        'enable_header_blend': settings.get('enable_header_blend', values.get('enable_header_blend', '')),
        'use_custom_text_color': settings.get('use_custom_text_color', values.get('use_custom_text_color', '')),
        'use_custom_icon_color': settings.get('use_custom_icon_color', values.get('use_custom_icon_color', '')),
        'use_custom_navbar_icon_color': settings.get('use_custom_navbar_icon_color', values.get('use_custom_navbar_icon_color', '')),
        'use_custom_font': settings.get('use_custom_font', values.get('use_custom_font', '')),
        'background_overlay': settings.get('background_overlay', values.get('background_overlay', '')),
        'border_type': settings.get('border_type', values.get('border_type', 'soft_hairline')),
        'shadow_type': settings.get('shadow_type', values.get('shadow_type', 'glass_glow')),
        'bubble_use_fx': settings.get('bubble_use_fx', values.get('bubble_use_fx', 'on')),
        'popup_use_fx': settings.get('popup_use_fx', values.get('popup_use_fx', 'on')),
        'border_contrast': settings.get('border_contrast', values.get('border_contrast', '0')),
        'border_hue_shift': settings.get('border_hue_shift', values.get('border_hue_shift', '0')),
        'border_saturation': settings.get('border_saturation', values.get('border_saturation', '0')),
        'border_opacity': settings.get('border_opacity', values.get('border_opacity', '28')),
        'border_size': settings.get('border_size', values.get('border_size', '4')),
        'shadow_contrast': settings.get('shadow_contrast', values.get('shadow_contrast', '0')),
        'shadow_hue_shift': settings.get('shadow_hue_shift', values.get('shadow_hue_shift', '0')),
        'shadow_saturation': settings.get('shadow_saturation', values.get('shadow_saturation', '0')),
        'shadow_opacity': settings.get('shadow_opacity', values.get('shadow_opacity', '42')),
        'shadow_size': settings.get('shadow_size', values.get('shadow_size', '40')),
        'output': output_path,
    }
    return argparse.Namespace(**mapped)

def write_theme_yaml(theme_name: str, modes: dict, output_path: str):
    out = [f"{theme_name}:\n", "  modes:\n"]
    for mode_name, vals in modes.items():
        out.append(f"    {mode_name}:\n")
        for k, v in vals.items():
            out.append(emit_value(k, v, indent=6))
    p = Path(output_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(''.join(out), encoding='utf-8')

def cmd_live(args):
    vals = build(args)
    out = [f"{THEME_NAME}:\n"]
    for k, v in vals.items():
        out.append(emit_value(k, v))
    p = Path(args.output)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(''.join(out), encoding='utf-8')

def cmd_save_preset(args):
    payload = json.loads(args.payload)
    name = (payload.get('name') or 'My Theme').strip()
    slug = slugify(name)

    if slug in RESERVED_PRESETS:
        print(json.dumps({'ok': False, 'reason': 'reserved'}))
        return

    user_dir = Path(USER_THEME_DIR)
    user_dir.mkdir(parents=True, exist_ok=True)

    existing = resolve_preset(args.preset_dir, name)
    current = {}
    if existing and existing.exists():
        try:
            current = json.loads(existing.read_text(encoding='utf-8'))
        except Exception:
            current = {}

    preset = {
        'name': name,
        'slug': slug,
        'theme': payload.get('theme', current.get('theme', {})),
        'light': payload.get('light', current.get('light', {})),
        'dark': payload.get('dark', current.get('dark', {})),
    }

    p = user_dir / f"{slug}.json"
    p.write_text(json.dumps(preset, indent=2, ensure_ascii=False), encoding='utf-8')
    print(json.dumps({'ok': True, 'name': name, 'slug': slug, 'folder': str(user_dir)}))

def resolve_preset(preset_dir: str, name: str):
    wanted = (name or '').strip()
    if not wanted:
        return None

    slug = slugify(wanted)
    builtin_dir = Path(preset_dir)
    user_dir = Path(USER_THEME_DIR)

    search_dirs = [builtin_dir] if slug in RESERVED_PRESETS else [user_dir, builtin_dir]

    for pdir in search_dirs:
        if not pdir.exists():
            continue

        direct = pdir / f"{slug}.json"
        if direct.exists():
            return direct

        for p in sorted(pdir.glob('*.json')):
            if p.name in {'index.json', 'user_index.json'}:
                continue
            try:
                data = json.loads(p.read_text(encoding='utf-8'))
                if data.get('name') == wanted or data.get('slug') == slug:
                    return p
            except Exception:
                pass

    return None

def cmd_delete_preset(args):
    slug = slugify(args.name)
    if slug in RESERVED_PRESETS:
        print(json.dumps({'ok': False, 'reason': 'reserved'}))
        return

    preset_path = Path(USER_THEME_DIR) / f"{slug}.json"
    deleted_preset = False
    deleted_theme = False

    if preset_path.exists():
        preset_path.unlink()
        deleted_preset = True

    theme_path = Path('/config/themes/theme_studio') / f"{slug}.yaml"
    if theme_path.exists():
        theme_path.unlink()
        deleted_theme = True

    print(json.dumps({
        'ok': True,
        'deleted_preset': deleted_preset,
        'deleted_theme': deleted_theme,
        'slug': slug,
    }))

def cmd_read_preset(args):
    p = resolve_preset(args.preset_dir, args.name)
    if not p or not p.exists():
        print(json.dumps({}))
        return
    print(p.read_text(encoding='utf-8'))

def preset_display_name(p: Path):
    try:
        data = json.loads(p.read_text(encoding='utf-8'))
        return (data.get('name') or p.stem or '').strip()
    except Exception:
        return p.stem


def collect_user_themes(preset_dir: str):
    user_dir = Path(USER_THEME_DIR)
    user_dir.mkdir(parents=True, exist_ok=True)

    user_options = []
    seen = set()

    for p in sorted(user_dir.glob('*.json')):
        if p.name in {'index.json', 'user_index.json'}:
            continue

        name = preset_display_name(p)
        slug = slugify(name or p.stem)
        file_slug = slugify(p.stem)

        if not name:
            continue
        if slug in RESERVED_PRESETS or file_slug in RESERVED_PRESETS:
            continue
        if name in seen:
            continue

        user_options.append(name)
        seen.add(name)

    return {
        'count': len(user_options),
        'options': user_options,
    }


def collect_presets(preset_dir: str):
    user_data = collect_user_themes(preset_dir)
    builtin_options = list(BUILTIN_PRESET_NAMES)
    return {
        'count': len(builtin_options) + len(user_data['options']),
        'options': builtin_options + user_data['options'],
        'builtin_options': builtin_options,
        'user_options': user_data['options'],
    }


def cmd_list_presets(args):
    data = collect_presets(args.preset_dir)
    if getattr(args, 'output_json', None):
        Path(args.output_json).parent.mkdir(parents=True, exist_ok=True)
        Path(args.output_json).write_text(
            json.dumps(data, indent=2, ensure_ascii=False),
            encoding='utf-8'
        )
    print(json.dumps(data, ensure_ascii=False))


def cmd_list_user_themes(args):
    data = collect_user_themes(args.preset_dir)
    if getattr(args, 'output_json', None):
        Path(args.output_json).parent.mkdir(parents=True, exist_ok=True)
        Path(args.output_json).write_text(
            json.dumps(data, indent=2, ensure_ascii=False),
            encoding='utf-8'
        )
    print(json.dumps(data, ensure_ascii=False))


def cmd_build_theme(args):
    p = resolve_preset(args.preset_dir, args.name)
    if not p or not p.exists():
        raise SystemExit(f"Preset not found: {args.name}")
    preset = json.loads(p.read_text(encoding='utf-8'))
    display_name = (preset.get('name') or preset.get('slug') or args.name or 'my_theme').strip()
    file_slug = slugify(display_name)
    light_settings = preset.get('light') or preset.get('theme') or {}
    dark_settings = preset.get('dark') or light_settings
    light_vals = build(namespace_from_settings(light_settings, '/tmp/light.yaml'))
    dark_vals = build(namespace_from_settings(dark_settings, '/tmp/dark.yaml'))
    output_path = str(Path(args.output_dir) / f"{file_slug}.yaml")
    write_theme_yaml(display_name, {'light': light_vals, 'dark': dark_vals}, output_path)
    print(json.dumps({'ok': True, 'output': output_path, 'theme': display_name, 'file': file_slug}))

def make_parser():
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest='command', required=True)

    p_live = sub.add_parser('live')
    for k in [
        'base', 'contrast', 'hue_shift', 'saturation', 'tone', 'accent_strength', 'neutrality', 'surface_lift', 'card_opacity', 'blur_strength', 'radius', 'chip_radius',
        'use_custom_background_color', 'custom_background_color', 'use_background_image', 'background_image_url',
        'background_overlay', 'background_overlay_strength', 'background_contrast',
        'enable_header_blend', 'header_blend_height', 'overlay_offset_y', 'overlay_scale', 'overlay_spread',
        'use_custom_text_color', 'custom_text_color', 'use_custom_icon_color', 'custom_icon_color', 'use_custom_navbar_icon_color', 'custom_navbar_icon_color', 'navbar_bg_override', 'bubble_slider_color_override', 'bubble_slider_contrast', 'bubble_slider_hue_shift', 'bubble_slider_saturation', 'bubble_slider_opacity',
        'accent_contrast', 'card_bg_contrast', 'bubble_bg_contrast', 'popup_bg_contrast',
        'accent_color_override', 'card_bg_override', 'bubble_bg_override', 'popup_bg_override',
        'secondary_background_color_override', 'secondary_text_color_override', 'disabled_text_color_override',
        'app_header_background_color_override', 'app_header_text_color_override', 'divider_color_override',
        'sidebar_icon_color_override', 'state_icon_color_override', 'state_icon_active_color_override', 'primary_font_family', 'use_custom_font', 'custom_font_family','custom_font_path',
        'accent_hue_shift', 'accent_saturation', 'card_bg_hue_shift', 'card_bg_saturation', 'bubble_bg_hue_shift', 'bubble_bg_saturation', 'popup_bg_hue_shift', 'popup_bg_saturation', 'bubble_bg_opacity', 'popup_bg_opacity', 'navbar_bg_opacity',
        'border_type', 'shadow_type', 'bubble_use_fx', 'popup_use_fx', 'border_contrast', 'border_hue_shift', 'border_saturation', 'border_opacity', 'border_size', 'shadow_contrast', 'shadow_hue_shift', 'shadow_saturation', 'shadow_opacity', 'shadow_size',
        'output'
    ]:
        p_live.add_argument(f'--{k}', required=True)
    p_live.set_defaults(func=cmd_live)

    p_save = sub.add_parser('save-preset')
    p_save.add_argument('--preset-dir', required=True)
    p_save.add_argument('--payload', required=True)
    p_save.set_defaults(func=cmd_save_preset)

    p_del = sub.add_parser('delete-preset')
    p_del.add_argument('--preset-dir', required=True)
    p_del.add_argument('--name', required=True)
    p_del.set_defaults(func=cmd_delete_preset)

    p_read = sub.add_parser('read-preset')
    p_read.add_argument('--preset-dir', required=True)
    p_read.add_argument('--name', required=True)
    p_read.set_defaults(func=cmd_read_preset)

    p_list = sub.add_parser('list-presets')
    p_list.add_argument('--preset-dir', required=True)
    p_list.add_argument('--output-json')
    p_list.set_defaults(func=cmd_list_presets)

    p_list_user = sub.add_parser('list-user-themes')
    p_list_user.add_argument('--preset-dir', required=True)
    p_list_user.add_argument('--output-json')
    p_list_user.set_defaults(func=cmd_list_user_themes)

    p_build = sub.add_parser('build-theme')
    p_build.add_argument('--preset-dir', required=True)
    p_build.add_argument('--output-dir', required=True)
    p_build.add_argument('--name', required=True)
    p_build.set_defaults(func=cmd_build_theme)

    return parser

if __name__ == '__main__':
    parser = make_parser()
    args = parser.parse_args()
    args.func(args)
