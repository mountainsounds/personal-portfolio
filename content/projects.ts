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
      "The campaign website for Dave Wolk's 2026 run for Vermont State Senate. It takes donations too.",
    year: "2026",
    role: "Design & Full-Stack Development",
    cardImage: wolkHome,
    cardAlt: "The Wolk for Senate homepage hero",
    overview: [
      "This is the 2026 campaign website for Dave Wolk, an Independent candidate for Vermont State Senate in Rutland County. I designed and built all of it.",
      "Donations are the part that had to be right. There are rules about who can give and how much, and the campaign has to report what it takes in.",
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
        title: "Campaign finance rules",
        body: "Before any charge is made, the server checks the donation against the law. That means Vermont's $1,940 cap per person, the $100 threshold where a donor's name and address are required, and three statements every donor has to confirm.",
      },
      {
        title: "A CSV for the filing",
        body: "A password-protected admin page exports every contribution as a CSV, in the column order Vermont's filing uses. Nobody on the campaign has to retype anything.",
      },
      {
        title: "The design",
        body: "The background is a warm off-white. The green is Castleton green, the color of the university where Dave was president. Headlines are set in a serif, and the body copy is in his own first-person voice. Every page was checked against WCAG.",
      },
    ],
    gallery: [
      {
        src: wolkHome,
        alt: "Homepage hero: 'A steady hand for Rutland' beside a portrait of the candidate",
        caption: "The home page.",
      },
      {
        src: wolkPriorities,
        alt: "The Priorities page: the headline 'There are so many issues that matter' above a photo of Dave Wolk talking with two people in front of a brick building",
        caption: "The Priorities page, which opens with three issues.",
      },
      {
        src: wolkDonate,
        alt: "The donation page with contribution amount options over a green background",
        caption:
          "The donation page. The form and the legal statements sit below the amounts.",
      },
    ],
    liveUrl: "https://wolkforsenate.com/",
    // Source intentionally omitted — this is a private client repository.
  },
  {
    slug: "personal-portfolio",
    title: "This Portfolio",
    tagline:
      "The site you're on. I built it in 2021 and rebuilt it in 2026 on Next.js.",
    year: "2021 – 2026",
    role: "Design & Development",
    cardImage: portfolioHome,
    cardAlt:
      "The mtnsounds.com home page: the name Zack Sawyer on a teal card over a photo of two climbers on a snowy summit ridge",
    overview: [
      "I started this site in 2021, while I was learning to code. The first version was a static page written by hand. It turned into a React and Next.js app after that, and in 2026 I rebuilt it on the Next.js App Router with React 19 and TypeScript. That's the version you're looking at.",
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Sass", "Resend", "Vercel"],
    highlights: [
      {
        title: "Mostly static",
        body: "Every page is static HTML. Only three pieces are interactive: the mobile menu, the typing line on the home page, and the contact form.",
      },
      {
        title: "The contact form",
        body: "It posts to a route handler that emails me through Resend. There's no database to look after.",
      },
    ],
    gallery: [
      {
        src: portfolioHome,
        alt: "The home page: the name Zack Sawyer on a translucent teal card, over a photo of two climbers on a snowy summit ridge above the clouds. A line under the name reads 'Climber'.",
        caption:
          "The home page. The line under my name types out a few words in turn.",
      },
      {
        src: portfolioSkills,
        alt: "The skills page: a short intro, then a section called 'The day job' with four stages, Interface, Services, Data & events, and Insight, each with a description and technology chips",
        caption:
          "The skills page, which walks through the stack I use at work.",
      },
    ],
    liveUrl: "https://mtnsounds.com/",
    sourceUrl: "https://github.com/mountainsounds/personal-portfolio",
  },
  {
    slug: "algo",
    title: "algo.",
    tagline:
      "Animated walkthroughs of classic algorithms, with the code highlighted line by line as they run.",
    year: "2021 – 2026",
    role: "Design & Development",
    cardImage: algoSieve,
    cardAlt:
      "The algo. site running the Sieve of Eratosthenes: highlighted code beside a dark grid of numbers with a glowing cursor",
    overview: [
      "This is a site where you can watch classic algorithms run. There are five so far: the Sieve of Eratosthenes, binary search, insertion sort, merge sort, and quicksort. Each one has an animation, a line of narration for the current step, and the code beside it with the running line highlighted.",
      "It began in 2021 as a single sieve demo in vanilla JavaScript. In 2026 I rebuilt it in TypeScript with Vite and no framework, and I've been adding algorithms since. I kept the pacing slow on purpose, and you can pause it and go one step at a time.",
    ],
    stack: ["Vite 7", "TypeScript", "PrismJS", "Vitest", "Vercel"],
    highlights: [
      {
        title: "A list of steps",
        body: "The 2021 version animated from inside the algorithm's loops, sleeping between iterations. Nothing could stop a run once it started, so a reset left the old loop going. Now each algorithm returns a list of steps and a small player walks it. That's what makes pause, step, and reset work.",
      },
      {
        title: "Three languages, one run",
        body: "The code panel shows each algorithm in JavaScript, Python, or Java. The steps are the same in all three. Each listing says which of its lines a step belongs to, so the highlight lands on the right line in whichever one you pick.",
      },
      {
        title: "Wrapping code on a phone",
        body: "On a phone the longer lines of code don't fit. A browser wraps at the last space that fits, which can strand a lone brace on its own row. I wrote a small line breaker that scores each place a line could break and picks the one a person would.",
      },
    ],
    gallery: [
      {
        src: algoSieve,
        alt: "The Sieve of Eratosthenes in the dark Signal theme: highlighted code beside a grid of numbers with a glowing cyan cursor ring",
        caption:
          "The sieve mid-run in Signal, the dark theme, with the ring on the current prime.",
      },
      {
        src: algoSearchNotebook,
        alt: "Binary search in the Notebook theme: pencil-shaded bars crossed by a red dashed target line on graph paper, discarded bars scratched out",
        caption:
          "Binary search in Notebook, the light theme, with discarded bars scratched out in pencil and the target ruled in red.",
      },
      {
        src: algoSearchFound,
        alt: "Binary search in Signal at the moment the target is found: one bar lit bright green where it meets the target line",
        caption:
          "Binary search in Signal at the moment it finds the target, with one bar lit green.",
      },
    ],
    liveUrl: "https://algo.mtnsounds.com/",
    sourceUrl: "https://github.com/mountainsounds/sieveAlgoDemo",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
