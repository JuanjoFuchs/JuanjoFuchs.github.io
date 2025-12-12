---
layout: post
title: "LLMs Love Hills to Climb"
description: "LLMs are trained via reinforcement learning to optimize metrics. Give them clear hills to climb and they'll iterate toward the goal without you explaining each step."
date: 2026-01-06 09:00:00 -0500
categories: ai-development
tags: [ai, prompting, llm, productivity]
author: JuanjoFuchs
---

Most prompting advice is about what to say. Be specific. Provide context. Use examples. All useful, but it misses something fundamental about how these models actually work.

LLMs aren't just pattern matchers that predict the next word. They're trained through a process called [Reinforcement Learning from Human Feedback](https://huggingface.co/blog/rlhf) (RLHF), which means they've literally been optimized to climb toward better scores. Understanding this changes how you work with them.

## The Training That Shapes Behavior

Here's the simplified version of how modern LLMs get trained:

1. Pre-training on massive text datasets (predicting next tokens)
2. Fine-tuning with human feedback where responses get ranked
3. Reinforcement learning that optimizes the model to produce higher-ranked responses

That third step is the key. The model [learns to maximize a reward signal](https://www.ibm.com/think/topics/rlhf). It's not just learning patterns, it's learning to climb hills toward whatever humans rated as "better."

This isn't an accident or a side effect, it's the core training objective. The model is literally designed to find paths toward higher scores.

## What This Means for Prompting

If you give an LLM a vague goal, it'll do its best to pattern-match toward something reasonable. But if you give it a clear metric to optimize, it activates the same machinery it was trained with. It starts climbing.

**Vague:** "Make this code better."

**Clear hill:** "Reduce the cyclomatic complexity of this function while maintaining the same test coverage."

The second prompt gives the model something concrete to optimize. It can evaluate its own output against the criteria and iterate. The first prompt forces it to guess what "better" means to you.

## Iteration Loops Changed

This connects to something that happened with AI coding tools. The smallest iteration loop in software development used to be: write code, run tests, see results. That loop took minutes, sometimes seconds if you had good tooling. IT Revolution calls this the ["inner loop"](https://itrevolution.com/articles/the-three-developer-loops-a-new-framework-for-ai-assisted-coding/) in their framework for AI-assisted coding.

Now that same loop applies to ideas themselves. Express an idea to an AI, see a working implementation, evaluate whether it matches your intent, refine. The loop that used to go from "code to working code" now goes from "idea to working product."

But here's the thing: that loop only works if the AI can evaluate its own progress. If you're the only feedback mechanism, the loop is slow. You become the bottleneck.

Give the AI hills to climb and it can iterate without waiting for you.

## Practical Applications

**For coding tasks:** Don't just describe what you want, describe what success looks like. "The function should handle these edge cases" is better than "make it robust." "All tests should pass" is better than "fix the bugs." The AI can check these things itself.

**For writing tasks:** "Match the tone of this example" gives a clear reference point. "Write in a professional tone" is vague. The AI can compare its output to the example and iterate. It can't compare its output to your mental model of "professional."

**For analysis tasks:** "Identify the top 3 factors by impact" is a clear optimization target. "Analyze this data" gives no hill to climb. The AI will produce something, but it won't know when to stop or what to prioritize.

**For debugging:** "Find why this test fails" points at a specific hill (test passing). "Review this code for issues" is open-ended. The AI can verify whether the test passes after its suggested fix. It can't verify whether you're satisfied with a general review.

## The Meta-Pattern

The pattern across all of these: give the AI something it can evaluate without you.

Tests are perfect because they're binary. Did it pass or not? The AI can check. Types are perfect because the compiler provides immediate feedback. Linters are perfect because they flag violations automatically.

The worst prompts are ones where only you can evaluate the output. "Make this sound more like me" requires your judgment. "Match the sentence length and contraction usage in this sample" gives measurable criteria.

You're not trying to remove yourself from the process. You're trying to move your involvement from constant feedback to upfront specification. Define the hill clearly, then let the AI climb.

## Why This Works

It works because it matches how the model was trained. RLHF taught the model to maximize reward signals through iteration. When you give it clear metrics, you're speaking its native language.

Think of it like this: if you trained a dog using treats to reinforce good behavior, you'd get better results by being consistent about what earns a treat. The dog learns to optimize for treat-earning actions. Vague feedback ("good boy" for random things) produces confused behavior.

LLMs were trained with the equivalent of millions of treats for specific behaviors. Clear metrics let them apply that training. Vague prompts force them to guess.

## The Iteration Speed Advantage

When the AI can self-evaluate, iterations happen at machine speed. It can try an approach, check the result, adjust, try again, all before you've finished reading the first attempt. This is the core of [self-correcting AI agents](https://dev.to/louis-sanna/self-correcting-ai-agents-how-to-build-ai-that-learns-from-its-mistakes-39f1): error detection, reflection, and retry logic.

When you're the only evaluator, iterations happen at human speed. Write, wait for you to read, wait for feedback, adjust, wait again. The AI is sitting idle most of the time.

This matters more as models get faster and context windows get larger. The bottleneck increasingly isn't model capability, it's feedback loop speed. The teams that figure out how to give AI clear hills to climb will iterate faster than teams stuck in human-in-the-loop patterns.

## What Doesn't Work

This approach doesn't help with genuinely subjective things. "Is this design aesthetically pleasing?" requires human judgment. "Does this strategy make sense for our business?" requires context the AI doesn't have.

For those cases, you're still the evaluator. But you can often decompose subjective goals into objective sub-goals. "Make it aesthetically pleasing" becomes "ensure consistent spacing, limit the color palette to 3 colors, align elements to a grid." Now there are hills to climb.

Not everything can be decomposed this way, and that's fine. The goal isn't to automate all judgment, it's to stop making the AI wait for your judgment on things it could evaluate itself.

## Putting It Together

Next time you're prompting an LLM, ask yourself: can the AI evaluate its own output against my criteria? If yes, you've given it a hill to climb. If no, you're the bottleneck.

Clear metrics, testable conditions, reference examples, binary success criteria. These aren't just good prompting practice, they're speaking the language the model was trained in.

LLMs love hills to climb. Give them one.

{% comment %}
## LinkedIn Post

Most prompting advice focuses on what to say. Be specific, provide context, use examples. All useful, but it misses something fundamental.

LLMs are trained through Reinforcement Learning from Human Feedback (RLHF). They've literally been optimized to climb toward better scores. This changes everything about how you should work with them.

Vague prompt: "Make this code better"
Clear hill: "Reduce cyclomatic complexity while maintaining test coverage"

The second gives the model something concrete to optimize. It can evaluate its own output and iterate without waiting for your feedback.

✅ For coding: Describe what success looks like, not just what you want
✅ For writing: Give reference examples, not abstract tone descriptions
✅ For debugging: Point at specific failing tests, not general reviews

The pattern: give the AI something it can evaluate without you. Tests, type checks, linters, reference examples. Now iterations happen at machine speed instead of human speed.

You're not removing yourself from the process. You're moving involvement from constant feedback to upfront specification.

Full breakdown with examples, link in comments.

#AIPrompting #DeveloperProductivity #LLM #AIEngineering #MachineLearning

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/ai-development/2026/01/06/llms-love-hills-to-climb.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread

Tweet 1 (Hook):
Most prompting advice: be specific, provide context. Useful but incomplete. LLMs are trained via reinforcement learning to climb toward better scores. Understanding this changes everything. 🔥

Tweet 2:
Vague prompt: "Make this code better"
Clear hill: "Reduce cyclomatic complexity while maintaining test coverage"

The second gives the model something it can evaluate itself. It can iterate without waiting for you. 💡

Tweet 3:
This works because it matches how the model was trained. RLHF taught it to maximize reward signals through iteration. Clear metrics = speaking its native language.

Tweet 4:
When AI can self-evaluate, iterations happen at machine speed. When you're the only evaluator, iterations happen at human speed. The bottleneck is feedback loop speed. ✅

Tweet 5:
Pattern: give the AI something it can evaluate without you. Tests, type checks, reference examples. Move your involvement from constant feedback to upfront specification.

Tweet 6:
Full breakdown on giving LLMs hills to climb: https://juanjofuchs.github.io/ai-development/2026/01/06/llms-love-hills-to-climb.html

#AIPrompting #LLM

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
