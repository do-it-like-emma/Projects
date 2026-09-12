/**
 * Lists project entries still marked `draft: true` in lib/projects.ts, plus
 * any REPLACE placeholders left in the content files. Run before publishing.
 */
import { readFileSync } from "node:fs";

const files = ["lib/projects.ts", "lib/profile.ts"];
let issues = 0;

for (const file of files) {
  const text = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const lines = text.split("\n");

  lines.forEach((line, i) => {
    if (line.includes("REPLACE")) {
      issues++;
      console.log(`${file}:${i + 1}  ${line.trim().slice(0, 92)}`);
    }
  });

  // Count only real entries, not the mentions in the file header comment.
  const drafts = (text.match(/^\s+draft: true,$/gm) ?? []).length;
  if (drafts > 0) {
    console.log(`\n${file}: ${drafts} project(s) still marked draft: true`);
  }
}

if (issues === 0) {
  console.log("No placeholders left. Safe to publish.");
} else {
  console.log(`\n${issues} placeholder(s) to fill in before publishing.`);
}
