// Languages 06: JavaScript. Ten days in 1995, not Java, JIT in V8, the typeof null scar, Node.
// Scripted as a Dopamine Loop: the deadline is on screen from the first frame.
import { arrow, backOut, check, clamp, cross, easeInOut, fade, lerp, line, path, pop, rect, seg, text, typed } from '../../engine/lib.js'
import { bubble, pill, server } from '../../engine/props.js'
import { LANGUAGES, BITS, chip, stage } from '../../engine/series-languages.js'

const PRE = 'style="white-space:pre"'

// ---------- Episode props ----------
/** A browser window: frame, title bar with three dots, optional label in the bar. */
const browser = (x, y, w, h, { p = 1, cls = 'ln', label = '' } = {}) =>
  `<rect class="fp" x="${x}" y="${y}" width="${w}" height="${h}" rx="16" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x, y, w, h, { r: 16, p, cls }) + line(x, y + 44, x + w, y + 44, p, 'ln dim thin') +
  [0, 1, 2].map((i) => `<circle class="${i === 0 ? 'fa' : 'fl'}" cx="${x + 26 + i * 22}" cy="${y + 22}" r="6" opacity="${clamp(p * 2 - 1).toFixed(2)}"/>`).join('') +
  (label ? text(x + w - 18, y + 30, label, { size: 20, cls: 't m mu', anchor: 'end', opacity: clamp(p * 2 - 1) }) : '')

/** A tear-off calendar page showing `day`. */
const calendar = (x, y, day, p = 1) =>
  `<rect class="fp" x="${x - 110}" y="${y - 120}" width="220" height="240" rx="22" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x - 110, y - 120, 220, 240, { r: 22, p, cls: 'ln ac' }) +
  `<rect class="fa" x="${x - 110}" y="${y - 120}" width="220" height="56" rx="22" opacity="${clamp(p * 2 - 1).toFixed(2)}"/>` +
  text(x, y - 82, 'DAY', { size: 28, cls: 't m', weight: 700, opacity: clamp(p * 2 - 1), extra: 'style="fill:#141414"' }) +
  text(x, y + 72, String(day), { size: 130, cls: 't m', weight: 700, opacity: clamp(p * 2 - 1) })

/** A code panel; each line is [text, cls]. */
const panel = (x, y, w, h, title, lines, { size = 28, cls = 'ln' } = {}) =>
  `<rect class="fp" x="${x}" y="${y}" width="${w}" height="${h}" rx="18"/>` + rect(x, y, w, h, { r: 18, cls }) +
  text(x + w - 24, y + 38, title, { size: 22, cls: 't m mu', anchor: 'end' }) +
  lines.map(([s, c], i) => text(x + 32, y + 84 + i * (size + 16), s, { size, cls: c || 't m', anchor: 'start', extra: PRE })).join('')

/** A jagged crack drawn from (x, y) to the right. */
const crack = (x, y, w, p, seed = 0) => {
  const pts = Array.from({ length: 9 }, (_, i) => `${(x + (w * i) / 8).toFixed(1)} ${(y + (i % 2 ? -1 : 1) * (18 + ((i * 37 + seed) % 23))).toFixed(1)}`)
  return path(`M${pts.join(' L')}`, p, 'ln ac thick')
}

const JS_LINES = ['button.onclick = () => {', '  count++', '  label.textContent = count', '}']

