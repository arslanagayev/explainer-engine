import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'engine'))
import build_timing  # noqa: E402


class BuildTimingTest(unittest.TestCase):
    def test_lines_take_consecutive_words(self):
        words = [{'text': t, 'start': i * 0.5, 'end': i * 0.5 + 0.4} for i, t in enumerate('Hello there. Now you know.'.split())]
        timing = build_timing.build(['Hello there.', 'Now you know.'], words, offset=0.4, outro=2)
        self.assertEqual([len(line['words']) for line in timing['lines']], [2, 3])
        self.assertEqual(timing['lines'][1]['start'], 1.4)
        self.assertEqual(timing['total'], round(2.4 + 0.4 + 2, 2))

    def test_mismatch_is_reported(self):
        words = [{'text': 'Hello', 'start': 0, 'end': 0.3}]
        with self.assertRaises(ValueError):
            build_timing.build(['Goodbye'], words)

    def test_every_episode_matches_its_transcript(self):
        for ep in (ROOT / 'episodes').iterdir():
            lines = build_timing.script_lines((ep / 'script.md').read_text())
            words = json.loads((ep / 'words.json').read_text())['words']
            built = build_timing.build(lines, words)
            stored = json.loads((ep / 'timing.json').read_text())
            self.assertEqual(built, stored, f'{ep.name}: timing.json is stale, run engine/build_timing.py')


if __name__ == '__main__':
    unittest.main()
