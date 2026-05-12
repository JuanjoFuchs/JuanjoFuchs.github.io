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

{% comment %}
## Social Campaign
CAMPAIGN: agent_mail_20260512
TIMEZONE: America/New_York

### Tuesday - Launch
DATE: 2026-05-12
TIME: 09:00
MEDIA: /assets/agent-mail-hero.mp4
ALT: Four-pane terminal demo of agents coordinating via agent-mail-cli

#### LinkedIn Post

I open-sourced agent-mail-cli last week. It's a CLI for coding agents to send mail to each other. One command to install via npx, agents learn it from one line of explanation. No daemon, no MCP server, no harness setup.

The setup behind it has two tiers. A second-brain agent per project handles vision, PRDs, and roadmap planning in my Obsidian vault. A repo agent per project receives specs from the second-brain agent and implements them. Multiply by every active project and the message volume gets real fast.

I drop one line into the sending agent:

"Run npx -y @juanjofuchs/agent-mail describe and send a message to agent-mail-cli:packaging. You are second-brain:agent-mail-cli."

The agent reads the schema, sends the message, the recipient picks it up the next time it polls. The whole API is four commands: send, read, ack, status.

Three months running across my projects, last week I cleaned it up and shipped it MIT-licensed.

✅ One command install
✅ One line of explanation
✅ No config, no MCP server

Full breakdown:
https://juanjofuchs.github.io/ai/2026/05/12/why-i-built-yet-another-agent-mail-tool.html

What's your agent coordination setup look like?

#AI #AgenticWorkflow #MultiAgent #CLI #OpenSource

#### X/Twitter Thread

Tweet 1:
I open-sourced agent-mail-cli last week. A CLI for coding agents to send mail to each other. One command to install via npx, agents learn it from one line of explanation. 🔥

Tweet 2:
The setup is two tiers, a second-brain agent per project handles PRDs and vision, a repo agent receives specs and implements them. Multiply by every active project and the message volume adds up fast.

Tweet 3:
Drop one line into the sending agent: Run `agent-mail describe` and send a message to project:recipient. The agent reads the schema, sends, recipient polls. 💡

Tweet 4:
Three months running across my projects, MIT licensed. ✅

Tweet 5:
Full breakdown: https://juanjofuchs.github.io/ai/2026/05/12/why-i-built-yet-another-agent-mail-tool.html

#AgenticWorkflow #AI

### Wednesday - Problem
DATE: 2026-05-13
TIME: 09:00

#### LinkedIn Post

I run 3 to 6 agents in terminal panes at any moment. Any more and my brain fries (HBR ran a study on it called "When Using AI Leads to Brain Fry").

I have been improving my "second brain" Obsidian vault to work with AI agents for over 6 months now and I don't want to lock myself into one agent harness, the vault is mine and I want to keep it agent-agnostic. Whichever harness is sharpest at the task this week gets the work, Claude Code in one pane, Codex in another, Gemini CLI in another.

The catch: none of them talked to each other. Handing a spec from the second-brain Codex to a repo's Claude Code meant copying the path into the right pane. Drafts shuttled from the writing Claude to the reviewing Codex through me. Image paths bounced back from the image-gen agent to whichever pane asked for them. Multiplied by every project, that manual relay became the bottleneck.

Looked at the existing tools first. Beads from Steve Yegge is the most thoughtful in the space, but it embeds Dolt and needs setup per harness. MCP servers mean configuring the same server in three different config formats, one per harness. Gas City wants to run an autonomous fleet, more autonomy than I want right now. So I built the small thing myself.

Full breakdown:
https://juanjofuchs.github.io/ai/2026/05/12/why-i-built-yet-another-agent-mail-tool.html

How are you handling coordination between your agent sessions?

#AI #MultiAgent #AgenticWorkflow #DevTools #OpenSource

#### X/Twitter Thread

Tweet 1:
I run 3 to 6 agents in terminal panes at any moment. Any more and my brain fries (HBR ran a study on it, "When Using AI Leads to Brain Fry"). 🔥

Tweet 2:
Been improving my "second brain" Obsidian vault for AI agents for 6+ months and I want to keep it agent-agnostic. Whichever harness is sharpest at the task gets the work, Claude Code, Codex, Gemini CLI all running in parallel.

Tweet 3:
The catch: none of them talked to each other. I was copying spec paths by hand, shuttling drafts from writer to reviewer, bouncing image paths back from one pane to another. Everything went through me. 💡

Tweet 4:
Tried Beads (embeds Dolt, setup per harness), MCP servers (3 config formats for 1 job), Gas City (autonomous fleet), so I built the small thing myself. ✅

Tweet 5:
Full breakdown:
https://juanjofuchs.github.io/ai/2026/05/12/why-i-built-yet-another-agent-mail-tool.html

