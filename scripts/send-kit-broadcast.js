#!/usr/bin/env node
/**
 * Email a published post to the Kit list.
 *
 * WHY THIS EXISTS
 * Kit's own RSS-to-email campaigns are a paid feature. The broadcasts API is
 * not, and this blog already has a workflow that fires when a post goes live,
 * so the email is sent from there instead. Same outcome, no subscription.
 *
 * IDEMPOTENCE
 * Mirrors the PUBLISHED: markers the LinkedIn and X posters use. A KIT_SENT:
 * timestamp goes into the post's social comment block after a successful send,
 * and a post that already carries one is skipped. Re-running the workflow is
 * therefore safe, which matters because the recovery procedure for a failed
 * LinkedIn token is "re-run the whole job".
 *
 * Usage:
 *   node scripts/send-kit-broadcast.js <path-to-post.md> [--dry-run]
 *
 * Env:
 *   KIT_API_KEY   v4 API key (repo secret)
 *   SITE_URL      defaults to https://juanjofuchs.com
 */

// scripts/package.json sets "type": "module", so this file is ESM like its
// siblings.
import fs from 'node:fs';
import path from 'node:path';

const API = 'https://api.kit.com/v4/broadcasts';
const SITE_URL = (process.env.SITE_URL || 'https://juanjofuchs.com').replace(/\/$/, '');

function parseFrontMatter(raw) {
  // Jekyll front matter is the first --- delimited block. Deliberately a small
  // hand parser rather than a YAML dependency: this file only ever reads four
  // scalar fields, and the repo's other scripts do the same.
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('No Jekyll front matter found');
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
  }
  return fm;
}

function postUrl(file, fm) {
  const name = path.basename(file, '.md');
  const dateMatch = name.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (!dateMatch) throw new Error(`Unexpected post filename: ${name}`);
  const [, y, m, d, slug] = dateMatch;
  const categories = (fm.categories || '').split(/[\s,]+/).filter(Boolean);
  const categoryPath = categories.length ? `${categories.join('/')}/` : '';
  return `${SITE_URL}/${categoryPath}${y}/${m}/${d}/${slug}.html`;
}

function alreadySent(raw) {
  return /KIT_SENT:\s*\d{4}-\d{2}-\d{2}T/i.test(raw);
}

function markSent(file, raw) {
  const stamp = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
  // Sits just inside the social comment block, beside the other markers.
  const updated = raw.replace(
    /(\{%\s*comment\s*%\}\s*\r?\n)/,
    `$1KIT_SENT: ${stamp}\n`
  );
  if (updated === raw) {
    console.warn('  ! could not write KIT_SENT marker (no {% comment %} block)');
    return;
  }
  fs.writeFileSync(file, updated);
  console.log(`  marked KIT_SENT: ${stamp}`);
}

function buildEmail(fm, url) {
  const title = fm.title || 'New post';
  const description = fm.description || '';
  const image = fm.image ? `${SITE_URL}${fm.image}` : null;

  // Deliberately plain HTML. Kit wraps it in the account template, and every
  // clever layout is one more thing to render wrong in Outlook.
  const parts = [];
  parts.push(`<p>${description}</p>`);
  if (image) {
    parts.push(
      `<p><a href="${url}"><img src="${image}" alt="" style="max-width:100%;height:auto;"></a></p>`
    );
  }
  parts.push(`<p><a href="${url}">Read it on the blog</a></p>`);
  parts.push('<p>JJ</p>');

  return {
    subject: title,
    preview_text: description.slice(0, 140),
    description: `Weekly post: ${title}`,
    content: parts.join('\n'),
  };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const file = args.find((a) => !a.startsWith('--'));

  if (!file) {
    console.error('Usage: node scripts/send-kit-broadcast.js <post.md> [--dry-run]');
    process.exit(2);
  }

  const raw = fs.readFileSync(file, 'utf8');
  const fm = parseFrontMatter(raw);
  const url = postUrl(file, fm);
  const email = buildEmail(fm, url);

  console.log(`Post:    ${path.basename(file)}`);
  console.log(`Subject: ${email.subject}`);
  console.log(`URL:     ${url}`);

  if (alreadySent(raw)) {
    console.log('Already sent (KIT_SENT marker present). Skipping.');
    return;
  }

  if (dryRun) {
    console.log('\n--- dry run, nothing sent ---');
    console.log(email.content);
    return;
  }

  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) {
    console.error('KIT_API_KEY is not set.');
    process.exit(1);
  }

  const now = new Date().toISOString();
  const body = {
    ...email,
    public: false, // no public archive page; the blog is the archive
    published_at: now,
    send_at: now, // a timestamp sends it; null would leave a draft
    // No subscriber_filter: omitting it sends to the whole list. Kit rejects
    // anything but `segment` or `tag` here (422: "Only `segment` or `tag`
    // filters allowed"), so there is no explicit way to say "everyone".
  };

  const res = await fetch(API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': apiKey,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    // Keep the body: Kit's errors name the offending field, and losing it
    // leaves you with a bare status code and nothing to act on.
    console.error(`::error::Kit broadcast failed (HTTP ${res.status}): ${text.slice(0, 600)}`);
    process.exit(1);
  }

  let id = 'unknown';
  try {
    id = JSON.parse(text)?.broadcast?.id ?? 'unknown';
  } catch {
    /* body was not JSON; the send still succeeded */
  }
  console.log(`Sent. Broadcast id ${id}`);
  markSent(file, raw);
}

main().catch((err) => {
  console.error(`::error::${err.message}`);
  process.exit(1);
});
