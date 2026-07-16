# AG Social — agsocial.ca

Static marketing site for **AG Social by Wow Factor Media** — social media marketing for the Western Canadian Prairies.

## Stack
- Hand-authored HTML/CSS/JS (no framework)
- Tiny Node build step (`build.js`) that stitches shared partials + per-page bodies into clean-URL pages under `dist/`
- Deployed as a **static site** on DigitalOcean App Platform

## Develop
```bash
npm run build     # build into dist/
npm run serve     # build + serve dist/ at http://localhost:8099
```

## Structure
```
partials/    head, header, footer, scripts (shared across pages)
pages/       one file per page; each starts with a <!--meta {...} meta--> block
static/      sitemap.xml, robots.txt, 404.html, _redirects (copied to dist root)
assets/      logos, hero photos, team + advisor images
styles.css   design system + all components
script.js    nav, mobile menu, scroll reveal, advisor modal
build.js     the build system
.do/app.yaml DigitalOcean App Platform spec (redirects + catchall 404)
```

## Pages
`/` · `/services` · `/about` · `/testimonials` · `/contact` · `/privacy-policy` · `/careers`

Legacy redirects: `/privacypolicy → /privacy-policy`, `/job-opportunities → /careers`

## Deploy
Push to `main` → DigitalOcean App Platform rebuilds (`npm run build`, output `dist/`).
DNS remains at GoDaddy; point `agsocial.ca` at the App Platform app.
