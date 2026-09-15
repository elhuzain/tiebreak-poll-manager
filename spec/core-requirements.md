# Core Requirements

This is an **Intermediate** Product Challenge: ten core features, four stretch. Core is what makes Tiebreak work end to end: a poll created, shared, voted on, and settled. Stretch is where you push further once the loop is solid.

Accessibility is not listed as a feature because it isn't one: **WCAG 2.2 AA applies to everything below, core and stretch alike.** See `guidance/accessibility.md` for the specific requirements that come with each feature.

Several features below say "design this yourself": those screens have no reference design on purpose. `spec/design-challenges.md` covers them in depth.

## Core Features

### 1. Landing Page & Guest Mode

The public front door: what Tiebreak is, who it's for, and a way in.

- Communicates the product in the brand voice (see `guidance/brand-kit.md`) without fabricated testimonials, logos, or press
- "Try as guest" enters a demo dashboard pre-loaded from `data/sample-polls.json`: visitors experience a live poll, a settled poll, and a pending suggestion without creating an account
- Clear paths to sign up and log in

### 2. Creator Accounts

Creators have accounts; voters never do.

- Sign up, log in, log out; sessions persist across refreshes
- Creator-only pages (dashboard, poll management) are protected; public pages (vote, results once shared) never require auth
- A voter following a shared link must never hit a login wall

### 3. Dashboard

The creator's polls at a glance.

- Open polls and settled polls, visually distinct
- The poll closing soonest is featured: the dashboard answers "what needs my attention?" before "what exists?"
- Pending suggestion counts surface here, so moderation never depends on the creator re-opening each poll
- The empty dashboard is a designed first-run experience, not a blank list (see design challenge 3)

### 4. Poll Creation

Deliberately small: a poll should take under a minute to make.

- Freeform title (plan for one word or fifteen; titles are user text, never styled per-word), 2–10 options, a closing time, and a choice: single vote or pick-up-to-N
- Voter suggestions can be toggled on or off per poll
- Creating a poll lands on a share step: the poll link with a Copy button ("Link copied" announced via a status message). Links display truncated with an ellipsis; the Copy button is the real affordance.

### 5. The Vote Page

The most-visited screen, seen by people who never chose to use Tiebreak. Phone-first, self-contained, one obvious action.

- No account: the voter types a name and picks an avatar + background tint before voting (DiceBear "micah"; see `spec/technical-requirements.md` for both integration paths)
- Ballot starts with nothing selected; the selected state is unmistakable
- "Cast my vote" stays disabled until both a name and a selection exist, and restates the choice ("Cast my vote for Veggie supreme")
- Votes are final ("no takebacks"), which earns a confirmation step before casting
- Validation errors (no name, no selection) are announced and associated with their fields; focus moves to the first invalid field
- A returning voter who already voted sees an already-voted state, not a second ballot (casual prevention: one vote per browser is enough; see technical requirements)
- What the voter sees *after* casting is yours to design (see design challenge 1)

### 6. Voter Suggestions

The signature feature: voters can propose options the creator didn't think of.

- "Suggest something else" on the vote page opens a modal dialog (focus trapped, Escape closes, focus returns to the trigger)
- A suggestion carries its author's name and avatar: in UI copy it is always "Suggested by Priya", never "write-in" or "user-submitted"
- Suggestions are pending until the creator rules on them; pending suggestions are visible to the creator, not on the public ballot

### 7. Suggestion Moderation

Your call, house rules.

- The creator sees each pending suggestion with its author and can **Add it** or decline (**Not this time**)
- An approved suggestion joins the ballot with 0 votes. Make that explicit in the UI so nobody thinks approval is endorsement
- Declining dismisses a named person's idea: it's a social act, so give it an undo (a toast works)
- Both outcomes are announced to assistive tech, and focus lands somewhere deliberate when the pending card disappears

### 8. Live Results

The creator's view of the race while voting is open. `preview.jpg` is the design concept for this screen, and the brand kit's data-viz rules are load-bearing here.

- The leading option gets a **segmented per-voter tally** (one tick per voter, filled ticks for its votes), never a full-width bar that makes 5 of 11 look like a landslide
- Trailing options get bars **relative to the leader** (3 votes vs a 5-vote leader = 60% width), with vote counts in text
- Percentages never appear without their counts ("45% · 5 of 11 votes"), tabular numerals on both
- Results update without a manual refresh (polling is fine; real-time push is a differentiator) and updates are announced through a throttled polite live region
- Ties are stated in words ("Tied at 4 votes each"), never implied only by equal bars
- The per-voter tally is designed for small groups; decide and document how the presentation changes past ~20 voters
- During voting, only counts are shown; who voted for what is revealed when the poll settles

### 9. Closing & the Reveal

The payoff. Everything else stays calm so this can land.

- Polls close automatically at their closing time; the creator can also **End voting** early
- The settled poll announces a winner and reveals attribution: who backed the winning option ("Priya, Ada, Kai + 2 more backed it")
- **Copy result** copies a text summary of the outcome, distinct from Copy link's URL. Spec both payloads so the two labels are earned
- **Reopen voting** returns a settled poll to open: it undoes the poll's biggest decision, so it gets a confirmation step
- A tie at close is a designed outcome, not a bug — the product is called Tiebreak
- How the settled screen differs from the live screen, and what the reveal moment feels like, is yours to design (see design challenge 2)

### 10. Responsive Design

- Voters are on phones; creators are on both. Every page works from 320px up with no horizontal scrolling
- The vote page is designed mobile-first. On small screens, consider keeping the primary action reachable while the ballot scrolls
- Touch targets, focus states, and reduced-motion preferences hold at every size

## Stretch Features

### 11. Saved Voter Identity

Account holders keep their name + avatar combo across polls: vote on a friend's poll and your face is already set. Guests still work exactly as before; this is a convenience, not a wall.

### 12. Poll Lifecycle & Retention

Settled polls retire 30 days after closing. Communicate this on the dashboard, warn before removal, and let creators delete a poll manually (with confirmation) at any time.

### 13. Resilience & Edge States

The unhappy paths, done properly: a vote that fails mid-cast (network drop) recovers without double-counting; a deleted or nonexistent poll gets a designed 404; avatar images that fail to load fall back gracefully (see technical requirements); the latecomer's closed-poll state is handled everywhere a link can land.

### 14. Dark Mode

The brand kit is deliberate about this: light is the personality, and dark mode is out of core scope. If you take it on, it's a real design exercise: derive a lamplit, deep-cocoa evening version of the brand kit with the same color roles, not a blue-black SaaS theme. Every pair still meets AA.
