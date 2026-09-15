# Tiebreak

Tiebreak helps a group make a decision in its chat. A creator makes a poll and shares one link; friends vote without accounts, can suggest choices, and see the result when voting closes.

## Local setup

Run `npm install`, then set these values in `.env.local` from your Supabase project's Connect panel:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Run `npm run dev` and open `http://localhost:3000`.

The creator auth flow uses Supabase Auth with email and password. User sessions live in cookies via `@supabase/ssr`; the Next.js Proxy refreshes them, and the dashboard checks the authenticated user on the server. The publishable key is used for user-scoped requests. Keep `SUPABASE_SECRET_KEY` server-only for future privileged operations; it is not used for login or signup.

## Email confirmation setup

Hosted Supabase projects usually require email confirmation. In **Authentication → URL Configuration**, set the Site URL to your app's origin and add `http://localhost:3000/auth/callback` to the Redirect URLs for local development. Add your deployed callback URL when deploying.

In **Authentication → Email Templates → Confirm signup**, make the confirmation link point to the callback with a token hash. The signup action passes `/auth/callback` as `RedirectTo`, so use:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=email">Confirm your email</a>
```

The callback verifies the token, stores the session in cookies, and redirects to `/dashboard`. If email confirmation is disabled, signup receives a session immediately and redirects there directly. [Supabase's SSR email-confirmation guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs) explains the token-hash requirement.

The dashboard currently has an empty state. Poll creation and the voter flow will be added in later work.
