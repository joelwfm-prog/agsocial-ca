#!/usr/bin/env node
/**
 * AG Social static-site build.
 *
 * Stitches shared partials (head / header / footer / scripts) around each
 * page body in pages/ and writes standalone HTML into dist/.
 *
 * Each page file in pages/ begins with an HTML-comment meta block, e.g.:
 *
 *   <!--meta
 *   { "slug": "services",
 *     "title": "Services — AG Social",
 *     "description": "...",
 *     "nav": "services",
 *     "ogType": "website",
 *     "jsonld": { ...schema.org object... } }
 *   meta-->
 *
 * Then the page body markup. The meta block is stripped from output.
 *
 * Output layout (clean URLs for DO App Platform):
 *   /            -> dist/index.html
 *   /services    -> dist/services/index.html
 *   ...etc
 *
 * Static assets (styles.css, script.js, assets/) are copied verbatim,
 * plus sitemap.xml, robots.txt, _redirects, 404.html.
 */

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PARTIALS = path.join(ROOT, "partials");
const PAGES = path.join(ROOT, "pages");
const DIST = path.join(ROOT, "dist");
const STATIC = path.join(ROOT, "static"); // sitemap, robots, redirects, 404 source

const SITE = "https://agsocial.ca";
const YEAR = new Date().getFullYear();

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// ---- Load partials ----
const headTpl = read(path.join(PARTIALS, "head.html"));
const headerTpl = read(path.join(PARTIALS, "header.html"));
const footerTpl = read(path.join(PARTIALS, "footer.html"));
const scriptsTpl = read(path.join(PARTIALS, "scripts.html"));

// ---- Parse a page file into { meta, body } ----
function parsePage(raw) {
  const m = raw.match(/<!--meta([\s\S]*?)meta-->/);
  if (!m) throw new Error("Page missing <!--meta ... meta--> block");
  const meta = JSON.parse(m[1].trim());
  const body = raw.slice(m.index + m[0].length).trim();
  return { meta, body };
}

// ---- Build the <head> for a page ----
function buildHead(meta) {
  const canonical =
    meta.slug === "" || meta.slug === "index"
      ? `${SITE}/`
      : `${SITE}/${meta.slug}`;
  const jsonld = meta.jsonld
    ? `<script type="application/ld+json">\n${JSON.stringify(
        meta.jsonld,
        null,
        2
      )}\n</script>`
    : "";
  return headTpl
    .replaceAll("{{TITLE}}", meta.title)
    .replaceAll("{{DESCRIPTION}}", meta.description)
    .replaceAll("{{CANONICAL}}", canonical)
    .replaceAll("{{OG_TYPE}}", meta.ogType || "website")
    .replace("{{PAGE_JSONLD}}", jsonld);
}

// ---- Build header with active nav state ----
function buildHeader(meta) {
  const keys = ["services", "about", "testimonials", "careers", "contact"];
  let out = headerTpl;
  for (const k of keys) {
    const token = `{{NAV_${k.toUpperCase()}}}`;
    out = out.replace(token, meta.nav === k ? ' class="active" aria-current="page"' : "");
  }
  return out;
}

function buildFooter() {
  return footerTpl.replaceAll("{{YEAR}}", String(YEAR));
}

// ---- Assemble a full page ----
function assemble(meta, body) {
  return [buildHead(meta), buildHeader(meta), body, buildFooter(), scriptsTpl].join(
    "\n"
  );
}

// ---- Write to the right dist location (clean URLs) ----
function outPath(slug) {
  if (slug === "" || slug === "index") return path.join(DIST, "index.html");
  return path.join(DIST, slug, "index.html");
}

// ===== RUN =====
rmrf(DIST);
fs.mkdirSync(DIST, { recursive: true });

// 1) Pages
const pageFiles = fs.readdirSync(PAGES).filter((f) => f.endsWith(".html"));
const built = [];
for (const file of pageFiles) {
  const { meta, body } = parsePage(read(path.join(PAGES, file)));
  const html = assemble(meta, body);
  const dest = outPath(meta.slug);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  built.push(meta.slug === "" ? "/" : `/${meta.slug}`);
}

// 2) Static assets
fs.copyFileSync(path.join(ROOT, "styles.css"), path.join(DIST, "styles.css"));
fs.copyFileSync(path.join(ROOT, "script.js"), path.join(DIST, "script.js"));
copyDir(path.join(ROOT, "assets"), path.join(DIST, "assets"));

// 3) Root-level files (sitemap, robots, redirects, 404) from static/
if (fs.existsSync(STATIC)) {
  for (const f of fs.readdirSync(STATIC)) {
    const src = path.join(STATIC, f);
    if (f === "404.html") {
      // 404 gets partials too if it has a meta block, else copied verbatim
      const raw = read(src);
      if (raw.includes("<!--meta")) {
        const { meta, body } = parsePage(raw);
        fs.writeFileSync(path.join(DIST, "404.html"), assemble(meta, body));
      } else {
        fs.copyFileSync(src, path.join(DIST, f));
      }
    } else {
      fs.copyFileSync(src, path.join(DIST, f));
    }
  }
}

console.log("Built pages:", built.sort().join(", "));
console.log("Output:", DIST);
