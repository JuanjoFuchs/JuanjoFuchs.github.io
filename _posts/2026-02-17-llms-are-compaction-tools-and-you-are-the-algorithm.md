---
layout: post
title: "LLMs Are Compaction Tools, and You Are the Algorithm"
description: "The compaction isn't what the model knows, it's the conversation. Your prompting, judgment, and iteration compress generic AI knowledge into something valuable. You are the algorithm."
date: 2026-02-17 09:00:00 -0500
categories: ai
tags: [ai, writing, productivity, coding, knowledge-management]
author: JuanjoFuchs
image: /assets/llms-compaction-tools-hero.png
---

![Person at a desk filtering chaotic internet data into crystallized knowledge outputs](/assets/llms-compaction-tools-hero.png)

There's a common assumption that LLMs "know everything." They've been trained on the internet's knowledge, they can answer questions about anything, they seem omniscient, but they're not. They've absorbed a lossy representation of roughly [5% of the surface web](https://medium.com/@nandakumar_89332/llms-are-trained-on-only-5-of-the-internet-heres-why-that-matters-24f8dbfbe5a4), mixing Reddit threads, academic papers, YouTube transcripts and conspiracy blogs together with no credibility weighting.

Ask an LLM a vague question and you get a vague answer. The model averages across everything it's ever seen. [Duke research](https://blogs.library.duke.edu/blog/2026/01/05/its-2026-why-are-llms-still-hallucinating/) found that training data contains contradictions, misinformation, and opinions sitting right next to evidence-based sources, and the model doesn't inherently know which are credible. 87% of surveyed students agreed: AI effectiveness depends on prompt quality.

LLMs know everything and nothing at the same time. The quality of what comes out depends entirely on you.

## How Compaction Works

An LLM is like a library containing every book ever written. The attention mechanism inside the transformer is the librarian. Walk in with a vague question and the librarian pulls generic material from the most popular shelf. Walk in with a specific, context-rich question and you get the exact book you need. Same librarian, same library, your question is the only variable.

The compaction is the conversation, the back-and-forth between you and the librarian. You ask, the librarian pulls material, you refine, the librarian adjusts. Each round of that exchange narrows the library's vast, generic knowledge into something specifically valuable to you. Your prompts provide the intent, the context, the judgment about what matters, and through that iterative process the model compacts it into output, whether it's prose, code, a spec, or a synthesis of ideas.

It works like a compiler too. I write high-level code expressing my intent and the compiler turns it into machine instructions. Nobody says I didn't "really" program because the compiler wrote the assembly. Your judgment goes in and compacted output comes out, the model handles the translation.

## You Are the Algorithm

This isn't just a metaphor. An [MIT Sloan study](https://mitsloan.mit.edu/ideas-made-to-matter/study-generative-ai-results-depend-user-prompts-much-models) from August 2025 tested 1,893 participants submitting over 18,000 prompts that generated more than 300,000 images. They randomly assigned people to different AI models and measured the results.

**49% of the performance improvement came from users adapting their prompts.** 51% came from the model upgrade. Half the output quality is you.

When researchers tried to automate the human out by having GPT-4 silently rewrite prompts before they reached the model, output degraded by 58%. Removing the human from the conversation actively destroyed value. The adaptation, the iteration, the judgment about what to ask and how to refine the next prompt, that IS the algorithm. That's what makes compaction lossless.

The best prompters in the study weren't software engineers. They were people who knew how to express ideas clearly in everyday language. Communication and judgment mattered more than technical skill.

