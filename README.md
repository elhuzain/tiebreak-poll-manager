# Tiebreak

Tiebreak helps a group make a decision in its chat. A creator makes a poll and shares one link; friends vote without accounts, can suggest choices, and see the result when voting closes.

## Local setup

Run `npm install`, then set these values in `.env.local` from your Supabase project's Connect panel:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Run `npm run dev` and open `http://localhost:3000`.

The creator auth flow uses Supabase Auth with email and password. User sessions live in cookies via `@supabase/ssr`; the Next.js Proxy refreshes them, and the dashboard checks the authenticated user on the server. The publishable key is used for session-scoped auth requests. Backend poll data access uses the server-only `SUPABASE_SECRET_KEY` after verifying the creator; it is never used for login or signup.

## Email confirmation setup

Hosted Supabase projects usually require email confirmation. In **Authentication → URL Configuration**, set the Site URL to your app's origin and add `http://localhost:3000/auth/callback` to the Redirect URLs for local development. Add your deployed callback URL when deploying.

In **Authentication → Email Templates → Confirm signup**, make the confirmation link point to the callback with a token hash. The signup action passes `/auth/callback` as `RedirectTo`, so use:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Confirm your email</a>
```

The callback verifies the token, stores the session in cookies, and redirects to `/dashboard`. If email confirmation is disabled, signup receives a session immediately and redirects there directly. [Supabase's SSR email-confirmation guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs) explains the token-hash requirement.

## Poll creation

The dashboard has a **Create poll** button. The form saves a question, 2–10 options, a closing time, a choice limit, and the suggestions setting through the backend admin client. After creation, the poll appears in **My polls**. The voter flow is still to be built.

Apply the initial schema in `lib/supabase/migrations/20260915000000_initial_schema.sql` to a fresh project. The backend verifies the creator using the cookie-scoped auth client, writes the poll and its options with the admin client, and removes the poll if option insertion fails.

Apply `lib/supabase/migrations/20260915000001_poll_slugs.sql` after the initial schema. It backfills existing polls, requires a slug for every poll, and enforces uniqueness. New slugs are random and the backend retries if a collision reaches the unique constraint. Poll cards copy a URL at `/poll/<slug>`; the public voter page for that URL is part of the upcoming voter flow. The unguessable slug is the access-by-link identifier, so never expose a public poll-list endpoint.
