"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import type { Project, ProjectKind } from "@/lib/projects";

type SortKey = "name" | "year" | "kind" | "status";
type Direction = "asc" | "desc";

const KINDS: (ProjectKind | "all")[] = [
  "all",
  "product",
  "web",
  "system",
  "internal-tool",
  "contract",
];

const STATUS_COLOR: Record<Project["status"], string> = {
  live: "var(--ok)",
  shipped: "var(--accent)",
  "in-progress": "var(--warn)",
  archived: "var(--text-faint)",
};

export function ProjectTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<ProjectKind | "all">("all");
  const [sort, setSort] = useState<SortKey>("year");
  const [direction, setDirection] = useState<Direction>("desc");
  const [cursor, setCursor] = useState(0);

  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = projects.filter((p) => {
      if (kind !== "all" && p.kind !== kind) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q))
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const x = String(a[sort]).toLowerCase();
      const y = String(b[sort]).toLowerCase();
      const cmp = x < y ? -1 : x > y ? 1 : 0;
      return direction === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [projects, query, kind, sort, direction]);

  function toggleSort(key: SortKey) {
    if (key === sort) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSort(key);
      setDirection(key === "year" ? "desc" : "asc");
    }
  }

  function open(index: number) {
    const project = rows[index];
    if (project) router.push(`/work/${project.slug}`);
  }

  function onTableKeyDown(e: React.KeyboardEvent<HTMLTableElement>) {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT") return;

    if (e.key === "ArrowDown" || e.key.toLowerCase() === "j") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, rows.length - 1));
    } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "k") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      open(cursor);
    }
  }

  const sortIndicator = (key: SortKey) =>
    sort === key ? (direction === "asc" ? "▲" : "▼") : "";

  const ariaSort = (key: SortKey): "ascending" | "descending" | "none" =>
    sort === key ? (direction === "asc" ? "ascending" : "descending") : "none";

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2 pb-3">
        <label className="flex-1 min-w-[180px]">
          <span className="sr-only">Filter projects</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="Filter by name, stack…"
            className="w-full rounded border border-[var(--border)] bg-[var(--bg-panel)] px-2.5 py-1.5 text-[13px] outline-none placeholder:text-[color:var(--text-faint)] focus-visible:border-[var(--accent)]"
          />
        </label>

        <div role="group" aria-label="Filter by kind" className="flex flex-wrap gap-1">
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => {
                setKind(k);
                setCursor(0);
              }}
              className={`rounded px-2 py-1 text-[12px] capitalize transition-colors ${
                kind === k
                  ? "bg-[var(--text)] text-[color:var(--bg)]"
                  : "text-[color:var(--text-muted)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {k.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="panel overflow-x-auto">
        {/*
          A <table> is not focusable by default, so without tabIndex the row
          shortcuts below could never receive a key event. Every row also has
          a real link, so Tab remains the primary keyboard path.
        */}
        <table
          onKeyDown={onTableKeyDown}
          tabIndex={0}
          aria-label="Projects. Use arrow keys or j and k to move between rows, Enter to open."
          className="w-full min-w-[640px] border-collapse text-left"
        >
          <caption className="sr-only">
            Projects. Sortable by column. Use arrow keys to move between rows
            and Enter to open one.
          </caption>
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--bg-inset)]">
              {(
                [
                  ["name", "Project"],
                  ["kind", "Type"],
                  ["year", "Year"],
                  ["status", "Status"],
                ] as [SortKey, string][]
              ).map(([key, label]) => (
                <th
                  key={key}
                  scope="col"
                  aria-sort={ariaSort(key)}
                  className="px-3 py-2 text-[11.5px] font-medium uppercase tracking-wider text-[color:var(--text-muted)]"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(key)}
                    className="flex items-center gap-1 uppercase tracking-wider hover:text-[color:var(--text)] transition-colors"
                  >
                    {label}
                    <span aria-hidden="true" className="text-[9px]">
                      {sortIndicator(key)}
                    </span>
                  </button>
                </th>
              ))}
              <th
                scope="col"
                className="px-3 py-2 text-[11.5px] font-medium uppercase tracking-wider text-[color:var(--text-muted)]"
              >
                Stack
              </th>
            </tr>
          </thead>

          <tbody ref={tbodyRef}>
            {rows.map((project, i) => (
              <tr
                key={project.slug}
                onMouseEnter={() => setCursor(i)}
                aria-current={i === cursor ? "true" : undefined}
                className={`border-b border-[var(--border)] last:border-0 ${
                  i === cursor
                    ? "bg-[var(--bg-hover)] shadow-[inset_2px_0_0_0_var(--accent)]"
                    : ""
                }`}
              >
                <td className="px-3 py-2.5 align-top">
                  <a
                    href={`/work/${project.slug}`}
                    className="font-medium hover:underline underline-offset-4"
                  >
                    {project.name}
                  </a>
                  <p className="mt-0.5 max-w-[42ch] text-[12.5px] text-[color:var(--text-muted)]">
                    {project.tagline}
                  </p>
                </td>
                <td className="px-3 py-2.5 align-top text-[12.5px] capitalize text-[color:var(--text-muted)]">
                  {project.kind.replace("-", " ")}
                </td>
                <td className="mono px-3 py-2.5 align-top text-[12px] text-[color:var(--text-muted)]">
                  {project.year}
                </td>
                <td className="px-3 py-2.5 align-top">
                  <span className="inline-flex items-center gap-1.5 text-[12.5px]">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: STATUS_COLOR[project.status] }}
                    />
                    {project.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 align-top">
                  <ul className="flex flex-wrap gap-1">
                    {project.stack.slice(0, 3).map((s) => (
                      <li
                        key={s}
                        className="mono rounded border border-[var(--border)] bg-[var(--bg-inset)] px-1.5 py-0.5 text-[10.5px] text-[color:var(--text-muted)]"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <p className="px-3 py-10 text-center text-[13px] text-[color:var(--text-muted)]">
            Nothing matches those filters.
          </p>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {rows.length} project{rows.length === 1 ? "" : "s"} shown.
      </p>
    </div>
  );
}
