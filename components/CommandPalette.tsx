"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { projects } from "@/lib/projects";
import { profile } from "@/lib/profile";

const OPEN_EVENT = "palette:open";

interface Command {
  id: string;
  label: string;
  group: string;
  hint?: string;
  run: (router: ReturnType<typeof useRouter>) => void;
}

function buildCommands(): Command[] {
  const navigate = (href: string) => (r: ReturnType<typeof useRouter>) =>
    r.push(href);

  const pages: Command[] = [
    { id: "nav-home", label: "Overview", group: "Navigate", run: navigate("/") },
    { id: "nav-work", label: "Work", group: "Navigate", run: navigate("/work") },
    {
      id: "nav-console",
      label: "Console demo",
      group: "Navigate",
      hint: "streaming + diff review",
      run: navigate("/console"),
    },
    {
      id: "nav-about",
      label: "About",
      group: "Navigate",
      run: navigate("/about"),
    },
  ];

  const projectCommands: Command[] = projects.map((p) => ({
    id: `project-${p.slug}`,
    label: p.name,
    group: "Projects",
    hint: p.kind,
    run: navigate(`/work/${p.slug}`),
  }));

  const links: Command[] = [
    {
      id: "link-github",
      label: "Open GitHub profile",
      group: "Links",
      run: () => window.open(profile.github, "_blank", "noopener,noreferrer"),
    },
    {
      id: "link-email",
      label: `Email ${profile.email}`,
      group: "Links",
      run: () => {
        window.location.href = `mailto:${profile.email}`;
      },
    },
  ];

  return [...pages, ...projectCommands, ...links];
}

/** Header affordance. Opens the palette without lifting state out of it. */
export function PaletteHint() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="hidden md:flex items-center gap-2 h-8 rounded border border-[var(--border)] px-2.5 text-[12px] text-[color:var(--text-muted)] hover:bg-[var(--bg-hover)] transition-colors"
    >
      <span>Search</span>
      <kbd className="mono rounded border border-[var(--border)] bg-[var(--bg-inset)] px-1.5 py-0.5 text-[11px]">
        ⌘K
      </kbd>
    </button>
  );
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // Where focus was before opening, so it can be handed back on close.
  const restoreRef = useRef<HTMLElement | null>(null);

  const listId = useId();
  const commands = useMemo(buildCommands, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q) ||
        (c.hint?.toLowerCase().includes(q) ?? false),
    );
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
    restoreRef.current?.focus();
  }, []);

  const openPalette = useCallback(() => {
    restoreRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  // Global shortcut + the header button's event.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const cmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (cmdK) {
        e.preventDefault();
        setOpen((wasOpen) => {
          if (wasOpen) return false;
          restoreRef.current = document.activeElement as HTMLElement | null;
          return true;
        });
      }
    }
    const onOpen = () => openPalette();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, [openPalette]);

  // Focus the input when it opens, and lock background scroll.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Keep the active row in view as the selection moves by keyboard.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      '[data-active="true"]',
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const runCommand = useCallback(
    (command: Command) => {
      close();
      command.run(router);
    },
    [close, router],
  );

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length === 0 ? 0 : (i + 1) % results.length));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) =>
        results.length === 0 ? 0 : (i - 1 + results.length) % results.length,
      );
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActive(Math.max(0, results.length - 1));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const command = results[active];
      if (command) runCommand(command);
    }
  }

  if (!open) return null;

  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/45"
        onClick={close}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="panel relative w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-[var(--border)] px-3">
          <span aria-hidden="true" className="text-[color:var(--text-faint)]">
            ⌕
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              results[active] ? `${listId}-${results[active].id}` : undefined
            }
            placeholder="Jump to a page or project…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            className="w-full bg-transparent py-3 text-[14px] outline-none placeholder:text-[color:var(--text-faint)]"
          />
          <kbd className="mono shrink-0 rounded border border-[var(--border)] bg-[var(--bg-inset)] px-1.5 py-0.5 text-[11px] text-[color:var(--text-faint)]">
            esc
          </kbd>
        </div>

        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Results"
          className="stream-scroll max-h-72 overflow-y-auto py-1"
        >
          {results.length === 0 && (
            <li role="presentation" className="px-3 py-6 text-center text-[13px] text-[color:var(--text-muted)]">
              No matches for “{query}”
            </li>
          )}

          {results.map((command, index) => {
            const showGroup = command.group !== lastGroup;
            lastGroup = command.group;
            const isActive = index === active;

            return (
              <li key={command.id} role="presentation">
                {showGroup && (
                  <p
                    aria-hidden="true"
                    className="px-3 pb-1 pt-3 text-[11px] uppercase tracking-wider text-[color:var(--text-faint)]"
                  >
                    {command.group}
                  </p>
                )}
                <div
                  id={`${listId}-${command.id}`}
                  role="option"
                  aria-selected={isActive}
                  data-active={isActive}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => runCommand(command)}
                  className={`mx-1 flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13.5px] ${
                    isActive ? "bg-[var(--bg-hover)]" : ""
                  }`}
                >
                  <span className="truncate">{command.label}</span>
                  {command.hint && (
                    <span className="mono ml-auto shrink-0 text-[11px] text-[color:var(--text-faint)]">
                      {command.hint}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3 border-t border-[var(--border)] bg-[var(--bg-inset)] px-3 py-2 text-[11px] text-[color:var(--text-faint)]">
          <span>
            <kbd className="mono">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="mono">↵</kbd> open
          </span>
          <span>
            <kbd className="mono">esc</kbd> close
          </span>
          <span className="ml-auto">
            {results.length} result{results.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}
