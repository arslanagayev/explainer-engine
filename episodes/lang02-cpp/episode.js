// Languages 02: C++. Classes on top of C, zero-cost abstractions and destructors.
import { arrow, backOut, easeOut, fade, lerp, line, path, pop, rect, seg, text, typed } from '../../engine/lib.js'
import { LANGUAGES, doc, stage } from '../../engine/series-languages.js'

const CLASS = ['class Player {', '  int health = 100;', 'public:', '  void takeDamage(int d) {', '    health -= d;', '  }', '};']

// ---------- Episode props ----------
const controller = (x, y, p = 1) =>
  path(`M${x - 170} ${y - 40} Q${x - 170} ${y - 90} ${x - 110} ${y - 90} H${x + 110} Q${x + 170} ${y - 90} ${x + 170} ${y - 40} L${x + 200} ${y + 70} Q${x + 210} ${y + 120} ${x + 160} ${y + 120} Q${x + 120} ${y + 120} ${x + 90} ${y + 60} H${x - 90} Q${x - 120} ${y + 120} ${x - 160} ${y + 120} Q${x - 210} ${y + 120} ${x - 200} ${y + 70} Z`, p) +
  path(`M${x - 120} ${y - 20} H${x - 60} M${x - 90} ${y - 50} V${y + 10}`, p, 'ln ac') +
  [[x + 90, y - 45], [x + 125, y - 15], [x + 90, y + 15], [x + 55, y - 15]].map(([cx, cy]) => `<circle class="fa" cx="${cx}" cy="${cy}" r="${(11 * p).toFixed(1)}"/>`).join('')
const codeBox = (x, y, lines, { n = Infinity, hot = -1, size = 30, w = 760 } = {}) => {
  let used = 0
  return rect(x, y, w, lines.length * size * 1.55 + 50, { r: 16, cls: 'ln' }) + lines.map((l, i) => {
    const s = l.slice(0, Math.max(0, Math.round(n - used)))
    used += l.length + 1
    return text(x + 34, y + 50 + i * size * 1.55, s, { size, cls: i === hot ? 't m ac' : 't m', anchor: 'start', weight: i === hot ? 700 : 500, extra: 'xml:space="preserve"' })
  }).join('')
}
const healthBar = (x, y, hp) => rect(x, y, 300, 34, { r: 17, cls: 'ln dim thin' }) + `<rect class="fa" x="${x}" y="${y}" width="${(300 * hp / 100).toFixed(1)}" height="34" rx="17"/>` +
  text(x + 320, y + 27, `${Math.round(hp)}`, { size: 30, cls: 't m ac', anchor: 'start', weight: 700 })

