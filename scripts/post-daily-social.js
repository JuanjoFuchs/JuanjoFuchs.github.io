#!/usr/bin/env node

import { extractSocialCampaignContent } from './extract-social-content.js';
import { postTwitterThread } from './post-to-x.js';
import { postToLinkedIn } from './post-to-linkedin.js';
import { markCampaignEntryAsPublished } from './mark-post-published.js';
import fs from 'fs';
import path from 'path';

function parseArgs(argv) {
  const options = {
    date: new Date().toISOString().slice(0, 10),
    dryRun: false,
    platform: 'all',
    postsDir: '_posts'
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--date') {
      options.date = argv[++i];
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--platform') {
      options.platform = argv[++i];
    } else if (arg === '--posts-dir') {
      options.postsDir = argv[++i];
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      printHelp();
      process.exit(1);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(options.date)) {
    console.error('Error: --date must use YYYY-MM-DD');
    process.exit(1);
  }

  if (!['all', 'linkedin', 'twitter'].includes(options.platform)) {
    console.error('Error: --platform must be all, linkedin, or twitter');
    process.exit(1);
  }

  return options;
}

function printHelp() {
  console.log('Usage: node post-daily-social.js [options]');
  console.log('');
  console.log('Posts scheduled daily campaign entries from blog post Liquid comments.');
  console.log('');
  console.log('Options:');
  console.log('  --date YYYY-MM-DD       Campaign date to post (default: today UTC)');
  console.log('  --platform PLATFORM     all | linkedin | twitter (default: all)');
  console.log('  --posts-dir DIR         Directory containing Jekyll posts (default: _posts)');
  console.log('  --dry-run               Print what would post without calling APIs or marking files');
  console.log('');
  console.log('Environment:');
  console.log('  SOCIAL_LINKEDIN_ENABLED=false disables LinkedIn');
  console.log('  SOCIAL_X_ENABLED=false disables X/Twitter');
}

function envEnabled(name, defaultValue = true) {
  const value = process.env[name];
  if (value == null || value === '') {
    return defaultValue;
  }

  return !['0', 'false', 'no', 'off'].includes(value.toLowerCase());
}

function resolveMediaPath(mediaPath, postFilePath) {
  if (!mediaPath) return null;

  const postsDir = path.dirname(postFilePath);
  const repoRoot = path.dirname(postsDir);
  let relativePath = mediaPath;

  if (relativePath.startsWith('/')) {
    relativePath = relativePath.substring(1);
  }

  const absolutePath = path.join(repoRoot, relativePath);

  if (fs.existsSync(absolutePath)) {
    return absolutePath;
  }

  console.warn(`Media file not found: ${absolutePath}`);
  return null;
}

function getPostFiles(postsDir) {
  if (!fs.existsSync(postsDir)) {
    console.error(`Posts directory not found: ${postsDir}`);
    process.exit(1);
  }

  return fs.readdirSync(postsDir)
    .filter(file => /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(file))
    .sort()
    .map(file => path.join(postsDir, file));
}

function replaceBlogUrls(text, blogUrl) {
  const baseDomain = 'juanjofuchs.github.io';
  const blogUrlPattern = new RegExp(
    `https?://${baseDomain.replace(/\./g, '\\.')}[^\\s]*`,
    'g'
  );

  // Canonicalize the path/slug but preserve any query string (e.g. UTM params
  // added by extract-social-content.js's addUtmParams).
  return text.replace(blogUrlPattern, (m) => {
    const q = m.indexOf('?');
    return q >= 0 ? blogUrl + m.slice(q) : blogUrl;
  });
}

async function postLinkedInEntry(entry, blogUrl, credentials, filePath, dryRun) {
  if (entry.publishedStatus.linkedin) {
    console.log('  LinkedIn: already published, skipping');
    return { success: true, skipped: true };
  }

  if (!entry.linkedin?.content) {
    console.log('  LinkedIn: no content, skipping');
    return { success: true, skipped: true };
  }

  const content = replaceBlogUrls(entry.linkedin.content, blogUrl);
  const mediaPath = resolveMediaPath(entry.linkedin.media, filePath);

  if (dryRun) {
    console.log(`  LinkedIn: dry run (${content.length} chars)`);
    return { success: true, dryRun: true };
  }

  const result = await postToLinkedIn(content, blogUrl, credentials.linkedin.accessToken, {
    mediaPath,
    altText: entry.linkedin.alt
  });

  if (result.success) {
    markCampaignEntryAsPublished(filePath, entry.date, 'linkedin');
  }

  return result;
}

