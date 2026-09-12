/**
 * ─────────────────────────────────────────────────────────────────────────────
 * EDIT THIS FILE BEFORE YOU SEND THE LINK TO ANYONE.
 *
 * Entries marked `draft: true` were scaffolded from the project NAME only —
 * the source for them is on a local machine and was never pushed, so the
 * copy below is a placeholder shape, not a description of what you built.
 *
 * For each draft entry replace: `tagline`, `summary`, `highlights`, `stack`,
 * `metrics`, `year`, `links`. Then delete the `draft: true` line.
 *
 * `npm run check:drafts` lists everything still unreviewed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type ProjectStatus = "live" | "shipped" | "in-progress" | "archived";

export type ProjectKind =
  | "product"
  | "web"
  | "internal-tool"
  | "system"
  | "contract";

export interface Metric {
  /** Short label, e.g. "Lighthouse" */
  label: string;
  /** Short value, e.g. "98" */
  value: string;
}

export interface Project {
  slug: string;
  name: string;
  /** One line. Shows in the index table. Keep under ~70 chars. */
  tagline: string;
  /** 2-4 sentences. Shows on the detail page. */
  summary: string;
  year: string;
  status: ProjectStatus;
  kind: ProjectKind;
  /** What you personally owned. Be specific and honest. */
  role: string;
  stack: string[];
  /** Concrete things you built. Each one a single sentence, past tense. */
  highlights: string[];
  metrics?: Metric[];
  links?: { live?: string; repo?: string; caseStudy?: string };
  /** Scaffolded from the name only — needs your review before publishing. */
  draft?: boolean;
  /** Pin to the top of the index. */
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "ezekiel",
    name: "Ezekiel",
    tagline: "REPLACE — one line describing what Ezekiel is.",
    summary:
      "REPLACE — what problem Ezekiel solves, who uses it, and what you owned end to end. Two to four sentences.",
    year: "2025",
    status: "shipped",
    kind: "product",
    role: "REPLACE — e.g. Sole engineer: design, frontend, backend, deploy.",
    stack: ["React", "TypeScript"],
    highlights: [
      "REPLACE — a specific thing you built.",
      "REPLACE — a hard problem you solved and how.",
      "REPLACE — something measurable you improved.",
    ],
    links: {},
    draft: true,
    featured: true,
  },
  {
    slug: "melek",
    name: "Melek",
    tagline: "REPLACE — one line describing what Melek is.",
    summary:
      "REPLACE — what Melek does, who it is for, and the part you owned.",
    year: "2025",
    status: "shipped",
    kind: "product",
    role: "REPLACE — your role.",
    stack: ["React", "TypeScript"],
    highlights: [
      "REPLACE — a specific thing you built.",
      "REPLACE — a hard problem you solved.",
    ],
    links: {},
    draft: true,
    featured: true,
  },
  {
    slug: "remote-job-application-system",
    name: "Remote Job Application System",
    tagline:
      "REPLACE — e.g. automates tracking and submitting remote job applications.",
    summary:
      "REPLACE — what the system automates, what it integrates with, and how it is architected. This is your most relevant project for a tooling/console role, so give it the most detail.",
    year: "2025",
    status: "shipped",
    kind: "system",
    role: "REPLACE — your role.",
    stack: ["TypeScript", "Node.js"],
    highlights: [
      "REPLACE — how applications are ingested/tracked.",
      "REPLACE — any automation, queueing, or scheduling you built.",
      "REPLACE — the dashboard or interface you built on top.",
    ],
    links: {},
    draft: true,
    featured: true,
  },
  {
    slug: "library-system",
    name: "Library System",
    tagline: "REPLACE — e.g. catalogue, lending and member management.",
    summary:
      "REPLACE — scope of the system, the data model, and what you owned. Mention the admin/dashboard surface if there is one — it is directly relevant to data-dense UI work.",
    year: "2024",
    status: "shipped",
    kind: "system",
    role: "REPLACE — your role.",
    stack: ["TypeScript", "React"],
    highlights: [
      "REPLACE — search / catalogue interface.",
      "REPLACE — lending or availability logic.",
      "REPLACE — admin views and permissions.",
    ],
    links: {},
    draft: true,
  },
  {
    slug: "just-matcha",
    name: "Just Matcha",
    tagline: "REPLACE — one line describing the Just Matcha site.",
    summary:
      "REPLACE — what the site is, whether it sells, and what you built. Note anything about performance, responsiveness, or conversion.",
    year: "2024",
    status: "live",
    kind: "web",
    role: "REPLACE — your role.",
    stack: ["React", "TypeScript"],
    highlights: [
      "REPLACE — the interface you built.",
      "REPLACE — anything about performance or responsiveness.",
    ],
    links: {},
    draft: true,
  },
  {
    slug: "dulcies",
    name: "Dulcie's",
    tagline: "REPLACE — one line describing the Dulcie's site.",
    summary: "REPLACE — what the site is, who it is for, and what you built.",
    year: "2024",
    status: "live",
    kind: "web",
    role: "REPLACE — your role.",
    stack: ["React", "TypeScript"],
    highlights: [
      "REPLACE — the interface you built.",
      "REPLACE — anything notable about the build.",
    ],
    links: {},
    draft: true,
  },
  {
    slug: "quansah",
    name: "Quansah",
    tagline: "REPLACE — one line. TypeScript project, most recently active.",
    summary:
      "REPLACE — what Quansah does. This one is already on GitHub, so link the repo below.",
    year: "2026",
    status: "in-progress",
    kind: "product",
    role: "REPLACE — your role.",
    stack: ["TypeScript"],
    highlights: ["REPLACE — what you built."],
    links: { repo: "https://github.com/do-it-like-emma/quansah" },
    draft: true,
  },
  {
    slug: "b3tr-tradze",
    name: "B3TR Tradze",
    tagline: "REPLACE — on-chain trading project (Solidity + backend).",
    summary:
      "REPLACE — what the contracts do and what the backend serves. Pairs with the b3tr-burn-backend repo.",
    year: "2025",
    status: "shipped",
    kind: "product",
    role: "REPLACE — your role.",
    stack: ["Solidity", "TypeScript", "Node.js"],
    highlights: ["REPLACE — contract or backend work you owned."],
    links: {
      repo: "https://github.com/do-it-like-emma/B3TR-TRADZE",
    },
    draft: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const draftCount = projects.filter((p) => p.draft).length;
