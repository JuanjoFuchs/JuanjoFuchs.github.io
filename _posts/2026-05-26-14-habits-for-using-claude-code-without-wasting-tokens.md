---
layout: post
title: "14 Habits for Using Claude Code Without Wasting Tokens"
description: "14 cited habits for running Claude Code without burning tokens, published as a living, terminal-styled guide you can point Claude at."
date: 2026-05-26 09:00:00 -0400
categories: ai-development
tags: [claude-code, ai-development, context-engineering, agentic-workflow]
author: JuanjoFuchs
image: /assets/claude-code-tips-hero.png
---

![The Claude Code Engineering Tips guide rendered as a dark, terminal-styled site](/assets/claude-code-tips-hero.png)

I just shipped a guide: [14 habits for using Claude Code well without wasting tokens](https://juanjofuchs.github.io/claude-code-tips/). Every tip cites Anthropic's own docs, something Boris Cherny said publicly, or a field heuristic I can point to. It lives on GitHub and renders as a terminal-styled site, so you can read it like a page or point Claude straight at the repo and let it pull what it needs.

The HTML is for humans, the Markdown is for Claude. Read the site if you want the nice version, or feed Claude the repo Markdown, including `llms.txt`, and ask it to pull the parts relevant to your session.

## The 14 habits

All fourteen, each as the thing to actually do. The deeper why, sources, and full command details stay on the site so this stays readable.

**1. Write the spec first, with verification built in.** Before any non-trivial work, have Claude write a spec, then iterate on it yourself until it's clear before you approve. Build [verification](https://juanjofuchs.github.io/ai-development/2026/02/10/give-your-ai-hills-to-climb.html) into it so Claude checks its own work instead of leaving you as the only feedback loop. Read every line, because one line in a spec easily becomes a thousand lines of code.

**2. Send long, complete prompts.** Front-load everything in one go: goal, constraints, examples, definition of done. A thorough prompt that feels slow to write beats five "actually, also..." follow-ups that each reload the context. Reference files with `@path` instead of pasting them.

**3. One coherent workstream per conversation.** New task, new thread. Don't debug auth, write docs, then scan logs in the same conversation, `/clear` between unrelated tasks so you stop paying to re-read the noise on every turn.

**4. Use `/clear`, `/compact`, and handoffs for different jobs.** `/compact` when the same task runs long, `/clear` on a topic switch, a written handoff doc for any pause over an hour. Keep a status line up so context and cache health stay visible, and when Claude warns about uncached tokens, do what it says.

**5. Babysit implementations.** When Claude fully implements something, watch it. Hit `esc` the second the approach looks off, then fix the prompt or spec. Only reach for `/goal` or `/loop` when you're genuinely willing to spend the tokens they burn.

**6. `/rewind` instead of correcting.** When Claude goes the wrong way, `/rewind` (or double-tap `esc`) back to the last good point instead of typing "actually, do X." A typed correction leaves both the wrong path and the fix sitting in context for the rest of the session.

**7. Opus `xhigh` is the team lead, not the team.** Run Opus `xhigh` in your main coding session and delegate the grunt work, file reads, log scrapes, doc lookups, to Sonnet or Haiku subagents. It's the same move as [managing engineers](https://juanjofuchs.github.io/ai/2026/01/06/engineering-managers-naturally-great-at-ai.html), own the judgment, hand off the execution. For directive work like reading email or summarizing a doc, skip Opus entirely.

**8. Compress tool output on heavy sessions.** When a session is full of `kubectl`, `aws`, Databricks queries, or noisy test logs, don't dump raw output into context. Filter at the CLI, ask for `--json`, or route the noisy work to a subagent so only the summary lands in your window.

**9. Prefer CLIs over MCPs, and set up the toolbox first.** Claude Code lives in the shell, so when a CLI and an MCP do the same job, pick the CLI, ideally an [agent-aware one](https://juanjofuchs.github.io/ai/2026/05/12/why-i-built-yet-another-agent-mail-tool.html). Pre-install and authenticate your tools (`gh`, `aws`, `kubectl`, your log CLI) before the session, your verification depends on them.

**10. Be deliberate about which MCP servers load.** Only enable the servers you need for the work in front of you, every one adds discovery cost at session start. Audit now and then, and turn off anything you haven't touched in weeks.

**11. Install the official LSP plugins.** Add Anthropic's LSP plugins for the languages you actually code in. They give Claude go-to-definition and real diagnostics instead of grep, which collapses a search-and-read loop into a single lookup.

**12. Start hard tasks in a fresh window.** Don't kick off something demanding at the tail of a long conversation. Quality drops as context fills, so open a clean window with a focused brief for the hard stuff.

**13. Treat the harness as a system.** Your `AGENTS.md`, hooks, skills, plugins, and LSPs decide performance more than the model does, they're how you [onboard Claude into your work](https://juanjofuchs.github.io/ai-development/2026/03/31/stop-building-another-claude-learn-how-to-effectively-onboard-one-into-your-organization-instead.html). Review that surface every 3 to 6 months, and when Claude writes throwaway code to finish a task, ask it to turn that into a reusable, agent-aware tool so the lesson sticks.

**14. Let Claude write the commit after you verify the diff.** Once the work is verified and you've reviewed the diff, let Claude write the commit. It still has the spec, the failed attempts, and the why, all the reasoning a later hand-typed "fix bug" would lose.

## Read the living version

This post is the snapshot. The why behind each habit, the citations, and the exact commands all live on the site, and it'll keep growing as I learn more. The way I actually use it is to point Claude at the repo:

> *"Use `gh` cli to inspect `JuanjoFuchs/claude-code-tips`. Read the tips relevant to what we're doing right now, then propose how to integrate them into this workflow."*

The full guide is at [juanjofuchs.github.io/claude-code-tips](https://juanjofuchs.github.io/claude-code-tips/), and that's the copy I keep current.

{% comment %}
## Social Campaign
CAMPAIGN: claude_code_tips_20260526
TIMEZONE: America/New_York

### Tuesday - Launch
DATE: 2026-05-26
TIME: 09:00
MEDIA: /assets/claude-code-tips-spec.png
ALT: Tip 1 from the guide, "Write the spec first, with verification built in," as a terminal-styled card

#### LinkedIn Post
PUBLISHED: 2026-05-26T14:55:53.861Z

Write the spec before you write code, and build verification into it so Claude checks its own work. Then send one long, complete prompt instead of five "actually, also..." corrections.

Those two habits alone cut a lot of the token waste I see in Claude Code sessions.

I just shipped a guide with 12 more like them, 14 in total, every one cited to Anthropic's docs, something Boris Cherny said publicly, or a field heuristic I can point to. It's a living guide rendered as a terminal-styled site, and you can point Claude straight at the repo to pull what it needs.

A couple more from the list:
- Read every line of the spec, one line easily becomes a thousand lines of code
- Reference files with @path instead of pasting them, the prompt stays short and the context stays clean

Full post with all 14: https://juanjofuchs.github.io/ai-development/2026/05/26/14-habits-for-using-claude-code-without-wasting-tokens.html

What's the one Claude Code habit you'd add to the list?

#ClaudeCode #AIEngineering #DeveloperProductivity #AICodingTools #SoftwareEngineering

#### X/Twitter Thread
PUBLISHED: 2026-05-26T14:55:55.766Z

Tweet 1:
Write the spec before the code, and build verification into it so Claude checks its own work. Spec-first cuts a lot of the token waste I see in Claude Code sessions.

Tweet 2:
Send one long, complete prompt: goal, constraints, examples, definition of done. It beats five "actually, also..." follow-ups that each reload the context.

Tweet 3:
Read every line of the spec before you approve it. One line in a spec easily becomes a thousand lines of code, and if you won't read the one line you won't read the thousand.

Tweet 4:
Reference files with @path instead of pasting them. Pasted blobs sit in context every turn, @ loads the current version on demand.

Tweet 5:
14 cited habits for running Claude Code without wasting tokens: https://juanjofuchs.github.io/ai-development/2026/05/26/14-habits-for-using-claude-code-without-wasting-tokens.html

#ClaudeCode #AIEngineering

### Wednesday - Context discipline
DATE: 2026-05-27
TIME: 09:00
MEDIA: /assets/claude-code-tips-context.png
ALT: Tip 3 from the guide, "One coherent workstream per conversation," as a terminal-styled card

#### LinkedIn Post
One coherent workstream per conversation. Don't debug auth, write docs, then scan logs in the same thread, /clear between unrelated tasks.

Stale context isn't free, you pay to re-read the noise on every single turn. Four habits keep a Claude Code session lean:

- /compact when the same task runs long, /clear on a topic switch, a handoff doc for any pause over an hour
- When Claude goes wrong, /rewind (or double-tap esc) instead of typing "actually, do X"
- Start hard tasks in a fresh window, never at the tail of a long one
- Keep a status line up so context and cache health stay visible

These are 4 of 14 cited habits in my Claude Code guide, with the why and the exact commands: https://juanjofuchs.github.io/claude-code-tips/

How long do your sessions run before you /clear?

#ClaudeCode #AIEngineering #DeveloperProductivity #ContextEngineering

#### X/Twitter Thread
Tweet 1:
One coherent workstream per conversation. Don't debug auth, write docs, then scan logs in the same thread, /clear between unrelated tasks.

Tweet 2:
Three context tools, three jobs: /compact when the task runs long, /clear on a topic switch, a written handoff doc for any pause over an hour.

Tweet 3:
When Claude goes wrong, /rewind (or double-tap esc) instead of typing "actually, do X." A typed correction leaves the wrong path AND the fix in context.

Tweet 4:
Start hard tasks in a fresh window. Quality drops as context fills, so the end of a long session is the worst place to begin something demanding.

Tweet 5:
14 cited habits for running Claude Code without wasting tokens: https://juanjofuchs.github.io/claude-code-tips/

#ClaudeCode #AIEngineering

### Thursday - Delegation and cost
DATE: 2026-05-28
TIME: 09:00
MEDIA: /assets/claude-code-tips-delegation.png
ALT: Tip 7 from the guide, "Opus xhigh is the team lead, not the team," as a terminal-styled card

#### LinkedIn Post
Opus xhigh is the team lead, not the team. Keep it on the judgment and delegate the grunt work, file reads, log scrapes, doc lookups, to Sonnet or Haiku subagents.

Most of the cost waste I see is the expensive seat doing cheap work. Four habits fix it:

- Babysit implementations, only reach for /goal or /loop when you're willing to spend the tokens they burn
- On tool-heavy sessions, filter at the CLI or route noisy output to a subagent so only the summary hits your window
- For directive work (read email, summarize a doc), skip Opus entirely
- Once the diff is verified and reviewed, let Claude write the commit while it still holds the why

4 of 14 cited habits in my Claude Code guide: https://juanjofuchs.github.io/claude-code-tips/

Are you delegating to cheaper models yet, or still running Opus for everything?

#ClaudeCode #AIEngineering #DeveloperProductivity #AICostOptimization

#### X/Twitter Thread
Tweet 1:
Opus xhigh is the team lead, not the team. Keep it on judgment, delegate file reads, log scrapes, and doc lookups to Sonnet or Haiku subagents.

Tweet 2:
Babysit implementations. Only reach for /goal or /loop when you're actually willing to spend the tokens they burn.

Tweet 3:
On tool-heavy sessions, don't dump raw kubectl/aws/Databricks output into context. Filter at the CLI or hand it to a subagent so only the summary lands.

Tweet 4:
After the diff is verified and reviewed, let Claude write the commit. It still has the spec, the failed attempts, and the why a "fix bug" message loses.

Tweet 5:
14 cited habits for spending less on Claude Code: https://juanjofuchs.github.io/claude-code-tips/

#ClaudeCode #AIEngineering

### Friday - Toolbox and harness
DATE: 2026-05-29
TIME: 09:00
MEDIA: /assets/claude-code-tips-toolbox.png
ALT: Tip 9 from the guide, "Prefer CLIs over MCPs, and set up the toolbox first," as a terminal-styled card

#### LinkedIn Post
Prefer CLIs over MCPs, and set up the toolbox before you start. Claude Code lives in the shell, so a CLI is the home-field option, and pre-installing gh, aws, kubectl, and your log CLI means the agent executes instead of hunting for tools that aren't there.

Four habits make the environment do the work:

- Only load the MCP servers you actually need, every one adds discovery cost at session start
- Install Anthropic's official LSP plugins so Claude gets go-to-definition instead of grep
- Treat the harness (AGENTS.md, hooks, skills, LSPs) as a product you review every few months
- When Claude writes throwaway code to finish a task, turn it into a reusable agent-aware tool so the lesson sticks

The last 4 of 14 cited habits in my Claude Code guide: https://juanjofuchs.github.io/claude-code-tips/

What's in your pre-session toolbox checklist?

#ClaudeCode #AIEngineering #DeveloperProductivity #AIAgents

#### X/Twitter Thread
Tweet 1:
Prefer CLIs over MCPs. Claude Code lives in the shell, so a CLI is the home-field option, pre-install and authenticate them before the session.

Tweet 2:
Only load the MCP servers you actually need. Every server adds discovery cost at session start, audit and disable the rest.

Tweet 3:
Install Anthropic's official LSP plugins and Claude gets go-to-definition and real diagnostics instead of grepping the codebase.

Tweet 4:
When Claude writes throwaway code to finish a task, turn it into a reusable agent-aware tool. A lessons doc is a hint, a tool enforces the lesson every run.

Tweet 5:
14 cited habits for running Claude Code without wasting tokens: https://juanjofuchs.github.io/claude-code-tips/

#ClaudeCode #AIAgents
{% endcomment %}