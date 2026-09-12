import type { Metadata } from "next";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "About",
  description: profile.positioning,
};

const a11yNotes = [
  "Every interactive element is reachable and operable from the keyboard, with a visible focus ring that is never removed without a replacement.",
  "The command palette traps nothing it should not: Escape closes it and focus returns to whatever opened it.",
  "Live regions are polite and summarised. A region that fires on every streamed event is worse than no region at all.",
  "Colour is never the only carrier of meaning — diff lines keep their +/- signs, status dots sit beside text labels.",
  "prefers-reduced-motion is respected: animation and smooth scrolling are cut, not merely shortened.",
  "Tables use real table semantics with scope'd headers, captions and aria-sort, so they read correctly in a screen reader.",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        About
      </h1>

      <section className="mt-6 space-y-4 text-[15px] leading-relaxed">
        <p>
          I am a frontend engineer in {profile.location} with{" "}
          {profile.yearsExperience} years of production experience in React and
          TypeScript. Most of what I have built has been end to end — I am
          usually the person who takes something from an empty repository to a
          deployed product people actually use.
        </p>
        <p>
          The work I care most about is the dense kind: dashboards, consoles,
          admin surfaces, anything where the interface has to stay legible and
          fast while a lot is happening at once. Those are the interfaces where
          frontend decisions stop being cosmetic and start determining whether
          someone can do their job.
        </p>
      </section>

      <section className="mt-10 border-t border-[var(--border)] pt-8">
        <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">
          How I work with AI tools
        </h2>
        <p className="mt-3 text-[14.5px] leading-relaxed">
          AI tooling is part of my daily loop rather than an occasional
          shortcut. I use it to move fast through the parts of a build that are
          well understood — scaffolding, refactors across many files, test
          coverage, wiring up a new surface — and I stay hands-on for the parts
          where judgement matters: data modelling, interaction design,
          performance work, and anything touching accessibility. I read every
          diff before it lands. The speed only counts if the output still holds
          up under review.
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {profile.aiTools.map((tool) => (
            <li
              key={tool}
              className="mono rounded border border-[var(--border)] bg-[var(--bg-inset)] px-2 py-1 text-[11.5px] text-[color:var(--text-muted)]"
            >
              {tool}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 border-t border-[var(--border)] pt-8">
        <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">
          Accessibility in this build
        </h2>
        <p className="mt-3 text-[14.5px] text-[color:var(--text-muted)]">
          Specifics rather than a claim. Each of these is implemented in the
          code of this site.
        </p>
        <ul className="mt-4 space-y-2.5">
          {a11yNotes.map((note) => (
            <li key={note} className="flex gap-2.5 text-[14px]">
              <span
                aria-hidden="true"
                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--text-faint)]"
              />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 border-t border-[var(--border)] pt-8">
        <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">
          Contact
        </h2>
        <ul className="mt-3 space-y-1.5 text-[14.5px]">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="underline underline-offset-4 decoration-[color:var(--border-strong)] hover:decoration-[color:var(--text)]"
            >
              {profile.email}
            </a>
          </li>
          <li>
            <a
              href={profile.github}
              className="underline underline-offset-4 decoration-[color:var(--border-strong)] hover:decoration-[color:var(--text)]"
            >
              {profile.github}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
