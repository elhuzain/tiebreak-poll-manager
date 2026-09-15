# Sample Data

`sample-polls.json` seeds the guest-mode experience and gives you realistic data to develop against. It belongs to one creator (Morgan) and matches the `preview.jpg` concept exactly: the pizza-night poll in the file *is* the poll in the image, down to the vote counts.

## Shape

One creator, five polls. Each poll carries:

- **Poll fields** — `type` is `"single"` or `"multi"` (with `maxChoices`); `status` is `"open"` or `"settled"`; `suggestionsEnabled` toggles the suggest flow per poll.
- **Options** — `source` is `"creator"` or `"suggestion"`. Suggested options carry `suggestedBy` (name + avatar) and a `suggestionStatus` of `"approved"` or `"pending"`. Pending options are not on the public ballot and have no votes. This mirrors the recommended modeling in `spec/technical-requirements.md`: a suggestion is just an option with a status.
- **Votes** — one row per vote: the option, the voter's name + avatar, a `voterToken` (the casual one-vote-per-browser mechanism), and `castAt`.

**Derive counts from the votes array**: there are deliberately no denormalized `voteCount` fields to drift out of sync. Percentages, "ahead by 2", relative bar widths, and the crew list all come from the rows.

Avatars are stored as `{ seed, tint }`, never as image URLs. Render them with either DiceBear path from the technical requirements, e.g. `https://api.dicebear.com/9.x/micah/svg?seed=Priya&backgroundColor=f8c9b9`.

## What each poll exercises

| Poll | State | Why it's here |
|------|-------|---------------|
| `pizza-night` | Open, 11 votes | The hero: a clear-but-close race (5/3/2/1), approved suggestions both **leading** (Priya's Detroit-style) and **mid-pack** (Jonah's veggie) because suggestions shouldn't always win, plus one **pending** suggestion (Sam's salads) waiting for moderation. |
| `friday-film-club` | Open, 7 votes | A one-vote lead, and a **tie for second** (Heat and Everything Everywhere at 2 each); ties are stated in words, never implied by equal bars. Also a long option label to wrap. |
| `meal-out` | Settled, 9 votes | A date-picking poll that was **ended early** (`settledAt` before `closesAt`) once a winner emerged and the restaurant needed booking. Suggestions disabled, which fits: the options are fixed dates. |
| `lake-weekend` | Settled, 5 votes | Settled **on time** (`settledAt` equals `closesAt`), winner from a small field, and an approved suggestion that didn't win — moderation isn't endorsement. |
| `birthday-brunch` | Open, 0 votes | The zero-votes state: "leading" means nothing yet. Also the one **multi-choice** poll (`maxChoices: 2`). |

## Timestamps

All times are UTC ISO strings, written as if "now" is around **2026-09-17T15:00Z**: that's what makes pizza night "closes today", film club "closes tomorrow", and the settled polls "Saturday" / "last Tuesday". When you seed your database, shift every timestamp relative to the current time (keep the offsets between them) so open polls are genuinely open. Display times in the viewer's local timezone.

## Using it

- **Guest mode** loads this data read-only; a visitor should land on a dashboard that already tells the product's story.
- **Development** — seed it into your real schema rather than fetching the JSON at runtime; the shape is designed to map onto the polls/options/votes tables almost 1:1.
- **Frontend-only path** — for pass-the-phone mode, load this file as the initial local state (into localStorage on first run, for example). The settled polls give the history something to show, and pizza night gives the table a live poll to pass around.
- Names, options, and copy are part of the product's voice. If you swap them out, keep them just as believable — real polls between real friends, not "Option A / Option B".
