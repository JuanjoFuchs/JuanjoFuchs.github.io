---
layout: post
title: "Building Your Second Brain, Part 4: The Editorial Loop"
description: "AI drafts read polished and confident, which is exactly why the patterns are hard to spot. An autonomous editorial loop with a published checklist and orchestration prompt catches what you can't see after writing with AI."
date: 2026-03-10 09:00:00 -0500
categories: productivity
tags: [second-brain, ai, productivity, writing, content-creation]
author: JuanjoFuchs
image: /assets/editorial-loop-redpen.png
---

![A blog post draft with red-pen editorial annotations marking AI writing patterns](/assets/editorial-loop-redpen.png)

[Part 3](https://juanjofuchs.github.io/productivity/2026/03/03/building-your-second-brain-part-3-the-spec-that-wrote-this-post.html) ended with the spec and the draft. You planned the arc, the angles, the scope, AI wrote the post and it reads well, it flows, the sections land where the spec said they should. You think it's done.

It isn't. The draft is full of patterns you can't see because you just spent the last twenty minutes producing them.

## AI Prose Has a Fingerprint

AI doesn't write badly, it writes predictably. Language models default to patterns that scored well during training: balanced parallel structures, conclusive rhythmic closers, rhetorical questions with built-in answers. These patterns work individually and that's the problem, the model applies them everywhere because they always score well.

The result is prose that reads smoothly but has a recognizable texture. No awkward transitions, no sentences that took three tries to land. The prose never shows the writer struggling with phrasing. Most people sense something is off when reading AI-generated content but can't name it, because it's a dozen small patterns stacking up rather than one obvious tell. I [wrote about this tension early on](https://juanjofuchs.github.io/ai/2025/11/25/the-llmphant-in-the-room.html), the thinking behind the words matters more than the prose style, but the patterns still distract from the ideas if you leave them in. [AI accelerates whatever you already have](https://juanjofuchs.github.io/ai-development/2026/01/27/ai-accelerates-whatever-you-have.html), and without a way to detect these patterns it accelerates sameness across every draft.

I built a checklist that names them.

## The Checklist

This is the AI-pattern detection subset of my writing style guide. I argued in a previous post that [your judgment is what makes AI output valuable](https://juanjofuchs.github.io/ai/2026/02/17/llms-are-compaction-tools-and-you-are-the-algorithm.html), and this checklist is how you apply that judgment during editorial review. These patterns show up reliably in AI-generated prose regardless of the topic or model. Each one sounds fine in isolation but becomes a tell when several appear in the same piece.

**Contrast-pivot constructions.** "The question isn't X, the real question is Y" or "not X, but Y." AI loves this framing because it creates instant tension, and it shows up constantly in AI output.

**Tagline closers.** Short, punchy, rhythmic fragments at the end of paragraphs that sound like ad copy. "No exceptions." "Every single time." "That's the real win." The model adds these because they feel conclusive, and five of them in one post makes the pattern obvious.

**Setup phrases.** "Here's what made it work:" or "It gets better." These are throat-clearing, the model announcing that something important is coming instead of just saying it.

**Formal transitions.** Moreover, Furthermore, However, Additionally, Nevertheless. AI defaults to academic connectors even in casual writing.

**Formulaic comma chains.** Four or five parallel clauses strung together in one sentence: "The workflow runs every Tuesday, finds posts from the last week, extracts their content, validates the format, and posts to both platforms." It's technically correct but rhythmically robotic.

**AI clichés.** Dive deep, unlock, harness the power of, in today's fast-paced world, in today's landscape. These phrases have been in so much training data that the model reaches for them reflexively.

**Hypophora.** Asking a question then immediately answering it. "The skills you developed as an engineering manager? Still valuable." AI uses this constantly because the question-answer rhythm feels like dialogue, but the answer is usually too vague to replace an actual explanation.

**Emphatic closers.** "No exceptions," "every time," "no surprises." These are filler emphasis, the model adding conviction without adding information.

**Consecutive "And" paragraph openers.** Starting multiple paragraphs in a row with "And" is a connector pattern the model uses to create flow between paragraphs. Direct openings are more natural.

**Abstract profound-sounding statements.** If a sentence sounds deep but you can't explain what it concretely means, the model is pattern-matching profundity. "People dislike AI writing because it's empty, not because it's fake" sounds smart but says nothing specific.

**Excessive em dashes.** AI loves em dashes for dramatic asides. One per piece is fine, five means the model is leaning on them.

**Clever phrase repetition.** A good turn of phrase in the title gets repeated three more times in the body. The model reinforces what it thinks worked. Use wordplay once, then move on.

**Redundancy.** Points already made reappearing in different words two sections later. The model doesn't track what it's already covered as well as it should.

None of these are absolute rules, and individually they're fine. The pattern shows up when a draft stacks all of them at once: tagline closers on every paragraph, contrast pivots opening each section, hypophora scattered through the explanations.

## The Prompt

The checklist is only useful if something applies it systematically. Right after drafting, your brain is still pattern-matching with the model, the worst time to review your own work.

The solution is a separate reviewer agent, a fresh instance with no memory of the drafting process that catches the patterns right away. Manually shuttling violations back and forth doesn't scale, the whole loop needs to run autonomously.

The prompt I give the main AI agent spawns a reviewer sub-agent, applies fixes, then re-runs the review until clean. Copy it and feed it to your AI assistant with your draft and checklist. It runs the whole editorial loop.

```
You are an editorial loop orchestrator. Your job is to iteratively
improve a blog post draft by running an autonomous review cycle.

INPUTS:
- A style checklist (provided below or as a file)
- A blog post draft to review

PROCESS:
1. Spawn a separate reviewer agent with this prompt:
   "You are an independent editorial reviewer. Read the style
   checklist and the blog post draft. Evaluate the draft against
   EVERY rule in the checklist. Also check that all claims support
   the thesis, flag jargon that hasn't been simplified, and verify
   section flow. Return a structured list of violations with:
   line number, category, severity (HIGH/MEDIUM/LOW), the offending
   text (quoted), and a suggested fix. Be thorough but fair —
   direct quotes from external sources are exempt, and natural
   language constructions are fine. Only flag formulaic patterns.
   DO NOT edit the file. Only report violations."

2. Read the reviewer's violation list.

3. Apply fixes for all HIGH and MEDIUM violations. For each fix,
   rewrite the flagged text to eliminate the pattern while keeping
   the original meaning. Do not introduce new violations.

4. Skip LOW-severity items unless the fix clearly improves flow.

5. Re-spawn the reviewer on the updated draft. Repeat from step 2.

6. Stop when the reviewer returns zero violations, only LOW-severity
   items, or you have completed 3 passes. If issues remain after 3
   passes, list them for the human to decide.

7. When done, output:
   - Number of passes completed
   - Total violations found per pass
   - Total edits applied vs. dismissed
   - Any remaining items for human review
   - The final updated draft
```

This prompt works with any AI assistant, not just Claude. The orchestrator handles the iteration loop and the reviewer handles pattern detection. You get a clean draft with a summary of what changed. The 3-pass cap prevents the loop from running forever on edge cases.

The checklist gives the reviewer a verifiable signal for each pattern, and separating the reviewer from the drafting agent is the same principle you'd use to [keep a code reviewer separate from the author](https://juanjofuchs.github.io/ai-development/2026/02/10/give-your-ai-hills-to-climb.html).

## Filtering: The Human Still Decides

The reviewer is overly strict by design because false positives are easier to handle than missed patterns.

Three filtering rules I apply:

**Direct quotes from external sources are exempt.** If Addy Osmani said "waterfall in 15 minutes," that's his phrasing and the reviewer shouldn't flag it as a tagline closer.

**Natural language gets a pass.** A compound sentence with "but" connecting two clauses is normal English and the reviewer sometimes flags it as a contrast pivot by mistake. If the sentence reads naturally, keep it.

**LOW severity is optional.** Fix LOW items if they improve flow, skip them if they don't. The reviewer flags everything that technically matches a pattern, but some of those are fine in context and you're the one making that call.

## Case Study: This Post

The post you're reading right now went through this exact process.

**Pass 1: 14 violations.** The dominant patterns were tagline closers and contrast pivots, with a few abstract profound-sounding statements mixed in. A few examples:

| Before | After | Pattern |
|--------|-------|---------|
| "AI doesn't write badly, it writes recognizably." | "AI doesn't write badly, it writes predictably." | Abstract statement |
| "The question isn't whether AI can write — it's whether you can see what it wrote." | Cut entirely, opened with a direct claim instead. | Contrast pivot |
| "That's the real power of the loop." | Replaced with a specific description of what the loop actually does. | Tagline closer |

**Pass 2: 5 violations.** The big patterns were gone. What remained were setup phrases ("Here's what makes it work:"), one emphatic closer, a formulaic comma chain, and a closing tagline.

**Pass 3: 5 violations.** Two HIGH: a remaining contrast pivot in the filtering section and a tagline closer on the final paragraph. Two MEDIUM: setup phrases that read like throat-clearing. One LOW: an intentional parallel structure. Fixed the rest, kept the LOW.

**Final count:** Applied about 15 edits, dismissed 3 as overly strict, converged in 3 passes.

The style guide lives in my vault as a markdown file, [AI-readable by design](https://juanjofuchs.github.io/productivity/2025/12/16/making-second-brain-ai-compatible.html). Both are published above.

{% comment %}
## LinkedIn Post
MEDIA: /assets/editorial-loop-redpen.png
ALT: A blog post draft with red-pen editorial annotations marking AI writing patterns

I can feel when something was written by AI. You probably can too. It reads smoothly, maybe too smoothly, with punchy closers on every paragraph and rhetorical questions that answer themselves.

I built a checklist that names the patterns: tagline closers, contrast pivots, hypophora, formulaic comma chains, setup phrases, em dash overuse, abstract profound-sounding statements. Twelve categories total.

Then I built an autonomous loop: a separate reviewer agent reads the checklist and the draft, returns violations with line numbers and severity. Apply fixes, re-run, repeat until clean. I published the full orchestration prompt so you can feed it to your AI and it runs the whole loop for you.

This post went through its own loop:
📌 Pass 1: 14 violations (tagline closers, contrast pivots, abstract statements)
📌 Pass 2: 5 remaining
📌 Pass 3: 5 left (4 real fixes, 1 dismissed)

~15 edits, converged in 3 passes. Same ideas, same structure, different texture.

The checklist, the orchestration prompt, and before/after examples are all published in the post 👇
https://juanjofuchs.github.io/productivity/2026/03/10/building-your-second-brain-part-4-the-editorial-loop.html

#AI #Writing #ContentCreation #SecondBrain #Productivity

---

## X/Twitter Thread
MEDIA: /assets/editorial-loop-redpen.png
ALT: A blog post draft with red-pen editorial annotations marking AI writing patterns

Tweet 1 (Hook):
AI prose has a fingerprint most people can feel but can't name. I built a 12-pattern checklist that catches it and an autonomous review loop that applies it. Checklist and prompt published in full. 🔥

Tweet 2:
The patterns: tagline closers, contrast pivots ("not X, but Y"), hypophora (question → immediate answer), formulaic comma chains, setup phrases ("Here's what..."), AI clichés, consecutive "And" openers, abstract profound-sounding statements, em dash overuse. 💡

Tweet 3:
The editorial loop: spawn a reviewer sub-agent with the checklist and your draft. It returns violations with severity. Apply fixes, re-spawn, repeat until clean. I published the full orchestration prompt — feed it to your AI and it runs the whole loop for you.

Tweet 4:
This post went through its own loop. Pass 1: 14 violations. Pass 2: 5. Pass 3: 5 (dismissed 1 as overly strict). ~15 edits applied. Same ideas, different texture. The AI fingerprint is gone. ✅

Tweet 5:
Full checklist, orchestration prompt, and before/after examples:
https://juanjofuchs.github.io/productivity/2026/03/10/building-your-second-brain-part-4-the-editorial-loop.html

#AI #Writing

---
INSTRUCTIONS:
- LinkedIn: Post Tuesday-Thursday 8-10 AM EST. URL in post body (comments API unavailable).
- X/Twitter: Post as thread. Image attached to first tweet. Link only in last tweet.
{% endcomment %}