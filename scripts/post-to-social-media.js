#!/usr/bin/env node

import { extractSocialContent } from './extract-social-content.js';
import { postTwitterThread } from './post-to-x.js';
import { postToLinkedIn } from './post-to-linkedin.js';
import { markAsPublished } from './mark-post-published.js';
import fs from 'fs';
import path from 'path';

/**
 * Read a boolean-ish env var. Mirrors post-daily-social.js so the global
 * SOCIAL_LINKEDIN_ENABLED / SOCIAL_X_ENABLED kill-switches work here too.
 * @param {string} name - Environment variable name
 * @param {boolean} defaultValue - Value when unset/empty
 * @returns {boolean}
 */
function envEnabled(name, defaultValue = true) {
  const value = process.env[name];
  if (value == null || value === '') {
    return defaultValue;
  }
  return !['0', 'false', 'no', 'off'].includes(value.toLowerCase());
}

/**
 * Resolve media path from relative (e.g., /assets/image.png) to absolute
 * @param {string} mediaPath - Media path from post content
 * @param {string} postFilePath - Path to the post file
 * @returns {string|null} - Absolute path to media file, or null if not found
 */
function resolveMediaPath(mediaPath, postFilePath) {
  if (!mediaPath) return null;

  // Determine repo root (parent of _posts directory)
  const postsDir = path.dirname(postFilePath);
  const repoRoot = path.dirname(postsDir);

  // Handle paths starting with /assets/ or assets/
  let relativePath = mediaPath;
  if (relativePath.startsWith('/')) {
    relativePath = relativePath.substring(1);
  }

  const absolutePath = path.join(repoRoot, relativePath);

  // Check if file exists
  if (fs.existsSync(absolutePath)) {
    console.log(`✓ Media file found: ${absolutePath}`);
    return absolutePath;
  }

  console.warn(`⚠ Media file not found: ${absolutePath}`);
  return null;
}

