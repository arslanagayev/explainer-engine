// Languages 03: Java. Bytecode, the JVM, JIT compilation and garbage collection.
import { arrow, backOut, cross, easeInOut, easeOut, fade, lerp, line, path, pop, rect, rng, seg, text } from '../../engine/lib.js'
import { laptop, phone, server } from '../../engine/props.js'
import { LANGUAGES, doc, stage } from '../../engine/series-languages.js'

const BYTECODE = ['getstatic System.out', 'ldc "hello"', 'invokevirtual println', 'return']

// ---------- Episode props ----------
/** An isometric-ish block for the block world. */
const block = (x, y, s, lit) =>
  path(`M${x} ${y} l${s} ${-s / 2} l${s} ${s / 2} l${-s} ${s / 2} Z M${x} ${y} v${s} l${s} ${s / 2} v${-s} M${x + 2 * s} ${y} v${s} l${-s} ${s / 2}`, 1, lit ? 'ln ac thin' : 'ln dim thin')
const acorn = (x, y) => path(`M${x - 40} ${y - 10} Q${x - 40} ${y + 70} ${x} ${y + 80} Q${x + 40} ${y + 70} ${x + 40} ${y - 10} Z`, 1) +
  path(`M${x - 50} ${y - 10} Q${x} ${y - 50} ${x + 50} ${y - 10} Z M${x} ${y - 35} V${y - 60}`, 1, 'ln ac')
const jvm = (x, y, p, lit) => stage(x, y, 170, 80, 'JVM', { p, lit, size: 26 })
const heat = (x, y, w, label, h, fire) => text(x, y, label, { size: 30, cls: fire ? 't m ac' : 't m', anchor: 'start', weight: fire ? 700 : 500 }) +
  rect(x + 330, y - 26, w, 30, { r: 15, cls: 'ln dim thin' }) + `<rect class="${fire ? 'fa' : 'fl'}" x="${x + 330}" y="${y - 26}" width="${(w * h).toFixed(1)}" height="30" rx="15"/>`

