---
layout: post
title: "Why I Built Yet Another Agent Mail Tool"
description: "agent-mail-cli is a CLI for coding agents to coordinate across harnesses. Install in one command. The agent learns it from one line."
date: 2026-05-12 09:00:00 -0400
categories: ai
tags: [ai, agentic-workflow, multi-agent, cli, mcp]
author: JuanjoFuchs
image: /assets/agent-mail-hero-poster.png
---

![Four-pane terminal demo of agents coordinating via agent-mail-cli](/assets/agent-mail-hero-poster.png)

<div style="position: relative; padding-bottom: 62.82%; height: 0; overflow: hidden;">
  <video style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
         autoplay loop muted playsinline>
    <source src="/assets/agent-mail-hero.mp4" type="video/mp4">
  </video>
</div>

I open-sourced [agent-mail-cli](https://github.com/JuanjoFuchs/agent-mail-cli) a few days ago, a CLI for coding agents to send mail to each other. It can be run in one command, agents can learn it in one line of explanation, no daemon, no MCP server, no harness setup.

I drop this into the sending agent:

> Run `npx -y @juanjofuchs/agent-mail describe` and send a message to `agent-mail-cli:packaging` with all necessary context needed to implement spec 002. You are `second-brain:agent-mail-cli`.

Or for reading:

> Run `npx -y @juanjofuchs/agent-mail describe` and check your inbox. You are `agent-mail-cli:packaging`.

One message teaches the agent the tool. `describe` returns a JSON document, the full schema with identity rules, command examples, and content-routing baked in.

## Why an agent mail CLI

My setup has two tiers, and the messages flow between them.

**Second brain tier (Codex, Claude Code, Gemini).** One agent per project, running in my Obsidian-based second brain, I've written about how it's set up across a four-part series ([Part 1](https://juanjofuchs.github.io/productivity/2025/12/16/making-second-brain-ai-compatible.html), [Part 2](https://juanjofuchs.github.io/productivity/2026/02/24/building-your-second-brain-part-2-when-ai-moves-in.html), [Part 3](https://juanjofuchs.github.io/productivity/2026/03/03/building-your-second-brain-part-3-the-spec-that-wrote-this-post.html), [Part 4](https://juanjofuchs.github.io/productivity/2026/03/17/building-your-second-brain-part-4-the-editorial-loop.html)). It helps me think and write PRDs, maintains the project's vision and roadmap files, and delegates implementation work down to the repo. I have several of these in parallel, one per active project, that's what the `second-brain:agent-mail-cli` identity in the example above is.

**Project tier (Claude Code, Codex)** One agent per repo, running in the repo folder. It receives specs and context from the second-brain Codex above it, implements them, and reports back. The `agent-mail-cli:packaging` identity in the example is the agent running on the agent-mail-cli repo.

Most of the traffic flows top-down, some flows back as the implementer reports completion or blockers.

On top of those two tiers I run a couple of role-based patterns:

- **Writing pipeline.** Claude Code drafts the posts in the blog repo. A separate Codex agent reviews it for arc, conciseness, and connectedness, then runs the [editorial loop](https://juanjofuchs.github.io/productivity/2026/03/17/building-your-second-brain-part-4-the-editorial-loop.html). The two pass context back and forth by message, with the file path as a `--refs`, until it's clean.
- **Image generation.** Codex has `$imagegen` native to its CLI (gpt-image-2), so when I need a hero image or any other visual asset I send the request to a Codex agent.

I also use [Gemini CLI](https://github.com/google-gemini/gemini-cli) for summarizing long docs, scanning emails and chat threads, generating calendar briefings.

Before I built `agent-mail-cli`, the agents didn't talk to each other. With three to six terminal panes running at any given moment (any more and my [brain fries](https://hbr.org/2026/03/when-using-ai-leads-to-brain-fry)), handing work from the second-brain Codex to a repo's Claude Code meant copying the spec path into the right pane, shuttling drafts from the writing Claude to the reviewing Codex by hand, bouncing image paths back from Codex to whichever agent had asked for them. Multiplied by every project I had running, that manual relay became the bottleneck.

I wanted a mailbox: send, read, ack, status. I've been running it across my projects for the last three months, last week I cleaned it up and open-sourced it.

This setup is deliberate. I don't want my second brain locked to Claude Code or to Codex or to any one agent, the vault is mine and I want to keep it agent-agnostic. Whichever harness wins a category this week is the one I should be using, switching shouldn't mean rewiring the brain underneath. So the coordination layer can't care which agent it's talking to either. Codex ships something Claude Code doesn't, the second-brain agent flips to Codex. Gemini CLI gets sharper at code review, it joins the writing pipeline.

## Why nothing else fit

Every option I tried was too big, wanted to take over my sessions, or made me configure the same MCP server in three different config systems.

- **[Beads](https://github.com/gastownhall/beads)** (Steve Yegge's project, 23K stars) is the closest match and the most thoughtful tool in this space. A distributed graph issue tracker for AI agents, has its own messaging with threading and ephemeral lifecycle, hash-based IDs that prevent merge conflicts, `bd remember` for persistent project memory. If you want a real memory system for your agents, install Beads. For me it was too much, it embeds [Dolt](https://github.com/dolthub/dolt) in-process or runs against an external `dolt sql-server`, needs `bd init` per project plus `bd setup claude` / `bd setup codex` / `bd setup factory` / `bd setup mux` / `bd setup cursor` per harness, brings dependency graphs, hierarchy, BQL query language. I just needed a mailbox.
- **MCP servers** like [mcp_agent_mail](https://github.com/Dicklesworthstone/mcp_agent_mail) and [mailbox-mcp](https://github.com/siy/mailbox-mcp) would mean configuring the same MCP server in three different config systems, `.mcp.json` for Claude Code, `~/.codex/config.toml` for Codex, `~/.gemini/settings.json` for Gemini CLI, three formats for one job.
- **[ComposioHQ/agent-orchestrator](https://github.com/ComposioHQ/agent-orchestrator)** (6.8K stars) is the most-starred tmux-based orchestrator, plans tasks, spawns agents, handles CI fixes autonomously. It's a session manager that wants to manage my sessions, more autonomy than I want right now.
- **[Gas City](https://steve-yegge.medium.com/welcome-to-gas-city-57f564bb3607)** (Yegge, April 2026) is the SDK rewrite of Gas Town, autonomous-fleet model, "light factory" in Yegge's own words, also Dolt-backed. I want manual control, not autonomous delegation.
- **[Overstory](https://github.com/jayminwest/overstory)** is an orchestration framework with a 3-tier watchdog, mechanical, AI triage, fleet patrol. Bigger than what I needed.
- **[A2A](https://a2a-protocol.org/latest/specification/)** is JSON-RPC 2.0 over HTTPS with Agent Cards. Different scope, cross-network agent interop, running it means hosting an HTTPS endpoint per agent.
- **[Dolt](https://github.com/dolthub/dolt)** is a 103MB SQL + Git database on MySQL protocol port 3307, "the best database for agent memory" per their README. It's the engine under Beads and Gas City, building coordination on top means running a SQL server.

## How it works

agent-mail-cli is a self-contained executable. Run it with `npx -y @juanjofuchs/agent-mail`, no install needed, the command pulls the binary and runs it directly. Storage is SQLite at `~/.agent-mail/mail.db`. Identities take the form `project:name`, like `second-brain:agent-mail-cli` or `agent-mail-cli:packaging`. Delivery is pull-based, you don't register recipients before sending.

Justin Poehnelt's post on [rewriting CLIs for AI agents](https://justin.poehnelt.com/posts/rewrite-your-cli-for-ai-agents/) lays out seven patterns for this. agent-mail uses four of them:

- **Self-describing.** Run `npx -y @juanjofuchs/agent-mail describe` and the agent gets the full schema as JSON, send, read, ack, status, with examples and content-routing rules baked in.
- **JSON in, JSON out.** Every response is JSON on stdout, errors are JSON on stderr. `read` and `status` accept `--fields`, the agent asks for only the columns it needs and skips the bodies and refs it won't use.
- **No setup, no install.** No config files, no MCP server, no registration. Identity is a CLI argument. Only the system prompt changes.
- **One concept per command.** `send`, `read`, `ack`, `status`. The surface area is small, no query language or sub-flag tree to learn.

Messages and files do different jobs. Messages handle ephemeral coordination, status updates and handoffs. Persistent knowledge lives in files, vault notes for personal stuff, repo files for shared specs and docs. Messages reference files via `--refs` but don't manage them.

For the receiver agent, drop this template into the repo pane:

> Run `npx -y @juanjofuchs/agent-mail describe` and check your inbox. You are `<project>:<session-name>`. Reply when done.

Or just drop this line into your `AGENTS.md` file:

> For sending messages to other agents, inter-agent coordination. Run `npx -y @juanjofuchs/agent-mail describe` and use the appropriate subcommand. Your identity is `<project>:<session-name>`

## What's next

agent-mail-cli is pull-based today. The receiver only sees a message when its agent runs `read`, which means I'm the one nudging the agent to check the inbox. Recording the hero for this post made that obvious. I asked Opus what the other three agents were working on, and Opus had to ask each one to look, then wait for them to come back.

Claude Code shipped [Channels](https://code.claude.com/docs/en/channels) in research preview, an MCP server that pushes events from outside sources (Telegram, Discord, iMessage today) into a running Claude Code session so the agent reacts immediately. Pro and Max users have it without admin setup, Team and Enterprise need an admin to flip `channelsEnabled` on.

Codex doesn't have an equivalent yet ([open request](https://github.com/openai/codex/issues/15299)), and Gemini CLI's hooks fire inside the agent loop, not from outside it. If those gaps close, a future iteration of agent-mail-cli rides on top, a new message arrives as a channel event in the recipient's running session, no `read` poll needed, no "hey, check your mailbox" reply from me. Until then, agents check when I tell them to.

Repo: [github.com/JuanjoFuchs/agent-mail-cli](https://github.com/JuanjoFuchs/agent-mail-cli), MIT licensed. The npm package is scoped to `@juanjofuchs/agent-mail` because `agent-mail` was too close to the existing `agentmail` package, the command it installs is just `agent-mail`. Issues and PRs welcome.