/**
 * Main function to orchestrate social media posting
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Social Media Automation Script');
  console.log('='.repeat(60));

  // Parse command line arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const filePath = args.find(arg => !arg.startsWith('--'));
  if (!filePath) {
    console.error('❌ Error: No file path provided');
    console.log('Usage: node post-to-social-media.js <path-to-markdown-file> [--dry-run]');
    process.exit(1);
  }

  // Global platform kill-switches (default enabled), shared with the daily flow.
  const platformsEnabled = {
    linkedin: envEnabled('SOCIAL_LINKEDIN_ENABLED', true),
    twitter: envEnabled('SOCIAL_X_ENABLED', true)
  };

  if (dryRun) {
    console.log('\n🧪 Dry run: will validate and print, no posts will be sent.');
  }

  // Validate file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Error: File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`\n📄 Processing: ${path.basename(filePath)}`);

  // Load API credentials from environment variables
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

  // Validate credentials
  const missingCredentials = [];
  if (!credentials.twitter.apiKey) missingCredentials.push('X_API_KEY');
  if (!credentials.twitter.apiSecret) missingCredentials.push('X_API_SECRET');
  if (!credentials.twitter.accessToken) missingCredentials.push('X_ACCESS_TOKEN');
  if (!credentials.twitter.accessTokenSecret) missingCredentials.push('X_ACCESS_TOKEN_SECRET');
  if (!credentials.linkedin.accessToken) missingCredentials.push('LINKEDIN_ACCESS_TOKEN');

  if (missingCredentials.length > 0) {
    console.warn(`⚠️  Warning: Missing credentials: ${missingCredentials.join(', ')}`);
    console.warn('⚠️  Some platforms may fail to post');
  }

  // Extract social media content
  console.log('\n📝 Extracting social media content...');
  const baseUrl = 'https://juanjofuchs.github.io';
  const extracted = extractSocialContent(filePath, baseUrl);

  if (extracted.error) {
    console.error(`❌ Extraction error: ${extracted.error}`);
    console.log('⚠️  Skipping social media posting for this post');
    process.exit(0); // Exit with success (per requirement R5)
  }

  console.log(`✓ Post title: ${extracted.frontMatter.title}`);
  console.log(`✓ Blog URL: ${extracted.blogUrl}`);
  console.log(`✓ LinkedIn content: ${extracted.linkedin ? 'Found' : 'Not found'}${extracted.linkedin?.media ? ` (media: ${extracted.linkedin.media})` : ''}`);
  console.log(`✓ Twitter content: ${extracted.twitter ? 'Found' : 'Not found'}${extracted.twitter?.media ? ` (media: ${extracted.twitter.media})` : ''}`);

  // Check published status
  if (extracted.publishedStatus) {
    console.log(`✓ LinkedIn published: ${extracted.publishedStatus.linkedin ? 'Yes (skipping)' : 'No'}`);
    console.log(`✓ Twitter published: ${extracted.publishedStatus.twitter ? 'Yes (skipping)' : 'No'}`);
  }

  // Track results
  const results = {
    twitter: null,
    linkedin: null
  };

  // Post to both platforms in parallel
  console.log('\n🚀 Posting to social media...');
  console.log('-'.repeat(60));

  const promises = [];

  // Twitter posting
  if (!platformsEnabled.twitter) {
    console.log('\n⊘ Twitter: Disabled via SOCIAL_X_ENABLED, skipping');
    results.twitter = { success: true, skipped: true };
  } else if (extracted.publishedStatus && extracted.publishedStatus.twitter) {
    console.log('\n⊘ Twitter: Already published, skipping');
    results.twitter = { success: true, skipped: true };
  } else if (extracted.twitter && extracted.twitter.tweets.length > 0) {
    console.log(`\n🐦 ${dryRun ? 'Would post' : 'Posting'} to X (Twitter) - ${extracted.twitter.tweets.length} tweets`);

    // Replace any hardcoded blog URLs with the correctly generated blogUrl
    const BASE_DOMAIN = 'juanjofuchs.github.io';
    const blogUrlPattern = new RegExp(
      `https?://${BASE_DOMAIN.replace(/\./g, '\\.')}[^\\s]*`, 'g'
    );
    const correctedTweets = extracted.twitter.tweets.map(
      tweet => tweet.replace(blogUrlPattern, (m) => {
        const q = m.indexOf('?');
        return q >= 0 ? extracted.blogUrl + m.slice(q) : extracted.blogUrl;
      })
    );

    // Resolve media path for Twitter
    const twitterMediaPath = resolveMediaPath(extracted.twitter.media, filePath);
    if (extracted.twitter.media) {
      console.log(`  Media: ${extracted.twitter.media}${twitterMediaPath ? ' (found)' : ' (not found)'}`);
    }

    if (dryRun) {
      correctedTweets.forEach((tweet, i) => console.log(`  [${i + 1}] ${tweet}`));
      results.twitter = { success: true, dryRun: true };
    } else {
      promises.push(
        postTwitterThread(correctedTweets, credentials.twitter, {
          mediaPath: twitterMediaPath,
          altText: extracted.twitter.alt
        })
          .then(result => {
            results.twitter = result;
            if (result.success) {
              const mediaStatus = result.mediaUploaded ? ' (with image)' : '';
              console.log(`✓ Twitter: Posted ${result.tweetIds.length} tweets successfully${mediaStatus}`);
              // Mark as published
              markAsPublished(filePath, 'twitter');
            } else {
              console.error(`✗ Twitter: ${result.error}`);
            }
          })
          .catch(err => {
            results.twitter = { success: false, error: err.message };
            console.error(`✗ Twitter: Unexpected error - ${err.message}`);
          })
      );
    }
  } else {
    console.log('\n⊘ Twitter: No content found, skipping');
  }

  // LinkedIn posting
  if (!platformsEnabled.linkedin) {
    console.log('\n⊘ LinkedIn: Disabled via SOCIAL_LINKEDIN_ENABLED, skipping');
    results.linkedin = { success: true, skipped: true };
  } else if (extracted.publishedStatus && extracted.publishedStatus.linkedin) {
    console.log('\n⊘ LinkedIn: Already published, skipping');
    results.linkedin = { success: true, skipped: true };
  } else if (extracted.linkedin && extracted.linkedin.content) {
    console.log(`\n💼 ${dryRun ? 'Would post' : 'Posting'} to LinkedIn`);

    // Resolve media path for LinkedIn
    const linkedinMediaPath = resolveMediaPath(extracted.linkedin.media, filePath);
    if (extracted.linkedin.media) {
      console.log(`  Media: ${extracted.linkedin.media}${linkedinMediaPath ? ' (found)' : ' (not found)'}`);
    }

    if (dryRun) {
      console.log(`  ${extracted.linkedin.content.length} chars, hashtags: ${extracted.linkedin.hashtags.join(' ')}`);
      results.linkedin = { success: true, dryRun: true };
    } else {
      promises.push(
        postToLinkedIn(extracted.linkedin.content, extracted.blogUrl, credentials.linkedin.accessToken, {
          mediaPath: linkedinMediaPath,
          altText: extracted.linkedin.alt
        })
          .then(result => {
            results.linkedin = result;
            if (result.success) {
              const mediaStatus = result.mediaUploaded ? ' (with image)' : '';
              console.log(`✓ LinkedIn: Posted successfully${mediaStatus}`);
              console.log(`  Post URL: ${result.postUrl}`);
              // Mark as published
              markAsPublished(filePath, 'linkedin');
            } else {
              console.error(`✗ LinkedIn: ${result.error}`);
            }
          })
          .catch(err => {
            results.linkedin = { success: false, error: err.message };
            console.error(`✗ LinkedIn: Unexpected error - ${err.message}`);
          })
      );
    }
  } else {
    console.log('\n⊘ LinkedIn: No content found, skipping');
  }

  // Wait for all promises to complete
  await Promise.allSettled(promises);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Summary');
  console.log('='.repeat(60));

  let successCount = 0;
  let failureCount = 0;

  if (results.twitter) {
    if (results.twitter.success) {
      if (results.twitter.dryRun) {
        console.log(`🧪 Twitter: Dry run (not posted)`);
      } else if (results.twitter.skipped) {
        console.log(`⊘ Twitter: Skipped`);
      } else {
        console.log(`✓ Twitter: Success (${results.twitter.tweetIds.length} tweets)`);
        successCount++;
      }
    } else {
      console.log(`✗ Twitter: Failed - ${results.twitter.error}`);
      failureCount++;
    }
  }

  if (results.linkedin) {
    if (results.linkedin.success) {
      if (results.linkedin.dryRun) {
        console.log(`🧪 LinkedIn: Dry run (not posted)`);
      } else if (results.linkedin.skipped) {
        console.log(`⊘ LinkedIn: Skipped`);
      } else {
        console.log(`✓ LinkedIn: Success`);
        successCount++;
      }
    } else {
      console.log(`✗ LinkedIn: Failed - ${results.linkedin.error}`);
      failureCount++;
    }
  }

  console.log(`\nTotal: ${successCount} succeeded, ${failureCount} failed`);

  if (failureCount === 0) {
    console.log('\n✓ Social media posting completed');
    process.exit(0);
  }

  // A partial failure used to exit 0 ("per requirement R5"), which made it invisible:
  // on 2026-07-14 LinkedIn died on an expired token, the run still reported success,
  // and only the X section got a PUBLISHED marker. Nobody would have known without
  // reading the raw log. A promotion that didn't promote is a failure — say so.
  //
  // The workflow's "Commit published flags" step runs with always(), so the markers
  // for whatever DID post are still committed before this non-zero exit. That's what
  // stops a re-run from double-posting the platform that already succeeded.
  const failed = [];
  if (results.twitter && !results.twitter.success) failed.push(`X: ${results.twitter.error}`);
  if (results.linkedin && !results.linkedin.success) failed.push(`LinkedIn: ${results.linkedin.error}`);

  console.error(`::error::Social promotion failed on ${failureCount} platform(s). ${failed.join(' | ')}`);

  // LinkedIn access tokens last ~60 days and this app cannot issue refresh tokens, so
  // there is no automatic recovery — only a human with a browser. Say exactly that
  // instead of leaving a 401 for someone to decode.
  const liError = results.linkedin && !results.linkedin.success ? String(results.linkedin.error || '') : '';
  if (/expired|EXPIRED_ACCESS_TOKEN|401/i.test(liError)) {
    console.error(
      '::error::LINKEDIN_ACCESS_TOKEN has expired. This app cannot issue refresh tokens, ' +
      'so it must be renewed by hand: https://www.linkedin.com/developers/tools/oauth ' +
      '-> select the app -> request a token with scopes openid, profile, w_member_social ' +
      '-> gh secret set LINKEDIN_ACCESS_TOKEN -R JuanjoFuchs/JuanjoFuchs.github.io ' +
      '-> re-run this workflow (already-published platforms are skipped automatically).'
    );
  }

  process.exit(1);
}

// Run main function
main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  console.error(err.stack);
  console.error(`::error::Social promotion crashed: ${err.message}`);
  process.exit(1); // A crash is a failure. Exiting 0 here hid real breakage.
});
