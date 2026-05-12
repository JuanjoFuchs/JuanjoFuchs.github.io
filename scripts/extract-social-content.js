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

// Twitter character counting constants
const TWITTER_URL_LENGTH = 23;  // All URLs count as 23 chars (t.co shortening)
const TWITTER_MAX_LENGTH = 280;

// Regex to match URLs (simplified but covers most cases)
const URL_REGEX = /https?:\/\/[^\s]+/g;

/**
 * Calculate Twitter's weighted character count for a tweet
 * - URLs count as 23 characters regardless of actual length
 * - Most emojis count as 2 characters
 * See: https://developer.twitter.com/en/docs/counting-characters
 * @param {string} text - Tweet text
 * @returns {number} - Twitter-weighted character count
 */
export function getTwitterLength(text) {
  if (!text) return 0;

  // Find all URLs and calculate their contribution
  const urls = text.match(URL_REGEX) || [];
  const urlActualLength = urls.reduce((sum, url) => sum + url.length, 0);
  const urlTwitterLength = urls.length * TWITTER_URL_LENGTH;

  // Base length minus actual URL lengths plus Twitter URL lengths
  // This is a simplified count - Twitter's actual counting is more complex for emojis
  return text.length - urlActualLength + urlTwitterLength;
}

/**
 * Truncate tweet text to fit Twitter's 280 character limit
 * Accounts for URL shortening (URLs count as 23 chars)
 * @param {string} text - Tweet text
 * @param {number} maxLength - Maximum Twitter-weighted length (default 280)
 * @returns {object} - {text, truncated, twitterLength}
 */
export function truncateTweet(text, maxLength = TWITTER_MAX_LENGTH) {
  if (!text) return { text: '', truncated: false, twitterLength: 0 };

  const twitterLength = getTwitterLength(text);

  if (twitterLength <= maxLength) {
    return { text, truncated: false, twitterLength };
  }

  // Need to truncate - find URLs first to preserve them if possible
  const urls = text.match(URL_REGEX) || [];

  // Calculate how many chars we need to remove
  const excessChars = twitterLength - maxLength + 3; // +3 for "..."

  // Simple approach: truncate from end, but try to keep URLs intact
  // Find the last URL and its position
  let truncatedText = text;

  if (urls.length > 0) {
    const lastUrl = urls[urls.length - 1];
    const lastUrlIndex = text.lastIndexOf(lastUrl);

    // If truncating would cut into the URL, truncate before it
    if (text.length - excessChars < lastUrlIndex + lastUrl.length &&
        text.length - excessChars > lastUrlIndex) {
      // Cut before the URL
      truncatedText = text.substring(0, lastUrlIndex).trim() + '...';
    } else {
      // Safe to truncate at the end
      truncatedText = text.substring(0, text.length - excessChars).trim() + '...';
    }
  } else {
    // No URLs, simple truncation
    truncatedText = text.substring(0, text.length - excessChars).trim() + '...';
  }

  return {
    text: truncatedText,
    truncated: true,
    twitterLength: getTwitterLength(truncatedText)
  };
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

  // Remove NOTE: lines used as private publishing instructions.
  contentWithoutMedia = contentWithoutMedia.replace(/^NOTE:[^\S\r\n]*.*$/gm, '').trim();

  return { media, alt, contentWithoutMedia };
}

/**
 * Parse LinkedIn post content from comment block
 * @param {string} commentContent - Content from Liquid comment block
 * @returns {object|null} - {content, hashtags, media, alt} or null if section not found
 */
export function parseLinkedInPost(commentContent) {
  const linkedInRegex = /^##[^\S\r\n]*LinkedIn Post[^\S\r\n]*\r?\n([\s\S]*?)(?=---\s*\n\s*##|^##\s+|$)/im;
  const match = commentContent.match(linkedInRegex);

  if (!match) {
    return null;
  }

  return parseLinkedInSectionContent(match[1]);
}

/**
 * Parse LinkedIn post content from a section body.
 * @param {string} sectionContent - Content after the LinkedIn heading
 * @returns {object|null} - {content, hashtags, media, alt} or null if empty
 */
