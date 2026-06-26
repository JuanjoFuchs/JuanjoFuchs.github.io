---
layout: post
title: "How I Write Specs with AI"
description: "A slash command will now generate a spec from one line. The value of a spec is the thinking it forces, and a one-line prompt skips all of it."
date: 2026-06-30 09:00:00 -0400
categories: ai-development
tags: [ai, specs, spec-driven-development, llm, productivity]
author: JuanjoFuchs
image: /assets/how-i-write-specs-with-ai-hero.png
---

![A human engineer explains an idea with hand gestures while a robot interviewer takes notes on a sparse stage](/assets/how-i-write-specs-with-ai-hero.png)

There are a lot of tools now that can turn a one-line idea into a full spec. In a handful of commands you get a constitution document, multiple specification files, and task breakdown files. GitHub's [Spec Kit](https://github.com/github/spec-kit) does it, Amazon's Kiro does its own version, and "spec-driven development" is spreading fast. Everyone's arriving at the same thing I've believed for a while, that the spec matters more than the code.

I should be glad about this. I'm not, entirely.

You type a one-line prompt, the tool generates a polished document, and it looks authoritative. Headings, principles, acceptance criteria, the works. So you skim it, it reads fine, you hit go. The judgment in that document is whatever was in your one line, which is close to nothing. You didn't make any decisions. The tool made them for you and dressed them up so they read like yours.

## A finished-looking spec is the easiest to rubber-stamp

