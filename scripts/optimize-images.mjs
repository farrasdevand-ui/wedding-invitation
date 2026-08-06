import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const { access, mkdir, readFile, readdir, rename, rm, stat, writeFile } =
  fs.promises;

const ROOT = process.cwd();

const SCAN_ROOTS = [path.join(ROOT, "src"), path.join(ROOT, "public")];

const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".vite",
  "coverage",
  "dist",
  "node_modules",
]);

const RASTER_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);

const TEXT_EXTENSIONS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".css",
  ".scss",
  ".sass",
  ".html",
  ".json",
  ".md",
]);

const COMPATIBILITY_EXCLUSION =
  /(^|[/\\])(favicon|apple-touch-icon|android-chrome|mstile|og-image|open-graph|social-preview)/i;

const mode = process.argv.includes("--apply") ? "apply" : "audit";

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

function percentageSaved(before, after) {
  if (!before) {
    return 0;
  }

  return ((before - after) / before) * 100;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function shouldIgnore(filePath) {
  const relative = path.relative(ROOT, filePath);

  return relative
    .split(path.sep)
    .some((segment) => IGNORED_DIRECTORIES.has(segment));
}

async function walk(directory) {
  if (!(await exists(directory))) {
    return [];
  }

  const output = [];
  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (shouldIgnore(fullPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      output.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile()) {
      output.push(fullPath);
    }
  }

  return output;
}

async function getRasterFiles() {
  const allFiles = [];

  for (const scanRoot of SCAN_ROOTS) {
    allFiles.push(...(await walk(scanRoot)));
  }

  return allFiles.filter((filePath) =>
    RASTER_EXTENSIONS.has(path.extname(filePath).toLowerCase()),
  );
}

async function getTextFiles() {
  const projectFiles = await walk(ROOT);

  return projectFiles.filter((filePath) =>
    TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase()),
  );
}

async function inspectRaster(filePath) {
  const fileStat = await stat(filePath);
  const metadata = await sharp(filePath).metadata();

  return {
    absolutePath: filePath,
    path: toPosix(path.relative(ROOT, filePath)),
    bytes: fileStat.size,
    width: metadata.width ?? null,
    height: metadata.height ?? null,
    format: metadata.format ?? null,
    hasAlpha: Boolean(metadata.hasAlpha),
    pages: metadata.pages ?? 1,
    excluded: COMPATIBILITY_EXCLUSION.test(
      toPosix(path.relative(ROOT, filePath)),
    ),
  };
}

async function audit() {
  const rasterFiles = await getRasterFiles();
  const inspected = [];
  const failures = [];

  for (const filePath of rasterFiles) {
    try {
      inspected.push(await inspectRaster(filePath));
    } catch (error) {
      failures.push({
        path: toPosix(path.relative(ROOT, filePath)),
        error: error.message,
      });
    }
  }

  inspected.sort((left, right) => right.bytes - left.bytes);

  const eligible = inspected.filter(
    (image) => !image.excluded && image.pages <= 1,
  );

  const excluded = inspected.filter(
    (image) => image.excluded || image.pages > 1,
  );

  const totalBytes = eligible.reduce((total, image) => total + image.bytes, 0);

  console.log("\n===== IMAGE AUDIT =====\n");

  console.table(
    eligible.map((image) => ({
      file: image.path,
      size: formatBytes(image.bytes),
      dimension:
        image.width && image.height ? `${image.width}x${image.height}` : "-",
      alpha: image.hasAlpha ? "yes" : "no",
    })),
  );

  console.log(`Eligible images : ${eligible.length}`);
  console.log(`Current size    : ${formatBytes(totalBytes)}`);
  console.log(`Excluded images : ${excluded.length}`);
  console.log(`Read failures   : ${failures.length}`);

  if (excluded.length > 0) {
    console.log("\nCompatibility/animated exclusions:");

    for (const image of excluded) {
      console.log(`- ${image.path}`);
    }
  }

  if (failures.length > 0) {
    console.log("\nUnreadable images:");

    for (const failure of failures) {
      console.log(`- ${failure.path}: ${failure.error}`);
    }

    process.exitCode = 1;
  }
}

function getWebpOptions(metadata, extension) {
  const hasAlpha = Boolean(metadata.hasAlpha);
  const isPhoto = extension === ".jpg" || extension === ".jpeg";

  return {
    quality: hasAlpha ? 88 : isPhoto ? 82 : 84,
    alphaQuality: 100,
    effort: 6,
    smartSubsample: true,
    exact: hasAlpha,
    preset: hasAlpha ? "drawing" : isPhoto ? "photo" : "picture",
  };
}

async function convertImage(sourcePath) {
  const extension = path.extname(sourcePath).toLowerCase();

  const outputPath = sourcePath.slice(0, -extension.length) + ".webp";

  const temporaryPath = `${outputPath}.tmp-${process.pid}`;

  const sourceStat = await stat(sourcePath);
  const metadata = await sharp(sourcePath).metadata();

  if ((metadata.pages ?? 1) > 1) {
    return {
      status: "skipped-animated",
      sourcePath,
    };
  }

  if (COMPATIBILITY_EXCLUSION.test(toPosix(path.relative(ROOT, sourcePath)))) {
    return {
      status: "skipped-compatibility",
      sourcePath,
    };
  }

  await mkdir(path.dirname(outputPath), {
    recursive: true,
  });

  await sharp(sourcePath, {
    failOn: "warning",
  })
    .rotate()
    .webp(getWebpOptions(metadata, extension))
    .toFile(temporaryPath);

  const temporaryStat = await stat(temporaryPath);
  let outputSize = temporaryStat.size;
  let keptExisting = false;

  if (await exists(outputPath)) {
    const existingStat = await stat(outputPath);

    if (existingStat.size <= temporaryStat.size) {
      await rm(temporaryPath, {
        force: true,
      });

      outputSize = existingStat.size;
      keptExisting = true;
    } else {
      await rm(outputPath, {
        force: true,
      });

      await rename(temporaryPath, outputPath);
    }
  } else {
    await rename(temporaryPath, outputPath);
  }

  return {
    status: "converted",
    sourcePath,
    outputPath,
    sourceSize: sourceStat.size,
    outputSize,
    keptExisting,
  };
}

