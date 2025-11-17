---
layout: post
title: "Automating Social Media Posting for My Jekyll Blog"
description: "Built a GitHub Actions workflow that automatically posts new blog content to X and LinkedIn. No paid services, no external hosting, just Node.js scripts and API calls."
date: 2025-11-18 09:00:00 -0500
categories: automation
tags: [github-actions, nodejs, automation, social-media, jekyll]
author: JuanjoFuchs
---

I wanted every new blog post to automatically show up on X (Twitter) and LinkedIn without me having to manually copy-paste content. The constraint was simple: no paid services, no external hosting, everything runs on GitHub Actions free tier.

Here's what I built and how it works.

## The Problem

Writing a blog post is one thing, promoting it is another. I'd write a post, publish it, then need to:
- Draft a LinkedIn post with the right format and hashtags
- Create an X thread breaking down the key points
- Remember to post the blog link in a LinkedIn comment (not the main post, because algorithm penalties)
- Post the link in the last tweet of the X thread

This takes 15-20 minutes per post and it's easy to forget or delay. I wanted it automatic.

## The Constraints

I'm already using GitHub Pages for hosting, which means GitHub Actions is available. I didn't want to:
- Pay for IFTTT Pro ($2.49/month minimum) or Zapier
- Set up external hosting for automation scripts
- Use services that might shut down or change pricing

The entire solution needed to run on free tiers: GitHub Actions, X API, LinkedIn API.

## The Approach

### Content Storage

Social media content is pre-written in Liquid comment blocks at the end of each blog post. These comments are completely removed during Jekyll's build, they never appear in the published HTML.

```markdown
{% raw %}{% comment %}
## LinkedIn Post
[Pre-written post content with hashtags]

---

## X/Twitter Thread
Tweet 1: [Content]
Tweet 2: [Content]
...
{% endcomment %}{% endraw %}
```

This keeps the content alongside the post, version controlled, and easy to edit. No separate database, no external CMS.

### Architecture

The automation runs as a GitHub Actions job that triggers after the scheduled post publishing workflow completes every Tuesday at 9 AM EST:

1. **Rebuild job** - Creates empty commit to trigger Jekyll rebuild
2. **Post-to-social-media job** - Runs after rebuild:
   - Finds posts published in last 7 days
   - Extracts social content from Liquid comments
   - Posts to X and LinkedIn in parallel

### Implementation Stack

**Node.js scripts** (5 modules, ~650 lines total):
- `extract-social-content.js` - Parses markdown, extracts Liquid comments, builds blog URLs
- `post-to-x.js` - X API client using twitter-api-v2 library, chains tweets into threads
- `post-to-linkedin.js` - LinkedIn API client using axios, posts content then adds comment with blog URL
- `post-to-social-media.js` - Main orchestrator, runs both platforms in parallel
- `mark-post-published.js` - Adds PUBLISHED timestamps to prevent duplicate posting

**Dependencies**:
- `gray-matter` - Parse markdown front matter
- `twitter-api-v2` - X/Twitter OAuth 1.0a and v2 API
- `axios` - HTTP requests for LinkedIn OAuth 2.0 API

**GitHub Secrets** (5 credentials):
- X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET
- LINKEDIN_ACCESS_TOKEN

### Key Design Decisions

**Platform independence**: Each platform operates independently. LinkedIn failure doesn't affect X posting, X failure doesn't affect LinkedIn. Workflow always exits with success even if one platform fails.

**No content generation**: The system extracts and posts pre-written content, it doesn't generate anything. Content format guidelines are documented separately (in AGENTS.md), the automation just parses and posts.

**7-day window**: The workflow looks for posts dated within the last 7 days. This means if you publish multiple posts in one week, they all get posted on Tuesday. If a post's social posting fails, the next Tuesday retries it.

**Link placement strategy**:
- **LinkedIn**: Main post has no link, first comment contains blog URL (avoids 25-40% algorithm reach penalty)
- **X/Twitter**: Link only in last tweet of thread (algorithm suppresses posts with links in main content)

**Duplicate prevention**: After successfully posting to a platform, the workflow adds a `PUBLISHED: [timestamp]` flag to that platform's section in the Liquid comment block and commits it back to the repo. The extraction module checks for these flags and skips already-posted content, so running the workflow multiple times never creates duplicates.

### The Workflow

Here's the core GitHub Actions logic:

