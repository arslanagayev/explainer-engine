// Episode 04: how can nobody read your messages? One scene per voice-over line (see script.md).
// Deliberately no messenger branding: generic phones, bubbles and padlocks.
import { arrow, backOut, check, clamp, cross, easeInOut, easeOut, fade, lerp, line, path, pop, rect, rng, seg, text } from '../../engine/lib.js'
import { bubble, garble, keyIcon, lock, phone, server, user } from '../../engine/props.js'

const MSG = 'see you at 8?'
const CODE = ['37481', '20519', '88302', '61947', '05263', '74118', '29350', '86621', '13079', '40582', '97214', '58836']

// ---------- Episode props ----------
const padlock = (x, y, s = 1, open = 0, cls = 'ln ac') => `<g transform="translate(${x} ${y}) scale(${s})">${lock(0, 0, { open, cls })}</g>`
/** A box with a padlock on its front. */
const box = (x, y, { p = 1, open = 0, glow = false } = {}) =>
  `<rect class="fp" x="${x - 110}" y="${y - 80}" width="220" height="160" rx="16" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x - 110, y - 80, 220, 160, { r: 16, p, cls: glow ? 'ln ac glow' : 'ln' }) + line(x - 110, y - 40, x + 110, y - 40, p, 'ln dim') +
  (p > 0.6 ? padlock(x, y + 6, 0.8, open) : '')
const thief = (x, y, p = 1) => user(x, y, p) + `<rect class="fi" x="${x - 34}" y="${y - 134}" width="68" height="18" rx="9" opacity="${clamp(p * 2 - 1).toFixed(2)}"/>`
/** A key whose teeth change with `seed`, for "the keys keep changing". */
const morphKey = (x, y, seed, s = 1) => {
  const r = rng(7 + seed)
  const teeth = [0, 1, 2, 3].map((i) => `M${14 + i * 14} 0 V${(8 + r() * 18).toFixed(1)}`).join(' ')
  return `<g transform="translate(${x} ${y}) scale(${s})">` + path('M-60 0 a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0', 1, 'ln ac') + path(`M-8 0 H72 ${teeth}`, 1, 'ln ac') + '</g>'
}

// ---------- Scenes ----------
const scenes = [
  { // 0 How can nobody read your WhatsApp messages? Not even WhatsApp?
    headline: 'Can *anyone* read it?',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.6))
      return phone(220, 420, { p }) + phone(780, 420, { p }) + text(220, 680, 'YOU', { size: 22, cls: 't m mu', opacity: p }) + text(780, 680, 'SAM', { size: 22, cls: 't m mu', opacity: p }) +
        pop(220, 360, seg(t, w[3], w[4] + 0.3), bubble(220, 360, MSG, { size: 22 })) +
        pop(500, 170, seg(t, w[7], w[9] + 0.2), text(500, 210, '?', { size: 130, cls: 't ac', weight: 800 })) +
        text(500, 300, 'not even the app?', { size: 30, cls: 't mu', opacity: seg(t, w[8], w[9] + 0.3) })
    },
  },
  { // 1 Here's the twist: every message goes through their servers.
    headline: 'Through their *servers*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const k = easeInOut(seg(t, w[3], w[8] + 0.3))
      const x = k < 0.5 ? lerp(220, 500, k * 2) : lerp(500, 780, (k - 0.5) * 2)
      const y = k < 0.5 ? lerp(420, 230, k * 2) : lerp(230, 420, (k - 0.5) * 2)
      return phone(180, 480, { p }) + phone(820, 480, { p }) + server(500, 200, p, t) + text(500, 320, 'SERVER', { size: 22, cls: 't m mu', opacity: p }) +
        path('M290 420 Q500 120 710 420', p, 'ln dim dash') + (k > 0 && k < 1 ? bubble(x, y, MSG, { size: 20 }) : '')
    },
  },
  { // 2 But what arrives there is scrambled, and they don't have the key.
    headline: '*Scrambled*',
    draw: ({ t, w }) => {
      const s = seg(t, w[4], w[5] + 0.2)
      return server(500, 230, easeOut(seg(t, 0, 0.5)), t) +
        bubble(500, 420, s > 0 ? garble(13, t) : MSG, { size: 30, cls: s > 0 ? 't m ac' : 't' }) +
        fade(seg(t, w[8], w[10]), keyIcon(470, 600, 1.1, 'ln dim') + cross(500, 600, 46, seg(t, w[10], w[11] + 0.3)), 20)
    },
  },
  { // 3 Your phone makes two keys. A public one it shares, and a private one that never leaves it.
    headline: 'Two *keys*',
    draw: ({ t, w }) => {
      const pub = seg(t, w[5], w[7]), priv = seg(t, w[11], w[13])
      const share = easeOut(seg(t, w[8], w[10] + 0.4))
      return phone(280, 420, { p: easeOut(seg(t, 0, 0.5)) }) +
        pop(280, 470, priv, keyIcon(280, 470, 1, 'ln ac') + padlock(280, 380, 0.7)) +
        text(280, 680, 'PRIVATE · never leaves', { size: 22, cls: 't m ac', opacity: seg(t, w[14], w[16]) }) +
        pop(720, 200, pub, keyIcon(720, 200, 1, 'ln')) + text(720, 290, 'PUBLIC · shared', { size: 22, cls: 't m', opacity: pub }) +
        [0, 1, 2].map((i) => share > 0 ? `<g opacity="${(1 - share * 0.6).toFixed(2)}">${keyIcon(lerp(720, 600 + i * 140, share), lerp(200, 470 + i * 40, share), 0.55, 'ln')}</g>` : '').join('')
    },
  },
  { // 4 Think of the public key as an open padlock. Anyone can snap it shut.
    headline: 'An open *padlock*',
    draw: ({ t, w }) => {
      const big = backOut(seg(t, w[6], w[8]))
      const shut = easeInOut(seg(t, w[11], w[13] + 0.2))
      return (big > 0 ? padlock(500, 230, 2.4 * big, 1) : '') +
        [200, 500, 800].map((x, i) => fade(seg(t, w[9] + i * 0.12, w[10] + i * 0.12), user(x, 700, 1) + padlock(x, 520, 0.7, i === 1 ? 1 - shut : 1, i === 1 ? 'ln ac' : 'ln'), 20)).join('')
    },
  },
  { // 5 But only the private key can open it again.
    headline: 'Only one *key*',
    draw: ({ t, w }) => {
      const k = easeInOut(seg(t, w[2], w[5]))
      const open = easeOut(seg(t, w[6], w[7] + 0.3))
      return padlock(560, 340, 2.4, open) + keyIcon(lerp(80, 300, k), 380, 1.3) +
        text(500, 680, 'the private key, from your friend\'s phone only', { size: 28, cls: 't mu', opacity: seg(t, w[3], w[5]) })
    },
  },
  { // 6 So when you message a friend, your phone locks it with your friend's padlock.
    headline: 'Locked for your *friend*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const into = easeInOut(seg(t, w[2], w[6]))
      const pad = easeInOut(seg(t, w[10], w[13] + 0.2))
      return phone(150, 470, { p }) + phone(850, 470, { p }) + text(850, 730, 'SAM', { size: 22, cls: 't m mu', opacity: p }) +
        (into < 1 ? bubble(lerp(150, 500, into), lerp(420, 470, into), MSG, { size: 18 }) : '') +
        `<rect class="fp" x="390" y="390" width="220" height="160" rx="16"/>` + rect(390, 390, 220, 160, { r: 16, cls: 'ln' }) + line(390, 430, 610, 430, 1, 'ln dim') +
        (pad > 0 ? padlock(lerp(850, 500, pad), lerp(330, 476, pad), lerp(0.6, 0.8, pad), pad < 1 ? 1 : 0) : '') +
        text(500, 300, "Sam's padlock", { size: 28, cls: 't ac', weight: 700, opacity: seg(t, w[11], w[13]) })
    },
  },
  { // 7 The server only sees a locked box. It just passes it on.
    headline: 'A locked *box*',
    draw: ({ t, w }) => {
      const k = easeInOut(seg(t, w[8], w[11] + 0.3))
      return server(500, 560, easeOut(seg(t, 0, 0.5)), t) + text(500, 700, 'SERVER', { size: 22, cls: 't m mu' }) +
        box(lerp(500, 760, k), 330, { p: 1 }) + (k > 0 ? arrow(500, 440, lerp(500, 860, k), 440, 1, 'ln ac thin') : '') +
        fade(1 - k, cross(390, 140, 22, seg(t, w[4], w[6])) + text(430, 150, "can't open it", { size: 28, cls: 't ac', anchor: 'start', weight: 700, opacity: seg(t, w[5], w[6] + 0.2) }))
    },
  },
  { // 8 Your friend's phone opens it with the key it never shared.
    headline: '*Opened* on arrival',
    draw: ({ t, w }) => {
      const key = easeInOut(seg(t, w[3], w[6]))
      const open = easeOut(seg(t, w[6], w[7] + 0.3))
      return phone(700, 420, { p: 1 }) + text(700, 680, 'SAM', { size: 22, cls: 't m mu' }) +
        (open < 1 ? box(700, 400, { open }) : '') + keyIcon(lerp(250, 560, key), 470, 1) +
        pop(700, 360, seg(t, w[7], w[8] + 0.3), bubble(700, 360, MSG, { size: 20, mine: false })) +
        text(260, 620, 'the key it never shared', { size: 28, cls: 't mu', opacity: seg(t, w[8], w[10] + 0.2) })
    },
  },
  { // 9 But what if a key is stolen one day?
    headline: 'A stolen *key*?',
    draw: ({ t, w }) => {
      const k = easeInOut(seg(t, w[4], w[6] + 0.3))
      return phone(260, 420, { p: 1 }) + thief(760, 520, easeOut(seg(t, w[2], w[4]))) +
        keyIcon(lerp(260, 700, k), lerp(460, 330, k), 1) +
        pop(760, 200, seg(t, w[7], w[8] + 0.3), text(760, 240, '?', { size: 110, cls: 't ac', weight: 800 }))
    },
  },
  { // 10 So the keys keep changing.
    headline: 'Keys keep *changing*',
    draw: ({ t, w }) => {
      const seed = t > w[2] ? Math.floor((t - w[2]) * 5) : 0
      return morphKey(470, 360, seed, 2.4) + text(500, 600, `key #${1000 + seed}`, { size: 34, cls: 't m ac', weight: 700, opacity: seg(t, w[2], w[3]) })
    },
  },
  { // 11 Every message gets a fresh key, and old ones are thrown away.
    headline: 'A *fresh* key each time',
    draw: ({ t, w }) => {
      const msgs = ['hey', 'free tonight?', 'see you at 8?', 'on my way']
      return msgs.map((m, i) => {
        const a = seg(t, w[0] + i * 0.45, w[0] + i * 0.45 + 0.3)
        const gone = i < 3 ? seg(t, w[7] + i * 0.25, w[10] + i * 0.25) : 0
        const y = 110 + i * 160
        return fade(a, bubble(330, y, m, { size: 24 }) + `<g opacity="${(1 - gone).toFixed(3)}">${morphKey(720, y, i * 3, 0.8)}</g>` +
          (gone > 0.5 ? text(750, y + 10, 'deleted', { size: 24, cls: 't m mu', opacity: seg(gone, 0.5, 1) }) : ''), 15)
      }).join('')
    },
  },
  { // 12 Stealing today's key doesn't unlock yesterday's chats.
    headline: 'The past stays *locked*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const tryIt = seg(t, w[2], w[4])
      return text(250, 110, 'YESTERDAY', { size: 24, cls: 't m mu', opacity: p }) + text(760, 110, 'TODAY', { size: 24, cls: 't m mu', opacity: p }) +
        [0, 1, 2].map((i) => box(250, 230 + i * 190, { p }) ).join('') +
        thief(760, 560, p) + keyIcon(740, 330, 0.9) +
        arrow(640, 330, lerp(640, 400, tryIt), 330, tryIt > 0 ? 1 : 0, 'ln ac dash') +
        cross(470, 330, 30, seg(t, w[4], w[5] + 0.2)) +
        text(250, 790, 'still locked', { size: 32, cls: 't ac', weight: 700, opacity: seg(t, w[5], w[6] + 0.2) })
    },
  },
  { // 13 Want proof nobody swapped the padlock in between?
    headline: 'A swapped *padlock*?',
    draw: ({ t, w }) => {
      const k = easeInOut(seg(t, w[0], w[3]))
      const swap = seg(t, w[3], w[5])
      return phone(130, 470, { p: 1 }) + phone(870, 470, { p: 1 }) +
        fade(seg(t, w[2], w[3]), user(500, 640, 1, 'in the middle?') + path('M440 470 L560 470', 1, 'ln dim dash'), 20) +
        (swap < 0.5 ? padlock(lerp(870, 500, k), 330, 0.9, 1) : padlock(500, 330, 0.9, 1, 'ln dash')) +
        pop(500, 170, seg(t, w[6], w[7] + 0.3), text(500, 210, '?', { size: 100, cls: 't ac', weight: 800 }))
    },
  },
  { // 14 Compare the security code with your friend. A match means nobody's in the middle.
    headline: 'Compare the *code*',
    draw: ({ t, w }) => {
      const show = seg(t, w[1], w[3] + 0.3)
      const match = seg(t, w[8], w[9])
      const grid = (x) => CODE.map((g, i) => text(x - 66 + (i % 3) * 66, 330 + Math.floor(i / 3) * 44, g, { size: 18, cls: match > 0.5 ? 't m ac' : 't m', opacity: seg(show, i / 12, i / 12 + 0.3) })).join('')
      return phone(250, 420, { p: 1, cls: match > 0.5 ? 'ln ac' : 'ln' }) + phone(750, 420, { p: 1, cls: match > 0.5 ? 'ln ac' : 'ln' }) +
        text(250, 270, 'SECURITY CODE', { size: 16, cls: 't m mu', opacity: show }) + text(750, 270, 'SECURITY CODE', { size: 16, cls: 't m mu', opacity: show }) +
        grid(250) + grid(750) + text(500, 440, '=', { size: 80, cls: 't ac', weight: 800, opacity: match }) +
        check(500, 720, 30, seg(t, w[9], w[10])) + text(560, 732, 'nobody in the middle', { size: 30, cls: 't ac', anchor: 'start', weight: 700, opacity: seg(t, w[10], w[13]) })
    },
  },
  { // 15 One honest catch: the server still sees who you talk to, and when.
    headline: 'The honest *catch*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const rows = [['you → sam', '20:41'], ['sam → you', '20:42'], ['you → sam', '20:43']]
      return rect(60, 80, 880, 470, { r: 22, p }) + line(60, 165, 940, 165, p, 'ln dim') +
        text(100, 135, 'WHO', { size: 22, cls: 't m mu', anchor: 'start', opacity: p }) + text(440, 135, 'WHEN', { size: 22, cls: 't m mu', anchor: 'start', opacity: p }) +
        text(640, 135, 'WHAT', { size: 22, cls: 't m mu', anchor: 'start', opacity: p }) +
        rows.map(([who, when], i) => {
          const y = 250 + i * 110
          return text(100, y, who, { size: 30, cls: 't m ac', anchor: 'start', weight: 700, opacity: seg(t, w[7] + i * 0.15, w[9] + i * 0.15) }) +
            text(440, y, when, { size: 30, cls: 't m ac', anchor: 'start', weight: 700, opacity: seg(t, w[11] + i * 0.15, w[12] + i * 0.15) }) +
            padlock(670, y - 12, 0.4, 0, 'ln dim') + text(710, y, '••••••', { size: 30, cls: 't m mu', anchor: 'start', opacity: p })
        }).join('') +
        text(500, 660, 'metadata is visible, messages are not', { size: 30, cls: 't mu', opacity: seg(t, w[12], w[12] + 0.4) })
    },
  },
  { // 16 But what you say stays between your two phones.
    headline: 'Just *you two*',
    draw: ({ t, w }) => {
      const glow = seg(t, w[4], w[8])
      return phone(200, 420, { p: 1, cls: 'ln ac' }) + phone(800, 420, { p: 1, cls: 'ln ac' }) +
        path('M310 420 C420 300 580 300 690 420', glow, 'ln ac thick') + padlock(500, 300, 0.8, 0) +
        `<g opacity="0.35">${server(500, 660, 1, t)}</g>` + text(500, 790, 'only carries locked boxes', { size: 24, cls: 't m mu', opacity: seg(t, w[6], w[8]) })
    },
  },
  { // 17 Now you know.
    headline: 'Now you *know*',
    draw: ({ t }) => {
      const s = backOut(seg(t, 0, 0.6))
      return (s > 0 ? padlock(500, 150, 1.4 * s, 0, 'ln ac glow') : '') +
        text(500, 380, 'HOW IT ACTUALLY WORKS', { size: 50, weight: 800, opacity: seg(t, 0.3, 0.8) }) +
        text(500, 450, 'Season 1 complete · 4 episodes', { size: 32, cls: 't mu', opacity: seg(t, 0.6, 1.1) }) +
        fade(seg(t, 1.0, 1.5), rect(200, 540, 600, 100, { r: 50, cls: 'ln ac' }) + text(500, 604, 'What should I explain next?', { size: 32, cls: 't ac', weight: 700 }), 20)
    },
  },
]

export default {
  series: 'How it actually works · 04',
  fontsUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600..900&family=Sometype+Mono:wght@500;600;700&display=block',
  theme: {
    bg: '#2a0a12',
    backdrop: 'radial-gradient(70% 38% at 50% 50%, rgb(255 198 168 / 0.10), transparent 70%), #2a0a12',
    grid: 'rgb(255 198 168 / 0.10)',
    ink: '#fff1ea',
    muted: '#c09a93',
    faint: 'rgb(255 241 234 / 0.12)',
    line: '#5c2532',
    panel: '#3a0f1b',
    soft: '#741a2f',
    accent: '#ffc6a8',
    display: "'Fraunces', serif",
    mono: "'Sometype Mono', monospace",
    'headline-size': '92px',
    'headline-tracking': '-1px',
  },
  chapters: [
    { title: 'The question', from: 0, to: 2 },
    { title: 'Two keys', from: 3, to: 5 },
    { title: 'Sending', from: 6, to: 8 },
    { title: 'Stolen keys', from: 9, to: 12 },
    { title: 'Proof', from: 13, to: 14 },
    { title: 'The catch', from: 15, to: 17 },
  ],
  scenes,
}
