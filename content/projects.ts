import type { StaticImageData } from "next/image";

import algoSearchFound from "@/public/projects/algo-search-found.jpg";
import algoSearchNotebook from "@/public/projects/algo-search-notebook.jpg";
import algoSieve from "@/public/projects/algo-sieve.jpg";
import portfolioHome from "@/public/projects/portfolio-home.jpg";
import portfolioSkills from "@/public/projects/portfolio-skills.jpg";
import wolkDonate from "@/public/projects/wolk-donate.jpg";
import wolkHome from "@/public/projects/wolk-home.jpg";
import wolkPriorities from "@/public/projects/wolk-priorities.jpg";

export type GalleryImage = {
  src: StaticImageData;
  alt: string;
  caption: string;
};

export type Highlight = {
  title: string;
  body: string;
};

export type Project = {
  slug: string;
  title: string;
  /** One-line summary shown on the card and under the detail hero. */
  tagline: string;
  year: string;
  role: string;
  /** Listing-card image. */
  cardImage: StaticImageData;
  cardAlt: string;
  /** One or two paragraphs of prose for the detail page. */
  overview: string[];
  stack: string[];
  highlights: Highlight[];
  gallery: GalleryImage[];
  liveUrl?: string;
  /** Omitted for private repos — the detail page then hides the source link. */
  sourceUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "wolk-for-senate",
    title: "Wolk for Senate",
    tagline:
      "A full-stack campaign site for an independent Vermont State Senate candidate — donations, compliance, and all.",
    year: "2026",
    role: "Design & Full-Stack Development",
    cardImage: wolkHome,
    cardAlt: "The Wolk for Senate homepage hero",
    overview: [
      "A campaign website for Dave Wolk, running as an Independent for the Vermont State Senate in Rutland County. I designed and built it end to end: a warm, editorial identity and a compliant donation pipeline that a small campaign can actually run.",
      "The result is a fast, mostly-static site with real money moving through it — every contribution validated, recorded, and filing-ready — on a stack a solo maintainer can keep healthy.",
    ],
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Neon Postgres",
      "Stripe Checkout",
      "Resend",
      "Vercel",
      "Vitest",
      "Playwright",
    ],
    highlights: [
      {
        title: "Compliant donations, enforced on the server",
        body: "Stripe Checkout is wired to a Neon Postgres ledger, but the rules live server-side and never trust the client: Vermont's $1,940 contribution cap, the $100 disclosure threshold, and three legal attestations are all validated before a charge. A signature-verified webhook idempotently records each contribution — and backstops over-cap payments rather than dropping money.",
      },
      {
        title: "An editorial identity",
        body: 'A single warm "parchment" theme in Castleton green (Pantone 343), with a variable serif for headlines and a mono accent for labels. The voice is first-person in the body, third-person in the chrome — and the whole thing was audited against WCAG across every page.',
      },
      {
        title: "Filing-ready admin export",
        body: "A gated /admin route streams every contribution as a CSV in Vermont's exact filing column order, behind a constant-time credential check with no database session. The route 404s entirely until it's configured — the export simply doesn't exist to the public.",
      },
      {
        title: "Everything ships through CI",
        body: "No change reaches production without a pull request that passes type-checking, Vitest unit tests, and Playwright end-to-end tests running against the live Vercel preview deploy.",
      },
    ],
    gallery: [
      {
        src: wolkHome,
        alt: "Homepage hero: 'A steady hand for Rutland' beside a portrait of the candidate",
        caption: "The homepage — a warm parchment identity in Castleton green.",
      },
      {
        src: wolkPriorities,
        alt: "The Priorities page with an editorial headline and a photo of the candidate with constituents",
        caption:
          "Priorities: an editorial layout that leads with the person, not a wall of policy.",
      },
      {
        src: wolkDonate,
        alt: "The donation page with contribution amount options over a green background",
        caption:
          "The donation flow — Stripe Checkout with Vermont compliance enforced behind it.",
      },
    ],
    liveUrl: "https://wolkforsenate.com/",
    // Source intentionally omitted — this is a private client repository.
  },
  {
    slug: "personal-portfolio",
    title: "This Portfolio",
    tagline: "The site you're on — rebuilt on the modern Next.js App Router.",
    year: "2021 – 2026",
    role: "Design & Development",
    cardImage: portfolioHome,
    cardAlt: "The mtnsounds.com homepage over a mountain summit photo",
    overview: [
      "This very site. It began as a hand-coded static page, became a React/Next.js app, and was most recently rebuilt on the Next.js App Router with React 19 and strict TypeScript.",
      "It's server-rendered by default, with small islands of client JavaScript only where something actually needs to move.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Sass", "Resend", "Vercel"],
    highlights: [
      {
        title: "Server-first architecture",
        body: "Every page prerenders as static HTML. Client JavaScript is limited to three islands — the mobile nav, the typing effect on this page's cousin, and the contact form — which keeps the site quick to load and cheap to serve.",
      },
      {
        title: "Email without a backend",
        body: "The contact form posts to a typed route handler that sends through Resend, with a honeypot for bots and reply-to wired to the sender. No database, no third-party form widget.",
      },
      {
        title: "Content as data",
        body: "Projects and skills live in typed modules, so adding a project like this one is a data change — not a template rewrite. The screenshots on this page were captured and optimized as part of the same pass.",
      },
    ],
    gallery: [
      {
        src: portfolioHome,
        alt: "The portfolio homepage with the name Zack Sawyer over a mountain-summit photo",
        caption: "The landing hero, with an animated role typer.",
      },
      {
        src: portfolioSkills,
        alt: "The skills page showing frontend, backend, and tooling proficiency bars",
        caption:
          "The skills page — three columns of animated proficiency bars.",
      },
    ],
    liveUrl: "https://mtnsounds.com/",
    sourceUrl: "https://github.com/mountainsounds/personal-portfolio",
  },
  {
    slug: "algo",
    title: "algo.",
    tagline:
      "Animated algorithm walkthroughs — a 2021 sieve demo grown into a small collection.",
    year: "2021 – 2026",
    role: "Design & Development",
    cardImage: algoSieve,
    cardAlt:
      "The algo. site running the Sieve of Eratosthenes: highlighted code beside a dark grid of numbers with a glowing cursor",
    overview: [
      "An animated-algorithms site at algo.mtnsounds.com. Each algorithm gets its own visualization, a plain-language narration line, and the real code highlighted line by line as it runs — the Sieve of Eratosthenes first, binary search second, with more to come.",
      "It began as a 2021 sieve demo. The 2026 rebuild replaced the original's fragile timers with pure step generators behind a cancellable player, and gave the site two full themes with their own motion personalities: Signal, a dark lab of LED tiles and glow, and Notebook, warm graph paper marked up in ink and red pencil.",
    ],
    stack: ["Vite 7", "TypeScript", "PrismJS", "Vitest", "Vercel"],
    highlights: [
      {
        title: "Runs that can't go stale",
        body: "Algorithms are pure functions that emit a list of steps; an epoch-guarded player applies them to the page. Pause, reset, and re-run just swap the list — a late timer from an old run can never touch the DOM, which was the failure mode of the 2021 version.",
      },
      {
        title: "Two themes, drawn differently",
        body: "Every color, texture, and motion value is a token, so Signal and Notebook share one structure with different personalities. Notebook draws real SVG strike lines and pencil circles with several hand-drawn path variants; Signal speaks in glow and pulse. Switching mid-run is safe, and the choice persists without a flash on reload.",
      },
      {
        title: "Each algorithm owns its visual",
        body: "A registry carries an algorithm's step type, narration, pacing, code listing, controls, and view together. The sieve strikes numbers in a grid; binary search collapses a strip of bars under a target line, discarding half the window with every probe. Each gets its own accent color, so the collection reads as a set.",
      },
    ],
    gallery: [
      {
        src: algoSieve,
        alt: "The Sieve of Eratosthenes in the dark Signal theme: highlighted code beside a grid of numbers with a glowing cyan cursor ring",
        caption:
          "Algorithm 01 in Signal — the sieve mid-run, cursor on the current prime.",
      },
      {
        src: algoSearchNotebook,
        alt: "Binary search in the Notebook theme: pencil-shaded bars under a red dashed target line on graph paper, discarded bars scratched out",
        caption:
          "Algorithm 02 in Notebook — discarded halves scratched out in pencil, the target ruled in red.",
      },
      {
        src: algoSearchFound,
        alt: "Binary search in Signal at the moment the target is found: one bar lit bright green where it meets the target line",
        caption:
          "Found — the matching bar lights up where the staircase meets the target line.",
      },
    ],
    liveUrl: "https://algo.mtnsounds.com/",
    sourceUrl: "https://github.com/mountainsounds/sieveAlgoDemo",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
