# Feature Specification: Social Media Posting with Images and Videos

## Overview

Extend the existing social media automation to support posting images and videos alongside text content to X (Twitter) and LinkedIn, improving engagement and visibility of blog posts.

## Goals

- Increase social media engagement by including visual content with posts
- Support attaching featured images from blog posts to social media announcements
- Support attaching demo videos (from `/assets/videos/`) to relevant posts
- Maintain compatibility with free tier API limits
- Keep the workflow simple and automated via GitHub Actions

## Background

Research completed December 2024 on API capabilities:

### X (Twitter) API
- Media upload uses v1.1 endpoint (`media/upload`) with OAuth 1.0a
- Tweets with media use v2 endpoint with `media_ids` parameter
- Free tier supports media uploads (~500/day limit)
- `twitter-api-v2` library handles media upload natively
- Supported formats: JPG, PNG, GIF, WebP, MP4
- Size limits: Images up to 5MB, videos up to 512MB (chunked)

### LinkedIn API
- Uses versioned REST API (`Linkedin-Version: YYYYMM`)
- Images: Initialize upload → Upload to pre-signed URL → Create post with image URN
- Videos: Initialize → Chunk upload (4MB parts) → Finalize → Poll status → Create post
- Requires `w_member_social` scope (already available)
- Size limits: Images up to 36M pixels, videos 75KB-500MB (3s-30min)

## Requirements

### R1: Image Support for X (Twitter)

The system must support attaching an image to the first tweet of a thread.

**Requirements:**
- Image specified in blog post front matter or social media comment block
- Download image from blog assets during GitHub Actions workflow
- Upload to X using v1.1 media endpoint
- Attach media_id to first tweet of thread
- Fall back to text-only if image upload fails

**Image sources (priority order):**
1. Explicit `twitter_image:` field in social media comment block
2. `image:` field from post front matter (featured image)
3. No image (text-only post)

### R2: Image Support for LinkedIn

The system must support attaching an image to the main LinkedIn post.

**Requirements:**
- Use LinkedIn Images API with versioned headers
- Initialize upload to get pre-signed URL and image URN
- Upload image file to pre-signed URL
- Create post with `content.media.id` set to image URN
- Fall back to text-only if image upload fails

**Image sources (priority order):**
1. Explicit `linkedin_image:` field in social media comment block
2. `image:` field from post front matter (featured image)
3. No image (text-only post)

### R3: Video Support for X (Twitter)

The system must support attaching a video to the first tweet of a thread.

**Requirements:**
- Video specified explicitly in social media comment block (`twitter_video:`)
- Use chunked upload for videos over 5MB
- Attach media_id to first tweet
- Videos take priority over images if both specified
- Fall back to image or text-only if video upload fails

**Supported formats:** MP4 with H.264 codec (matching blog video standards)

### R4: Video Support for LinkedIn

The system must support attaching a video to the main LinkedIn post.

**Requirements:**
- Video specified explicitly in social media comment block (`linkedin_video:`)
- Use LinkedIn Videos API with chunked upload (4MB parts)
- Handle upload finalization and status polling
- Wait for video status `AVAILABLE` before creating post
- Fall back to image or text-only if video upload fails

**Supported formats:** MP4 (matching blog video standards)

### R5: Social Media Comment Block Updates

Update the Liquid comment block format to support media specification.

**New optional fields:**
```markdown
{% comment %}
## LinkedIn Post
MEDIA: /assets/hwinfo-tui-thermal-throttling.png
ALT: hwinfo-tui showing thermal issues with CPU throttling

[Post content...]

---

## X/Twitter Thread
MEDIA: /assets/hwinfo-tui-thermal-throttling.png
ALT: hwinfo-tui showing thermal issues with CPU throttling

Tweet 1 (Hook):
[...]
{% endcomment %}
```

**Field definitions:**
- `MEDIA:` - Path to image or video file (relative to site root)
- `ALT:` - Alt text for accessibility (required if MEDIA specified)

### R6: Automatic Featured Image Fallback

If no explicit MEDIA field is specified, use the post's featured image.

**Requirements:**
- Check for `image:` field in post front matter
- Use featured image for both platforms if available
- Generate appropriate alt text from post title if not specified
- Skip media attachment if no featured image exists

### R7: GitHub Actions Integration

Media upload must work within GitHub Actions workflow.

**Requirements:**
- Download media files from repository during workflow
- Handle file paths relative to repository root
- Support both local files (assets/) and potentially external URLs
- Clean up temporary files after upload
- Log media upload status for debugging

### R8: Error Handling

Media upload failures must not block text posting.

**Requirements:**
- Catch and log media upload errors
- Continue with text-only post if media fails
- Report partial success (post succeeded, media failed)
- Retry logic for transient failures (optional)

### R9: Rate Limit Awareness

The system must respect API rate limits.

**Requirements:**
- X: Stay within ~500 media uploads per day
- LinkedIn: Respect token expiration (60 days)
- Log warnings if approaching limits
- Do not retry indefinitely on rate limit errors

## Non-Functional Requirements

### NFR1: Cost

Solution must use free tier APIs only:
- X Free tier: 1,500 posts/month, media upload included
- LinkedIn: Personal posting, no additional cost for media

### NFR2: Performance

Media upload should complete within reasonable time:
- Images: Under 30 seconds
- Videos: Under 2 minutes for typical blog videos (<10MB)
- Total workflow time increase: Under 3 minutes

### NFR3: Reliability

Media posting should succeed 90%+ of the time when:
- Valid media file exists
- API credentials are active
- File size within limits

### NFR4: Maintainability

Code changes should:
- Extend existing functions rather than rewrite
- Use existing libraries where possible (twitter-api-v2, axios)
- Follow existing code patterns in scripts/

## Constraints

- Must work with existing OAuth credentials (no new app registration)
- Must stay within free tier limits
- Videos must be under 10MB for self-hosted content (per spec 002)
- GitHub Actions timeout: 10 minutes max
- Cannot upload media directly from URLs on LinkedIn (must download first)

## Success Criteria

1. Blog posts with featured images automatically include images in social posts
2. Posts can specify custom images via MEDIA field in comment block
3. Video demo posts can include the demo video in social posts
4. Text posting continues to work if media upload fails
5. GitHub Actions workflow completes within 5 minutes including media upload
6. Media appears correctly on both X and LinkedIn feeds

## Out of Scope

- Multiple images per post (carousel posts)
- Image editing or resizing during upload
- Video transcoding (must be pre-optimized MP4)
- Animated GIF support (convert to MP4 per spec 002)
- External media URLs (must be in repository)
- Thumbnail generation for videos (use LinkedIn auto-generation)
- Caption/subtitle upload for videos
- Image optimization during upload (use pre-optimized assets)

## Dependencies

- Existing social media automation (spec 001)
- Image/video optimization workflow (spec 002)
- `twitter-api-v2` npm package (already installed)
- `axios` npm package (already installed)

## References

- [LinkedIn Images API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/images-api?view=li-lms-2025-11)
- [LinkedIn Videos API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/videos-api?view=li-lms-2025-01)
- [X/Twitter Media Tutorial](https://developer.x.com/en/docs/tutorials/tweeting-media-v2)
- [twitter-api-v2 Documentation](https://github.com/PLhery/node-twitter-api-v2)
- Spec 001: specs/001-automating-sharing-post-to-social-media.md
- Spec 002: specs/002-image-optimization-workflow.md
