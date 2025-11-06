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
