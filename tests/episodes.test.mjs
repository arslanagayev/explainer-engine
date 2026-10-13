// Every episode must have one scene per voice-over line, chapters that cover all scenes, and scenes
// that render valid markup at any moment (no NaN or undefined leaking into the SVG).
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { test } from 'node:test'

const root = new URL('../episodes/', import.meta.url)
for (const name of readdirSync(root)) {
  test(`episode ${name}`, async () => {
    const { default: ep } = await import(new URL(`${name}/episode.js`, root))
    const timing = JSON.parse(readFileSync(new URL(`${name}/timing.json`, root), 'utf8'))
    assert.equal(ep.scenes.length, timing.lines.length, 'one scene per line')

    const covered = ep.chapters.flatMap((c) => Array.from({ length: c.to - c.from + 1 }, (_, k) => c.from + k))
    assert.deepEqual(covered, ep.scenes.map((_, i) => i), 'chapters cover every scene once, in order')

    ep.scenes.forEach((scene, i) => {
      const line = timing.lines[i]
      const start = i === 0 ? 0 : line.start - 0.22
      const end = i + 1 < timing.lines.length ? timing.lines[i + 1].start - 0.22 : timing.total
      const w = line.words.map((x) => x.start - start)
      for (let t = 0; t <= end - start; t += 0.1) {
        const svg = scene.draw({ t, d: end - start, w, end: line.end - start })
        assert.equal(typeof svg, 'string')
        // An episode may show these words on purpose (e.g. the TypeScript episode's "undefined"):
        // it lists those exact text nodes in `literals`, and only they are exempt.
        const checked = (ep.literals ?? []).reduce((acc, lit) => acc.split(`>${lit}<`).join('><'), svg)
        assert.doesNotMatch(checked, /NaN|undefined|Infinity/, `scene ${i} at ${t.toFixed(1)} s`)
      }
      assert.ok(scene.headline, `scene ${i} has a headline`)
    })
  })
}
