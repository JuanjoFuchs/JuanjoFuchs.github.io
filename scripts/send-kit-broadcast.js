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

function newsletterSection(raw) {
  /* Hand-written email copy, living beside the LinkedIn and X copy in the
   * post's {% comment %} block:
   *
   *   ## Newsletter
   *   SUBJECT: optional, overrides the post title
   *   PREVIEW: optional, the inbox preview line
   *   MEDIA: /assets/hero.png
   *   ALT: what the image shows
   *
   *   Body markdown, written for the inbox rather than scraped from the post.
   *
   * Written by hand because a newsletter is not a post: it opens differently,
   * it says why this one matters this week, and it earns the click instead of
   * demanding it. Falls back to the post's own opening paragraphs when absent,
   * so a post can still ship without it.
   */
  // Index slicing rather than one clever regex. The first attempt used
  // /^## Newsletter\s*$([\s\S]*?)(?=^## |\{% endcomment %\}|$)/m and always
  // captured an empty body, because under the m flag `$` in the lookahead is
  // satisfied at the end of the very first line. It failed silently, falling
  // back to scraped paragraphs, which looked like the section had been ignored.
  const start = raw.search(/^## Newsletter[^\n]*$/m);
  if (start === -1) return null;

  // Terminators, in the order this comment block actually uses them: the next
  // heading, the `---` rule that separates sections, the INSTRUCTIONS footer,
  // or the end of the block. Stopping only at `## ` let the whole INSTRUCTIONS
  // footer into the email body.
  const after = raw.slice(raw.indexOf('\n', start) + 1);
  const endMatch = after.search(/^## |^---\s*$|^INSTRUCTIONS:|^\{%\s*endcomment\s*%\}/m);
  const sectionText = endMatch === -1 ? after : after.slice(0, endMatch);

  const lines = sectionText.split(/\r?\n/);
  const meta = {};
  const bodyLines = [];

  for (const line of lines) {
    const kv = line.match(/^(SUBJECT|PREVIEW|MEDIA|ALT|PUBLISHED|KIT_SENT):\s*(.*)$/);
    if (kv) {
      meta[kv[1].toLowerCase()] = kv[2].trim();
    } else {
      bodyLines.push(line);
    }
  }

  const body = bodyLines.join('\n').trim();
  return body ? { ...meta, body } : null;
}

function leadParagraphs(raw, count = 4) {
  // Everything after the front matter, minus the hero block and headings, so
  // the email opens with the post's actual first words.
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, '');
  const withoutComments = body.replace(/\{%\s*comment\s*%\}[\s\S]*?\{%\s*endcomment\s*%\}/g, '');
  const withoutHtml = withoutComments.replace(/<div[\s\S]*?<\/div>/g, '');

  return withoutHtml
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter(
      (block) =>
        block &&
        !block.startsWith('#') && // headings
        !block.startsWith('>') && // pull quotes
        !block.startsWith('!') && // images
        !block.startsWith('```') &&
        !block.startsWith('<')
    )
    .slice(0, count);
}

function mdToHtml(text) {
  // Only what a lead paragraph actually uses. A full markdown dependency for
  // three constructs is not worth the supply chain.
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\r?\n/g, ' ');
}

// Inline styles only, and no <style> block: Gmail strips head styles, and
// Outlook ignores most of what survives. Every value here is one an email
// client from 2010 would still honour.
// The font stack is single-quoted INSIDE a double-quoted JS string, because it
// ends up inside style="…" in the HTML. Writing "Segoe UI" with double quotes
// closes the style attribute and corrupts every tag after it, which is what the
// first version did.
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const S = {
  p: `margin:0 0 1.1em;font-family:${FONT};font-size:17px;line-height:1.6;color:#2d2d2f`,
  lede: `margin:0 0 1.4em;font-family:${FONT};font-size:19px;line-height:1.5;color:#4e585a`,
  img: 'display:block;width:100%;max-width:520px;height:auto;border:0;border-radius:6px',
  rule: 'border:0;border-top:1px solid #e7e7e7;margin:2em 0',
  sig: `margin:0;font-family:${FONT};font-size:17px;line-height:1.6;color:#2d2d2f`,
  btn: `background-color:#11363F;color:#ffffff;display:inline-block;padding:13px 22px;font-family:${FONT};font-size:16px;font-weight:600;text-decoration:none;border-radius:4px`,
};

