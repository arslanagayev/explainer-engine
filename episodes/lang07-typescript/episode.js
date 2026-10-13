// Languages 07: TypeScript. The typo that ships, types next to values, erased at compile time,
// only protecting you while you write, and #1 on GitHub. Scripted as a Dopamine Loop.
import { arrow, backOut, check, clamp, cross, fade, line, pop, rect, seg, text, typed } from '../../engine/lib.js'
import { bubble, pill, server } from '../../engine/props.js'
import { LANGUAGES, chip, stage } from '../../engine/series-languages.js'

const PRE = 'style="white-space:pre"'

// ---------- Episode props ----------
const browser = (x, y, w, h, { p = 1, cls = 'ln', label = '' } = {}) =>
  `<rect class="fp" x="${x}" y="${y}" width="${w}" height="${h}" rx="16" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x, y, w, h, { r: 16, p, cls }) + line(x, y + 44, x + w, y + 44, p, 'ln dim thin') +
  [0, 1, 2].map((i) => `<circle class="${i === 0 ? 'fa' : 'fl'}" cx="${x + 26 + i * 22}" cy="${y + 22}" r="6" opacity="${clamp(p * 2 - 1).toFixed(2)}"/>`).join('') +
  (label ? text(x + w - 18, y + 30, label, { size: 20, cls: 't m mu', anchor: 'end', opacity: clamp(p * 2 - 1) }) : '')

/** A code panel; each line is [text, cls]. */
const panel = (x, y, w, h, title, lines, { size = 28, cls = 'ln' } = {}) =>
  `<rect class="fp" x="${x}" y="${y}" width="${w}" height="${h}" rx="18"/>` + rect(x, y, w, h, { r: 18, cls }) +
  text(x + w - 24, y + 38, title, { size: 22, cls: 't m mu', anchor: 'end' }) +
  lines.map(([s, c], i) => text(x + 32, y + 84 + i * (size + 16), s, { size, cls: c || 't m', anchor: 'start', extra: PRE })).join('')

/** A wavy red-style underline (drawn in the accent) under a span of monospace text. */
const squiggle = (x, y, w, p) => {
  const n = Math.max(2, Math.round(w / 12))
  const d = `M${x} ${y}` + Array.from({ length: n }, (_, i) => ` q6 ${i % 2 ? 7 : -7} 12 0`).join('')
  return `<path class="ln ac thin" d="${d}" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:${(1 - clamp(p)).toFixed(3)}"/>`
}

const TS = [['interface User {', 't m'], ['  name: string', 't m'], ['}', 't m'], ['', ''], ['greet(user.nmae)', 't m']]

