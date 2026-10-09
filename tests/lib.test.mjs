import assert from 'node:assert/strict'
import { test } from 'node:test'
import { arrow, clamp, cross, easeInOut, easeOut, esc, path, rng, seg, text, typed } from '../engine/lib.js'

test('clamp and seg keep progress inside 0..1', () => {
  assert.equal(clamp(-1), 0)
  assert.equal(clamp(2), 1)
  assert.equal(seg(5, 4, 6), 0.5)
  assert.equal(seg(3, 4, 6), 0)
  assert.equal(seg(9, 4, 6), 1)
})

test('easing curves start at 0 and end at 1', () => {
  for (const ease of [easeOut, easeInOut]) {
    assert.equal(ease(0), 0)
    assert.equal(ease(1), 1)
  }
})

test('typed reveals a string proportionally', () => {
  assert.equal(typed('salt', 0), '')
  assert.equal(typed('salt', 0.5), 'sa')
  assert.equal(typed('salt', 1), 'salt')
})

test('paths draw from nothing to complete', () => {
  assert.equal(path('M0 0 L10 0', 0), '')
  assert.match(path('M0 0 L10 0', 0.25), /stroke-dashoffset="0\.7500"/)
  assert.match(path('M0 0 L10 0', 1), /stroke-dashoffset="0\.0000"/)
  assert.equal(arrow(0, 0, 100, 0, 0), '')
  assert.match(cross(0, 0, 10, 1), /<path/)
})

test('text is escaped', () => {
  assert.equal(esc('<a&b>'), '&lt;a&amp;b&gt;')
  assert.match(text(0, 0, '<x>'), /&lt;x&gt;/)
})

test('rng is deterministic', () => {
  const a = rng(42), b = rng(42)
  assert.deepEqual([a(), a(), a()], [b(), b(), b()])
})
