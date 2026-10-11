// Languages 04: C#. The name joke, IL + the .NET runtime, and async/await.
import { arrow, backOut, check, cross, fade, line, path, pop, rect, seg, text, typed } from '../../engine/lib.js'
import { laptop, phone, pill, server } from '../../engine/props.js'
import { LANGUAGES, doc, stage } from '../../engine/series-languages.js'

const IL = ['ldstr "hello"', 'call Console.WriteLine', 'ret']

// ---------- Episode props ----------
/** A game card: rounded tile with a simple glyph and a title underneath. */
const card = (x, y, title, glyph, p) => pop(x, y, p,
  `<rect class="fp" x="${x - 130}" y="${y - 150}" width="260" height="300" rx="28"/>` + rect(x - 130, y - 150, 260, 300, { r: 28 }) +
  glyph + text(x, y + 110, title, { size: 30, weight: 700 }))
/** The sharp sign: two slanted uprights and two crossbars, centred on (x, y). */
const sharp = (x, y, s, p, cls = 'ln ac thick') =>
  path(`M${x - 30 * s} ${y + 110 * s} L${x - 10 * s} ${y - 110 * s}`, seg(p, 0, 0.3), cls) +
  path(`M${x + 30 * s} ${y + 110 * s} L${x + 50 * s} ${y - 110 * s}`, seg(p, 0.2, 0.5), cls) +
  path(`M${x - 85 * s} ${y - 40 * s} H${x + 95 * s}`, seg(p, 0.45, 0.75), cls) +
  path(`M${x - 95 * s} ${y + 40 * s} H${x + 85 * s}`, seg(p, 0.7, 1), cls)
const plus = (x, y, r, p, cls = 'ln ac thick') => path(`M${x - r} ${y} H${x + r}`, p, cls) + path(`M${x} ${y - r} V${y + r}`, p, cls)
/** A loading ring: spins while `spin` is true, otherwise frozen at a fixed angle. */
const spinner = (x, y, t, spin, cls = 'ln ac thick') => {
  const a = spin ? t * 360 : 40
  return `<g transform="rotate(${a.toFixed(1)} ${x} ${y})">${path(`M${x + 34} ${y} A34 34 0 1 1 ${x} ${y - 34}`, 1, cls)}</g>`
}
const cube = (x, y, s, cls = 'ln ac') =>
  path(`M${x} ${y - s} L${x + s} ${y - s / 2} L${x} ${y} L${x - s} ${y - s / 2} Z M${x - s} ${y - s / 2} V${y + s / 2} L${x} ${y + s} L${x + s} ${y + s / 2} V${y - s / 2} M${x} ${y} V${y + s}`, 1, cls)