async function postTwitterEntry(entry, blogUrl, credentials, filePath, dryRun) {
  if (entry.publishedStatus.twitter) {
    console.log('  X/Twitter: already published, skipping');
    return { success: true, skipped: true };
  }

  if (!entry.twitter?.tweets?.length) {
    console.log('  X/Twitter: no content, skipping');
    return { success: true, skipped: true };
  }

  const tweets = entry.twitter.tweets.map(tweet => replaceBlogUrls(tweet, blogUrl));
  const mediaPath = resolveMediaPath(entry.twitter.media, filePath);

  if (dryRun) {
    console.log(`  X/Twitter: dry run (${tweets.length} tweet${tweets.length === 1 ? '' : 's'})`);
    return { success: true, dryRun: true };
  }

  const result = await postTwitterThread(tweets, credentials.twitter, {
    mediaPath,
    altText: entry.twitter.alt
  });

  if (result.success) {
    markCampaignEntryAsPublished(filePath, entry.date, 'twitter');
  }

  return result;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const platforms = {
    linkedin: options.platform !== 'twitter' && envEnabled('SOCIAL_LINKEDIN_ENABLED', true),
    twitter: options.platform !== 'linkedin' && envEnabled('SOCIAL_X_ENABLED', true)
  };

  const credentials = {
    twitter: {
      apiKey: process.env.X_API_KEY,
      apiSecret: process.env.X_API_SECRET,
      accessToken: process.env.X_ACCESS_TOKEN,
      accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET
    },
    linkedin: {
      accessToken: process.env.LINKEDIN_ACCESS_TOKEN
    }
  };

  console.log('='.repeat(60));
  console.log('Daily Social Campaign Posting');
  console.log('='.repeat(60));
  console.log(`Date: ${options.date}`);
  console.log(`Dry run: ${options.dryRun ? 'yes' : 'no'}`);
  console.log(`LinkedIn enabled: ${platforms.linkedin ? 'yes' : 'no'}`);
  console.log(`X/Twitter enabled: ${platforms.twitter ? 'yes' : 'no'}`);

  const postFiles = getPostFiles(options.postsDir);
  const candidates = [];

  for (const filePath of postFiles) {
    const extracted = extractSocialCampaignContent(filePath);

    if (extracted.error || !extracted.campaign) {
      continue;
    }

    const entries = extracted.campaign.entries.filter(entry => entry.date === options.date);
    for (const entry of entries) {
      candidates.push({
        filePath,
        blogUrl: extracted.blogUrl,
        title: extracted.frontMatter?.title || path.basename(filePath),
        campaign: extracted.campaign.campaign,
        entry
      });
    }
  }

  if (candidates.length === 0) {
    console.log('\nNo campaign entries scheduled for this date.');
    return;
  }

  let failures = 0;
  let successfulActions = 0;

  for (const candidate of candidates) {
    console.log('\n' + '-'.repeat(60));
    console.log(`${candidate.title}`);
    console.log(`Campaign: ${candidate.campaign.id || '(none)'}`);
    console.log(`Entry: ${candidate.entry.heading} (${candidate.entry.date} ${candidate.entry.time || ''})`);
    console.log(`Blog URL: ${candidate.blogUrl}`);

    if (platforms.linkedin) {
      const result = await postLinkedInEntry(
        candidate.entry,
        candidate.blogUrl,
        credentials,
        candidate.filePath,
        options.dryRun
      );
      if (!result.success) {
        failures++;
        console.error(`  LinkedIn failed: ${result.error}`);
      } else if (!result.skipped) {
        successfulActions++;
      }
    } else {
      console.log('  LinkedIn: disabled, skipping');
    }

    if (platforms.twitter) {
      const result = await postTwitterEntry(
        candidate.entry,
        candidate.blogUrl,
        credentials,
        candidate.filePath,
        options.dryRun
      );
      if (!result.success) {
        failures++;
        console.error(`  X/Twitter failed: ${result.error}`);
      } else if (!result.skipped) {
        successfulActions++;
      }
    } else {
      console.log('  X/Twitter: disabled, skipping');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Done. Candidates: ${candidates.length}, failures: ${failures}`);
  if (failures > 0) {
    console.log('Some platforms failed. Successful platform posts were still marked for commit.');
    if (successfulActions === 0) {
      process.exitCode = 1;
    }
  }
  console.log('='.repeat(60));
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
