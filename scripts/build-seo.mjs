/**
 * SEO build: keywords from comments + niche terms, sitemaps, video index, crawl page.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://desi-xxx-shorts.github.io';
const TODAY = new Date().toISOString().slice(0, 10);
const MAX_KEYWORDS_META = 28;

const BASE_KEYWORDS = [
  'desi xxx', 'desi porn', 'desi sex', 'desi mms', 'desi nude', 'desi hot',
  'indian xxx', 'indian porn', 'indian sex video', 'indian mms', 'indian nude',
  'hindi xxx', 'hindi porn', 'hindi sex', 'hindi blue film', 'hindi chudai',
  'desi chudai', 'desi randi', 'desi bhabhi', 'desi aunty', 'desi girl',
  'viral mms', 'leaked mms', 'sex video', 'porn video', 'xxx video',
  'adult reels', 'hot reels', 'desi reels', 'desi shorts', 'short porn',
  'mobile porn', 'free porn india', 'desi viral video', 'onlyfans desi',
  'local xxx', 'gaon ki chudai', 'dehati sex', 'village porn', 'mast chut',
  'desi lund', 'gaand mar', 'bhabhi sex', 'college girl mms', 'office sex',
  'threesome desi', 'gangbang india', 'live sex chat', 'adult 18+'
];

const COMMENT_TERM_RE =
  /\b(chut|choot|bhosda|lund|loda|lode|gaand|gand|cuda|chod|chudai|chudwa|maal|muth|randi|bhabhi|devar|saas|nangi|nude|sexy|item|bobe|boobe|mume|anal|viral|mms|xxx|porn|gangbang|threesome|lesbian|ex\b|friend|saheli|kutiya|doggy|blowjob|handjob|creampie|facial|hardcore|amateur|desi|hindi|indian|dehati|gaon|village|leak|onlytik|shorts|reels|hot|spicy|tight|gili|pink|mast|faad|pel|pi le|chus)\b/gi;

function loadJson(name) {
  const file = path.join(ROOT, name);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function seoHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function stablePick(pool, seed, count) {
  return [...pool]
    .map((item, i) => ({ item, k: seoHash(`${seed}|${i}|${item}`) }))
    .sort((a, b) => a.k - b.k)
    .slice(0, count)
    .map((x) => x.item);
}

function truncate(text, max = 155) {
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extractTermsFromComments(comments) {
  const found = new Set();
  for (const c of comments) {
    const text = c.t || '';
    let m;
    COMMENT_TERM_RE.lastIndex = 0;
    while ((m = COMMENT_TERM_RE.exec(text)) !== null) {
      const w = m[0].toLowerCase().replace(/\s+/g, ' ');
      if (w.length > 2) found.add(w);
    }
  }
  return [...found];
}

function buildGlobalKeywordPool(boyPool, girlPool) {
  const fromComments = extractTermsFromComments([...boyPool, ...girlPool]);
  const phrases = new Set(BASE_KEYWORDS.map((k) => k.toLowerCase()));
  fromComments.forEach((t) => {
    phrases.add(t);
    phrases.add(`desi ${t}`);
    phrases.add(`${t} video`);
    phrases.add(`indian ${t}`);
  });
  return [...phrases].sort();
}

function buildVideoKeywords(videoId, comments, globalPool) {
  const fromVideo = extractTermsFromComments(comments);
  const picked = stablePick(globalPool, `kw-${videoId}`, 10);
  const merged = [...new Set([...fromVideo, ...picked, 'desi xxx', 'desi porn', 'xxx video'])]
    .slice(0, MAX_KEYWORDS_META);
  return merged;
}

function keywordsString(arr) {
  return arr.join(', ');
}

function buildDescription(video, comments, keywords) {
  const views = video.views || '';
  const likes = video.likes != null ? `${video.likes} likes` : '';
  const kw = keywords.slice(0, 4).join(', ');
  const bits = [
    `${video.title || 'Desi Reel'} — ${kw}`,
    views ? `${views} views` : '',
    likes,
    comments.length ? comments.map((c) => c.t).join(' ') : ''
  ].filter(Boolean);
  return truncate(bits.join('. '));
}

function buildSeoTitle(video) {
  const base = video.title || 'Desi XXX Reel';
  return `${base} | Desi XXX Porn Shorts`;
}

function assignVideoSeo(video, boyPool, girlPool, viewsPool, likesPool, globalKeywords) {
  const boys = stablePick(boyPool, `b-${video.id}`, 4);
  const girls = stablePick(girlPool, `g-${video.id}`, 4);
  const comments = [...boys, ...girls].sort(
    (a, b) => seoHash(`${video.id}|${a.u}`) - seoHash(`${video.id}|${b.u}`)
  );
  const views = viewsPool[seoHash(`v-${video.id}`) % viewsPool.length];
  const likes = likesPool[seoHash(`l-${video.id}`) % likesPool.length];
  const keywords = buildVideoKeywords(video.id, comments, globalKeywords);
  const title = buildSeoTitle(video);
  const description = buildDescription({ ...video, views, likes, title }, comments, keywords);
  return {
    id: video.id,
    title,
    pageTitle: title,
    description,
    keywords,
    keywordsText: keywordsString(keywords),
    views,
    likes,
    thumbnail: video.thumbnail || '',
    videoUrl: video.videoUrl || '',
    source: video.source || 'desi',
    comments: comments.map((c) => ({ u: c.u, t: c.t, from: c.from }))
  };
}

function writeUrlset(fileName, urls) {
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${escapeHtml(u.loc)}</loc>
    <lastmod>${u.lastmod || TODAY}</lastmod>
    <changefreq>${u.changefreq || 'weekly'}</changefreq>
    <priority>${u.priority ?? '0.6'}</priority>
  </url>`
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, fileName), xml);
  return urls.length;
}

function writeSitemapIndex(sitemapFiles) {
  const body = sitemapFiles
    .map(
      (f) => `  <sitemap>
    <loc>${escapeHtml(`${SITE}/${f}`)}</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>`
    )
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
}

function loadScraped1Videos() {
  const manifest = loadJson('videos-data.json');
  const chunks = manifest?.scraped1?.chunks ?? 10;
  const list = [];
  for (let i = 0; i < chunks; i++) {
    const chunk = loadJson(`videos-scraped1-${String(i).padStart(2, '0')}.json`);
    if (Array.isArray(chunk)) list.push(...chunk);
  }
  return list;
}

function collectSitemaps() {
  const main = [
    { loc: `${SITE}/`, changefreq: 'hourly', priority: '1.0' },
    { loc: `${SITE}/seo-crawl.html`, changefreq: 'daily', priority: '0.9' }
  ];

  const desi = loadJson('videos-desi.json') || [];
  desi.forEach((v) => {
    main.push({ loc: `${SITE}/?v=${v.id}`, changefreq: 'weekly', priority: '0.8' });
  });

  const scraped2 = loadJson('videos-scraped2.json') || [];
  const s2urls = scraped2.map((v) => ({
    loc: `${SITE}/?v=${v.id}`,
    changefreq: 'monthly',
    priority: '0.55'
  }));

  const scraped1 = loadScraped1Videos();
  const s1urls = scraped1.map((v) => ({
    loc: `${SITE}/?v=${v.id}`,
    changefreq: 'monthly',
    priority: '0.45'
  }));

  return { main, s2urls, s1urls, desi, scraped2, scraped1 };
}

function writeCrawlPage(entries, globalKeywords) {
  const kwMeta = keywordsString(globalKeywords.slice(0, 40));
  const items = entries
    .map(
      (e) => `    <article itemscope itemtype="https://schema.org/VideoObject">
      <h2 itemprop="name"><a href="/?v=${e.id}" itemprop="url">${escapeHtml(e.title)}</a></h2>
      <meta itemprop="keywords" content="${escapeHtml(e.keywordsText)}">
      <p itemprop="description">${escapeHtml(e.description)}</p>
      <p class="kw"><small>Tags: ${escapeHtml(e.keywordsText)}</small></p>
      <ul>
${e.comments.map((c) => `        <li><strong>${escapeHtml(c.u)}:</strong> ${escapeHtml(c.t)}</li>`).join('\n')}
      </ul>
    </article>`
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <meta name="rating" content="adult">
  <title>Desi XXX Porn Shorts — Video index, comments &amp; keywords</title>
  <meta name="description" content="Watch desi xxx, indian porn shorts and viral MMS reels. Browse videos with real viewer comments. 18+ only.">
  <meta name="keywords" content="${escapeHtml(kwMeta)}">
  <link rel="canonical" href="${SITE}/seo-crawl.html">
</head>
<body style="font-family:system-ui,sans-serif;max-width:52rem;margin:0 auto;padding:1rem;line-height:1.5;color:#111">
  <header>
    <h1>Desi XXX Porn Shorts — Videos &amp; comments</h1>
    <p>Indian desi xxx reels, porn shorts, MMS clips. <a href="/">Open reels app</a></p>
    <p><small>Keywords: ${escapeHtml(kwMeta)}</small></p>
  </header>
  <main>
${items}
  </main>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, 'seo-crawl.html'), html);
}

console.log('Building SEO assets...');

const commentsData = loadJson('comments-pool.json');
const boyPool = (commentsData?.comments || []).filter((c) => c.from === 'boy');
const girlPool = (commentsData?.comments || []).filter((c) => c.from === 'girl');
const viewsPool = loadJson('views-pool.json') || ['12.4K', '8.2K', '25K'];
const likesPool = loadJson('likes-pool.json') || [420, 890, 1200];

if (!boyPool.length || !girlPool.length) {
  console.error('Missing comments-pool.json');
  process.exit(1);
}

const globalKeywords = buildGlobalKeywordPool(boyPool, girlPool);
fs.writeFileSync(
  path.join(ROOT, 'seo-keywords-pool.json'),
  JSON.stringify({ site: globalKeywords, top: globalKeywords.slice(0, 60) }, null, 2)
);

const { main, s2urls, s1urls, desi, scraped2 } = collectSitemaps();

const sitemapFiles = [];
let totalUrls = 0;

totalUrls += writeUrlset('sitemap-main.xml', main);
sitemapFiles.push('sitemap-main.xml');

if (s2urls.length) {
  totalUrls += writeUrlset('sitemap-scraped2.xml', s2urls);
  sitemapFiles.push('sitemap-scraped2.xml');
}

const CHUNK = 45000;
for (let i = 0; i < s1urls.length; i += CHUNK) {
  const part = s1urls.slice(i, i + CHUNK);
  const name = `sitemap-scraped1-${String(i / CHUNK).padStart(2, '0')}.xml`;
  totalUrls += writeUrlset(name, part);
  sitemapFiles.push(name);
}

writeSitemapIndex(sitemapFiles);

// Crawl page only (not loaded by the app — keeps deploy size down).
const crawlEntries = [];
desi.forEach((video) => {
  crawlEntries.push(assignVideoSeo(video, boyPool, girlPool, viewsPool, likesPool, globalKeywords));
});
const scraped2Sample = scraped2
  .slice(0, 150)
  .map((video) => assignVideoSeo(video, boyPool, girlPool, viewsPool, likesPool, globalKeywords));
crawlEntries.sort((a, b) => a.id - b.id);
writeCrawlPage([...crawlEntries, ...scraped2Sample], globalKeywords);

console.log(`  seo-keywords-pool.json — ${globalKeywords.length} keywords (app loads ~4 KB)`);
console.log(`  seo-crawl.html — ${crawlEntries.length + scraped2Sample.length} articles (bots only, not preloaded)`);
console.log(`  sitemap index — ${sitemapFiles.length} parts, ${totalUrls} URLs total`);
console.log('  (no seo-video-index.json — per-video SEO is built in the browser from comments-pool)');
