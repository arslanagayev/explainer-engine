# Languages 07: TypeScript

Series: "How languages actually work" (under 60 s). Look and props: engine/series-languages.js.
Script follows the Dopamine Loop: risk (a typo ships, users see "undefined") → big question → answer →
twist (browsers can't run it; types are erased) → re-hook (types only protect you while you write).
Facts: Microsoft released TypeScript in October 2012; its lead designer Anders Hejlsberg also created C#
(and Turbo Pascal / Delphi). TypeScript is a typed superset of JavaScript; `tsc` type-checks, then emits
plain JavaScript with the types removed, so nothing checks types at runtime (data from a network
request is whatever arrives). Editors run the type checker as you type. GitHub's Octoverse 2025 reported
that in August 2025 TypeScript overtook Python and JavaScript to become the most used language on GitHub
(by monthly contributors).
Hook clip: a 4 s Higgsfield shot (developer at night, laptop glowing red with errors, phone buzzing).

## Voice-over

Friday night, you ship. One typo, and every user sees the word undefined.
JavaScript didn't warn you. It never does.
So how do you catch it before anyone sees it?
TypeScript. Microsoft released it in 2012, designed by the same person who created C sharp.
You write the type next to the value, and your editor turns the typo red while you type.
But here's the twist: browsers can't run TypeScript.
The compiler checks everything, then deletes every type and hands the browser plain JavaScript.
So types only protect you while you write. Bad data from the internet can still slip through.
And in 2025, it passed Python and JavaScript to become the most used language on GitHub.
Next: SQL. Typos or type errors: which bites you more? Tell me below.
