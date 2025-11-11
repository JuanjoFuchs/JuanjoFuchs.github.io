# Feature Specification: Image Optimization and Media Handling for Jekyll Blog

## Overview

Establish a consistent workflow for optimizing, converting, and managing images for the Jekyll blog to ensure fast load times, good SEO, and efficient repository usage while staying within GitHub Pages constraints.

## Goals

- Reduce image file sizes by 50-70% through WebP conversion and compression
- Improve page load performance by implementing lazy loading and responsive images
- Stay within GitHub Pages repository size limits (1 GB recommended)
- Create a repeatable, simple workflow for adding images to blog posts
- Maintain image quality while optimizing for web delivery
- Automate image optimization to eliminate manual conversion steps

## Requirements

### R1: Directory Structure

The blog must use a consistent, organized directory structure for all media files.

**Required structure**:
- Separate directories for blog post images, page images, and miscellaneous images
- Images must be organized under an `assets/` directory
- Structure must support easy reference from markdown posts

**Rationale**:
- Jekyll automatically processes assets directory
- Consistent structure makes images easy to find and reference
- Separation by content type enables better organization as blog grows

### R2: Image Format and Compression Standards

All images added to blog posts must meet specific format and size requirements.

**Format requirements**:
- Primary format: WebP
- Quality target: 80-85 for WebP
- Fallback support: JPEG format for compatibility
- Target file size: 50-150 KB per image
- Maximum width: 1200px for blog content images
- Featured image dimensions: 1200x630px (16:9 aspect ratio)

**Rationale**:
- WebP provides 25-35% smaller files than JPEG with similar quality
- 1200px is optimal for desktop viewports without being excessive
- 50-150 KB keeps load times fast while maintaining good quality
- 16:9 aspect ratio ensures good display on social media platforms
- 96%+ browser support for WebP as of 2024

### R3: Responsive Images

Images must be served in multiple sizes to optimize bandwidth usage across devices.

