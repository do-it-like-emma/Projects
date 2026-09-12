"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type LineKind = "add" | "del" | "ctx" | "meta";

interface DiffLine {
  kind: LineKind;
  text: string;
  /** Line number in the old file. */
  old?: number;
  /** Line number in the new file. */
  new?: number;
}

interface Proposal {
  id: string;
  title: string;
  file: string;
  agent: string;
  confidence: number;
  evidence: string;
  tests: string;
  diff: DiffLine[];
}

type Decision = "pending" | "approved" | "rejected";

const PROPOSALS: Proposal[] = [
  {
    id: "fix-401",
    title: "Guard against a null session during token refresh",
    file: "lib/session.ts",
    agent: "agent-03",
    confidence: 0.94,
    evidence:
      "Reproduced on 7/7 runs. Throws when refresh fires after sign-out clears the store.",
    tests: "142 passed · 0 failed",
    diff: [
      { kind: "meta", text: "@@ -114,7 +114,11 @@ async function refresh()" },
      { kind: "ctx", text: "  const session = store.get();", old: 114, new: 114 },
      { kind: "del", text: "  const token = session.token;", old: 115 },
      { kind: "add", text: "  if (!session) {", new: 115 },
      { kind: "add", text: "    // Sign-out can clear the store mid-flight.", new: 116 },
      { kind: "add", text: "    return null;", new: 117 },
      { kind: "add", text: "  }", new: 118 },
      { kind: "add", text: "  const token = session.token;", new: 119 },
      { kind: "ctx", text: "  return exchange(token);", old: 116, new: 120 },
    ],
  },
  {
    id: "fix-402",
    title: "Debounce the resize observer feeding the timeline",
    file: "components/Timeline.tsx",
    agent: "agent-01",
    confidence: 0.81,
    evidence:
      "Layout thrash on every resize frame. p95 interaction 412ms → 180ms after the change.",
    tests: "142 passed · 0 failed",
    diff: [
      { kind: "meta", text: "@@ -40,6 +40,8 @@ useEffect(() => {" },
      { kind: "ctx", text: "  const ro = new ResizeObserver(() => {", old: 40, new: 40 },
      { kind: "del", text: "    setWidth(el.clientWidth);", old: 41 },
      { kind: "add", text: "    // Coalesce to one measurement per frame.", new: 41 },
      { kind: "add", text: "    cancelAnimationFrame(raf.current);", new: 42 },
      { kind: "add", text: "    raf.current = requestAnimationFrame(() =>", new: 43 },
      { kind: "add", text: "      setWidth(el.clientWidth));", new: 44 },
      { kind: "ctx", text: "  });", old: 42, new: 45 },
    ],
  },
  {
    id: "fix-403",
    title: "Announce async row updates to assistive technology",
    file: "components/RunTable.tsx",
    agent: "agent-05",
    confidence: 0.67,
    evidence:
      "Rows swap without any announcement; screen-reader users get no signal that the table changed.",
    tests: "142 passed · 0 failed",
    diff: [
      { kind: "meta", text: "@@ -22,3 +22,6 @@ export function RunTable()" },
      { kind: "ctx", text: "  return (", old: 22, new: 22 },
      { kind: "add", text: '    <p aria-live="polite" className="sr-only">', new: 23 },
      { kind: "add", text: "      {rows.length} runs loaded", new: 24 },
      { kind: "add", text: "    </p>", new: 25 },
      { kind: "ctx", text: "    <table>…</table>", old: 23, new: 26 },
    ],
  },
];

const LINE_STYLE: Record<LineKind, { bg: string; fg: string; sign: string }> = {
  add: { bg: "var(--add-bg)", fg: "var(--add-fg)", sign: "+" },
  del: { bg: "var(--del-bg)", fg: "var(--del-fg)", sign: "-" },
  ctx: { bg: "transparent", fg: "var(--text-muted)", sign: " " },
  meta: { bg: "var(--bg-inset)", fg: "var(--text-faint)", sign: " " },
};