// ---------- Scenes ----------
const scenes = [
  { // 0 Friday night, you ship. One typo, and every user sees the word undefined.
    headline: 'One typo. *Shipped.*',
    draw: ({ t, w }) => {
      const ship = seg(t, w[2], w[3] + 0.3)
      const bad = seg(t, w[11], w[12] + 0.3)
      return pop(500, 70, seg(t, 0, 0.3), pill(500, 70, 'Fri · 23:47', { size: 32 })) +
        pop(500, 190, ship, pill(500, 190, '🚀 deployed', { size: 34, box: 'ln ac', cls: 'ac' })) +
        [0, 1, 2].map((i) => {
          const x = 70 + i * 290
          return fade(seg(t, w[7] + i * 0.12, w[9] + i * 0.12), browser(x, 300, 260, 300, { cls: bad > 0 ? 'ln ac' : 'ln' }) +
            text(x + 130, 400, 'Hi,', { size: 34, weight: 700 }) +
            text(x + 130, 470, bad > 0 ? 'undefined' : '', { size: 34, cls: 't m ac', weight: 700, opacity: bad }) +
            (bad >= 1 ? cross(x + 130, 540, 26, seg(t, w[12] + 0.2 + i * 0.1, w[12] + 0.5 + i * 0.1)) : ''), 10)
        }).join('')
    },
  },
  { // 1 JavaScript didn't warn you. It never does.
    headline: 'No *warning*',
    draw: ({ t, w }) => {
      const lines = [['user.nmae', 't m'], ['', ''], ['// no error', 't m mu'], ['// no warning', 't m mu'], ['// just undefined', 't m ac']]
      return pop(500, 70, seg(t, w[0] - 0.1, w[0] + 0.3), pill(500, 70, 'JavaScript', { size: 34 })) +
        panel(140, 150, 720, 420, 'app.js', lines.map(([s, c], i) => [i < 2 ? s : typed(s, seg(t, w[1] + i * 0.25, w[3] + i * 0.25)), c]), { size: 36 }) +
        text(500, 680, '…silence', { size: 40, cls: 't mu', weight: 700, opacity: seg(t, w[4], w[6] + 0.2) })
    },
  },
  { // 2 So how do you catch it before anyone sees it?
    headline: 'Catch it *before*?',
    draw: ({ t, w }) => {
      const q = seg(t, w[4], w[6] + 0.3)
      return text(500, 220, typed('user.nmae', 1), { size: 80, cls: 't m', weight: 700 }) +
        `<circle class="ln ac glow" cx="500" cy="196" r="${(170 * backOut(q)).toFixed(1)}" opacity="${q.toFixed(2)}"/>` +
        pop(500, 520, seg(t, w[8] - 0.2, w[9] + 0.3), `<circle class="fp" cx="500" cy="520" r="80"/><circle class="ln ac glow" cx="500" cy="520" r="80"/>` +
          text(500, 552, '?', { size: 96, cls: 't m ac', weight: 700 }))
    },
  },
  { // 3 TypeScript. Microsoft released it in 2012, designed by the same person who created C sharp.
    headline: 'Enter *TypeScript*',
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[0] - 0.1, w[0] + 0.3))
      return (big > 0 ? `<g transform="translate(500 170) scale(${big.toFixed(3)})">${text(0, 50, 'TypeScript', { size: 140, cls: 't m ac', weight: 700 })}</g>` : '') +
        pop(330, 400, seg(t, w[1], w[4] + 0.3), pill(330, 400, 'Microsoft', { size: 36 })) +
        pop(670, 400, seg(t, w[4], w[5] + 0.3), pill(670, 400, '2012', { size: 40, box: 'ln ac', cls: 'ac' })) +
        pop(500, 580, seg(t, w[12], w[14] + 0.3), rect(220, 530, 560, 100, { r: 50, cls: 'ln ac glow' }) +
          text(500, 594, 'same designer as C#', { size: 38, cls: 't ac', weight: 700 }))
    },
  },
  { // 4 You write the type next to the value, and your editor turns the typo red while you type.
    headline: 'Typos turn *red*',
    draw: ({ t, w }) => {
      const typeP = seg(t, w[2], w[6] + 0.2)
      const red = seg(t, w[11], w[13] + 0.3)
      const lines = TS.map(([s, c], i) => [i === 1 ? '  name' + typed(': string', typeP).padEnd(0) : s, i === 1 && typeP > 0 ? 't m ac' : c])
      return panel(110, 40, 780, 400, 'app.ts', lines, { size: 36 }) +
        squiggle(380, 347, 88, red) +
        fade(red, rect(150, 470, 700, 120, { r: 18, cls: 'ln ac glow' }) +
          text(180, 520, "Property 'nmae' does not exist", { size: 28, cls: 't m ac', anchor: 'start', weight: 600 }) +
          text(180, 562, "Did you mean 'name'?", { size: 28, cls: 't m', anchor: 'start', weight: 600 }), 10) +
        text(500, 680, 'while you type', { size: 36, cls: 't ac', weight: 700, opacity: seg(t, w[15], w[16] + 0.3) })
    },
  },
  { // 5 But here's the twist: browsers can't run TypeScript.
    headline: 'The *twist*',
    draw: ({ t, w }) => {
      const no = seg(t, w[5], w[7] + 0.3)
      return browser(200, 120, 600, 420, { cls: 'ln', label: 'browser' }) +
        pop(500, 340, seg(t, w[4], w[5] + 0.2), chip(500, 340, '.ts', 1)) +
        cross(500, 340, 110, no) +
        text(500, 660, "can't run TypeScript", { size: 40, cls: 't ac', weight: 700, opacity: no })
    },
  },
  { // 6 The compiler checks everything, then deletes every type and hands the browser plain JavaScript.
    headline: 'Types get *deleted*',
    draw: ({ t, w }) => {
      const checkP = seg(t, w[1], w[3] + 0.2)
      const del = seg(t, w[4], w[7] + 0.2)
      const out = seg(t, w[8], w[13] + 0.2)
      const strike = (x, y, len, p) => line(x, y, x + len * p, y, 1, 'ln ac thick')
      return panel(60, 30, 420, 260, 'app.ts', [['let name: string', 't m'], ['let age: number', 't m']], { size: 30 }) +
        strike(176, 113, 140, del) + strike(160, 159, 140, seg(del, 0.3, 1)) +
        stage(270, 370, 300, 90, 'compiler', { lit: checkP > 0 && checkP < 1, size: 30, p: seg(t, w[0], w[1] + 0.2) }) +
        check(450, 370, 26, checkP) +
        arrow(480, 370, 560, 370, out, 'ln ac') +
        fade(out, panel(540, 280, 400, 200, 'app.js', [['let name', 't m'], ['let age', 't m']], { size: 30, cls: 'ln ac' }), 0) +
        fade(seg(out, 0.5, 1), browser(560, 520, 360, 200, { cls: 'ln ac', label: 'browser' }) + check(740, 640, 36, seg(out, 0.7, 1)), 10)
    },
  },
  { // 7 So types only protect you while you write. Bad data from the internet can still slip through.
    headline: 'Only *while you write*',
    draw: ({ t, w }) => {
      const flow = seg(t, w[8], w[14] + 0.3)
      const x = 160 + 600 * flow
      return text(500, 90, 'compile time ✓', { size: 40, cls: 't ac', weight: 700, opacity: seg(t, w[1], w[3] + 0.3) }) +
        line(80, 160, 920, 160, seg(t, w[4], w[6]), 'ln dim dash') +
        text(500, 230, 'run time: no types', { size: 36, cls: 't mu', weight: 700, opacity: seg(t, w[5], w[7] + 0.2) }) +
        pop(160, 420, seg(t, w[8], w[11]), server(160, 440, 1, t) + text(160, 580, 'internet', { size: 28, weight: 700 })) +
        browser(700, 330, 240, 220, { label: 'app' }) +
        (flow > 0 ? pill(x, 360 + Math.sin(flow * Math.PI) * -40, '{ "name": 42 }', { size: 24, box: 'ln ac', cls: 'ac' }) : '') +
        text(500, 690, 'slips through', { size: 38, cls: 't ac', weight: 700, opacity: seg(t, w[15], w[16] + 0.3) })
    },
  },
  { // 8 And in 2025, it passed Python and JavaScript to become the most used language on GitHub.
    headline: '*#1* on GitHub',
    draw: ({ t, w }) => {
      const race = seg(t, w[3], w[8] + 0.4)
      const bars = [['TypeScript', 0.62 + 0.38 * race, true], ['Python', 0.9, false], ['JavaScript', 0.86, false]]
      const order = race > 0.7 ? [0, 1, 2] : [1, 2, 0]
      return text(500, 80, '2025', { size: 70, cls: 't m ac', weight: 700, opacity: seg(t, w[1], w[2] + 0.2) }) +
        order.map((k, rank) => {
          const [name, v, ts] = bars[k]
          const y = 200 + rank * 150
          return text(90, y + 22, `#${rank + 1}`, { size: 40, cls: rank === 0 ? 't m ac' : 't m mu', anchor: 'start', weight: 700 }) +
            text(190, y + 22, name, { size: 34, cls: ts ? 't m ac' : 't m', anchor: 'start', weight: 700 }) +
            rect(430, y - 20, 460, 54, { r: 27, cls: 'ln dim thin' }) +
            `<rect class="${ts ? 'fa' : 'fl'}" x="430" y="${y - 20}" width="${(460 * v).toFixed(1)}" height="54" rx="27"/>`
        }).join('') +
        text(500, 700, 'most used language on GitHub', { size: 34, cls: 't ac', weight: 700, opacity: seg(t, w[11], w[15] + 0.2) })
    },
  },
  { // 9 Next: SQL. Typos or type errors: which bites you more? Tell me below.
    headline: 'Next: *SQL*',
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[1] - 0.1, w[1] + 0.3))
      return (big > 0 ? `<g transform="translate(500 160) scale(${big.toFixed(3)})">${text(0, 50, 'SQL', { size: 150, cls: 't m ac', weight: 700 })}</g>` : '') +
        bubble(330, 400, 'Typos?', { size: 36, p: seg(t, w[2], w[2] + 0.3) }) +
        bubble(660, 400, 'Type errors?', { size: 36, mine: false, p: seg(t, w[3] + 0.1, w[4] + 0.3) }) +
        bubble(500, 560, 'Tell me below 👇', { size: 34, mine: false, p: seg(t, w[10], w[11] + 0.3), cls: 't ac' })
    },
  },
]

export default {
  series: 'How languages actually work · 07',
  // Text this episode shows on purpose; the episode test still flags any other "undefined".
  literals: ['undefined', '// just undefined'],
  ...LANGUAGES,
  chapters: [
    { title: 'The bug', from: 0, to: 2 },
    { title: 'How it works', from: 3, to: 6 },
    { title: 'The catch', from: 7, to: 7 },
    { title: 'Next', from: 8, to: 9 },
  ],
  scenes,
}