```yaml
post-to-social-media:
  runs-on: ubuntu-latest
  needs: rebuild

  steps:
  - name: Checkout repository
    uses: actions/checkout@v4

  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '20'

  - name: Install dependencies
    run: |
      cd scripts
      npm install

  - name: Find and post newly published posts
    env:
      X_API_KEY: ${{ secrets.X_API_KEY }}
      X_API_SECRET: ${{ secrets.X_API_SECRET }}
      X_ACCESS_TOKEN: ${{ secrets.X_ACCESS_TOKEN }}
      X_ACCESS_TOKEN_SECRET: ${{ secrets.X_ACCESS_TOKEN_SECRET }}
      LINKEDIN_ACCESS_TOKEN: ${{ secrets.LINKEDIN_ACCESS_TOKEN }}
    run: |
      # Find posts from last 7 days
      for post in _posts/*.md; do
        POST_DATE=$(basename "$post" | grep -oE '^[0-9]{4}-[0-9]{2}-[0-9]{2}')
        if [[ "$POST_DATE" >= "$WEEK_AGO" && "$POST_DATE" <= "$CURRENT_DATE" ]]; then
          node scripts/post-to-social-media.js "$post"
        fi
      done

  - name: Commit published flags
    run: |
      git config user.name "GitHub Actions Bot"
      git config user.email "actions@github.com"

      if git diff --quiet _posts/; then
        echo "No changes to commit"
      else
        git add _posts/
        git commit -m "chore: mark social media posts as published [skip ci]"
        git push
      fi
```

### Content Extraction Logic

The extraction module uses regex to find Liquid comment blocks, then parses the LinkedIn and X/Twitter sections:

**For X/Twitter**:
- Extracts individual tweets labeled "Tweet 1", "Tweet 2", etc.
- Maintains order for threading
- Removes "INSTRUCTIONS" section

**For LinkedIn**:
- Extracts main post content (everything before "INSTRUCTIONS")
- Posts content, then immediately adds first comment with blog URL

Both platforms ignore the INSTRUCTIONS sections I include in the Liquid comments for manual posting reference.

## API Setup

### X (Twitter) Developer Account

1. Applied at developer.twitter.com/en/portal/dashboard
2. Created app in Developer Portal
3. Generated API Key, API Secret, Access Token, Access Token Secret
4. Free tier limits: 1,500 posts/month, 17 posts/24 hours (way more than needed for weekly posts)

### LinkedIn Developer App

1. Created app at linkedin.com/developers/apps
2. Requested "Sign In with LinkedIn" and "Share on LinkedIn" permissions
3. Generated OAuth 2.0 Access Token
4. Token expires every 2 months (manual refresh required)

### GitHub Secrets

Added all five credentials in repository Settings → Secrets and variables → Actions. The workflow injects them as environment variables, never logged or exposed.

## Testing

Initial test failed with a bash syntax error in the date comparison logic. The fix was changing:

```bash
if [[ "$POST_DATE" >= "$WEEK_AGO" && "$POST_DATE" <= "$CURRENT_DATE" ]]; then
```

To:

```bash
if [[ "$POST_DATE" > "$WEEK_AGO" || "$POST_DATE" == "$WEEK_AGO" ]] && [[ "$POST_DATE" < "$CURRENT_DATE" || "$POST_DATE" == "$CURRENT_DATE" ]]; then
```

The `>=` and `<=` operators weren't valid in that bash conditional syntax. After fixing that, the workflow ran successfully and posted to both platforms.

## What This Enables

Now I can write a blog post, add the social media content in Liquid comments at the end, set a future date in the front matter, and commit. On Tuesday morning, the post goes live on the blog and automatically appears on X and LinkedIn within minutes.

No manual steps, no remembering to promote, no context switching from writing to marketing.

## The Caveats

**LinkedIn token maintenance**: The OAuth token expires every 2 months. I need to manually refresh it and update the GitHub Secret. This is acceptable overhead for a free solution.

**Content must be pre-written**: This isn't AI-generated social posts, it's automation of pre-written content. I still write the LinkedIn post and X thread myself, but I write them once alongside the blog post instead of copy-pasting later.

**Manual intervention for failures**: If a post fails to publish (API error, rate limit, etc.), the workflow exits successfully but the post won't have the PUBLISHED flag. Next Tuesday it'll retry automatically, which is usually what you want. For immediate retry, you can manually trigger the workflow from the Actions tab.

## Cost

