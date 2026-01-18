---
layout: post
title: "How to Maximize Your Claude Code Pro/Max Plan (and Stop Leaving Tokens on the Table)"
description: "A strategic guide to reading your burn charts, delegating to cheaper models, and timing your sessions for maximum value from your Claude Code subscription."
date: 2026-01-20 09:00:00 -0500
categories: ai-development
tags: [claude-code, productivity, ccburn, token-management]
author: JuanjoFuchs
image: /assets/ccburn-session-depleted.png
---

![ccburn showing session with depleted line, weekly, and weekly-sonnet charts](/assets/ccburn-session-depleted.png)

You got a Claude Code subscription. You've heard people ship entire projects overnight with it. Maybe you've seen the screenshots of [Gas Town](https://github.com/steveyegge/gastown) running 20 parallel agents or [Ralph Wiggum](https://github.com/anthropics/claude-code/tree/main/plugins/ralph-wiggum) loops burning $100 in an hour. That's not most of us.

This guide is for the 99% who pay $20-200/month and want to get their money's worth without running a token bonfire. Three stages: understanding what you have, using more of it, and not running out mid-session.

## The Token Economy

January 2026 was confusing for Claude Code users. Anthropic ran a holiday bonus that doubled limits, then returned to normal. Forums filled with complaints about "reduced limits" when really the baseline just felt smaller after the bonus ended. The `/usage` command exists, the website shows percentages, but neither tells you if your current pace is sustainable.

The token economy has two layers: 5-hour rolling windows and weekly limits. Your session window starts when you send your first message and resets 5 hours later. Weekly limits cap your total usage across all sessions, with separate buckets for different models.

If you're running Gas Town or doing heavy Ralph Wiggum loops, you need a different guide. Those tools burn $50-100+ per session and are optimized for throughput at any cost. This guide assumes you want to maximize value from a fixed subscription, not minimize time at any price.

## Know Your Models

Opus burns allocation roughly 5x faster than Sonnet. Same prompt, same task, very different token cost. Haiku is cheaper still, about 1/3 of Sonnet's cost while matching its coding performance for straightforward tasks.

When to use each:

- **Opus**: Complex reasoning, architectural decisions, tasks where you need the best output on the first try
- **Sonnet**: Default for most coding work, good balance of capability and cost
- **Haiku**: Exploration, summarization, research tasks, anything read-only

The model you pick matters more than how many prompts you send. A session of heavy Opus usage will hit limits faster than twice as many Sonnet prompts.

## Your Token Scorecard

I built [ccburn](https://github.com/JuanjoFuchs/ccburn) to see token consumption at a glance (full backstory in my [previous post](https://juanjofuchs.github.io/ai-development/2026/01/13/introducing-ccburn-visual-token-tracking.html)). The screenshot above shows the three panels: Session (5-hour rolling window), Weekly, and Weekly Sonnet.

Each chart shows your actual usage climbing up, with a budget pace line (dotted) showing where you'd be if you consumed tokens linearly across the window. A blue "Now" marker shows the current point in time. The usage line changes color based on your status: green when below budget pace, yellow when tracking budget, red when above.

The charts also show a projection line based on your current burn rate. The projection is green when you're on track to stay under budget, and turns orange/red when you're burning too fast. If the projection shows you'll hit 100% before the window resets, a red "Depleted" line appears marking exactly when you'll run out. In the screenshot, the session chart shows 17% usage but a steep projection that would deplete around 19:33 if the current pace continues.

Compact mode gives you a single line for your tmux status bar or Claude Code's status line:

```bash
ccburn --compact
# Output: Session: 🔥 16% (4h 20m) | Weekly: 🔥 63% | Sonnet: 🧊 50%
```

The icons tell you your status: 🧊 means you're behind pace (headroom), 🔥 means you're tracking budget, 🚨 means you're burning too hot.

You can also give Claude Code awareness of its own consumption by having it call `ccburn --json`. The output includes utilization percentages, burn rate per hour, time until limits reset, and a projection showing if and when you'll hit 100%. Claude can use this to pace itself or warn you before starting a large task that might exceed your remaining budget.

## The Flat Line Problem

Open ccburn and look at your weekly-sonnet chart. If it's mostly horizontal with occasional small bumps, you're under-utilizing. That gap between the budget pace line and your actual usage? That's money you're paying for but not using.

Most people start conservative. They use Claude Code for specific tasks, wait for it to finish, review carefully, then maybe ask a follow-up. Nothing wrong with that, but you're leaving capacity on the table.

## Unlocking Ambition

The subscription doesn't just make things faster, it makes more things feasible. Tasks that were "not quite worth the effort" become quick wins. Weekend projects that would've taken a month become weekend projects again. I [vibe coded hwinfo-tui](https://juanjofuchs.github.io/ai-development/2025/12/02/vibe-coding-hwinfo-tui.html) in under a day and [built an MCP server in 3 hours](https://juanjofuchs.github.io/ai-development/2025/12/23/building-mcp-server-three-hours.html) because the subscription removed the friction.

Think about what you've been putting off:

- That refactor you know would clean things up but isn't urgent
- Tests for the module that's been running untested for months
- Documentation you keep meaning to write
- Migrating from one library to another
- Trying a different approach to see if it's better

These all become reasonable when you're not paying per-task and you have unused capacity sitting there.

## What to Do With Your Unused Capacity

Be more ambitious with the tool. If your weekly chart shows headroom, use it.

Run parallel explorations. Have Claude try two different approaches to the same problem and compare them. You're not paying extra for the second attempt, you're using allocation you already have.

Use AI for the tasks you'd normally skip. Write the tests. Generate the docs. Do the refactor. Process your notes and [make your second brain AI-compatible](https://juanjofuchs.github.io/productivity/2025/12/16/making-second-brain-ai-compatible.html). The subscription model means these "nice to haves" cost you nothing extra if you're under your limits anyway.

The goal isn't to burn tokens for the sake of it. The goal is to do more with a tool you're already paying for.

## The Steep Line Problem

Now the opposite problem. Your ccburn chart shows a steep usage line, the projection says you'll hit 100% before the window resets. You're in the middle of something and you're about to get cut off.

The cost of running out mid-session isn't just the wait time. It's the broken momentum. You had context loaded, you knew exactly what to do next, and now you have to stop. When you come back in a few hours, you'll spend time rebuilding that mental state.

## Session Timing

The 5-hour window starts when you send your first message. Most people start their session when they start working, which means the window runs out sometime during their workday.

Here's what I do instead: I start a session 2-3 hours before I actually start working. Send a simple prompt at 6am, then do other things. The window runs from 6am to 11am. I start real work at 9am. At 11am, right in the middle of my focus block, the window resets and I get a fresh allocation.

The result: during my 5-hour focus block (9am-2pm), I have access to two windows' worth of tokens. The first window covers 9am-11am, then it resets and I get another full window from 11am onward.

You're front-loading the reset to happen when you're already in flow, not when you're winding down. The "interruption" of the window ending happens at 11am when you have maximum momentum to immediately start burning into the next window.

To verify your session started, run `ccburn --compact` before you start real work. If it shows session data, you're good. If it doesn't, send any prompt to kick off the window.

## Model Delegation

When your charts show you're burning too fast, the first thing to check is which model you're using. If you're running Opus for everything, that's your problem.

Delegating work to Sonnet and Haiku isn't a compromise, it's using the right tool for the job. Haiku runs 2x faster than Sonnet at 1/3 the cost, and for many tasks the output quality is identical.

You don't need special configuration to do this. Just tell Claude what you want. When I was researching for this post, I told Claude: "Do the web searches yourself, but launch parallel sub-agents using Haiku to read the web pages and give you summaries." It did exactly that, running multiple Haiku agents in parallel to fetch and summarize content while the main conversation stayed focused on planning.

The pattern that works well: Sonnet or Opus for planning and orchestration, Haiku for execution and research. Let the more capable model figure out what to do, then hand off the actual work to the cheaper model with clear instructions. Haiku doesn't need to reason much when the task is well-defined. If you've managed engineers before, [these delegation skills transfer directly](https://juanjofuchs.github.io/ai/2026/01/06/engineering-managers-naturally-great-at-ai.html).

If you find yourself using the same delegation pattern repeatedly, you can automate it with [custom sub-agents](https://code.claude.com/docs/en/sub-agents) configured in YAML files.

## Pacing Techniques

Beyond model selection and timing, a few techniques help you burn tokens more efficiently.

**Batch your prompts.** One long request with multiple changes burns fewer tokens than sending five separate "please also fix this" follow-ups. Each round-trip has overhead, each follow-up requires Claude to reload context.

**Use `/compact` before you hit limits.** This command compresses your conversation context, reducing the tokens needed for subsequent prompts. Run it when you see your session chart climbing faster than you'd like.

**Keep your AGENTS.md lean.** If your project instructions file is hundreds of lines, that's context loaded on every prompt. Keep it under 60 lines. Trust code patterns over exhaustive instructions.

**Set iteration limits for autonomous loops.** If you're using Ralph Wiggum or similar tools, always specify `--max-iterations`. Without a cap, one ambiguous requirement can burn through your entire allocation while Claude tries variation after variation.

## The Journey

Three stages, one goal: get your money's worth.

Start by understanding what you have. Learn the token economy, know which models cost what, set up a dashboard so you can see your burn rate at a glance.

If you're under-utilizing, be more ambitious. The subscription enables bigger projects. Use the unused capacity for tasks you've been putting off.

If you're burning too fast, optimize. Time your sessions so resets happen mid-flow. Delegate to cheaper models. Batch your prompts, compact your context, keep your instructions lean.

[ccburn](https://github.com/JuanjoFuchs/ccburn) helps with all three. It won't manage your tokens for you, but it'll show you exactly where you are so you can make better decisions.

Check it out on [GitHub](https://github.com/JuanjoFuchs/ccburn) or install with `pip install ccburn`.

{% comment %}
## LinkedIn Post
MEDIA: /assets/ccburn-session-depleted.png
ALT: ccburn showing session with depleted line, weekly, and weekly-sonnet charts

You got a Claude Code subscription. Now what?

Most people either under-utilize (flat usage line, paying for capacity they're not using) or burn too fast (running out mid-session, losing momentum).

Three stages to getting your money's worth:

1️⃣ Understand what you have. Token economy has two layers: 5-hour rolling windows and weekly limits. Opus burns 5x faster than Sonnet. Model selection matters more than prompt count.

2️⃣ If you're under-utilizing, be more ambitious. That refactor you've been putting off? The tests you keep meaning to write? These cost nothing extra if you're under your limits.

3️⃣ If you're burning too fast, optimize. Start your session 2-3 hours before you actually work, so the reset happens mid-flow and you get two windows' worth of tokens during your focus block.

Built ccburn to see this at a glance. Burn-up charts for session, weekly, and weekly-sonnet limits with projection lines showing where you're headed.

What's your approach to managing Claude Code limits?

Full post: https://juanjofuchs.github.io/ai-development/2026/01/20/maximizing-claude-code-subscription.html

#ClaudeCode #AITools #DeveloperProductivity #TokenManagement #DevTools

---

## X/Twitter Thread
MEDIA: /assets/ccburn-session-depleted.png
ALT: ccburn showing session with depleted line, weekly, and weekly-sonnet charts

Tweet 1:
You got a Claude Code subscription. Now what? Most people either under-utilize or burn too fast. Here's how to find the sweet spot. 🔥

Tweet 2:
Opus burns allocation 5x faster than Sonnet. Same prompt, same task, very different cost. The model you pick matters more than how many prompts you send. 💡

Tweet 3:
The flat line problem: your weekly chart is mostly horizontal. That gap between budget and usage is money you're paying for but not using. Be more ambitious.

Tweet 4:
The steep line problem: projection says you'll hit limits mid-session. The real cost isn't wait time, it's broken momentum. You had context loaded and now you have to stop.

Tweet 5:
Window stacking hack: start a session at 6am, work 9am-2pm. Window resets at 11am, mid-flow. You get two windows' worth of tokens during your focus block. ✅

Tweet 6:
Built ccburn to see all this at a glance. Burn-up charts with projection lines.

pip install ccburn

Full post: https://juanjofuchs.github.io/ai-development/2026/01/20/maximizing-claude-code-subscription.html

#ClaudeCode #DevTools
{% endcomment %}
