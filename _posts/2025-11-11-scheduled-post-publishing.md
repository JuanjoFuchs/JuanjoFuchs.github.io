---
layout: post
title: "How I Automated Post Publishing with GitHub Actions"
description: "Setting up scheduled publishing for Jekyll with GitHub Actions. Posts go live every Tuesday at 9 AM EST automatically."
date: 2025-11-11 09:00:00 -0500
categories: blogging automation
tags: [jekyll, github-actions, automation, scheduling, workflow]
author: JuanjoFuchs
---

If you're reading this, my automated publishing system works! This post was scheduled in advance and went live automatically on Tuesday morning at 9 AM Eastern.

## The Problem

Jekyll builds your entire site at one point in time, there's no server checking every minute whether a post should go live like WordPress does. Once Jekyll builds, the site stays frozen until the next build, so scheduling posts for the future requires a workaround.

## The Solution

The system uses two pieces: Jekyll's built-in `future` setting and GitHub Actions scheduled workflows.

### Part 1: Jekyll's `future` Setting

In `_config.yml`, I set `future: false`:

```yaml
# Publishing settings
future: false  # Don't publish posts with future dates
```

When Jekyll builds, any post dated after the build time gets ignored. The posts exist in the repo, but they don't appear on the live site.

### Part 2: Scheduled Rebuilds

I use GitHub Actions with a cron schedule to rebuild the site every Tuesday morning.

Here's the workflow file (`.github/workflows/schedule-rebuild.yml`):

```yaml
name: Schedule Jekyll Post Publishing

on:
  schedule:
    # Runs every Tuesday at 1:00 PM UTC (9:00 AM EST)
    - cron: '0 13 * * 2'

  # Allows manual triggering from the Actions tab
  workflow_dispatch:

permissions:
  contents: write

jobs:
  rebuild:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
      with:
        token: ${{ secrets.GITHUB_TOKEN }}

    - name: Configure Git
      run: |
        git config user.name "GitHub Actions Bot"
        git config user.email "actions@github.com"

    - name: Trigger rebuild for scheduled posts
      run: |
        git commit --allow-empty -m "chore: trigger rebuild for scheduled posts [skip ci]"
        git push
```

## How It Works

Every Tuesday at 9 AM EST, the GitHub Action runs and creates an empty commit. That commit triggers GitHub Pages to rebuild, Jekyll checks all post dates again, and posts that were "in the future" are now published. The empty commit changes nothing, it just signals GitHub Pages to rebuild.

## Why Tuesday at 9 AM?

Blog engagement data shows Tuesday mornings (9-11 AM) get the most views. Monday is catch-up day so Tuesday is when people actually read, email and social media traffic peaks then, and content has all week to spread. Publishing at the same time each week also sets expectations, readers know when to check back.

## How to Schedule a Post

Create the post file with a future date like `_posts/2025-11-18-my-future-post.md`, set the date in front matter:
```yaml
---
layout: post
title: "My Future Post"
description: "This will publish automatically"
date: 2025-11-18 09:00:00 -0500
categories: your-category
tags: [tag1, tag2]
author: JuanjoFuchs
---
```

Then commit and push:

```bash
git add _posts/2025-11-18-my-future-post.md
git commit -m "Schedule post for Nov 18"
git push
```

The post goes live on the next Tuesday at 9 AM EST after the scheduled date. If you need to publish early, the workflow includes a manual trigger in the Actions tab.

The cron runs at 13:00 UTC which is 9:00 AM EDT or 8:00 AM EST depending on the season. I always include the timezone offset in post dates (`date: 2025-11-18 09:00:00 -0500`) so posts publish at the right local time.

## Testing Locally

Preview scheduled posts during development with the `--future` flag:

```bash
bundle exec jekyll serve --future
```

This shows all future-dated posts so you can check formatting before they go live.

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jekyll Configuration](https://jekyllrb.com/docs/configuration/)
- [Cron Schedule Syntax](https://crontab.guru/)
- [Best Times to Publish Blog Posts](https://neilpatel.com/blog/best-time-to-publish-blog-posts/)

{% comment %}
## LinkedIn Post
PUBLISHED: 2025-11-11T13:25:00Z

If you're reading this, my automated publishing system works! This post was scheduled in advance and went live automatically on Tuesday morning at 9 AM Eastern.

Jekyll doesn't have WordPress-style scheduled publishing built in. Once Jekyll builds your site, it stays frozen until the next build. But I needed scheduled posts without manually triggering builds every week.

Here's the setup that makes it work:
✅ Jekyll's `future: false` setting hides posts dated after build time
✅ GitHub Actions cron job rebuilds the site every Tuesday at 9 AM EST
✅ Empty commit triggers GitHub Pages rebuild, future posts become current

The workflow is dead simple: write post with future date, commit, push. That's it. The post goes live on the next Tuesday at 9 AM EST automatically.

Why Tuesday at 9 AM? Blog engagement data shows Tuesday mornings (9-11 AM) get the most views. Monday is catch-up day, Tuesday is when people actually read. Email and social media traffic peaks then, and content has all week to spread.

Pretty straightforward actually. Set it up once, schedule posts forever.

Ever automate something that saves you time every week? What's your scheduling setup?

#Blogging #Automation #GitHubActions #Jekyll #WorkflowAutomation

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/blogging/automation/2025/11/11/scheduled-post-publishing.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread
PUBLISHED: 2025-11-11T13:25:00Z

Tweet 1 (Hook):
If you're reading this, my automated publishing system works! This post was scheduled weeks in advance and went live automatically on Tuesday morning. Here's how I set up scheduled publishing for Jekyll. 💡

Tweet 2:
Jekyll doesn't have WordPress-style scheduled publishing. Once it builds, the site stays frozen until next build. But I needed posts to go live automatically without manually triggering builds every week. ✨

Tweet 3:
The solution uses two pieces: Jekyll's `future: false` setting hides posts dated after build time, and GitHub Actions cron job rebuilds the site every Tuesday at 9 AM EST.

Tweet 4:
The GitHub Action creates an empty commit that triggers GitHub Pages to rebuild. Jekyll checks post dates again, and posts that were "in the future" are now published. The commit changes nothing, it just signals a rebuild. ✅

Tweet 5:
Workflow is dead simple: write post with future date, commit, push. That's it. Post goes live on the next Tuesday at 9 AM EST automatically. No manual triggers, no thinking about it.

Tweet 6:
Set it up once, schedule posts forever. Full technical breakdown with workflow file and code: https://juanjofuchs.github.io/blogging/automation/2025/11/11/scheduled-post-publishing.html

#Automation #Jekyll

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
