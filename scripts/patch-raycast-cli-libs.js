/*
 * Workaround for a bug in @raycast/api 2.x.
 *
 * `ray build` / `ray develop` extract each AI tool's JSON schema from its `Input`
 * type. The extractor bundles the TypeScript compiler into the CLI's own command
 * bundles, and TypeScript resolves `lib.*.d.ts` relative to the executing file.
 * No lib files ship in those directories, so the extractor's program has no
 * standard library: the global `Array` type cannot be resolved, every array-typed
 * tool input comes back as the error type with no `symbol`, and the extractor
 * throws "Cannot read properties of undefined (reading 'flags')".
 *
 * Copying the project's own TypeScript lib files next to each CLI bundle makes
 * the extractor resolve `Array` again. Delete this script and its `postinstall`
 * hook once upstream ships a fix.
 */
const fs = require("node:fs");
const path = require("path");

function libSourceDir() {
  try {
    return path.join(path.dirname(require.resolve("typescript/package.json")), "lib");
  } catch {
    return undefined;
  }
}

/** A bundle that embeds the extractor throws this; only those directories need lib files. */
const MARKER = "No item type";

function embedsExtractor(file) {
  try {
    return fs.readFileSync(file, "utf8").includes(MARKER);
  } catch {
    return false;
  }
}

/** Every CLI bundle that embeds the extractor, since each resolves libs next to itself. */
function targetDirs(apiDist) {
  const candidates = [];
  const utils = path.join(apiDist, "utils");
  if (fs.existsSync(utils)) {
    for (const name of fs.readdirSync(utils)) {
      if (name.endsWith(".js")) candidates.push(path.join(utils, name));
    }
  }
  const commands = path.join(apiDist, "commands");
  if (fs.existsSync(commands)) {
    for (const entry of fs.readdirSync(commands, { withFileTypes: true })) {
      if (entry.isDirectory()) candidates.push(path.join(commands, entry.name, "index.js"));
    }
  }
  return [...new Set(candidates.filter(embedsExtractor).map((file) => path.dirname(file)))];
}

function main() {
  const src = libSourceDir();
  if (!src || !fs.existsSync(src)) return;

  let apiDist;
  try {
    apiDist = path.join(path.dirname(require.resolve("@raycast/api/package.json")), "dist");
  } catch {
    return;
  }
  if (!fs.existsSync(apiDist)) return;

  const libs = fs.readdirSync(src).filter((name) => name.startsWith("lib.") && name.endsWith(".d.ts"));
  if (libs.length === 0) return;

  let copied = 0;
  for (const dir of targetDirs(apiDist)) {
    for (const lib of libs) {
      const dest = path.join(dir, lib);
      if (fs.existsSync(dest)) continue;
      fs.copyFileSync(path.join(src, lib), dest);
      copied++;
    }
  }
  if (copied > 0) {
    console.log(`patched Raycast CLI with ${libs.length} TypeScript lib files (${copied} copied)`);
  }
}

main();
