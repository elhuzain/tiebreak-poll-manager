# Product Definition

## What Is Tiebreak?

Tiebreak settles group decisions. A creator sets up a poll (film night, holiday plans, whose turn it is to drive) and shares a link into the group chat. Voters tap through on their phones, type a name, pick an avatar, and vote. No accounts, no sign-up walls. Voters can suggest options the creator didn't think of, and the creator approves or declines them, your call, house rules. When voting ends, the result gets a proper reveal: someone wins, and the group chat moves on.

The whole product is built around one success case: **a poll goes from created to decided inside a single group-chat conversation.**

## Who It's For

**The organizer** — the friend who actually makes the plan happen. They create the poll deliberately (often at a desk, sometimes on a phone), paste the link into WhatsApp or Discord, keep half an eye on the race, moderate suggestions, and call time. They're the only person with an account.

**The voter** — arrives from a shared link, almost always on a phone, mid-conversation. They have no account and will never make one. They type a name, pick a face, vote, and go back to the chat. The vote page is most voters' entire experience of Tiebreak, so it has to be self-explanatory in about five seconds.

**The latecomer** — taps the link after voting has closed. This is the most common real-world edge case, not a failure state: they should land on a settled result that tells the story, not an error page.

Groups are small and polls are short-lived: typically 3–15 voters, decided in hours, not weeks.

## Why This Product Exists

Polling tools are either enterprise survey builders (forms, respondents, export to CSV) or joyless utilities that treat a film-night decision like a referendum. Neither feels like the group chat it lives in.

Tiebreak's angle is social, not administrative:

- **Voters can suggest options**, and the creator moderates them. The poll becomes a conversation, not a fixed menu.
- **Every voter has a face.** Name + avatar identity makes eleven votes feel like eleven friends, not a tally.
- **The reveal is a moment.** Closing a poll is the payoff, celebrated like the end of a good game, and built to be screenshotted back into the chat.

It's a game night, not a form.

## Core Value Proposition

For the organizer: *stop the group chat going in circles: get a real decision without chasing anyone.*

For the voter: *tap, pick a face, vote, done — and it's actually kind of fun.*

## What Makes This a Strong Portfolio Project

1. **Two audiences, one product.** The authed creator experience and the no-account voter experience have genuinely different needs. Designing both well while keeping the voter's path friction-free is a real product-thinking exercise.
2. **Live data, honestly presented.** Results update as votes land, and the numbers are small (11 voters, not 11,000). Presenting small-n live data without spin (per-voter tallies, counts beside every percentage, ties handled deliberately) is a data-viz challenge most projects never touch.
3. **A real state machine.** Polls open, close (on time or early), and can reopen. Suggestions are pending, approved, or declined. Votes are final. Modeling and enforcing these transitions cleanly is the backend meat of the project.
4. **Moments worth crafting.** The avatar picker, the cast-vote confirmation, and the reveal are all opportunities for motion and personality that serve the product instead of decorating it.
5. **Guest-first access done right.** Public pages with no auth, per-voter identity without accounts, and casual duplicate-vote prevention: patterns that show up in real consumer products and rarely in tutorials.