[HBR put it this way](https://hbr.org/2026/02/how-do-workers-develop-good-judgment-in-the-ai-era): "AI amplifies existing judgment rather than compensating for its absence." People with deep experience get huge productivity gains from AI while junior employees often can't tell whether AI-generated work is any good. The model is the same for everyone, the algorithm is different.

## Four Faces of Compaction

This plays out the same way across everything I do with AI.

**Writing.** I have ideas, research, notes scattered across my second brain. The LLM serializes them into prose. Without my judgment on what to keep and what to cut, the AI produces generic content that sounds like every other AI-written post on the internet. Thinking was never the bottleneck, writing was, and [AI removed it](https://leaddev.com/velocity/writing-code-was-never-the-bottleneck).

**Specs.** A spec compacts ambiguous requirements, stakeholder needs, and technical constraints into clear direction. The LLM can structure and articulate. Deciding what the product should do requires my domain knowledge from years of building these systems. Spec-first workflows work because they give the AI a high-quality algorithm for everything downstream.

**Code.** I know the architecture and the patterns and the constraints, the "why" behind decisions that never made it into the docs. The LLM compacts that understanding into working implementation. Without my architectural judgment, AI produces code that works in isolation but doesn't fit the system. Same model and training data, different engineer, different output.

**Second Brain.** This is the most powerful form of compaction. A curated second brain is a pre-built algorithm: years of notes and connections and highlights and judgment calls all crystallized into context that shapes everything the AI produces. When I feed curated context from my vault to an LLM, my past judgment amplifies my current prompt. The algorithm has been building for years, not minutes. [Research confirms it](https://www.howdoiuseai.com/blog/2026-01-26-how-to-build-a-second-brain-with-claude-and-obsidi): "the competitive moat shifts to unique knowledge assets, effective curation practices, and organizational learning loops."

## Lossy vs. Lossless

Ted Chiang called LLMs ["a blurry JPEG of the web"](https://www.newyorker.com/tech/annals-of-technology/chatgpt-is-a-blurry-jpeg-of-the-web), retaining much information but providing approximations, with hallucinations as compression artifacts "plausible enough that identifying them requires comparing them against the originals."

Jim Nielsen [extended the analogy](https://blog.jim-nielsen.com/2024/ai-is-like-a-lossy-jpeg/): "AI is lossy compression, but on the level of knowledge not pixels." JPEG artifacts are visible, you can see the blocky edges. AI artifacts are invisible because the model constantly guesses and fills in blanks. The result is "text that looks like knowledge, but upon closer inspection you will find a lack of clarity."

They're describing lossy compaction, and they're right. A generic prompt with no context produces a generic answer full of invisible artifacts. The model averages across everything, fills in blanks with plausible-sounding filler, and the output looks polished while missing everything that matters. HBR calls this ["workslop"](https://hbr.org/2026/02/how-do-workers-develop-good-judgment-in-the-ai-era), polished output that looks professional while degrading actual productivity. The dead internet at the individual level. [Stack Overflow found](https://stackoverflow.blog/2025/11/18/introducing-stack-internal-powering-the-human-intelligence-layer-of-enterprise-ai/) that 95% of enterprise AI pilots fail for this exact reason, no reliable human-validated knowledge base behind the AI.

When you are the algorithm, compaction approaches lossless. You catch the artifacts because you know what the output should contain. You see when the model mangled your point and you know when it added filler that wasn't in your original thinking, so you iterate until the output captures what you actually meant. Each round of conversation tightens the compaction, squeezing out the lossy artifacts until what remains is genuinely yours. The blurry JPEG problem is a description of what happens when nobody is running the algorithm.

## Persist Your Judgment

AI can generate infinite content. Human judgment is the scarce resource. Deciding what matters and what's true and what's worth paying attention to requires an algorithm that no training run can replicate, one built from years of experience, learning, and judgment calls.

When you use AI for compaction, you're persisting the results of your thinking. The people getting the best results have better thinking behind their prompts, richer context, sharper judgment, more domain knowledge feeding through the funnel.

The algorithm is yours, so keep building a better one.

{% comment %}
## LinkedIn Post

PUBLISHED: 2026-02-17T14:52:23.480Z

LLMs are compaction tools, and you are the algorithm. I've been using AI across writing, coding, specs, and my second brain for almost a year now, and this is the mental model that keeps proving itself.

An LLM is like a library containing every book ever written. The compaction isn't what the model has stored inside it, the compaction is the conversation. Your back-and-forth with the AI, the prompting, the refining, the judgment calls about what matters and what doesn't, that's the process that compresses generic knowledge into something specifically valuable to you.

And the quality of that compaction depends entirely on the algorithm you bring to it:

Ask a vague question with no context and you get lossy compaction, a blurry approximation that sounds polished but misses everything that matters. Generic in, generic out.

Bring your judgment, your domain knowledge, your context, iterate on the output, and compaction approaches lossless. You get the exact thing you need because you ran the algorithm that squeezed out the noise.

Once I started thinking this way, it changed how I approach every AI interaction. I stopped blaming the model when output felt generic and started asking what I could feed into the conversation to tighten the compaction. More context from my notes, clearer intent, iterating instead of accepting the first response.

It applies to everything: writing, code, specs, even how I organize my second brain. The AI structures and articulates, I bring the judgment. The better my algorithm, the more lossless the output.

If you're not getting what you want from AI, try treating the conversation as the compaction process. Bring more of your thinking into the prompt, iterate on the output, and see what changes.

Full post with the research backing this up in first comment.

#AI #Productivity #KnowledgeWork #AITools #Engineering

MEDIA: /assets/llms-compaction-tools-hero.png
ALT: Person at a desk filtering chaotic internet data into crystallized knowledge outputs

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/ai/2026/02/17/llms-are-compaction-tools-and-you-are-the-algorithm.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread

PUBLISHED: 2026-02-17T14:52:22.904Z

Tweet 1 (Hook):
LLMs are compaction tools, and you are the algorithm. The compaction isn't what the model knows. It's the conversation, your back-and-forth that compresses generic knowledge into something valuable.

Tweet 2:
Vague prompt + no context = lossy compaction. You get a blurry approximation that sounds polished but misses what matters. Generic in, generic out.

Tweet 3:
Your judgment + domain knowledge + iteration = lossless compaction. Each round of conversation squeezes out the noise until the output is genuinely yours.

Tweet 4:
This applies to everything: writing, code, specs, even your notes. The AI structures and articulates. You decide what matters. Same model for everyone, different algorithms, wildly different results.

Tweet 5:
MIT proved it: 49% of AI output quality comes from you, not the model. When they automated the human out, output degraded by 58%. You can't remove the algorithm without destroying value.

Tweet 6:
Full post on why LLMs are compaction tools and your judgment is the algorithm: https://juanjofuchs.github.io/ai/2026/02/17/llms-are-compaction-tools-and-you-are-the-algorithm.html

#AI #Productivity

MEDIA: /assets/llms-compaction-tools-hero.png
ALT: Person at a desk filtering chaotic internet data into crystallized knowledge outputs

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