#MultiAgent #AI

### Thursday - Implementation
DATE: 2026-05-14
TIME: 09:00

#### LinkedIn Post

NOTE: Tag Justin Poehnelt in the post body when publishing.

Justin Poehnelt wrote a post called "Rewrite Your CLI for AI Agents" and I loved it so much I went back and updated all my second brain's CLI tools to match. agent-mail-cli is the cleanest example, built from scratch with the patterns.

He lays out seven, agent-mail uses four.

Self-describing. Run `agent-mail describe` and the agent gets the full schema as JSON. The output covers send, read, ack, status, identity rules, command examples, and content-routing.

JSON in, JSON out. Every response is JSON on stdout, errors JSON on stderr. read and status accept --fields, the agent asks only for the columns it needs.

No setup, no install. No config files, no MCP server, no registration. Identity is a CLI argument, only the system prompt changes between agents.

One concept per command. send, read, ack, status. Small surface, no query language to learn.

The other three patterns (idempotency, structured errors, streaming) didn't fit a mailbox cleanly, so they're not in there.

Full breakdown:
https://juanjofuchs.github.io/ai/2026/05/12/why-i-built-yet-another-agent-mail-tool.html

Which of Justin's patterns have you applied to a tool of your own?

#AI #DevTools #CLI #AgenticWorkflow #SoftwareDesign

#### X/Twitter Thread

NOTE: Tag @justinpoehnelt in tweet 1 (verify the exact handle before posting).

Tweet 1:
@justinpoehnelt wrote "Rewrite Your CLI for AI Agents" and I loved it so much I went back and updated all my second brain's CLI tools to match. agent-mail-cli is the cleanest example. 🔥

Tweet 2:
Self-describing. Run `agent-mail describe` and the agent gets the full schema as JSON, send, read, ack, status, identity rules and command examples included. 💡

Tweet 3:
JSON in, JSON out. read and status accept --fields, so the agent asks only for the columns it needs and skips bodies it won't read.

Tweet 4:
No setup, no install, no config files, no MCP server, no registration. Identity is a CLI argument, only the system prompt changes between agents. ✅

Tweet 5:
Full breakdown:
https://juanjofuchs.github.io/ai/2026/05/12/why-i-built-yet-another-agent-mail-tool.html

#AIAgents #CLI

### Friday - Practical Takeaway
DATE: 2026-05-15
TIME: 09:00

#### LinkedIn Post

CLI tools are no longer written for us, they're written for our agents.

For decades, picking up a new CLI meant reading docs and memorizing flags. With an agent in the loop, you can skip all that, your agent runs `describe` and reads the schema.

Try it yourself, you don't need to install anything. Tell your agent to run:

npx -y @juanjofuchs/agent-mail describe

The agent gets the full schema, send, read, ack, status, with examples and identity rules. Then it can send a message in the next turn.

A test you can run yourself:

npx -y @juanjofuchs/agent-mail send --from test:alice --to test:bob --body 'hello'
npx -y @juanjofuchs/agent-mail read --as test:bob

To wire it in permanently, one line in your AGENTS.md:

"For inter-agent coordination, run npx -y @juanjofuchs/agent-mail describe. Your identity is project:session-name."

What's next: Claude Code shipped Channels in research preview, pushing external events into a running session. When Codex and Gemini get the same, agent-mail rides on top, new mail arrives as a session event without any polling from me.

✅ One command install
✅ One line onboarding
✅ MIT licensed

Repo: github.com/JuanjoFuchs/agent-mail-cli

Full post:
https://juanjofuchs.github.io/ai/2026/05/12/why-i-built-yet-another-agent-mail-tool.html

PRs welcome.

#AI #OpenSource #DevTools #CLI #AgenticWorkflow

#### X/Twitter Thread

Tweet 1:
CLI tools are no longer written for us, they're written for our agents. Picking up a new CLI used to mean reading docs and memorizing flags. Now the agent runs `describe` and reads the schema. 🔥

Tweet 2:
Try agent-mail-cli without installing anything. Tell your agent: npx -y @juanjofuchs/agent-mail describe. The agent gets the schema, then it can send messages in the next turn. 💡

Tweet 3:
A test you can run yourself:
npx @juanjofuchs/agent-mail send --from test:alice --to test:bob --body 'hello'
npx @juanjofuchs/agent-mail read --as test:bob

Tweet 4:
Wire it in permanently: one line in your AGENTS.md. "For inter-agent coordination, run agent-mail describe. Your identity is project:session-name." ✅

Tweet 5:
Repo (MIT): github.com/JuanjoFuchs/agent-mail-cli
Full post: https://juanjofuchs.github.io/ai/2026/05/12/why-i-built-yet-another-agent-mail-tool.html

#OpenSource #AI
{% endcomment %}