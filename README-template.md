# Tiebreak — [Your Name]

[ONE-LINE DESCRIPTION, e.g. "Group-decision polls that live in the group chat: no accounts, honest numbers, and a reveal worth screenshotting."]

**Challenge:** [Tiebreak on Frontend Mentor](https://www.frontendmentor.io/challenges/poll-creator-app)

**Live URL:** [your-deployed-url.com]

![Screenshot of your solution](./screenshot.png)

---

## Overview

<!-- Brief description of your implementation. What did you build? Which path did you take:
     full-stack (auth + database) or frontend-only (pass-the-phone mode)? What's the experience like? -->

### Tech Stack

<!-- List your technology choices -->

| Layer | Technology |
|-------|-----------|
| Framework | e.g. Next.js 15 |
| Database | |
| Authentication | |
| Live updates | e.g. polling / SSE / WebSockets |
| Avatars | e.g. DiceBear hosted API / @dicebear/core |
| Hosting | |
| Styling | |
| Other | |

---

## Design Decisions

These are the product and design choices I made where the spec left room for interpretation. The three below are the challenge's named design challenges: the reasoning here is the point of the whole project.

### The Voter's Side of the Story

**The problem I was solving:**
<!-- What a voter sees after casting, on a return visit, and when they arrive after the poll has closed. -->

**My approach:**
<!-- Do voters see live results after voting, or only the final outcome? What does the confirmation moment do with their name and avatar? What does the latecomer land on? How do the states stay distinct on one URL? -->

**Why I chose this approach:**

**What I'd do differently:**

### The Reveal

**The problem I was solving:**
<!-- Making the close of a poll feel like the end of a good game: legible in a chat screenshot, honest about the numbers, and designed for the tie. -->

**My approach:**
<!-- How does settled differ from live? Where does the celebration happen, and what happens under prefers-reduced-motion? What does Copy result actually copy? How is a tie presented? -->

**Why I chose this approach:**

**What I'd do differently:**

### First Run

**The problem I was solving:**
<!-- A brand-new creator on an empty dashboard, and the path from zero to a link in the group chat. -->

**My approach:**
<!-- What does the empty dashboard show? How does the share step work? What does the dashboard look like with one poll and no votes yet? -->

**Why I chose this approach:**

**What I'd do differently:**

### Product Rules I Decided

<!-- The spec leaves real product rules to you. Record what you chose and why:
     what reopening a poll means for its closing time, where the one-vote line sits
     for account-less voters, how results presentation changes past ~20 voters,
     what happens to declined suggestions. -->

### Other Design Choices

<!-- Any other significant decisions: the avatar picker mechanism, the moderation flow,
     the landing page approach, status/empty states, your take on the brand kit (or your own). -->

---

## Development Journey

### Initial Approach vs. Final

<!-- What was your initial plan? What changed as you built? Were there any pivots? -->

### Decisions Reconsidered

<!-- What seemed right at first but needed rethinking? (The post-vote experience and the
     live-region behavior of the results screen are common ones.) -->

### What Surprised Me

<!-- What was harder than expected? Easier? Enforcing the state machine server-side, duplicate-vote
     prevention, and live updates that don't jitter are usual suspects. -->

### Session Breakdown

<!-- How did you structure your working sessions? What did you accomplish in each? Add rows for however many sessions you worked across. -->

| Session | Focus | What I Accomplished |
|---------|-------|-------------------|
| 1 | | |
| 2 | | |
| 3 | | |

---

## AI Collaboration Reflection

<!-- This section documents how you worked with AI throughout the project. -->

### How I Used AI

<!-- What was AI most helpful for? Where did you rely on your own judgment, especially on the three design challenges and the product rules? -->

### What Worked Well

<!-- Which prompting strategies or collaboration patterns produced the best results? -->

### What I Learned

<!-- How did your approach to AI collaboration evolve across sessions? What would you do differently next time? -->

### Where I Pushed Back

<!-- Were there moments where AI suggestions weren't right? How did you identify and correct course? -->

---

## Differentiators

### Chosen Differentiator(s)

<!-- Which differentiator(s) did you pick: truly live results, the share card, sudden death, or quick starts? -->

**1. [Differentiator Name]**

**Why I chose this:**

**How it enhances the product:**

**Implementation highlights:**

**What I learned:**

<!-- Repeat for second differentiator if applicable -->

---

## Self-Assessment

Rate your implementation honestly. This self-awareness is part of the portfolio artifact.

| Category | Rating | Notes |
|----------|--------|-------|
| **Works for real users** — Deployed, functional end-to-end; a poll can go from created to decided via a real shared link | /5 | |
| **The vote page** — Phone-first, self-explanatory in seconds, zero friction between link tap and cast vote | /5 | |
| **Honest results** — Per-voter tally, relative pack bars, counts beside every percentage, ties in words | /5 | |
| **State machine integrity** — Open/settled/reopened and suggestion states enforced server-side; votes final | /5 | |
| **The reveal** — Feels earned, survives a screenshot, works without motion, handles the tie | /5 | |
| **Design quality** — Typography, spacing, visual hierarchy, color roles held, polish | /5 | |
| **Responsive design** — Fully functional and well-designed from 320px up | /5 | |
| **Performance** — Fast vote page on mobile, snappy casting, live updates without jank | /5 | |
| **Accessibility** — Keyboard end-to-end, announced live results and outcomes, focus management, contrast | /5 | |
| **Landing page & guest experience** — Compelling front door; the guest dashboard tells the product's story immediately | /5 | |

### Lighthouse Scores

<!-- Run Lighthouse on your deployed site; include the vote page, not just the landing page -->

| Category | Score |
|----------|-------|
| Performance | |
| Accessibility | |
| Best Practices | |
| SEO | |

### Strengths

<!-- What are you most proud of in this project? -->

### Areas for Improvement

<!-- What would you improve with more time? Be specific. -->

---

## Known Limitations

<!-- What doesn't work perfectly? What's missing? What would you add in a v2?
     Include the trade-offs you chose deliberately, like where the one-vote line sits. -->

---

## Running Locally

```bash
# Clone the repo
git clone [your-repo-url]
cd tiebreak

# Install dependencies
npm install

# Set up environment variables (skip if you built the frontend-only path)
cp .env.example .env
# Fill in your database and auth credentials

# Run the development server
npm run dev
```

### Environment Variables

<!-- Frontend-only builds may have none. Full-stack builds typically need database and auth keys. -->

| Variable | Description |
|----------|------------|
| | |

---

## Acknowledgments

Built as a [Frontend Mentor Product Challenge](https://www.frontendmentor.io). Sample poll data provided in the challenge starter; avatars by [DiceBear](https://www.dicebear.com) (micah style).
