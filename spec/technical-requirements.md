# Technical Requirements

## The Poll State Machine

Tiebreak's backend is small, but its states are real. Get these transitions right and everything else follows:

- **Polls:** open → settled. Settling happens two ways: the closing time passes, or the creator ends voting early. Settled polls can be **reopened** (back to open). Decide what reopening means for the closing time: does the old deadline still apply, does the creator set a new one, or does the poll stay open until ended manually? Document your choice.
- **Suggestions:** pending → approved or declined. An approved suggestion becomes a normal ballot option **with 0 votes**. A declined suggestion should be recoverable long enough for the undo to work.
- **Votes:** final. There is no un-vote or change-vote: "no takebacks" is a product rule, so the API shouldn't offer what the UI promises not to.

Enforce state rules on the server, not just in the UI: a vote against a settled poll, a second vote from the same voter, and an approval of an already-declined suggestion should all be rejected cleanly no matter what the client sends.

## Vote Integrity (Casual, Not Forensic)

Voters have no accounts, so one-person-one-vote can't be guaranteed, and doesn't need to be. This is pizza night, not an election. The bar is **casual prevention**:

- Track that a browser has voted on a poll (a cookie or localStorage token tied to the poll) and show the already-voted state on return
- Enforce it server-side too: the same voter token can't cast twice
- A determined friend voting from two browsers is acceptable; a page refresh double-submitting a vote is not. Make vote casting idempotent.

Document the trade-off you chose in your README. Knowing where the bar is matters more than raising it.

## Closing Times & Timezones

- Store closing times as UTC timestamps; display them in the voter's local time ("Closes today at 7:00 PM" means *their* 7:00 PM)
- Polls must settle at the deadline even if nobody has the page open: on-demand checking (evaluate "is this settled?" at read time) is a perfectly good implementation; a scheduled job is optional
- A countdown, if you show one, is a real-time exception under WCAG 2.2.1: no requirement to let users extend it, but don't announce every tick to screen readers

## Live Updates

"Live: updates as votes land" is a product promise. **Polling every few seconds fully satisfies the core requirement**: real-time push (WebSockets, SSE, or a service like Supabase Realtime) is a differentiator, not the baseline. Whichever you use:

- Re-rendering results must not steal focus, collapse the accessibility tree mid-read, or jitter the layout (tabular numerals exist for this)
- Announce meaningful changes through one throttled polite live region: a busy poll shouldn't flood the screen-reader buffer

## Database

Two to three tables, roughly:

**Polls** — creator, title, options for how it votes (single / pick-up-to-N), closing time, status, suggestions on/off, timestamps.

**Options** — poll, label, display order, and *where it came from*: a creator option or a voter suggestion (with suggester name + avatar and a pending/approved/declined status). Modeling suggestions as options-with-a-status keeps approval trivial: flip the status and it's on the ballot with 0 votes.

**Votes** — option, voter name, voter avatar (seed + tint), voter token, cast-at timestamp. One row per vote keeps per-voter tallies, attribution-at-close, and pick-up-to-N all cheap.

Things to think about:

- Attribution is revealed only at close: that's an API decision, not just a UI one. While a poll is open, results endpoints should return counts, not voter lists.
- Deleting a poll should take its options and votes with it
- If you take on the 30-day retention stretch, decide between hard deletion and a retired flag, and whether "30 days" is enforced by a job or at read time

## Creator Auth

- Standard email/password or OAuth: an auth library or service (Auth.js, Clerk, Supabase Auth, Lucia) is the sensible choice; hand-rolling is instructive but not required
- Sessions persist across refreshes; log out works
- The dashboard and management actions are creator-only; **vote and results pages are public by link**: treat the unguessable poll ID/slug as the access control, and say so in your README

## Avatars (DiceBear)

Voter avatars are DiceBear's **micah** style on four background tints: `f8c9b9` peach, `cbe2d8` teal-soft, `f6e0a4` butter-soft, `e3d2f2` lilac. Two integration paths; the challenge can't require an external API, so both are first-class:

1. **Hosted, keyless:** `https://api.dicebear.com/9.x/micah/svg?seed=Priya&backgroundColor=f8c9b9` (free, no signup). Simplest possible start.
2. **Local:** the `@dicebear/core` + `@dicebear/collection` npm packages render identical SVGs with no network dependency.

Either way, store the seed and tint (not the image), and handle failure: a broken avatar should fall back to a tinted circle, never a silent gap. If you use the hosted API, the local package is the natural upgrade for the resilience stretch.

## Deployment

Deploy it for real. A Product Challenge submission is a working URL, not a repo:

- Any modern host works (Vercel, Netlify, Railway, Fly.io, Render); pick one with a free tier that supports your stack
- The shared-link flow must work from a real phone: create a poll, text yourself the link, vote from the sofa
- Seed the deployed guest mode from `data/sample-polls.json` so reviewers see the product at its best
- `tiebreak.test` is display-only sample-data convention; your real deployment uses your real URL

## Performance

| Interaction | Target |
|-------------|--------|
| Vote page first load (mobile) | Interactive under 3s on a mid-range phone |
| Casting a vote | Feedback within 200ms; confirmed state under 1s |
| Results update reflecting a new vote | Under 5s (polling) / under 1s (push) |
| Dashboard load | Under 2s with 20 polls |

Lighthouse (mobile, on the deployed app): **Performance 85+, Accessibility 90+, Best Practices 90+**. Run it on the vote page, not just the landing page: it's the screen guests actually hit.