// ---------- Scenes ----------
const scenes = [
  { // 0 Every big game you've played was probably built on this language.
    headline: 'Every big game you played',
    draw: ({ t, w }) => controller(500, 340, easeOut(seg(t, 0, 0.7))) +
      pop(500, 600, seg(t, w[8], w[10] + 0.2), text(500, 630, '?', { size: 110, cls: 't m ac', weight: 700 })),
  },
  { // 1 It's C plus plus. In C, plus plus means "add one". So the name is a joke: C, one better.
    headline: "It's *C++*",
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[0], w[3] + 0.2))
      return (big > 0 ? `<g transform="translate(500 210) scale(${big.toFixed(3)})">${text(0, 60, 'C++', { size: 190, cls: 't m ac', weight: 700 })}</g>` : '') +
        fade(seg(t, w[4], w[7]), text(250, 460, 'int c = 1;', { size: 40, cls: 't m', anchor: 'start' }) + text(250, 530, typed('c++;  // now 2', seg(t, w[7], w[10])), { size: 40, cls: 't m ac', anchor: 'start', weight: 700 }), 15) +
        text(500, 680, '"C, one better"', { size: 46, weight: 700, opacity: seg(t, w[16], w[19]) })
    },
  },
  { // 2 Bjarne Stroustrup built it at Bell Labs, starting in 1979.
    headline: 'Bell Labs, *1979*',
    draw: ({ t, w }) => {
      const k = seg(t, w[7], w[9] + 0.3)
      return text(500, 170, 'Bjarne Stroustrup', { size: 56, weight: 700, opacity: seg(t, w[0], w[1] + 0.2) }) +
        line(120, 420, 880, 420, seg(t, w[4], w[7]), 'ln dim thick') +
        pop(250, 420, k, `<circle class="fa" cx="250" cy="420" r="16"/>` + text(250, 380, '1979', { size: 40, cls: 't m ac', weight: 700 }) + text(250, 490, 'C with Classes', { size: 28, cls: 't mu' })) +
        pop(750, 420, seg(k, 0.5, 1), `<circle class="fa" cx="750" cy="420" r="16"/>` + text(750, 380, '1983', { size: 40, cls: 't m ac', weight: 700 }) + text(750, 490, 'renamed C++', { size: 28, cls: 't mu' }))
    },
  },
  { // 3 His idea: keep C's speed, but add classes.
    headline: "C's speed *+ classes*",
    draw: ({ t, w }) => fade(seg(t, w[2], w[4]), stage(270, 360, 320, 200, 'C speed', { size: 40, lit: true }), 15) +
      pop(500, 360, seg(t, w[5], w[6]), text(500, 385, '+', { size: 90, cls: 't ac', weight: 700 })) +
      fade(seg(t, w[6], w[7] + 0.2), stage(730, 360, 320, 200, 'classes', { size: 40 }), 15),
  },
  { // 4 A class bundles data and code into one object: a Player with health and a takeDamage function.
    headline: 'One *object*',
    draw: ({ t, w }) => {
      const n = CLASS.join('\n').length * seg(t, w[1], w[8])
      const hp = t > w[15] ? lerp(100, 75, easeOut(seg(t, w[15], w[16] + 0.3))) : 100
      return codeBox(60, 40, CLASS, { n, hot: t > w[15] ? 3 : t > w[12] ? 1 : -1, size: 28, w: 560 }) +
        fade(seg(t, w[9], w[10] + 0.2), rect(660, 120, 300, 360, { r: 20, cls: 'ln ac' }) + text(810, 180, 'player', { size: 30, cls: 't m ac', weight: 700 }) +
          line(660, 210, 960, 210, 1, 'ln dim') + text(690, 270, 'health', { size: 24, cls: 't m mu', anchor: 'start' }) +
          `<g transform="translate(690 290) scale(0.75)">${healthBar(0, 0, hp)}</g>` + text(690, 400, 'takeDamage()', { size: 24, cls: t > w[15] ? 't m ac' : 't m mu', anchor: 'start' }), 15)
    },
  },
  { // 5 And it still compiles straight to machine code. Abstractions with no runtime cost.
    headline: 'No runtime *cost*',
    draw: ({ t, w }) => {
      const k = seg(t, w[2], w[7])
      return doc(140, 260, { label: 'game.cpp' }) + arrow(230, 260, 310, 260, k, 'ln ac') + stage(420, 260, 200, 110, 'COMPILER', { lit: k > 0 && k < 1, size: 24 }) +
        arrow(525, 260, 605, 260, seg(k, 0.5, 1), 'ln ac') + doc(700, 260, { bin: true, p: seg(k, 0.6, 1), label: 'machine code' }) +
        fade(seg(t, w[8], w[12] + 0.2), text(500, 560, '0', { size: 160, cls: 't m ac', weight: 700 }) + text(500, 630, 'extra cost for the nice code', { size: 30, cls: 't mu' }), 15)
    },
  },
  { // 6 And objects clean up after themselves: when one goes away, its destructor frees its memory.
    headline: 'It *cleans up* itself',
    draw: ({ t, w }) => {
      const gone = seg(t, w[8], w[9] + 0.3)
      const freed = seg(t, w[11], w[14])
      return text(100, 140, '{', { size: 60, cls: 't m', anchor: 'start', weight: 700 }) +
        text(150, 220, 'Player p;', { size: 40, cls: 't m', anchor: 'start' }) + text(150, 290, 'p.takeDamage(10);', { size: 40, cls: 't m', anchor: 'start' }) +
        text(100, 380, '}', { size: 60, cls: gone > 0 ? 't m ac' : 't m', anchor: 'start', weight: 700, opacity: seg(t, w[6], w[8]) }) +
        `<g opacity="${(1 - gone).toFixed(3)}">${rect(620, 150, 300, 200, { r: 20, cls: 'ln ac' }) + text(770, 260, 'p', { size: 50, cls: 't m ac', weight: 700 })}</g>` +
        fade(freed, text(500, 520, '~Player()', { size: 56, cls: 't m ac', weight: 700 }) + text(500, 600, 'memory freed automatically', { size: 32, cls: 't mu' }), 15)
    },
  },
  { // 7 That's why Unreal Engine, Chrome and Photoshop run on C plus plus.
    headline: 'Built with *C++*',
    draw: ({ t, w }) => [['Unreal Engine', 2, 160], ['Chrome', 4, 360], ['Photoshop', 6, 560]].map(([name, wi, y]) =>
      pop(500, y, seg(t, w[wi] - 0.1, w[wi] + 0.3), rect(220, y - 70, 560, 140, { r: 24, cls: 'ln' }) + text(500, y + 16, name, { size: 46, weight: 700 }))).join('') +
      text(500, 740, 'games · browsers · creative tools', { size: 28, cls: 't m mu', opacity: seg(t, w[8], w[11]) }),
  },
  { // 8 The catch? It's huge. Even experts say nobody knows all of C plus plus.
    headline: 'The catch: *huge*',
    draw: ({ t, w }) => {
      const h = easeOut(seg(t, w[2], w[3] + 0.5))
      const books = Array.from({ length: 9 }, (_, i) => i < Math.round(9 * h) ? rect(380, 640 - i * 62, 240, 54, { r: 8, cls: i % 2 ? 'ln ac' : 'ln' }) : '').join('')
      return books + text(780, 400, '≈ 2,000', { size: 60, cls: 't m ac', weight: 700, opacity: h }) + text(780, 450, 'pages of standard', { size: 26, cls: 't mu', opacity: h }) +
        text(500, 760, 'nobody knows all of it', { size: 34, cls: 't ac', weight: 700, opacity: seg(t, w[7], w[9] + 0.2) })
    },
  },
  { // 9 Next: Java. What if your code could run anywhere, without recompiling?
    headline: 'Next: *Java*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.6))
      return path('M380 250 H620 V420 Q620 500 540 500 H460 Q380 500 380 420 Z', p, 'ln ac') + path('M620 290 Q690 290 690 345 Q690 400 620 400', p, 'ln ac') +
        [0, 1, 2].map((i) => path(`M${440 + i * 60} 220 Q${460 + i * 60} 190 ${440 + i * 60} 160`, seg(t, 0.3 + i * 0.1, 0.9 + i * 0.1), 'ln ac thin')).join('') +
        text(500, 600, 'run anywhere?', { size: 44, weight: 700, opacity: seg(t, w[7], w[8] + 0.2) }) +
        fade(seg(t, w[10], w[10] + 0.5), rect(270, 660, 460, 90, { r: 45, cls: 'ln ac' }) + text(500, 718, 'Follow for ep. 03', { size: 34, cls: 't ac', weight: 700 }), 20)
    },
  },
]

export default {
  series: 'How languages actually work · 02',
  ...LANGUAGES,
  chapters: [
    { title: 'Origin', from: 0, to: 2 },
    { title: 'Classes', from: 3, to: 4 },
    { title: 'How it runs', from: 5, to: 6 },
    { title: 'Where', from: 7, to: 9 },
  ],
  scenes,
}
