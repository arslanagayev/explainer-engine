# Ep 02: What happens when you open a website?

Series: "How it actually works" (English voice-over, ~60 s, 9:16 Reels).
Voice: ElevenLabs Liam (TX3LPaxmHKxFdv7VOQHJ), model eleven_multilingual_v2.
Palette: combo 02 True Pink #FD1843 + Chill White #FFF9FA (light theme).

## Voice-over

What really happens when you open a website?
Here's the twist: your computer has no idea where that website is.
It only understands numbers.
So first, it asks a DNS server: what's the address for this name?
The answer is an IP address. A phone number for computers.
Your browser calls that number, and they shake hands: hi, hi back, okay.
But anyone on the network could be listening.
So they agree on a secret key, without ever sending the key itself.
That's the little lock next to the address.
Now the browser finally asks for the page.
The server sends back HTML. Just text.
But that's only the skeleton. It points to images, styles and scripts.
So the browser fires off dozens more requests, all at once.
Then it builds the page: structure, style, layout, paint.
Next time, most of it is already saved on your device.
That's why the second visit feels instant.
And all of that usually takes less than a second.
Now you know.

## Scenes (one sentence = one beat)

| # | Headline (accent word) | Visual |
|---|---|---|
| 1 | WHAT HAPPENS WHEN YOU *OPEN* A SITE? | address bar, "example.com" typed, Enter key pressed |
| 2 | IT DOESN'T KNOW *WHERE* | laptop with a question mark, map of servers with no route |
| 3 | ONLY *NUMBERS* | the name dissolves into binary / digits |
| 4 | ASK THE *DNS* | laptop sends "example.com?" to a DNS server (phone book icon) |
| 5 | AN *IP ADDRESS* | answer "93.184.215.14" flies back, styled like a phone number card |
| 6 | A *HANDSHAKE* | three arrows between laptop and server: SYN, SYN-ACK, ACK ("hi", "hi back", "okay") |
| 7 | SOMEONE'S *LISTENING* | an eavesdropper icon on the wire, packets readable |
| 8 | A SHARED *SECRET* | both sides mix public colours into the same secret colour (Diffie-Hellman paint mixing), key never travels |
| 9 | THE *LOCK* | address bar with the lock icon, "https://" |
| 10 | ASK FOR THE *PAGE* | "GET /" request travels to the server |
| 11 | JUST *TEXT* | HTML code scrolls back to the browser |
| 12 | ONLY THE *SKELETON* | bare page wireframe with links to img / css / js |
| 13 | DOZENS OF *REQUESTS* | many small arrows fan out in parallel, counter "38 requests" |
| 14 | BUILD THE *PAGE* | four stages: DOM tree → styles → layout boxes → painted page |
| 15 | SAVED IN *CACHE* | files drop into a "cache" box on the device |
| 16 | *INSTANT* SECOND VISIT | timer comparison: first 1.2 s vs second 0.2 s |
| 17 | UNDER A *SECOND* | timeline bar with all steps and their milliseconds |
| 18 | NOW YOU *KNOW* | end card, next: contactless card |
