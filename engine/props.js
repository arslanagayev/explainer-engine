// Props shared by episodes: devices, containers and labels drawn as SVG markup.
import { clamp, path, rect, rng, text, line } from './lib.js'

export const pill = (x, y, s, { size = 32, cls = '', box = 'ln', p = 1 } = {}) => {
  const w = s.length * size * 0.62 + 56
  return `<rect class="fp" x="${x - w / 2}" y="${y - 36}" width="${w}" height="72" rx="36" opacity="${clamp(p * 3).toFixed(2)}"/>` +
    rect(x - w / 2, y - 36, w, 72, { r: 36, cls: box, p }) + text(x, y + size * 0.35, s, { size, cls: `t m ${cls}`, weight: 600, opacity: clamp(p * 2 - 0.6) })
}
export const laptop = (x, y, p = 1) =>
  rect(x - 110, y - 90, 220, 140, { r: 14, p }) + path(`M${x - 140} ${y + 62} H${x + 140} L${x + 118} ${y + 82} H${x - 118} Z`, p)
export const server = (x, y, p = 1, t = 0) => [0, 1, 2].map((k) => {
  const yy = y - 95 + k * 68
  const led = p > 0.95 ? 0.35 + 0.65 * ((Math.sin(t * 7 + k * 2.1) + 1) / 2) : 0
  return rect(x - 100, yy, 200, 56, { r: 10, p }) + line(x - 72, yy + 28, x - 8, yy + 28, p, 'ln dim thin') +
    `<circle class="fa" cx="${x + 70}" cy="${yy + 28}" r="7" opacity="${led.toFixed(2)}"/>`
}).join('')
export const db = (x, y, p = 1, { w = 100, h = 190, cls = 'ln' } = {}) =>
  path(`M${x - w} ${y - h / 2} A${w} 28 0 0 1 ${x + w} ${y - h / 2} A${w} 28 0 0 1 ${x - w} ${y - h / 2}`, p, cls) +
  path(`M${x - w} ${y - h / 2} V${y + h / 2} A${w} 28 0 0 0 ${x + w} ${y + h / 2} V${y - h / 2}`, p, cls) +
  path(`M${x - w} ${y} A${w} 28 0 0 0 ${x + w} ${y}`, p, cls.includes('dash') ? cls : 'ln dim')
export const user = (x, y, p = 1, name = '') =>
  path(`M${x - 36} ${y - 120} a36 36 0 1 0 72 0 a36 36 0 1 0 -72 0`, p) +
  path(`M${x - 72} ${y} Q${x - 72} ${y - 66} ${x} ${y - 66} Q${x + 72} ${y - 66} ${x + 72} ${y}`, p) +
  text(x, y + 52, name, { size: 30, cls: 't mu m', opacity: clamp(p * 2 - 1) })
export const lock = (x, y, { open = 0, p = 1, cls = 'ln ac' } = {}) =>
  rect(x - 46, y - 8, 92, 74, { r: 14, p, cls }) +
  `<g transform="translate(${(open * 30).toFixed(1)} ${(-open * 22).toFixed(1)})">${path(`M${x - 28} ${y - 8} V${y - 36} A28 28 0 0 1 ${x + 28} ${y - 36} V${y - 8}`, p, cls)}</g>` +
  `<circle class="fa" cx="${x}" cy="${y + 26}" r="${(7 * clamp(p * 2 - 1)).toFixed(1)}"/>`
export const gear = (x, y, r, angle, cls = 'ln ac thin') =>
  `<g transform="rotate(${angle.toFixed(1)} ${x} ${y})"><circle class="${cls}" cx="${x}" cy="${y}" r="${r}" style="stroke-dasharray:${(r * 0.45).toFixed(1)} ${(r * 0.33).toFixed(1)};stroke-width:${r * 0.32}"/></g>` +
  `<circle class="ln ac thin" cx="${x}" cy="${y}" r="${r * 0.35}"/>`
/** Monospace string with its first `n` characters coloured. */
export const hex = (x, y, s, { size = 40, anchor = 'middle', lit = 0, cls = 't m', opacity = 1 } = {}) => {
  const a = s.slice(0, lit), b = s.slice(lit)
  return `<text class="${cls}" x="${x}" y="${y}" font-size="${size}" font-weight="600" text-anchor="${anchor}" opacity="${opacity.toFixed(3)}"><tspan class="fa">${a}</tspan><tspan>${b}</tspan></text>`
}
export const garble = (n, t) => { const r = rng(1 + Math.floor(t * 14)); const cs = '#%&@*!?$0x9Z'; return Array.from({ length: n }, () => cs[Math.floor(r() * cs.length)]).join('') }
/** A key lying on its side, bow on the left. */
export const keyIcon = (x, y, s = 1, cls = 'ln ac') =>
  `<g transform="translate(${x} ${y}) scale(${s})">` + path('M-60 0 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0', 1, cls) + path('M-8 0 H60 M40 0 V22 M56 0 V16', 1, cls) + '</g>'
/** A phone centred on (x, y), 220 x 420. */
export const phone = (x, y, { p = 1, cls = 'ln' } = {}) =>
  `<rect class="fp" x="${x - 110}" y="${y - 210}" width="220" height="420" rx="34" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x - 110, y - 210, 220, 420, { r: 34, p, cls }) + line(x - 30, y - 186, x + 30, y - 186, p, 'ln dim')
/** A chat bubble; `mine` puts the tail on the right. */
export function bubble(x, y, s, { mine = true, size = 24, p = 1, cls = 't' } = {}) {
  const w = s.length * size * 0.56 + 44, h = size + 30
  const left = x - w / 2
  const tail = mine ? `M${left + w - 18} ${y + h / 2} L${left + w + 8} ${y + h / 2 + 12} L${left + w - 4} ${y + h / 2 - 8}` : `M${left + 18} ${y + h / 2} L${left - 8} ${y + h / 2 + 12} L${left + 4} ${y + h / 2 - 8}`
  return `<g opacity="${clamp(p * 2).toFixed(3)}"><rect class="${mine ? 'fs' : 'fp'}" x="${left}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}"/>` +
    `<path class="${mine ? 'fs' : 'fp'}" d="${tail} Z"/>` + rect(left, y - h / 2, w, h, { r: h / 2, cls: 'ln thin' }) +
    text(x, y + size * 0.36, s, { size, cls, weight: 600 }) + '</g>'
}
