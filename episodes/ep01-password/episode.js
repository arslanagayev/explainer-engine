// Episode 01: where does your password go? One scene per voice-over line (see script.md).
// Each draw({ t, d, w }) gets the scene's local time t, its duration d and the local start time
// of every spoken word w[k], and returns SVG markup for a 1000x800 stage.
import { arrow, backOut, check, clamp, cross, easeInOut, easeOut, fade, lerp, line, move, path, pop, rect, rng, seg, text, typed } from '../../engine/lib.js'
import { db, garble, gear, hex, laptop, lock, pill, server, user } from '../../engine/props.js'

const PW = 'sunflower42'
const SALT = 'x7#Qp9'
const SALT2 = 'Lm2!vR'
const HASH = ['a3f1c09e7b2d44e8', '9c61d0f2b85e7a13', '4d0e8b27f6a91c35', 'e72b5f08c4d93a61']
const HASH2 = '5be08d7a19c3f6b0'

// ---------- Episode props ----------
const fingerprint = (x, y, p = 1, s = 1) => [0, 1, 2, 3, 4].map((k) => {
  const r = (20 + k * 19) * s
  const a0 = Math.PI * (1.05 - k * 0.04), a1 = Math.PI * (2.0 + k * 0.05)
  const d = `M${x + r * Math.cos(a0)} ${y + r * 1.25 * Math.sin(a0)} A${r} ${r * 1.25} 0 1 1 ${x + r * Math.cos(a1)} ${y + r * 1.25 * Math.sin(a1)}`
  return path(d, seg(p, k * 0.1, 0.55 + k * 0.1), 'ln ac')
}).join('')
const hashBox = (x, y, t, { w = 340, h = 190, p = 1, speed = 90, glow = 0, size = 56 } = {}) =>
  `<rect class="fp" x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="22" opacity="${clamp(p * 3).toFixed(2)}"/>` +
  rect(x - w / 2, y - h / 2, w, h, { r: 22, p, cls: glow > 0.5 ? 'ln ac glow' : 'ln ac' }) +
  text(x - w * 0.08, y + size * 0.36, 'HASH', { size, weight: 800, opacity: clamp(p * 2 - 0.8) }) +
  (p > 0.6 ? gear(x + w * 0.33, y, h * 0.16, t * speed) : '')
