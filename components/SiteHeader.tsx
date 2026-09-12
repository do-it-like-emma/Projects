import Link from "next/link";
import { profile } from "@/lib/profile";
import { ThemeToggle } from "./ThemeToggle";
import { PaletteHint } from "./CommandPalette";

const nav = [
  { href: "/", label: "Overview" },
  { href: "/work", label: "Work" },
  { href: "/console", label: "Console" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex h-14 items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 rounded px-1 -mx-1"
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full bg-[var(--ok)] live-dot"
            />
            <span className="font-semibold tracking-tight">
              {profile.name}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden sm:block ml-2">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded px-2.5 py-1.5 text-[13px] text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <PaletteHint />
            <ThemeToggle />
          </div>
        </div>

        {/* Compact nav for narrow screens. */}
        <nav aria-label="Primary, compact" className="sm:hidden pb-2">
          <ul className="flex items-center gap-1 overflow-x-auto">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded px-2.5 py-1.5 text-[13px] whitespace-nowrap text-[color:var(--text-muted)] hover:text-[color:var(--text)] hover:bg-[var(--bg-hover)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
