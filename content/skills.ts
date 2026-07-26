export type PipelineStage = {
  /** Rendered as the stage index, e.g. "01". */
  step: string;
  name: string;
  blurb: string;
  techs: string[];
};

export type StackGroup = {
  label: string;
  techs: string[];
};

/** "The day job" — how a feature moves through the HubSpot stack. */
export const pipelineStages: PipelineStage[] = [
  {
    step: "01",
    name: "Interface",
    blurb: "Building and maintaining product UI in a large, shared frontend codebase.",
    techs: ["React", "TypeScript"],
  },
  {
    step: "02",
    name: "Services",
    blurb: "The APIs and background jobs behind it — and the on-call that comes with them.",
    techs: ["Java", "Dropwizard"],
  },
  {
    step: "03",
    name: "Data & events",
    blurb: "Where the data lives and how it moves between services.",
    techs: ["MySQL", "HBase", "Kafka", "S3"],
  },
  {
    step: "04",
    name: "Insight",
    blurb: "Figuring out whether it worked: search, product analytics, and dashboards.",
    techs: ["Elasticsearch", "Amplitude", "Grafana"],
  },
];

/** "Nights & weekends" — the personal-project stack. */
export const personalStack: StackGroup[] = [
  { label: "Build", techs: ["Next.js", "React Native & Expo"] },
  { label: "Launch", techs: ["Vercel", "Stripe", "Resend"] },
  { label: "Run", techs: ["Supabase", "Postgres", "Sentry"] },
];
