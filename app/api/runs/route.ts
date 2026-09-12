import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Server-Sent Events endpoint emitting a synthetic agent-fleet run.
 *
 * SSE rather than WebSockets: the data is strictly server -> client, so a
 * plain HTTP stream reconnects for free, survives proxies, and needs no
 * separate server. The client is in components/RunStream.tsx.
 */

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

const AGENTS = [
  "agent-01",
  "agent-02",
  "agent-03",
  "agent-04",
  "agent-05",
  "agent-06",
];

const STEPS: { action: string; target: string; level: Level }[] = [
  { action: "clone", target: "repo/checkout", level: "info" },
  { action: "index", target: "src/**/*.ts", level: "info" },
  { action: "detect", target: "flaky test: auth.spec.ts", level: "warn" },
  { action: "read", target: "lib/session.ts", level: "info" },
  { action: "patch", target: "lib/session.ts:118", level: "ok" },
  { action: "run", target: "vitest --changed", level: "info" },
  { action: "pass", target: "142 tests", level: "ok" },
  { action: "fail", target: "timeout after 30s", level: "error" },
  { action: "retry", target: "attempt 2/3", level: "warn" },
  { action: "typecheck", target: "tsc --noEmit", level: "info" },
  { action: "lint", target: "eslint .", level: "info" },
  { action: "propose", target: "fix: null guard on refresh", level: "ok" },
  { action: "bench", target: "p95 412ms → 180ms", level: "ok" },
  { action: "scan", target: "0 advisories", level: "ok" },
];

function pick<T>(items: readonly T[], index: number): T {
  // Non-null assertion avoided: noUncheckedIndexedAccess is on, and the
  // modulo keeps the index in range for any non-empty array.
  const value = items[index % items.length];
  if (value === undefined) throw new Error("empty pool");
  return value;
}

export function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  let seq = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      const emit = () => {
        // A small burst per tick, so the client is exercised the way a real
        // fleet behaves: bunched arrivals, not one tidy event at a time.
        const burst = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < burst; i++) {
          const step = pick(STEPS, Math.floor(Math.random() * STEPS.length));
          const event: RunEvent = {
            seq: seq++,
            ts: Date.now(),
            agent: pick(AGENTS, Math.floor(Math.random() * AGENTS.length)),
            level: step.level,
            action: step.action,
            target: step.target,
            ms: 20 + Math.floor(Math.random() * 900),
          };
          send("run", event);
        }
      };

      send("ready", { at: Date.now() });
      emit();
      timer = setInterval(emit, 220);

      // The client going away is the normal end of a stream, not an error.
      request.signal.addEventListener("abort", () => {
        if (timer) clearInterval(timer);
        try {
          controller.close();
        } catch {
          // Already closed by the runtime.
        }
      });
    },
    cancel() {
      if (timer) clearInterval(timer);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
