# Accessibility Requirements: Tiebreak

## WCAG 2.2 AA Compliance Checklist

WCAG 2.2 AA is a **core requirement** of this challenge: it applies to every feature, and it is not waived for stretch features (a dark mode or a share card meets the same bar as the vote page). A live-updating results screen and a guest voting flow raise real accessibility questions most projects never face; treat them as core work, not a final-week sweep.

### Perceivable

#### Text & Color

- [ ] All text meets WCAG AA contrast (4.5:1 normal, 3:1 large text): the brand kit lists the checked pairs; hold to them
- [ ] Small text never sits on plain tangerine: `#FFF7EA` on `#E2542C` passes only as large text (24px+, or 19px+ bold). Small supporting text on the leader card sits on a cocoa-tinted scrim or steps up to large-text sizes; button labels use tangerine-deep fills
- [ ] `--color-cocoa-faint` is decorative only: it fails AA for text at any size
- [ ] Color never carries meaning alone: "Voting open" / "Settled" pair color with words; bar fills and tally ticks have their counts in text
- [ ] Non-text UI (bar fills against their tracks, tally ticks, the live dot) meets 3:1 against its background
- [ ] **Ties are stated in text** ("Tied at 4 votes each"), never implied only by equal bars

#### Images & Media

- [ ] Avatars are decorative beside a visible name: `alt=""` when the name is adjacent, a real `alt` when the avatar stands alone
- [ ] Failed avatar loads fall back to a tinted circle, never a silent gap (see `spec/technical-requirements.md` for the local DiceBear path)
- [ ] Icons inside labeled controls are `aria-hidden`; icon-only buttons (the mobile "+") have accessible names
- [ ] No images of text

#### Structure

- [ ] Proper heading hierarchy (h1 → h2 → h3, no skipped levels); the poll title is the page's h1
- [ ] Landmark regions (`<nav>`, `<main>`, `<footer>`); a skip link to main content (cheap, and expected of a reference-quality build)
- [ ] The ballot is a fieldset of radio (or checkbox, for pick-up-to-N) inputs with a legend, not a stack of clickable divs
- [ ] The options list is a real list; the **segmented tally is `aria-hidden`** with its numbers carried in adjacent text
- [ ] Page titles are descriptive and unique per view ("Pizza night: live results · Tiebreak")

### Operable

#### Keyboard

- [ ] Every interactive element is reachable and operable by keyboard, in a logical order
- [ ] Focus is visible everywhere: the 3px teal ring, offset 2px. Never remove an outline without replacing it
- [ ] **The "Suggest something else" dialog is a real modal**: `role="dialog"`, `aria-modal="true"`, labeled by its heading, focus trapped inside, Escape closes, focus returns to the trigger
- [ ] **Approving or declining a suggestion manages focus deliberately**: the pending card disappears, so focus lands somewhere chosen (the next pending card, or the section heading), never dropped to `<body>`
- [ ] Confirmation steps (cast vote, reopen voting) are keyboard-complete and return focus predictably when canceled
- [ ] Avatar and tint pickers are keyboard-operable with visible selection states: swatches are inputs or buttons, not divs

#### Timing & Motion

- [ ] **A poll deadline is a real-time exception** under SC 2.2.1: the closing time is an essential, uncontrollable limit, so no extend/adjust mechanism is required. Countdowns, if shown, don't announce every tick
- [ ] All animation respects `prefers-reduced-motion`: the tally stamp-in, bar transitions, and the reveal celebration render instantly and completely without motion: same information, same occasion
- [ ] Live updates never steal focus or scroll position

### Understandable

#### Forms & Input

- [ ] Vote page fields have visible labels, not just placeholders
- [ ] Missing name and missing selection produce specific errors, associated via `aria-describedby`, with focus moved to the first invalid field; submission errors never clear the voter's entered name or selection
- [ ] Required fields are marked visually and programmatically
- [ ] **Casting is confirmed before it's final**: "no takebacks" makes the vote irreversible, which earns a confirmation step even though SC 3.3.4 doesn't strictly demand one at AA
- [ ] Poll creation validates inline (option count, closing time in the past) with the same error patterns

#### Language & Content

- [ ] `<html lang="en">`
- [ ] Errors in plain language, in the brand voice: "That didn't send. Try again", never a stack trace
- [ ] Button labels say what happens: Add it, Not this time, End voting, Copy link

### Robust

#### Live Content (the heart of this product)

- [ ] **Live results use one polite live region**, scoped to a meaningful summary ("Detroit-style: 5 of 11 votes, in the lead") and **throttled**: a busy poll must not flood the screen-reader buffer with per-vote announcements
- [ ] **Copy buttons announce success** via `role="status"` ("Link copied" / "Result copied") without moving focus (SC 4.1.3)
- [ ] **Moderation outcomes are announced**: approval ("Just salads added to the ballot with 0 votes") and decline (with its undo) both reach assistive tech
- [ ] The undo toast is announced when it appears and doesn't disappear so fast that it fails SC 2.2.1: give it a generous timeout or a dismiss button
- [ ] The already-voted and closed-poll states are announced as such when the page loads — a screen-reader user should never wonder why the ballot is missing

#### Assistive Technology

- [ ] Valid, well-structured HTML; ARIA used to enhance native semantics, not replace them
- [ ] Selected ballot state is programmatic (checked radio/checkbox), not just visual
- [ ] Status pills, the featured "closing soon" treatment, and pending-suggestion counts are all perceivable as text

## Tiebreak-Specific Considerations

### Guests Under Real Conditions

Voters arrive on phones, mid-conversation, often with zoom or larger text set system-wide. **Use `rem` for type and spacing** so browser font-size preferences are honored (the brand kit's type scale is specified in rem for exactly this reason). Test the vote page at 200% zoom and with text-only scaling: the ballot, the avatar picker, and the cast button must all survive.

### The Reveal

The celebration is authored motion, which means it needs an authored no-motion version, not a disabled one. Under `prefers-reduced-motion`, the winner, attribution, and sense of occasion all still land; color, type, and copy do the work the confetti was doing.

### One Live Region, Not Many

It's tempting to sprinkle `aria-live` on every changing number. Don't: competing live regions interrupt each other. One polite region summarizing the race, one `role="status"` for copy confirmations, and announced outcomes for moderation cover the product.

## Testing

Before submission, verify:

1. Cast a vote end-to-end (link tap to confirmation) using only the keyboard
2. Do the same with a screen reader (VoiceOver, NVDA, or TalkBack), including a validation error and the suggest dialog
3. As the creator: approve one suggestion, decline another and undo it, end voting, and reopen. Confirm every outcome is announced and focus never drops
4. Watch results update with a screen reader running: announcements should be occasional summaries, not a firehose
5. Test the vote page at 200% zoom and at 320px width
6. Test with `prefers-reduced-motion: reduce`; the reveal still feels like a reveal
7. Run Lighthouse/axe on the vote page and live results: the two screens guests and creators actually live in
