// Builds an episode end to end:
//   1. timing.json   word timestamps split into scenes          (engine/build_timing.py)
//   2. out/bed.wav   music bed + whooshes                        (engine/soundbed.py)
//   3. frames        player.html captured at exact times through the Chrome DevTools Protocol
//   4. out/reel.mp4  frames + voice ducking the bed, loudness-normalised (ffmpeg)
//
//   node engine/make.mjs ep01-password                     full build
//   node engine/make.mjs ep01-password --stills 3,7.5,12   only stills -> out/stills/
//
// Env: CHROME (path to Chrome/Chromium), FFMPEG (default "ffmpeg"), FPS (default 30).
import { execFileSync, spawn } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const [ep, flag, list] = process.argv.slice(2)
if (!ep) throw new Error('usage: node engine/make.mjs <episode> [--stills t1,t2,...]')
const EP = join(ROOT, 'episodes', ep)
const OUT = join(EP, 'out')
const FPS = Number(process.env.FPS ?? 30)
const FFMPEG = process.env.FFMPEG ?? 'ffmpeg'
const CHROME = process.env.CHROME ?? [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find(existsSync)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
mkdirSync(OUT, { recursive: true })

const step = (name, fn) => { const t0 = Date.now(); const r = fn(); console.log(`✓ ${name} (${((Date.now() - t0) / 1000).toFixed(1)} s)`); return r }
const run = (cmd, args) => execFileSync(cmd, args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim()

step('timing', () => run('python3', ['engine/build_timing.py', EP]))
if (flag !== '--stills') step('sound bed', () => run('python3', ['engine/soundbed.py', EP]))

// A tiny static server for the repository, so the player can load modules and fonts over http.
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.mp3': 'audio/mpeg' }
const server = createServer((req, res) => {
  const file = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)))
  if (!file.startsWith(ROOT) || !existsSync(file)) { res.writeHead(404).end(); return }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file))
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const url = `http://127.0.0.1:${server.address().port}/engine/player.html?ep=${ep}`

// Headless Chrome, driven over the DevTools protocol.
const PORT = 9300 + Math.floor(Math.random() * 500)
const profile = join(OUT, '.chrome-profile')
rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
if (!CHROME) throw new Error('Chrome not found: set CHROME=/path/to/chrome')
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--hide-scrollbars', '--window-size=1080,1920', '--force-device-scale-factor=1', 'about:blank'], { stdio: 'ignore' })
let targets
for (let i = 0; i < 75 && !targets; i++) {
  await sleep(200)
  targets = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json()).catch(() => null)
}
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl)
await new Promise((r) => ws.addEventListener('open', r, { once: true }))
let nextId = 0
const pending = new Map()
ws.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data)
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
  if (msg.method === 'Runtime.exceptionThrown') console.error('page error:', msg.params.exceptionDetails.exception?.description)
})
const send = (method, params = {}) => new Promise((ok, fail) => {
  const id = ++nextId
  pending.set(id, (msg) => (msg.error ? fail(new Error(`${method}: ${msg.error.message}`)) : ok(msg.result)))
  ws.send(JSON.stringify({ id, method, params }))
})
const evaluate = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text)
  return r.result.value
}
const shutdown = () => { ws.close(); chrome.kill(); server.close() }

try {
  await send('Emulation.setDeviceMetricsOverride', { width: 1080, height: 1920, deviceScaleFactor: 1, mobile: false })
  await send('Runtime.enable')
  await send('Page.enable')
  await send('Page.navigate', { url })
  let title = ''
  for (let i = 0; i < 150 && title !== 'ready'; i++) { await sleep(200); title = await evaluate('document.title').catch(() => '') }
  if (title !== 'ready') throw new Error('player did not load')
  const duration = await evaluate('window.duration')
  const shot = async (t, file) => {
    await evaluate(`window.seek(${t}); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`)
    const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: 1080, height: 1920, scale: 1 } })
    writeFileSync(file, Buffer.from(data, 'base64'))
  }

  if (flag === '--stills') {
    const dir = join(OUT, 'stills')
    rmSync(dir, { recursive: true, force: true })
    mkdirSync(dir)
    for (const [i, t] of (list ?? '1').split(',').map(Number).entries()) await shot(t, join(dir, `${String(i).padStart(2, '0')}-${t}s.jpg`))
    console.log(`✓ stills in ${dir}`)
  } else {
    const dir = join(OUT, 'frames')
    rmSync(dir, { recursive: true, force: true })
    mkdirSync(dir)
    const n = Math.ceil(duration * FPS)
    const t0 = Date.now()
    for (let i = 0; i < n; i++) {
      await shot(i / FPS, join(dir, `f${String(i).padStart(5, '0')}.jpg`))
      if (i % 300 === 0) console.log(`  frame ${i}/${n} (${((Date.now() - t0) / 1000).toFixed(0)} s)`)
    }
    console.log(`✓ ${n} frames`)
    shutdown()

    const timing = JSON.parse(readFileSync(join(EP, 'timing.json'), 'utf8'))
    const ms = Math.round(timing.offset * 1000)
    step('mix', () => run(FFMPEG, ['-v', 'error', '-y', '-i', join(EP, 'voice.mp3'), '-i', join(OUT, 'bed.wav'), '-filter_complex',
      `[0:a]adelay=${ms}|${ms},aresample=48000,aformat=channel_layouts=stereo,apad=whole_dur=${duration}[v];` +
      `[1:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:${duration},volume=0.32[b];[v]asplit=2[vm][vs];` +
      '[b][vs]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=350[bd];' +
      '[vm][bd]amix=inputs=2:duration=longest:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11',
      '-ar', '48000', '-c:a', 'pcm_s16le', join(OUT, 'mix.wav')]))
    // Screenshots are full-range RGB; Instagram expects limited-range BT.709.
    step('encode', () => run(FFMPEG, ['-v', 'error', '-y', '-framerate', String(FPS), '-i', join(dir, 'f%05d.jpg'), '-i', join(OUT, 'mix.wav'),
      '-map', '0:v', '-map', '1:a', '-vf',
      'scale=in_range=full:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p,setparams=range=tv:colorspace=bt709:color_primaries=bt709:color_trc=bt709',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-g', '60', '-flags', '+cgop',
      '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', join(OUT, 'reel.mp4')]))
    console.log(`✓ ${join(OUT, 'reel.mp4')}`)
  }
} finally {
  shutdown()
  // Chrome may still be flushing its profile for a moment after it is killed.
  await new Promise((r) => (chrome.exitCode !== null ? r() : chrome.once('exit', r)))
  rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
}
process.exit(0)
