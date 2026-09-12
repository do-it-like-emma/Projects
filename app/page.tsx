import Link from "next/link";
import { profile, skills } from "@/lib/profile";
import { projects } from "@/lib/projects";
import { ProjectTable } from "@/components/ProjectTable";

export default function HomePage() {
  const shipped = projects.length;
  const live = projects.filter((p) => p.status === "live").length;

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      {/* Hero */}
      <section className="border-b border-[var(--border)] py-14 md:py-20">
        <p className="mono text-[12px] uppercase tracking-widest text-[color:var(--text-faint)]">
          {profile.title} — {profile.location}
        </p>
        <h1 className="mt-3 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          {profile.positioning}
        </h1>
        <p className="mt-5 max-w-2xl text-[15px] text-[color:var(--text-muted)]">
          {profile.yearsExperience} years building production web applications.
          I care about the parts of a frontend that only show up under load:
          streaming updates that stay smooth, tables that stay readable at a
          thousand rows, and keyboard paths that survive an eight-hour review
          session.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          <Link
            href="/console"
            className="rounded border border-[var(--border)] bg-[var(--text)] px-4 py-2 text-[13.5px] font-medium text-[color:var(--bg)] hover:opacity-90 transition-opacity"
          >
            Open the console demo
          </Link>
          <Link
            href="/work"
            className="rounded border border-[var(--border)] px-4 py-2 text-[13.5px] hover:bg-[var(--bg-hover)] transition-colors"
          >
            See the work
          </Link>
          <a
            href={profile.github}
            className="rounded border border-[var(--border)] px-4 py-2 text-[13.5px] hover:bg-[var(--bg-hover)] transition-colors"
          >
            GitHub
          </a>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
          {[
            { k: "Experience", v: `${profile.yearsExperience} yrs` },
            { k: "Projects", v: String(shipped) },
            { k: "Live", v: String(live) },
            { k: "Based in", v: "Accra" },
          ].map((stat) => (
            <div key={stat.k} className="bg-[var(--bg-panel)] px-3 py-3">
              <dt className="text-[11.5px] uppercase tracking-wider text-[color:var(--text-faint)]">
                {stat.k}
              </dt>
              <dd className="mono mt-0.5 text-[17px]">{stat.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* What this site is */}
      <section className="border-b border-[var(--border)] py-12">
        <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">
          About this site
        </h2>
        <p className="mt-4 max-w-2xl text-[15px]">
          This portfolio is built as a console, on purpose. Rather than
          describing what I can do with real-time data and review interfaces,
          it runs them: a live event stream over Server-Sent Events, a
          keyboard-driven diff review queue, and a sortable project index —
          all in React, TypeScript and Next.js, with the accessibility and
          performance work done rather than promised.
        </p>
        <p className="mt-3 max-w-2xl text-[14px] text-[color:var(--text-muted)]">
          Press <kbd className="mono rounded border border-[var(--border)] bg-[var(--bg-inset)] px-1.5 py-0.5 text-[11.5px]">⌘K</kbd>{" "}
          anywhere to open the command palette.
        </p>
      </section>

      {/* Skills */}
      <section className="border-b border-[var(--border)] py-12">
        <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">
          Stack
        </h2>
        <div className="mt-5 grid gap-6 md:grid-cols-3">
          {skills.map((group) => (
            <div key={group.group}>
              <h3 className="text-[13.5px] font-semibold">{group.group}</h3>
              <ul className="mt-2 space-y-1">
                {group.items.map((item) => (
                  <li key={item} className="text-[13.5px] text-[color:var(--text-muted)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Work */}
      <section className="py-12">
        <div className="flex items-baseline justify-between gap-4 pb-4">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">
            Selected work
          </h2>
          <Link
            href="/work"
            className="text-[13px] text-[color:var(--text-muted)] underline underline-offset-4 hover:text-[color:var(--text)]"
          >
            All projects
          </Link>
        </div>
        <ProjectTable projects={projects.slice(0, 5)} />
      </section>
    </div>
  );
}
