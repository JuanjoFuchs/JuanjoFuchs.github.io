#!/usr/bin/env node
/**
 * Tell IndexNow a URL is new, so Bing picks up a post the day it goes live.
 *
 * WHY THIS EXISTS
 * Copilot and DuckDuckGo answer from Bing's index, and Bing found the blog
 * through a sitemap it re-reads on its own schedule. IndexNow is the push
 * channel: one POST and Bing (plus Yandex, Seznam, Naver, Yep) knows the URL
 * now instead of whenever the sitemap is next crawled.
 *
 * THE KEY
 * IndexNow proves you own the host by fetching a key file from it. The key is
 * not a secret: it is served publicly at the site root as <key>.txt, so it
 * lives in this file and in the repo rather than in a repository secret.
 *
 * Usage:
 *   node scripts/ping-indexnow.js <url> [<url> ...] [--dry-run]
 *
 * --dry-run prints the request and checks the key file is reachable, but
 * submits nothing.
 *
 * Env:
 *   SITE_URL   defaults to https://juanjofuchs.com
 */

const KEY = '5cef301afed58074073b031cd89749f9';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const SITE_URL = (process.env.SITE_URL || 'https://juanjofuchs.com').replace(/\/$/, '');

// What each documented status means, so a failure log says what to do next
// instead of a bare number.
const STATUS = {
  200: 'OK, URL submitted',
  202: 'Accepted, key validation pending',
  400: 'Bad request, the payload is malformed',
  403: 'Key not valid, the key file is missing or does not match',
  422: 'URL does not belong to the host, or the key does not match the schema',
  429: 'Too many requests',
};

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const urls = args.filter((a) => !a.startsWith('--'));

  if (urls.length === 0) {
    console.error('Usage: node scripts/ping-indexnow.js <url> [<url> ...] [--dry-run]');
    process.exit(2);
  }

  const host = new URL(SITE_URL).host;
  const foreign = urls.filter((u) => new URL(u).host !== host);
  if (foreign.length) {
    // IndexNow rejects the whole batch with a 422 when one URL is off-host.
    console.error(`::error::Not on ${host}: ${foreign.join(', ')}`);
    process.exit(2);
  }

  const keyLocation = `${SITE_URL}/${KEY}.txt`;
  const body = { host, key: KEY, keyLocation, urlList: urls };

  console.log(`Endpoint: ${ENDPOINT}`);
  console.log(`Payload:  ${JSON.stringify(body)}`);

  if (dryRun) {
    // The one thing a dry run can check without submitting: whether the key
    // file is live. Before the first deploy it 404s, and a real ping would 403.
    const res = await fetch(keyLocation);
    const served = res.ok ? (await res.text()).trim() : '';
    const keyOk = served === KEY;
    console.log(`Key file: ${keyLocation} -> HTTP ${res.status}${keyOk ? ', matches' : ', NOT serving the key yet'}`);
    console.log('\n--- dry run, nothing submitted ---');
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });

  const meaning = STATUS[res.status] || 'unexpected status';
  if (res.status === 200 || res.status === 202) {
    console.log(`IndexNow: HTTP ${res.status}, ${meaning}`);
    return;
  }

  const text = await res.text();
  console.error(`::error::IndexNow failed (HTTP ${res.status}, ${meaning}): ${text.slice(0, 400)}`);
  process.exit(1);
}

main().catch((err) => {
  console.error(`::error::${err.message}`);
  process.exit(1);
});
