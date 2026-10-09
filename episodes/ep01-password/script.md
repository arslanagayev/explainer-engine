# Ep 01: Where does your password go?

Series: "How it actually works" (4 episodes, English voice-over, ~60 s, 9:16 Reels).
Voice: ElevenLabs Liam (energetic young male, TX3LPaxmHKxFdv7VOQHJ), model eleven_v4.
Palette: combo 01 Tiffany #21F1A8 + Dark Gray #171717.

## Voice-over

What happens when you type your password into a website?
Here's the twist: the website never stores your password.
The answer is a function that only works one way.
Your password travels to the server through an encrypted tunnel.
But the server never saves it.
First, it adds a few random characters. That's called a salt.
Then it runs both through a hash function.
Out comes a scrambled string of fixed length. A fingerprint.
The database keeps only that fingerprint, and the salt.
But what if two people pick the same password?
Different salts. Completely different fingerprints.
And what if someone steals the database?
A hash can't be reversed. The only way in is guessing.
So these functions are slow on purpose. One guess takes a blink. Billions take years.
Next time you log in, the same salt and the same function run again.
If the fingerprints match, you're in.
Ever wondered why "forgot password" never just emails you your old one?
Now you know.

## Scenes (one sentence = one beat)

| # | Headline (accent word) | Visual |
|---|---|---|
| 1 | WHERE DOES YOUR *PASSWORD* GO? | login form, password dots typing in |
| 2 | THE SITE *NEVER* KEEPS IT | database icon with crossed-out plain password |
| 3 | A *ONE-WAY* FUNCTION | arrow that only goes right, reverse arrow breaks |
| 4 | ENCRYPTED *TUNNEL* | password packet travels browser → server inside a tunnel (HTTPS lock) |
| 5 | NOT *SAVED* | server receives, "save" slot stays empty |
| 6 | ADD *SALT* | random chars append to password |
| 7 | INTO THE *HASH* | password+salt enter a machine/funnel |
| 8 | A *FINGERPRINT* | fixed-length hex string types out |
| 9 | STORED: *HASH + SALT* | database row: user · salt · hash |
| 10 | SAME *PASSWORD*? | two users, same password |
| 11 | DIFFERENT *SALT* | two rows with totally different hashes |
| 12 | STOLEN *DATABASE* | thief grabs DB |
| 13 | NO WAY *BACK* | hash → password arrow fails; brute-force counter starts |
| 14 | SLOW ON *PURPOSE* | one guess = blink, counter to billions = years |
| 15 | LOGGING *IN* | new password → same salt → hash |
| 16 | IT'S A *MATCH* | two fingerprints compare, lock opens |
| 17 | *FORGOT* PASSWORD? | reset email: "here's a link", not the old password |
| 18 | NOW YOU *KNOW* | logo / handle |
