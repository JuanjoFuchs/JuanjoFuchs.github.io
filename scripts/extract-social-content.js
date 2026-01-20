import matter from 'gray-matter';
import fs from 'fs';
import { checkPublishedStatus } from './mark-post-published.js';

/**
 * Escape reserved characters for LinkedIn's "little" text format
 * Reserved characters: | { } @ [ ] ( ) < > # \ * _ ~
 * See: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/little-text-format
 * @param {string} text - Raw text content
 * @returns {string} - Text with reserved characters escaped
 */
export function escapeLinkedInText(text) {
  if (!text) return text;
  // Escape backslash first (to avoid double-escaping), then other reserved chars
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/@/g, '\\@')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/~/g, '\\~');
}

/**
 * Extract content between {% comment %} and {% endcomment %} tags
 * Gets the LAST comment block (to avoid matching example/template blocks in post content)
 * @param {string} markdownContent - Full markdown file content
 * @returns {string|null} - Content within Liquid comment block, or null if not found
 */
export function extractLiquidComments(markdownContent) {
  const commentRegex = /{%\s*comment\s*%}([\s\S]*?){%\s*endcomment\s*%}/gi;
  const matches = Array.from(markdownContent.matchAll(commentRegex));

  // Return the LAST match (actual social content at end of post)
  // Earlier matches might be code examples within the post content
  if (matches.length === 0) {
    return null;
  }

  const lastMatch = matches[matches.length - 1];
  return lastMatch[1].trim();
}

/**
 * Extract MEDIA and ALT fields from a section
 * @param {string} sectionContent - Content of a platform section
 * @returns {object} - {media, alt, contentWithoutMedia}
 */
function extractMediaFields(sectionContent) {
  let media = null;
  let alt = null;
  let contentWithoutMedia = sectionContent;

  // Extract MEDIA: field
  // Use [^\S\r\n]* instead of \s* to avoid matching across lines with CRLF endings
  const mediaMatch = sectionContent.match(/^MEDIA:[^\S\r\n]*(.+)$/m);
  if (mediaMatch) {
    media = mediaMatch[1].trim();
    contentWithoutMedia = contentWithoutMedia.replace(mediaMatch[0], '').trim();
  }

  // Remove empty MEDIA: lines (no value after colon)
  contentWithoutMedia = contentWithoutMedia.replace(/^MEDIA:[^\S\r\n]*$/gm, '').trim();

  // Extract ALT: field
  const altMatch = sectionContent.match(/^ALT:[^\S\r\n]*(.+)$/m);
  if (altMatch) {
    alt = altMatch[1].trim();
    contentWithoutMedia = contentWithoutMedia.replace(altMatch[0], '').trim();
  }

  // Remove empty ALT: lines (no value after colon)
  contentWithoutMedia = contentWithoutMedia.replace(/^ALT:[^\S\r\n]*$/gm, '').trim();

  // Remove PUBLISHED: lines (metadata added by automation, not content to post)
  contentWithoutMedia = contentWithoutMedia.replace(/^PUBLISHED:[^\S\r\n]*.*$/gm, '').trim();

  return { media, alt, contentWithoutMedia };
}

/**
 * Parse LinkedIn post content from comment block
 * @param {string} commentContent - Content from Liquid comment block
 * @returns {object|null} - {content, hashtags, media, alt} or null if section not found
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

  // Extract MEDIA and ALT fields
  const { media, alt, contentWithoutMedia } = extractMediaFields(contentWithoutInstructions);

  // Extract hashtags (lines starting with #) BEFORE stripping markdown
  const hashtagRegex = /#\w+/g;
  const hashtags = contentWithoutMedia.match(hashtagRegex) || [];

  // Strip Markdown formatting (LinkedIn doesn't support it)
  // Must strip bold (**text**) before italic (*text*) to handle nested cases
  const plainContent = contentWithoutMedia
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Bold: **text** → text
    .replace(/\*(.+?)\*/g, '$1')       // Italic: *text* → text
    .replace(/__(.+?)__/g, '$1')       // Bold: __text__ → text
    .replace(/_(.+?)_/g, '$1');        // Italic: _text_ → text

  // Escape reserved characters for LinkedIn's "little" text format
  const escapedContent = escapeLinkedInText(plainContent);

  return {
    content: escapedContent,
    rawContent: contentWithoutMedia,  // Keep raw for debugging
    hashtags: hashtags,
    media: media,
    alt: alt
  };
}

/**
 * Parse X/Twitter thread from comment block
 * @param {string} commentContent - Content from Liquid comment block
 * @returns {object|null} - {tweets, hashtags, media, alt} or null if section not found
 */
export function parseTwitterThread(commentContent) {
  const twitterRegex = /##\s*X\/Twitter Thread\s*([\s\S]*?)(?=---\s*\n\s*INSTRUCTIONS:|$)/i;
  const match = commentContent.match(twitterRegex);

  if (!match) {
    return null;
  }

  const fullSection = match[1].trim();

  // Extract MEDIA and ALT fields first (before tweets parsing)
  const { media, alt, contentWithoutMedia } = extractMediaFields(fullSection);

  // Extract individual tweets (Tweet 1, Tweet 2, etc.)
  const tweetRegex = /Tweet\s+\d+[^\n]*:\s*\n([^\n]+(?:\n(?!Tweet\s+\d+)[^\n]+)*)/gi;
  const tweets = [];
  let tweetMatch;

  while ((tweetMatch = tweetRegex.exec(contentWithoutMedia)) !== null) {
    const tweetContent = tweetMatch[1].trim();
    if (tweetContent) {
      tweets.push(tweetContent);
    }
  }

  // Extract hashtags from the entire section
  const hashtagRegex = /#\w+/g;
  const hashtags = contentWithoutMedia.match(hashtagRegex) || [];

  return {
    tweets: tweets,
    hashtags: hashtags,
    media: media,
    alt: alt
  };
}

