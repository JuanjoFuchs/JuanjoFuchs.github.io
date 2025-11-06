---
layout: post
title: "Why I Chose GitHub Pages and Jekyll for My Blog"
description: "I wanted Astro but needed zero hosting maintenance. Here's how I ended up with Jekyll and GitHub Pages, plus the three plugins that handle SEO."
date: 2025-11-06 13:00:00 -0500
categories: blogging meta
tags: [jekyll, github-pages, blogging, seo, static-sites]
author: JuanjoFuchs
---

Welcome to my blog! This post explains why I went with Jekyll and GitHub Pages.

## The Decision

I originally wanted to use [Astro](https://astro.build). I liked the component model and the performance story. But I had one hard requirement: no hosting maintenance.

That requirement pointed me straight to [GitHub Pages](https://pages.github.com). It's free, maintained by GitHub, and builds automatically from Git.

GitHub Pages supports several static site generators, but [Jekyll](https://jekyllrb.com) is what they built it for. The docs assume Jekyll, the integration is native, everything just works.

I looked for Node-based alternatives since Jekyll is Ruby and I'm more comfortable with Node tooling. Then I realized something: I'm not maintaining Jekyll nor I'm writing plugins, I don't need to touch Ruby, GitHub handles all of that, the build just works.

I just write Markdown and Jekyll turns it into HTML.

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