export function parseLinkedInSectionContent(sectionContent) {
  let fullSection = sectionContent.trim();

  if (!fullSection) {
    return null;
  }

  // Remove INSTRUCTIONS section (everything from "---\nINSTRUCTIONS:" onwards)
  const instructionsRegex = /---\s*\n\s*INSTRUCTIONS:[\s\S]*/i;
  const contentWithoutInstructions = fullSection.replace(instructionsRegex, '').trim();

  // Extract MEDIA and ALT fields
  const { media, alt, contentWithoutMedia } = extractMediaFields(contentWithoutInstructions);

  if (!contentWithoutMedia.trim()) {
    return null;
  }

  // Extract hashtags (lines starting with #) BEFORE stripping markdown
  const hashtagRegex = /#\w+/g;
  const hashtags = contentWithoutMedia.match(hashtagRegex) || [];

  // Normalize line endings (CRLF -> LF)
  const normalizedContent = contentWithoutMedia.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Strip Markdown formatting (LinkedIn doesn't support it)
  // Must strip bold (**text**) before italic (*text*) to handle nested cases
  const plainContent = normalizedContent
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
  const twitterRegex = /^##[^\S\r\n]*X\/Twitter Thread[^\S\r\n]*\r?\n([\s\S]*?)(?=---\s*\n\s*INSTRUCTIONS:|^##\s+|$)/im;
  const match = commentContent.match(twitterRegex);

  if (!match) {
    return null;
  }

  return parseTwitterSectionContent(match[1]);
}

/**
 * Parse X/Twitter thread content from a section body.
 * @param {string} sectionContent - Content after the X/Twitter heading
 * @returns {object|null} - {tweets, hashtags, media, alt} or null if empty
 */
export function parseTwitterSectionContent(sectionContent) {
  const fullSection = sectionContent.trim();

  if (!fullSection) {
    return null;
  }

  // Extract MEDIA and ALT fields first (before tweets parsing)
  const { media, alt, contentWithoutMedia } = extractMediaFields(fullSection);

  // Split by "Tweet N:" markers and extract each tweet's content
  const tweetSplitRegex = /Tweet\s+\d+[^\n]*:\s*\n/gi;
  const tweetHeaders = [...contentWithoutMedia.matchAll(tweetSplitRegex)];

  const tweets = [];
  const tweetMeta = [];

  for (let i = 0; i < tweetHeaders.length; i++) {
    const startIndex = tweetHeaders[i].index + tweetHeaders[i][0].length;
    const endIndex = i + 1 < tweetHeaders.length
      ? tweetHeaders[i + 1].index
      : contentWithoutMedia.length;

    let tweetContent = contentWithoutMedia.substring(startIndex, endIndex).trim();

    if (tweetContent) {
      tweetContent = tweetContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const result = truncateTweet(tweetContent);
      tweets.push(result.text);
      tweetMeta.push({
        twitterLength: result.twitterLength,
        truncated: result.truncated,
        rawLength: tweetContent.length
      });
    }
  }

  // Extract hashtags from the entire section
  const hashtagRegex = /#\w+/g;
  const hashtags = contentWithoutMedia.match(hashtagRegex) || [];

  return {
    tweets: tweets,
    tweetMeta: tweetMeta,  // Include metadata for testing/debugging
    hashtags: hashtags,
    media: media,
    alt: alt
  };
}

function extractField(content, fieldName) {
  const escapedName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = content.match(new RegExp(`^${escapedName}:[^\\S\\r\\n]*(.+)$`, 'mi'));
  return match ? match[1].trim() : null;
}

function stripEntryFields(content) {
  return content
    .replace(/^(CAMPAIGN|DATE|TIME|TIMEZONE|MEDIA|ALT):[^\S\r\n]*.*$/gmi, '')
    .trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isSectionPublished(sectionContent) {
  return /^PUBLISHED:[^\S\r\n]*\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/mi.test(sectionContent);
}

function extractCampaignPlatformSection(entryContent, platform) {
  const heading = platform === 'linkedin' ? 'LinkedIn Post' : 'X\\/Twitter Thread';
  const regex = new RegExp(`(?:^|\\r?\\n)####[^\\S\\r\\n]*${heading}[^\\S\\r\\n]*\\r?\\n([\\s\\S]*?)(?=\\r?\\n\\s*####\\s+|$)`, 'i');
  const match = entryContent.match(regex);
  return match ? match[1].trim() : null;
}

function applyCampaignMediaFallback(entry, featuredImage, defaultAlt) {
  for (const platform of ['linkedin', 'twitter']) {
    if (!entry[platform]) {
      continue;
    }

    if (!entry[platform].media) {
      entry[platform].media = entry.media || featuredImage || null;
    }

    if (entry[platform].media && !entry[platform].alt) {
      entry[platform].alt = entry.alt || defaultAlt || null;
    }
  }
}

/**
 * Parse a daily social campaign from a Liquid comment block.
 * Campaign entries use ### day headings and nested #### platform sections.
 * @param {string} commentContent - Content from Liquid comment block
 * @returns {object|null} - {campaign, entries} or null if no campaign exists
 */
export function parseSocialCampaign(commentContent) {
  const campaignRegex = /^##\s*Social Campaign\s*\n([\s\S]*)$/im;
  const campaignMatch = commentContent.match(campaignRegex);

  if (!campaignMatch) {
    return null;
  }

  const campaignContent = campaignMatch[1].trim();
  const firstEntryMatch = campaignContent.match(/^###\s+.+$/m);
  const campaignHeader = firstEntryMatch
    ? campaignContent.slice(0, firstEntryMatch.index).trim()
    : campaignContent;

  const campaign = {
    id: extractField(campaignHeader, 'CAMPAIGN') || null,
    timezone: extractField(campaignHeader, 'TIMEZONE') || null
  };

  const entryMatches = Array.from(campaignContent.matchAll(/^###\s+(.+)$/gm));
  const entries = [];

  for (let i = 0; i < entryMatches.length; i++) {
    const heading = entryMatches[i][1].trim();
    const start = entryMatches[i].index + entryMatches[i][0].length;
    const end = i + 1 < entryMatches.length ? entryMatches[i + 1].index : campaignContent.length;
    const entryContent = campaignContent.slice(start, end).trim();

    const date = extractField(entryContent, 'DATE');
    const time = extractField(entryContent, 'TIME') || null;
    const media = extractField(entryContent, 'MEDIA') || null;
    const alt = extractField(entryContent, 'ALT') || null;

    if (!date) {
      continue;
    }

    const linkedInSection = extractCampaignPlatformSection(entryContent, 'linkedin');
    const twitterSection = extractCampaignPlatformSection(entryContent, 'twitter');
    const linkedin = linkedInSection ? parseLinkedInSectionContent(linkedInSection) : null;
    const twitter = twitterSection ? parseTwitterSectionContent(twitterSection) : null;

    entries.push({
      id: `${date}-${slugify(heading)}`,
      heading,
      date,
      time,
      timezone: campaign.timezone,
      media,
      alt,
      linkedin,
      twitter,
      publishedStatus: {
        linkedin: linkedInSection ? isSectionPublished(linkedInSection) : false,
        twitter: twitterSection ? isSectionPublished(twitterSection) : false
      },
      raw: stripEntryFields(entryContent)
    });
  }

  return { campaign, entries };
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
  const filename = filePath.split(/[\\/]/).pop();

  // Date from filename — always matches Jekyll's URL, no timezone issues
  const dateMatch = filename.match(/^(\d{4})-(\d{2})-(\d{2})-/);
  let year, month, day;
  if (dateMatch) {
    [, year, month, day] = dateMatch;
  } else {
    const date = new Date(frontMatter.date);
    year = date.getFullYear();
    month = String(date.getMonth() + 1).padStart(2, '0');
    day = String(date.getDate()).padStart(2, '0');
  }

  const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');

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
        campaign: null,
        blogUrl: buildBlogUrl(frontMatter, filePath, baseUrl),
        publishedStatus
      };
    }

    // Parse legacy single-post content and the newer daily campaign format
    let linkedin = parseLinkedInPost(commentContent);
    let twitter = parseTwitterThread(commentContent);
    let campaign = parseSocialCampaign(commentContent);

    if (!linkedin && !twitter && !campaign) {
      return {
        error: 'No LinkedIn or Twitter content found in comment block',
        frontMatter,
        linkedin: null,
        twitter: null,
        campaign: null,
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

    if (campaign) {
      for (const entry of campaign.entries) {
        applyCampaignMediaFallback(entry, featuredImage, defaultAlt);
      }
    }

    return {
      frontMatter,
      linkedin,
      twitter,
      campaign,
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
      campaign: null,
      blogUrl: null,
      publishedStatus: { linkedin: false, twitter: false }
    };
  }
}

/**
 * Extract only the daily social campaign data for a post.
 * @param {string} filePath - Path to the markdown file
 * @param {string} baseUrl - Base URL for building post URLs
 * @returns {object} - {frontMatter, campaign, blogUrl, error}
 */
export function extractSocialCampaignContent(filePath, baseUrl = 'https://juanjofuchs.github.io') {
  const result = extractSocialContent(filePath, baseUrl);
  return {
    frontMatter: result.frontMatter,
    campaign: result.campaign,
    blogUrl: result.blogUrl,
    error: result.error && result.error !== 'No LinkedIn or Twitter content found in comment block'
      ? result.error
      : null
  };
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
      const meta = result.twitter.tweetMeta[i];
      const status = meta.truncated ? ' ⚠️ TRUNCATED' : (meta.twitterLength > 260 ? ' ⚠️ CLOSE' : ' ✓');
      console.log(`   [${i + 1}] ${meta.twitterLength}/280 Twitter chars${status}: ${tweet.substring(0, 50)}...`);
    });
    console.log(`   Hashtags: ${result.twitter.hashtags.join(' ')}`);
    console.log(`   Media: ${result.twitter.media || '(none)'}`);
    console.log(`   Alt: ${result.twitter.alt || '(none)'}`);
  } else {
    console.log('\n🐦 Twitter: Not found');
  }

  if (result.campaign) {
    console.log('\n📣 Social Campaign:');
    console.log(`   Campaign: ${result.campaign.campaign.id || '(none)'}`);
    console.log(`   Timezone: ${result.campaign.campaign.timezone || '(none)'}`);
    console.log(`   Entries: ${result.campaign.entries.length}`);
    result.campaign.entries.forEach(entry => {
      const linkedinStatus = entry.publishedStatus.linkedin ? 'published' : 'pending';
      const twitterStatus = entry.publishedStatus.twitter ? 'published' : 'pending';
      const linkedinContent = entry.linkedin?.content ? 'content' : 'empty';
      const twitterContent = entry.twitter?.tweets?.length ? `${entry.twitter.tweets.length} tweets` : 'empty';
      console.log(`   - ${entry.date} ${entry.time || ''} ${entry.heading}`);
      console.log(`     LinkedIn: ${linkedinContent}, ${linkedinStatus}`);
      console.log(`     Twitter: ${twitterContent}, ${twitterStatus}`);
    });
  }

  console.log('\n' + '='.repeat(60));
}
