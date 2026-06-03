# Desi Reels

Ultra-fast single-page reels video website.

## Files

- `index.html` - Main website (CSS + JS inline)
- `sw.js` - Service worker (caches JSON for faster return visits)
- `videos-desi.json` - Desi catalog (~559 videos, loaded on first visit)
- `videos-scraped1-00.json` … `videos-scraped1-09.json` - Scraped catalog in 10 chunks (lazy-loaded)
- `videos-scraped2.json` - Second scraped source
- `videos-data.json` - Manifest (chunk count, IDs)
- `comments-pool.json`, `views-pool.json`, `likes-pool.json`, `shares-pool.json`, `titles-pool.json` - Dummy meta at runtime
- `seo-keywords-pool.json` - Small keyword list (~4 KB); app builds per-video SEO at runtime
- `seo-crawl.html` - Static HTML index of videos + comments + tags for crawlers
- `sitemap.xml` - Sitemap index (main + scraped1 chunks + scraped2)
- `manifest.json` - PWA manifest
- `robots.txt` - SEO robots file
- `sitemap.xml` - SEO sitemap (regenerate with build script)

## SEO build

After you change `videos-desi.json`, `videos-scraped2.json`, or `comments-pool.json`:

```bash
npm run build:seo
```

This updates:

- `sitemap.xml` — home, `seo-crawl.html`, and every `?v=id` URL (desi + scraped2)
- `seo-crawl.html` — full-text page for Google (not loaded by the app)
- Per-video meta in the app is computed in the browser from `comments-pool.json` + `seo-keywords-pool.json` (no large SEO JSON)

The live app also updates `document.title`, Open Graph tags, canonical URL, and VideoObject/Comment JSON-LD when you scroll or open `?v=123`.

## Deploy

GitHub Pages repo name:

```text
desi-xxx-shorts.github.io
```

Live URL:

```text
https://desi-xxx-shorts.github.io/
```

Upload every file in this folder to the repository root.

## Features

- Age verification popup
- Desi / All / New toggle (desi only, all sources shuffled, scraped-only)
- Like, Comment, Share, Download buttons
- Full video display (no cropping)
- Mobile-first responsive
- SEO optimized

## Ads Status

### Adsterra

Adsterra is integrated in `index.html`.

Publisher site:

```text
https://adsterra.com/
```

Status:

```text
Ad code added. Payment method still needs to be added in Adsterra dashboard.
```

### Magsrv / ExoClick Zone

Magsrv ad zone is integrated in `index.html`.

Zone ID:

```text
5934224
```

### JuicyAds

JuicyAds verification meta and ad zone are integrated in `index.html`.

Verification token:

```text
1caad5c8616f1c51f50a1cee2fe3c200
```

Ad zone:

```text
1118655
```

Account/payment settings:

```text
https://ux13.juicyads.com/drift.php?controller=accountSettings
```

Status:

```text
JuicyAds code added. Payment method is not added yet.
```

### MultiTag Banner 300x250

MultiTag banner script is integrated as an in-feed sponsored reel in `index.html`.

Ad serving domain:

```text
https://gargantuan-wedding.com/
```

### In-feed ad placement

Sponsored ad reels are inserted after every 5 video reels. Ad scripts are lazy-mounted only when the sponsored reel becomes visible, so ads do not run immediately on page load.

### TrafficStars

TrafficStars ad spot is created but not approved yet.

Ad spot setup URL:

```text
https://admin.trafficstars.com/publishers/inventory/spots/edit/?templateId=67
```

After approval, copy the final TrafficStars ad code or native/banner/direct link and integrate it into `index.html`.

Recommended formats for this site:

- Native ad between reels
- Banner as fallback

Avoid on GitHub Pages:

- Popunder
- Push
- Interstitial
- Full page redirect

**Pages source:** Deploy from a branch (`main` / `master`, folder `/`).

**One workflow only:** `.github/workflows/seo-on-deploy.yml` — on push it runs `npm run build:seo` and commits `sitemap*.xml`, `seo-crawl.html`, `seo-keywords-pool.json`. Enable **Settings → Actions → Workflow permissions → Read and write**.

You do **not** need `deploy-pages.yml` (that is for “GitHub Actions” as the Pages source, not branch deploy).

Manual SEO locally: `npm run build:seo`

### Video loading (no backend)

- **Desi tab (default):** only `videos-desi.json` (~9 KB gzipped).
- **New / All tabs:** loads `videos-scraped2.json` + first chunk only (~460 KB gzipped). More `videos-scraped1-XX.json` chunks load only when you scroll near the end (saves ~3.5 MB if you do not scroll far).
- **`sw.js`:** caches JSON on the device — repeat visits load lists much faster (often under ~0.1 s for cached desi data).
- Do not deploy a single `videos.json`; data is split to keep first load fast.
