# Brand Kit: Tiebreak

This kit is **one worked example**, not a requirement. Product Challenges have no official design: you're expected to make your own visual decisions. Use this as a reference for the *level* of consideration expected (a coherent palette, a real type pairing, semantic tokens, honest data viz), then diverge as much as you like. If you ship this palette verbatim, make the rest of the craft exceptional; if you go your own way, hold yourself to the same bar.

The starter tokens in `starter/tokens.css` implement the direction described below.

## Mood & Tone

**Warm game-night energy.** Tiebreak settles group decisions (pizza toppings, film night, whose turn it is to drive), so it should feel like the fun friend who finally makes the call, not a survey tool. The stakes are low but the moment matters: someone wins, everyone eats.

- Playful, not childish
- Warm, not cutesy
- Decisive, not bossy
- Game-like, not gamified (no points, streaks, or confetti cannons on every click; save the celebration for the reveal)

Think board-game box, taco-truck menu board, a well-worn deck of cards: friendly objects with chunky outlines and honest colors.

## Design Inspiration

Explore these for inspiration. They solve adjacent problems with different design approaches:

- [Partiful](https://partiful.com) — Event invites with genuine personality. Draw from: how a utility (RSVPs) is made to feel like part of the fun, and how guest lists with avatars create social warmth.
- [StrawPoll](https://strawpoll.com) — The category incumbent, and a UX benchmark rather than a visual one. Draw from: the frictionless no-account voting flow and how little a voter needs to understand before they can participate.
- [Typeform](https://typeform.com) — Focused, confident forms. Draw from: the one-thing-at-a-time voting experience and the way large typography carries trust.
- [Jackbox Games](https://www.jackboxgames.com) — Party games where everyone joins on their phone, no account needed. Draw from: the anticipation as votes come in live, and a reveal engineered to be the best moment in the room.
- [NYT Games](https://www.nytimes.com/crosswords) — Playful without being childish, and the masters of the shareable result: Wordle's grid is the reference for a reveal worth screenshotting back into the chat.

There's no single right design here. If you go your own way, spend time with polling, event, and party-game products before you start. The two hard design problems (honest live results at small vote counts, and a reveal that feels earned) reward seeing how others handled them.

The `preview.jpg` in the repo root shows these tokens applied to a live poll screen. It's a concept image, not a pixel-perfect spec, but it anchors the direction.

## The Visual Direction

The rest of this kit describes one complete direction. Its personality is a cream tabletop, cocoa ink outlines on everything, and three game-piece colors with strict jobs: tangerine for the thing that's winning, teal for the system keeping score, butter for celebration. Depth comes from chunky borders and flat color, not drop shadows; almost everything interactive is a pill. It reads as a physical game on a table rather than a SaaS dashboard.

## Color Palette

Every color has one job. The fastest way to break this direction is to let the accents wander: tangerine on random buttons, butter on random badges. Hold the role hierarchy:

1. **Cream is the canvas.** Backgrounds, cards, and sunken panels are all warm paper tones. Nothing is pure white.
2. **Cocoa is the ink.** All text, all card borders, all icons. Structure comes from cocoa outlines, not shadows.
3. **Tangerine is the accent, used once.** The leading option and the single primary action. One tangerine moment per screen.
4. **Teal is the system.** Live/open status, vote bars, affirmative actions (approve, submit vote). Calm and dependable.
5. **Butter is the celebration.** "In the lead" ribbon, filled tally ticks, the winner moment, pending suggestions. Never a neutral highlight.

| Token | Hex | Role | Usage |
|-------|-----|------|-------|
| `--color-cream` | `#FAF2E3` | Background | App background — warm paper |
| `--color-cream-deep` | `#F0E3C9` | Background | Sunken panels (action dock), active nav pill, hover fills, bar tracks |
| `--color-card` | `#FFFBF2` | Surface | Cards, list panels, chips on cream |
| `--color-cream-bright` | `#FFF7EA` | On-accent | Text and icons on tangerine |
| `--color-cocoa` | `#38261A` | Ink | Headings, body text, card borders, icons, avatar rings |
| `--color-cocoa-soft` | `#77614C` | Ink | Secondary text, metadata, muted labels |
| `--color-cocoa-faint` | `#A5937E` | Ink | Disabled states and decorative strokes only — fails AA for text, never use it for copy |
| `--color-tangerine` | `#E2542C` | Accent | Leader card background, icon-only accents (e.g. the mobile "+" button) |
| `--color-tangerine-deep` | `#B93E1E` | Accent | Primary CTA fill, unfilled tally ticks on the leader card |
| `--color-teal` | `#1F7367` | System | Vote bars, approve/submit buttons, live pulse dot |
| `--color-teal-deep` | `#14544B` | System | Text on teal-soft, pressed teal |
| `--color-teal-soft` | `#CBE2D8` | System | "Voting open" pill background, default avatar tint |
| `--color-butter` | `#F3C64F` | Celebration | "In the lead" ribbon, filled tally ticks, suggestion bubble, winner accents |
| `--color-butter-deep` | `#D9A82E` | Celebration | Pressed/hover on butter, butter borders |

### Contrast rules (WCAG AA is a core requirement, not a stretch)

These pairs are checked. Stick to them:

- **Cocoa on cream/card/butter/teal-soft** — passes at all sizes. Your default.
- **Cocoa-soft on cream/card** — passes for body and metadata text.
- **Cream-bright on tangerine** — passes only as **large text** (24px+, or 19px+ bold). Fine for the leader card's option name and big numerals. Small supporting text on tangerine (vote counts, chips) must sit on a cocoa-tinted scrim (`rgba(56, 38, 26, 0.35)` or darker over tangerine gets small bold cream-bright text to AA) or move up to large-text sizes.
- **Cream-bright on tangerine-deep** — passes for button labels at any size (5.24:1). This is why the primary CTA fills with tangerine-deep, not plain tangerine: a ~15px button label on `#E2542C` is only 3.57:1 and fails AA.
- **Cream on teal / teal-deep** — passes for button labels at 14px bold and up.
- **Cocoa-faint** — decorative only, as noted above.

Non-text UI (bar fills, tally ticks, status dots) needs 3:1 against its track or surface: teal on cream-deep and butter on tangerine-deep both clear it. Never encode meaning in color alone: pair status colors with a label or icon.

### Errors & destructive actions

There's deliberately no red in this palette. Every strong color already has a job, and tangerine especially is off-limits for errors: it means *winning*. Errors speak the way the rest of the UI does, in ink and plain words:

- **Form and validation errors** — cocoa text with a warning icon, directly under the field it describes. Thicken the invalid field's border to `--border-card` weight so it reads at a glance. The message does the work: "Add a name so the crew knows who voted", never a bare "Invalid input".
- **Failed actions** (a vote that didn't send) — a notice in cocoa on cream-deep with a retry button: "That didn't send. Try again". Keep the voter's name, avatar, and selection intact.
- **Destructive and declining actions** ("Not this time", deleting a poll) — cocoa-outlined secondary buttons, never a filled accent. The confirmation copy carries the weight; the color stays calm.

If you diverge from this direction with your own brand kit, you're free to add an error color, but give it the same one-job discipline and AA-checked pairs as everything else here.

### Dark mode

Light is the deliberate default: Tiebreak lives in group chats and kitchen-table moments, and the cream-paper surface is most of its personality. Dark mode is **not** part of this direction's core scope. If you add one as a personal stretch, keep it in character (a lamplit deep-cocoa surface with the same role hierarchy, never a blue-black SaaS dark theme) and hold every pair to the same AA bar.

## Typography

### Font Stack

| Usage | Font | Fallback |
|-------|------|----------|
| Display (headings, numerals, buttons, wordmark) | `Gabarito` | `system-ui, -apple-system, sans-serif` |
| Body / UI | `Karla` | `system-ui, -apple-system, sans-serif` |

Both are free on [Google Fonts](https://fonts.google.com). **Gabarito** is a rounded geometric display face: friendly and confident at heavy weights, exactly the game-night tone, without tipping into a novelty font. **Karla** is a grotesque with just enough quirk to stay warm at small sizes. The pairing works because both are a little rounded but Gabarito is unmistakably the loud one: headings, scores, and buttons all speak in it.

If you swap fonts, keep the principle: a characterful rounded display face for scores and headings, a warm legible sans for the working UI. Avoid the reflex defaults (Inter, Plus Jakarta Sans, Space Grotesk, Fraunces, etc.).

### Type Scale

Anchored at a 15px body: this UI is compact and label-dense, and Karla holds up well there.

| Token | Size | Font / Weight | Line Height | Usage |
|-------|------|---------------|-------------|-------|
| `--text-xs` | 0.8125rem | Karla 700–800 / Gabarito 800 | 1.4 | Status pills, ribbon (uppercase, +0.06em tracking), timestamps |
| `--text-sm` | 0.875rem | Karla 700 / Gabarito 700 | 1.45 | Metadata, secondary buttons, chips, vote counts |
| `--text-base` | 0.9375rem | Karla 400–700 / Gabarito 700 | 1.5 | Body text, primary buttons, nav links |
| `--text-md` | 1.0625rem | Karla 800 | 1.35 | Option names, card headlines |
| `--text-lg` | 1.3125rem | Gabarito 800 | 1.2 | Pack percentages, section headings |
| `--text-xl` | 1.875rem | Gabarito 800 | 1.1 | Leader card option name, modal titles |
| `--text-2xl` | 3.25rem | Gabarito 800 | 1.05 | Poll title (−0.02em tracking) |
| `--text-num` | 3.625rem | Gabarito 900 | 0.9 | The hero percentage on the leader card |

Two rules that matter more than the exact sizes:

- **Tabular numerals everywhere numbers live.** `font-variant-numeric: tabular-nums` on percentages, vote counts, and countdowns. Live results re-render constantly and proportional figures make them jitter.
- **Poll titles are freeform user text.** Plan for one word or fifteen: wrap gracefully, step the size down for long titles (`clamp()` earns its keep here), and never apply per-word or multi-color treatments to them; you don't control the words.

### Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `--font-regular` | 400 | Body copy, descriptions |
| `--font-bold` | 700 | Buttons, nav, metadata, most UI text |
| `--font-extrabold` | 800 | Headings, option names, pills |
| `--font-black` | 900 | The hero numeral only |

This direction runs bold: 700 is the workhorse UI weight, not an emphasis weight. Load Gabarito at 500–900 and Karla at 400–800.

## Spacing

4px base unit.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 0.25rem | Icon gaps, tally tick gaps |
| `--space-2` | 0.5rem | Tight inline spacing, chip padding |
| `--space-3` | 0.75rem | Pill padding, gaps between pills |
| `--space-4` | 1rem | Standard element spacing |
| `--space-5` | 1.25rem | Row padding inside list cards |
| `--space-6` | 1.5rem | Card padding |
| `--space-8` | 2rem | Gaps between cards |
| `--space-10` | 2.5rem | Section spacing |
| `--space-16` | 4rem | Page-level spacing, landing sections |

## Border Radius

Two shapes rule this UI: the **pill** (every button, chip, badge, and the action dock) and the **soft slab** (cards at a generous 22px). Small radii appear only on tally ticks, where sharpness reads as precision.

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.25rem | Tally ticks |
| `--radius-md` | 0.75rem | Inputs, textareas |
| `--radius-lg` | 1.375rem | Cards, panels, modals |
| `--radius-full` | 9999rem | Buttons, pills, chips, avatars, bars, the dock |

## Borders & Depth

This direction gets depth from **ink, not shadows**:

- Cards and avatars carry a solid **2.5px cocoa border**. Chips and small elements step down to 1.5–2px. This outline is the direction's most recognizable trait. Don't thin it out.
- **No soft drop shadows.** The one shadow in the system is a pressed-plastic inset on filled buttons: `box-shadow: inset 0 -2px 0` in a darker tone of the button color (e.g. `rgba(122, 34, 10, 0.35)` on tangerine). It makes buttons feel like game pieces.
- Rows inside a card divide with a **2px dashed cream-deep** rule, not a solid hairline.
- Focus states: a visible **3px teal ring** offset 2px, on every interactive element. Never remove outlines without replacing them.

### Print finish

The UI should feel printed, not rendered. Three treatments carry it: use all three, and no others. Surfaces themselves stay flat: no patterns, rays or watermarks on the tangerine cards; the grain, the ink border and the ribbon do the work.

- **Paper grain:** a full-viewport monochrome noise overlay at ~4% opacity, `mix-blend-mode: multiply`, so cream reads as stock. Keep it faint enough that it can't shift a contrast ratio; hide it in forced-colors mode and print.
- **Riso misregistration:** page-title headings carry a butter offset (`text-shadow: 0.045em 0.045em 0` butter), a second ink pass slightly out of register. Large display type only, never body or UI text.
- **Pressed plastic:** filled buttons give under the finger: a ~1.5px downward translate on `:active` over the inset shadow.

## Avatars

Voter identity is half the warmth of this product. Tiebreak uses [DiceBear](https://www.dicebear.com)'s **micah** style on soft brand-adjacent background tints.

Two integration paths; pick either, since the challenge can't require an external API:

1. **Hosted (zero setup):** `https://api.dicebear.com/9.x/micah/svg?seed=Priya&backgroundColor=f8c9b9` (free, keyless, no signup). Fine for this project.
2. **Local (no network dependency):** the [`@dicebear/core`](https://www.dicebear.com/how-to-use/js-library/) + `@dicebear/collection` npm packages render the same avatars as SVG strings locally.

The spec: guest voters type a name and pick a preset avatar + background tint before voting (core); account holders can save their combo across polls (stretch).

**Background tints** (pass as `backgroundColor`, no `#`): `f8c9b9` peach · `cbe2d8` teal-soft · `f6e0a4` butter-soft · `e3d2f2` lilac.

**Sizing and treatment:** always circular, always ringed in cocoa (2.5px at 34px+ sizes, 1.5–2px below that).

| Size | Where |
|------|-------|
| 50px | Pending-suggestion bubble |
| 40px | Nav / account |
| 34px | Voter crew stack (overlap −10px, first avatar on top-left) |
| 24px | "Suggested by" chip on the leader card |
| 20px | "Suggested by" line in list rows |

Avatars are decorative alongside a visible name: give them empty `alt=""` when the name is right next to them, and a real `alt` when they stand alone.

## Icons

Rounded-stroke line icons, **~2px stroke, round caps and joins, drawn in cocoa** (cream-bright on filled buttons). The reference set is small and hand-drawn inline as SVG: clock, plus, copy, check. Staying inline keeps them crisp at the 12–14px sizes this UI uses and avoids shipping a library for six glyphs. If you'd rather use a library, [Lucide](https://lucide.dev) matches the stroke style — set `stroke-width` to 2 and keep sizes consistent: 12–14px inline in buttons and chips, 20px for standalone actions.

Never substitute unicode glyphs (✓ ✕ ●) for icons.

## Data Viz Rules

Live results are the product, and honest numbers are a design feature. These rules are load-bearing:

1. **The leader gets a segmented tally, not a bar.** One tick per voter: 11 voters means 11 ticks, filled ticks in butter, unfilled in tangerine-deep. A full-width bar at "5 of 11 votes" lies about a landslide; eleven ticks with five lit tells the truth and looks like a scoreboard. Mark the tally `aria-hidden` and carry the numbers in text.
2. **Pack bars are relative to the leader.** In the list of trailing options, bar width = option votes ÷ leader votes (3 votes against a 5-vote leader = 60% width). This keeps the race readable: bars answer "how far behind?", the text answers "how many?". Teal fill on a cream-deep track.
3. **Percentages never travel alone.** At 11 voters, "45%" without "5 of 11 votes" is spin. Pair them everywhere, tabular-nums on both.
4. **Ties are a state, not a bug.** The product is called Tiebreak. Design the tied-leaders case deliberately rather than letting `sort()` pick a winner.
5. **Realistic sample data.** Mock with believable group-decision content: 11 voters, options that sound like a real group chat, and suggested options both leading *and* mid-pack (suggestions shouldn't always win).

## Voice & Tone

UI copy does a lot of the brand's work. The tone: a friend keeping score, not a system generating notifications.

- **"Suggested by Priya"** — always. Never "write-in" (US ballot jargon; it's the internal spec name only) or "user-submitted option".
- Talk to the creator like it's their table: *"Approve it and it joins with 0 votes. Your call, house rules."*
- Keep the race alive: *"11 votes in, still anyone's game"*, *"ahead by 2"*, *"Live: updates as votes land"*.
- Buttons say what happens, in as few words as possible: **Add it** / **Not this time** / **End voting** / **Copy link**.
- People are "your crew", not "participants" or "respondents".
- Warmth comes from word choice, not punctuation: exclamation marks are rationed for the reveal.

Share links display as `tiebreak.test/p/pizza-night` in mockups and sample data (`.test` is a reserved TLD; never use a real domain). Note in the UI that long links truncate with an ellipsis and rely on the Copy button.

The quoted strings throughout this kit and the guidance files show the tone. They're examples to beat, not copy to paste. If you bring your own brand kit, write your own voice and hold it to the same bar.

## Layout

| Token | Value | Usage |
|-------|-------|-------|
| `--nav-height` | 4.75rem | Top navigation |
| `--content-max-width` | 50rem | Poll views, vote page — single centered column |
| `--form-max-width` | 40rem | Poll creation form |
| `--page-max-width` | 72.5rem | Nav container, dashboard, landing page |

Tiebreak's working screens are deliberately **single-column**. A poll is a story read top to bottom: status, title, leader, pack, controls. Resist sidebar-and-widget dashboard layouts; the content is never dense enough to earn them.

## App Favicon

Ship the wordmark's game-piece mark: a tangerine circle with a 2.4px cocoa ring and a cream check inside. It's already simple enough to be the favicon verbatim. An SVG favicon works in all modern browsers.

## Key Screens for Design Quality

Where design taste will be most visible:

1. **The reveal / closed poll** — the hero moment. Voting ends, one option wins, and the screen should feel like the end of a good game: butter and tangerine get their loudest use here, and a little earned motion goes a long way. This is the screen people screenshot into the group chat.
2. **The public vote page** — the most-visited screen, seen by people who never chose to use Tiebreak. The name + avatar picker is a personality moment: make choosing a face feel fun, keep voting to one obvious action, and make it feel polished and self-contained on a phone.
3. **The live poll view** — where the data-viz rules pay off. The leader card, the segmented tally, the pack, and the pending suggestion need clear hierarchy: one glance answers "who's winning and is it close?"

## Quality Spectrum

| Level | What it looks like for Tiebreak |
|-------|--------------------------------|
| **Adequate** | Polls create, votes count, results update. The palette is applied and cards have their cocoa borders. Bars are proportional and labeled. Looks like a competent side project wearing the brand's colors. |
| **Good** | The role hierarchy holds — one tangerine moment per screen, teal doing system work, butter only celebrating. The tally reads like a scoreboard, suggestions flow through approval smoothly, and the vote page feels friendly on a phone. Looks like an early-stage consumer product. |
| **Excellent** | The whole thing feels like a game you'd want to play. The reveal is genuinely delightful and worth sharing; the avatar picker makes strangers smile; ties, empty states, and one-vote polls are all designed; motion is purposeful and respects `prefers-reduced-motion`. A designer would ask how it was made, not which AI made it. |