/**
 * Build blog post URL from front matter and filename
 * Jekyll includes categories in the URL path before the date
 * Jekyll uses the filename (after YYYY-MM-DD-) as the slug, not the title
 * URL Pattern: https://juanjofuchs.github.io/[categories]/YYYY/MM/DD/filename-slug.html
 * @param {object} frontMatter - Parsed front matter from gray-matter
 * @param {string} filePath - Path to the markdown file (to extract slug from filename)
 * @param {string} baseUrl - Base URL from config (e.g., "https://juanjofuchs.github.io")
 * @returns {string} - Full blog post URL
 */
export function buildBlogUrl(frontMatter, filePath, baseUrl) {
  const date = new Date(frontMatter.date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // Extract slug from filename (Jekyll uses filename, not title)
  // Example: "2025-11-11-scheduled-post-publishing.md" -> "scheduled-post-publishing"
  const filename = filePath.split(/[\\/]/).pop(); // Get filename from path
  const slug = filename
    .replace(/^\d{4}-\d{2}-\d{2}-/, '') // Remove date prefix
    .replace(/\.md$/, ''); // Remove .md extension

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
        blogUrl: buildBlogUrl(frontMatter, filePath, baseUrl),
        publishedStatus
      };
    }

    // Parse LinkedIn and Twitter content
    let linkedin = parseLinkedInPost(commentContent);
    let twitter = parseTwitterThread(commentContent);

    if (!linkedin && !twitter) {
      return {
        error: 'No LinkedIn or Twitter content found in comment block',
        frontMatter,
        linkedin: null,
        twitter: null,
        blogUrl: buildBlogUrl(frontMatter, filePath, baseUrl),
        publishedStatus
      };
    }

    // Apply featured image fallback (R6)
    const featuredImage = frontMatter.image || null;
    const defaultAlt = frontMatter.title ? `Image for: ${frontMatter.title}` : null;

    if (linkedin) {
      if (!linkedin.media && featuredImage) {
        linkedin.media = featuredImage;
      }
      if (linkedin.media && !linkedin.alt) {
        linkedin.alt = defaultAlt;
      }
    }

    if (twitter) {
      if (!twitter.media && featuredImage) {
        twitter.media = featuredImage;
      }
      if (twitter.media && !twitter.alt) {
        twitter.alt = defaultAlt;
      }
    }

    return {
      frontMatter,
      linkedin,
      twitter,
      blogUrl: buildBlogUrl(frontMatter, filePath, baseUrl),
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

// CLI handler
if (process.argv[1] && process.argv[1].endsWith('extract-social-content.js')) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node extract-social-content.js <path-to-post.md>');
    console.log('');
    console.log('Extracts and validates social media content from a blog post.');
    console.log('');
    console.log('This validates:');
    console.log('  - Liquid comment block parsing');
    console.log('  - LinkedIn and Twitter section detection');
    console.log('  - URL generation (includes categories)');
    console.log('  - PUBLISHED flag status');
    process.exit(1);
  }

  const filePath = args[0];
  const result = extractSocialContent(filePath);

  console.log('='.repeat(60));
  console.log('Social Media Content Extraction');
  console.log('='.repeat(60));

  if (result.error) {
    console.log(`\n❌ Error: ${result.error}`);
  }

  if (result.frontMatter) {
    console.log(`\n📄 Post: ${result.frontMatter.title}`);
    console.log(`   Date: ${result.frontMatter.date}`);
    console.log(`   Categories: ${result.frontMatter.categories || '(none)'}`);
  }

  console.log(`\n🔗 Blog URL: ${result.blogUrl}`);

  console.log('\n📊 Published Status:');
  console.log(`   LinkedIn: ${result.publishedStatus.linkedin ? '✓ Published' : '○ Not published'}`);
  console.log(`   Twitter:  ${result.publishedStatus.twitter ? '✓ Published' : '○ Not published'}`);

  if (result.linkedin) {
    console.log('\n💼 LinkedIn Content:');
    console.log(`   Characters: ${result.linkedin.content.length}`);
    console.log(`   Hashtags: ${result.linkedin.hashtags.join(' ')}`);
    console.log(`   Media: ${result.linkedin.media || '(none)'}`);
    console.log(`   Alt: ${result.linkedin.alt || '(none)'}`);
  } else {
    console.log('\n💼 LinkedIn: Not found');
  }

  if (result.twitter) {
    console.log('\n🐦 Twitter Thread:');
    console.log(`   Tweets: ${result.twitter.tweets.length}`);
    result.twitter.tweets.forEach((tweet, i) => {
      console.log(`   [${i + 1}] ${tweet.length} chars: ${tweet.substring(0, 50)}...`);
    });
    console.log(`   Hashtags: ${result.twitter.hashtags.join(' ')}`);
    console.log(`   Media: ${result.twitter.media || '(none)'}`);
    console.log(`   Alt: ${result.twitter.alt || '(none)'}`);
  } else {
    console.log('\n🐦 Twitter: Not found');
  }

  console.log('\n' + '='.repeat(60));
}