Zero. Everything runs on free tiers:
- GitHub Actions: Free for public repositories
- X API: Free tier (1,500 posts/month)
- LinkedIn API: Free for personal posting
- GitHub Pages: Free hosting

## Time Investment vs Savings

**Implementation**: About 2 hours total (research, coding, testing, debugging)

**Time saved per post**: 15-20 minutes

**Break-even**: After ~7 posts, or less than 2 months at weekly cadence

But the real value isn't just time saved, it's consistency. I won't forget to promote a post or delay it because I'm busy. Every post gets promoted, on schedule, every time.

## Code

The full implementation is in the blog repository:
- Feature spec: `specs/001-automating-sharing-post-to-social-media.md`
- Scripts: `scripts/` directory
- Workflow: `.github/workflows/schedule-rebuild.yml`

All MIT licensed, use it however you want.

{% comment %}
## LinkedIn Post

Spent 2 hours building automation so I'd never have to manually post blog links to social media again. Now every new post automatically appears on X and LinkedIn within minutes of going live. 💡

The setup uses GitHub Actions, Node.js scripts, and free-tier APIs from X and LinkedIn. No paid services, no external hosting, everything runs on GitHub's infrastructure. The social media content lives in Liquid comment blocks at the end of each blog post, completely hidden from the published HTML.

Here's what made this work:
✅ Platform independence - one failure doesn't affect the other
✅ Strategic link placement - LinkedIn comment not main post, X last tweet only
✅ Duplicate prevention - PUBLISHED timestamps prevent re-posting, safe to run multiple times
✅ Pre-written content - I write the social posts alongside the blog, automation just extracts and posts
✅ Zero cost - all free tiers

The workflow runs every Tuesday at 9 AM, finds posts published in the last 7 days, extracts their social content, and posts to both platforms in parallel. Took 2 hours to build, saves 15-20 minutes per post, breaks even at 7 posts.

Time saved is nice, but the real win is consistency. Every post gets promoted, on schedule, no exceptions.

Full code and implementation details in the post (link in first comment).

#DevOps #Automation #GitHub #SocialMedia #Jekyll

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/automation/2025/11/18/automating-blog-social-media-posting.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread

Tweet 1 (Hook):
Spent 2 hours building automation so I'd never manually post blog links to social media again. Now everything just happens automatically. Here's how it works. 🔥

Tweet 2:
The setup runs on GitHub Actions (free tier). When a blog post publishes on Tuesday mornings, a Node.js script extracts pre-written social content from the markdown file and posts to X and LinkedIn. 💡

Tweet 3:
The social media content lives in Liquid comment blocks at the end of each blog post. Jekyll completely removes these during build, so they never appear in the published HTML. Version controlled, easy to edit.

Tweet 4:
Key trick: LinkedIn link goes in first comment (not main post) to avoid 25-40% reach penalty. X link goes in last tweet only. Platform algorithms suppress posts with links in main content. ✅

Tweet 5:
Each platform runs independently. LinkedIn failure doesn't affect X, X failure doesn't affect LinkedIn. Workflow always succeeds even if one platform fails. This was critical for reliability.

Tweet 6:
After posting, the workflow adds PUBLISHED timestamps to the markdown file and commits them back. This prevents duplicate posts if you run the workflow multiple times. Safe to retry, safe to trigger manually. ✅

Tweet 7:
Cost: $0. GitHub Actions free tier, X API free tier (1,500 posts/month), LinkedIn API free for personal posting. Everything runs on GitHub's infrastructure, no external hosting needed.

Tweet 8:
Time investment: 2 hours to build. Time saved: 15-20 min per post. Break-even: 7 posts (less than 2 months). But the real value is consistency - every post gets promoted, on schedule, no exceptions.

Tweet 9:
Full implementation details, code, and GitHub Actions workflow here: https://juanjofuchs.github.io/automation/2025/11/18/automating-blog-social-media-posting.html

#DevOps #Automation

---
INSTRUCTIONS:
1. Post as a thread on Wednesday at 9 AM EST (or Tue-Thu between 8-11 AM or 12-2 PM EST)
2. Keep each tweet under 280 characters
3. Link goes in the LAST tweet only (X algorithm suppresses posts with links)
4. Use only 1-2 hashtags total (at the end)
5. Add custom graphic/image to first tweet if possible
6. Engage with replies in first hour for algorithm boost

ALTERNATIVE (Single Post):
If you prefer a single post instead of thread, post the hook without link, then immediately reply to your own post with the blog URL.
{% endcomment %}
