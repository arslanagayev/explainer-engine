// Languages 01: C. Compiled straight to machine code, pointers, and memory you can break.
import { arrow, backOut, cross, easeInOut, easeOut, fade, lerp, line, path, pop, rect, seg, text, typed } from '../../engine/lib.js'
import { phone } from '../../engine/props.js'
import { LANGUAGES, cpu, doc, stage } from '../../engine/series-languages.js'

const HELLO = ['#include <stdio.h>', '', 'int main(void) {', '    printf("hello, world\\n");', '    return 0;', '}']

// ---------- Episode props ----------
const badge = (x, y, p = 1) => pop(x, y, p, `<circle class="fa" cx="${x}" cy="${y}" r="26"/>` + text(x, y + 11, 'C', { size: 32, cls: 't m dk', weight: 700 }))
const car = (x, y, p = 1) => path(`M${x - 110} ${y + 20} V${y - 10} L${x - 70} ${y - 20} L${x - 40} ${y - 60} H${x + 40} L${x + 80} ${y - 20} L${x + 110} ${y - 10} V${y + 20} Z`, p) +
  `<circle class="fb" cx="${x - 60}" cy="${y + 22}" r="20" stroke="var(--ink)" stroke-width="5"/><circle class="fb" cx="${x + 60}" cy="${y + 22}" r="20" stroke="var(--ink)" stroke-width="5"/>`
const router = (x, y, p = 1) => rect(x - 100, y - 20, 200, 60, { r: 12, p }) + line(x - 60, y - 20, x - 80, y - 80, p) + line(x + 60, y - 20, x + 80, y - 80, p) +
  [0, 1, 2].map((i) => `<circle class="fa" cx="${x - 40 + i * 40}" cy="${y + 10}" r="6"/>`).join('')
const microwave = (x, y, p = 1) => rect(x - 110, y - 60, 220, 130, { r: 12, p }) + rect(x - 95, y - 45, 140, 100, { r: 8, p, cls: 'ln dim' }) +
  [0, 1, 2].map((i) => `<circle class="fl" cx="${x + 80}" cy="${y - 30 + i * 30}" r="8"/>`).join('')
/** A row of memory cells with addresses; `bad` marks cell index that gets overwritten. */
const memory = (x, y, n, { values = [], lit = -1, bad = -1, badP = 0, labels = true } = {}) =>
  Array.from({ length: n }, (_, i) => {
    const cx = x + i * 110
    const cls = i === bad && badP > 0 ? 'ln ac thick' : i === lit ? 'ln ac' : 'ln dim'
    return rect(cx, y, 100, 90, { r: 10, cls }) + (i === bad && badP > 0 ? `<rect class="fl" x="${cx}" y="${y}" width="100" height="90" rx="10" opacity="${badP.toFixed(2)}"/>` : '') +
      text(cx + 50, y + 58, String(values[i] ?? ''), { size: 32, cls: i === bad && badP > 0.5 ? 't m ac' : 't m', weight: 700 }) +
      (labels ? text(cx + 50, y + 125, `0x${(4096 + i * 4).toString(16)}`, { size: 18, cls: 't m mu' }) : '')
  }).join('')