// ---------- Scenes ----------
const scenes = [
  { // 0 What happens when you type your password into a website?
    headline: 'Where does your *password* go?',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.7))
      const dots = Math.floor(11 * seg(t, w[4], w[9] + 0.3))
      const caret = Math.floor(t * 2.2) % 2 === 0 && dots < 11
      return rect(250, 130, 500, 560, { r: 28, p }) +
        text(500, 210, 'Sign in', { size: 44, weight: 800, opacity: p }) +
        text(300, 275, 'EMAIL', { size: 22, cls: 't mu m', anchor: 'start', opacity: p }) +
        rect(300, 290, 400, 78, { r: 14, p, cls: 'ln dim' }) + text(325, 341, 'alex@mail.com', { size: 30, cls: 't m', anchor: 'start', opacity: p }) +
        text(300, 415, 'PASSWORD', { size: 22, cls: 't mu m', anchor: 'start', opacity: p }) +
        rect(300, 430, 400, 78, { r: 14, p, cls: t > w[4] ? 'ln ac' : 'ln dim' }) +
        text(325, 487, '•'.repeat(dots) + (caret ? '|' : ''), { size: 40, cls: 't m', anchor: 'start', opacity: p }) +
        `<rect class="fa" x="300" y="565" width="400" height="80" rx="16" opacity="${p.toFixed(2)}"/>` + text(500, 617, 'LOG IN', { size: 30, cls: 't dk', weight: 800, opacity: p }) +
        pop(500, 62, seg(t, w[6], w[6] + 0.45), pill(500, 62, `you typed: ${PW}`, { size: 28, box: 'ln ac' }))
    },
  },
  { // 1 Here's the twist: the website never stores your password.
    headline: 'It never *stores* it',
    draw: ({ t, w }) => {
      const x = lerp(820, 600, easeInOut(seg(t, w[3], w[5])))
      const hit = seg(t, w[6] - 0.05, w[6] + 0.35)
      return db(280, 400, easeOut(seg(t, 0, 0.7))) + text(280, 590, 'DATABASE', { size: 24, cls: 't mu m', opacity: seg(t, 0.3, 0.8) }) +
        pill(x, 400, PW, { size: 32, p: seg(t, 0.2, 0.8) }) +
        (hit > 0 ? line(x - 120, 400, x + 120, 400, hit, 'ln ac thick') : '') +
        cross(x, 400, 70, seg(t, w[6] + 0.1, w[6] + 0.5)) +
        text(x, 560, 'plain text? never.', { size: 34, cls: 't ac', opacity: seg(t, w[7], w[7] + 0.4) })
    },
  },
  { // 2 The answer is a function that only works one way.
    headline: 'A *one-way* function',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.6))
      return pill(165, 300, PW, { size: 24, p }) +
        arrow(300, 300, 375, 300, seg(t, w[3], w[4])) +
        `<rect class="fp" x="385" y="210" width="230" height="180" rx="24" opacity="${p.toFixed(2)}"/>` + rect(385, 210, 230, 180, { r: 24, p, cls: 'ln ac' }) +
        text(500, 322, 'f( )', { size: 64, cls: 't m', weight: 700, opacity: p }) +
        arrow(625, 300, 700, 300, seg(t, w[4], w[5])) +
        text(710, 312, 'a3f1c0…', { size: 34, cls: 't m ac', anchor: 'start', opacity: seg(t, w[5], w[5] + 0.3) }) +
        path('M790 500 L500 500', seg(t, w[7], w[8] + 0.2), 'ln dash') +
        cross(500, 500, 40, seg(t, w[9], w[9] + 0.35)) +
        text(500, 640, 'no way back', { size: 40, cls: 't ac', weight: 700, opacity: seg(t, w[9] + 0.2, w[9] + 0.6) })
    },
  },
  { // 3 Your password travels to the server through an encrypted tunnel.
    headline: 'An encrypted *tunnel*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.6))
      const tp = seg(t, w[6], w[9])
      const k = easeInOut(seg(t, w[1], w[9] + 0.6))
      const x = lerp(250, 740, k)
      const inside = x > 300 && x < 700
      return laptop(140, 400, p) + text(140, 540, 'YOU', { size: 24, cls: 't mu m', opacity: p }) +
        server(860, 420, p, t) + text(860, 560, 'SERVER', { size: 24, cls: 't mu m', opacity: p }) +
        line(285, 345, 715, 345, tp, 'ln ac') + line(285, 455, 715, 455, tp, 'ln ac') +
        pop(500, 240, seg(t, w[8] - 0.1, w[8] + 0.4), lock(500, 240) + text(500, 160, 'HTTPS', { size: 28, cls: 't ac m', weight: 700 })) +
        (k > 0 && k < 1 ? pill(x, 400, inside && tp > 0.3 ? garble(8, t) : PW, { size: 24, box: inside ? 'ln ac' : 'ln' }) : '')
    },
  },
  { // 4 But the server never saves it.
    headline: 'Never *saved*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.6))
      return server(500, 200, p, t) + pill(500, 40, PW, { size: 26, p: seg(t, 0.1, 0.6) }) +
        arrow(500, 300, 500, 480, seg(t, w[2], w[4])) +
        cross(500, 390, 44, seg(t, w[3], w[4] + 0.2)) +
        db(500, 600, p, { w: 120, h: 120 }) + text(500, 735, 'DISK', { size: 24, cls: 't mu m', opacity: p })
    },
  },
  { // 5 First, it adds a few random characters. That's called a salt.
    headline: 'Add a *salt*',
    draw: ({ t, w }) => {
      const size = 62, cw = size * 0.6
      const total = (PW.length + 3 + SALT.length) * cw
      const left = 500 - total / 2
      const shift = easeInOut(seg(t, w[1], w[2] + 0.2))
      const x0 = lerp(500 - PW.length * cw / 2, left, shift)
      const n = Math.floor(SALT.length * seg(t, w[4], w[6] + 0.2))
      const sx = left + (PW.length + 3) * cw
      return text(x0, 330, PW, { size, cls: 't m', anchor: 'start', opacity: seg(t, 0, 0.4) }) +
        text(left + (PW.length + 1.5) * cw, 330, '+', { size, cls: 't mu m', opacity: shift }) +
        text(sx, 330, SALT.slice(0, n), { size, cls: 't m ac', anchor: 'start', weight: 700 }) +
        path(`M${sx} 372 V388 H${sx + SALT.length * cw} V372`, seg(t, w[9], w[10] + 0.2), 'ln ac') +
        text(sx + SALT.length * cw / 2, 450, 'SALT', { size: 40, cls: 't ac', weight: 800, opacity: seg(t, w[10], w[10] + 0.3) }) +
        text(500, 600, 'random · different for every user', { size: 32, cls: 't mu', opacity: seg(t, w[10] + 0.2, w[10] + 0.6) })
    },
  },
  { // 6 Then it runs both through a hash function.
    headline: 'Into the *hash*',
    draw: ({ t, w }) => {
      const k = easeInOut(seg(t, w[2], w[7]))
      const y = lerp(120, 470, k)
      const size = 44
      const s = PW + SALT
      const left = 500 - s.length * size * 0.3
      const fadeIn = clamp((395 - y) / 70)
      const sc = lerp(1, 0.55, k)
      const glow = seg(t, w[6], w[7])
      return `<g opacity="${(fadeIn * seg(t, 0, 0.4)).toFixed(3)}" transform="translate(500 ${y}) scale(${sc.toFixed(3)}) translate(-500 ${-y})">` +
        text(left, y, PW, { size, cls: 't m', anchor: 'start' }) + text(left + PW.length * size * 0.6, y, SALT, { size, cls: 't m ac', anchor: 'start', weight: 700 }) + '</g>' +
        hashBox(500, 480, t, { p: easeOut(seg(t, 0, 0.6)), speed: 60 + glow * 300, glow }) +
        text(500, 640, 'bcrypt · scrypt · Argon2', { size: 28, cls: 't mu m', opacity: seg(t, w[6], w[7] + 0.3) })
    },
  },
  { // 7 Out comes a scrambled string of fixed length. A fingerprint.
    headline: 'A *fingerprint*',
    draw: ({ t, w }) => {
      const typedP = seg(t, w[0], w[5])
      const all = HASH.join('')
      const n = Math.floor(all.length * typedP)
      const rows = HASH.map((row, i) => text(340, 290 + i * 62, row.slice(0, clamp(n - i * 16, 0, 16)), { size: 40, cls: 't m', anchor: 'middle' })).join('')
      return hashBox(340, 90, t, { w: 260, h: 120, size: 40, p: easeOut(seg(t, 0, 0.5)) }) +
        arrow(340, 160, 340, 220, seg(t, 0.1, 0.5), 'ln ac') + rows +
        path('M560 250 H585 V485 H560', seg(t, w[6], w[7] + 0.2), 'ln ac') +
        text(605, 380, '64 chars', { size: 30, cls: 't m ac', anchor: 'start', opacity: seg(t, w[6] + 0.2, w[7] + 0.4) }) +
        text(605, 420, 'every time', { size: 26, cls: 't m mu', anchor: 'start', opacity: seg(t, w[7], w[7] + 0.5) }) +
        fingerprint(500, 660, seg(t, w[8] - 0.1, w[9] + 0.5), 1)
    },
  },
  { // 8 The database keeps only that fingerprint, and the salt.
    headline: 'Stored: *salt + hash*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.6))
      const hp = seg(t, w[5] - 0.1, w[5] + 0.6), sp = seg(t, w[7], w[8] + 0.2)
      return rect(50, 140, 900, 270, { r: 22, p }) + line(50, 225, 950, 225, p, 'ln dim') +
        text(90, 198, 'USER', { size: 26, cls: 't mu m', anchor: 'start', opacity: p }) +
        text(280, 198, 'SALT', { size: 26, cls: 't mu m', anchor: 'start', opacity: p }) +
        text(500, 198, 'HASH', { size: 26, cls: 't mu m', anchor: 'start', opacity: p }) +
        text(90, 330, 'alex', { size: 34, cls: 't m', anchor: 'start', opacity: seg(t, w[1], w[2]) }) +
        text(280, 330, typed(SALT, sp), { size: 34, cls: 't m ac', anchor: 'start', weight: 700 }) +
        text(500, 330, typed(HASH[0] + '…', hp), { size: 34, cls: 't m', anchor: 'start' }) +
        fade(seg(t, w[3], w[4]), cross(240, 560, 26, seg(t, w[3], w[4]), 'ln ac') + text(290, 572, 'no password column', { size: 34, cls: 't ac', anchor: 'start', weight: 700 }), 20)
    },
  },
  { // 9 But what if two people pick the same password?
    headline: 'Same *password*?',
    draw: ({ t, w }) =>
      user(250, 340, easeOut(seg(t, 0, 0.6)), 'alex') + user(750, 340, easeOut(seg(t, w[3], w[4] + 0.3)), 'sam') +
      pop(250, 560, seg(t, w[6], w[7] + 0.2), pill(250, 560, PW, { size: 30 })) +
      pop(750, 560, seg(t, w[6] + 0.15, w[7] + 0.35), pill(750, 560, PW, { size: 30 })) +
      pop(500, 560, seg(t, w[8], w[8] + 0.35), text(500, 584, '=', { size: 90, cls: 't ac', weight: 800 })),
  },
  { // 10 Different salts. Completely different fingerprints.
    headline: 'Different *salts*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const s1 = seg(t, w[0], w[1] + 0.2), h = seg(t, w[2], w[4] + 0.3)
      return rect(50, 120, 900, 400, { r: 22, p }) + line(50, 200, 950, 200, p, 'ln dim') +
        text(85, 175, 'USER', { size: 24, cls: 't mu m', anchor: 'start', opacity: p }) +
        text(250, 175, 'SALT', { size: 24, cls: 't mu m', anchor: 'start', opacity: p }) +
        text(470, 175, 'HASH', { size: 24, cls: 't mu m', anchor: 'start', opacity: p }) +
        text(85, 300, 'alex', { size: 32, cls: 't m', anchor: 'start', opacity: p }) + text(85, 430, 'sam', { size: 32, cls: 't m', anchor: 'start', opacity: p }) +
        text(250, 300, typed(SALT, s1), { size: 32, cls: 't m ac', anchor: 'start', weight: 700 }) + text(250, 430, typed(SALT2, s1), { size: 32, cls: 't m ac', anchor: 'start', weight: 700 }) +
        text(470, 300, typed(HASH[0] + '…', h), { size: 32, cls: 't m', anchor: 'start' }) + text(470, 430, typed(HASH2 + '…', h), { size: 32, cls: 't m', anchor: 'start' }) +
        pop(500, 650, seg(t, w[4] + 0.1, w[4] + 0.5), text(500, 690, '≠', { size: 120, cls: 't ac', weight: 800 }))
    },
  },
  { // 11 And what if someone steals the database?
    headline: 'Stolen *database*?',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.6))
      const k = easeInOut(seg(t, w[4], w[6] + 0.4))
      return db(260, 400, p) + text(260, 580, 'SITE', { size: 24, cls: 't mu m', opacity: p }) +
        laptop(790, 420, easeOut(seg(t, w[2], w[3] + 0.3))) + text(790, 430, '?', { size: 70, cls: 't ac', weight: 800, opacity: seg(t, w[3], w[3] + 0.3) }) +
        text(790, 560, 'ATTACKER', { size: 24, cls: 't mu m', opacity: seg(t, w[3], w[3] + 0.3) }) +
        (k > 0 ? move(lerp(0, 400, k), lerp(0, -190, k) - Math.sin(k * Math.PI) * 60, db(260, 400, 1, { w: 70, h: 120, cls: 'ln ac dash' }) + text(260, 500, 'leaked.db', { size: 26, cls: 't ac m' })) : '')
    },
  },
  { // 12 A hash can't be reversed. The only way in is guessing.
    headline: 'No way *back*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const guesses = ['123456', 'password', 'qwerty', 'iloveyou', 'sunflower1']
      const fakes = ['e10adc39…', '5f4dcc3b…', 'd8578edf…', 'f25a2fc7…', '0c7a1e94…']
      const rows = guesses.map((g, i) => {
        const a = w[5] + i * 0.5
        const r = seg(t, a, a + 0.3)
        return fade(r, text(120, 320 + i * 86, g, { size: 34, cls: 't m', anchor: 'start' }) + arrow(390, 308 + i * 86, 450, 308 + i * 86, r, 'ln dim thin') +
          text(470, 320 + i * 86, fakes[i], { size: 34, cls: 't m mu', anchor: 'start' }) + cross(860, 308 + i * 86, 18, seg(t, a + 0.25, a + 0.5), 'ln ac'), 20)
      }).join('')
      return pill(260, 120, HASH[0].slice(0, 8) + '…', { size: 30, box: 'ln ac', p }) +
        arrow(410, 120, 610, 120, seg(t, w[1], w[4])) + text(770, 132, `${PW}?`, { size: 34, cls: 't m mu', opacity: seg(t, w[1], w[3]) }) +
        cross(510, 120, 30, seg(t, w[4], w[4] + 0.35)) + rows
    },
  },
  { // 13 So these functions are slow on purpose. One guess takes a blink. Billions take years.
    headline: 'Slow on *purpose*',
    draw: ({ t, w }) => {
      const g = seg(t, w[12], w[14] + 0.3)
      const count = Math.round(10 ** (9 * easeInOut(g)))
      const blink = seg(t, w[11] - 0.1, w[11] + 0.25)
      const lid = blink > 0 && blink < 1 ? Math.sin(blink * Math.PI) : 0
      const eye = path(`M780 ${380} Q840 ${380 - 50 * (1 - lid)} 900 380 Q840 ${380 + 50 * (1 - lid)} 780 380`, 1, 'ln ac') +
        `<circle class="fa" cx="840" cy="380" r="${(16 * (1 - lid)).toFixed(1)}"/>`
      return hashBox(500, 110, t, { w: 300, h: 140, size: 44, p: easeOut(seg(t, 0, 0.5)), speed: 25 }) +
        text(500, 230, 'deliberately slow', { size: 28, cls: 't mu m', opacity: seg(t, w[4], w[6]) }) +
        fade(seg(t, w[7], w[8]), text(100, 395, '1 guess', { size: 48, weight: 800, anchor: 'start' }) + text(480, 395, '≈ 0.1 s', { size: 44, cls: 't m ac', anchor: 'start', weight: 700 }) + eye, 20) +
        fade(seg(t, w[12], w[12] + 0.3), text(100, 560, `${count.toLocaleString('en-US')} guesses`, { size: 46, weight: 800, anchor: 'start' }) +
          rect(100, 600, 800, 26, { r: 13, cls: 'ln dim thin' }) + `<rect class="fa" x="100" y="600" width="${(800 * g).toFixed(1)}" height="26" rx="13"/>` +
          text(100, 690, '≈ 3 years', { size: 48, cls: 't m ac', anchor: 'start', weight: 700, opacity: seg(t, w[14], w[14] + 0.3) }), 20)
    },
  },
  { // 14 Next time you log in, the same salt and the same function run again.
    headline: 'Logging *in*',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.5))
      const fly = easeInOut(seg(t, w[6], w[8]))
      return pill(190, 250, PW, { size: 30, p }) + text(345, 262, '+', { size: 50, cls: 't mu', weight: 700, opacity: seg(t, w[6], w[7]) }) +
        db(450, 600, p, { w: 80, h: 120 }) + text(450, 720, 'DATABASE', { size: 22, cls: 't mu m', opacity: p }) +
        (fly > 0 ? pill(450, lerp(600, 250, fly), SALT, { size: 30, box: 'ln ac', cls: 'ac' }) : '') +
        arrow(545, 250, 630, 250, seg(t, w[9], w[11])) +
        hashBox(770, 250, t, { w: 230, h: 150, size: 40, p: seg(t, w[9], w[11]), speed: 120 }) +
        arrow(770, 330, 770, 420, seg(t, w[12], w[13])) +
        text(770, 470, typed(HASH[0].slice(0, 8) + '…', seg(t, w[12], w[13] + 0.3)), { size: 32, cls: 't m ac', weight: 700 })
    },
  },
  { // 15 If the fingerprints match, you're in.
    headline: "It's a *match*",
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.4))
      const lit = Math.floor(16 * seg(t, w[1], w[3] + 0.2))
      const open = easeOut(seg(t, w[4], w[5] + 0.2))
      return text(120, 170, 'STORED', { size: 24, cls: 't mu m', anchor: 'start', opacity: p }) + hex(330, 170, HASH[0], { size: 40, anchor: 'start', lit, opacity: p }) +
        text(120, 260, 'LOGIN', { size: 24, cls: 't mu m', anchor: 'start', opacity: p }) + hex(330, 260, HASH[0], { size: 40, anchor: 'start', lit, opacity: p }) +
        check(900, 215, 26, seg(t, w[3], w[3] + 0.3)) +
        move(500, 500, `<g transform="scale(1.7)">${lock(0, 0, { open, p })}</g>`) +
        text(500, 720, 'ACCESS GRANTED', { size: 40, cls: 't ac m', weight: 700, opacity: seg(t, w[5], w[5] + 0.3) })
    },
  },
  { // 16 Ever wondered why "forgot password" never just emails you your old one?
    headline: '*Forgot* password?',
    draw: ({ t, w }) => {
      const p = easeOut(seg(t, 0, 0.6))
      return `<rect class="fp" x="130" y="40" width="740" height="500" rx="26" opacity="${p.toFixed(2)}"/>` + rect(130, 40, 740, 500, { r: 26, p }) +
        text(175, 105, 'From: support@site.com', { size: 26, cls: 't m mu', anchor: 'start', opacity: p }) + line(130, 135, 870, 135, p, 'ln dim') +
        text(175, 205, 'Reset your password', { size: 42, weight: 800, anchor: 'start', opacity: p }) +
        text(175, 270, 'Tap the link to choose a new one.', { size: 30, cls: 't mu', anchor: 'start', opacity: p }) +
        `<rect class="fa" x="175" y="330" width="380" height="80" rx="16" opacity="${seg(t, w[3], w[4]).toFixed(2)}"/>` +
        text(365, 382, 'SET NEW PASSWORD', { size: 26, cls: 't dk', weight: 800, opacity: seg(t, w[3], w[4]) }) +
        fade(seg(t, w[8], w[9]), text(500, 660, `Your password is: ${PW}`, { size: 34, cls: 't m mu' }) + line(150, 650, 850, 650, seg(t, w[10], w[11] + 0.2), 'ln ac thick'), 20) +
        text(500, 750, "they can't send it: they never had it", { size: 30, cls: 't ac', weight: 700, opacity: seg(t, w[11] + 0.1, w[11] + 0.5) })
    },
  },
  { // 17 Now you know.
    headline: 'Now you *know*',
    draw: ({ t }) => {
      const p = easeOut(seg(t, 0, 0.6))
      return move(500, 170, `<g transform="scale(${(1.5 * backOut(seg(t, 0, 0.6))).toFixed(3)})">${lock(0, 0, { p, cls: 'ln ac glow' })}</g>`) +
        text(500, 380, 'HOW IT ACTUALLY WORKS', { size: 50, weight: 800, opacity: seg(t, 0.3, 0.8) }) +
        text(500, 470, 'Next: what happens when', { size: 36, cls: 't mu', opacity: seg(t, 0.6, 1.1) }) +
        text(500, 520, 'you open a website?', { size: 36, cls: 't mu', opacity: seg(t, 0.6, 1.1) }) +
        fade(seg(t, 1.0, 1.5), rect(270, 590, 460, 90, { r: 45, cls: 'ln ac' }) + text(500, 648, 'Follow for ep. 02', { size: 34, cls: 't ac', weight: 700 }), 20)
    },
  },
]

export default {
  series: 'How it actually works · 01',
  fontsUrl: 'https://fonts.googleapis.com/css2?family=Red+Hat+Mono:wght@500;600;700&family=Sora:wght@600;700;800&display=block',
  theme: {
    bg: '#171717',
    backdrop: 'radial-gradient(70% 38% at 50% 50%, rgb(33 241 168 / 0.09), transparent 70%), #171717',
    grid: 'rgb(33 241 168 / 0.11)',
    ink: '#eef1ef',
    muted: '#8b918e',
    faint: 'rgb(238 241 239 / 0.12)',
    line: '#3b403e',
    panel: '#1e2220',
    accent: '#21f1a8',
    display: "'Sora', sans-serif",
    mono: "'Red Hat Mono', monospace",
  },
  chapters: [
    { title: 'The question', from: 0, to: 2 },
    { title: 'The trip', from: 3, to: 4 },
    { title: 'Salt + hash', from: 5, to: 8 },
    { title: 'Twins', from: 9, to: 10 },
    { title: 'The leak', from: 11, to: 13 },
    { title: 'Login', from: 14, to: 15 },
    { title: 'The proof', from: 16, to: 17 },
  ],
  scenes,
}
