# Feature Specification: LinkedIn Article Posts and Mentions

## Overview

Enhance LinkedIn posting to support article posts with link preview cards and document the limitations around mentioning people via the API.

## Background

### Current Implementation

The existing `post-to-linkedin.js` creates image posts with the blog URL in a comment:
1. Upload featured image via Images API
2. Create post with `content.media.id` (image as main content)
3. Add comment with blog URL

This approach shows the image prominently but does NOT display a link preview card with og:title/og:description.

### API Behavior Discovery

Research revealed two key findings:

1. **No automatic URL scraping**: Unlike the LinkedIn web UI, the API does NOT auto-generate link previews from URLs in the `commentary` field. Article metadata must be explicitly provided.

2. **Mention limitations**: Personal accounts (`w_member_social`) cannot mention other people via the API. Only organizations can be mentioned. Mentioning people requires posting from a company page with `w_organization_social`.

## Goals

- Support article posts that display link preview cards (title, description, thumbnail)
- Allow choosing between image posts and article posts based on content
- Document mention limitations to prevent future confusion
- Maintain backward compatibility with existing image post workflow

## Requirements

### R1: Article Post Support

The system must support creating article posts with link preview cards:

```javascript
{
  "author": "urn:li:person:{id}",
  "commentary": "Post text here",
  "content": {
    "article": {
      "source": "https://juanjofuchs.github.io/...",  // Required
      "title": "Article Title",                       // Required
      "description": "Description text",             // Required
      "thumbnail": "urn:li:image:..."                // Optional
    }
  },
  ...
}
```

### R2: Article Metadata Extraction

For article posts, the system must extract metadata from the blog post:
- `source`: Generated blog URL (already implemented in `buildBlogUrl`)
- `title`: From front matter `title` field
- `description`: From front matter `description` field
- `thumbnail`: Optionally upload the front matter `image` field

### R3: Post Type Selection

The system must support selecting between post types:

| Post Type | Content Object | Use Case |
|-----------|---------------|----------|
| Text only | None | No media, no link preview |
| Image post | `content.media.id` | Visual hero image is primary content |
| Article post | `content.article.*` | Link preview card with title/description |

Selection criteria options:
- **Option A**: Explicit flag in social media content (`TYPE: article` or `TYPE: image`)
- **Option B**: Automatic based on presence of `MEDIA:` field (has media = image post, no media = article post)
- **Option C**: Configuration option in front matter (`social_post_type: article`)

**Recommended**: Option B (automatic) with Option A override capability.

### R4: Article Post Without Thumbnail

Article posts must work without a thumbnail image. The `thumbnail` field is optional in LinkedIn's API. Posts without thumbnails will display the link preview card with title and description only.

### R5: Backward Compatibility

The existing image post workflow must continue to work unchanged. Article post support is additive.

### R6: Comment Behavior for Article Posts

For article posts, the first comment with blog URL is optional since the URL is already in the link preview card. Options:
- **Option A**: Skip comment for article posts (URL visible in card)
- **Option B**: Keep comment for consistency and SEO (double exposure)

**Recommended**: Option A (skip comment) to avoid redundancy.

## Mention Limitations (Documentation Only)

### L1: Personal Accounts Cannot Mention People

The LinkedIn Posts API with `w_member_social` scope cannot mention other users' profiles. This is a LinkedIn platform limitation, not a bug.

The mention syntax exists:
```
@[Display Name](urn:li:person:ABC123)
```

But it only works when:
- Posting from an organization page (`w_organization_social`)
- The person is a follower of the organization

### L2: Organization Mentions Work

Personal accounts CAN mention organizations:
```
@[Anthropic](urn:li:organization:12345678)
```

Requirements:
- Display text must match the full organization name exactly (case-sensitive)
- Organization URN must be valid

### L3: Getting URNs is Restricted

APIs to look up person URNs are restricted:
- People Typeahead API: Requires organization page access
- Vanity URL lookup: Requires partner access
- Profile API by vanity name: Requires `r_compliance_2l` scope (restricted)

Only your own URN is easily accessible via `/v2/userinfo`.

## Non-Functional Requirements

### NFR1: API Version

Use LinkedIn API version `202501` or later. The `LinkedIn-Version` header is required.

### NFR2: Error Messages

When article post creation fails, provide actionable error messages:
- Missing required fields (title, description, source)
- Invalid thumbnail URN
- Rate limiting

### NFR3: Thumbnail Upload Optional

Thumbnail upload failures should not block article post creation. Fall back to article post without thumbnail.

## Implementation Notes

### Article Post Request Structure

```javascript
const postData = {
  author: `urn:li:person:${personId}`,
  commentary: content,  // Main post text
  visibility: 'PUBLIC',
  distribution: {
    feedDistribution: 'MAIN_FEED',
    targetEntities: [],
    thirdPartyDistributionChannels: []
  },
  content: {
    article: {
      source: blogUrl,
      title: frontMatter.title,
      description: frontMatter.description,
      // thumbnail: imageUrn  // Optional
    }
  },
  lifecycleState: 'PUBLISHED',
  isReshareDisabledByAuthor: false
};
```

### Differences from Image Posts

| Aspect | Image Post | Article Post |
|--------|-----------|--------------|
| Content object | `content.media.id` | `content.article.*` |
| Image location | Main post area | Small thumbnail in card |
| Link visibility | In comment only | In preview card |
| Requires upload | Yes (image) | Optional (thumbnail) |
| Shows og: metadata | No | Yes (manual) |

### Extraction Changes

`extract-social-content.js` may need updates to:
- Extract `TYPE:` field if using explicit selection
- Pass `frontMatter.title` and `frontMatter.description` to posting function

## Out of Scope

- Mentioning people from personal accounts (API limitation)
- Automatic og: tag scraping from URLs (API limitation)
- Company page posting (requires different auth flow)
- Video article thumbnails
- Carousel posts
- Document posts

## Success Criteria

1. Article posts display link preview cards with title and description
2. Article posts optionally include thumbnail from featured image
3. Existing image post workflow continues to work
4. Clear documentation prevents confusion about mention limitations

## References

- [LinkedIn Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api)
- [LinkedIn Images API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/images-api)
- [LinkedIn URNs and IDs](https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/urns)
