# Emmanuel Danquah — engineering portfolio

A portfolio built as a **console**, because describing real-time and review
interfaces is weaker evidence than running them.

**Live:** _add your Vercel URL here after the first deploy_

---

## Why it is built this way

Most portfolios are a list of links. This one is the artefact: the same class
of interface I want to be hired to build — dense, live, keyboard-driven — with
the accessibility and performance work actually done and measured.

| Surface | What it demonstrates |
| --- | --- |
| `/console` — live run stream | Server-Sent Events, batched rendering, bounded memory, throughput metering |
| `/console` — review queue | Diff review and approval flow, scoped keyboard shortcuts, evidence-first layout |
| `/work` — project index | Sortable, filterable, keyboard-navigable data table with real table semantics |
| `⌘K` command palette | Focus management, `combobox`/`listbox` ARIA, focus restoration on close |
| Whole site | Light/dark theming with no flash, reduced-motion support, responsive to 390px |

## Verified, not asserted

Both suites run against the production build:

- **Accessibility:** 0 axe-core violations (WCAG 2.0/2.1/2.2 A + AA) across 5
  pages × 2 colour schemes, plus the command palette in its open state.
- **Contrast:** every foreground token clears 4.5:1 against the worst-case
  surface it can sit on. No opacity-based dimming — it silently destroys
  contrast.
- **Keyboard:** palette open/filter/select/restore, review-queue `a`/`r`/`j`/`k`,
  table `j`/`k`/`Enter`, and stream pause are all covered by an automated
  Playwright flow.

## Engineering notes

**Batched rendering.** Stream events accumulate in a ref and flush once per
`requestAnimationFrame`. Arrival rate never drives render count — one render
per frame regardless of how fast events land.

**Bounded memory.** The log retains a fixed window of rows. A console left open
all day must not grow its DOM all day.

**SSE over WebSockets.** The data flows one way only, so a plain HTTP stream
gets reconnection and proxy tolerance for free, with no extra server.

**Cascade layers.** All bespoke CSS lives in `@layer base` / `@layer components`.
Unlayered CSS outranks *every* layered utility, so a stray `a { color: inherit }`
outside a layer will silently defeat utility colours — this codebase does not
leave that trap open.

**Unambiguous utilities.** Arbitrary colour values are written
`text-[color:var(--token)]`. Without the `color:` hint the value is ambiguous
with a font size and can be dropped without warning.

## Stack

Next.js 16 (App Router, server components) · React 19 · TypeScript (strict,
`noUncheckedIndexedAccess`) · Tailwind CSS 4 · Node.js route handlers

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run check:drafts # list unreviewed portfolio copy
```

## Editing the content

All copy lives in two files:

- `lib/profile.ts` — name, links, positioning, skills
- `lib/projects.ts` — one entry per project

Entries carrying `draft: true` were scaffolded from a project name only and
**must be rewritten before the site is shared**. `npm run check:drafts` lists
everything still outstanding.

## Deploying

Push to GitHub, import the repository at [vercel.com/new](https://vercel.com/new),
and accept the defaults — the framework, build command and output are all
detected. The SSE route needs a Node.js runtime, which is the default.
