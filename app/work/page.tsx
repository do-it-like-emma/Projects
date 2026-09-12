import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import { ProjectTable } from "@/components/ProjectTable";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects, systems and interfaces I have built.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
        Work
      </h1>
      <p className="mt-2 max-w-2xl text-[14.5px] text-[color:var(--text-muted)]">
        Sort any column, filter by type or stack, and move through rows with{" "}
        <kbd className="mono">↑</kbd>/<kbd className="mono">↓</kbd> or{" "}
        <kbd className="mono">j</kbd>/<kbd className="mono">k</kbd>. Press{" "}
        <kbd className="mono">Enter</kbd> to open the highlighted project.
      </p>

      <div className="mt-8">
        <ProjectTable projects={projects} />
      </div>
    </div>
  );
}
