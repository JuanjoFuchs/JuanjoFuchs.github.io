---
layout: post
title: "The Intelligence Gap"
description: "Anthropic's most capable model was free for three days, then a US export order pulled it. The divide that matters now is how much you still have to babysit the model."
date: 2026-06-23 09:00:00 -0400
categories: ai-development
tags: [ai, llm, productivity, future-of-work]
author: JuanjoFuchs
image: /assets/the-intelligence-gap-hero.png
---

![A person working on a balcony at dusk while green time drains from their watch toward a faint orbital station in the sky](/assets/the-intelligence-gap-hero.png)

We no longer have access to [Fable 5](https://www.anthropic.com/news/claude-fable-5-mythos-5). For three days we did. It showed up on Max and Pro on June 9, "free" (really just folded into the subscription we already pay for), the most capable model Anthropic had ever shipped, and three days later it was gone, pulled for everyone after a US government export-control order. Anthropic says it's working to bring it back. Even when it does, the plan was always to move it off the flat-rate plans onto metered API pricing, somewhere around 10 and 50 dollars per million tokens, double Opus, and a single Fable 5 session was already eating through plan limits about twice as fast.

Fable 5's edge is the horizon. You hand it a goal and it works for hours, planning across stages and checking its own work, then comes back close to done. Opus is great, but Opus I have to steer. I write the spec, I size the work to fit a context window, I set up the verification, then it builds what I wanted. With Opus, more of the work stays mine.

We were told AI would flatten this. Everyone gets a genius assistant, the playing field levels. But the genius you don't have to babysit, the one that reaches furthest, costs the most, and it's the first thing to get locked away.

## Horizon is the thing you're buying

There's a number for this now. [METR](https://metr.org/time-horizons/) tracks a model's "time horizon," the length of task it can finish on its own, sized by how long the same job would take a human expert. That horizon has been doubling roughly every seven months for years, and it's sped up to about every three to four months lately, three or four doublings a year. Whether the model can answer a hard question matters less than this. At the top, you pay for how long it'll run before it needs you again.

The advantage compounds with length. The longer the task, the further the frontier model pulls ahead of the cheap one, because the cheap one hits a point where it needs a human checkpoint and the expensive one keeps going. So the gap is really about who gets to hand the work off and walk away.

## The gap is how much you still have to babysit

With a cheaper model the work doesn't disappear, it moves to you. You supply the clear spec, the tests, the taste for what good looks like. With the expensive long-horizon model, it supplies a lot of that itself, it infers the goal and fills in the judgment.

So the money buys back the hours you'd have spent steering. The person who can afford the frontier model delegates and goes to dinner. The person who can't runs Opus and spends the evening writing specs and checking output. Getting good at that, building the verification so a cheaper model still lands what you wanted, is the whole subject of [Loop Engineering for the Rest of Us](https://juanjofuchs.github.io/ai-development/2026/06/16/loop-engineering-for-the-rest-of-us.html).

The Stanford study of a hundred thousand developers found the [gains are wildly uneven](https://www.youtube.com/watch?v=tbDDYKRFjhk), near zero on complex work in an existing codebase, up to thirty or forty percent on simple greenfield projects, averaging around twenty. [DORA](https://dora.dev/research/2024/dora-report/) found that teams adding AI without strong testing and version control get more instability, not less. The verification is real labor. It doesn't vanish when AI shows up. It just sits with whoever can't pay to make it vanish.

## Open models are right behind, and that's the trap

The obvious objection is that this is temporary. Open-weight models are catching up fast, the gap between the best closed model and the best open one is [down to about four months](https://epoch.ai/data-insights/open-closed-eci-gap) on Epoch's tracker. Today's 50-dollar capability is next year's free download.

But the frontier keeps moving, so the four-month gap doesn't close, it travels. The people who can pay are always sitting at the newest, longest-horizon, least-babysitting model, and everyone else is running something a season behind that needs more steering. It's a recency tax, you pay to stay current or you pay in the extra work of running last year's model.

## Paying in hours instead of dollars

The closest picture is In Time, the movie where people pay for everything with hours of their own life. That's the cost side. Elysium is the other half, and yeah, it's the obvious reach, the rich up on their orbital station with machines that fix anything while Earth grinds below. Whoever runs the newest, longest-horizon model saves the time and reaches things the rest of us can't yet.

I don't think the move is to feel doomed about it, and I don't have a clean fix. What I do know is where the work goes when you can't buy your way out of it. It goes into the spec, into the verification, into the taste you encode so a cheaper model can still produce something good. For most of us that work is the job now, and it's what the next few posts are about.

{% comment %}
## LinkedIn Post
PUBLISHED: 2026-06-23T13:49:43.954Z

MEDIA: /assets/the-intelligence-gap-hero.png
ALT: A person working on a balcony at dusk while green time drains from their watch toward a faint orbital station in the sky

We no longer have access to Fable 5. For three days we did, "free" on Max and Pro (really just folded into the subscription we already pay for), the most capable model Anthropic had ever shipped. Then on Friday it was gone, pulled for everyone after a US government export-control order. Anthropic says it's working to bring it back. Even when it does, the plan was always to move it off the flat-rate plans to metered pricing at double the cost of Opus.

We were told AI would flatten the field. Everyone gets a genius assistant, the playing field levels. But the genius that runs on its own, the one you don't have to babysit and the one that reaches furthest, costs the most, and it's the first thing to get locked away.

The divide that actually matters is how much you still have to babysit the model.

📌 What you're buying at the top is horizon. METR tracks a model's "time horizon," the length of task it can finish on its own, and that number has been doubling every three to four months. Whether a model answers one hard question matters less than how long it runs before it needs you again.

📌 With a cheaper model the work doesn't disappear, it moves to you. You supply the spec, the tests, the taste for what good looks like. The long-horizon model infers most of that itself. So the money buys back the hours you'd have spent steering. The person who can pay delegates and goes to dinner. The person who can't spends the evening writing specs and checking output.

📌 This is the part the productivity stories skip. The Stanford study of a hundred thousand developers found AI's gains are wildly uneven, near zero on complex work in an existing codebase up to forty percent on a fresh one. DORA found teams that add AI without strong testing get more instability, not less. The verification is real labor, and it sits with whoever can't pay to make it vanish.

📌 The obvious objection is that this is temporary, open models are about four months behind the frontier. But the frontier keeps moving, so the gap doesn't close, it travels. It's a recency tax: you pay to stay current, or you pay in the extra work of running last year's model.

You pay in dollars or you pay in hours. For most of us, the work goes into the verification and the taste we encode so a cheaper model still lands something good.

The Intelligence Gap: https://juanjofuchs.github.io/ai-development/2026/06/23/the-intelligence-gap.html

Are you feeling this as a money gap or a time gap?

#AI #DeveloperProductivity #FutureOfWork #LLM #EngineeringLeadership

---

## X/Twitter Thread
PUBLISHED: 2026-06-23T13:49:45.399Z

MEDIA: /assets/the-intelligence-gap-hero.png
ALT: A person working on a balcony at dusk while green time drains from their watch toward a faint orbital station in the sky

Tweet 1:
We no longer have access to Fable 5, the most capable model Anthropic makes. "Free" for three days, then a US export order pulled it for everyone. When it's back, it's metered at 2x Opus. The gap that matters is how long a model runs before it needs you back. 🔥

Tweet 2:
What you pay for at the frontier is horizon. METR tracks how long a model runs on its own before it needs you, and that number is doubling every 3 to 4 months. 💡

Tweet 3:
With a cheaper model the work doesn't disappear, it moves to you. You write the spec, run the tests, supply the taste. The one who can pay delegates and goes to dinner. The one who can't steers all evening.

Tweet 4:
Stanford studied 100k developers: AI's gains run from near zero on complex existing code up to 40% on fresh projects. DORA: add AI without strong testing and you get more instability, not less.

Tweet 5:
Open-weight models are about 4 months behind the frontier. But the frontier keeps moving, so the gap doesn't close, it travels. A recency tax. ✅

Tweet 6:
You pay in dollars or you pay in hours. For most of us the work goes into the verification and the taste you encode. The Intelligence Gap: https://juanjofuchs.github.io/ai-development/2026/06/23/the-intelligence-gap.html

#AI #LLM
{% endcomment %}