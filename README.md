# Desi Reels

Ultra-fast single-page reels video website.

## Files

- `index.html` - Main website (CSS + JS inline)
- `videos.json` - Video data (585 videos)
- `manifest.json` - PWA manifest
- `robots.txt` - SEO robots file
- `sitemap.xml` - SEO sitemap

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
- Current / Most Viewed toggle
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

No build step needed. Just upload and go.
