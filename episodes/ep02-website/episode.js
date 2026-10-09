// Episode 02: what happens when you open a website? One scene per voice-over line (see script.md).
import { arrow, backOut, clamp, cross, easeInOut, easeOut, fade, lerp, line, move, path, pop, rect, rng, seg, text, typed } from '../../engine/lib.js'
import { laptop, lock, pill, server } from '../../engine/props.js'

const HOST = 'example.com'
const IP = '203.0.113.42' // documentation range (RFC 5737), not a real host

// ---------- Episode props ----------
const browser = (x, y, w, h, { p = 1, url = '', lockP = 0, caret = false } = {}) =>
  `<rect class="fp" x="${x}" y="${y}" width="${w}" height="${h}" rx="22" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x, y, w, h, { r: 22, p }) + line(x, y + 70, x + w, y + 70, p, 'ln dim') +
  [0, 1, 2].map((k) => `<circle class="${k === 0 ? 'fa' : 'fl'}" cx="${x + 34 + k * 26}" cy="${y + 35}" r="8" opacity="${clamp(p * 2 - 1).toFixed(2)}"/>`).join('') +
  rect(x + 120, y + 14, w - 150, 42, { r: 21, p, cls: 'ln dim thin' }) +
  (lockP > 0 ? pop(x + 148, y + 35, lockP, `<g transform="translate(${x + 148} ${y + 37}) scale(0.32)">${lock(0, -12, { cls: 'ln ac thick' })}</g>`) : '') +
  text(x + (lockP > 0 ? 172 : 142), y + 45, url + (caret ? '|' : ''), { size: 26, cls: 't m', anchor: 'start', opacity: clamp(p * 2 - 1) })
const dnsBook = (x, y, p = 1) =>
  rect(x - 90, y - 110, 180, 220, { r: 16, p }) + line(x - 60, y - 110, x - 60, y + 110, p, 'ln dim') +
  [0, 1, 2, 3].map((k) => line(x - 40, y - 60 + k * 40, x + 60, y - 60 + k * 40, p, 'ln dim thin')).join('') +
  text(x + 10, y + 160, 'DNS', { size: 34, cls: 't ac', weight: 800, opacity: clamp(p * 2 - 1) })
const phone = (x, y, s = 1, cls = 'ln ac') =>
  path(`M${x - 22 * s} ${y - 26 * s} Q${x - 30 * s} ${y + 4 * s} ${x - 4 * s} ${y + 28 * s} L${x + 8 * s} ${y + 18 * s} L${x - 4 * s} ${y + 4 * s} L${x - 12 * s} ${y + 10 * s} Q${x - 18 * s} ${y} ${x - 12 * s} ${y - 14 * s} L${x - 2 * s} ${y - 20 * s} L${x - 10 * s} ${y - 34 * s} Z`, 1, cls)
const eye = (x, y, lid = 0) =>
  path(`M${x - 60} ${y} Q${x} ${y - 50 * (1 - lid)} ${x + 60} ${y} Q${x} ${y + 50 * (1 - lid)} ${x - 60} ${y}`, 1, 'ln ac') +
  `<circle class="fa" cx="${x}" cy="${y}" r="${(16 * (1 - lid)).toFixed(1)}"/>`
const dot = (x, y, r, fill, p = 1, label = '') =>
  p <= 0 ? '' : pop(x, y, p, `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="var(--ink)" stroke-width="4"/>` +
    (label ? text(x, y + r + 40, label, { size: 24, cls: 't m mu' }) : ''))
const fileTag = (x, y, name, p = 1) => pop(x, y, p, pill(x, y, name, { size: 26, box: 'ln ac' }))
const HTML = ['<!doctype html>', '<html>', '  <head>', '    <link href="style.css">', '  </head>', '  <body>', '    <h1>Hello!</h1>', '    <img src="cat.jpg">', '    <script src="app.js">', '  </body>', '</html>']
const htmlLine = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/(&lt;\/?[a-z0-9!]+)/g, '<tspan class="fa">$1</tspan>').replace(/(&gt;)/g, '<tspan class="fa">$1</tspan>')

// Paint mixing colours for the key exchange: private, public and the shared secret.
const PUBLIC = '#e7d9dd', MINE = '#fd1843', THEIRS = '#3b2a30'
const MIX_MINE = '#f37a90', MIX_THEIRS = '#8f8287', SECRET = '#a53d55'

// ---------- Scenes ----------
const scenes = [
  { // 0 What really happens when you open a website?
    headline: 'What happens when you *open* a site?',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.6))
      const url = typed(HOST, seg(t, w[4], w[7]))
      const press = seg(t, w[7] + 0.1, w[7] + 0.45)
      const sink = press > 0 && press < 1 ? Math.sin(press * Math.PI) * 10 : 0
      const spin = press >= 1 ? `<g transform="rotate(${(t * 300).toFixed(0)} 500 360)">${path('M500 310 A50 50 0 1 1 450 360', 1, 'ln ac')}</g>` : ''
      return browser(100, 120, 800, 480, { p, url, caret: Math.floor(t * 2.2) % 2 === 0 && press === 0 }) + spin +
        fade(seg(t, w[6], w[7]), move(0, sink, rect(380, 660, 240, 96, { r: 18, cls: press > 0 ? 'ln ac' : 'ln' }) +
          text(500, 722, 'ENTER ⏎', { size: 34, cls: press > 0 ? 't ac m' : 't m', weight: 700 })), 20)
    },
  },
  { // 1 Here's the twist: your computer has no idea where that website is.
    headline: "It doesn't know *where*",
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.6))
      const r = rng(5)
      const spots = Array.from({ length: 7 }, (_, i) => [600 + r() * 330, 150 + r() * 500, i])
      return laptop(220, 420, p) + text(220, 560, 'YOUR COMPUTER', { size: 22, cls: 't m mu', opacity: p }) +
        spots.map(([x, y, i]) => pop(x, y, seg(t, w[8] + i * 0.08, w[8] + i * 0.08 + 0.35), rect(x - 34, y - 24, 68, 48, { r: 8, cls: 'ln dim' }) + line(x - 18, y, x + 18, y, 1, 'ln dim thin'))).join('') +
        spots.map(([x, y], i) => path(`M345 400 L${x - 40} ${y}`, seg(t, w[9] + i * 0.05, w[11]), 'ln dim thin dash')).join('') +
        pop(220, 240, seg(t, w[6], w[7] + 0.3), text(220, 275, '?', { size: 120, cls: 't ac', weight: 800 }))
    },
  },
  { // 2 It only understands numbers.
    headline: 'Only *numbers*',
    draw: ({ t, w }) => {
      const k = seg(t, w[1], w[3] + 0.3)
      const bits = HOST.split('').map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
      return text(500, 230, HOST, { size: 96, weight: 800, opacity: 1 - 0.75 * k }) +
        (k > 0 ? path('M250 205 L750 205', k, 'ln ac thick') : '') +
        [0, 1, 2].map((row) => text(500, 400 + row * 80, bits.slice(row * 4, row * 4 + 4).join(' '), { size: 38, cls: 't m ac', opacity: seg(t, w[2] + row * 0.15, w[3] + row * 0.15) })).join('')
    },
  },
  { // 3 So first, it asks a DNS server: what's the address for this name?
    headline: 'Ask the *DNS*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.6))
      return laptop(180, 430, p) + text(180, 570, 'YOU', { size: 22, cls: 't m mu', opacity: p }) +
        dnsBook(820, 400, easeOut(seg(t, w[4], w[6]))) +
        arrow(320, 400, 690, 400, seg(t, w[3], w[6])) +
        pop(470, 260, seg(t, w[7], w[8] + 0.3), pill(470, 260, `${HOST} = ?`, { size: 30, box: 'ln ac' }))
    },
  },
  { // 4 The answer is an IP address. A phone number for computers.
    headline: 'An *IP address*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const fly = easeInOut(seg(t, w[1], w[5]))
      const cx = lerp(800, 500, fly), cy = lerp(400, 300, fly)
      return `<g opacity="${(1 - fly).toFixed(3)}">${dnsBook(820, 400)}</g>` +
        move(cx - 500, cy - 300, `<rect class="fp" x="250" y="210" width="500" height="180" rx="24"/>` + rect(250, 210, 500, 180, { r: 24, cls: 'ln ac', p }) +
          text(290, 262, 'IP ADDRESS', { size: 22, cls: 't m mu', anchor: 'start' }) + text(500, 340, IP, { size: 54, cls: 't m', weight: 700 })) +
        fade(seg(t, w[7], w[8] + 0.2), phone(420, 560, 1.6) + text(470, 575, 'like a phone number', { size: 34, cls: 't ac', anchor: 'start', weight: 700 }), 20)
    },
  },
  { // 5 Your browser calls that number, and they shake hands: hi, hi back, okay.
    headline: 'A *handshake*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const steps = [['hi', 'SYN', 260, true, w[9]], ['hi back', 'SYN-ACK', 400, false, w[10]], ['okay', 'ACK', 540, true, w[12]]]
      return laptop(140, 400, p) + text(140, 540, 'YOU', { size: 22, cls: 't m mu', opacity: p }) +
        server(870, 420, p, t) + text(870, 560, IP, { size: 22, cls: 't m mu', opacity: p }) +
        steps.map(([say, flag, y, right, at]) => {
          const k = easeOut(seg(t, at - 0.15, at + 0.35))
          return (right ? arrow(275, y, 745, y, k, 'ln ac') : arrow(745, y, 275, y, k, 'ln ac')) +
            text(510, y - 22, say, { size: 34, weight: 800, opacity: k }) + text(510, y + 48, flag, { size: 22, cls: 't m mu', opacity: k })
        }).join('')
    },
  },
  { // 6 But anyone on the network could be listening.
    headline: "Someone's *listening*",
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const packets = [0, 1, 2].map((k) => { const x = 280 + ((t * 170 + k * 160) % 460); return pill(x, 470, 'GET /', { size: 20 }) }).join('')
      const lid = (t % 2.4) > 2.2 ? Math.sin(((t % 2.4) - 2.2) / 0.2 * Math.PI) : 0
      return laptop(140, 480, p) + server(870, 500, p, t) + line(260, 470, 750, 470, p, 'ln dim') + packets +
        fade(seg(t, w[1], w[2] + 0.2), eye(500, 200, lid) + path('M500 250 L500 430', 1, 'ln ac dash'), 20) +
        text(500, 640, 'plain packets: anyone on the Wi-Fi can read them', { size: 28, cls: 't mu', opacity: seg(t, w[6], w[7] + 0.3) })
    },
  },
  { // 7 So they agree on a secret key, without ever sending the key itself.
    headline: 'A shared *secret*',
    draw: ({ t, w }) => {
      const mix = seg(t, w[2], w[4])
      const swap = easeInOut(seg(t, w[4], w[6]))
      const fin = seg(t, w[6], w[7])
      return dot(500, 70, 34, PUBLIC, seg(t, 0, 0.5), 'public') +
        dot(160, 170, 40, MINE, seg(t, 0.1, 0.6)) + text(160, 245, 'YOUR SECRET', { size: 20, cls: 't m mu', opacity: seg(t, 0.1, 0.6) }) +
        dot(840, 170, 40, THEIRS, seg(t, 0.2, 0.7)) + text(840, 245, 'SERVER SECRET', { size: 20, cls: 't m mu', opacity: seg(t, 0.2, 0.7) }) +
        dot(lerp(160, 840, swap), lerp(340, 470, swap), 34, MIX_MINE, mix) +
        dot(lerp(840, 160, swap), lerp(340, 470, swap), 34, MIX_THEIRS, mix) +
        line(500, 300, 500, 760, 1, 'ln dim dash') + text(500, 290, 'NETWORK', { size: 20, cls: 't m mu' }) +
        dot(160, 640, 46, SECRET, fin) + dot(840, 640, 46, SECRET, fin) +
        fade(fin, text(160, 735, 'SAME KEY', { size: 24, cls: 't m ac', weight: 700 }) + text(840, 735, 'SAME KEY', { size: 24, cls: 't m ac', weight: 700 })) +
        cross(500, 640, 34, seg(t, w[9], w[11] + 0.2))
    },
  },
  { // 8 That's the little lock next to the address.
    headline: 'The *lock*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      return browser(80, 230, 840, 330, { p, url: 'https://' + HOST, lockP: seg(t, w[2], w[3] + 0.3) }) +
        arrow(300, 470, 240, 320, seg(t, w[4], w[6]), 'ln ac') +
        text(310, 510, 'encrypted with that key (TLS)', { size: 32, cls: 't ac', anchor: 'start', weight: 700, opacity: seg(t, w[5], w[7]) })
    },
  },
  { // 9 Now the browser finally asks for the page.
    headline: 'Ask for the *page*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const k = easeInOut(seg(t, w[3], w[7] + 0.2))
      return laptop(140, 420, p) + server(870, 440, p, t) + line(260, 420, 750, 420, p, 'ln dim') +
        (k > 0 && k < 1 ? pill(lerp(320, 690, k), 420, 'GET /', { size: 30, box: 'ln ac', cls: 'ac' }) : '') +
        (k >= 1 ? pop(870, 250, seg(t, w[7] + 0.2, w[7] + 0.5), pill(870, 250, 'GET /', { size: 30, box: 'ln ac', cls: 'ac' })) : '') +
        text(500, 300, 'HTTP REQUEST', { size: 24, cls: 't m mu', opacity: seg(t, w[2], w[4]) })
    },
  },
  { // 10 The server sends back HTML. Just text.
    headline: 'Just *text*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const n = HTML.length * seg(t, w[1], w[6] + 0.3)
      return `<rect class="fp" x="140" y="40" width="720" height="660" rx="24" opacity="${p.toFixed(2)}"/>` + rect(140, 40, 720, 660, { r: 24, p }) +
        text(180, 95, 'index.html', { size: 24, cls: 't m mu', anchor: 'start', opacity: p }) + line(140, 120, 860, 120, p, 'ln dim') +
        HTML.map((l, i) => i < Math.floor(n) ? `<text class="t m" x="180" y="${175 + i * 48}" font-size="30" font-weight="500" xml:space="preserve">${htmlLine(l)}</text>` : '').join('')
    },
  },
  { // 11 But that's only the skeleton. It points to images, styles and scripts.
    headline: 'Only the *skeleton*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const box = (x, y, ww, h, k) => rect(x, y, ww, h, { r: 10, cls: 'ln dim dash', p: k })
      return browser(60, 120, 440, 560, { p, url: HOST }) +
        box(100, 230, 360, 60, p) + box(100, 320, 360, 200, p) + box(100, 550, 220, 30, p) + box(100, 600, 300, 30, p) +
        arrow(500, 420, 610, 250, seg(t, w[7], w[8])) + fileTag(760, 250, 'cat.jpg', seg(t, w[8], w[8] + 0.3)) +
        arrow(500, 420, 610, 420, seg(t, w[8], w[9])) + fileTag(760, 420, 'style.css', seg(t, w[9], w[9] + 0.3)) +
        arrow(500, 420, 610, 590, seg(t, w[10], w[11])) + fileTag(760, 590, 'app.js', seg(t, w[11], w[11] + 0.3))
    },
  },
  { // 12 So the browser fires off dozens more requests, all at once.
    headline: 'Dozens of *requests*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const r = rng(11)
      const n = 24
      const fan = Array.from({ length: n }, (_, i) => {
        const a = -0.95 + (1.9 * i) / (n - 1)
        const len = 420 + r() * 200
        const k = easeOut(seg(t, w[3] + r() * 0.5, w[7] + r() * 0.3))
        return arrow(260, 420, 260 + Math.cos(a) * len, 420 + Math.sin(a) * len * 0.75, k, i % 4 === 0 ? 'ln ac thin' : 'ln dim thin')
      }).join('')
      const count = Math.round(38 * seg(t, w[4], w[8]))
      return laptop(150, 430, p) + fan +
        `<rect class="fp" x="560" y="40" width="340" height="120" rx="20" opacity="${seg(t, w[5], w[6]).toFixed(2)}"/>` +
        text(730, 120, `${count} requests`, { size: 48, cls: 't ac', weight: 800, opacity: seg(t, w[5], w[6]) }) +
        text(730, 220, 'in parallel', { size: 30, cls: 't m mu', opacity: seg(t, w[8], w[10]) })
    },
  },
  { // 13 Then it builds the page: structure, style, layout, paint.
    headline: 'Build the *page*',
    draw: ({ t, w }) => {
      const panel = (x, y, label, k, inner) => fade(k, `<rect class="fp" x="${x}" y="${y}" width="420" height="300" rx="20"/>` + rect(x, y, 420, 300, { r: 20, cls: 'ln' }) +
        inner + text(x + 24, y + 340, label, { size: 26, cls: 't m ac', anchor: 'start', weight: 700 }), 20)
      const dom = [[210, 110], [140, 190], [280, 190], [100, 270], [180, 270], [280, 270]].map(([x, y]) => `<circle class="fa" cx="${x}" cy="${y}" r="13"/>`).join('') +
        line(210, 110, 140, 190) + line(210, 110, 280, 190) + line(140, 190, 100, 270) + line(140, 190, 180, 270) + line(280, 190, 280, 270)
      const style = '<text class="t m" x="560" y="130" font-size="26">h1 {</text><text class="t m ac" x="590" y="172" font-size="26">color: pink;</text><text class="t m ac" x="590" y="214" font-size="26">font: 48px;</text><text class="t m" x="560" y="256" font-size="26">}</text>'
      const layout = rect(110, 470, 380, 60, { r: 8, cls: 'ln dim' }) + rect(110, 545, 180, 120, { r: 8, cls: 'ln dim' }) + rect(310, 545, 180, 120, { r: 8, cls: 'ln dim' }) +
        text(300, 508, '380 × 60', { size: 22, cls: 't m mu' }) + text(200, 612, '180 × 120', { size: 20, cls: 't m mu' })
      const paint = '<rect class="fa" x="550" y="470" width="380" height="60" rx="8"/>' + text(740, 512, 'Hello!', { size: 32, cls: 't dk', weight: 800 }) +
        '<rect x="550" y="545" width="180" height="120" rx="8" fill="#f7c9d2"/><rect x="750" y="545" width="180" height="120" rx="8" fill="#efe4e7"/>'
      return panel(80, 40, '1 · STRUCTURE', seg(t, w[4], w[5] + 0.2), dom) + panel(530, 40, '2 · STYLE', seg(t, w[5], w[6] + 0.2), style) +
        panel(80, 420, '3 · LAYOUT', seg(t, w[6], w[7] + 0.2), layout) + panel(530, 420, '4 · PAINT', seg(t, w[7], w[8] + 0.2), paint)
    },
  },
  { // 14 Next time, most of it is already saved on your device.
    headline: 'Saved in *cache*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const files = ['cat.jpg', 'style.css', 'app.js']
      return laptop(500, 250, p) +
        rect(230, 520, 540, 200, { r: 20, cls: 'ln ac', p: seg(t, w[5], w[7]) }) + text(500, 690, 'CACHE', { size: 34, cls: 't ac', weight: 800, opacity: seg(t, w[6], w[7]) }) +
        files.map((f, i) => {
          const k = easeInOut(seg(t, w[6] + i * 0.2, w[8] + i * 0.2))
          return k > 0 ? pill(lerp(260 + i * 240, 330 + i * 170, k), lerp(420, 600, k), f, { size: 22 }) : ''
        }).join('')
    },
  },
  { // 15 That's why the second visit feels instant.
    headline: '*Instant* second visit',
    draw: ({ t, w }) => {
      const a = seg(t, 0.1, w[3]), b = seg(t, w[3], w[4] + 0.2)
      return text(100, 230, '1st visit', { size: 40, weight: 800, anchor: 'start' }) + rect(100, 260, 800, 40, { r: 20, cls: 'ln dim thin' }) +
        `<rect class="fl" x="100" y="260" width="${(800 * a).toFixed(1)}" height="40" rx="20"/>` + text(900, 230, `${(1.2 * a).toFixed(1)} s`, { size: 36, cls: 't m', anchor: 'end' }) +
        text(100, 450, '2nd visit', { size: 40, weight: 800, anchor: 'start', opacity: seg(t, w[2], w[3]) }) + rect(100, 480, 800, 40, { r: 20, cls: 'ln dim thin', p: seg(t, w[2], w[3]) }) +
        `<rect class="fa" x="100" y="480" width="${(133 * b).toFixed(1)}" height="40" rx="20"/>` + text(900, 450, `${(0.2 * b).toFixed(1)} s`, { size: 36, cls: 't m ac', anchor: 'end', weight: 700, opacity: seg(t, w[2], w[3]) }) +
        pop(500, 650, seg(t, w[6], w[6] + 0.35), text(500, 680, 'instant ⚡', { size: 64, cls: 't ac', weight: 800 }))
    },
  },
  { // 16 And all of that usually takes less than a second.
    headline: 'Under a *second*',
    draw: ({ t, w }) => {
      const rows = [['DNS lookup', 0, 30], ['Handshake', 30, 40], ['TLS key', 70, 50], ['HTML', 120, 110], ['Files ×38', 230, 300], ['Build + paint', 530, 170]]
      const scale = 600 / 700
      const total = seg(t, w[8], w[9] + 0.2)
      return rows.map(([label, start, ms], i) => {
        const k = easeOut(seg(t, w[1] + i * 0.35, w[1] + i * 0.35 + 0.4))
        const y = 60 + i * 95
        return fade(k, text(80, y + 32, label, { size: 28, cls: 't m', anchor: 'start' }) +
          `<rect class="${i === rows.length - 1 ? 'fa' : 'fl'}" x="${300 + start * scale}" y="${y + 6}" width="${(ms * scale * k).toFixed(1)}" height="36" rx="10"/>` +
          text(300 + (start + ms) * scale + 12, y + 34, `${ms} ms`, { size: 22, cls: 't m mu', anchor: 'start' }), 10)
      }).join('') + line(80, 640, 920, 640, total, 'ln') +
        text(500, 720, '≈ 0.7 s in total (typical)', { size: 44, cls: 't ac', weight: 800, opacity: total })
    },
  },
  { // 17 Now you know.
    headline: 'Now you *know*',
    draw: ({ t }) => {
      const p = easeOut(seg(t, 0, 0.6))
      return move(0, 0, `<g transform="translate(500 150) scale(${(0.5 + 0.5 * backOut(seg(t, 0, 0.6))).toFixed(3)}) translate(-500 -150)">${browser(330, 40, 340, 220, { p, url: HOST, lockP: seg(t, 0.3, 0.7) })}</g>`) +
        text(500, 380, 'HOW IT ACTUALLY WORKS', { size: 50, weight: 800, opacity: seg(t, 0.3, 0.8) }) +
        text(500, 470, 'Next: what happens when', { size: 36, cls: 't mu', opacity: seg(t, 0.6, 1.1) }) +
        text(500, 520, 'you tap your card?', { size: 36, cls: 't mu', opacity: seg(t, 0.6, 1.1) }) +
        fade(seg(t, 1.0, 1.5), rect(270, 590, 460, 90, { r: 45, cls: 'ln ac' }) + text(500, 648, 'Follow for ep. 03', { size: 34, cls: 't ac', weight: 700 }), 20)
    },
  },
]

export default {
  series: 'How it actually works · 02',
  fontsUrl: 'https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@500;600;700&family=Bricolage+Grotesque:opsz,wght@12..96,600..800&display=block',
  theme: {
    bg: '#fff9fa',
    backdrop: 'radial-gradient(70% 38% at 50% 50%, rgb(253 24 67 / 0.07), transparent 70%), #fff9fa',
    grid: 'rgb(253 24 67 / 0.13)',
    ink: '#24161b',
    muted: '#8d7b81',
    faint: 'rgb(36 22 27 / 0.1)',
    line: '#e5d5da',
    panel: '#ffffff',
    soft: '#f6dde3',
    accent: '#fd1843',
    display: "'Bricolage Grotesque', sans-serif",
    mono: "'Azeret Mono', monospace",
  },
  chapters: [
    { title: 'The question', from: 0, to: 2 },
    { title: 'Finding it', from: 3, to: 4 },
    { title: 'Connecting', from: 5, to: 8 },
    { title: 'Asking', from: 9, to: 12 },
    { title: 'Building', from: 13, to: 13 },
    { title: 'Cache', from: 14, to: 15 },
    { title: 'The proof', from: 16, to: 17 },
  ],
  scenes,
}
