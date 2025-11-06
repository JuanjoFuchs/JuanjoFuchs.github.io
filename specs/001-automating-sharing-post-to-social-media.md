# Feature Specification: Automating Sharing Blog Posts to Social Media

## Overview

Automatically share new blog posts to X (Twitter) and LinkedIn when they're published, eliminating manual posting and ensuring consistent social media presence.

## Goals

- Reduce manual work by automating social media announcements for new blog posts
- Maintain consistent timing between blog publication and social media sharing
- Allow customization of social media content per post
- Use free tier APIs and GitHub Actions (no paid services or external hosting)

## Requirements

### R1: Automatic Posting Trigger

When a new blog post is published via the scheduled publishing workflow, the system must automatically share the post to both X and LinkedIn.

### R2: Social Media Content Requirement

Each blog post must have social media content already prepared in Liquid comment blocks:
- Stored at the end of the blog post markdown file in `{% comment %} {% endcomment %}` blocks
- Contains two sections: LinkedIn Post and X/Twitter Thread
- Content is pre-formatted and ready to post (no generation required)
- If Liquid comment section is missing, system should log error and skip posting for that post

### R3: Social Media Content Extraction

The system must extract social media content from Liquid comment blocks in blog post markdown files:

#### Liquid Comment Structure:
- Content is stored within `{% comment %} {% endcomment %}` blocks at the end of each post
- Two sections within the comment block: "LinkedIn Post" and "X/Twitter Thread"
- Each section contains pre-formatted, ready-to-post content

#### For X (Twitter):
- Extract individual tweets from the thread (labeled as "Tweet 1", "Tweet 2", etc.)
- Post as a thread (maintain order)
- Extract hashtags from the thread content
- Ignore the "INSTRUCTIONS" section in the comment block

#### For LinkedIn:
- Extract the main post text (everything before the "INSTRUCTIONS" section)
- Extract hashtags from the post content
- Post the main content to LinkedIn
- Immediately post a first comment with the blog post URL
- Ignore the "INSTRUCTIONS" section in the comment block

#### Content Format Reference:
Content format guidelines are documented in AGENTS.md. This automation system extracts and posts pre-formatted content, it does not generate or validate content format.

### R4: Post Metadata

Social media posts must include:
- Blog post title
- Blog post URL
- Custom text from Liquid comment section (if provided)
- Platform-specific hashtags (1-2 for X, 3-5 for LinkedIn)
- Engagement metrics to track (optional but recommended)

### R5: Error Handling

The system must:
- Continue publishing the blog post even if social media posting fails
- Log errors for debugging
- Not block the main publishing workflow

### R6: Credential Management

API credentials for X and LinkedIn must be:
- Stored securely in GitHub Secrets
- Not exposed in logs or code
- Refreshable without code changes

### R7: Platform Independence

Each social media platform should operate independently:
- Failure on one platform doesn't affect the other
- Posts can be disabled per platform
- Easy to add new platforms in the future

## Non-Functional Requirements

### NFR1: Cost

Solution must use free tier APIs and GitHub Actions, with no ongoing subscription costs.

### NFR2: Maintenance

Token refresh and credential updates should require minimal manual intervention (acceptable: quarterly maintenance).

### NFR3: Reliability

Social media posting should succeed 95% of the time for posts with valid content and active API credentials.

### NFR4: Performance

Social media posts should be published within 5 minutes of blog post publication.

### NFR5: Timing Optimization

Posts should be scheduled during optimal engagement windows:
- **X (Twitter)**: Wednesday at 9 AM EST preferred, or Tuesday-Thursday between 8-11 AM or 12-2 PM EST
- **LinkedIn**: Tuesday-Thursday between 8-10 AM or 12-2 PM EST
- **Blog schedule**: Currently Tuesday 9 AM EST (already optimal for both platforms)

## Constraints

- Must use X (Twitter) free tier API (1,500 posts/month limit, 17 posts/24 hours)
- Must use LinkedIn free tier API (personal posting only, token refresh every 2 months)
- Must use GitHub Actions (no external CI/CD or hosting)
- Cannot use paid services like IFTTT Pro or Zapier

## Success Criteria

1. New blog posts automatically appear on X and LinkedIn within 5 minutes of publication
2. Social media posts contain the correct custom content and link
3. System operates without manual intervention between scheduled posts
4. Failed posts are logged and identifiable for manual retry

## Out of Scope

- Posting to other social media platforms (Facebook, Instagram, etc.)
- Analytics or engagement tracking (beyond basic success/failure logging)
- Automated responses or interactions
- Posting to LinkedIn company pages (personal profile only)
- Image or media attachments in social posts (manual addition recommended for X threads)
- Editing or deleting social media posts after publication
- Cross-posting from social media back to blog
- Automatic engagement in first hour after posting (manual recommended for algorithm boost)
- Token/credential automatic refresh (manual refresh required every 2 months for LinkedIn)

## Additional Considerations

### Content Source

All social media content must be pre-written in blog posts following AGENTS.md guidelines. This automation system does not generate content, it only extracts and posts existing content from Liquid comment blocks.

### Parsing Requirements

The system must:
- Identify and extract content from `{% comment %} {% endcomment %}` blocks
- Parse "LinkedIn Post" section and separate main content from instructions
- Parse "X/Twitter Thread" section and extract individual tweets
- Handle variations in formatting (extra whitespace, line breaks, etc.)
- Extract hashtags embedded in the content
- Validate that required sections exist before attempting to post