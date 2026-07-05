import type { StaticImageData } from "next/image";

import portfolioHome from "@/public/projects/portfolio-home.jpg";
import portfolioSkills from "@/public/projects/portfolio-skills.jpg";
import sieve from "@/public/projects/sieve.jpg";
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
    slug: "sieve-of-eratosthenes",
    title: "Sieve of Eratosthenes",
    tagline:
      "An interactive visualization of the classic prime-finding algorithm.",
    year: "2021",
    role: "Development",
    cardImage: sieve,
    cardAlt:
      "The sieve visualization: a grid of numbers with primes highlighted beside the algorithm's code",
    overview: [
      "An animated demonstration of the ancient Sieve of Eratosthenes. Enter an upper bound and watch the sieve step through the grid, eliminating multiples in real time while the driving code is highlighted alongside it.",
    ],
    stack: ["JavaScript (ES6+)", "DOM Manipulation", "Concurrency", "PrismJS"],
    highlights: [
      {
        title: "Animation as explanation",
        body: "The algorithm is stepped on a timer so each elimination is visible, turning an abstract procedure into something you can actually watch unfold across the grid.",
      },
      {
        title: "The code, live alongside",
        body: "PrismJS renders the real algorithm next to the visualization, syntax-highlighted, so the demo doubles as a readable reference for how the sieve works.",
      },
    ],
    gallery: [
      {
        src: sieve,
        alt: "The running sieve: highlighted algorithm on the left, a grid of numbers with primes marked on the right",
        caption:
          "The sieve mid-run — primes emerging in the grid as the highlighted code executes.",
      },
    ],
    liveUrl: "https://mountainsounds.github.io/sieveAlgoDemo/",
    sourceUrl: "https://github.com/mountainsounds/sieveAlgoDemo",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