function button(url, label) {
  // Table-wrapped so Outlook renders the background; a styled <a> alone loses
  // its colour there and the reader sees plain blue text where a button was.
  return [
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:1.6em 0">',
    '<tr><td align="left" bgcolor="#11363F" style="border-radius:4px">',
    `<a href="${url}" style="${S.btn}">${label}</a>`,
    '</td></tr></table>',
  ].join('');
}

function buildEmail(fm, url, raw) {
  const section = newsletterSection(raw);
  const title = section?.subject || fm.title || 'New post';
  const description = fm.description || '';

  // WHY THE EMAIL CARRIES REAL PROSE (2026-08-11)
  // The first send was the description, an image and a link: roughly 40 words
  // against three tracked URLs, which is the shape of a phishing message, and
  // it landed in spam despite SPF, DKIM and DMARC all passing. Real prose gives
  // filters something to read and gives the reader a reason to click.
  const blocks = section
    ? section.body.split(/\r?\n\s*\r?\n/).map((b) => b.trim()).filter(Boolean)
    : leadParagraphs(raw);

  const image = section?.media
    ? `${SITE_URL}${section.media}`
    : fm.image
      ? `${SITE_URL}${fm.image}`
      : null;
  const alt = section?.alt || '';

  const parts = [];

  if (!section && description) {
    // Only when falling back: a hand-written section already opens itself.
    parts.push(`<p style="${S.lede}">${description}</p>`);
  }

  if (image) {
    parts.push(
      `<p style="margin:0 0 1.4em"><img src="${image}" alt="${alt}" style="${S.img}"></p>`
    );
  }

  for (const block of blocks) {
    parts.push(`<p style="${S.p}">${mdToHtml(block)}</p>`);
  }

  // One link to the post, once. The first version linked the same URL twice,
  // from an image and from a call to action.
  parts.push(button(url, 'Read the full post'));
  parts.push(`<hr style="${S.rule}">`);
  parts.push(`<p style="${S.sig}">JJ</p>`);

  return {
    subject: title,
    preview_text: (section?.preview || description).slice(0, 140),
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
  const email = buildEmail(fm, url, raw);

  console.log(`Post:    ${path.basename(file)}`);
  console.log(`Subject: ${email.subject}`);
  console.log(`URL:     ${url}`);

  // Preview before the sent-check, so you can still see what a post's email
  // looks like after it has gone out. A dry run sends nothing either way.
  if (dryRun) {
    console.log(`Preview: ${email.preview_text}`);
    console.log(`Source:  ${newsletterSection(raw) ? 'hand-written ## Newsletter section' : 'fallback, post lead paragraphs'}`);
    console.log('\n--- dry run, nothing sent ---');
    console.log(email.content);
    return;
  }

  if (alreadySent(raw)) {
    console.log('Already sent (KIT_SENT marker present). Skipping.');
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
    // filters allowed"), yet stores `all_subscribers` as the default it just
    // refused. Verified by reading two sent broadcasts back: identical filters.

    // Click tracking rewrites every URL as
    // 769ec09e.click.kit-mail3.com/<id>/<id>/<base64 of the real URL>, which is
    // indistinguishable from a phishing redirect and was in the first message
    // that went to spam. Turning it off means subscribers see and follow real
    // juanjofuchs.com links. The cost is click metrics, which are worth less
    // than arriving.
    click_tracking_disabled: true,
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
