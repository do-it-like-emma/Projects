import { profile } from "@/lib/profile";

export function SiteFooter() {
  const links = [
    { href: profile.github, label: "GitHub" },
    profile.linkedin.includes("REPLACE")
      ? null
      : { href: profile.linkedin, label: "LinkedIn" },
    { href: `mailto:${profile.email}`, label: "Email" },
  ].filter((l): l is { href: string; label: string } => l !== null);

  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px] text-[color:var(--text-muted)]">
            {profile.name} — {profile.location}
          </p>
          <ul className="flex flex-wrap items-center gap-4">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-[13px] text-[color:var(--text-muted)] hover:text-[color:var(--text)] underline underline-offset-4 decoration-[color:var(--border-strong)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-[12px] text-[color:var(--text-faint)] mono">
          Built with Next.js, React and TypeScript. Source:{" "}
          <a
            href="https://github.com/do-it-like-emma/Projects"
            className="underline underline-offset-4"
          >
            do-it-like-emma/Projects
          </a>
        </p>
      </div>
    </footer>
  );
}
