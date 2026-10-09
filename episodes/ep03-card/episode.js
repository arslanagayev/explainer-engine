// Episode 03: what happens when you tap your card? One scene per voice-over line (see script.md).
import { arrow, backOut, check, clamp, cross, easeInOut, easeOut, fade, lerp, line, path, pop, rect, seg, text } from '../../engine/lib.js'
import { pill } from '../../engine/props.js'

const PAN = '4242 4242 4242 4242'
const CODE = '8A3C 51F0 9D2E 4B77'

// ---------- Episode props ----------
/** A payment card centred on (x, y). xray shows the antenna coil; lit makes the chip glow. */
function card(x, y, { s = 1, p = 1, coil = 0, lit = 0, tilt = 0, ghost = false } = {}) {
  const w = 360, h = 226
  const loops = [0, 1, 2].map((k) => rect(-w / 2 + 14 + k * 9, -h / 2 + 14 + k * 9, w - 28 - k * 18, h - 28 - k * 18, { r: 16 - k * 3, cls: 'ln ac thin', p: coil })).join('')
  const chip = `<rect x="-128" y="-38" width="66" height="50" rx="9" class="${lit > 0.5 ? 'fa' : 'fp'}" stroke="var(--accent)" stroke-width="3"/>` +
    line(-128, -13, -62, -13, 1, 'ln ac thin') + line(-95, -38, -95, 12, 1, 'ln ac thin')
  const glow = lit > 0 ? `<circle cx="-95" cy="-13" r="${(60 * lit).toFixed(1)}" fill="var(--accent)" opacity="${(0.25 * lit).toFixed(3)}"/>` : ''
  return `<g transform="translate(${x} ${y}) rotate(${tilt.toFixed(2)}) scale(${s})" opacity="${ghost ? 0.55 : 1}">` +
    `<rect class="fp" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="22" opacity="${clamp(p * 3).toFixed(2)}"/>` +
    rect(-w / 2, -h / 2, w, h, { r: 22, p, cls: ghost ? 'ln dash' : 'ln' }) + loops + glow + (p > 0.6 ? chip : '') +
    text(-150, 82, '•••• 4242', { size: 26, cls: 't m mu', anchor: 'start', opacity: clamp(p * 2 - 1) }) +
    path(`M${110} -70 a14 14 0 0 1 0 28 M${122} -82 a28 28 0 0 1 0 52 M${134} -94 a42 42 0 0 1 0 76`, p, 'ln thin') + '</g>'
}
const terminal = (x, y, { p = 1, screen = '€4.50', ok = 0 } = {}) =>
  `<rect class="fp" x="${x - 130}" y="${y - 200}" width="260" height="400" rx="34" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x - 130, y - 200, 260, 400, { r: 34, p }) +
  (ok > 0 ? `<rect class="fa" x="${x - 100}" y="${y - 170}" width="200" height="130" rx="14" opacity="${ok.toFixed(2)}"/>` : '') +
  rect(x - 100, y - 170, 200, 130, { r: 14, p, cls: 'ln dim' }) +
  (ok > 0.5 ? check(x, y - 105, 38, seg(ok, 0.5, 1), 'ln thick') : text(x, y - 92, screen, { size: 40, cls: 't m ac', weight: 700, opacity: clamp(p * 2 - 1) })) +
  [0, 1, 2].map((r) => [0, 1, 2].map((c) => `<circle class="fl" cx="${x - 60 + c * 60}" cy="${y + 10 + r * 56}" r="17" opacity="${clamp(p * 2 - 1).toFixed(2)}"/>`).join('')).join('')
/** Field rings rising from (x, y), looping with time. */
const rings = (x, y, t, k = 1, n = 4) => Array.from({ length: n }, (_, i) => {
  const f = ((t * 0.6 + i / n) % 1)
  const r = 40 + f * 300
  return `<ellipse cx="${x}" cy="${y}" rx="${r.toFixed(1)}" ry="${(r * 0.32).toFixed(1)}" class="ln ac thin" opacity="${((1 - f) * k * 0.9).toFixed(3)}"/>`
}).join('')
const bank = (x, y, p = 1, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})">` + path('M-110 -50 L0 -110 L110 -50 Z', p) + path('M-120 90 H120', p) + path('M-105 70 H105', p) +
  [-75, -25, 25, 75].map((c) => line(c, -35, c, 60, p)).join('') + '</g>'
