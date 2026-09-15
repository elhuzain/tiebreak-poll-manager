# Design Challenges

Product Challenges don't come with full designs, and that's the point: the `preview.jpg` concept covers **one screen** (the creator's live results view), and the brand kit gives you a visual direction to work from (or replace). Everything else is design work you own.

These three challenges are the highest-value screens with no reference design. They're where a portfolio reviewer will judge your product thinking, so treat them as design briefs, not gaps. For each one: understand the problem, sketch before you build, and write up your decisions in your README.

## 1. The Voter's Side of the Story

**The problem:** The vote page's job ends at "Cast my vote", but the voter's story doesn't. What do they see the moment their vote lands? What if they come back an hour later while voting is still open? And the most common edge case of all: what does the **latecomer** see when they tap the link after the poll has closed?

**Design this:**

- The post-vote moment — confirmation that the vote counted, and whatever comes next
- The return visit while the poll is open (they already voted; no takebacks)
- The closed-poll landing for someone who never voted

**Questions to consider:**

- Does a voter get to see the race after voting, or only the final result? Seeing live results might change how the next voter behaves. Is that a bug or a feature? Whatever you choose, choose it on purpose.
- The voter gave you a name and a face. Can the confirmation use that identity to feel personal without being cloying?
- The latecomer missed the vote, but the decision still affects them (they're coming to the brunch too). Does their view feel like a result, an apology, or an invitation to the next poll?
- These three states share one URL. How do you keep them clearly distinct so nobody thinks they can still vote when they can't?

**Suggested approach:** Map the voter's timeline first (tap, vote, confirm, maybe return, poll closes) and design the states in that order, on a phone-sized canvas. The confirmation is a small delight moment; the closed states are information design. Keep the voter's own choice visible in every state ("You backed Veggie supreme"), since it's the one thing they'll look for.

## 2. The Reveal

**The problem:** Closing a poll is Tiebreak's payoff. The live screen is calm and honest by design, which means the settled screen has room to celebrate. But "add confetti" isn't a design; the reveal has to communicate the result, credit the crew, survive being screenshotted into a group chat, and still work when the result is a tie.

**Design this:**

- The settled poll — how it differs from the live view, for the creator and for voters
- The winner moment — where butter and tangerine get their loudest use, and where a little earned motion belongs
- Attribution — the backers of each option are revealed at close ("Priya, Ada, Kai + 2 more backed it")
- The **Copy result** payload — the text summary that gets pasted back into the chat
- The tie — the one outcome the product is named after

**Questions to consider:**

- The same screen serves the organizer (who ends the poll) and a voter (who checks the result). Does the reveal moment play once or every visit? Does the creator get anything the crew doesn't?
- What makes a screenshot of this screen legible in a chat thread at phone width? Could the result be understood from the image alone, with no surrounding context?
- A tie can't crown a winner. Does the screen present it as unfinished business, a shared win, or a prompt to settle it another way?
- Motion budget: `prefers-reduced-motion` users get the same information and the same sense of occasion. What carries the celebration when nothing moves?

**Suggested approach:** Design the tie state early: it constrains the winner layout more than the happy path does. Write the Copy result text before designing the screen; if the summary reads well in plain text, the visual hierarchy tends to follow it. Save your biggest motion moment for the first time the result is seen, then let the screen settle.

## 3. First Run

**The problem:** A brand-new creator lands on an empty dashboard. Every list is empty, every count is zero, and this is the moment they decide whether Tiebreak is worth the group chat's attention. The empty dashboard is also the one screen where a filled tangerine "New poll" button is earned (everywhere else, tangerine belongs to the screen's hero).

**Design this:**

- The empty dashboard — a first-run experience that gets the creator to their first shared link, not a blank table with a sad icon
- The share step after creating a poll — the moment the product leaves the app and enters the chat
- How the dashboard grows up — the transition from "first poll ever" to the normal open/settled view

**Questions to consider:**

- The fastest path to understanding Tiebreak is seeing a poll, not reading about one. Can the empty state show what's coming without faking data or cluttering the moment?
- Creating a poll takes under a minute; sharing it is the step that actually matters. How does the share step make "paste this into the chat" feel like the natural next action rather than a detail?
- What does the dashboard look like with exactly one open poll and zero votes? That awkward in-between state is the new creator's actual second screen.

**Suggested approach:** Design backwards from the success case (a poll link sitting in a group chat) and make every first-run element point at it. Steal shamelessly from the guest mode: if "Try as guest" shows a rich sample dashboard, the empty state can lean on that instead of explaining everything itself.
