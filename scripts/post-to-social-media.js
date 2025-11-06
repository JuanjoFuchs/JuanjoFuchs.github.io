#!/usr/bin/env node

import { extractSocialContent } from './extract-social-content.js';
import { postTwitterThread } from './post-to-x.js';
import { postToLinkedIn } from './post-to-linkedin.js';
import fs from 'fs';
import path from 'path';

/**
 * Main function to orchestrate social media posting
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Social Media Automation Script');
  console.log('='.repeat(60));

  // Parse command line arguments
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('❌ Error: No file path provided');
    console.log('Usage: node post-to-social-media.js <path-to-markdown-file>');
    process.exit(1);
  }

  const filePath = args[0];

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
  console.log(`✓ LinkedIn content: ${extracted.linkedin ? 'Found' : 'Not found'}`);
  console.log(`✓ Twitter content: ${extracted.twitter ? 'Found' : 'Not found'}`);

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
  if (extracted.twitter && extracted.twitter.tweets.length > 0) {
    console.log(`\n🐦 Posting to X (Twitter) - ${extracted.twitter.tweets.length} tweets`);
    promises.push(
      postTwitterThread(extracted.twitter.tweets, credentials.twitter)
        .then(result => {
          results.twitter = result;
          if (result.success) {
            console.log(`✓ Twitter: Posted ${result.tweetIds.length} tweets successfully`);
          } else {
            console.error(`✗ Twitter: ${result.error}`);
          }
        })
        .catch(err => {
          results.twitter = { success: false, error: err.message };
          console.error(`✗ Twitter: Unexpected error - ${err.message}`);
        })
    );
  } else {
    console.log('\n⊘ Twitter: No content found, skipping');
  }

  // LinkedIn posting
  if (extracted.linkedin && extracted.linkedin.content) {
    console.log(`\n💼 Posting to LinkedIn`);
    promises.push(
      postToLinkedIn(extracted.linkedin.content, extracted.blogUrl, credentials.linkedin.accessToken)
        .then(result => {
          results.linkedin = result;
          if (result.success) {
            console.log(`✓ LinkedIn: Posted successfully`);
            console.log(`  Post URL: ${result.postUrl}`);
          } else {
            console.error(`✗ LinkedIn: ${result.error}`);
          }
        })
        .catch(err => {
          results.linkedin = { success: false, error: err.message };
          console.error(`✗ LinkedIn: Unexpected error - ${err.message}`);
        })
    );
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
      console.log(`✓ Twitter: Success (${results.twitter.tweetIds.length} tweets)`);
      successCount++;
    } else {
      console.log(`✗ Twitter: Failed - ${results.twitter.error}`);
      failureCount++;
    }
  }

  if (results.linkedin) {
    if (results.linkedin.success) {
      console.log(`✓ LinkedIn: Success`);
      successCount++;
    } else {
      console.log(`✗ LinkedIn: Failed - ${results.linkedin.error}`);
      failureCount++;
    }
  }

  console.log(`\nTotal: ${successCount} succeeded, ${failureCount} failed`);

  // Exit with code 0 regardless of individual platform failures (per requirement R5)
  console.log('\n✓ Social media posting completed');
  process.exit(0);
}

// Run main function
main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  console.error(err.stack);
  process.exit(0); // Exit with success per requirement R5
});
