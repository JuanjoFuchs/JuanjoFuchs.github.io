---
layout: post
title: "Build Your AI Writing Voice from Data You Already Have"
description: "Everyone tells you to build an AI style guide. Nobody shows you how to fill it in. Here's the process I used, mining 1,012 Claude prompts to extract patterns I didn't know I had."
date: 2026-04-07 09:00:00 -0400
categories: ai
tags: [ai, writing, style-guide, claude-code, voice]
author: JuanjoFuchs
image: /assets/build-ai-writing-voice-hero.png
---

![Build your AI writing voice from data you already have](/assets/build-ai-writing-voice-hero.png)

I've been open about using AI to write. In [The LLMphant in the Room](https://juanjofuchs.github.io/ai/2025/11/25/the-llmphant-in-the-room.html) I shared I use an LLM to serialize my ideas the same way I use a compiler to turn code into machine instructions.

The serialization works. I think in systems and I can reason through a problem, I've just never been great at turning that thinking into polished prose and now AI has automated that part.

But that same post named the problem: "the emojis, the dramatic pauses, the em-dashes, the contrast-pivot constructions." That's what people spot. That's what makes AI writing feel hollow, and mentions of "AI slop" have surged 9x in the past year alone.

So I built a style guide. Anti-patterns mostly, a list of things the AI should stop doing: no em dashes, no "Moreover" transitions, no tagline closers, no contrast pivots. It helped. The worst AI artifacts disappeared. But the writing still sounded like cleaned-up AI, just without the worst artifacts.

