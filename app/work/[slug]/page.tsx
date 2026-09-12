import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return { title: project.name, description: project.tagline };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const previous = index > 0 ? projects[index - 1] : undefined;
  const next = index < projects.length - 1 ? projects[index + 1] : undefined;

  return (
    <article className="mx-auto max-w-3xl px-4 md:px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-[13px]">
        <Link
          href="/work"
          className="text-[color:var(--text-muted)] underline underline-offset-4 hover:text-[color:var(--text)]"
        >
          ← Work
        </Link>
      </nav>

      <header className="mt-6 border-b border-[var(--border)] pb-6">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {project.name}
        </h1>
        <p className="mt-2 text-[15px] text-[color:var(--text-muted)]">
          {project.tagline}
        </p>

        <dl className="mono mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-[color:var(--text-faint)]">
          <div className="flex gap-1.5">
            <dt>year</dt>
            <dd className="text-[color:var(--text-muted)]">{project.year}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt>status</dt>
            <dd className="text-[color:var(--text-muted)]">{project.status}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt>type</dt>
            <dd className="text-[color:var(--text-muted)]">{project.kind}</dd>
          </div>
        </dl>

        {(project.links?.live || project.links?.repo) && (
          <div className="mt-5 flex flex-wrap gap-2">
            {project.links.live && (
              <a
                href={project.links.live}
                className="rounded border border-[var(--border)] bg-[var(--text)] px-3 py-1.5 text-[13px] font-medium text-[color:var(--bg)] hover:opacity-90 transition-opacity"
              >
                Visit live site
              </a>
            )}
            {project.links.repo && (
              <a
                href={project.links.repo}
                className="rounded border border-[var(--border)] px-3 py-1.5 text-[13px] hover:bg-[var(--bg-hover)] transition-colors"
              >
                Source
              </a>
            )}
          </div>
        )}
      </header>

      <section className="py-7">
        <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">
          Overview
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed">{project.summary}</p>
      </section>

      <section className="border-t border-[var(--border)] py-7">
        <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">
          My role
        </h2>
        <p className="mt-3 text-[14.5px]">{project.role}</p>
      </section>

      <section className="border-t border-[var(--border)] py-7">
        <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">
          What I built
        </h2>
        <ul className="mt-3 space-y-2">
          {project.highlights.map((h) => (
            <li key={h} className="flex gap-2.5 text-[14.5px]">
              <span
                aria-hidden="true"
                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--text-faint)]"
              />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </section>

      {project.metrics && project.metrics.length > 0 && (
        <section className="border-t border-[var(--border)] py-7">
          <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">
            Results
          </h2>
          <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="bg-[var(--bg-panel)] px-3 py-3">
                <dt className="text-[11.5px] uppercase tracking-wider text-[color:var(--text-faint)]">
                  {m.label}
                </dt>
                <dd className="mono mt-0.5 text-[17px]">{m.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <section className="border-t border-[var(--border)] py-7">
        <h2 className="text-[12px] font-semibold uppercase tracking-widest text-[color:var(--text-faint)]">
          Stack
        </h2>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <li
              key={s}
              className="mono rounded border border-[var(--border)] bg-[var(--bg-inset)] px-2 py-1 text-[11.5px] text-[color:var(--text-muted)]"
            >
              {s}
            </li>
          ))}
        </ul>
      </section>

      <nav
        aria-label="Other projects"
        className="flex flex-wrap justify-between gap-4 border-t border-[var(--border)] pt-6"
      >
        {previous ? (
          <Link
            href={`/work/${previous.slug}`}
            className="text-[13.5px] text-[color:var(--text-muted)] hover:text-[color:var(--text)]"
          >
            ← {previous.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/work/${next.slug}`}
            className="ml-auto text-[13.5px] text-[color:var(--text-muted)] hover:text-[color:var(--text)]"
          >
            {next.name} →
          </Link>
        )}
      </nav>
    </article>
  );
}
