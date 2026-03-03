---
layout: post
title: "Building Your Second Brain, Part 3: The Spec That Wrote This Post"
description: "AI can draft a blog post in minutes. The bottleneck shifted from writing to thinking. A one-page spec borrowed from screenwriting captures your arc, angles, and scope before AI writes a word. This post teaches the workflow and proves it by revealing its own spec."
date: 2026-03-03 09:00:00 -0500
categories: productivity
tags: [second-brain, ai, productivity, writing, content-creation]
author: JuanjoFuchs
image: /assets/spec-blueprint-to-post.png
---

![A spec document with visible structure transforming into a finished blog post, blueprint-to-building aesthetic](/assets/spec-blueprint-to-post.png)

[Part 1](https://juanjofuchs.github.io/productivity/2025/12/16/making-second-brain-ai-compatible.html) was about making my second brain AI-readable, markdown, YAML, wikilinks. [Part 2](https://juanjofuchs.github.io/productivity/2026/02/24/building-your-second-brain-part-2-when-ai-moves-in.html) covered what happened when AI started operating inside it, routing tables, search tools, CLI scripts. This post is about the artifact that sits between "I have an idea" and "AI writes the draft."

I can prompt Claude to draft a 2,000-word blog post in about two minutes. The words come out coherent, well-structured, publishable-looking, that's the easy part now. The hard part is knowing what I want to say, the angle, the arc, what to include and what to cut. The first few posts I wrote with AI, I'd give it a topic and some bullet points and it would give me back something that read fine but didn't say what I meant. The ending didn't land because there was no arc to land. The angle drifted because I never committed to one. I'd end up rewriting most of it, which defeats the point, I was handing off execution without doing the thinking first.

Every post on this blog now starts with a spec. A one-page planning document that captures what I want to say before AI writes a word. The spec you're about to learn how to write is the same one I used to write what you're reading. It's at the bottom if you want to skip ahead, but reading how it works first makes it more useful.

## What a Spec Is (and What It Isn't)

Three fields solved this problem independently.

Content marketing calls it a "content brief." It's focused on SEO, target keywords, word count, audience persona, recommended headers. [HubSpot's research](https://blog.hubspot.com/marketing/content-brief) says 90% of the writing work happens at the outline stage, not during drafting. The brief prevents misalignment before the expensive work begins.

In screenwriting it's called a "treatment." Focused on story, arc, characters, themes, conflict, resolution. Jon James Miller [describes it](https://gideonsway.wordpress.com/2010/03/09/treatments-vs-scriptments/) as a "structural X-ray" that forces you to see the skeleton of your story before writing dialogue. When the treatment is solid, "scripting becomes infinitely easier, words fly onto the page."

AI-assisted development calls it a "spec.md." Addy Osmani at Google [advocates](https://addyosmani.com/blog/ai-coding-workflow/) a Spec → Plan → Code methodology where you never jump straight to implementation. He calls the upfront investment a "waterfall in 15 minutes," rapid structured planning that smooths everything downstream.

My blog post spec borrows from screenwriting because all three fields landed on the same thing: plan before you write. I don't plan for keywords or word count, I plan for arc, tension, resolution, and angles across formats. [Hannah Sanderson at Atlassian](https://www.atlassian.com/blog/design/from-script-to-screens-how-i-used-my-other-life-as-a-screenwriter-to-craft-a-hit-content-strategy) puts it well: "content design is its own form of screenwriting, it's merely the size of the screen that differs."

## The Seven Attributes

Every spec I write covers seven things. Each one prevents a specific failure mode.

**0. Stakes / Why Now.** Forces you to articulate why this post needs to exist today, what tension makes it timely. This prevents writing posts that could've been published any time with no urgency, and if I can't answer "why now" the post isn't ready.

**1. Arc (Setup → Tension → Resolution).** The narrative flow: what the reader already knows coming in, the counterintuitive claim, and the core insight. Without an arc a post reads like a list of facts with no reason to keep going.

**2. Angles (Blog, LinkedIn, X/Twitter).** Each format gets its own framing. The blog gets the full narrative, LinkedIn gets the professional takeaway, X gets the provocative hook. Writing three angles forces me to think about the core insight from different directions, and that sharpens the blog angle.

**3. Topic.** One sentence that forces me to commit to what the post is actually about, and if I can't write that sentence I haven't thought it through.

**4. Sections.** Headers with 1-3 bullets each describing the key point or evidence that section delivers. This is the skeleton, and anything that doesn't fit a section doesn't belong in the post.

**5. Hero Image Concept.** Visual direction decided upfront, what the image represents, the mood, the metaphor. Prevents the scramble at publish time where you're looking for a stock photo that vaguely relates to the topic.

**6. Scope Boundaries.** What the post is NOT about. I find this the most useful because AI fills gaps confidently and you won't notice the drift until you check. The spec for this post says "NOT about: the editorial loop" and "NOT about: the full pipeline from capture to publication" because those are Parts 4 and 5, and I'd absolutely wander into them without the constraint.

The whole thing fits on one page and takes about 20 minutes with AI helping brainstorm, because if the spec takes longer than the post itself you've over-engineered it.

## The Spec as Context Engineering

The spec does more than organize the post, it loads your arc and angle into the AI's context window, tells the model what to emphasize and what to skip before it writes anything. Without a spec I'm asking AI to guess all of that from a topic sentence, and it'll guess confidently in the wrong direction.

Osmani frames this well: ["having a clear spec means when we unleash the codegen, both the human and the LLM know exactly what we're building and why."](https://addyosmani.com/blog/ai-coding-workflow/) [ClickRank's 2026 research](https://www.clickrank.ai/ai-driven-content-workflow/) puts AI-assisted content workflows at 80% AI labor, 20% human judgment. The spec is the primary vehicle for that 20%.

I wrote about how [LLMs are compaction tools](https://juanjofuchs.github.io/ai/2026/02/17/llms-are-compaction-tools-and-you-are-the-algorithm.html), the model has access to vast knowledge and you decide where it focuses. The spec is how you make that decision explicit before the drafting starts.

## Pre-Flight and Post-Flight

Miller discovered something useful about screenwriting treatments: they work in both directions.

**Pre-flight** is the obvious use. Write the spec before drafting to plan the structure, catch problems early, align direction. You're checking whether the arc holds, the angles are distinct, the scope is clear. Fixing a 1-page spec is much easier than restructuring a 2,000-word draft.

**Post-flight** is the diagnostic use. After the draft is done, check it against the spec. Check whether the arc held or the post wandered, whether each section delivered what it promised, whether the scope boundaries stayed intact.

The post-flight catches a failure mode specific to AI-assisted writing: the draft that "reads well" but drifted from your intent. AI produces confident, polished prose that sounds right, and that confidence makes drift harder to spot without something external to check against.

My full workflow:

```
Idea → Research → Spec → Draft → Editorial Loop → Check against spec → Finalize
```

The spec bookends the writing process, starting as a planning tool and finishing as a quality check after the draft is done.

## This Post's Spec

This is the actual spec I wrote before drafting what you just read. Check whether each section delivered, whether the arc held, whether the scope boundaries stuck, that's the post-flight from the previous section playing out as you read.

---

> **Stakes / Why Now**
>
> AI removed the writing bottleneck. The thinking bottleneck remains. Part 2 went live last week, series is warm. This answers "how do you actually write these posts?"
>
> **Arc**
>
> - **Setup:** AI drafts 2,000 words in minutes. Writing is no longer the hard part.
> - **Tension:** Speed without direction produces slop. Drafts that read well but wander, angles that drift, endings that don't land.
> - **Resolution:** The spec — a one-page narrative planning doc borrowed from screenwriting, not SEO. And here's the one I used to write this post.
>
> **Angles**
>
> - **Blog:** Self-referential. Teach the spec by showing this post's spec. Three fields validate the approach.
> - **LinkedIn:** AI drafts in 60 seconds, the spec takes 20 minutes. That's where the thinking lives.
> - **X/Twitter:** AI made writing easy. It didn't make thinking easy. The spec for this post is at the bottom.
>
> **Topic**
>
> A one-page spec captures arc, angles, and scope before AI drafts a word. Three industries converge on the same idea. This post teaches the workflow and proves it by revealing its own spec.
>
> **Sections**
>
> - Introduction: Writing Got Easy, Thinking Didn't
> - What a Spec Is (and What It Isn't)
> - The Seven Attributes
> - The Spec as Context Engineering
> - Pre-Flight and Post-Flight
> - The Reveal: This Post's Spec
>
> **Hero Image Concept**
>
> Blueprint-to-building metaphor. Spec document on one side with visible structure, finished post on the other.
>
> **Scope Boundaries**
>
> - NOT about: editorial loop / reviewer agent (Part 4)
> - NOT about: full pipeline from capture to publication (Part 5)
> - NOT about: SEO, keyword research, content marketing strategy
> - NOT about: vault structure, AGENTS.md (Parts 1-2)

---

If your AI-assisted drafts keep coming out vaguely right but not quite what you meant, try writing a one-page spec first, about 20 minutes of thinking before AI writes anything.

{% comment %}
## LinkedIn Post
PUBLISHED: 2026-03-03T14:50:41.061Z

MEDIA: /assets/spec-blueprint-to-post.png
ALT: A spec document with visible structure transforming into a finished blog post

Every blog post I write starts the same way. 20 minutes with a one-page document before AI writes a single word.

AI can draft 2,000 words in two minutes. The words come out coherent, publishable-looking. That's the easy part. The hard part is knowing what you want to say, what's the angle, what's the arc, what to include and leave out.

I kept getting drafts that read fine but didn't say what I meant. Endings didn't land, angles drifted. I was handing off execution without doing the thinking first.

Three fields solved this independently:
📌 Content marketing calls it a "content brief" (SEO-focused)
📌 Screenwriting calls it a "treatment" (narrative-focused)
📌 AI dev calls it a "spec.md" (requirements-focused)

My version borrows from screenwriting. Seven attributes: stakes, arc, angles, topic, sections, hero image, scope boundaries. One page, 20 minutes. The spec primes AI's context window with your editorial intent so it knows exactly what to write and what to skip.

The proof: the spec I used to write this post is included at the bottom. You can check the finished piece against the blueprint.

Part 3 of the Building Your Second Brain series 👇
https://juanjofuchs.github.io/productivity/2026/03/03/building-your-second-brain-part-3-the-spec-that-wrote-this-post.html

#SecondBrain #AI #Writing #ContentCreation #Productivity

---

## X/Twitter Thread
PUBLISHED: 2026-03-03T14:50:40.246Z

MEDIA: /assets/spec-blueprint-to-post.png
ALT: A spec document with visible structure transforming into a finished blog post

Tweet 1 (Hook):
AI can draft a blog post in 2 minutes. The 20-minute spec I write first is where the actual thinking lives. Three industries figured this out independently. 🔥

Tweet 2:
Content marketing calls it a "content brief." Screenwriting calls it a "treatment." AI dev calls it a "spec.md." Same conclusion: plan structure first, write second. HubSpot says 90% of writing work happens at the spec stage. 💡

Tweet 3:
Seven attributes in a blog post spec: stakes, arc, angles, topic, sections, hero image, scope boundaries. The most useful one is scope boundaries — what the post is NOT about. Drift happens in the gaps, and AI-generated drift is harder to spot because the prose sounds confident.

Tweet 4:
The spec also works as a post-flight diagnostic. After the draft is done, check it against the spec. Did the arc hold? Did the angle drift? AI produces polished prose that sounds right even when it wandered from your intent. The spec makes drift visible. ✅

Tweet 5:
Full breakdown with the actual spec I used to write this post revealed at the end:
https://juanjofuchs.github.io/productivity/2026/03/03/building-your-second-brain-part-3-the-spec-that-wrote-this-post.html

#SecondBrain #AI

---
INSTRUCTIONS:
- LinkedIn: Post Tuesday-Thursday 8-10 AM EST. URL in post body (comments API unavailable).
- X/Twitter: Post as thread. Image attached to first tweet. Link only in last tweet.
{% endcomment %}