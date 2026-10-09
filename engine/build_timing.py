"""Splits word timestamps into the script's lines: one voice-over line = one scene.

    python3 engine/build_timing.py episodes/<episode>

Reads script.md (the "## Voice-over" section, one line per scene) and words.json (word-level
timestamps from speech-to-text) and writes timing.json, which the player and the sound bed use.
"""
import json
import re
import sys
from pathlib import Path

OFFSET = 0.4  # seconds of silence before the first word
OUTRO = 2.2   # seconds the end card stays after the last word


def script_lines(script: str) -> list[str]:
    """The voice-over lines of a script.md, in order."""
    section = script.split('## Voice-over', 1)[1].split('\n## ', 1)[0]
    return [line.strip() for line in section.strip().splitlines() if line.strip()]


def normalise(word: str) -> str:
    return re.sub(r'[^a-z0-9]', '', word.lower())


def build(lines: list[str], words: list[dict], offset: float = OFFSET, outro: float = OUTRO) -> dict:
    """Assigns consecutive words to lines and checks that every word matches the script."""
    words = [w for w in words if w.get('type', 'word') == 'word']
    out, i = [], 0
    for text in lines:
        expected = text.split()
        chunk = words[i:i + len(expected)]
        got = [normalise(w['text']) for w in chunk]
        if got != [normalise(t) for t in expected]:
            raise ValueError(f'line {len(out)} does not match the transcript: {text!r} vs {[w["text"] for w in chunk]}')
        i += len(expected)
        shifted = [{'text': w['text'], 'start': round(w['start'] + offset, 3), 'end': round(w['end'] + offset, 3)} for w in chunk]
        out.append({'text': text, 'start': shifted[0]['start'], 'end': shifted[-1]['end'], 'words': shifted})
    if i != len(words):
        raise ValueError(f'{len(words) - i} transcript words are not in the script')
    return {'offset': offset, 'total': round(out[-1]['end'] + outro, 2), 'lines': out}


def main(episode: str) -> None:
    ep = Path(episode)
    timing = build(script_lines((ep / 'script.md').read_text()), json.loads((ep / 'words.json').read_text())['words'])
    (ep / 'timing.json').write_text(json.dumps(timing, indent=1) + '\n')
    print(f"{len(timing['lines'])} lines, {timing['total']} s")


if __name__ == '__main__':
    main(sys.argv[1])