**Requirements**:
- Generate at least 3 responsive sizes: mobile (480px), tablet (768px), desktop (1200px)
- Use picture element with multiple source sets
- Provide both WebP and fallback formats for each size
- Serve appropriate size based on viewport
- Must use **jekyll-picture-tag** plugin (https://github.com/rbuchberger/jekyll_picture_tag) for automated responsive image generation

**Rationale**:
- Responsive images save 30-60% bandwidth on mobile devices
- Picture element provides format and size fallbacks
- Improves Core Web Vitals scores
- jekyll-picture-tag is well-maintained and automates responsive image generation at build time

### R4: Lazy Loading

All images must implement lazy loading to improve initial page load performance.

**Requirements**:
- Images should not load until they're near the viewport
- Must work with standard markdown image syntax
- Should be applied automatically without manual intervention
- Must support native browser lazy loading
- Must use **jekyll-loading-lazy** plugin (https://github.com/gildesmarais/jekyll-loading-lazy) for automatic lazy loading injection

**Rationale**:
- Lazy loading improves perceived load time by 40-50%
- Native browser support is 96%+ (modern browsers)
- Reduces initial bandwidth usage significantly
- jekyll-loading-lazy automatically adds lazy loading attributes with zero configuration

### R5: Image Referencing Method

Blog posts must use a consistent method for referencing images.

**Requirements**:
- Support for responsive image generation via liquid tags
- Fallback to standard markdown syntax if needed
- Must work with Jekyll's baseurl configuration
- Alt text must be required and descriptive

**Attributes required**:
- Alt text: Descriptive, under 125 characters, no redundant phrases like "image of"
- Width and height: To prevent cumulative layout shift
- Lazy loading: Automatic application

**Rationale**:
- Liquid tags enable automatic responsive image generation
- Relative URLs work correctly in subdirectories
- Alt text improves SEO and accessibility
- Dimensions prevent layout shift (improves CLS score)

### R6: Image Naming Convention

Image filenames must follow a consistent, SEO-friendly naming convention.

**Requirements**:
- Use lowercase with hyphens as separators
- Include relevant keywords in filename
- Keep concise: 3-5 words maximum
- No special characters or numbers at start
- Format: `descriptive-keyword-phrase.ext`

**Good examples**:
- `laptop-thermal-throttling-issue.webp`
- `github-actions-workflow-example.webp`

**Bad examples**:
- `IMG00023.webp` (generic)
- `screenshot-2025-11-07.webp` (non-descriptive date)
- `my_image.webp` (underscores instead of hyphens)

**Rationale**:
- Descriptive filenames improve SEO
- Hyphens are URL-friendly
- Keywords help search engines understand content
- Consistent naming makes files easier to find

### R7: Automated Image Optimization

Image optimization must be automated to eliminate manual conversion steps.

**Requirements**:
- WebP conversion must happen automatically during site build
- Responsive sizes must be generated automatically
- No manual command-line conversion required for each image
- Optimization must happen in GitHub Actions build environment
- Source images can be in JPEG or PNG format
- Must use **jekyll-picture-tag** plugin for automated WebP conversion and responsive size generation

**Rationale**:
- Manual conversion is error-prone and time-consuming
- Automation ensures consistency across all images
- Developers can focus on content, not image processing
- Build-time generation keeps source repository clean
- jekyll-picture-tag handles both WebP conversion and responsive sizing automatically

### R8: Build Environment Compatibility

The solution must work within GitHub Actions build environment.

**Requirements**:
- All image processing must occur during GitHub Actions build
- No local builds required on developer machine
- Must work with standard GitHub Actions Ubuntu runners
- System dependencies must be installable via apt-get
- Build times must remain reasonable (under 5 minutes for typical posts)

**Rationale**:
- Developer workflow simplified (no local builds)
- Consistent build environment across all contributors
- GitHub Actions provides free build minutes
- Ubuntu runners support necessary image processing tools

### R9: Repository Size Monitoring

Repository size must be monitored to stay within GitHub Pages limits.

**Requirements**:
- Track total repository size
- Monitor size of .git directory
- Provide warnings when approaching limits
- Document process for checking repository size

**Limits to respect**:
- Individual file: 100 MB max
- Repository size: 1 GB recommended, 1 GB hard limit for published site
- Build timeout: 10 minutes

**Rationale**:
- GitHub Pages enforces size limits
- Proactive monitoring prevents hitting limits unexpectedly
- Image optimization is critical for staying under limits

### R10: SEO and Social Media Metadata

Featured images must include proper metadata for social media sharing.

**Requirements**:
- Featured images must be specified in post front matter
- Must support Open Graph meta tags
- Dimensions and alt text must be specified
- Featured images must use 1200x630px dimensions

**Metadata required**:
- Image path
- Width and height
- Alt text description
- Proper Open Graph tags in page head

**Rationale**:
- 1200x630px is optimal for social media previews
- Proper metadata ensures good display on LinkedIn, X/Twitter, etc.
- Alt text improves accessibility and SEO
- Open Graph tags control how content appears when shared

### R11: Build Environment Dependencies

The solution requires specific system dependencies in the GitHub Actions build environment.

**Requirements**:
- ImageMagick must be available in the build environment (required by jekyll-picture-tag)
- Must be installable via apt-get on Ubuntu runners
- Must include libmagickwand-dev for Ruby integration
- Build times must remain reasonable (under 5 minutes for typical posts)

**Rationale**:
- jekyll-picture-tag requires ImageMagick for image processing
- Ubuntu GitHub Actions runners support ImageMagick via apt-get
- System dependencies must be installed before Jekyll build step

## Non-Functional Requirements

### NFR1: Performance

- Page load time with images: Under 3 seconds on 3G connection
- First Contentful Paint (FCP): Under 1.5 seconds
- Cumulative Layout Shift (CLS): Under 0.1
- Largest Contentful Paint (LCP): Under 2.5 seconds

### NFR2: Repository Efficiency

- Image files must not exceed 200 KB each (target: 50-150 KB)
- Total repository size must stay under 500 MB (50% of recommended limit)
- No unoptimized source images in repository after build

### NFR3: Browser Compatibility

- Images must display correctly in all browsers with 95%+ market share
- WebP support: 96%+ browsers (no additional fallback needed)
- Lazy loading: Native browser support 96%+
- Responsive images: Universal picture element support

### NFR4: Workflow Simplicity

- Adding images to posts must take under 2 minutes
- No manual command-line conversion required
- Process must be documented and easy to follow
- Errors must be clear and actionable

### NFR5: Build Reliability

- Image processing must not cause build failures
- Build times must remain under 5 minutes for typical posts
- Cached builds should reuse previously generated images
- Failed image processing should log clear error messages

## Constraints

- Site is built only via GitHub Actions (no local builds on developer machine)
- Must use free, open-source tools and plugins
- Must work on Windows environment for image preparation (if manual workflow needed)
- Image processing plugins require system dependencies in GitHub Actions build environment
- Cannot test image output locally - must push and verify in GitHub Actions build
- Build environment is Ubuntu-latest GitHub Actions runner
- All dependencies must be installable via apt-get or bundler

## Success Criteria

1. All new blog posts use optimized images under 150 KB each
2. Page load time improves by 30-50% compared to unoptimized images
3. Core Web Vitals scores are all "Good" (green)
4. Repository size remains under 500 MB after 50+ blog posts
5. Image optimization happens automatically without manual conversion
6. GitHub Actions builds succeed consistently with image processing
7. Responsive images are generated and served correctly across devices
8. All images have proper alt text and lazy loading
9. Social media previews display correctly with featured images

## Out of Scope

- Image CDN integration (Cloudinary, imgix, etc.) - local hosting preferred for simplicity
- Animated WebP or video content
- Image gallery or lightbox functionality
- Automatic alt text generation (manual alt text only)
- AVIF format (newer format with lower browser support - 75%+)
- Progressive JPEG fallbacks (WebP provides sufficient compatibility)
- Advanced art direction beyond responsive breakpoints
- Real-time image optimization on upload
- Image editing or manipulation beyond resize and format conversion

## Related Specifications

- Social media automation: See specs/001-automating-sharing-post-to-social-media.md
- Blog scheduling: See AGENTS.md for scheduled publishing details
- Agent instructions: See AGENTS.md for blog post conventions and workflows

## References

- [Google WebP Documentation](https://developers.google.com/speed/webp/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Core Web Vitals](https://web.dev/vitals/)
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- Research findings: See agent conversation on 2025-11-07 for detailed media handling research
