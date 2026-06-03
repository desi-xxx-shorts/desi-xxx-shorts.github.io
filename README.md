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
- `.github/workflows/seo-on-deploy.yml` - Auto-runs `build:seo` on push

## SEO (automatic)

On push to `main`, the workflow runs `npm run build:seo` and commits `sitemap*.xml`, `seo-crawl.html`, `seo-keywords-pool.json`.

Manual: `npm run build:seo`

Per-video meta in the app is built in the browser from `comments-pool.json` (no large SEO JSON download).

## Local testing

From the project folder:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (use this URL, not `file://`, so JSON catalogs load).

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

**GitHub Pages:** branch `main`, folder `/`.

**Actions:** Settings → Actions → General → **Read and write** workflow permissions (required for auto SEO commits).

**Contributions:** Commits use `gk74601234@gmail.com` — verify that email on the desi-xxx-shorts account.

### Video loading (no backend)

- **Desi tab (default):** only `videos-desi.json` (~9 KB gzipped).
- **New / All tabs:** loads `videos-scraped2.json` + first chunk only (~460 KB gzipped). More `videos-scraped1-XX.json` chunks load only when you scroll near the end (saves ~3.5 MB if you do not scroll far).
- **`sw.js`:** caches JSON on the device — repeat visits load lists much faster (often under ~0.1 s for cached desi data).
- **IndexedDB:** catalogs are also stored locally for offline-fast reloads.
- Do not deploy a single `videos.json`; data is split to keep first load fast.

### App features (playback)

- **Resume position** when swiping back (session + `localStorage`).
- **Share / URL** with timestamp: `?v=123&t=45`.
- **Low data** button (top-left 📉): disables preloading.
- **Double-tap center** = like; **double-tap sides** = ±10s seek.
- **Keyboard:** ↑/↓ or J/K = next/prev reel, Space = pause/play.
- **Failed videos:** retry once (same signed URL), then show “Video not found” and auto-skip to next reel.
- **HLS** optional via `hlsUrl` in catalog (see `docs/PERFORMANCE.md`).
- **Google Form analytics:** one `site_entry` submit per browser tab session (first app load only).

### CDN / encoding

See [docs/PERFORMANCE.md](docs/PERFORMANCE.md). Check range support: `npm run check:cdn`.
