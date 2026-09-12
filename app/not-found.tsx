import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6 py-24 text-center">
      <p className="mono text-[12px] uppercase tracking-widest text-[color:var(--text-faint)]">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        That page does not exist
      </h1>
      <p className="mt-2 text-[14.5px] text-[color:var(--text-muted)]">
        The link may be out of date.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded border border-[var(--border)] px-4 py-2 text-[13.5px] hover:bg-[var(--bg-hover)] transition-colors"
      >
        Back to overview
      </Link>
    </div>
  );
}