async function replaceReferences(conversions) {
  const textFiles = await getTextFiles();

  const replacements = new Map();

  for (const conversion of conversions) {
    const oldName = path.basename(conversion.sourcePath);

    const newName = path.basename(conversion.outputPath);

    replacements.set(oldName, newName);
  }

  let changedFiles = 0;

  for (const textFile of textFiles) {
    let content;

    try {
      content = await readFile(textFile, "utf8");
    } catch {
      continue;
    }

    let updated = content;

    for (const [oldName, newName] of replacements) {
      updated = updated.split(oldName).join(newName);
    }

    if (updated !== content) {
      await writeFile(textFile, updated);
      changedFiles += 1;
    }
  }

  return changedFiles;
}

async function ensureNoSourceReferences(conversions) {
  const textFiles = await getTextFiles();
  const unresolved = [];

  for (const textFile of textFiles) {
    let content;

    try {
      content = await readFile(textFile, "utf8");
    } catch {
      continue;
    }

    for (const conversion of conversions) {
      const oldName = path.basename(conversion.sourcePath);

      if (content.includes(oldName)) {
        unresolved.push({
          file: toPosix(path.relative(ROOT, textFile)),
          reference: oldName,
        });
      }
    }
  }

  return unresolved;
}

async function apply() {
  const rasterFiles = await getRasterFiles();
  const targets = new Map();

  for (const sourcePath of rasterFiles) {
    const extension = path.extname(sourcePath).toLowerCase();

    const outputPath = sourcePath.slice(0, -extension.length) + ".webp";

    const existingSource = targets.get(outputPath);

    if (existingSource && existingSource !== sourcePath) {
      throw new Error(
        ["WebP target collision:", existingSource, sourcePath, outputPath].join(
          "\n",
        ),
      );
    }

    targets.set(outputPath, sourcePath);
  }

  const results = [];

  console.log("\n===== CONVERTING TO WEBP =====\n");

  for (const sourcePath of rasterFiles) {
    const result = await convertImage(sourcePath);
    results.push(result);

    const relativeSource = toPosix(path.relative(ROOT, sourcePath));

    if (result.status !== "converted") {
      console.log(`[SKIP] ${relativeSource} (${result.status})`);
      continue;
    }

    const relativeOutput = toPosix(path.relative(ROOT, result.outputPath));

    const saved = percentageSaved(result.sourceSize, result.outputSize);

    console.log(`[WEBP] ${relativeSource} -> ${relativeOutput}`);

    console.log(
      `       ${formatBytes(result.sourceSize)} -> ` +
        `${formatBytes(result.outputSize)} ` +
        `(${saved.toFixed(1)}% saved)` +
        (result.keptExisting ? " [existing WebP kept]" : ""),
    );
  }

  const conversions = results.filter((result) => result.status === "converted");

  console.log("\n===== UPDATING REFERENCES =====\n");

  const changedFiles = await replaceReferences(conversions);

  console.log(`Text/code files updated: ${changedFiles}`);

  const unresolved = await ensureNoSourceReferences(conversions);

  if (unresolved.length > 0) {
    console.error("\n[ERROR] Old raster references remain:");

    console.table(unresolved);

    process.exitCode = 1;
    return;
  }

  console.log("\n===== REMOVING ORIGINALS =====\n");

  for (const conversion of conversions) {
    await rm(conversion.sourcePath, {
      force: true,
    });

    console.log(
      `[REMOVED] ${toPosix(path.relative(ROOT, conversion.sourcePath))}`,
    );
  }

  const totalBefore = conversions.reduce(
    (total, item) => total + item.sourceSize,
    0,
  );

  const totalAfter = conversions.reduce(
    (total, item) => total + item.outputSize,
    0,
  );

  const report = {
    generatedAt: new Date().toISOString(),
    converted: conversions.length,
    beforeBytes: totalBefore,
    afterBytes: totalAfter,
    savedBytes: totalBefore - totalAfter,
    savedPercent: percentageSaved(totalBefore, totalAfter),
    files: conversions.map((item) => ({
      from: toPosix(path.relative(ROOT, item.sourcePath)),
      to: toPosix(path.relative(ROOT, item.outputPath)),
      beforeBytes: item.sourceSize,
      afterBytes: item.outputSize,
    })),
  };

  const timestamp = new Date()
    .toISOString()
    .replaceAll(":", "-")
    .replaceAll(".", "-");

  const reportPath = `/tmp/wedding-image-optimization-${timestamp}.json`;

  await writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log("\n===== IMAGE OPTIMIZATION SUMMARY =====\n");
  console.log(`Converted : ${conversions.length}`);
  console.log(`Before    : ${formatBytes(totalBefore)}`);
  console.log(`After     : ${formatBytes(totalAfter)}`);
  console.log(`Saved     : ${formatBytes(totalBefore - totalAfter)}`);
  console.log(`Reduction : ${report.savedPercent.toFixed(1)}%`);
  console.log(`Report    : ${reportPath}`);
}

try {
  if (mode === "apply") {
    await apply();
  } else {
    await audit();
  }
} catch (error) {
  console.error("\n[IMAGE OPTIMIZER ERROR]");
  console.error(error);
  process.exitCode = 1;
}