// ---------- Scenes ----------
const scenes = [
  { // 0 Among Us, Hollow Knight and Pokémon GO have one thing in common: this language.
    headline: 'Three hits. *One language.*',
    draw: ({ t, w }) => {
      const games = [
        [180, 'Among Us', `<rect class="ln ac" x="150" y="160" width="60" height="90" rx="28"/><rect class="ln ac" x="168" y="180" width="50" height="26" rx="13"/>`, 0],
        [500, 'Hollow Knight', path('M470 250 V180 Q470 130 500 130 Q530 130 530 180 V250 M478 150 L452 108 M522 150 L548 108', 1, 'ln ac'), 2],
        [820, 'Pokémon GO', `<circle class="ln ac" cx="820" cy="190" r="55"/>` + line(765, 190, 875, 190, 1, 'ln ac') + `<circle class="ln ac" cx="820" cy="190" r="16"/>`, 5],
      ]
      const join = seg(t, w[12], w[13] + 0.3)
      return games.map(([x, title, glyph, wi]) => card(x, 200, title, glyph, seg(t, w[wi] - 0.1, w[wi] + 0.35)) +
        arrow(x, 360, 500, 540, join, 'ln ac')).join('') +
        pop(500, 610, seg(t, w[12] + 0.2, w[13] + 0.4), `<circle class="fp" cx="500" cy="610" r="70"/><circle class="ln ac glow" cx="500" cy="610" r="70"/>` +
          text(500, 638, '?', { size: 80, cls: 't m ac', weight: 700 }))
    },
  },
  { // 1 It's C sharp. Microsoft, 2000. Designed by Anders Hejlsberg, who later created TypeScript too.
    headline: "It's *C#*",
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[1] - 0.1, w[2] + 0.2))
      return (big > 0 ? `<g transform="translate(500 190) scale(${big.toFixed(3)})">${text(0, 60, 'C#', { size: 190, cls: 't m ac', weight: 700 })}</g>` : '') +
        text(500, 380, '2000 · Microsoft', { size: 40, weight: 700, opacity: seg(t, w[3], w[4] + 0.2) }) +
        fade(seg(t, w[7], w[8] + 0.2), rect(200, 470, 600, 100, { r: 50 }) + text(500, 532, 'Anders Hejlsberg', { size: 40, weight: 700 }), 15) +
        arrow(500, 580, 500, 650, seg(t, w[11], w[12]), 'ln ac') +
        pop(500, 700, seg(t, w[12], w[12] + 0.4), pill(500, 700, 'TypeScript', { size: 34, box: 'ln ac', cls: 'ac' }))
    },
  },
  { // 2 The name is a joke: the sharp sign is four plus signs. C plus plus, plus plus.
    headline: 'The name is a *joke*',
    draw: ({ t, w }) => {
      const split = seg(t, w[9], w[11])
      const quads = [[-70, -70], [70, -70], [-70, 70], [70, 70]]
      const word = ['C', '++', '++']
      const shown = t < w[12] ? 0 : t < w[13] ? 1 : t < w[15] ? 2 : 3
      return `<g opacity="${(1 - split).toFixed(3)}">${sharp(500, 300, 1.2, seg(t, w[6] - 0.3, w[7] + 0.3))}</g>` +
        quads.map(([dx, dy], i) => pop(500 + dx * 1.3, 300 + dy * 1.3, seg(split, i * 0.15, i * 0.15 + 0.5), plus(500 + dx * 1.3, 300 + dy * 1.3, 44, 1))).join('') +
        text(500, 680, word.slice(0, shown).join(''), { size: 120, cls: 't m ac', weight: 700 })
    },
  },
  { // 3 Like Java, it compiles to an in-between language called IL. On your device, the dot NET runtime turns it into machine code.
    headline: 'It compiles to *IL*',
    draw: ({ t, w }) => {
      const k = seg(t, w[3], w[9])
      const jit = seg(t, w[13], w[18])
      return pill(500, 40, 'like Java ☕', { size: 26, p: seg(t, 0, w[1] + 0.3) }) +
        doc(120, 230, { label: 'Program.cs' }) + arrow(210, 230, 290, 230, seg(k, 0, 0.3), 'ln ac') +
        stage(390, 230, 180, 100, 'compiler', { lit: k > 0 && k < 1, size: 26 }) + arrow(485, 230, 560, 230, seg(k, 0.4, 0.7), 'ln ac') +
        fade(seg(k, 0.6, 1), rect(580, 130, 380, 200, { r: 16, cls: 'ln ac dash' }) + text(770, 170, 'Program.dll · IL', { size: 22, cls: 't m mu' }) +
          IL.map((s, i) => text(605, 220 + i * 38, s, { size: 22, cls: 't m ac', anchor: 'start' })).join(''), 10) +
        arrow(770, 340, 600, 480, seg(t, w[10], w[12]), 'ln ac') +
        stage(470, 560, 300, 100, '.NET runtime', { p: seg(t, w[13], w[16]), lit: jit > 0.5 && t < w[21], size: 30 }) +
        arrow(625, 560, 700, 560, seg(t, w[19], w[20]), 'ln ac') +
        fade(seg(t, w[20], w[21] + 0.2), doc(800, 560, { bin: true, lit: 1, label: 'machine code' }), 10)
    },
  },
  { // 4 Its superpower: async and await. Your app waits for the internet without freezing.
    headline: 'Superpower: *async/await*',
    draw: ({ t, w }) => {
      const code = [['async Task Load() {', 0], ['  var page = await', 1], ['    http.GetAsync(url);', 1], ['}', 0]]
      const ty = seg(t, w[2] - 0.1, w[4] + 0.4)
      const apps = seg(t, w[6], w[8])
      const frozen = 270, smooth = 730
      return rect(140, 20, 720, 230, { r: 18 }) +
        code.map(([s, ind], i) => text(180, 80 + i * 46, typed(s, seg(ty, i * 0.25, i * 0.25 + 0.3)), { size: 30, cls: s.includes('async') || s.includes('await') ? 't m ac' : 't m', anchor: 'start', extra: 'style="white-space:pre"' })).join('') +
        fade(apps, `<g transform="translate(${frozen} 530) scale(0.8) translate(${-frozen} -530)">${phone(frozen, 530, { cls: 'ln dim' })}</g>` +
          spinner(frozen, 500, t, false, 'ln dim thick') + text(frozen, 760, 'blocking', { size: 30, cls: 't m mu', weight: 700 }), 15) +
        fade(apps, `<g transform="translate(${smooth} 530) scale(0.8) translate(${-smooth} -530)">${phone(smooth, 530, { cls: 'ln ac' })}</g>` +
          spinner(smooth, 470, t, true) + [0, 1, 2].map((i) => line(smooth - 60, 560 + i * 34, smooth + 60 - i * 30, 560 + i * 34, seg(t, w[9] + i * 0.2, w[10] + i * 0.2), 'ln ac thin')).join('') +
          text(smooth, 760, 'await', { size: 30, cls: 't m ac', weight: 700 }), 15) +
        cross(frozen, 500, 44, seg(t, w[11], w[12] + 0.2)) + check(smooth, 640, 34, seg(t, w[11] + 0.2, w[12] + 0.4))
    },
  },
  { // 5 JavaScript, Python and Rust liked it so much, they copied it.
    headline: 'Everyone *copied it*',
    draw: ({ t, w }) => {
      const langs = [['JavaScript', '2017', 180, 0], ['Python', '2015', 500, 1], ['Rust', '2019', 820, 3]]
      return pop(500, 150, seg(t, 0, 0.5), pill(500, 150, 'async / await', { size: 40, box: 'ln ac glow', cls: 'ac' })) +
        text(500, 235, 'C# · 2012', { size: 28, cls: 't m mu', opacity: seg(t, 0.2, 0.7) }) +
        langs.map(([name, year, x, wi]) => arrow(500, 270, x, 450, seg(t, w[wi] - 0.2, w[wi] + 0.3), 'ln ac') +
          pop(x, 510, seg(t, w[wi], w[wi] + 0.4), pill(x, 510, name, { size: 30 })) +
          text(x, 590, year, { size: 26, cls: 't m mu', opacity: seg(t, w[wi] + 0.2, w[wi] + 0.6) })).join('') +
        pop(500, 700, seg(t, w[9], w[10] + 0.2), rect(330, 650, 340, 100, { r: 50, cls: 'ln ac' }) + text(500, 712, 'copied ✓', { size: 40, cls: 't ac', weight: 700 }))
    },
  },
  { // 6 Today it runs Unity games, Windows apps, and huge web backends.
    headline: 'Where it *runs*',
    draw: ({ t, w }) => [
      ['Unity games', 3, 150, (x, y) => cube(x, y, 42)],
      ['Windows apps', 5, 380, (x, y) => `<g transform="translate(${x} ${y}) scale(0.42) translate(${-x} ${-y})">${laptop(x, y + 10)}</g>`],
      ['Web backends', 9, 610, (x, y) => `<g transform="translate(${x} ${y}) scale(0.45) translate(${-x} ${-y})">${server(x, y + 10, 1, t)}</g>`],
    ].map(([name, wi, y, icon]) => pop(500, y, seg(t, w[wi] - 0.1, w[wi] + 0.3),
      rect(160, y - 80, 680, 160, { r: 26 }) + icon(290, y) + text(560, y + 16, name, { size: 46, weight: 700 }))).join(''),
  },
  { // 7 Next: Python. The language that reads almost like English.
    headline: 'Next: *Python*',
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[1] - 0.1, w[1] + 0.3))
      return (big > 0 ? `<g transform="translate(500 210) scale(${big.toFixed(3)})">${text(0, 55, 'Python', { size: 160, cls: 't m ac', weight: 700 })}</g>` : '') +
        text(500, 430, typed('print("hello")', seg(t, w[4], w[8])), { size: 44, cls: 't m', weight: 600 }) +
        fade(seg(t, w[6], w[6] + 0.5), rect(270, 580, 460, 90, { r: 45, cls: 'ln ac' }) + text(500, 638, 'Follow for ep. 05', { size: 34, cls: 't ac', weight: 700 }), 20)
    },
  },
]

export default {
  series: 'How languages actually work · 04',
  ...LANGUAGES,
  chapters: [
    { title: 'Origin', from: 0, to: 2 },
    { title: 'IL + .NET', from: 3, to: 3 },
    { title: 'async/await', from: 4, to: 5 },
    { title: 'Where', from: 6, to: 7 },
  ],
  scenes,
}
