# mtnsounds.com — personal portfolio

Zack Sawyer's portfolio site. Next.js (pages router) + Sass, deployed on Vercel
at [mtnsounds.com](https://mtnsounds.com).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Requires Node 18+ locally; production builds pin Node via the `engines` field
in `package.json`.

## Contact form email

The contact form posts to `pages/api/contact.js`, which sends a notification
email through [Resend](https://resend.com) (shared account — mtnsounds.com is
the verified sending domain). The visitor's address is set as `reply_to`, so
replying to the notification responds to them directly. A hidden honeypot
field silently drops bot submissions.

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
(project: `personal-portfolio`).
