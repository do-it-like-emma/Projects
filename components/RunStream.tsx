"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Level = "info" | "ok" | "warn" | "error";

interface RunEvent {
  seq: number;
  ts: number;
  agent: string;
  level: Level;
  action: string;
  target: string;
  ms: number;
}

/**
 * Hard cap on retained rows. A console that runs for an hour must not grow
 * its DOM for an hour — old rows are dropped, not hidden.
 */
const MAX_ROWS = 220;

const LEVEL_STYLE: Record<Level, { fg: string; label: string }> = {
  info: { fg: "var(--text-muted)", label: "INFO" },
  ok: { fg: "var(--ok)", label: "OK" },
  warn: { fg: "var(--warn)", label: "WARN" },
  error: { fg: "var(--danger)", label: "ERR" },
};

const FILTERS: { id: Level | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ok", label: "Passed" },
  { id: "warn", label: "Warnings" },
  { id: "error", label: "Errors" },
];

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes(),
  ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

export function RunStream() {
  const [rows, setRows] = useState<RunEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [paused, setPaused] = useState(false);
  const [follow, setFollow] = useState(true);
  const [filter, setFilter] = useState<Level | "all">("all");
  const [rate, setRate] = useState(0);
  const [total, setTotal] = useState(0);

  // Events land in a ref and are flushed once per animation frame. Calling
  // setState per event would re-render several times per frame under load;
  // batching keeps it to one render regardless of arrival rate.
  const pending = useRef<RunEvent[]>([]);
  const frame = useRef<number | null>(null);
  const pausedRef = useRef(paused);
  const receivedInWindow = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const flush = useCallback(() => {
    frame.current = null;
    const batch = pending.current;
    if (batch.length === 0) return;
    pending.current = [];

    setRows((current) => {
      const next = current.concat(batch);
      return next.length > MAX_ROWS ? next.slice(next.length - MAX_ROWS) : next;
    });
  }, []);

  const schedule = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(flush);
  }, [flush]);

  useEffect(() => {
    const source = new EventSource("/api/runs");

    source.addEventListener("ready", () => setConnected(true));

    source.addEventListener("run", (e) => {
      receivedInWindow.current += 1;
      setTotal((t) => t + 1);
      // While paused the stream stays open but nothing is buffered, so
      // resuming shows live data rather than replaying a backlog.
      if (pausedRef.current) return;
      try {
        pending.current.push(JSON.parse((e as MessageEvent<string>).data));
        schedule();
      } catch {
        // A malformed frame should never take the console down.
      }
    });

    source.onerror = () => setConnected(false);

    return () => {
      source.close();
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [schedule]);

  // Throughput meter, sampled once a second.
  useEffect(() => {
    const id = setInterval(() => {
      setRate(receivedInWindow.current);
      receivedInWindow.current = 0;
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const visible =
    filter === "all" ? rows : rows.filter((row) => row.level === filter);

  // Auto-scroll only while following, so reading history is never yanked away.
  useEffect(() => {
    if (!follow) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible.length, follow]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    // Scrolling up detaches follow; scrolling back to the bottom re-attaches.
    setFollow(atBottom);
  }

  const counts = {
    ok: rows.filter((r) => r.level === "ok").length,
    warn: rows.filter((r) => r.level === "warn").length,
    error: rows.filter((r) => r.level === "error").length,
  };

  return (
    <section className="panel overflow-hidden" aria-label="Live agent run stream">
      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--border)] bg-[var(--bg-inset)] px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${
              connected && !paused ? "live-dot" : ""
            }`}
            style={{
              background: connected ? "var(--ok)" : "var(--text-faint)",
            }}
          />
          <span className="mono text-[12px]">
            {connected ? (paused ? "paused" : "streaming") : "connecting…"}
          </span>
        </div>

        <span className="mono text-[12px] text-[color:var(--text-muted)]">
          {rate}/s
        </span>
        <span className="mono text-[12px] text-[color:var(--text-muted)]">
          {total} events
        </span>
        <span className="mono text-[12px] text-[color:var(--text-muted)] hidden sm:inline">
          {rows.length}/{MAX_ROWS} retained
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="rounded border border-[var(--border)] px-2 py-1 text-[12px] hover:bg-[var(--bg-hover)] transition-colors"
          >
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            onClick={() => {
              setRows([]);
              setTotal(0);
            }}
            className="rounded border border-[var(--border)] px-2 py-1 text-[12px] hover:bg-[var(--bg-hover)] transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        role="group"
        aria-label="Filter events by level"
        className="flex flex-wrap items-center gap-1 border-b border-[var(--border)] px-3 py-2"
      >
        {FILTERS.map((f) => {
          const isActive = filter === f.id;
          const count =
            f.id === "all"
              ? rows.length
              : counts[f.id as keyof typeof counts] ?? 0;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(f.id)}
              className={`rounded px-2 py-1 text-[12px] transition-colors ${
                isActive
                  ? "bg-[var(--text)] text-[color:var(--bg)]"
                  : "text-[color:var(--text-muted)] hover:bg-[var(--bg-hover)]"
              }`}
            >
              {f.label}
              <span className="mono ml-1.5">{count}</span>
            </button>
          );
        })}

        <label className="ml-auto flex items-center gap-1.5 text-[12px] text-[color:var(--text-muted)]">
          <input
            type="checkbox"
            checked={follow}
            onChange={(e) => setFollow(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          Follow
        </label>
      </div>

      {/* Log */}
      {/*
        A scrollable region needs to be focusable, or keyboard-only users can
        never reach the history it holds.
      */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        tabIndex={0}
        role="group"
        aria-label="Event log, scrollable"
        className="stream-scroll h-80 overflow-y-auto"
      >
        <table className="w-full border-collapse">
          <caption className="sr-only">
            Live agent run events. Updates automatically; use Pause to stop.
          </caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Agent</th>
              <th scope="col">Level</th>
              <th scope="col">Action</th>
              <th scope="col">Target</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const style = LEVEL_STYLE[row.level];
              return (
                <tr
                  key={row.seq}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]"
                >
                  <td className="mono whitespace-nowrap py-1 pl-3 pr-2 text-[11.5px] text-[color:var(--text-faint)] align-top">
                    {formatTime(row.ts)}
                  </td>
                  <td className="mono whitespace-nowrap px-2 py-1 text-[11.5px] text-[color:var(--text-muted)] align-top">
                    {row.agent}
                  </td>
                  <td
                    className="mono whitespace-nowrap px-2 py-1 text-[11.5px] font-semibold align-top"
                    style={{ color: style.fg }}
                  >
                    {style.label}
                  </td>
                  <td className="mono whitespace-nowrap px-2 py-1 text-[11.5px] align-top">
                    {row.action}
                  </td>
                  <td className="mono px-2 py-1 text-[11.5px] text-[color:var(--text-muted)] align-top">
                    {row.target}
                  </td>
                  <td className="mono whitespace-nowrap py-1 pl-2 pr-3 text-right text-[11.5px] text-[color:var(--text-faint)] align-top">
                    {row.ms}ms
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {visible.length === 0 && (
          <p className="px-3 py-8 text-center text-[13px] text-[color:var(--text-muted)]">
            {connected ? "No events match this filter." : "Connecting…"}
          </p>
        )}
      </div>

      {/*
        One polite summary rather than a live region on the log itself:
        announcing several events a second would make a screen reader useless.
      */}
      <p aria-live="polite" className="sr-only">
        {`${total} events received. ${counts.error} errors, ${counts.warn} warnings.`}
      </p>
    </section>
  );
}
