// Languages 00: how does code actually run? Compiler, interpreter and virtual machine.
import { arrow, backOut, clamp, cross, easeInOut, easeOut, fade, lerp, line, pop, rect, rng, seg, text } from '../../engine/lib.js'
import { phone, pill } from '../../engine/props.js'

// ---------- Episode props ----------
/** A processor chip centred on (x, y) with pins on every side. */
const cpu = (x, y, { s = 1, p = 1, glow = false } = {}) => {
  const pins = [-60, -20, 20, 60].flatMap((d) => [
    line(x + d * s, y - 100 * s, x + d * s, y - 128 * s, p, 'ln dim'), line(x + d * s, y + 100 * s, x + d * s, y + 128 * s, p, 'ln dim'),
    line(x - 100 * s, y + d * s, x - 128 * s, y + d * s, p, 'ln dim'), line(x + 100 * s, y + d * s, x + 128 * s, y + d * s, p, 'ln dim'),
  ]).join('')
  return pins + `<rect class="fp" x="${x - 100 * s}" y="${y - 100 * s}" width="${200 * s}" height="${200 * s}" rx="${18 * s}" opacity="${clamp(p * 3).toFixed(2)}"/>` +
    rect(x - 100 * s, y - 100 * s, 200 * s, 200 * s, { r: 18 * s, p, cls: glow ? 'ln ac glow' : 'ln ac' }) +
    text(x, y + 14 * s, 'CPU', { size: 40 * s, cls: 't m ac', weight: 700, opacity: clamp(p * 2 - 1) })
}
/** A labelled box used for compilers, interpreters and virtual machines. */
const stage = (x, y, w, h, label, { p = 1, lit = false, size = 28 } = {}) =>
  `<rect class="fp" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="18" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x - w / 2, y - h / 2, w, h, { r: 18, p, cls: lit ? 'ln ac glow' : 'ln' }) +
  text(x, y + size * 0.35, label, { size, cls: lit ? 't m ac' : 't m', weight: 700, opacity: clamp(p * 2 - 1) })
/** A small document with text lines; `bin` draws it as ones and zeros. */
const doc = (x, y, { p = 1, bin = false, label = '', lit = 0 } = {}) =>
  `<rect class="fp" x="${x - 80}" y="${y - 100}" width="160" height="200" rx="12" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x - 80, y - 100, 160, 200, { r: 12, p, cls: lit > 0 ? 'ln ac' : 'ln' }) +
  [0, 1, 2, 3, 4].map((i) => bin
    ? text(x, y - 52 + i * 30, ['0110', '1001', '1110', '0011', '1010'][i] + ' ' + ['1101', '0100', '1011', '0110', '1100'][i], { size: 18, cls: 't m ac', opacity: clamp(p * 2 - 1) })
    : line(x - 55, y - 60 + i * 30, x + 55 - (i % 2) * 40, y - 60 + i * 30, p, 'ln dim thin')).join('') +
  (label ? text(x, y + 140, label, { size: 22, cls: 't m mu', opacity: p }) : '')
const chip = (x, y, s, p) => pop(x, y, p, pill(x, y, s, { size: 46, box: 'ln ac', cls: 'ac' }))
const BITS = (n, seed) => { const r = rng(seed); return Array.from({ length: n }, () => (r() > 0.5 ? '1' : '0')).join('') }

