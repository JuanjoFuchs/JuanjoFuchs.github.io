---
layout: post
title: "AI Accelerates Whatever You Have"
description: "AI doesn't fix teams or codebases - it amplifies what's already there. The iteration capability is solved. What's missing is measurement infrastructure."
date: 2026-01-27 09:00:00 -0500
categories: ai-development
tags: [ai, coding, architecture, quality]
author: JuanjoFuchs
---

Every AI coding session follows the same pattern. Claude writes code, I review it, catch the mistake, explain what's wrong, Claude fixes it, I review again. This is human-in-the-loop, and it's how most people work with AI coding assistants right now.

AI makes mistakes, that's expected. The issue is that I'm the only one catching them.

I'm the runtime check, the validator, the feedback loop. That doesn't scale, and honestly it gets tedious after the tenth round of "no, that's not what I meant."

## The Iteration Capability Is Solved

Tools like [Ralph Wiggum](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum) let AI run continuously for hours. It's a simple `while true` loop that keeps feeding prompts to Claude until a completion signal fires.

The iteration capability exists. AI can keep trying indefinitely if you let it.

But iteration alone isn't progress. The [documentation](https://github.com/anthropics/claude-code/blob/main/plugins/ralph-wiggum/README.md) is explicit about this:

```
❌ Bad: "Build a todo API and make it good."
   → Infinite loop of variations without convergence

✅ Good: "Build a todo API. Run tests after each iteration.
   Output COMPLETE only when all tests pass with >80% coverage."
   → Deterministic convergence toward passing tests
```

Without something to measure against, AI just wanders. With a clear metric, it iterates toward the goal automatically. The difference is measurement.

## The Measurement Gap

Here's the problem: most codebases don't have the measurement infrastructure that would let AI self-correct. Sparse test coverage. No complexity budgets. No performance baselines. When AI iterates against these codebases, it accelerates whatever's already there.

The research confirms this is happening at scale.

