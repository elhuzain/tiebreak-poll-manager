<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Tiebreak

Tiebreak is a **Product Challenge** on [Frontend Mentor](https://www.frontendmentor.io), a platform where developers build real projects to grow their skills. No Figma file, multi-session build. You're a collaborative builder, not a mentor.

**What it is:** a group polling app that lives in the group chat. A creator makes a poll and shares a link; voters tap through on their phones with no account: name, avatar, vote. Voters can suggest options for the creator to approve or decline, results update live, and closing ends in a reveal.

## Specs & Guidance

| File | Contents |
|------|----------|
| `spec/product-definition.md` | What, who, why — the problem it solves in the group chat |
| `spec/core-requirements.md` | 10 Core + 4 Stretch features with acceptance criteria |
| `spec/design-challenges.md` | 3 experiences the developer designs (the voter's side, the reveal, first run) |
| `spec/technical-requirements.md` | Poll state machine, vote integrity, database, auth, avatars (DiceBear), deployment |
| `guidance/brand-kit.md` | The brand direction: color roles, Gabarito + Karla, data-viz rules, checked contrast pairs |
| `guidance/patterns.md` | UI/UX do's and don'ts (honest results, the vote page, moderation, anti-patterns) |
| `guidance/accessibility.md` | WCAG 2.2 AA checklist (core, not stretch) with live-region and dialog notes |
| `starter/tokens.css` | CSS custom properties for the brand direction |
| `starter/tailwind.css` | Optional Tailwind v4 config that maps the tokens |
| `data/sample-polls.json` | 5 polls, 32 votes from one creator — the guest dataset, matching `preview.jpg` |
| `data/README.md` | Data shape, the derive-counts-from-votes rule, and baked-in edge cases |

## The two hard problems

Most of Tiebreak is approachable CRUD, but two things carry the challenge and deserve disproportionate care:

1. **The poll state machine, enforced server-side**: open → settled → reopened, suggestions moving pending → approved/declined, and votes that are final. The server is the referee: a closed poll rejects votes no matter what the UI shows, casting is idempotent per voter token, and reopening is an explicit, confirmed act. See `spec/technical-requirements.md`.
2. **Honest live results at small vote counts**: 7 votes is a normal poll here, so percentages alone mislead. Per-voter tallies, counts beside every percentage, bars relative to the leader, and ties stated in words are all requirements. See `guidance/patterns.md` and the data-viz rules in the brand kit.

## Collaboration

- **Specified features** (Core/Stretch with acceptance criteria) → implement efficiently to spec
- **Design-it-yourself features** (the 3 in `design-challenges.md`) → ask clarifying questions and reason about trade-offs before building; these are where the developer's product thinking shows
- **Brand kit** → `guidance/brand-kit.md` tokens are the design source of truth, but the developer is free to diverge with their own coherent system. UI copy says "Suggested by X", never "write-in".

Encourage documenting significant design and product choices in the README as they happen. Aim for accessible, semantic, responsive-first code with clean component boundaries, and remember the vote page must work first-time for someone who has never seen the app and never will again.

## General Principles

Do not write long uncessary comments

Do not ever build the project (no npm run build)

Keep responsibilities clearly separated between UI components, hooks, actions, the data layer, and the Supabase API layer.

Prefer simple, predictable architecture over unnecessary abstraction.

Use absolute `@/` imports.

Prefer:

```ts
import { ProjectCard } from "@/components/project-card";
```

Avoid:

```ts
import { ProjectCard } from "../../../components/project-card";
```

# Frontend Component Architecture

Feature components should generally fall into one of three categories:

* Container
* List
* Item

Low-level UI primitives such as `Button`, `Input`, `Badge`, `Avatar`, `Modal`, and similar components are exempt.

Not every feature requires all three layers. Do not create components solely to satisfy the classification.

## Container Components

Containers compose and coordinate other components.

Typical responsibilities:

* layout
* composition
* passing data to children
* representing larger sections or features

Examples:

```text
ProjectsSection
Dashboard
ProfileSection
Navbar
```

Avoid rendering large repeated item structures directly when a List Component would make the structure clearer.

## List Components

Lists render collections of similar items.

Typical responsibilities:

* receive a collection
* iterate over it
* render an Item Component
* handle list-level states such as empty results

Examples:

```text
ProjectList
UserList
NotificationList
```

List Components should not contain large amounts of item-specific UI.

## Item Components

Items represent a single entity or entry.

Typical responsibilities:

* receive item data through props
* render one entity
* contain item-specific UI
* remain focused on one responsibility

Examples:

```text
ProjectCard
UserCard
NotificationItem
CommentItem
```

Item Components should not fetch collections or coordinate feature-level layouts.

## Preferred Composition

Prefer:

```text
ProjectsSection    ← Container
    ↓
ProjectList        ← List
    ↓
ProjectCard        ← Item
```

When repeated item UI has meaningful structure, extract it into an Item Component.

## Classification Rule

When creating a feature component:

* Composes or coordinates other components → **Container**
* Renders a collection → **List**
* Represents one entity or entry → **Item**
* Low-level reusable UI element → **UI Primitive**

If a component has multiple unrelated responsibilities, consider splitting it.

---

# Hooks

Use custom hooks when they provide meaningful separation of reusable or stateful client-side logic.

Good use cases include:

* reusable client behavior
* browser APIs
* subscriptions
* shared stateful logic
* complex interaction logic
* reusable effects
* logic used across multiple components

Examples:

```text
useDebounce
useMediaQuery
useOutsideClick
useProjectFilters
useInfiniteScroll
```

Prefer extracting shared interaction logic into a hook rather than duplicating it across components.

Do not create hooks solely to move a few lines of simple logic out of a component.

Hooks should encapsulate meaningful behavior and follow the `useSomething` naming convention.


---

# Data Access Architecture

The application uses a **Backend-for-Frontend (BFF)** architecture on top of Supabase.

Application code must not access Supabase directly outside `lib/supabase/api`.

```text
Application
    ↓
lib/data
    ↓
lib/supabase/api
    ↓
Supabase
```

## Supabase API Layer

### `lib/supabase/api/_types/*`

Contains Supabase-specific input/output types, database shapes, and query result types.

These types are internal to the Supabase layer and should not be used throughout the application.

### `lib/supabase/api/*`

Contains atomic Supabase operations such as:

```text
create-user.ts
get-user.ts
get-projects.ts
update-project.ts
```

Each method should perform one clear Supabase operation.

Do not place application-level mapping, aggregation, or orchestration here.

---

## Data Layer

### `lib/data/_types/*`

Contains application-facing input/output types.

Output types from this directory are the canonical data types used throughout the application.

```ts
import type { Project } from "@/lib/data/_types/project";
```

UI and feature code should prefer these types over Supabase-specific types.

### `lib/data/*`

The application's primary data-access interface.

It may:

* call one or more Supabase API methods
* aggregate or combine data
* map database shapes to application shapes
* transform values
* apply application-level data logic

Application code should access data through this layer.

---

## Request Flow

### Server

Server-side code calls `lib/data/*` directly.

```text
Server → lib/data → lib/supabase/api → Supabase
```

### Client Reads

Client-side reads use Route Handlers.

```text
Client
→ GET /api/*
→ app/api/*/route.ts
→ lib/data
→ lib/supabase/api
→ Supabase
```

Route Handlers should remain thin: validate HTTP input, call `lib/data`, and return the response.

### Client Mutations

Client-initiated mutations use Server Actions under `lib/actions/*`.

```text
Client
→ Server Action
→ lib/data
→ lib/supabase/api
→ Supabase
```

Server Actions may handle validation, authentication, cache invalidation, revalidation, and navigation behavior.

Data logic belongs in `lib/data`.

---

## Dependency Rules

* `lib/supabase/api` must not import from `lib/data`.
* UI and feature code must not access Supabase directly.
* UI and feature code should not use Supabase-specific API types.
* Server Components, Route Handlers, and Server Actions must use `lib/data` for application data access.
* Do not introduce reverse dependencies.