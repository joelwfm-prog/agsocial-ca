# AG Social — Multi-Page Build Plan

## Decisions locked (2026-07-16)

- **Host**: DigitalOcean App Platform, static site tier (free)
- **Deploy source**: New GitHub repo, auto-deploy via App Platform
- **DNS**: Keep at GoDaddy, update A/CNAME records to point at DO
- **Owner accounts**: Joel's personal DO + GitHub
- **Pricing**: No published pricing; every service ends in "Book a Discovery Call" CTA
- **Case studies**: Not yet — testimonials only. Case studies + blog + FAQ post-launch.
- **Legal + careers**: Pull from current Squarespace, rewrite for clarity, preserve legal accuracy

## Pages to build

| Path | Notes |
|---|---|
| `/` | Trimmed homepage — front door driving to sub-pages |
| `/services` | Full 6-service breakdown, CTA per service |
| `/about` | Founder story, Patty + Ashley bios, team collage, advisory board (with modal) |
| `/testimonials` | All 4 testimonials expanded + trusted-by logos |
| `/contact` | Form + map + direct contact info |
| `/privacy-policy` | Rewritten from Squarespace |
| `/careers` | Rewritten from Squarespace, 3 open roles |

## Redirects to configure

- `/privacypolicy` → `/privacy-policy`
- `/job-opportunities` → `/careers`

Handled via App Platform `_redirects` file (Netlify-style syntax) or `redirects` block in `app.yaml`.

## Build system

Tiny Node build script (`build.js`) that:
1. Reads partials from `partials/` (`head.html`, `header.html`, `mobile-menu.html`, `footer.html`, `scripts.html`)
2. Reads page bodies from `pages/*.html`
3. Outputs to `dist/` with partials injected

Deploy target = `dist/` directory (static files only, no Node at runtime).

## Files staged so far

- `partials/` — empty, ready
- `pages/` — empty, ready
- `dist/` — empty, ready

## Content sources gathered

### Privacy policy (from https://agsocial.ca/privacypolicy, effective 2025-06-06)

Full text captured in this session. Key sections:
1. Info we collect (name/email/phone/inquiry details)
2. Facebook remarketing / Pixel
3. Cookies & tracking
4. Data security
5. Third-party links
6. Your rights (access/correct/delete)
7. Contact: AG Social, 101 53 Stadacona St W, Moose Jaw SK S6H 1Z2 · ashley.drummond@wowfactormedia.ca · 306-694-1556

### Careers (from https://agsocial.ca/job-opportunities)

Three open roles, all permanent full-time, remote for SK/AB/MB residents:

1. **Agriculture Social Media Strategist** — strong content marketing skills, project mgmt, formal marketing education, ag industry experience
2. **Agronomy Marketing Specialist** — agronomic expertise contributing to social media content creation
3. **Digital Advertising Strategist** — social media advertising training, campaign development/optimization across platforms

## Meta/SEO plan (per-page)

Each page gets:
- Unique `<title>` and `<meta description>`
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URL
- JSON-LD structured data (LocalBusiness on home, Service on /services, Organization site-wide, JobPosting on /careers)

## Site-wide additions

- `sitemap.xml` (all 7 pages)
- `robots.txt` (allow all, reference sitemap)
- `_redirects` (Netlify-style) for legacy paths
- `404.html` (branded, links back home)