export function DiffReview() {
  const [index, setIndex] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [announcement, setAnnouncement] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const current = PROPOSALS[index];

  const decide = useCallback(
    (decision: Exclude<Decision, "pending">) => {
      const proposal = PROPOSALS[index];
      if (!proposal) return;
      setDecisions((d) => ({ ...d, [proposal.id]: decision }));
      setAnnouncement(`${proposal.title} ${decision}.`);
      // Advance to the next undecided item, the way a real review queue does.
      setIndex((i) => Math.min(i + 1, PROPOSALS.length - 1));
    },
    [index],
  );

  const move = useCallback((delta: number) => {
    setIndex((i) => Math.min(Math.max(i + delta, 0), PROPOSALS.length - 1));
  }, []);

  // Shortcuts are scoped to the widget: they fire only while focus is inside
  // it, so they never hijack typing elsewhere on the page.
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

    switch (e.key.toLowerCase()) {
      case "j":
      case "arrowdown":
        e.preventDefault();
        move(1);
        break;
      case "k":
      case "arrowup":
        e.preventDefault();
        move(-1);
        break;
      case "a":
        e.preventDefault();
        decide("approved");
        break;
      case "r":
        e.preventDefault();
        decide("rejected");
        break;
      default:
        break;
    }
  }

  const reviewed = Object.keys(decisions).length;

  if (!current) return null;

  return (
    <section
      ref={containerRef}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label="Proposed fix review queue"
      className="panel overflow-hidden focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--border)] bg-[var(--bg-inset)] px-3 py-2">
        <h3 className="text-[13px] font-semibold">Review queue</h3>
        <span className="mono text-[12px] text-[color:var(--text-muted)]">
          {reviewed}/{PROPOSALS.length} reviewed
        </span>
        <p className="ml-auto text-[11.5px] text-[color:var(--text-faint)]">
          <kbd className="mono">j</kbd>/<kbd className="mono">k</kbd> move ·{" "}
          <kbd className="mono">a</kbd> approve · <kbd className="mono">r</kbd>{" "}
          reject
        </p>
      </div>

      <div className="grid md:grid-cols-[minmax(0,230px)_minmax(0,1fr)]">
        {/* Queue */}
        <ul
          role="listbox"
          aria-label="Proposed fixes"
          aria-activedescendant={`proposal-${current.id}`}
          className="border-b md:border-b-0 md:border-r border-[var(--border)]"
        >
          {PROPOSALS.map((proposal, i) => {
            const decision = decisions[proposal.id] ?? "pending";
            const isActive = i === index;
            return (
              <li key={proposal.id} role="presentation">
                <button
                  type="button"
                  id={`proposal-${proposal.id}`}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => setIndex(i)}
                  className={`w-full border-b border-[var(--border)] px-3 py-2.5 text-left last:border-0 transition-colors ${
                    isActive ? "bg-[var(--bg-hover)]" : "hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background:
                          decision === "approved"
                            ? "var(--ok)"
                            : decision === "rejected"
                              ? "var(--danger)"
                              : "var(--text-faint)",
                      }}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[12.5px]">
                        {proposal.title}
                      </span>
                      <span className="mono block truncate text-[11px] text-[color:var(--text-faint)]">
                        {proposal.file}
                      </span>
                      {decision !== "pending" && (
                        <span className="sr-only">{decision}</span>
                      )}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Detail */}
        <div className="min-w-0">
          <div className="border-b border-[var(--border)] px-3 py-2.5">
            <h4 className="text-[13.5px] font-semibold">{current.title}</h4>
            <div className="mono mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-[color:var(--text-faint)]">
              <span>{current.file}</span>
              <span>{current.agent}</span>
              <span>confidence {(current.confidence * 100).toFixed(0)}%</span>
              <span>{current.tests}</span>
            </div>
            <p className="mt-2 text-[12.5px] text-[color:var(--text-muted)]">
              {current.evidence}
            </p>
          </div>

          {/* Diff */}
          <div className="stream-scroll overflow-x-auto">
            <table className="w-full border-collapse">
              <caption className="sr-only">
                Proposed change to {current.file}
              </caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Old line</th>
                  <th scope="col">New line</th>
                  <th scope="col">Change</th>
                </tr>
              </thead>
              <tbody>
                {current.diff.map((line, i) => {
                  const style = LINE_STYLE[line.kind];
                  return (
                    <tr key={i} style={{ background: style.bg }}>
                      <td
                        aria-hidden="true"
                        className="mono w-10 select-none border-r border-[var(--border)] px-2 py-0.5 text-right text-[11px] text-[color:var(--text-faint)]"
                      >
                        {line.old ?? ""}
                      </td>
                      <td
                        aria-hidden="true"
                        className="mono w-10 select-none border-r border-[var(--border)] px-2 py-0.5 text-right text-[11px] text-[color:var(--text-faint)]"
                      >
                        {line.new ?? ""}
                      </td>
                      <td
                        className="mono whitespace-pre px-2 py-0.5 text-[11.5px]"
                        style={{ color: style.fg }}
                      >
                        {/* The sign is real text, so the change survives
                            copy-paste and is not colour-only information. */}
                        {style.sign}
                        {line.text}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] px-3 py-2.5">
            <button
              type="button"
              onClick={() => decide("approved")}
              className="rounded border border-[var(--border)] bg-[var(--text)] px-3 py-1.5 text-[12.5px] font-medium text-[color:var(--bg)] hover:opacity-90 transition-opacity"
            >
              Approve fix
            </button>
            <button
              type="button"
              onClick={() => decide("rejected")}
              className="rounded border border-[var(--border)] px-3 py-1.5 text-[12.5px] hover:bg-[var(--bg-hover)] transition-colors"
            >
              Reject
            </button>
            <span className="mono ml-auto text-[11.5px] text-[color:var(--text-faint)]">
              {decisions[current.id] ?? "pending"}
            </span>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}