[Sean Grove at OpenAI](https://www.youtube.com/watch?v=8rABwKRsec4) put it well. He says the code is maybe ten to twenty percent of the value, the rest is the structured communication of intent. Generating code from a throwaway prompt is like shredding the source and carefully version-controlling the binary. The prompt was the source. The spec the tool spat out is the binary, the polished output with the thinking compiled out of it. You saved the wrong artifact.

These tools don't have to be used the shallow way. Spec Kit has a clarify step that scans for ambiguity, an analyze step, review gates. Run all of them and actually argue with the output, and you encode real judgment. The problem is the default path doesn't make you do any of that, and a document that looks finished is the most rubber-stampable thing in the world. The danger is the one-command version defaults to the path where nobody does the work.

## The way that works is to get grilled

I don't ask the AI to write me a spec. I ask it to interview me.

There's a tiny skill going around called [grill-me](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md), really just a handful of sentences you can paste into your prompt, that does exactly this. It tells the model to interview you relentlessly, walk down each branch of the design tree, resolve dependencies one at a time, and give its own recommended answer for each. You start with a rough idea and the model pushes on it. Why this and not that, what happens at the edge, what did you mean by "fast". Half the questions I can't answer right away, which means I didn't actually know what I wanted yet. So I go research it, I make a call, I write the reason down.

By the time the interview's done the spec basically writes itself, because the decisions already got made out loud. It's the protégé effect: teaching the AI forces you to research, get clarity, and surface the unknowns you didn't know you had.

## What goes in the spec, and how I run it

Once we're clear, I have the model write it down. The spec documents the what, not the how. It records the decisions we made in the conversation, with the reasons behind them. And it encodes my goals as [acceptance criteria the model can check its own work against](https://juanjofuchs.github.io/ai-development/2026/02/10/give-your-ai-hills-to-climb.html), so it knows objectively when it's done instead of guessing.

It runs as two phases in two separate context windows, one for the spec and one for the build. Models hold a million tokens now, but I deliberately scope each phase to 200k to 400k, effective attention drops off and Claude Code starts auto-compacting well before that limit, so I keep the work small enough to finish clean. Start to finish:

1. **Get grilled into a spec.** The interview from before, the model questions me until every decision is made out loud and written down.
2. **Compact down to the spec.** I `/compact` to condense the interview into a short summary, so the decisions carry forward without all the back-and-forth, and the spec file stays the source of truth.
3. **Switch to plan mode and point it at the spec.** In Claude Code that's shift-tab into plan mode, then I tell it to implement the spec, pointing it at the file we just wrote. Working from the spec and the actual codebase, it reads the existing code and writes a thorough implementation plan. That grounding is the point, the plan comes out of how the code really works, not a guess.
4. **Skim, accept, let it run.** The plan is mostly for Claude's benefit, I care about the spec, so I skim it, accept, and switch to auto mode. From there it implements the spec and checks its own work against the acceptance criteria.

Scoped that small, the build runs all the way through before it hits degradation or auto-compaction, so I don't compact again, I just let it go.

If I don't know the domain, I run a separate research session before any of this. If the work is visual, I figure out how the agent will verify it, screenshots it can read on its own, before I let it build. It's the same idea as an [earlier post of mine on how LLMs compress your thinking](https://juanjofuchs.github.io/ai/2026/02/17/llms-are-compaction-tools-and-you-are-the-algorithm.html), your judgment does the compression up front and the build just expands it back out.

## Where this breaks

Acceptance criteria are great at correctness and useless at taste. You can write a check for "the tests pass" or "the endpoint returns 200." You can't write a check for "this reads like me" or "this is the elegant version." That's [the verifier problem](https://subhadipmitra.com/blog/2026/rlvr-beyond-math-code/), the reason automated grading works for math and code and falls apart on style and judgment. So the acceptance criteria pin down whether it's right. The interview is the only place your taste gets in. You can't hand that part to a slash command.

## Keep the thinking in

The spec matters more than the code. The thinking it's made of matters more than the document. A tool that generates the document without the thinking hands you the packaging with nothing inside.

So use these tools for the parts they're good at, and keep the part that's yours. Make the model interview you before it writes a line, push back, decide out loud, write down why. Do that and the spec almost writes itself, you walk away knowing exactly what you want to build, and that's the part that makes the build come out right.

{% comment %}
## LinkedIn Post
MEDIA: /assets/how-i-write-specs-with-ai-hero.png
ALT: A human engineer explains an idea with hand gestures while a robot interviewer takes notes on a sparse stage

There are a lot of tools now that can turn a one-line idea into a full spec. In a handful of commands you get a constitution document, multiple specification files, and task breakdown files. Everyone's excited that the specs finally matter more than the code. I'm not, not entirely, because a spec you didn't think through is worthless, however polished it looks.

Sean Grove at OpenAI put it best: the code is maybe ten to twenty percent of the value, the rest is the structured communication of intent. So generating a spec from a throwaway prompt is like shredding the source and version-controlling the binary. The prompt was the source. The polished doc the tool spat out is the binary. You saved the wrong artifact.

These tools can be used well. Spec Kit has a clarify step, an analyze step, and review gates. But the default path doesn't make you do any of that, and a document that looks finished is the most rubber-stampable thing in the world.

So I don't ask AI to write me a spec. I ask it to interview me.

✅ I use a tiny skill called grill-me, really just a handful of sentences you can paste into your prompt. It makes the model interview me relentlessly, walk down every branch of the design tree, and give its own recommended answer for each question.
✅ Half the questions I can't answer right away, which means I didn't actually know what I wanted yet. So I go research it, make a call, and write the reason down.
✅ By the time the interview's done, the spec basically writes itself, because the decisions already got made out loud. The model records the what, not the how, with the reasons behind each call. Then it encodes my goals as acceptance criteria it can check its own work against.
✅ Then the build. Claude Code reads the existing code and writes a plan first (plan mode), then implements the spec in auto mode and checks its work against those acceptance criteria, while I do something else.

Acceptance criteria are great at correctness and useless at taste. You can write a check for "the tests pass." You can't write one for "this reads like me." So the criteria pin down whether it's right, and the interview is the only place your taste gets in. You can't hand that part to a slash command.

How I Write Specs with AI: https://juanjofuchs.github.io/ai-development/2026/06/30/how-i-write-specs-with-ai.html

#AIEngineering #SpecDrivenDevelopment #DeveloperProductivity #LLM #SoftwareEngineering

---

## X/Twitter Thread
MEDIA: /assets/how-i-write-specs-with-ai-hero.png
ALT: A human engineer explains an idea with hand gestures while a robot interviewer takes notes on a sparse stage

Tweet 1:
There are a lot of tools now that turn one line into a full spec in a handful of commands. The problem: a spec you didn't think through is worthless, however polished it looks. 🔥

Tweet 2:
Sean Grove (OpenAI): code is 10-20% of the value, the rest is the structured communication of intent. Generate a spec from a throwaway prompt and you've shredded the source to version-control the binary. 💡

Tweet 3:
The prompt was the source. The polished doc the tool generated is the binary. You saved the wrong artifact.

Tweet 4:
I don't ask AI to write me a spec. I ask it to interview me. A tiny skill (grill-me) makes the model grill me down every branch of the design tree, one decision at a time.

Tweet 5:
Half the questions I can't answer right away, which means I didn't know what I wanted yet. By the time the interview's done, the spec writes itself. ✅

Tweet 6:
Then the build: Claude plans against the existing code first (plan mode), then implements the spec in auto mode and checks its own work against the acceptance criteria. I skim the plan and let it run.

Tweet 7:
A finished-looking spec is the easiest thing to rubber-stamp. The interview is where your taste gets in. A slash command skips it. How I Write Specs with AI: https://juanjofuchs.github.io/ai-development/2026/06/30/how-i-write-specs-with-ai.html

#AIEngineering #LLM
{% endcomment %}