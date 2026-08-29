const fs = require("fs");
const path = require("path");

const root = ".";
const ignoredDirs = new Set([
  ".git",
  "_site",
  "node_modules",
  "build",
  "electron",
]);

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    if (ignoredDirs.has(item)) continue;

    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
    } else if (full.endsWith(".md")) {
      convertFile(full);
    }
  }
}

function convertFile(file) {
  let text = fs.readFileSync(file, "utf8");
  text = text.replace(
    /^\[TOC\]\s*$/gm,
    '<div class="toc" markdown="1">\n* TOC\n{:toc}\n</div>',
  );
  fs.writeFileSync(file, text, "utf8");
}

walk(root);
