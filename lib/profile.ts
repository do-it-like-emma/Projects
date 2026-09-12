/**
 * Identity and contact details.
 * CHECK EVERY FIELD — several are placeholders that must be filled in.
 */

export const profile = {
  name: "Emmanuel Danquah",
  // The role you are positioning for.
  title: "Frontend Software Engineer",
  location: "Accra, Ghana",
  email: "emmanueldanquah466@gmail.com",
  github: "https://github.com/do-it-like-emma",
  githubHandle: "do-it-like-emma",
  // REPLACE with your real LinkedIn URL.
  linkedin: "https://www.linkedin.com/in/REPLACE-ME",
  // REPLACE once deployed, e.g. https://emmanueldanquah.vercel.app
  website: "",
  // REPLACE with a public link to your CV (Drive/Dropbox/PDF).
  resume: "",
  yearsExperience: "3-4",
  available: true,

  positioning:
    "I build data-dense product interfaces in React and TypeScript — the kind engineers keep open all day and have to trust.",

  focus: [
    "React, TypeScript, Next.js",
    "Real-time and streaming interfaces",
    "Accessibility and keyboard-driven workflows",
    "Frontend performance under live data",
  ],

  aiTools: [
    "Claude Code",
    "Cursor",
    "GitHub Copilot",
  ],
} as const;

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: [
      "React",
      "TypeScript",
      "Next.js (App Router)",
      "React Server Components",
      "Streaming SSR",
      "Tailwind CSS",
      "Web Accessibility (WCAG 2.2 AA)",
    ],
  },
  {
    group: "Realtime & data",
    items: ["Server-Sent Events", "WebSockets", "REST", "Node.js"],
  },
  {
    group: "Practice",
    items: [
      "Performance profiling",
      "Component systems",
      "AI-assisted development",
      "Git / code review",
    ],
  },
];
