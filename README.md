# mtnsounds.com — personal portfolio

Zack Sawyer's portfolio site. Next.js App Router + TypeScript + Sass, deployed
on Vercel at [mtnsounds.com](https://mtnsounds.com).

## Stack

- **Next.js 16** (App Router, server components; client islands only for the
  hamburger nav, typing effect, and contact form)
- **React 19**, **TypeScript** (strict)
- **Sass** — global stylesheets in `styles/` (`@use` modules); page theming via
  `#body-<page>` / `#sideNav-<page>` / `#header-<page>` id hooks
- **Vitest** for the contact API suite, **ESLint 9** (flat config) + **Prettier**

## Layout

```
app/          routes (+ api/contact route handler)
components/   shared components (site-shell wraps every page)
content/      typed site data (projects, skills)
lib/          pure logic (contact validation + email rendering)
styles/       global SCSS
tests/        vitest suites
```

## Development

```bash
npm install
npm run dev        # dev server on :3000
npm test           # vitest
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run format     # prettier --write
```

Requires Node 20+ locally; production builds pin Node via `engines`.

## Contact form email

The contact form posts to `app/api/contact/route.ts`, which sends a
notification email through [Resend](https://resend.com) (shared account —
mtnsounds.com is the verified sending domain). The visitor's address is set as
`reply_to`, so replying to the notification responds to them directly. A hidden
honeypot field silently drops bot submissions. Validation and email rendering
live in `lib/contact.ts` and are covered by `tests/contact.test.ts`.

Configuration (see `.env.local.example`):

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key (server-only) |
| `RESEND_FROM_EMAIL` | Verified from-address, e.g. `Zack Sawyer <notifications@mtnsounds.com>` |
| `CONTACT_NOTIFY_EMAIL` | Optional override for where messages land (defaults to mountainsounds15@gmail.com; use `delivered@resend.dev` when testing) |

Copy `.env.local.example` to `.env.local` for local development. The same
variables must be set in the Vercel project for deployed environments.

## Deploy

Pushing to `main` deploys via the Vercel Git integration
(project: `personal-portfolio`). Work lands through pull requests.