// ---------- Scenes ----------
const scenes = [
  { // 0 Minecraft was written in this language. So were early Android apps.
    headline: 'A block game. *Your apps.*',
    draw: ({ t, w }) => {
      const r = rng(4)
      const blocks = []
      for (let row = 0; row < 5; row++) for (let col = 0; col < 6 - (row % 2); col++) blocks.push([140 + col * 120 + (row % 2) * 60, 560 - row * 90 + (r() > 0.6 ? -30 : 0), row * 6 + col])
      return blocks.map(([x, y, i]) => pop(x + 60, y, seg(t, i * 0.06, i * 0.06 + 0.4), block(x, y, 60, i % 7 === 0))).join('') +
        fade(seg(t, w[8], w[10] + 0.2), `<g transform="translate(860 260) scale(0.6) translate(-860 -260)">${phone(860, 260, { p: 1, cls: 'ln ac' })}</g>`, 15)
    },
  },
  { // 1 It's Java. Born in 1995 at Sun Microsystems. It was first called Oak.
    headline: "It's *Java*",
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[0], w[1] + 0.2))
      return (big > 0 ? `<g transform="translate(500 200) scale(${big.toFixed(3)})">${text(0, 60, 'Java', { size: 170, cls: 't m ac', weight: 700 })}</g>` : '') +
        text(500, 400, '1995 · Sun Microsystems', { size: 38, weight: 700, opacity: seg(t, w[3], w[7]) }) +
        fade(seg(t, w[9], w[11]), acorn(400, 560) + text(500, 610, 'Oak', { size: 60, cls: 't m', anchor: 'start', weight: 700 }), 15) +
        (t > w[12] ? line(490, 590, 640, 590, seg(t, w[12], w[12] + 0.3), 'ln ac thick') : '')
    },
  },
  { // 2 The promise: write once, run anywhere.
    headline: 'Write once, *run anywhere*',
    draw: ({ t, w }) => {
      const run = seg(t, w[4], w[5] + 0.3)
      return pop(500, 160, seg(t, w[2], w[3]), doc(500, 160, { label: 'App.java' })) +
        [[laptop, 180, 560], [phone, 500, 560], [server, 820, 580]].map(([fn, x, y], i) => {
          const k = seg(run, i * 0.25, i * 0.25 + 0.5)
          return arrow(500, 335, x, y - 160, k, 'ln ac') + fade(k, fn === phone ? `<g transform="translate(${x} ${y}) scale(0.55) translate(${-x} ${-y})">${phone(x, y, { p: 1, cls: 'ln ac' })}</g>` : fn(x, y, 1, t), 10)
        }).join('')
    },
  },
  { // 3 Java doesn't compile to machine code. It compiles to bytecode: instructions for a computer that doesn't exist.
    headline: 'It compiles to *bytecode*',
    draw: ({ t, w }) => {
      const k = seg(t, w[6], w[9] + 0.3)
      return doc(120, 220, { label: 'Hello.java' }) + arrow(210, 220, 290, 220, k, 'ln ac') + stage(390, 220, 180, 100, 'javac', { lit: k > 0 && k < 1, size: 28 }) +
        arrow(485, 220, 560, 220, seg(k, 0.5, 1), 'ln ac') +
        fade(seg(k, 0.6, 1), rect(580, 110, 360, 230, { r: 16, cls: 'ln ac dash' }) + text(760, 150, 'Hello.class', { size: 22, cls: 't m mu' }) +
          BYTECODE.map((b, i) => text(610, 200 + i * 38, b, { size: 22, cls: 't m ac', anchor: 'start' })).join(''), 10) +
        cross(250, 520, 40, seg(t, w[1], w[5])) + text(320, 532, 'machine code', { size: 32, cls: 't m mu', anchor: 'start', opacity: seg(t, w[1], w[5]) }) +
        fade(seg(t, w[12], w[16] + 0.2), rect(380, 600, 240, 140, { r: 16, cls: 'ln dash' }) + text(500, 680, '? CPU ?', { size: 30, cls: 't m mu', weight: 700 }), 10)
    },
  },
  { // 4 That computer is the Java Virtual Machine. Every device gets its own, and the same bytecode runs on all of them.
    headline: 'The *Java Virtual Machine*',
    draw: ({ t, w }) => {
      const own = seg(t, w[7], w[11])
      const runs = seg(t, w[15], w[20])
      return rect(380, 40, 240, 90, { r: 14, cls: 'ln ac dash' }) + text(500, 98, 'Hello.class', { size: 26, cls: 't m ac', weight: 700 }) +
        [[180, 'Windows'], [500, 'macOS'], [820, 'Android']].map(([x, os], i) => {
          const k = seg(own, i * 0.25, i * 0.25 + 0.5)
          return text(x, 520, os, { size: 30, weight: 700, opacity: seg(t, 0, 0.5) }) + rect(x - 130, 440, 260, 260, { r: 20, cls: 'ln', p: seg(t, 0, 0.5) }) +
            jvm(x, 330, k, runs > i * 0.3) + arrow(500, 140, x, 285, seg(runs, i * 0.2, i * 0.2 + 0.4), 'ln ac') +
            text(x, 620, runs > i * 0.3 + 0.3 ? '▶ hello' : '', { size: 30, cls: 't m ac', weight: 700 })
        }).join('')
    },
  },
  { // 5 Slow? Not anymore. The JVM watches which code runs most, and compiles that part to machine code while it runs.
    headline: 'Hot code gets *compiled*',
    draw: ({ t, w }) => {
      const watch = seg(t, w[5], w[9])
      const comp = seg(t, w[11], w[16])
      const rows = [['render()', 0.95], ['update()', 0.7], ['loadMenu()', 0.15], ['saveGame()', 0.08]]
      return rows.map(([name, h], i) => heat(80, 200 + i * 100, 400, name, h * watch, i === 0 && comp > 0.3)).join('') +
        fade(comp, arrow(500, 160, 640, 120, 1, 'ln ac') + text(820, 110, 'JIT', { size: 54, cls: 't m ac', weight: 700 }) +
          text(820, 160, '→ machine code', { size: 26, cls: 't m mu' }), 10) +
        text(500, 680, 'compiled while it runs', { size: 34, cls: 't ac', weight: 700, opacity: seg(t, w[17], w[19] + 0.2) })
    },
  },
  { // 6 And you never free memory yourself. A garbage collector cleans up what you stopped using.
    headline: '*Garbage* collector',
    draw: ({ t, w }) => {
      const sweep = seg(t, w[9], w[14])
      const objs = [[300, 200, 1], [500, 200, 1], [700, 200, 0], [300, 400, 1], [500, 400, 0], [700, 400, 0], [400, 600, 1], [650, 600, 0]]
      const gx = lerp(80, 920, sweep)
      return rect(60, 90, 140, 80, { r: 14, cls: 'ln ac' }) + text(130, 140, 'root', { size: 26, cls: 't m ac', weight: 700 }) +
        line(200, 130, 260, 200, 1, 'ln ac thin') + line(340, 200, 460, 200, 1, 'ln ac thin') + line(300, 240, 300, 360, 1, 'ln ac thin') + line(330, 430, 380, 570, 1, 'ln ac thin') +
        objs.map(([x, y, live]) => {
          const gone = !live && gx > x ? seg(gx, x, x + 80) : 0
          return `<g opacity="${(1 - gone).toFixed(3)}"><circle cx="${x}" cy="${y}" r="40" class="${live ? 'fs' : 'fp'}" stroke="${live ? 'var(--accent)' : 'var(--line)'}" stroke-width="5"/></g>`
        }).join('') +
        (sweep > 0 && sweep < 1 ? line(gx, 120, gx, 680, 1, 'ln ac thick dash') : '') +
        cross(500, 760, 26, seg(t, w[2], w[5])) + text(540, 772, 'free()', { size: 34, cls: 't m mu', anchor: 'start', opacity: seg(t, w[2], w[5]) })
    },
  },
  { // 7 That's why banks, Android and huge backends trust it.
    headline: 'Trusted by *banks*',
    draw: ({ t, w }) => [['Banks', 2, 180], ['Android', 3, 380], ['Huge backends', 6, 580]].map(([name, wi, y]) =>
      pop(500, y, seg(t, w[wi] - 0.1, w[wi] + 0.3), rect(220, y - 70, 560, 140, { r: 24, cls: 'ln' }) + text(500, y + 16, name, { size: 46, weight: 700 }))).join(''),
  },
  { // 8 Next: C sharp. Microsoft's answer to Java.
    headline: 'Next: *C#*',
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[1] - 0.1, w[2] + 0.2))
      return (big > 0 ? `<g transform="translate(500 280) scale(${big.toFixed(3)})">${text(0, 60, 'C#', { size: 200, cls: 't m ac', weight: 700 })}</g>` : '') +
        text(500, 470, "Microsoft's answer", { size: 44, weight: 700, opacity: seg(t, w[3], w[6]) }) +
        fade(seg(t, w[6], w[6] + 0.5), rect(270, 580, 460, 90, { r: 45, cls: 'ln ac' }) + text(500, 638, 'Follow for ep. 04', { size: 34, cls: 't ac', weight: 700 }), 20)
    },
  },
]

export default {
  series: 'How languages actually work · 03',
  ...LANGUAGES,
  chapters: [
    { title: 'Origin', from: 0, to: 2 },
    { title: 'Bytecode', from: 3, to: 4 },
    { title: 'Speed + memory', from: 5, to: 6 },
    { title: 'Where', from: 7, to: 8 },
  ],
  scenes,
}
