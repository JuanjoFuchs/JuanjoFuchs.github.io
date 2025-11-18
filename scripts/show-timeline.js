#!/usr/bin/env node

/**
 * Display blog post timeline with publication status
 * Shows published and upcoming posts sorted by date
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get all post files from _posts directory
 */
function getPostFiles() {
  const postsDir = path.join(__dirname, '..', '_posts');
  const files = fs.readdirSync(postsDir);
  return files
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(postsDir, file));
}

/**
 * Parse post file and extract metadata
 */
function parsePost(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data: frontMatter } = matter(fileContent);
  const filename = path.basename(filePath);

  return {
    filename,
    title: frontMatter.title || 'Untitled',
    description: frontMatter.description || '',
    date: new Date(frontMatter.date),
    categories: Array.isArray(frontMatter.categories)
      ? frontMatter.categories
      : (frontMatter.categories ? frontMatter.categories.split(' ') : []),
    tags: frontMatter.tags || []
  };
}

/**
 * Format date for display
 */
function formatDate(date) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Calculate days until/since publication
 */
function getDaysFrom(date) {
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Main function
 */
function main() {
  console.log('='.repeat(70));
  console.log('📅 Blog Post Timeline');
  console.log('='.repeat(70));
  console.log();

  // Get all posts
  const postFiles = getPostFiles();
  const posts = postFiles.map(parsePost);

  // Sort by date
  posts.sort((a, b) => a.date - b.date);

  // Current date
  const now = new Date();

  // Split into published and upcoming
  const published = posts.filter(p => p.date <= now);
  const upcoming = posts.filter(p => p.date > now);

  // Display summary first
  console.log('📊 SUMMARY');
  console.log('-'.repeat(70));
  console.log(`Total Posts: ${posts.length}`);
  console.log(`Published: ${published.length}`);
  console.log(`Upcoming: ${upcoming.length}`);

  if (upcoming.length > 0) {
    const nextPost = upcoming[0];
    const lastPost = upcoming[upcoming.length - 1];
    const daysUntilNext = getDaysFrom(nextPost.date);
    const daysUntilLast = getDaysFrom(lastPost.date);
    const weeksOfContent = Math.ceil(upcoming.length);

    console.log();
    console.log(`⏰ Next Publication: ${formatDate(nextPost.date)}`);
    console.log(`   "${nextPost.title}"`);
    console.log(`   Publishing in ${daysUntilNext} day${daysUntilNext !== 1 ? 's' : ''}`);

    console.log();
    console.log(`📆 Backlog Duration: ${weeksOfContent} week${weeksOfContent !== 1 ? 's' : ''} of content`);
    console.log(`   Last scheduled post: ${formatDate(lastPost.date)}`);
    console.log(`   "${lastPost.title}"`);
    console.log(`   ${daysUntilLast} days until backlog is depleted`);
  }

  console.log();
  console.log('📅 Publishing Schedule: Every Tuesday at 9:00 AM EST');
  console.log('='.repeat(70));
  console.log();

  // Display published posts
  if (published.length > 0) {
    console.log('✅ PUBLISHED POSTS');
    console.log('-'.repeat(70));
    console.log();

    published.forEach((post, index) => {
      const daysAgo = Math.abs(getDaysFrom(post.date));
      const timeAgo = daysAgo === 0 ? 'Today' :
                      daysAgo === 1 ? 'Yesterday' :
                      `${daysAgo} days ago`;

      console.log(`${index + 1}. ${formatDate(post.date)} (${timeAgo})`);
      console.log(`   📝 ${post.title}`);
      console.log(`   📄 ${post.filename}`);
      if (post.categories.length > 0) {
        console.log(`   📂 Categories: ${post.categories.join(', ')}`);
      }
      if (post.description) {
        console.log(`   💡 ${post.description}`);
      }
      console.log();
    });
  }

  // Display upcoming posts
  if (upcoming.length > 0) {
    console.log('🔜 UPCOMING POSTS');
    console.log('-'.repeat(70));
    console.log();

    upcoming.forEach((post, index) => {
      const daysUntil = getDaysFrom(post.date);
      const timeUntil = daysUntil === 0 ? 'Today' :
                        daysUntil === 1 ? 'Tomorrow' :
                        `In ${daysUntil} days`;

      console.log(`${index + 1}. ${formatDate(post.date)} (${timeUntil})`);
      console.log(`   📝 ${post.title}`);
      console.log(`   📄 ${post.filename}`);
      if (post.categories.length > 0) {
        console.log(`   📂 Categories: ${post.categories.join(', ')}`);
      }
      if (post.description) {
        console.log(`   💡 ${post.description}`);
      }
      console.log();
    });
  }

  console.log('='.repeat(70));
}

// Run the script
main();
