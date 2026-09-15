# UI/UX Patterns: Tiebreak

Patterns and anti-patterns for Tiebreak's domain: live group polls with guest voters, suggestion moderation, and a reveal. They're guidance, not law; the design challenges in `spec/design-challenges.md` are exactly where you're meant to diverge with your own reasoning. Use these to make strong default decisions without a Figma file.

## Patterns to Follow

### Honest Live Results (the design concept screen)

`preview.jpg` shows this screen; the brand kit's data-viz rules govern it. The test of the whole layout: one glance answers "who's winning, and is it close?"

- **The leader gets a segmented tally, not a bar.** One tick per voter — 11 voters, 11 ticks, 5 filled. A full-width bar at 5 of 11 votes lies about a landslide. Mark the tally `aria-hidden` and carry the numbers in text beside it.
- **Pack bars are relative to the leader**, not to 100%: 3 votes against a 5-vote leader draws a 60%-width bar. Bars answer "how far behind?"; the text answers "how many?".
- **Percentages never travel alone.** "45%" reads as spin at 11 voters; "45% · 5 of 11 votes" is honest. Tabular numerals on both, so re-renders don't jitter.
- **One story, top to bottom.** Status, title, leader, the pack, then the poll controls (share, moderation, end voting), all in a single centered column. The content is never dense enough to earn a sidebar dashboard layout.
- **Keep the race alive in words**: "11 votes in, still anyone's game", "ahead by 2". The copy is a friend keeping score, not a system generating notifications.
- **The tally is designed for small groups.** Past ~20 voters, per-voter ticks degrade. Switch to the counts-and-relative-bars presentation and document the threshold.

### The Vote Page (a guest's whole experience)

Most voters see exactly one Tiebreak screen, on a phone, mid-conversation. Design for someone who never chose to install anything.

- **One obvious action.** Everything on the page funnels to Cast my vote. Secondary paths (suggest an option) stay visibly secondary.
- **Identity before ballot, and make it fun.** Typing a name and picking a face is the personality moment, but it must never add friction. A handful of preset faces and tints beats an avatar-builder.
- **Ship the ballot unselected.** Pre-checking an option biases the vote and contradicts "no takebacks". The selected state, once chosen, should be unmistakable: fill, ring, and check, not a subtle border shift.
- **The CTA earns its click.** Disabled until name + selection exist; restates the choice ("Cast my vote for Veggie supreme"); a confirmation step before the vote becomes final.
- **Keep the CTA reachable on phones.** If the ballot is long, consider a sticky or persistent cast button so the primary action doesn't live below three screens of options.
- **Pick one avatar mechanism.** Seed-from-typed-name and fixed preset faces are both fine — but decide which drives the final avatar and make the preview truthful to it.

### Suggestions & Moderation (the signature feature)

- **Credit the suggester everywhere**: "Suggested by Priya" with her avatar: on the pending card, and still on the option after it's approved. Never "write-in" or "user-submitted option".
- **Moderation talks like a host, not an admin panel**: **Add it** / **Not this time**, with copy that's honest about who decides — "Approve it and it joins with 0 votes. Your call, house rules."
- **Make "joins with 0 votes" visible.** Approval is admission, not endorsement. Say so where the creator decides and where the option appears.
- **Declining is a social act.** "Not this time" dismisses a named friend's idea, so give it an undo (a toast), not a permanent silent delete.
- **Manage focus on resolution.** Approving or declining removes the pending card, so move focus somewhere deliberate and announce the outcome ("Just salads added to the ballot with 0 votes").

### Poll Controls (share, close, reopen)

- **Copy beats select-all.** Links display truncated with an ellipsis; the Copy button is the real affordance, and it announces "Link copied" via a status message without moving focus.
- **Different labels, different payloads.** Copy link copies the vote URL; Copy result copies a text summary of the outcome. If both copy the same thing, one label is lying.
- **Weight confirmations by consequence.** Casting a vote (irreversible for the voter) and reopening a settled poll (undoes the group's decision) get confirmation steps. Approving a suggestion (undoable) gets an undo instead. Don't confirm everything: that trains people to click through.
- **Status is words plus color, never color alone.** "Voting open" with the teal pill and live dot; "Settled" in its own visibly distinct treatment.

### One Tangerine Moment Per Screen

The fastest way to break this direction is letting accents wander. Tangerine belongs to one element per screen: the leader card on results, the winner at the reveal, the primary CTA on the vote page, and the New poll button only on an empty dashboard. If two things on one screen are tangerine, one of them is wrong.

### Loading, Empty & Edge States

- **Empty states teach.** The empty dashboard points at the first poll (see design challenge 3); a poll with zero votes reassures the creator the link works and re-offers Copy link, rather than showing an empty leaderboard.
- **A brand-new leader is a claim, not a fact.** With 0–1 votes there's no meaningful race. Design what the results screen says before "leading" means anything.
- **Skeletons over spinners** for the dashboard and results, sized to avoid layout shift when real data lands.
- **Ties are a state, not a bug.** Say it in words ("Tied at 4 votes each"), design it deliberately, and never let `sort()` silently crown a winner.

### Responsive Behavior

- **Voters are phone-first; creators use both.** The vote page is designed at 375px and adapted up; creator screens can start wider. Everything works from 320px with no horizontal scroll.
- **Touch targets minimum 44×44px**: ballot options, avatar swatches, and the moderation buttons especially.
- **The single-column story survives every width.** Wider screens get more breathing room, not extra columns.

## Anti-Patterns to Avoid

### Results Spin

- Don't give the leader a full-width bar: at small n it manufactures a landslide.
- Don't show percentages without counts, and don't show decimals ("45.45%"): false precision at 11 voters.
- Don't animate numbers so much that the screen feels like a slot machine: motion marks *new votes landing*, not ambient activity.
- Don't reveal who-voted-for-what while voting is open: attribution waits for the close.

### Voter Friction

- Don't put anything between the link tap and the ballot: no interstitials, no "sign up to vote", no cookie-wall theater.
- Don't ask voters for anything beyond a name and a face. Every extra field costs real votes from real friends.
- Don't dead-end the latecomer: a closed poll is a story to tell, not an error page.
- Don't offer vote-changing in the UI or the API: "no takebacks" is a product rule; a hidden loophole makes the confirm step a lie.

### Celebration Creep

- Don't celebrate early — confetti on page load means nothing is special at the reveal. Butter is for winning moments; the live screen stays calm.
- Don't gamify: no points, streaks, or badges. The game-night energy comes from color roles, chunky ink, and word choice.
- Don't let the reveal play at full volume for `prefers-reduced-motion` users — same information, same occasion, no motion.

### Live-Update Jank

- Don't steal focus or scroll position when new votes land: a creator reading the pack shouldn't be yanked to the top.
- Don't re-sort options mid-glance without motion cues: an instant reorder makes people think they misread; a brief settle transition keeps the race followable.
- Don't announce every vote to screen readers: throttle the live region to meaningful summaries.

### Error Handling

- Don't lose a vote silently: a failed cast says so plainly, keeps the voter's name/avatar/selection, and offers retry.
- Don't dress errors in tangerine or butter: those colors mean winning and celebrating. Errors are cocoa ink, plain words, and an icon (see the brand kit's "Errors & destructive actions").
- Don't leave silent gaps when avatars fail to load: fall back to a tinted circle.
- Don't show raw errors or stack traces anywhere a guest can land.