// ---------- Scenes ----------
const scenes = [
  { // 0 Ten days. That's all one programmer got to build the first version of the language behind almost every website.
    headline: 'Built in *10 days*',
    draw: ({ t, w }) => {
      // The calendar flips from day 1 to day 10 in the first second: motion from the very first frame.
      const day = 1 + Math.min(9, Math.floor(seg(t, 0, w[1] + 0.25) * 9.999))
      const code = seg(t, w[2], w[12])
      const sites = seg(t, w[16], w[18] + 0.3)
      // Big and centred while the deadline is the story, then it steps aside for the code.
      const aside = easeInOut(seg(t, w[2], w[2] + 0.6))
      const cx = lerp(500, 220, aside), cy = lerp(330, 200, aside), cs = lerp(1.75, 1, aside)
      return `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) scale(${cs.toFixed(3)}) translate(-220 -200)">${calendar(220, 200, day, 1)}</g>` +
        (day === 10 && aside > 0.9 ? pill(220, 365, '10 days', { size: 30, box: 'ln ac', cls: 'ac' }) : '') +
        fade(seg(t, w[2], w[3]), browser(420, 70, 500, 300, { label: 'first version' }) +
          JS_LINES.map((s, i) => text(452, 170 + i * 48, typed(s, seg(code, i / 4, (i + 1) / 4)), { size: 26, cls: 't m', anchor: 'start', extra: PRE })).join(''), 10) +
        Array.from({ length: 8 }, (_, i) => {
          const x = 130 + (i % 4) * 190, y = 470 + Math.floor(i / 4) * 150
          return pop(x + 80, y + 55, seg(sites, i / 10, i / 10 + 0.4), browser(x, y, 160, 110, { cls: 'ln dim' }) +
            text(x + 80, y + 94, 'JS', { size: 34, cls: 't m ac', weight: 700 }))
        }).join('')
    },
  },
  { // 1 1995. Netscape needed it inside their browser, fast.
    headline: 'Netscape needed it *fast*',
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[0] - 0.1, w[0] + 0.35))
      const fast = seg(t, w[7], w[7] + 0.6)
      const hand = (t - w[7]) * 900 * (fast > 0 ? 1 : 0)
      return (big > 0 ? `<g transform="translate(500 160) scale(${big.toFixed(3)})">${text(0, 55, '1995', { size: 170, cls: 't m ac', weight: 700 })}</g>` : '') +
        fade(seg(t, w[1], w[2] + 0.2), browser(150, 300, 470, 330, { label: 'Netscape Navigator' }) +
          rect(190, 380, 390, 40, { r: 10, cls: 'ln dim thin' }) + rect(190, 450, 260, 30, { r: 10, cls: 'ln dim thin' }) +
          pop(385, 560, seg(t, w[4], w[5] + 0.3), pill(385, 560, 'needs a language', { size: 26, box: 'ln ac', cls: 'ac' })), 15) +
        pop(790, 465, seg(t, w[7] - 0.1, w[7] + 0.3),
          `<circle class="fp" cx="790" cy="465" r="120"/><circle class="ln ac glow" cx="790" cy="465" r="120"/>` +
          line(790, 465, 790 + 92 * Math.sin(hand * Math.PI / 180), 465 - 92 * Math.cos(hand * Math.PI / 180), 1, 'ln ac thick') +
          line(790, 330, 790, 345, 1, 'ln ac') + text(790, 640, 'fast.', { size: 40, cls: 't ac', weight: 700 }))
    },
  },
  { // 2 So how did a ten-day language take over the whole web?
    headline: 'Took over *the web*?',
    draw: ({ t, w }) => {
      const grow = seg(t, w[5], w[9] + 0.4)
      return Array.from({ length: 12 }, (_, i) => {
        const x = 90 + (i % 4) * 210, y = 40 + Math.floor(i / 4) * 175
        const lit = grow * 12 > i
        return pop(x + 90, y + 70, seg(grow, i / 14, i / 14 + 0.3), browser(x, y, 180, 140, { cls: lit ? 'ln ac' : 'ln dim' }) +
          text(x + 90, y + 112, 'JS', { size: 36, cls: lit ? 't m ac' : 't m mu', weight: 700 }))
      }).join('') +
        pop(500, 640, seg(t, w[10] - 0.2, w[10] + 0.3), `<circle class="fp" cx="500" cy="640" r="70"/><circle class="ln ac glow" cx="500" cy="640" r="70"/>` +
          text(500, 668, '?', { size: 84, cls: 't m ac', weight: 700 }))
    },
  },
  { // 3 First twist: it has nothing to do with Java. The name was a marketing trick.
    headline: '*Not* Java',
    draw: ({ t, w }) => {
      const neq = seg(t, w[8] - 0.2, w[8] + 0.3)
      const names = seg(t, w[10], w[14] + 0.2)
      const steps = [['Mocha', 160], ['LiveScript', 430], ['JavaScript', 740]]
      return pop(200, 150, seg(t, w[6], w[8]), pill(200, 150, 'Java', { size: 54 })) +
        pop(705, 150, seg(t, w[6], w[8]), pill(705, 150, 'JavaScript', { size: 54, box: 'ln ac', cls: 'ac' })) +
        (neq > 0 ? text(402, 182, '≠', { size: 110, cls: 't m ac', weight: 700, opacity: neq }) : '') +
        text(500, 300, 'nothing in common but the name', { size: 30, cls: 't mu', weight: 600, opacity: seg(t, w[8], w[9] + 0.2) }) +
        steps.map(([s, x], i) => pop(x, 470, seg(names, i / 3, i / 3 + 0.35), pill(x, 470, s, { size: 30, box: i === 2 ? 'ln ac' : 'ln', cls: i === 2 ? 'ac' : '' })) +
          (i < 2 ? arrow(x + (i === 0 ? 90 : 140), 470, steps[i + 1][1] - (i === 0 ? 140 : 140), 470, seg(names, i / 3 + 0.2, i / 3 + 0.4), 'ln dim') : '')).join('') +
        pop(500, 640, seg(t, w[12], w[13] + 0.3), rect(250, 595, 500, 90, { r: 45, cls: 'ln ac glow' }) +
          text(500, 652, 'marketing 🎯', { size: 40, cls: 't ac', weight: 700 }))
    },
  },
  { // 4 And it isn't slow. Engines like V8 find your busiest code and compile it to machine code while the page runs.
    headline: 'Hot code → *machine code*',
    draw: ({ t, w }) => {
      const heat = seg(t, w[7], w[9] + 0.3)
      const compile = seg(t, w[12], w[16] + 0.2)
      const lines = [['function add(a, b) {', ''], ['  return a + b', ''], ['}', ''], ['for (…) add(i, 1)', '']]
      return pop(170, 90, seg(t, w[6] - 0.15, w[6] + 0.3), stage(170, 90, 200, 90, 'V8', { lit: true, size: 44 })) +
        panel(60, 180, 480, 300, 'app.js', lines.map(([s], i) => [s, i === 1 && heat > 0.5 ? 't m ac' : 't m']), { size: 26 }) +
        `<rect class="fa" x="72" y="${180 + 84 + 42 - 30}" width="${(456 * heat).toFixed(1)}" height="40" rx="8" opacity="0.22"/>` +
        text(560, 312, heat > 0.2 ? '🔥 hot' : '', { size: 30, cls: 't m ac', anchor: 'start', weight: 700, opacity: heat }) +
        arrow(300, 500, 300, 590, compile, 'ln ac') +
        fade(seg(compile, 0.4, 1), rect(60, 600, 480, 110, { r: 18, cls: 'ln ac glow' }) +
          text(300, 642, 'machine code', { size: 28, cls: 't m ac', weight: 700 }) +
          text(300, 688, BITS(24, 6 + Math.floor(t * 8)), { size: 24, cls: 't m mu' }), 10) +
        pop(780, 560, seg(t, w[18], w[20] + 0.3), browser(650, 450, 260, 220, { cls: 'ln ac', label: 'page runs' }) +
          check(780, 580, 50, seg(t, w[19], w[20] + 0.4)))
    },
  },
  { // 5 But the rush left scars.
    headline: 'The rush left *scars*',
    draw: ({ t, w }) => {
      const tear = seg(t, w[2], w[4] + 0.2)
      return calendar(500, 260, 10, 1) +
        crack(150, 470, 700, tear, 3) + crack(240, 600, 520, seg(tear, 0.3, 1), 11) +
        text(500, 720, 'bugs from day 1 → still here', { size: 34, cls: 't mu', weight: 700, opacity: seg(t, w[3], w[4] + 0.3) })
    },
  },
  { // 6 Type of null says object. That bug is from the first ten days, and it can't be fixed now. Fixing it would break existing websites.
    headline: 'typeof null → *"object"*',
    draw: ({ t, w }) => {
      const ask = seg(t, w[0], w[2] + 0.2)
      const ans = seg(t, w[3], w[4] + 0.2)
      const breakP = seg(t, w[21], w[23] + 0.3)
      return panel(80, 30, 840, 230, 'console', [
        ['> ' + typed('typeof null', ask), 't m'],
        [ans > 0 ? '"object"' : '', 't m ac'],
      ], { size: 40 }) +
        (ans > 0.6 ? text(400, 200, '← a bug', { size: 32, cls: 't ac', anchor: 'start', weight: 700, opacity: ans }) : '') +
        pop(500, 330, seg(t, w[8], w[10] + 0.3), pill(500, 330, 'since day 1 · 1995', { size: 28 })) +
        pop(500, 430, seg(t, w[15], w[17] + 0.3), pill(500, 430, "can't be fixed", { size: 30, box: 'ln ac', cls: 'ac' })) +
        Array.from({ length: 4 }, (_, i) => {
          const x = 90 + i * 210
          return fade(seg(t, w[19], w[20] + 0.2), browser(x, 520, 180, 150, { cls: breakP > i / 4 ? 'ln ac' : 'ln dim' }) +
            cross(x + 90, 610, 34, seg(breakP, i / 4, i / 4 + 0.3)), 0)
        }).join('')
    },
  },
  { // 7 Then in 2009, Node took it out of the browser. Now it runs servers too.
    headline: 'Out of the *browser*',
    draw: ({ t, w }) => {
      const out = seg(t, w[4], w[9] + 0.2)
      const x = 260 + (740 - 260) * out
      const y = 360 - Math.sin(out * Math.PI) * 120
      return pill(500, 70, '2009 · Node.js', { size: 34, p: seg(t, w[1], w[2] + 0.3), box: 'ln ac', cls: 'ac' }) +
        browser(90, 230, 340, 280, { cls: out < 0.5 ? 'ln ac' : 'ln dim', label: 'browser' }) +
        pop(740, 400, seg(t, w[12], w[13] + 0.3), server(740, 420, 1, t) + text(740, 560, 'servers', { size: 30, weight: 700 })) +
        chip(x, y, 'JS', 1) +
        text(500, 690, 'one language, both sides', { size: 34, cls: 't ac', weight: 700, opacity: seg(t, w[13], w[14] + 0.3) })
    },
  },
  { // 8 Next: TypeScript. Has a JavaScript quirk ever bitten you? Tell me below.
    headline: 'Next: *TypeScript*',
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[1] - 0.1, w[1] + 0.3))
      return (big > 0 ? `<g transform="translate(500 170) scale(${big.toFixed(3)})">${text(0, 50, 'TypeScript', { size: 120, cls: 't m ac', weight: 700 })}</g>` : '') +
        text(500, 300, typed('let count: number = 0', seg(t, w[1], w[2] + 0.4)), { size: 36, cls: 't m', weight: 600 }) +
        bubble(500, 470, 'Has a JS quirk bitten you?', { size: 30, p: seg(t, w[2], w[3] + 0.3) }) +
        bubble(560, 590, 'Tell me below 👇', { size: 30, mine: false, p: seg(t, w[9], w[10] + 0.3), cls: 't ac' })
    },
  },
]

export default {
  series: 'How languages actually work · 06',
  ...LANGUAGES,
  chapters: [
    { title: 'Origin', from: 0, to: 3 },
    { title: 'How it runs', from: 4, to: 4 },
    { title: 'The scars', from: 5, to: 6 },
    { title: 'Next', from: 7, to: 8 },
  ],
  scenes,
}