[GitClear analyzed 211 million lines of code](https://www.gitclear.com/ai_assistant_code_quality_2025_research) from Google, Microsoft, Meta, and enterprise companies. They found an 8x increase in duplicated code blocks since AI tools became mainstream, with refactoring activity dropping 60%. Copy-paste now exceeds code reorganization for the first time in history.

[Stanford's study of 100,000+ developers](https://softwareengineeringproductivity.stanford.edu/ai-impact) across 600 companies found productivity gains ranging from 0% to 40% depending on context. The determining factor wasn't the AI tool, it was existing code quality practices. One case study showed 14% more pull requests but 9% lower code quality and 2.5x more rework, resulting in zero net productivity gain.

[Google's 2025 DORA report](https://cloud.google.com/blog/products/devops-sre/announcing-the-2025-dora-report) puts it directly: "AI doesn't fix a team; it amplifies what's already there." Their 2024 data showed a 7.2% decrease in delivery stability for every 25% increase in AI adoption.

The pattern is consistent across all the research. AI accelerates entropy when there's nothing to optimize against. It accelerates quality when there are clear metrics to measure against.

## Why Entropy Is the Default

This isn't surprising if you think about it. Entropy is physics: energy spreads out over time, systems tend toward disorder, and maintaining order requires continuous effort. [Boltzmann showed](https://www.youtube.com/watch?v=DxL2HoqLbyA) that it's overwhelmingly improbable for entropy to decrease on its own.

Codebases follow the same pattern. There are many more ways to write bad code than good code. Without active resistance, code quality degrades: dependencies accumulate, abstractions leak, naming conventions drift, dead code piles up. This happens even with disciplined teams because every quick fix, every "we'll refactor later," every shortcut under deadline pressure adds a small amount of disorder.

The second law of thermodynamics says maintaining order requires energy input. For codebases, that energy comes from tests, code reviews, refactoring, documentation, and all the practices that resist decay. Cut any of them and entropy wins.

AI doesn't change this equation, it accelerates it. More code per hour means more opportunity for disorder per hour. If your codebase was already drifting toward chaos at human speed, it'll drift faster at AI speed. If you had strong practices keeping entropy in check, AI amplifies those too.

Your codebase will experience entropy. That's guaranteed. What matters is whether you have the measurement infrastructure to detect it and the practices to reverse it, before AI makes the problem 10x worse.

## Systems That Can't Self-Correct Get Stuck

Reading Yuval Harari's [Nexus](https://www.ynharari.com/book/nexus/) gave me a different way to think about this.

Harari's [core observation](https://idratherbewriting.com/blog/review-harari-nexus-scms-and-alien-intelligence): systems that can correct themselves improve over time. Systems that can't, get stuck. Science works because experiments can disprove theories. If an experiment contradicts a hypothesis, the hypothesis changes. The correction mechanism is built into the process.

Codebases work the same way. Most have no built-in way to verify correctness. When AI agents interact with them, they need a human to interpret whether changes are valid. Every modification requires someone to review, approve, and validate before it can merge.

This made sense when humans wrote all the code at human speed. But AI agents can generate hundreds of changes per hour. The bottleneck isn't writing code anymore, it's waiting for human review. And that review is often just checking things a machine could check: Does it compile? Do tests pass? Does it match the spec?

## The Gap Is Widening

The gap between organizations with measurement infrastructure and those without is widening fast. Stanford found the productivity gap between AI-proficient and laggard teams grew from 4.8% to 19% over two years, a 4x increase. They project a potential 10x gap by 2030.

MIT professor Armando Solar-Lezama [told the Wall Street Journal](https://sloanreview.mit.edu/article/the-hidden-costs-of-coding-with-generative-ai/) that AI is like "a brand new credit card that is going to allow us to accumulate technical debt in ways we were never able to do before."

AI velocity is increasing whether your codebase is ready or not. You'll need measurement infrastructure eventually. The choice is whether you build it now while the gap is manageable or later when you're further behind.

The iteration tools are here. What's missing is something for AI to iterate toward: tests that define correctness, type systems that enforce constraints, complexity budgets that catch decay, coverage thresholds that prevent gaps. These are the metrics that let AI self-correct instead of waiting for you.

Build them now. The gap is widening.

{% comment %}
## LinkedIn Post

I used to think AI coding tools would make me faster. Instead, I became a full-time reviewer. Write code, review, explain the mistake, fix, review again. Every session, same loop. AI makes mistakes, that's expected. The issue is that I'm the only one catching them.

Three major studies confirmed what I was feeling:

GitClear analyzed 211M lines of code across Google, Microsoft, and Meta. Since AI tools went mainstream: 8x more code duplication, 60% less refactoring. Copy-paste now exceeds code reorganization for the first time in history.

Stanford studied 100k developers across 600 companies. Productivity gains ranged from 0% to 40%. Same tools, wildly different results. The determining factor was existing code quality practices.

Google's DORA report put it directly: "AI doesn't fix a team; it amplifies what's already there."

AI accelerates whatever you already have. If your codebase has strong tests and clear constraints, AI amplifies quality. If it doesn't, AI amplifies entropy.

The gap between prepared and unprepared organizations grew 4x in two years. Stanford projects 10x by 2030.

Full breakdown on what to build and why it matters now:
https://juanjofuchs.github.io/ai-development/2026/01/27/ai-accelerates-whatever-you-have.html

#AIEngineering #CodeQuality #SoftwareArchitecture #TechnicalDebt

---

## X/Twitter Thread

Tweet 1 (Hook):
I used to think AI coding tools would make me faster. Instead, I became a full-time code reviewer. Same loop every session: write, review, explain mistake, fix, review again. 🔥

Tweet 2:
GitClear analyzed 211M lines of code at Google, Microsoft, and Meta. Since AI tools went mainstream: 8x more duplication, 60% less refactoring. Copy-paste now exceeds code reorganization for the first time ever. 💡

Tweet 3:
Stanford studied 100k developers. AI productivity gains ranged from 0% to 40%. Same tools, wildly different results. The determining factor was existing code quality practices. ✅

Tweet 4:
Google's 2025 DORA report: "AI doesn't fix a team; it amplifies what's already there." The gap between prepared and unprepared orgs grew 4x in two years.

Tweet 5:
AI accelerates whatever you already have. Strong tests and constraints? AI amplifies quality. Sparse coverage and no guardrails? AI amplifies entropy. The choice is yours.

Tweet 6:
Full breakdown on what to build before AI makes the problem 10x worse: https://juanjofuchs.github.io/ai-development/2026/01/27/ai-accelerates-whatever-you-have.html

#AIEngineering #CodeQuality
{% endcomment %}