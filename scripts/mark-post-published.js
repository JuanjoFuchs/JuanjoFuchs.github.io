#!/usr/bin/env node

/**
 * Module to mark social media content as published in blog post markdown files
 * Adds PUBLISHED timestamps to prevent duplicate posting
 */

import fs from 'fs';
import path from 'path';

/**
 * Check if a platform section has already been marked as published
 * @param {string} content - The markdown file content
 * @param {string} platform - 'linkedin' or 'twitter'
 * @returns {boolean} - True if already published
 */
function isAlreadyPublished(content, platform) {
  // Extract the LAST Liquid comment block (to avoid matching example/template blocks in post content)
  const commentRegex = /{%\s*comment\s*%}([\s\S]*?){%\s*endcomment\s*%}/gi;
  const matches = Array.from(content.matchAll(commentRegex));
  if (matches.length === 0) {
    return false;
  }

  const commentContent = matches[matches.length - 1][1];

  // Find the platform section
  let sectionRegex;
  if (platform === 'linkedin') {
    sectionRegex = /##\s*LinkedIn Post\s*([\s\S]*?)(?=---\s*\n|##\s*X\/Twitter|$)/i;
  } else if (platform === 'twitter') {
    sectionRegex = /##\s*X\/Twitter Thread\s*([\s\S]*?)(?=---\s*\n\s*INSTRUCTIONS|{%\s*endcomment|$)/i;
  } else {
    return false;
  }

  const sectionMatch = commentContent.match(sectionRegex);
  if (!sectionMatch) {
    return false;
  }

  const sectionContent = sectionMatch[1];

  // Check if PUBLISHED flag exists in this section
  return /PUBLISHED:\s*\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/i.test(sectionContent);
}

/**
 * Mark a platform section as published by adding a timestamp
 * @param {string} filePath - Path to the markdown file
 * @param {string} platform - 'linkedin' or 'twitter'
 * @param {string} timestamp - ISO 8601 timestamp (optional, defaults to now)
 * @returns {boolean} - True if successful
 */
function markAsPublished(filePath, platform, timestamp = null) {
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if already published
    if (isAlreadyPublished(content, platform)) {
      console.log(`⚠️  ${platform} section already marked as published`);
      return false;
    }

    // Generate timestamp if not provided
    const publishedTimestamp = timestamp || new Date().toISOString();
    const publishedFlag = `PUBLISHED: ${publishedTimestamp}\n`;

    // Find and modify the appropriate section
    let modifiedContent = content;

    if (platform === 'linkedin') {
      // Insert PUBLISHED flag after "## LinkedIn Post"
      modifiedContent = modifiedContent.replace(
        /(##\s*LinkedIn Post\s*\n)/i,
        `$1${publishedFlag}\n`
      );
    } else if (platform === 'twitter') {
      // Insert PUBLISHED flag after "## X/Twitter Thread"
      modifiedContent = modifiedContent.replace(
        /(##\s*X\/Twitter Thread\s*\n)/i,
        `$1${publishedFlag}\n`
      );
    } else {
      console.error(`❌ Unknown platform: ${platform}`);
      return false;
    }

    // Check if modification actually happened
    if (modifiedContent === content) {
      console.error(`❌ Failed to find ${platform} section header in file`);
      return false;
    }

    // Write back to file
    fs.writeFileSync(filePath, modifiedContent, 'utf8');
    console.log(`✓ Marked ${platform} as published: ${publishedTimestamp}`);
    return true;

  } catch (error) {
    console.error(`❌ Error marking ${platform} as published:`, error.message);
    return false;
  }
}

/**
 * Check published status for both platforms
 * @param {string} filePath - Path to the markdown file
 * @returns {Object} - { linkedin: boolean, twitter: boolean }
 */
function checkPublishedStatus(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    return {
      linkedin: isAlreadyPublished(content, 'linkedin'),
      twitter: isAlreadyPublished(content, 'twitter')
    };
  } catch (error) {
    console.error(`❌ Error checking published status:`, error.message);
    return { linkedin: false, twitter: false };
  }
}

