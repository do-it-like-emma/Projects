import type { Metadata } from "next";
import { RunStream } from "@/components/RunStream";
import { DiffReview } from "@/components/DiffReview";

export const metadata: Metadata = {
  title: "Console",
  description:
    "A working demo: live event streaming over SSE and a keyboard-driven review queue for proposed fixes.",
};

export default function ConsolePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Console
      </h1>
      <p className="mt-2 max-w-2xl text-[14.5px] text-[color:var(--text-muted)]">
        Two interfaces I built to show how I approach live data and review
        flows. Everything below is real and running — the events come from a
        Server-Sent Events endpoint in this app, not a recording.
      </p>

      <section className="mt-10" aria-labelledby="stream-heading">
        <h2 id="stream-heading" className="text-[15px] font-semibold">
          Live run stream
        </h2>
        <p className="mb-3 mt-1 max-w-2xl text-[13.5px] text-[color:var(--text-muted)]">
          Events arrive in bursts and are flushed once per animation frame, so
          arrival rate never drives render count. Retained rows are capped, the
          log detaches from auto-scroll the moment you scroll up, and the
          screen-reader announcement is one polite summary rather than a
          running commentary.
        </p>
        <RunStream />
      </section>

      <section className="mt-14" aria-labelledby="review-heading">
        <h2 id="review-heading" className="text-[15px] font-semibold">
          Proposed fix review
        </h2>
        <p className="mb-3 mt-1 max-w-2xl text-[13.5px] text-[color:var(--text-muted)]">
          A review queue with the evidence attached to each proposal. Click
          into the widget and drive it entirely from the keyboard:{" "}
          <kbd className="mono">j</kbd>/<kbd className="mono">k</kbd> to move,{" "}
          <kbd className="mono">a</kbd> to approve, <kbd className="mono">r</kbd>{" "}
          to reject. Added and removed lines carry a <code>+</code>/
          <code>-</code> sign, so the diff is never colour-only.
        </p>
        <DiffReview />
      </section>

      <section className="mt-14" aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="text-[15px] font-semibold">
          Engineering notes
        </h2>
        <ul className="mt-3 max-w-2xl space-y-2.5 text-[13.5px] text-[color:var(--text-muted)]">
          <li>
            <strong className="text-[color:var(--text)]">Batched rendering.</strong>{" "}
            Incoming events accumulate in a ref and flush on{" "}
            <code className="mono">requestAnimationFrame</code>. One render per
            frame no matter how fast the stream runs.
          </li>
          <li>
            <strong className="text-[color:var(--text)]">Bounded memory.</strong> The
            log keeps a fixed window of rows. A console left open all day must
            not grow its DOM all day.
          </li>
          <li>
            <strong className="text-[color:var(--text)]">SSE over WebSockets.</strong>{" "}
            The data only flows one way, so a plain HTTP stream gets automatic
            reconnection and proxy tolerance for free.
          </li>
          <li>
            <strong className="text-[color:var(--text)]">Scoped shortcuts.</strong>{" "}
            Review keys are bound inside the widget and ignore typing in inputs,
            so they never fight with the rest of the page.
          </li>
          <li>
            <strong className="text-[color:var(--text)]">
              Announcements that stay useful.
            </strong>{" "}
            A live region firing several times a second is noise. The stream
            announces a running summary; the review queue announces decisions.
          </li>
        </ul>
      </section>
    </div>
  );
}