The voice description in my guide was one line: "technical, direct, and conversational." That vague descriptor means nothing to a model. Without specific patterns to follow, the model compacts toward the [average voice it was trained on](https://juanjofuchs.github.io/ai/2026/02/17/llms-are-compaction-tools-and-you-are-the-algorithm.html).

I knew what was wrong but didn't know how to fix it until I found the right framework.

## Step 1: Get the framework

[Katie Parrott](https://every.to/@katie.parrott12) at Every [wrote the best guide I've found](https://every.to/guides/ai-style-guide) for what goes in an AI style guide. If you haven't read it, start there. Seriously, go read it and come back.

Every's guide defines seven sections a style guide should have:

1. **Voice and tone**: who the writer is, described through tensions and spectrums
2. **Structure**: how ideas are organized, the shapes your writing takes
3. **Sentence-level preferences**: rhythm, punctuation, length, diction
4. **Signature moves**: what your voice does especially well
5. **Anti-patterns**: what the AI should stop doing (often the highest-value section)
6. **Examples**: pairs of good and bad, drawn from real writing
7. **Revision checklist**: how to evaluate whether a draft is working

The key insight from Every: a style guide and a prompt are different tools. The guide tells the model how to sound, the prompt tells it what to do. You can write perfect prompts and still get generic-sounding output if the model doesn't know what *you* sound like.

Every recommends starting with an AI interview too. Have the AI ask you about your voice, react to examples, describe what you like and don't like. That's a good starting point and I'd recommend doing it.

## Step 2: Gather your data

When I sat down to fill in Every's sections, I got stuck. "Describe your voice tensions." "List your signature moves." I wrote things like "I'm direct" and "I prefer casual language," exactly the kind of flat descriptors that Every warns won't change model behavior.

Self-reporting filters out unconscious patterns. You end up describing aspiration, not habit. The interview approach gets you partway there, but it's still filtered through self-perception.

Then I realized I already had a corpus of exactly how I communicate: thousands of prompts I'd sent to Claude Code over months of daily use. All dictated through Whisper, so close to natural speech. Just me talking to a collaborator the way I actually talk.

You have this data too. It's sitting in your AI conversation history right now:

**Claude Code** stores session logs locally as JSONL files in `~/.claude/projects/<project>/`. No export needed, just read them. I built a script called [`extract_prompts.py`](/assets/extract_prompts.py) to parse these and filter for genuine user prompts.

**Claude.ai and Claude Desktop** share the same data (they're synced through your account). Go to Settings, then Privacy, then Export Data. You'll get a ZIP with a `conversations.json` file containing all your conversations, both your messages and Claude's responses, with timestamps and model info.

**ChatGPT** has the same kind of export. Settings, then Data Controls, then Export. You'll get a ZIP with `conversations.json`. One thing to know: ChatGPT stores messages as a tree structure with parent/children nodes, not a flat list. To reconstruct a linear conversation you need to walk from the last node backwards through parent links.

All of these exports include both your messages and the AI's responses with role fields, so you can filter for just your side.

One thing that made a big difference for me: my prompts were dictated, not typed. Dictated or spoken data is closer to your real voice than carefully composed messages. If you use any kind of voice-to-text tool, that data is gold.

My corpus: 1,012 dictated prompts, 272K words, 108 sessions across 11 projects.

## Step 3: Analyze for patterns, not content

Don't read your data for *what* you said. Read it for *how* you said it. The content of your prompts is irrelevant for this exercise. What matters is the patterns in how you communicate.

Have your AI analyze a large enough sample, 500 or more messages, and look for these specific things:

**Sentence structure.** Look at whether you write in short bursts or long flowing chains, and when you switch. I oscillate: punchy instructions, then a longer sentence that explains why.

**Connective tissue.** Look at the words you use to transition between ideas. I use "now" as a gear-shift between tasks, not as a temporal marker.

**Verbal habits.** Recurring phrases, alignment checks, approval signals. "Does that make sense?" showed up in 20-30% of my prompts.

**Instruction patterns.** Look at whether you front-load context or lead with the command. I give context first almost every time.

**Emotional register.** Track how your tone shifts between technical topics and personal ones. I found I don't compartmentalize, I can describe a frustration and then examine it analytically in the same breath.

None of these surfaced in self-reflection. If someone had asked me to describe my voice, I would have said "I'm direct and conversational," which gives a model nothing to work with.

## Step 4: Check for blind spots

Your data captures one register, most likely. Mine was entirely my English professional voice. All 1,012 prompts came from the same register.

If you're bilingual, interview yourself in your other language. My Spanish casual voice was the opposite of my English data in almost every way, and the voice I was trying to build lived between both registers.

If you're monolingual, you still have multiple registers. Compare how you write at work versus how you text friends. Compare your AI prompts on technical projects versus personal ones. Different contexts, different patterns. Your writing voice lives somewhere between them.

## Step 5: Assemble the style guide

Now take Every's seven sections and fill them with what the data actually showed, not what you think you sound like:

**Voice and tone.** State your voice as tensions on a spectrum, not as flat adjectives. "Direct but not cold: corrects without softening, states opinions without hedging, but genuine warmth comes through in enthusiasm about what he's built or discovered," that's something a model can calibrate against. My guide has five tension-pairs structured that way.

**Signature moves.** These come straight from the verbal habits your data surfaced. Mine: applying "the so what" test to every idea (does this have impact or is it just restating what I already know?), using "now" to pivot between sub-tasks, front-loading context and motivation before any ask.

**Anti-patterns.** If you already have a suppression list, refine it with before/after examples. If you don't, start one. Every says this is often the highest-value section and I agree. Specific patterns with examples teach the model more than abstract rules. "No em dashes" is okay. "No em dashes: use commas, colons, or periods instead. Bad: 'the transport layer — the protocol for moving theory.' Good: 'the transport layer, the protocol for moving theory.'" is better.

**Sentence preferences.** Pull these directly from your sentence structure analysis. My guide specifies target sentence length (15-25 words average), comma usage for natural flow instead of excessive periods, and compound sentences that connect ideas efficiently with "and," "but," "so."

**Examples.** Pairs of "this sounds like me" and "this doesn't," drawn from your real drafts and your real data. Per Every, examples paired with rules are almost always more useful than rules alone. I include examples in three categories: good (actual style), bad (AI-generated), and bad (over-corrected, too choppy).

**Revision checklist.** Separate the voice check from the mechanics check. "Does this sound like me?" is a different question from "are the anti-patterns clean?" My checklist starts with six voice questions, whether the opening leads with something concrete, whether there's genuine enthusiasm somewhere, whether you can see the thinking happen, before getting into the mechanics.

## Step 6: Test and iterate

Use the guide for a real piece of writing and compare the output to what you'd write yourself. The guide is a living document, every draft I write surfaces something it should have caught, and it gets updated. It doesn't eliminate judgment, but it gets you closer on the first pass.

Once you have the guide, you need a way to enforce it consistently. I built an [autonomous editorial loop](https://juanjofuchs.github.io/productivity/2026/03/17/building-your-second-brain-part-4-the-editorial-loop.html) that checks every draft against the style guide and iterates until clean.

## Now build yours

Feed your AI [Every's article](https://every.to/guides/ai-style-guide) and this post together, then try a prompt like this:

> "I want to build an AI writing style guide. Use the Every article for the framework (what sections to include) and the blog post for the process (how to extract the content from my data). Start by interviewing me about my voice, then help me analyze my conversation history and fill in each section."

My guide went from one line to several pages. It's still a work in progress, but every post I've written since sounds more like me and less like cleaned-up AI.

{% comment %}
## LinkedIn Post
PUBLISHED: 2026-04-07T15:13:55.103Z

MEDIA: /assets/build-ai-writing-voice-hero.png
ALT: Build your AI writing voice from data you already have

I had an AI writing style guide I'd built through trial and error. Anti-patterns mostly, a list of things the model should stop doing. It worked okay until I read @Every's guide, which showed me everything mine was missing.

When I tried to fill in the new sections I got stuck. "Describe your voice tensions." "List your signature moves." I wrote "direct and conversational" and stared at the screen. Every recommends interviewing yourself, but self-reporting filters out the patterns you don't know you have.

So I mined my own data instead: 1,012 dictated prompts from my Claude Code session logs. Just me talking to a collaborator the way I actually talk. The data surfaced sentence rhythms, transition words with specific meanings, verbal habits I didn't know I had. All invisible until you look at the data.

The post walks through all six steps, with export instructions for Claude Code, Claude.ai, and ChatGPT, plus a starter prompt you can feed your AI to build yours.

Your conversation history is already sitting there. Have you ever analyzed it?

https://juanjofuchs.github.io/ai/2026/04/07/build-your-ai-writing-voice-from-data-you-already-have.html

#AI #Writing #StyleGuide #ClaudeCode

---

## X/Twitter Thread
MEDIA: /assets/build-ai-writing-voice-hero.png
ALT: Build your AI writing voice from data you already have

Tweet 1:
I sat down to build an AI style guide and got stuck on "describe your voice tensions." Wrote "direct and conversational" and stared at the screen. That tells a model nothing.

Then I found the answer in 1,012 of my own dictated prompts:

Tweet 2:
Step 1: Read @katieparrott's style guide framework at Every. Best guide I've found for what goes IN a style guide.

Step 2: Export your AI conversation history. Claude Code stores JSONL logs locally. Claude.ai and ChatGPT both have data exports.

Tweet 3:
Step 3: Analyze for HOW you said it, not what. Sentence structure, connective tissue, verbal habits, instruction patterns, emotional register.

I found patterns in 1,012 prompts that never would have surfaced in self-reflection.

Tweet 4:
Step 4: Your data captures one register. If you're bilingual, interview yourself in your other language. If monolingual, compare work messages vs texts to friends. Your writing voice lives between your registers.

Tweet 5:
Step 5: Fill in Every's framework with data. "Direct" doesn't help a model. "Direct but not cold: corrects without softening, genuine warmth through enthusiasm" does.

Tweet 6:
Full process + a starter prompt you can feed your AI:

https://juanjofuchs.github.io/ai/2026/04/07/build-your-ai-writing-voice-from-data-you-already-have.html

{% endcomment %}