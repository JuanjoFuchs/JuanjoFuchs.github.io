---
layout: post
title: "Usage Is Not Value"
description: "AI adoption worked. Now budgets are breaking, and usage dashboards need to connect token burn to shipped work and KPI movement."
date: 2026-04-28 09:00:00 -0400
categories: ai-development
tags: [ai, claude-code, observability, enterprise, productivity]
author: JuanjoFuchs
image: /assets/usage-is-not-value-hero.png
redirect_from: /blog/usage-is-not-value
---

![Three-stage flow from token burn to shipped work and KPI movement](/assets/usage-is-not-value-hero.png)

Uber maxed out its full-year AI coding budget only a few months into 2026. [The Information reported](https://www.theinformation.com/articles/uber-cto-shows-claude-code-can-blow-ai-budgets) that surging Claude Code use is driving the spend, and around 11% of real backend updates at Uber are now written by AI agents.

That's the problem the next year of AI adoption is going to live in. Companies pushed hard to get developers using Claude, Cursor, Codex, and Copilot, adoption worked, and the bill followed. Now the question is whether the spend produced anything worth paying for.

Raw token count is the easiest answer to reach for, and it's the wrong one.

## The Measurement Ladder

Usage is telemetry. It tells you something happened. It doesn't tell you whether the work was useful, whether the model got stuck, or whether the user gamed the dashboard. It definitely doesn't tell you whether the work moved a KPI that matters.

There are three layers worth measuring:

1. **Usage**: tokens, sessions, hours of model time. The activity layer.
2. **Shipped work**: PRs merged, defects fixed, code accepted. The output layer.
3. **KPI movement**: cycle time, support volume, conversion, reliability. The value layer.

A dashboard that stops at the first layer rewards activity. A dashboard that stops at the second layer rewards output. The dashboard worth building joins all three and answers "was the spend worth it?"

Most AI dashboards being installed across companies right now stop at layer one.

## Tokenmaxxing

Business Insider has been reporting on the rise of usage leaderboards. Disney had an AI Adoption Dashboard where one employee reportedly invoked Claude roughly [460,000 times in 9 days](https://www.businessinsider.com/disney-ai-adoption-dashboard-tokens-tokenmaxxing-claude-cursor-josh-damaro-2026-4). JPMorgan, Disney, and Meta were named in a later story about employees competing for AI leaderboard status, what people are now calling [tokenmaxxing](https://www.businessinsider.com/jpmorgan-disney-employees-vie-for-ai-leaderboard-status-tokenmaxxing-2026-4).

You can see the appeal. Leaders want to know if the company is adopting the tools. A usage dashboard is easy to build, easy to explain, easy to rank. More tokens means more adoption. More adoption means transformation. It's a neat story, and that's why it spreads.

[Cristina Cordova](https://x.com/cjc/status/2041299419845599489) made the comparison that lands hardest: ranking engineers by token spend is like ranking marketing teams by who spent the most money. The metric points at activity, not value. Spend can be useful, wasteful, experimental, or an automation loop nobody noticed.

Indeed's CIO took the opposite path and said they would not use token leaderboards because they create [perverse incentives](https://www.businessinsider.com/indeed-ai-usage-bills-tokens-leaderboard-anthony-moisant-2026-4). That's the right instinct. Measuring usage privately is observability. Ranking usage publicly creates gaming.

Goodhart's Law explains the gaming half. The other half is that even when nobody is gaming, the usage signal can still be wrong.

## Same Burn, Different Causes

Anthropic published an [April 23 postmortem](https://www.anthropic.com/engineering/april-23-postmortem) about Claude quality degradation. Three bugs spanned March and April: a reasoning-effort downgrade, a thinking-deletion bug, and a verbosity prompt that hurt coding quality.

The bugs passed code reviews, automated tests, and dogfooding. Users had been complaining for weeks that Claude felt lazy, forgot context, and burned more tokens for the same work. Anthropic eventually confirmed the degradation and reset usage limits for subscribers.

The conversation hasn't ended. Users are still tracking prompt caching behavior and debating whether it inflated burn in ways the official postmortem didn't cover.

Same user-visible burn can come from very different places: a real task, bad session hygiene, a leaderboard incentive, or a vendor-side regression. Raw usage flattens all of those into the same number.

If you were ranking engineers on token spend during March and April of 2026, you probably weren't ranking them on adoption. You may have been ranking them on who got hit hardest by these vendor regressions.

Even when the metric isn't being gamed, it isn't telling you what you think it's telling you.

## What Better Measurement Looks Like

Artifacts give you a better signal than usage: code merged, PRs accepted, defects fixed, cycle time, and cost per resolved issue.

Anthropic's own [Claude Code ROI guide](https://github.com/anthropics/claude-code-monitoring-guide/blob/main/claude_code_roi_full.md) points in this direction: output, acceptance, PRs, work completed. It doesn't say "rank people by token burn." The official guide is already closer to value than the leaderboards are.

I built [ccburn](https://juanjofuchs.github.io/ai-development/2026/01/13/introducing-ccburn-visual-token-tracking.html) at the activity layer because I wanted to know if I was about to run out of Claude Code mid-session.

Burn rate stopped being enough pretty quickly, because some expensive sessions produced clean architecture and some cheap ones produced code I had to throw away. So [Claudefana](https://juanjofuchs.github.io/ai-development/2026/03/10/claudefana-beyond-the-burn-rate.html) added cache efficiency, cost per commit, and edit accept rate. [Claudefana Enterprise](https://juanjofuchs.github.io/ai-development/2026/03/24/measuring-claude-code-adoption-at-the-org-level.html) added the org context by joining Claude Code usage with team structure and Jira/Tempo work data, answering the questions Anthropic's ROI guide asks.

But artifacts are still only the middle layer.

I wrote last week about [the Super IC](https://juanjofuchs.github.io/ai-development/2026/04/21/the-call-to-become-a-super-ic.html), and the core idea was that code is no longer the outcome by itself. Code is the enabler. The deliverable is the measured outcome.

The same applies here. If AI helped you merge more code but conversion didn't move, support volume didn't drop, or cycle time didn't improve, the value question is still open. The dashboard should make that visible. It should help you ask better questions, not hand you a leaderboard and pretend the ranking is the answer.

## The Scoreboard Warning

A usage leaderboard is easy to build and feels like progress, but it keeps the real dashboard questions out of view: whether cycle time dropped, defects fell, support tickets eased, or the product shipped faster.

The dashboard worth building connects spend to shipped work, then to the KPI the work was supposed to move.

Keep usage in the observability layer and tie value to outcomes, because once usage becomes the scoreboard, people learn to win the scoreboard.

{% comment %}
## LinkedIn Post
PUBLISHED: 2026-04-28T10:18:16.562Z

MEDIA: /assets/usage-is-not-value-hero.png
ALT: Three-stage flow from token burn to shipped work and KPI movement

Companies wanted AI adoption. They got it, and now they're running into the bill. Token leaderboards don't just create tokenmaxxing, leading to real waste. Goodhart's Law explains part of it. The other half is the string of bugs Claude Code had in March and April that inflated token burn.

Once usage becomes the score, people start optimizing for the score, especially when the leaderboards represent status.

Cristina Cordova put it cleanly: ranking engineers by token spend is like ranking marketing teams by ad spend. And don't mistake a high burn rate for a high success rate.

Anthropic's April 23 postmortem confirmed three bugs that degraded Claude's intelligence and inflated token burn. Users are still reporting more problems that haven't been addressed.

If you were ranking engineers on token spend during that window, you probably weren't ranking them on adoption. You may have been ranking them on who got hit hardest by these vendor regressions.

And even when the tools work fine, output isn't value.

PRs merged, defects fixed, and code accepted are better than tokens burned. They're still middle-layer signals. The real question is whether the work moved the KPI.

That's the dashboard we should be building: usage in the observability layer, shipped work as the audit trail, and KPI movement as the answer to "was it worth it?"

https://juanjofuchs.github.io/ai-development/2026/04/28/usage-is-not-value.html

What does your AI dashboard reward today, and what would it take to push it one layer deeper?

#ClaudeCode #AIAdoption #EngineeringMetrics

---

## X/Twitter Thread
PUBLISHED: 2026-04-28T14:57:23.250Z

MEDIA: /assets/usage-is-not-value-hero.png
ALT: Three-stage flow from token burn to shipped work and KPI movement

Tweet 1:
Companies wanted AI adoption.

They got it.

Now they're running into the bill.

Uber reportedly maxed out its full-year AI budget only months into 2026, and ~11% of backend updates are now written by AI agents.

Tweet 2:
If the AI work is valuable, maybe the budget was wrong.

If it's waste, the dashboard needs to catch it.

Raw usage won't tell you the difference.

Tweet 3:
Tokenmaxxing is what happens when usage becomes status.

Disney reportedly had one user invoke Claude roughly 460,000 times in 9 days.

The dashboard sees activity. It doesn't know whether that was useful automation or waste.

Tweet 4:
I still want usage telemetry.

ccburn started as burn-rate tracking.

Claudefana became session-value tracking.

That's the measurement jump enterprises need too.

Tweet 5:
A better AI dashboard doesn't stop at tokens.

It connects spend to shipped work, then to the KPI the work was supposed to move: cycle time, defects, reliability, support volume.

Tweet 6:
AI dashboards should start with usage, then prove shipped work and KPI movement.

If they stop at token burn, they're measuring activity.

https://juanjofuchs.github.io/ai-development/2026/04/28/usage-is-not-value.html

#ClaudeCode #AIAdoption
{% endcomment %}