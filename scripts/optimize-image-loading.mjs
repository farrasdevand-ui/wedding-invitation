import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const { access, readFile, writeFile } = fs.promises;
const ROOT = process.cwd();

const LAZY_COMPONENTS = [
  "src/sections/Section4.jsx",
  "src/sections/Section5.jsx",
  "src/sections/Section6.jsx",
  "src/sections/Section7.jsx",
  "src/sections/Section8.jsx",
  "src/sections/Section9.jsx",
  "src/components/ReferenceDecorations.jsx",
];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function patchImageTag(tag) {
  let updated = tag;
  const attributes = [];

  if (!/\bloading\s*=/.test(updated)) {
    attributes.push('loading="lazy"');
  }

  if (!/\bdecoding\s*=/.test(updated)) {
    attributes.push('decoding="async"');
  }

  if (attributes.length === 0) {
    return updated;
  }

  updated = updated.replace(/^<img\b/, `<img ${attributes.join(" ")}`);

  return updated;
}

let changedTags = 0;
let changedFiles = 0;

for (const relativePath of LAZY_COMPONENTS) {
  const filePath = path.join(ROOT, relativePath);

  if (!(await exists(filePath))) {
    continue;
  }

  const original = await readFile(filePath, "utf8");

  const updated = original.replace(/<img\b[^>]*\/>/gs, (tag) => {
    const patched = patchImageTag(tag);

    if (patched !== tag) {
      changedTags += 1;
    }

    return patched;
  });

  if (updated !== original) {
    await writeFile(filePath, updated);
    changedFiles += 1;
    console.log(`[UPDATED] ${relativePath}`);
  }
}

const indexPath = path.join(ROOT, "index.html");
const coverPath = path.join(ROOT, "public/images/cover-bg.webp");

if ((await exists(indexPath)) && (await exists(coverPath))) {
  const originalIndex = await readFile(indexPath, "utf8");

  const preload =
    '<link rel="preload" as="image" ' +
    'href="/images/cover-bg.webp" ' +
    'fetchpriority="high" />';

  if (!originalIndex.includes(preload)) {
    const updatedIndex = originalIndex.replace(
      /<head>/,
      `<head>\n    ${preload}`,
    );

    await writeFile(indexPath, updatedIndex);

    console.log("[UPDATED] index.html cover image preload");
  }
}

console.log("");
console.log(`Lazy image tags updated: ${changedTags}`);
console.log(`Component files updated: ${changedFiles}`);
