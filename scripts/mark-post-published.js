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
  // Extract the Liquid comment block
  const commentMatch = content.match(/{%\s*comment\s*%}([\s\S]*?){%\s*endcomment\s*%}/i);
  if (!commentMatch) {
    return false;
  }

  const commentContent = commentMatch[1];

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
  return /PUBLISHED:\s*\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/i.test(sectionContent);
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

export {
  markAsPublished,
  checkPublishedStatus,
  isAlreadyPublished
};

// CLI usage (ES6 module detection)
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node mark-post-published.js <file-path> <platform>');
    console.log('       platform: linkedin | twitter | check');
    console.log('\nExamples:');
    console.log('  node mark-post-published.js _posts/2025-11-18-my-post.md linkedin');
    console.log('  node mark-post-published.js _posts/2025-11-18-my-post.md twitter');
    console.log('  node mark-post-published.js _posts/2025-11-18-my-post.md check');
    process.exit(1);
  }

  const [filePath, platform] = args;

  if (platform === 'check') {
    const status = checkPublishedStatus(filePath);
    console.log('Published Status:');
    console.log(`  LinkedIn: ${status.linkedin ? '✓ Published' : '✗ Not published'}`);
    console.log(`  Twitter:  ${status.twitter ? '✓ Published' : '✗ Not published'}`);
  } else if (platform === 'linkedin' || platform === 'twitter') {
    markAsPublished(filePath, platform);
  } else {
    console.error(`❌ Unknown platform: ${platform}. Use 'linkedin', 'twitter', or 'check'`);
    process.exit(1);
  }
}
