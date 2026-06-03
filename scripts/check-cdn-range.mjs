#!/usr/bin/env node
/**
 * Checks whether the sample video CDN supports byte-range requests.
 * Usage: node scripts/check-cdn-range.mjs [video-url]
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

const fallback = 'https://cdn.pmaal.com/Shorts/Video6701.mp4';
let url = process.argv[2];

if (!url) {
  try {
    const raw = readFileSync(resolve('videos-desi.json'), 'utf8');
    const list = JSON.parse(raw);
    url = list[0]?.videoUrl || fallback;
  } catch {
    url = fallback;
  }
}

console.log('Checking:', url);

const head = await fetch(url, { method: 'HEAD' });
console.log('HEAD status:', head.status);
console.log('Accept-Ranges:', head.headers.get('accept-ranges') || '(missing)');
console.log('Content-Length:', head.headers.get('content-length') || '(unknown)');

const range = await fetch(url, {
  headers: { Range: 'bytes=0-1023' }
});
console.log('Range GET status:', range.status, range.status === 206 ? '(OK partial)' : '');
const cr = range.headers.get('content-range');
console.log('Content-Range:', cr || '(missing)');

if (range.status !== 206 && !cr) {
  console.warn('Range requests may not work — seeks can be slower.');
  process.exit(1);
}
console.log('Byte-range support looks good.');
