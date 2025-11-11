import matter from 'gray-matter';
import fs from 'fs';
import { checkPublishedStatus } from './mark-post-published.js';

/**
 * Extract content between {% comment %} and {% endcomment %} tags
 * @param {string} markdownContent - Full markdown file content
 * @returns {string|null} - Content within Liquid comment block, or null if not found
 */
export function extractLiquidComments(markdownContent) {
  const commentRegex = /{%\s*comment\s*%}([\s\S]*?){%\s*endcomment\s*%}/i;
  const match = markdownContent.match(commentRegex);
  return match ? match[1].trim() : null;
}

/**
 * Parse LinkedIn post content from comment block
 * @param {string} commentContent - Content from Liquid comment block
 * @returns {object|null} - {content, hashtags} or null if section not found
 */
export function parseLinkedInPost(commentContent) {
  const linkedInRegex = /##\s*LinkedIn Post\s*([\s\S]*?)(?=---\s*\n\s*##|$)/i;
  const match = commentContent.match(linkedInRegex);

  if (!match) {
    return null;
  }

  let fullSection = match[1].trim();

  // Remove INSTRUCTIONS section (everything from "---\nINSTRUCTIONS:" onwards)
  const instructionsRegex = /---\s*\n\s*INSTRUCTIONS:[\s\S]*/i;
  const contentWithoutInstructions = fullSection.replace(instructionsRegex, '').trim();

  // Extract hashtags (lines starting with #)
  const hashtagRegex = /#\w+/g;
  const hashtags = contentWithoutInstructions.match(hashtagRegex) || [];

  return {
    content: contentWithoutInstructions,
    hashtags: hashtags
  };
}

/**
 * Parse X/Twitter thread from comment block
 * @param {string} commentContent - Content from Liquid comment block
 * @returns {object|null} - {tweets, hashtags} or null if section not found
 */
export function parseTwitterThread(commentContent) {
  const twitterRegex = /##\s*X\/Twitter Thread\s*([\s\S]*?)(?=---\s*\n\s*INSTRUCTIONS:|$)/i;
  const match = commentContent.match(twitterRegex);

  if (!match) {
    return null;
  }

  const fullSection = match[1].trim();

  // Extract individual tweets (Tweet 1, Tweet 2, etc.)
  const tweetRegex = /Tweet\s+\d+[^\n]*:\s*\n([^\n]+(?:\n(?!Tweet\s+\d+)[^\n]+)*)/gi;
  const tweets = [];
  let tweetMatch;

  while ((tweetMatch = tweetRegex.exec(fullSection)) !== null) {
    const tweetContent = tweetMatch[1].trim();
    if (tweetContent) {
      tweets.push(tweetContent);
    }
  }

  // Extract hashtags from the entire section
  const hashtagRegex = /#\w+/g;
  const hashtags = fullSection.match(hashtagRegex) || [];

  return {
    tweets: tweets,
    hashtags: hashtags
  };
}

/**
 * Build blog post URL from front matter
 * Jekyll includes categories in the URL path before the date
 * URL Pattern: https://juanjofuchs.github.io/[categories]/YYYY/MM/DD/title-slug.html
 * @param {object} frontMatter - Parsed front matter from gray-matter
 * @param {string} baseUrl - Base URL from config (e.g., "https://juanjofuchs.github.io")
 * @returns {string} - Full blog post URL
 */
export function buildBlogUrl(frontMatter, baseUrl) {
  const date = new Date(frontMatter.date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Extract slug from title (lowercase, replace spaces with hyphens)
  const slug = frontMatter.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Build category path
  // Categories can be a string "category1 category2" or array ["category1", "category2"]
  let categoryPath = '';
  if (frontMatter.categories) {
    const categories = Array.isArray(frontMatter.categories)
      ? frontMatter.categories
      : frontMatter.categories.split(' ').filter(c => c.trim());

    if (categories.length > 0) {
      categoryPath = categories.join('/') + '/';
    }
  }

  return `${baseUrl}/${categoryPath}${year}/${month}/${day}/${slug}.html`;
}

/**
 * Main function to extract all social media content from a markdown file
 * @param {string} filePath - Path to the markdown file
 * @param {string} baseUrl - Base URL for building post URLs
 * @returns {object} - {frontMatter, linkedin, twitter, blogUrl, publishedStatus, error}
 */
export function extractSocialContent(filePath, baseUrl = 'https://juanjofuchs.github.io') {
  try {
    // Read and parse markdown file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontMatter, content: markdownContent } = matter(fileContent);

    // Check if platforms are already published
    const publishedStatus = checkPublishedStatus(filePath);

    // Extract Liquid comment block
    const commentContent = extractLiquidComments(fileContent);

    if (!commentContent) {
      return {
        error: 'No Liquid comment block found in post',
        frontMatter,
        linkedin: null,
        twitter: null,
        blogUrl: buildBlogUrl(frontMatter, baseUrl),
        publishedStatus
      };
    }

    // Parse LinkedIn and Twitter content
    const linkedin = parseLinkedInPost(commentContent);
    const twitter = parseTwitterThread(commentContent);

    if (!linkedin && !twitter) {
      return {
        error: 'No LinkedIn or Twitter content found in comment block',
        frontMatter,
        linkedin: null,
        twitter: null,
        blogUrl: buildBlogUrl(frontMatter, baseUrl),
        publishedStatus
      };
    }

    return {
      frontMatter,
      linkedin,
      twitter,
      blogUrl: buildBlogUrl(frontMatter, baseUrl),
      publishedStatus,
      error: null
    };
  } catch (err) {
    return {
      error: `Failed to extract content: ${err.message}`,
      frontMatter: null,
      linkedin: null,
      twitter: null,
      blogUrl: null,
      publishedStatus: { linkedin: false, twitter: false }
    };
  }
}
