// Languages 05: Python. The name, indentation as syntax, bytecode + interpreter, and the C under AI.
import { arrow, backOut, cross, fade, line, path, pop, rect, seg, text, typed } from '../../engine/lib.js'
import { gear, phone, pill, server } from '../../engine/props.js'
import { LANGUAGES, doc, stage } from '../../engine/series-languages.js'

const BYTECODE = ['LOAD_NAME   print', "LOAD_CONST  'hi'", 'CALL        1', 'RETURN_CONST None']
const PRE = 'style="white-space:pre"'

// ---------- Episode props ----------
/** A tiny neural network: three layers of nodes joined by thin lines. */
const net = (x, y, p, cls = 'ln ac') => {
  const layers = [[-90, [-60, 0, 60]], [0, [-90, -30, 30, 90]], [90, [-30, 30]]]
  let out = ''
  for (let l = 0; l < 2; l++) for (const a of layers[l][1]) for (const b of layers[l + 1][1])
    out += line(x + layers[l][0], y + a, x + layers[l + 1][0], y + b, seg(p, 0.2 + l * 0.3, 0.6 + l * 0.3), 'ln ac thin')
  return out + layers.flatMap(([dx, ys]) => ys.map((dy) => `<circle class="fp" cx="${x + dx}" cy="${y + dy}" r="16" opacity="${Math.min(1, p * 3).toFixed(2)}"/>` +
    path(`M${x + dx - 16} ${y + dy} a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0`, p, cls))).join('')
}
/** A wavy snake drawn left to right, with a head on the end. */
const snake = (x, y, w, p) => {
  const pts = Array.from({ length: 41 }, (_, i) => `${(x + (w * i) / 40).toFixed(1)} ${(y + Math.sin(i / 40 * Math.PI * 3) * 40).toFixed(1)}`)
  return path(`M${pts.join(' L')}`, p, 'ln thick') + (p >= 1 ? `<circle class="fp" cx="${x + w + 16}" cy="${y}" r="24"/>` + path(`M${x + w - 8} ${y} a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0`, 1, 'ln thick') : '')
}
const tree = (x, y, p) => pop(x, y, p,
  path(`M${x} ${y - 90} L${x + 45} ${y - 30} H${x + 20} L${x + 65} ${y + 30} H${x - 65} L${x - 20} ${y - 30} H${x - 45} Z M${x} ${y + 30} V${y + 60}`, 1, 'ln ac') +
  text(x, y + 105, 'Christmas', { size: 26, cls: 't m mu' }))
/** A code panel; each line is [text, cls]. */
const panel = (x, y, w, h, title, lines, { size = 28, cls = 'ln' } = {}) =>
  `<rect class="fp" x="${x}" y="${y}" width="${w}" height="${h}" rx="18"/>` + rect(x, y, w, h, { r: 18, cls }) +
  text(x + w - 24, y + 38, title, { size: 22, cls: 't m mu', anchor: 'end' }) +
  lines.map(([s, c], i) => text(x + 32, y + 84 + i * (size + 16), s, { size, cls: c || 't m', anchor: 'start', extra: PRE })).join('')
const bar = (x, y, w, label, k, lit) => text(x, y + 20, label, { size: 36, cls: lit ? 't m ac' : 't m', anchor: 'start', weight: 700 }) +
  rect(x + 170, y - 18, w, 50, { r: 25, cls: 'ln dim thin' }) +
  `<rect class="${lit ? 'fa' : 'fl'}" x="${x + 170}" y="${y - 18}" width="${(w * k).toFixed(1)}" height="50" rx="25"/>`

