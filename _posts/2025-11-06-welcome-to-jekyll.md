---
layout: post
title: "Why I Chose GitHub Pages and Jekyll for My Blog"
description: "Looked at several static site generators and went with the default. Here's why Jekyll's simplicity works perfectly for a blog, plus the three plugins that handle SEO."
date: 2025-11-06 13:00:00 -0500
categories: blogging meta
tags: [jekyll, github-pages, blogging, seo, static-sites]
author: JuanjoFuchs
---

Welcome to my blog! This post explains why I went with Jekyll and GitHub Pages.

## The Decision

I wanted zero hosting maintenance, which pointed me straight to [GitHub Pages](https://pages.github.com). It's free, maintained by GitHub, and builds automatically from Git.

Looked at several static site generators and kept coming back to [Jekyll](https://jekyllrb.com) - the default for GitHub Pages. The docs assume Jekyll, the integration is native, everything just works without configuration.

Jekyll's simplicity is exactly what I want for a blog. I'm not maintaining the generator, I'm not writing plugins, I don't need to touch Ruby. GitHub handles the build, I just write Markdown and it turns into HTML.

## What You Get with Jekyll

Static sites are fast because there's no database and no server-side rendering, just HTML files served from GitHub's CDN. Everything's version controlled in Git, so I can see the history of every post and roll back anything. And it's free with zero hosting bills.

The tradeoff is no dynamic features and no server-side logic, but for a blog I don't need them.

## Three Plugins

[**jekyll-feed**](https://github.com/jekyll/jekyll-feed) generates an RSS/Atom feed so readers can subscribe in their feed reader of choice.

[**jekyll-seo-tag**](https://github.com/jekyll/jekyll-seo-tag) handles all the SEO work: meta tags, Open Graph for social media, Twitter Cards, JSON-LD structured data, and canonical URLs. I don't touch any of it manually.

[**jekyll-sitemap**](https://github.com/jekyll/jekyll-sitemap) creates sitemap.xml so search engines can find all the pages.

I added some basic SEO config (language tag, author metadata, social links, default front matter) and custom descriptions for each post. That's it.

## The Workflow

Write a post in Markdown, add the front matter, commit to Git, and push to GitHub. GitHub Pages builds and deploys automatically.

## Why It Works

I write Markdown and push to Git. GitHub handles everything else. The site loads fast, costs nothing, and I never think about infrastructure.

{% comment %}
## LinkedIn Post

Started my blog with one requirement: zero hosting maintenance. That pointed me straight to GitHub Pages.

Looked at several static site generators and kept coming back to Jekyll - the default for GitHub Pages. Native integration, zero configuration, everything just works. And honestly, that simplicity is exactly what I want for a blog.

Here's what I ended up with:
✅ Jekyll is the default for GitHub Pages, no build workflow setup needed
✅ Three plugins handle everything: jekyll-feed for RSS, jekyll-seo-tag for all meta tags/Open Graph/Twitter Cards/structured data, jekyll-sitemap for search engines
✅ I'm not maintaining the generator, not writing plugins, don't touch Ruby - GitHub handles the build

Workflow is dead simple: write Markdown, commit, push - automatic build and deploy. Static HTML loads fast, costs nothing with GitHub's CDN, and I never think about infrastructure.

Sometimes the default option is the right one. Pretty straightforward actually.

What's your blogging setup? Ever find yourself going back to simpler tools?

#Blogging #Jekyll #GitHubPages #StaticSites #WebDev

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/2025/11/06/welcome-to-jekyll.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread

Tweet 1 (Hook):
Started my blog with one requirement: zero hosting maintenance. That pointed me straight to GitHub Pages. Looked at several static site generators and went with the default one. Here's why. 💡

Tweet 2:
Jekyll is what GitHub Pages was built for - native integration, zero config needed. The docs assume Jekyll, everything just works out of the box. No build workflow setup, no configuration files. ✨

Tweet 3:
Jekyll's simplicity is exactly what I want for a blog. I'm not maintaining the generator, not writing plugins, don't touch Ruby. GitHub handles the build, I just write Markdown and it turns into HTML.

Tweet 4:
Three plugins handle everything: jekyll-feed for RSS, jekyll-seo-tag for all SEO/meta tags/Open Graph/Twitter Cards/structured data, jekyll-sitemap for search engines. I added basic config, that's it. ✅

Tweet 5:
Workflow is dead simple: write Markdown, commit, push. Build and deploy happen automatically. Site loads fast from GitHub's CDN, costs nothing, I never think about infrastructure.

Tweet 6:
Sometimes the default option is the right one. Full breakdown: https://juanjofuchs.github.io/2025/11/06/welcome-to-jekyll.html

#Blogging #WebDev

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