function findCampaignEntryBounds(content, date) {
  const entryRegex = /^###\s+.+$/gm;
  const entries = Array.from(content.matchAll(entryRegex));

  for (let i = 0; i < entries.length; i++) {
    const start = entries[i].index;
    const nextEntry = i + 1 < entries.length ? entries[i + 1].index : content.length;
    const endComment = content.indexOf('{% endcomment %}', start);
    const end = endComment >= 0 ? Math.min(nextEntry, endComment) : nextEntry;
    const entryContent = content.slice(start, end);
    const dateRegex = new RegExp(`^DATE:[^\\S\\r\\n]*${date.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm');

    if (dateRegex.test(entryContent)) {
      return { start, end, entryContent };
    }
  }

  return null;
}

function isCampaignEntryPublished(entryContent, platform) {
  const heading = platform === 'linkedin' ? 'LinkedIn Post' : 'X\\/Twitter Thread';
  const regex = new RegExp(`(?:^|\\r?\\n)####[^\\S\\r\\n]*${heading}[^\\S\\r\\n]*\\r?\\n([\\s\\S]*?)(?=\\r?\\n\\s*####\\s+|$)`, 'i');
  const match = entryContent.match(regex);

  if (!match) {
    return false;
  }

  return /PUBLISHED:\s*\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/i.test(match[1]);
}

/**
 * Mark a daily campaign entry/platform as published by adding a timestamp.
 * @param {string} filePath - Path to the markdown file
 * @param {string} date - Campaign entry date in YYYY-MM-DD format
 * @param {string} platform - 'linkedin' or 'twitter'
 * @param {string} timestamp - ISO 8601 timestamp (optional, defaults to now)
 * @returns {boolean} - True if successful
 */
function markCampaignEntryAsPublished(filePath, date, platform, timestamp = null) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const bounds = findCampaignEntryBounds(content, date);

    if (!bounds) {
      console.error(`❌ Failed to find campaign entry for date: ${date}`);
      return false;
    }

    if (isCampaignEntryPublished(bounds.entryContent, platform)) {
      console.log(`⚠️  ${platform} campaign entry already marked as published for ${date}`);
      return false;
    }

    const heading = platform === 'linkedin' ? 'LinkedIn Post' : 'X\\/Twitter Thread';
    const headingRegex = new RegExp(`(####[^\\S\\r\\n]*${heading}[^\\S\\r\\n]*\\r?\\n)`, 'i');
    const publishedTimestamp = timestamp || new Date().toISOString();
    const modifiedEntry = bounds.entryContent.replace(
      headingRegex,
      `$1PUBLISHED: ${publishedTimestamp}\n\n`
    );

    if (modifiedEntry === bounds.entryContent) {
      console.error(`❌ Failed to find ${platform} section header in campaign entry ${date}`);
      return false;
    }

    const modifiedContent = content.slice(0, bounds.start) + modifiedEntry + content.slice(bounds.end);
    fs.writeFileSync(filePath, modifiedContent, 'utf8');
    console.log(`✓ Marked ${platform} campaign entry as published for ${date}: ${publishedTimestamp}`);
    return true;
  } catch (error) {
    console.error(`❌ Error marking ${platform} campaign entry as published:`, error.message);
    return false;
  }
}

export {
  markAsPublished,
  markCampaignEntryAsPublished,
  checkPublishedStatus,
  isAlreadyPublished
};

// CLI usage (ES6 module detection)
if (import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node mark-post-published.js <file-path> <platform>');
    console.log('       platform: linkedin | twitter | check | campaign-linkedin | campaign-twitter');
    console.log('\nExamples:');
    console.log('  node mark-post-published.js _posts/2025-11-18-my-post.md linkedin');
    console.log('  node mark-post-published.js _posts/2025-11-18-my-post.md twitter');
    console.log('  node mark-post-published.js _posts/2025-11-18-my-post.md check');
    console.log('  node mark-post-published.js _posts/2025-11-18-my-post.md campaign-linkedin 2026-05-12');
    process.exit(1);
  }

  const [filePath, platform, date] = args;

  if (platform === 'check') {
    const status = checkPublishedStatus(filePath);
    console.log('Published Status:');
    console.log(`  LinkedIn: ${status.linkedin ? '✓ Published' : '✗ Not published'}`);
    console.log(`  Twitter:  ${status.twitter ? '✓ Published' : '✗ Not published'}`);
  } else if (platform === 'campaign-linkedin' || platform === 'campaign-twitter') {
    if (!date) {
      console.error('❌ Campaign publishing requires a date argument (YYYY-MM-DD)');
      process.exit(1);
    }
    markCampaignEntryAsPublished(
      filePath,
      date,
      platform === 'campaign-linkedin' ? 'linkedin' : 'twitter'
    );
  } else if (platform === 'linkedin' || platform === 'twitter') {
    markAsPublished(filePath, platform);
  } else {
    console.error(`❌ Unknown platform: ${platform}. Use 'linkedin', 'twitter', 'check', 'campaign-linkedin', or 'campaign-twitter'`);
    process.exit(1);
  }
}