// ---------- Scenes ----------
const scenes = [
  { // 0 Instagram's servers, and almost every AI you've used, run on this language.
    headline: 'Your feed. *Your AI.*',
    draw: ({ t, w }) => {
      const join = seg(t, w[10], w[11] + 0.3)
      return pop(250, 210, seg(t, w[0] - 0.1, w[1] + 0.2), `<g transform="translate(250 200) scale(0.62) translate(-250 -200)">${phone(250, 200, { cls: 'ln' })}</g>` +
          server(250, 220, 1, t) + text(250, 400, 'Instagram servers', { size: 28, weight: 700 })) +
        pop(750, 210, seg(t, w[4], w[5] + 0.3), net(750, 200, seg(t, w[4], w[7])) + text(750, 400, 'AI models', { size: 28, weight: 700 })) +
        arrow(250, 430, 470, 560, join, 'ln ac') + arrow(750, 430, 530, 560, join, 'ln ac') +
        pop(500, 630, seg(t, w[10] + 0.2, w[11] + 0.4), `<circle class="fp" cx="500" cy="630" r="70"/><circle class="ln ac glow" cx="500" cy="630" r="70"/>` +
          text(500, 658, '?', { size: 80, cls: 't m ac', weight: 700 }))
    },
  },
  { // 1 It's Python. Guido van Rossum started it over Christmas, 1989.
    headline: "It's *Python*",
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[1] - 0.1, w[1] + 0.3))
      return (big > 0 ? `<g transform="translate(500 190) scale(${big.toFixed(3)})">${text(0, 55, 'Python', { size: 170, cls: 't m ac', weight: 700 })}</g>` : '') +
        fade(seg(t, w[2], w[4] + 0.2), rect(200, 340, 600, 100, { r: 50 }) + text(500, 402, 'Guido van Rossum', { size: 40, weight: 700 }), 15) +
        tree(380, 600, seg(t, w[8] - 0.1, w[8] + 0.4)) +
        text(600, 620, '1989', { size: 80, cls: 't m', weight: 700, anchor: 'start', opacity: seg(t, w[9], w[9] + 0.4) })
    },
  },
  { // 2 And no, it's not named after the snake. It's named after Monty Python, the comedy show.
    headline: 'Not the *snake*',
    draw: ({ t, w }) => {
      const cut = seg(t, w[7], w[8])
      return `<g opacity="${(1 - seg(t, w[9], w[11]) * 0.7).toFixed(3)}">${snake(260, 230, 440, seg(t, w[4], w[7]))}${cross(500, 230, 120, cut)}</g>` +
        pop(500, 520, seg(t, w[11] - 0.1, w[12] + 0.3), rect(220, 450, 560, 140, { r: 70, cls: 'ln ac glow' }) + text(500, 540, 'Monty Python', { size: 60, cls: 't ac', weight: 700 })) +
        text(500, 680, 'the comedy show 🎬', { size: 38, cls: 't mu', weight: 600, opacity: seg(t, w[13], w[15]) })
    },
  },
  { // 3 Python reads almost like English. No semicolons, no curly braces. The indentation is the code.
    headline: 'Reads like *English*',
    draw: ({ t, w }) => {
      const py = seg(t, w[9], w[10] + 0.2)
      const indent = seg(t, w[11], w[12] + 0.2)
      const cLines = [['if (ready) {', ''], ['  print("hi");', ''], ['}', '']]
      return `<g opacity="${(1 - py * 0.6).toFixed(3)}">${panel(120, 20, 760, 250, 'other languages', cLines, { size: 34 })}</g>` +
        cross(419, 142, 16, seg(t, w[5], w[6] + 0.3)) +
        fade(seg(t, w[7], w[9]), cross(378, 92, 16, seg(t, w[8], w[9] + 0.2)) + cross(163, 192, 16, seg(t, w[8] + 0.1, w[9] + 0.3)), 0) +
        fade(py, panel(120, 340, 760, 250, 'Python', [['if ready:', 't m'], ['    print("hi")', 't m']], { size: 34, cls: 'ln ac' }) +
          `<rect class="fa" x="152" y="${470 - 30}" width="${(84 * indent).toFixed(1)}" height="42" rx="8" opacity="0.35"/>`, 15) +
        text(500, 700, 'indentation = structure', { size: 36, cls: 't ac', weight: 700, opacity: seg(t, w[12], w[14] + 0.2) })
    },
  },
  { // 4 You never compile it yourself. Python turns your file into bytecode, and an interpreter runs it, step by step.
    headline: 'Bytecode, *step by step*',
    draw: ({ t, w }) => {
      const k = seg(t, w[5], w[10] + 0.3)
      const run = seg(t, w[14], w[18] + 0.3)
      const step = Math.min(BYTECODE.length - 1, Math.floor(run * BYTECODE.length))
      return pill(500, 40, 'no compile step', { size: 26, p: seg(t, w[1], w[4]) }) +
        doc(140, 240, { label: 'hello.py' }) + arrow(230, 240, 330, 240, seg(k, 0, 0.5), 'ln ac') +
        fade(seg(k, 0.5, 1), panel(350, 120, 600, 260, 'bytecode', BYTECODE.map((s, i) => [s, run > 0 && i === step ? 't m ac' : 't m mu']), { size: 26, cls: 'ln ac dash' }), 10) +
        (run > 0 ? `<rect class="fa" x="356" y="${204 - 26 + step * 42 - 6}" width="8" height="34" rx="4"/>` : '') +
        arrow(650, 390, 650, 470, seg(t, w[12], w[13]), 'ln ac') +
        stage(650, 540, 300, 100, 'interpreter', { p: seg(t, w[12], w[13] + 0.3), lit: run > 0 && run < 1, size: 30 }) +
        text(250, 555, run >= 1 ? '▶ hi' : '', { size: 44, cls: 't m ac', weight: 700 })
    },
  },
  { // 5 The catch: it's slow. Often ten to a hundred times slower than C.
    headline: 'The catch: *slow*',
    draw: ({ t, w }) => {
      const go = seg(t, w[3], w[3] + 0.5)
      const slow = seg(t, w[3], w[12] + 4)
      return bar(110, 200, 620, 'C', go, true) + text(920, 222, go >= 1 ? '✓' : '', { size: 44, cls: 't ac', weight: 700 }) +
        bar(110, 330, 620, 'Python', slow, false) +
        pop(500, 560, seg(t, w[5], w[9]), text(500, 600, '10–100×', { size: 130, cls: 't m ac', weight: 700 })) +
        text(500, 690, 'slower than C', { size: 40, cls: 't mu', weight: 600, opacity: seg(t, w[10], w[12] + 0.2) })
    },
  },
  { // 6 The trick: the heavy lifting in AI happens in libraries written in C and C plus plus. Python just tells them what to do.
    headline: 'C does the *heavy lifting*',
    draw: ({ t, w }) => {
      const tell = seg(t, w[18], w[20])
      const engines = [[210, 'NumPy', 'C', 9], [500, 'PyTorch', 'C++', 12], [790, 'TensorFlow', 'C++', 14]]
      return stage(500, 110, 300, 100, 'Python', { lit: tell > 0, size: 40, p: seg(t, 0, 0.5) }) +
        text(500, 210, tell > 0 ? '"do this"' : '', { size: 28, cls: 't m mu' }) +
        engines.map(([x, lib, lang, wi]) => arrow(500, 230, x, 380, seg(tell, 0, 0.6), 'ln ac') +
          pop(x, 500, seg(t, w[wi] - 0.1, w[wi] + 0.4), `<rect class="fp" x="${x - 130}" y="400" width="260" height="220" rx="22"/>` + rect(x - 130, 400, 260, 220, { r: 22, cls: tell >= 1 ? 'ln ac glow' : 'ln' }) +
            gear(x, 470, 34, tell >= 1 ? t * 160 : 0, tell >= 1 ? 'ln ac thin' : 'ln dim thin') +
            text(x, 560, lib, { size: 30, weight: 700 }) + text(x, 600, lang, { size: 26, cls: 't m ac', weight: 700 }))).join('') +
        text(500, 720, 'heavy lifting', { size: 36, cls: 't ac', weight: 700, opacity: seg(t, w[3], w[5]) })
    },
  },
  { // 7 Next: JavaScript. The language every browser speaks.
    headline: 'Next: *JavaScript*',
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[1] - 0.1, w[1] + 0.3))
      return (big > 0 ? `<g transform="translate(500 210) scale(${big.toFixed(3)})">${text(0, 50, 'JavaScript', { size: 120, cls: 't m ac', weight: 700 })}</g>` : '') +
        text(500, 430, typed('console.log("hi")', seg(t, w[2], w[6])), { size: 44, cls: 't m', weight: 600 }) +
        fade(seg(t, w[4], w[4] + 0.5), rect(270, 580, 460, 90, { r: 45, cls: 'ln ac' }) + text(500, 638, 'Follow for ep. 06', { size: 34, cls: 't ac', weight: 700 }), 20)
    },
  },
]

export default {
  series: 'How languages actually work · 05',
  ...LANGUAGES,
  chapters: [
    { title: 'Origin', from: 0, to: 2 },
    { title: 'How it runs', from: 3, to: 4 },
    { title: 'Speed', from: 5, to: 6 },
    { title: 'Next', from: 7, to: 7 },
  ],
  scenes,
}