const keyIcon = (x, y, s = 1, cls = 'ln ac') =>
  `<g transform="translate(${x} ${y}) scale(${s})">` + path('M-60 0 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0', 1, cls) + path('M-8 0 H60 M40 0 V22 M56 0 V16', 1, cls) + '</g>'
const node = (x, y, label, p = 1, lit = false) =>
  `<rect class="fp" x="${x - 130}" y="${y - 44}" width="260" height="88" rx="20" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x - 130, y - 44, 260, 88, { r: 20, p, cls: lit ? 'ln ac' : 'ln' }) + text(x, y + 10, label, { size: 26, cls: lit ? 't m ac' : 't m', weight: 700, opacity: clamp(p * 2 - 1) })
const ROUTE = [[200, 150, 'TERMINAL'], [800, 330, 'CARD NETWORK'], [200, 510, 'YOUR BANK']]
const route = (p, lit) => ROUTE.map(([x, y, l], i) => node(x, y, l, p, lit === i)).join('') +
  arrow(330, 170, 670, 310, p, 'ln dim') + arrow(670, 350, 330, 490, p, 'ln dim')
/** Position along the route, 0 = terminal, 1 = bank. */
const along = (k) => k < 0.5
  ? [lerp(330, 670, k * 2), lerp(170, 310, k * 2)]
  : [lerp(670, 330, (k - 0.5) * 2), lerp(350, 490, (k - 0.5) * 2)]

// ---------- Scenes ----------
const scenes = [
  { // 0 What happens when you tap your card?
    headline: 'What happens when you *tap*?',
    draw: ({ t, w }) => {
      const k = easeInOut(seg(t, w[2], w[4] + 0.3))
      return terminal(500, 540, { p: easeOut(seg(t, 0, 0.6)) }) +
        (k >= 1 ? rings(500, 330, t, seg(t, w[4] + 0.3, w[5] + 0.3), 3) : '') +
        card(500, lerp(40, 280, k), { s: 0.85, p: easeOut(seg(t, 0, 0.6)), tilt: lerp(-14, 0, k) })
    },
  },
  { // 1 Here's the twist: your card has no battery.
    headline: 'No *battery*',
    draw: ({ t, w }) => {
      const bp = seg(t, w[5], w[6] + 0.2)
      return card(500, 260, { s: 1.4, p: easeOut(seg(t, 0, 0.5)) }) +
        fade(bp, rect(390, 560, 200, 100, { r: 14, cls: 'ln' }) + `<rect class="fi" x="590" y="590" width="18" height="40" rx="4"/>` +
          `<rect class="fl" x="404" y="574" width="${(60).toFixed(0)}" height="72" rx="6"/>`, 20) +
        cross(495, 610, 70, seg(t, w[7], w[7] + 0.4)) +
        text(500, 760, 'nothing inside to power the chip', { size: 30, cls: 't mu', opacity: seg(t, w[7] + 0.2, w[7] + 0.6) })
    },
  },
  { // 2 The reader is a tiny radio station. It fills the air above it with a magnetic field.
    headline: 'A tiny *radio* station',
    draw: ({ t, w }) => {
      const k = seg(t, w[7], w[10])
      return terminal(500, 560, { p: easeOut(seg(t, 0, 0.5)), screen: '' }) + rings(500, 350, t, k, 5) +
        pop(800, 160, seg(t, w[4], w[6]), pill(800, 160, '13.56 MHz', { size: 30, box: 'ln ac', cls: 'ac' })) +
        text(230, 180, 'magnetic field', { size: 34, cls: 't ac', weight: 700, opacity: seg(t, w[15], w[16] + 0.2) })
    },
  },
  { // 3 Inside your card, a thin coil of wire runs around the edge. That's an antenna.
    headline: 'The *antenna*',
    draw: ({ t, w }) => card(500, 340, { s: 1.65, p: easeOut(seg(t, 0, 0.5)), coil: seg(t, w[4], w[11] + 0.2) }) +
      arrow(820, 640, 760, 560, seg(t, w[12], w[14]), 'ln ac') +
      text(820, 700, 'antenna', { size: 40, cls: 't ac', weight: 800, opacity: seg(t, w[13], w[14] + 0.2) }),
  },
  { // 4 Bring it close, and the field powers the chip. Just enough, just for a moment.
    headline: 'Powered by the *field*',
    draw: ({ t, w }) => {
      const f = seg(t, w[3], w[6])
      const lit = t > w[8] ? 0.75 + 0.25 * Math.sin(t * 18) * seg(t, w[11], w[14]) : seg(t, w[6], w[8])
      const lines = [-240, -120, 0, 120, 240].map((dx, i) => {
        const yy = 760 - ((t * 120 + i * 37) % 120)
        return path(`M${500 + dx} 780 C${500 + dx * 1.1} 600 ${500 + dx * 0.9} 420 ${500 + dx} ${yy - 560}`, f, 'ln ac thin dash')
      }).join('')
      const current = t > w[5] ? Array.from({ length: 10 }, (_, i) => {
        const u = ((t * 0.5 + i / 10) % 1) * 4
        const [px, py] = u < 1 ? [lerp(-150, 150, u), -88] : u < 2 ? [150, lerp(-88, 88, u - 1)] : u < 3 ? [lerp(150, -150, u - 2), 88] : [-150, lerp(88, -88, u - 3)]
        return `<circle class="fa" cx="${(500 + px * 1.3).toFixed(1)}" cy="${(320 + py * 1.3).toFixed(1)}" r="7"/>`
      }).join('') : ''
      return lines + card(500, 320, { s: 1.3, coil: 1, lit }) + current +
        text(500, 640, 'just enough power, just for a moment', { size: 30, cls: 't mu', opacity: seg(t, w[9], w[11]) })
    },
  },
  { // 5 That's why you have to get within a few centimetres.
    headline: 'A few *centimetres*',
    draw: ({ t, w }) => {
      const k = easeInOut(seg(t, w[3], w[9]))
      const cm = lerp(10, 2, k)
      const y = 640 - cm * 50
      return line(150, 640, 150, 140, 1, 'ln dim') +
        Array.from({ length: 11 }, (_, i) => line(150, 640 - i * 50, i % 5 === 0 ? 190 : 172, 640 - i * 50, 1, 'ln dim thin') +
          (i % 5 === 0 ? text(210, 650 - i * 50, `${i} cm`, { size: 22, cls: 't m mu', anchor: 'start' }) : '')).join('') +
        `<rect class="fl" x="300" y="650" width="500" height="40" rx="12"/>` + text(550, 740, 'READER', { size: 22, cls: 't m mu' }) +
        line(260, y, 290, y, 1, 'ln ac') + card(550, y - 110, { s: 0.85, lit: cm < 4 ? 1 : 0 }) +
        text(880, y - 100, `${cm.toFixed(1)} cm`, { size: 34, cls: cm < 4 ? 't m ac' : 't m', weight: 700 })
    },
  },
  { // 6 Now the chip wakes up and talks back, over radio.
    headline: 'The chip *talks*',
    draw: ({ t, w }) => {
      const k = seg(t, w[5], w[9] + 0.3)
      const bits = Array.from({ length: 8 }, (_, i) => {
        const u = ((t * 0.8 + i / 8) % 1)
        return u < k ? text(lerp(380, 640, u), lerp(260, 470, u) + Math.sin(u * 20) * 14, i % 2 ? '1' : '0', { size: 30, cls: 't m ac', weight: 700 }) : ''
      }).join('')
      return card(250, 220, { s: 0.9, lit: 1 }) + terminal(780, 520, { screen: '…' }) + bits +
        text(500, 760, 'over radio, at 13.56 MHz', { size: 30, cls: 't mu', opacity: seg(t, w[8], w[9] + 0.3) })
    },
  },
  { // 7 But if it only sent your card number, anyone could copy it.
    headline: 'A number can be *copied*',
    draw: ({ t, w }) => {
      const k = easeInOut(seg(t, w[3], w[7]))
      const clones = seg(t, w[10], w[11] + 0.3)
      return card(220, 180, { s: 0.75, lit: 1 }) +
        pill(lerp(300, 400, k), lerp(330, 450, k), PAN, { size: 24, p: seg(t, w[3], w[4]) }) +
        fade(seg(t, w[7], w[8] + 0.2), rect(620, 390, 260, 120, { r: 18, cls: 'ln dash' }) + text(750, 462, 'SKIMMER', { size: 26, cls: 't m', weight: 700 }) +
          path('M750 390 V330 M730 330 H770', 1, 'ln thin'), 20) +
        [0, 1, 2].map((i) => pop(620 + i * 120, 650, seg(clones, i * 0.25, i * 0.25 + 0.5), card(620 + i * 120, 650, { s: 0.32, ghost: true }))).join('') +
        text(300, 660, 'COPY', { size: 40, cls: 't ac', weight: 800, opacity: clones })
    },
  },
  { // 8 So the chip holds a secret key that never leaves it.
    headline: 'A *secret key*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const bounce = seg(t, w[8], w[10] + 0.3)
      return `<rect class="fp" x="260" y="170" width="480" height="360" rx="40" opacity="${p.toFixed(2)}"/>` + rect(260, 170, 480, 360, { r: 40, p, cls: 'ln ac' }) +
        line(260, 290, 740, 290, p, 'ln ac thin') + line(260, 410, 740, 410, p, 'ln ac thin') + line(420, 170, 420, 530, p, 'ln ac thin') + line(580, 170, 580, 530, p, 'ln ac thin') +
        pop(500, 350, seg(t, w[4], w[6]), `<rect class="fb" x="380" y="300" width="240" height="100" rx="20"/>` + keyIcon(500, 350, 1.2)) +
        arrow(500, 300, 500, lerp(300, 120, Math.sin(bounce * Math.PI)), bounce > 0 && bounce < 1 ? 1 : 0, 'ln dim') +
        cross(500, 110, 28, seg(t, w[8], w[9] + 0.2)) +
        text(500, 640, 'it never leaves the chip', { size: 36, cls: 't ac', weight: 700, opacity: seg(t, w[9], w[10] + 0.3) })
    },
  },
  { // 9 It signs this exact payment: the amount, the shop, a random number from the reader.
    headline: 'Sign *this* payment',
    draw: ({ t, w }) => {
      const items = [['€4.50', 6, 170], ['Coffee Corner', 8, 330], ['random 7F3A91C2', 11, 490]]
      const p = easeOut(seg(t, 0, 0.5))
      const sign = seg(t, w[12], w[14] + 0.3)
      return items.map(([s, wi, y]) => {
        const a = seg(t, w[wi] - 0.1, w[wi] + 0.3)
        return (a > 0 ? pill(260, y, s, { size: 26, p: a }) : '') + arrow(480, y, 600, lerp(y, 330, 0.6), seg(t, w[wi] + 0.2, w[wi] + 0.6), 'ln ac thin')
      }).join('') +
        `<rect class="fp" x="620" y="230" width="260" height="200" rx="26" opacity="${p.toFixed(2)}"/>` + rect(620, 230, 260, 200, { r: 26, cls: sign > 0.5 ? 'ln ac glow' : 'ln ac', p }) +
        keyIcon(750, 315, 0.9) + text(750, 400, 'CHIP', { size: 22, cls: 't m mu', opacity: p }) +
        text(750, 520, 'signed ✓', { size: 34, cls: 't m ac', weight: 700, opacity: sign }) +
        text(500, 660, 'amount + shop + random number', { size: 30, cls: 't mu', opacity: seg(t, w[12], w[14] + 0.3) })
    },
  },
  { // 10 The result is a one-time code. Useless for any other payment.
    headline: 'A *one-time* code',
    draw: ({ t, w }) => {
      const stamp = backOut(seg(t, w[3], w[5]))
      const replay = easeInOut(seg(t, w[6], w[9]))
      return (stamp > 0 ? `<g transform="translate(500 220) rotate(-4) scale(${stamp.toFixed(3)})">` + `<rect class="fp" x="-330" y="-80" width="660" height="160" rx="24"/>` + rect(-330, -80, 660, 160, { r: 24, cls: 'ln ac thick' }) +
        text(0, -22, 'ONE-TIME CODE', { size: 24, cls: 't m mu' }) + text(0, 40, CODE, { size: 48, cls: 't m ac', weight: 700 }) + '</g>' : '') +
        (replay > 0 ? pill(lerp(220, 500, replay), 520, 'same code again', { size: 24, box: 'ln dash' }) : '') +
        fade(seg(t, w[6], w[7]), terminal(840, 560, { screen: '€80.00' }), 20) +
        cross(840, 470, 50, seg(t, w[9], w[10] + 0.3)) +
        text(300, 680, 'rejected', { size: 40, cls: 't ac', weight: 800, opacity: seg(t, w[10], w[10] + 0.3) })
    },
  },
  { // 11 The terminal sends it through the card network to your bank.
    headline: 'To your *bank*',
    draw: ({ t, w }) => {
      const k = easeInOut(seg(t, w[1], w[10] + 0.2))
      const [x, y] = along(k)
      const lit = k < 0.05 ? 0 : k < 0.95 ? 1 : 2
      return route(easeOut(seg(t, 0, 0.6)), lit) + (k > 0 && k < 1 ? pill(x, y, 'code', { size: 26, box: 'ln ac', cls: 'ac' }) : '') +
        bank(560, 680, seg(t, w[9], w[10] + 0.2), 0.7)
    },
  },
  { // 12 Your bank checks the code with its copy of the key, and your balance.
    headline: 'The bank *checks*',
    draw: ({ t, w }) => {
      const bal = seg(t, w[12], w[13] + 0.4)
      return bank(500, 170, easeOut(seg(t, 0, 0.6)), 0.9) +
        fade(seg(t, w[2], w[4]), text(150, 380, 'code', { size: 34, cls: 't m', anchor: 'start' }) + text(330, 380, CODE.slice(0, 9) + '…', { size: 34, cls: 't m ac', anchor: 'start', weight: 700 }), 10) +
        keyIcon(860, 368, 0.6) +
        check(800, 470, 24, seg(t, w[9], w[10] + 0.2)) +
        text(150, 475, 'same key → same code', { size: 28, cls: 't mu', anchor: 'start', opacity: seg(t, w[6], w[10]) }) +
        fade(seg(t, w[11], w[12]), text(150, 600, 'balance', { size: 34, cls: 't m', anchor: 'start' }) + rect(330, 572, 420, 36, { r: 18, cls: 'ln dim thin' }) +
          `<rect class="fa" x="330" y="572" width="${(300 * bal).toFixed(1)}" height="36" rx="18"/>` + text(780, 600, '€4.50 ✓', { size: 30, cls: 't m ac', anchor: 'start', weight: 700, opacity: seg(bal, 0.7, 1) }), 10)
    },
  },
  { // 13 Then it answers: approved.
    headline: '*Approved*',
    draw: ({ t, w }) => {
      const s = backOut(seg(t, w[3] - 0.1, w[3] + 0.35))
      return bank(500, 170, 1, 0.7) + (s > 0 ? `<g transform="translate(500 450) rotate(-8) scale(${(s * 1.0).toFixed(3)})">` + rect(-350, -90, 700, 180, { r: 24, cls: 'ln ac thick' }) +
        text(0, 22, 'APPROVED', { size: 60, cls: 't ac', weight: 800 }) + '</g>' : '')
    },
  },
  { // 14 The answer travels all the way back.
    headline: 'All the way *back*',
    draw: ({ t, w }) => {
      const k = 1 - easeInOut(seg(t, w[1], w[6] + 0.2))
      const [x, y] = along(k)
      return route(1, k > 0.95 ? 2 : k > 0.05 ? 1 : 0) + (k > 0 && k < 1 ? pill(x, y, 'APPROVED', { size: 24, box: 'ln ac', cls: 'ac' }) : '')
    },
  },
  { // 15 Beep. Green tick.
    headline: '*Beep*',
    draw: ({ t, w }) => {
      const ok = seg(t, w[0] - 0.05, w[0] + 0.3)
      const beep = seg(t, w[0], w[1])
      return terminal(500, 440, { ok }) +
        [1, 2, 3].map((i) => path(`M${640 + i * 34} ${300 - i * 30} Q${680 + i * 40} 300 ${640 + i * 34} ${300 + i * 30}`, beep, 'ln ac')).join('') +
        [1, 2, 3].map((i) => path(`M${360 - i * 34} ${300 - i * 30} Q${320 - i * 40} 300 ${360 - i * 34} ${300 + i * 30}`, beep, 'ln ac')).join('')
    },
  },
  { // 16 All of that, in about a second.
    headline: 'About a *second*',
    draw: ({ t, w }) => {
      const rows = [['Power + wake up', 0, 20], ['Chip signs', 20, 120], ['To the bank', 140, 300], ['Bank checks', 440, 160], ['Answer back', 600, 300]]
      const scale = 520 / 900
      const total = seg(t, w[5], w[6] + 0.2)
      return rows.map(([label, start, ms], i) => {
        const k = easeOut(seg(t, w[0] + i * 0.3, w[0] + i * 0.3 + 0.4))
        const y = 60 + i * 100
        return fade(k, text(60, y + 32, label, { size: 28, cls: 't m', anchor: 'start' }) +
          `<rect class="${i === 1 ? 'fa' : 'fl'}" x="${360 + start * scale}" y="${y + 6}" width="${(ms * scale * k).toFixed(1)}" height="36" rx="10"/>` +
          text(Math.min(360 + (start + ms) * scale + 12, 880), y + 34, `${ms} ms`, { size: 22, cls: 't m mu', anchor: 'start' }), 10)
      }).join('') + line(60, 600, 940, 600, total, 'ln') +
        text(500, 690, '≈ 0.9 s in total (typical)', { size: 44, cls: 't ac', weight: 800, opacity: total })
    },
  },
  { // 17 Now you know.
    headline: 'Now you *know*',
    draw: ({ t }) => card(500, 150, { s: 0.7 * (0.6 + 0.4 * backOut(seg(t, 0, 0.6))), p: easeOut(seg(t, 0, 0.6)), lit: 1, coil: seg(t, 0.3, 0.9) }) +
      text(500, 380, 'HOW IT ACTUALLY WORKS', { size: 40, weight: 800, opacity: seg(t, 0.3, 0.8) }) +
      text(500, 470, 'Next: how can nobody read', { size: 36, cls: 't mu', opacity: seg(t, 0.6, 1.1) }) +
      text(500, 520, 'your WhatsApp messages?', { size: 36, cls: 't mu', opacity: seg(t, 0.6, 1.1) }) +
      fade(seg(t, 1.0, 1.5), rect(270, 590, 460, 90, { r: 45, cls: 'ln ac' }) + text(500, 648, 'Follow for ep. 04', { size: 34, cls: 't ac', weight: 700 }), 20)
  },
]

export default {
  series: 'How it actually works · 03',
  fontsUrl: 'https://fonts.googleapis.com/css2?family=Spline+Sans+Mono:wght@500;600;700&family=Syne:wght@600;700;800&display=block',
  theme: {
    bg: '#231d0f',
    backdrop: 'radial-gradient(70% 38% at 50% 50%, rgb(255 190 11 / 0.10), transparent 70%), #231d0f',
    grid: 'rgb(255 190 11 / 0.10)',
    ink: '#fbf3df',
    muted: '#a89b7e',
    faint: 'rgb(251 243 223 / 0.12)',
    line: '#4a3f27',
    panel: '#2e2615',
    soft: '#5c4816',
    accent: '#ffbe0b',
    'headline-size': '66px',
    'headline-tracking': '0px',
    display: "'Syne', sans-serif",
    mono: "'Spline Sans Mono', monospace",
  },
  chapters: [
    { title: 'The question', from: 0, to: 1 },
    { title: 'Power', from: 2, to: 5 },
    { title: 'Talking', from: 6, to: 7 },
    { title: 'The secret', from: 8, to: 10 },
    { title: 'The bank', from: 11, to: 14 },
    { title: 'Done', from: 15, to: 17 },
  ],
  scenes,
}
