---
layout: post
title: "Taste Debt"
description: "Technical debt lives in the code, cognitive debt in the team. Taste debt is the third kind AI runs up fastest, in the product you stopped judging and the palate you stopped using."
date: 2026-07-07 09:00:00 -0400
categories: ai-development
tags: [ai, taste, technical-debt, llm, engineering-leadership]
author: JuanjoFuchs
image: /assets/taste-debt-hero.png
---

![A distracted reviewer presses a glowing green Approve button while ignoring stacks of unread documents](/assets/taste-debt-hero.png)

We have a name for what happens to code when you keep taking shortcuts, [technical debt](https://martinfowler.com/bliki/TechnicalDebt.html). We're getting a name for what happens to a team when AI writes faster than anyone can keep up, [cognitive debt](https://russmiles.substack.com/p/on-cognitive-debt-and-the-care-of), the gap between what the system does and what the people understand it to do. There's a third one, and [AI runs it up faster](https://juanjofuchs.github.io/ai-development/2026/01/27/ai-accelerates-whatever-you-have.html) than either.

Call it taste debt. Technical debt is shortcuts in how the code gets built. Taste debt is shortcuts in the judgment you apply to what gets built, the decisions you let the AI make and rubber-stamped because the output looked fine. It piles up in the product itself, one un-examined default at a time, until the product you shipped is a little less good than what you'd have chosen if you'd been looking.

## The decisions you didn't make

You can't apply judgment to everything, and you shouldn't try. Plenty of what the AI decides doesn't matter, the name of some internal variable, which of two equivalent libraries it reached for, the shape of a helper you'll never read again. Let those go. But some of the decisions do matter, and when you rubber-stamp those the same way, they accumulate. Each one is small, the product still works, it just drifts a little further from what good would have been with every default you wave through.

That drift is why what the AI builds for you can feel a bit off, working but not quite what you pictured, [a parallel dimension version of what you had imagined](https://juanjofuchs.github.io/ai-development/2026/06/16/loop-engineering-for-the-rest-of-us.html). That's taste debt, cashed out in the product. And like technical debt it's recoverable, you can go back, look hard at the decisions you skipped, and pay it down. You just have to notice it first.

## Debt vs rot

That's the debt, and debt is recoverable, it sits in the work and you can go back and fix it. There's a second thing, and this one you can't fix by going back. Call it taste rot.

Taste debt piles up in the product. Taste rot happens to your palate. Live on the model's first draft the way you'd live on fast food, taking whatever it hands you because it goes down easy, and your taste for the real thing fades. You stop being able to tell what's genuinely good from what only looks good, the exact judgment that keeps the debt from piling up. The two feed each other, a duller palate waves more defaults through, and more defaults pile up more debt. You can pay the debt down, but the palate comes back only the way you'd retrain any palate, by tasting good work on purpose until you can tell the difference again.

## The evidence, and what it actually shows

There's a study everyone reaches for and it doesn't say quite what people want it to. Anthropic ran a [controlled trial](https://arxiv.org/abs/2601.20245), 52 developers working in a software library they'd never used. The group that leaned on AI scored about 17% lower on a follow-up quiz than the group that wrote it by hand, almost two letter grades, and the biggest gap was on debugging. The ones who delegated hardest learned the least.

That's real, but it measures coding skill, not taste, so I won't claim it proves your palate rots. What decayed most was debugging, the ability to look at code that runs and tell whether it's actually right. That's the seed of taste. Taste is built out of a thousand small judgments about good and bad, and debugging is one of the most concrete. If that's the first thing to go when you stop doing the work yourself, the rest of your judgment goes the same way.

## Put your taste in the evals

The way to keep taste debt from piling up at AI speed is to put your taste into evals, automated checks that grade the AI's output the way you would, run on everything it produces. OpenAI and Thrive did exactly this with a [tax agent](https://openai.com/index/building-self-improving-tax-agents-with-codex/): the corrections their human reviewers kept making became the evals, and the agent reached up to 97 percent accuracy, graded against that accumulated judgment. That's taste, moved out of one person's head and into a check that runs. It's the same idea I wrote about in an [earlier post](https://juanjofuchs.github.io/ai-development/2026/06/02/claude-just-gave-you-a-dry-promotion-and-will-keep-promoting-you-until.html), your real job now is putting your taste into the checks.

It works because taste is real and learnable. Paul Graham [argued years ago](http://www.paulgraham.com/taste.html) that makers reliably look back and recognize their old tastes were worse, which only makes sense if quality is objective enough to improve at. It's trainable, and you train it by exercising it.

## Paying it down

So the practice is easy to say and annoying to do. Don't accept the first thing the model gives you. Push back on it, regenerate, pick, say why. Every time you wave a default through without examining it you add a little taste debt to the product and let your palate slip a little, and the rate at which you accept un-examined defaults is about the most honest measure of both I can think of. Argue with the AI and you keep your judgment. Defer to it and you lose it.

{% comment %}
## LinkedIn Post
MEDIA: /assets/taste-debt-hero.png
ALT: A distracted reviewer presses a glowing green Approve button while ignoring stacks of unread documents

We track technical debt in the code and cognitive debt in the team. There's a third kind, taste debt, and AI runs it up faster than either.

Technical debt is shortcuts in how the code gets built. Taste debt is shortcuts in the judgment you apply to what gets built, the decisions you let the AI make and rubber-stamped because the output looked fine. It piles up in the product itself, one un-examined default at a time, until what you shipped is a little less good than what you'd have chosen if you'd been looking. It's why the thing the AI builds can feel a bit off, a parallel-dimension version of what you imagined.

There's a second thing, and this one you can't fix by going back. Taste debt piles up in the product. Taste rot happens to your palate. Live on the model's first draft the way you'd live on fast food and your taste for the real thing fades, you stop being able to tell what's genuinely good from what only looks good. The two feed each other: a duller palate waves more defaults through, more defaults pile up more debt.

📌 Anthropic ran a controlled trial, 52 developers on a library they didn't know. The group that leaned on AI scored about 17% lower on a follow-up quiz, nearly two letter grades. The biggest gap was on debugging, telling whether code that runs is actually right. That's coding skill, not taste, but debugging is the seed of taste, and if it's the first thing to go, the rest of your judgment follows.

📌 The fix is to put your taste into evals, automated checks that grade the AI's output the way you would, run on everything it produces. OpenAI and Thrive did this with a tax agent, the corrections their reviewers kept making became the evals, and it reached up to 97 percent accuracy. Paul Graham argued years ago that taste is real and learnable, you train it by exercising it.

The practice is easy to say and annoying to do: don't accept the first thing the model gives you, push back, regenerate, say why. Argue with the AI and you keep your judgment. Defer to it and you lose it.

Taste Debt: https://juanjofuchs.github.io/ai-development/2026/07/07/taste-debt.html

#AI #DeveloperProductivity #SoftwareEngineering #LLM #EngineeringLeadership

---

## X/Twitter Thread
MEDIA: /assets/taste-debt-hero.png
ALT: A distracted reviewer presses a glowing green Approve button while ignoring stacks of unread documents

Tweet 1:
We track technical debt in code and cognitive debt in teams. There's a third kind: taste debt, the un-judged decisions you let AI make and rubber-stamped. It piles up in the product itself, and AI runs it up fastest. 🔥

Tweet 2:
Two halves. Taste debt piles up in the product, and it's recoverable, you go back and apply the judgment you skipped. Taste rot happens to your palate, live on the model's defaults like fast food and you lose the taste for the real thing. 💡

Tweet 3:
Anthropic's controlled trial: 52 developers learning a new library. The group that leaned on AI scored about 17% lower on a follow-up quiz, nearly two letter grades. The biggest gap was on debugging.

Tweet 4:
Taste is trainable. Paul Graham: makers reliably look back and see their old tastes were worse, which only works if quality is real enough to improve at.

Tweet 5:
Put your taste into evals, checks that grade the AI's output the way you would. OpenAI and Thrive did this with a tax agent and it reached up to 97% accuracy on accumulated human judgment. ✅

Tweet 6:
Argue with the AI and you keep your judgment. Defer to it and you lose it. Taste Debt: https://juanjofuchs.github.io/ai-development/2026/07/07/taste-debt.html

#AI #LLM
{% endcomment %}