// ---------- Scenes ----------
const scenes = [
  { // 0 Your computer doesn't understand Python, or C, or any language you write.
    headline: "It doesn't *understand* you",
    draw: ({ t, w }) => {
      const snippets = [["print('hi')", 4, 160, 120], ['printf("hi");', 6, 840, 120], ['Console.Write("hi");', 9, 500, 720]]
      return cpu(500, 400, { p: easeOut(seg(t, 0, 0.6)) }) +
        snippets.map(([s, wi, x, y]) => {
          const a = seg(t, w[wi] - 0.2, w[wi] + 0.2)
          const k = easeInOut(seg(t, w[wi] + 0.1, w[wi] + 0.7))
          const bx = lerp(x, lerp(x, 500, 0.45), Math.sin(k * Math.PI))
          const by = lerp(y, lerp(y, 400, 0.45), Math.sin(k * Math.PI))
          return pop(x, y, a, pill(bx, by, s, { size: 26 })) + (k >= 1 ? cross(x, y + (y < 400 ? 70 : -70), 18, seg(t, w[wi] + 0.7, w[wi] + 1), 'ln ac') : '')
        }).join('') +
        pop(500, 230, seg(t, w[2], w[3] + 0.2), text(500, 255, '?', { size: 90, cls: 't ac', weight: 700 }))
    },
  },
  { // 1 It only understands numbers. Ones and zeros.
    headline: 'Only *ones and zeros*',
    draw: ({ t, w }) => {
      const k = seg(t, w[2], w[6] + 0.4)
      const cols = Array.from({ length: 9 }, (_, i) => {
        const x = 100 + i * 100
        const off = ((t * (90 + i * 13)) % 120)
        return Array.from({ length: 8 }, (_, j) => {
          const y = -40 + j * 120 + off
          const fadeNear = clamp(Math.abs(x - 500) / 160 + Math.abs(y - 420) / 260)
          return text(x, y, BITS(1, i * 31 + j + Math.floor((t + j) * 2))[0], { size: 40, cls: 't m ac', opacity: k * 0.45 * fadeNear })
        }).join('')
      }).join('')
      return cols + cpu(500, 420, { glow: k > 0.5 }) +
        text(500, 760, '01001000 01101001', { size: 36, cls: 't m ac', weight: 700, opacity: seg(t, w[4], w[6]) })
    },
  },
  { // 2 Each pattern tells the processor one tiny thing: add, compare, jump.
    headline: 'Tiny *instructions*',
    draw: ({ t, w }) => {
      const ops = [['00000011', 'ADD', 'add two numbers', 8], ['00111001', 'CMP', 'compare them', 9], ['11101011', 'JMP', 'jump somewhere else', 10]]
      return cpu(820, 140, { s: 0.6, glow: t > w[8] }) +
        ops.map(([bits, op, say, wi], i) => {
          const y = 330 + i * 150
          const a = seg(t, w[wi] - 0.15, w[wi] + 0.25)
          return fade(a, text(80, y, bits, { size: 40, cls: 't m', anchor: 'start' }) + arrow(330, y - 14, 420, y - 14, a, 'ln ac') +
            text(450, y, op, { size: 48, cls: 't m ac', anchor: 'start', weight: 700 }) +
            text(600, y, say, { size: 28, cls: 't mu', anchor: 'start' }), 20)
        }).join('') +
        text(80, 220, 'one pattern = one instruction', { size: 28, cls: 't m mu', anchor: 'start', opacity: seg(t, w[0], w[2]) })
    },
  },
  { // 3 Nobody wants to write that. So we write code for humans, and translate it.
    headline: 'Code is for *humans*',
    draw: ({ t, w }) => {
      const human = seg(t, w[6], w[9])
      const tr = easeInOut(seg(t, w[11], w[13] + 0.2))
      return fade(seg(t, 0, 0.4), [0, 1, 2, 3].map((i) => text(500, 90 + i * 50, BITS(28, 9 + i), { size: 30, cls: 't m mu', opacity: 1 - human * 0.7 })).join(''), 0) +
        cross(500, 160, 60, seg(t, w[3], w[4] + 0.2), 'ln ac thick') +
        fade(human, rect(180, 340, 640, 150, { r: 20, cls: 'ln ac' }) +
          text(500, 405, 'total = price + tax', { size: 44, cls: 't m', weight: 700 }) + text(500, 455, 'if total > 100: discount()', { size: 26, cls: 't m mu' }), 20) +
        arrow(500, 510, 500, lerp(510, 640, tr), tr > 0 ? 1 : 0, 'ln ac') +
        text(500, 700, 'translate → 0s and 1s', { size: 34, cls: 't m ac', weight: 700, opacity: seg(tr, 0.6, 1) })
    },
  },
  { // 4 A compiler translates the whole program before it runs. Like translating a book once. That's C.
    headline: 'The *compiler*',
    draw: ({ t, w }) => {
      const whole = seg(t, w[2], w[6])
      const run = seg(t, w[7], w[8] + 0.3)
      return doc(140, 300, { label: 'SOURCE' }) + arrow(230, 300, 330, 300, whole, 'ln ac') +
        stage(470, 300, 240, 140, 'COMPILER', { lit: whole > 0 && whole < 1 }) +
        arrow(600, 300, 700, 300, seg(whole, 0.7, 1), 'ln ac') + doc(800, 300, { bin: true, p: seg(whole, 0.8, 1), label: 'PROGRAM' }) +
        fade(run, text(800, 520, '▶ run', { size: 34, cls: 't m ac', weight: 700 }), 10) +
        fade(seg(t, w[9], w[11]), text(100, 620, 'like translating a whole book, once', { size: 30, cls: 't mu', anchor: 'start' }), 10) +
        chip(500, 730, 'C', seg(t, w[14], w[15] + 0.3))
    },
  },
  { // 5 An interpreter translates as it runs, line by line, like a live interpreter. Flexible, but slower. That's Python.
    headline: 'The *interpreter*',
    draw: ({ t, w }) => {
      const lines = ['x = 2', 'y = x * 21', 'print(y)', 'x = x + 1']
      const cur = Math.floor(seg(t, w[3], w[12]) * lines.length * 0.999)
      return lines.map((l, i) => {
        const done = t > w[3] && i <= cur
        return text(80, 170 + i * 80, l, { size: 34, cls: done ? (i === cur ? 't m ac' : 't m') : 't m mu', anchor: 'start', weight: i === cur && t > w[3] ? 700 : 500 }) +
          (i === cur && t > w[3] ? `<rect class="fl" x="60" y="${132 + i * 80}" width="320" height="54" rx="10" opacity="0.6"/>` : '')
      }).join('') +
        stage(560, 290, 200, 120, 'INTERPRETER', { lit: t > w[3] && t < w[12] + 0.3, size: 22 }) +
        arrow(390, 170 + cur * 80 - 10, 455, 290, t > w[3] ? 1 : 0, 'ln ac thin') + arrow(665, 290, 740, 290, t > w[3] ? 1 : 0, 'ln ac thin') +
        text(760, 300, t > w[3] ? ['', '42', '42', ''][cur] || '▶' : '', { size: 40, cls: 't m ac', anchor: 'start', weight: 700 }) +
        fade(seg(t, w[13], w[15]), text(80, 560, 'flexible', { size: 34, cls: 't ac', anchor: 'start', weight: 700 }) + text(280, 560, '· but slower', { size: 34, cls: 't mu', anchor: 'start' }), 10) +
        chip(500, 700, 'Python', seg(t, w[16], w[17] + 0.3))
    },
  },
  { // 6 And some do both: compile to a middle language, then a virtual machine runs it. That's Java and C#.
    headline: '*Both*: a virtual machine',
    draw: ({ t, w }) => {
      const a = seg(t, w[4], w[8]), b = seg(t, w[9], w[14])
      return doc(110, 260, { label: 'SOURCE' }) + arrow(200, 260, 260, 260, a, 'ln ac') +
        stage(370, 260, 200, 110, 'COMPILE', { lit: a > 0 && a < 1, size: 24 }) + arrow(480, 260, 540, 260, seg(a, 0.6, 1), 'ln ac') +
        pop(650, 260, seg(a, 0.7, 1), rect(570, 200, 160, 120, { r: 14, cls: 'ln ac dash' }) + text(650, 255, 'BYTECODE', { size: 20, cls: 't m ac', weight: 700 }) + text(650, 290, 'middle language', { size: 16, cls: 't m mu' })) +
        arrow(650, 330, 650, 410, b, 'ln ac') + stage(650, 480, 300, 120, 'VIRTUAL MACHINE', { lit: b > 0.5, size: 24, p: seg(b, 0, 0.4) }) +
        text(650, 580, '▶ run', { size: 30, cls: 't m ac', weight: 700, opacity: seg(b, 0.8, 1) }) +
        chip(330, 700, 'Java', seg(t, w[16], w[16] + 0.4)) + chip(640, 700, 'C#', seg(t, w[18] - 0.1, w[18] + 0.3))
    },
  },
  { // 7 Every language in this series is one of these three.
    headline: 'Three *families*',
    draw: ({ t, w }) => {
      const cols = [['COMPILED', ['C', 'C++', 'Go', 'Rust', 'Swift']], ['INTERPRETED', ['Python', 'PHP', 'Ruby']], ['VIRTUAL MACHINE', ['Java', 'C#', 'Kotlin']]]
      return cols.map(([title, langs], i) => {
        const x = 175 + i * 325
        const a = seg(t, w[0] + i * 0.3, w[0] + i * 0.3 + 0.4)
        return fade(a, rect(x - 145, 60, 290, 620, { r: 22, cls: 'ln' }) + text(x, 120, title, { size: 22, cls: 't m ac', weight: 700 }) + line(x - 145, 150, x + 145, 150, 1, 'ln dim') +
          langs.map((l, j) => text(x, 220 + j * 90, l, { size: 40, weight: 700, opacity: seg(t, w[3] + i * 0.25 + j * 0.12, w[3] + i * 0.25 + j * 0.12 + 0.3) })).join(''), 20)
      }).join('') +
        text(500, 750, 'JavaScript? Interpreted, then compiled on the fly. Episode 06.', { size: 22, cls: 't m mu', opacity: seg(t, w[8], w[9] + 0.3) })
    },
  },
  { // 8 Next: a fifty-year-old language that's still inside your phone. C.
    headline: 'Next: *C*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const big = backOut(seg(t, w[9] - 0.2, w[9] + 0.3))
      return phone(500, 330, { p, cls: 'ln ac' }) +
        (big > 0 ? `<g transform="translate(500 330) scale(${big.toFixed(3)})">` + text(0, 45, 'C', { size: 150, cls: 't m ac', weight: 700 }) + '</g>' : '') +
        text(500, 620, 'born 1972 · still everywhere', { size: 30, cls: 't m mu', opacity: seg(t, w[2], w[4]) }) +
        fade(seg(t, w[9] + 0.3, w[9] + 0.8), rect(270, 680, 460, 90, { r: 45, cls: 'ln ac' }) + text(500, 738, 'Follow for ep. 01', { size: 34, cls: 't ac', weight: 700 }), 20)
    },
  },
]

export default {
  series: 'How languages actually work · 00',
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
  chapters: [
    { title: 'The machine', from: 0, to: 2 },
    { title: 'Translation', from: 3, to: 3 },
    { title: 'Three ways', from: 4, to: 6 },
    { title: 'The map', from: 7, to: 8 },
  ],
  scenes,
}