// ---------- Scenes ----------
const scenes = [
  { // 0 This language is fifty years old, and you used it today.
    headline: '50 years old. *You used it today.*',
    draw: ({ t, w }) => {
      const years = Math.round(50 * easeOut(seg(t, w[2], w[5])))
      return text(500, 230, String(years), { size: 220, cls: 't m ac', weight: 700 }) + text(500, 300, 'YEARS', { size: 30, cls: 't m mu', opacity: seg(t, w[3], w[5]) }) +
        fade(seg(t, w[7], w[8]), move3([[phone, 180, 560, 0.55], [car, 500, 600, 1], [router, 830, 600, 1]]), 20) +
        badge(255, 455, seg(t, w[8], w[8] + 0.3)) + badge(590, 530, seg(t, w[9], w[9] + 0.3)) + badge(920, 530, seg(t, w[10], w[10] + 0.3))
    },
  },
  { // 1 It's C. Born in 1972 at Bell Labs, to rewrite an operating system: Unix.
    headline: "It's *C*",
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[0], w[1] + 0.2))
      return (big > 0 ? `<g transform="translate(240 230) scale(${big.toFixed(3)})">${text(0, 70, 'C', { size: 230, cls: 't m ac', weight: 700 })}</g>` : '') +
        fade(seg(t, w[3], w[4] + 0.2), text(470, 170, '1972', { size: 80, weight: 700, anchor: 'start' }) + text(470, 225, 'Bell Labs', { size: 36, cls: 't mu', anchor: 'start' }), 15) +
        fade(seg(t, w[9], w[11]), rect(150, 400, 700, 280, { r: 18, cls: 'ln' }) + line(150, 450, 850, 450, 1, 'ln dim') + text(190, 435, 'UNIX', { size: 24, cls: 't m mu', anchor: 'start' }) +
          text(190, 530, `$ ${typed('ls', seg(t, w[12], w[13]))}`, { size: 36, cls: 't m', anchor: 'start' }) +
          text(190, 590, typed('unix  kernel.c  shell.c', seg(t, w[13], w[13] + 0.6)), { size: 30, cls: 't m ac', anchor: 'start' }), 20)
    },
  },
  { // 2 C compiles straight to machine code. Nothing in between.
    headline: 'Straight to *machine code*',
    draw: ({ t, w }) => {
      const k = seg(t, w[1], w[5])
      return doc(120, 260, { label: 'hello.c' }) + arrow(210, 260, 290, 260, k, 'ln ac') + stage(400, 260, 200, 110, 'COMPILER', { lit: k > 0 && k < 1, size: 24 }) +
        arrow(505, 260, 585, 260, seg(k, 0.5, 1), 'ln ac') + doc(680, 260, { bin: true, p: seg(k, 0.6, 1), label: 'machine code' }) +
        arrow(680, 400, 680, 470, seg(k, 0.8, 1), 'ln ac') + cpu(680, 590, { s: 0.6, glow: k >= 1 }) +
        fade(seg(t, w[6], w[8]), stage(250, 590, 260, 100, 'VM', { size: 26 }) + cross(250, 590, 50, seg(t, w[7], w[8] + 0.2)), 10)
    },
  },
  { // 3 So it's fast, and it runs almost everywhere.
    headline: 'Fast. *Everywhere.*',
    draw: ({ t, w }) => {
      const needle = -2.4 + 2.1 * easeOut(seg(t, w[1], w[2] + 0.2))
      const gauge = path('M250 420 A200 200 0 0 1 650 420', 1, 'ln dim thick') + path('M250 420 A200 200 0 0 1 650 420', seg(t, w[1], w[2] + 0.2), 'ln ac thick')
      return gauge + line(450, 420, 450 + Math.cos(needle) * 170, 420 + Math.sin(needle) * 170, 1, 'ln ac thick') + `<circle class="fa" cx="450" cy="420" r="14"/>` +
        text(450, 500, 'FAST', { size: 40, cls: 't m ac', weight: 700, opacity: seg(t, w[2], w[3]) }) +
        [0, 1, 2, 3, 4, 5, 6, 7].map((i) => pop(760 + (i % 2) * 110, 220 + Math.floor(i / 2) * 110, seg(t, w[5] + i * 0.08, w[6] + i * 0.08), badge(760 + (i % 2) * 110, 220 + Math.floor(i / 2) * 110))).join('')
    },
  },
  { // 4 Android's Linux kernel? Mostly C. Your car, your router, your microwave? Probably C.
    headline: 'Probably *C*',
    draw: ({ t, w }) => fade(seg(t, 0, 0.4), phone(200, 260, { p: 1 }) + text(200, 260, 'Linux', { size: 30, cls: 't m', weight: 700 }), 10) +
      badge(285, 70, seg(t, w[3], w[4] + 0.2)) +
      fade(seg(t, w[5], w[6] + 0.2), car(650, 230), 15) + badge(770, 160, seg(t, w[11], w[12] + 0.2)) +
      fade(seg(t, w[7], w[8] + 0.2), router(300, 650), 15) + badge(420, 590, seg(t, w[11] + 0.1, w[12] + 0.3)) +
      fade(seg(t, w[9], w[10] + 0.2), microwave(700, 630), 15) + badge(830, 550, seg(t, w[11] + 0.2, w[12] + 0.4)),
  },
  { // 5 Its superpower is pointers: you work with memory addresses directly.
    headline: 'Superpower: *pointers*',
    draw: ({ t, w }) => {
      const k = easeInOut(seg(t, w[5], w[8] + 0.3))
      const target = Math.round(lerp(0, 3, k))
      return memory(110, 380, 7, { values: [7, 42, 3, 99, 0, 15, 8], lit: target }) +
        fade(seg(t, w[2], w[3] + 0.2), text(110, 170, 'int *p = &x;', { size: 40, cls: 't m', anchor: 'start', weight: 700 }) +
          text(110, 240, `p → 0x${(4096 + target * 4).toString(16)}`, { size: 34, cls: 't m ac', anchor: 'start', weight: 700 }), 15) +
        arrow(160 + target * 110, 300, 160 + target * 110, 370, seg(t, w[3], w[4]), 'ln ac thick')
    },
  },
  { // 6 But C trusts you completely. Write past the end of an array, and nothing stops you.
    headline: 'C *trusts* you',
    draw: ({ t, w }) => {
      const badP = seg(t, w[11], w[12] + 0.3)
      return text(110, 200, 'int a[4];', { size: 40, cls: 't m', anchor: 'start', weight: 700 }) +
        text(110, 270, typed('a[4] = 99;   // one too far', seg(t, w[5], w[11])), { size: 34, cls: 't m ac', anchor: 'start' }) +
        rect(100, 360, 450, 110, { r: 14, cls: 'ln ac thin dash' }) + text(325, 520, 'the array', { size: 22, cls: 't m mu' }) +
        memory(110, 370, 6, { values: [1, 2, 3, 4, badP > 0.5 ? 99 : 'id', 'pw'], bad: 4, badP, labels: false }) +
        text(500, 640, 'no error. no warning.', { size: 38, cls: 't ac', weight: 700, opacity: seg(t, w[13], w[15] + 0.2) })
    },
  },
  { // 7 Memory bugs like that cause around seventy percent of serious security bugs in Chrome and Windows.
    headline: 'The price: *security bugs*',
    draw: ({ t, w }) => {
      const k = easeOut(seg(t, w[5], w[7] + 0.3))
      return text(500, 330, `${Math.round(70 * k)}%`, { size: 220, cls: 't m ac', weight: 700 }) +
        rect(150, 400, 700, 40, { r: 20, cls: 'ln dim thin' }) + `<rect class="fa" x="150" y="400" width="${(490 * k).toFixed(1)}" height="40" rx="20"/>` +
        text(500, 520, 'of serious security bugs are memory bugs', { size: 30, cls: 't mu', opacity: seg(t, w[8], w[11]) }) +
        fade(seg(t, w[13], w[15] + 0.2), text(500, 620, 'Chrome · Windows', { size: 40, cls: 't m', weight: 700 }), 15)
    },
  },
  { // 8 Hello, world: the most famous first program ever. A C book made it famous in 1978.
    headline: 'Hello, *world*',
    draw: ({ t, w }) => {
      const typedN = HELLO.join('\n').length * seg(t, w[0], w[7])
      let used = 0
      const rows = HELLO.map((l, i) => { const s = l.slice(0, Math.max(0, Math.round(typedN - used))); used += l.length + 1; return text(140, 180 + i * 56, s, { size: 34, cls: i === 3 ? 't m ac' : 't m', anchor: 'start', weight: i === 3 ? 700 : 500, extra: 'xml:space="preserve"' }) }).join('')
      return rect(100, 90, 800, 440, { r: 18, cls: 'ln' }) + text(140, 130, 'hello.c', { size: 22, cls: 't m mu', anchor: 'start' }) + rows +
        fade(seg(t, w[7], w[8]), rect(100, 560, 800, 90, { r: 14, cls: 'ln ac' }) + text(140, 618, '$ ./hello   →   hello, world', { size: 32, cls: 't m ac', anchor: 'start', weight: 700 }), 10) +
        text(500, 730, 'The C Programming Language · 1978', { size: 28, cls: 't mu', opacity: seg(t, w[10], w[15]) })
    },
  },
  { // 9 Next: C plus plus. What happens when you give C objects?
    headline: 'Next: *C++*',
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[1] - 0.1, w[3] + 0.2))
      return (big > 0 ? `<g transform="translate(500 280) scale(${big.toFixed(3)})">${text(0, 60, 'C++', { size: 200, cls: 't m ac', weight: 700 })}</g>` : '') +
        text(500, 470, 'C + objects = ?', { size: 44, cls: 't m', weight: 700, opacity: seg(t, w[8], w[10] + 0.2) }) +
        fade(seg(t, w[10], w[10] + 0.5), rect(270, 580, 460, 90, { r: 45, cls: 'ln ac' }) + text(500, 638, 'Follow for ep. 02', { size: 34, cls: 't ac', weight: 700 }), 20)
    },
  },
]

/** Draws [prop, x, y, scale] entries; phone is drawn smaller to sit beside the others. */
function move3(items) {
  return items.map(([fn, x, y, s]) => fn === phone
    ? `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${phone(x, y, { p: 1 })}</g>`
    : `<g transform="translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})">${fn(x, y)}</g>`).join('')
}

export default {
  series: 'How languages actually work · 01',
  ...LANGUAGES,
  chapters: [
    { title: 'Origin', from: 0, to: 1 },
    { title: 'How it runs', from: 2, to: 4 },
    { title: 'Pointers', from: 5, to: 7 },
    { title: 'Hello, world', from: 8, to: 9 },
  ],
  scenes,
}
