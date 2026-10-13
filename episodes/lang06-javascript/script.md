# Languages 06: JavaScript

Series: "How languages actually work" (under 60 s). Look and props: engine/series-languages.js.
Script follows the Dopamine Loop (risk → big question → twist → re-hook), opening on the ten-day deadline.
Facts: Brendan Eich wrote the first version at Netscape in about ten days in May 1995 (called Mocha, then
LiveScript); Netscape renamed it JavaScript in late 1995 as a marketing move riding Java's popularity
(deal with Sun); it has nothing to do with Java. V8 (Chrome, Node.js) interprets bytecode first and
compiles hot functions to optimised machine code (JIT) while the page runs. `typeof null === "object"`
comes from the first implementation's value tags; a proposal to make it "null" was rejected because it
would break existing sites. Node.js (Ryan Dahl, 2009) runs JavaScript on servers using V8.
Hook clip: a 4 s Higgsfield shot (1995 office at night, CRT glow, calendar flipping) inset in scene 0.

## Voice-over

Ten days. That's all one programmer got to build the first version of the language behind almost every website.
1995. Netscape needed it inside their browser, fast.
So how did a ten-day language take over the whole web?
First twist: it has nothing to do with Java. The name was a marketing trick.
And it isn't slow. Engines like V8 find your busiest code and compile it to machine code while the page runs.
But the rush left scars.
Type of null says object. That bug is from the first ten days, and it can't be fixed now. Fixing it would break existing websites.
Then in 2009, Node took it out of the browser. Now it runs servers too.
Next: TypeScript. Has a JavaScript quirk ever bitten you? Tell me below.
