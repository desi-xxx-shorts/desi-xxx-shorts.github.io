# Performance & video delivery guide

## CDN (byte-range / HTTP)

- Videos should be served with **`Accept-Ranges: bytes`** so seeks jump to `?t=` / scrubbed positions without downloading from 0.
- Prefer **HTTP/2 or HTTP/3** on the same host as thumbnails (`cdn.pmaal.com`) to reuse connections.
- Run locally: `node scripts/check-cdn-range.mjs` (HEAD request + range probe).

## Encoding (smaller MP4s)

- Target **720p** max for mobile reels; **H.264** + AAC.
- Example FFmpeg (adjust paths):

```bash
ffmpeg -i input.mp4 -vf "scale='min(720,iw)':-2" -c:v libx264 -preset slow -crf 23 -movflags +faststart -c:a aac -b:a 96k output.mp4
```

- **`+faststart`** moves metadata to the start so playback begins sooner.

## Adaptive streaming (HLS)

- Optional per video in JSON:

```json
{ "videoUrl": "https://cdn.../video.mp4", "hlsUrl": "https://cdn.../video.m3u8" }
```

- The app loads **hls.js** only when `hlsUrl` is present; otherwise MP4 is used.

## Catalog JSON

- Keep **chunked** lists (`videos-desi.json`, `videos-scraped1-XX.json`) — do not ship one giant `videos.json`.
- The app caches catalogs in **IndexedDB** + **service worker** for repeat visits.

## GitHub Pages limits

- No server-side transcoding; encoding and HLS packaging happen on your CDN/build machine before upload.
