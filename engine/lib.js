// Small, pure helpers for drawing animated SVG scenes. Every function returns markup for a
// given moment, so a frame depends only on the time it is asked for.

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a, b, t) => a + (b - a) * t
/** Progress of t through the window [a, b], 0..1. */
export const seg = (t, a, b) => clamp((t - a) / (b - a))
export const easeOut = (p) => 1 - (1 - p) ** 3
export const easeInOut = (p) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2)
export const backOut = (p) => { const c = 1.7; return 1 + (c + 1) * (p - 1) ** 3 + c * (p - 1) ** 2 }
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** A path that draws itself from 0 to p. */
export const path = (d, p = 1, cls = 'ln', extra = '') =>
  p <= 0 ? '' : `<path class="${cls}" d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${(1 - clamp(p)).toFixed(4)}" ${extra}/>`

export const line = (x1, y1, x2, y2, p = 1, cls = 'ln') => path(`M${x1} ${y1} L${x2} ${y2}`, p, cls)

/** Arrow from (x1,y1) to (x2,y2) that grows with p; the head appears at the end. */
export function arrow(x1, y1, x2, y2, p = 1, cls = 'ln') {
  if (p <= 0) return ''
  const x = lerp(x1, x2, clamp(p)), y = lerp(y1, y2, clamp(p))
  const a = Math.atan2(y2 - y1, x2 - x1), h = 18
  const head = `M${x - h * Math.cos(a - 0.5)} ${y - h * Math.sin(a - 0.5)} L${x} ${y} L${x - h * Math.cos(a + 0.5)} ${y - h * Math.sin(a + 0.5)}`
  return `<path class="${cls}" d="M${x1} ${y1} L${x} ${y}"/><path class="${cls}" d="${head}"/>`
}

export const text = (x, y, s, { size = 34, cls = 't', anchor = 'middle', weight = 600, opacity = 1, extra = '' } = {}) =>
  opacity <= 0 ? '' : `<text class="${cls}" x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" opacity="${opacity.toFixed(3)}" ${extra}>${esc(s)}</text>`

/** Types a string out: p = 0..1 of its characters. */
export const typed = (s, p) => s.slice(0, Math.round(s.length * clamp(p)))

/** Scale + fade in around a centre point. */
export const pop = (cx, cy, p, inner) => {
  if (p <= 0) return ''
  const s = backOut(clamp(p))
  return `<g opacity="${clamp(p * 2).toFixed(3)}" transform="translate(${cx} ${cy}) scale(${s.toFixed(4)}) translate(${-cx} ${-cy})">${inner}</g>`
}
export const fade = (p, inner, dy = 0) =>
  p <= 0 ? '' : `<g opacity="${clamp(p).toFixed(3)}" transform="translate(0 ${((1 - easeOut(clamp(p))) * dy).toFixed(2)})">${inner}</g>`
export const move = (x, y, inner) => `<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)})">${inner}</g>`

export const rect = (x, y, w, h, { r = 18, cls = 'ln', p = 1 } = {}) =>
  path(`M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`, p, cls)

export const cross = (cx, cy, r, p, cls = 'ln ac thick') =>
  path(`M${cx - r} ${cy - r} L${cx + r} ${cy + r}`, seg(p, 0, 0.5), cls) + path(`M${cx + r} ${cy - r} L${cx - r} ${cy + r}`, seg(p, 0.5, 1), cls)
export const check = (cx, cy, r, p, cls = 'ln ac thick') =>
  path(`M${cx - r} ${cy} L${cx - r * 0.3} ${cy + r * 0.7} L${cx + r} ${cy - r * 0.7}`, p, cls)

/** Deterministic pseudo-random numbers, so frames never flicker between renders. */
export function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647 }
