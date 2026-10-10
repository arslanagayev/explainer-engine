// Shared look and props for the "How languages actually work" series: one identity for every
// episode (combo 08: Silver #141414 + Luminous Moss #2BEE34, Space Grotesk + Fira Code).
import { clamp, line, pop, rect, rng, text } from './lib.js'
import { pill } from './props.js'

export const LANGUAGES = {
  fontsUrl: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@500;600;700&family=Space+Grotesk:wght@600;700&display=block',
  theme: {
    bg: '#141414',
    backdrop: 'radial-gradient(70% 38% at 50% 50%, rgb(43 238 52 / 0.09), transparent 70%), #141414',
    grid: 'rgb(43 238 52 / 0.10)',
    ink: '#eef3ee',
    muted: '#8a928b',
    faint: 'rgb(238 243 238 / 0.12)',
    line: '#343a35',
    panel: '#1b1d1b',
    soft: '#1f4d22',
    accent: '#2bee34',
    display: "'Space Grotesk', sans-serif",
    mono: "'Fira Code', monospace",
    'headline-size': '90px',
  },
}

/** A processor chip centred on (x, y) with pins on every side. */
export const cpu = (x, y, { s = 1, p = 1, glow = false } = {}) => {
  const pins = [-60, -20, 20, 60].flatMap((d) => [
    line(x + d * s, y - 100 * s, x + d * s, y - 128 * s, p, 'ln dim'), line(x + d * s, y + 100 * s, x + d * s, y + 128 * s, p, 'ln dim'),
    line(x - 100 * s, y + d * s, x - 128 * s, y + d * s, p, 'ln dim'), line(x + 100 * s, y + d * s, x + 128 * s, y + d * s, p, 'ln dim'),
  ]).join('')
  return pins + `<rect class="fp" x="${x - 100 * s}" y="${y - 100 * s}" width="${200 * s}" height="${200 * s}" rx="${18 * s}" opacity="${clamp(p * 3).toFixed(2)}"/>` +
    rect(x - 100 * s, y - 100 * s, 200 * s, 200 * s, { r: 18 * s, p, cls: glow ? 'ln ac glow' : 'ln ac' }) +
    text(x, y + 14 * s, 'CPU', { size: 40 * s, cls: 't m ac', weight: 700, opacity: clamp(p * 2 - 1) })
}
/** A labelled box used for compilers, interpreters and virtual machines. */
export const stage = (x, y, w, h, label, { p = 1, lit = false, size = 28 } = {}) =>
  `<rect class="fp" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="18" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x - w / 2, y - h / 2, w, h, { r: 18, p, cls: lit ? 'ln ac glow' : 'ln' }) +
  text(x, y + size * 0.35, label, { size, cls: lit ? 't m ac' : 't m', weight: 700, opacity: clamp(p * 2 - 1) })
/** A small document with text lines; `bin` draws it as ones and zeros. */
export const doc = (x, y, { p = 1, bin = false, label = '', lit = 0 } = {}) =>
  `<rect class="fp" x="${x - 80}" y="${y - 100}" width="160" height="200" rx="12" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x - 80, y - 100, 160, 200, { r: 12, p, cls: lit > 0 ? 'ln ac' : 'ln' }) +
  [0, 1, 2, 3, 4].map((i) => bin
    ? text(x, y - 52 + i * 30, ['0110', '1001', '1110', '0011', '1010'][i] + ' ' + ['1101', '0100', '1011', '0110', '1100'][i], { size: 18, cls: 't m ac', opacity: clamp(p * 2 - 1) })
    : line(x - 55, y - 60 + i * 30, x + 55 - (i % 2) * 40, y - 60 + i * 30, p, 'ln dim thin')).join('') +
  (label ? text(x, y + 140, label, { size: 22, cls: 't m mu', opacity: p }) : '')
export const chip = (x, y, s, p) => pop(x, y, p, pill(x, y, s, { size: 46, box: 'ln ac', cls: 'ac' }))
export const BITS = (n, seed) => { const r = rng(seed); return Array.from({ length: n }, () => (r() > 0.5 ? '1' : '0')).join('') }

