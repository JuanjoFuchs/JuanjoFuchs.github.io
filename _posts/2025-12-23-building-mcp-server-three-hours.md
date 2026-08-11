---
layout: post
title: "Building an MCP Server in 3 Hours with AI"
description: "How I built tempo-filler-mcp-server using Claude and GitHub Copilot. From spec to working TypeScript in one session."
date: 2025-12-23 09:00:00 -0500
categories: ai-development
tags: [mcp, ai, claude, github-copilot, typescript, automation, jira, tempo]
author: JuanjoFuchs
redirect_from: /blog/mcp-in-three-hours
---

I don't like logging hours. It's one of those tasks that feels like overhead rather than work, but sometimes it's necessary, whether for client billing, project tracking, or just keeping records straight.

The mechanics don't help: log into JIRA, navigate to Tempo, find the right issue, enter hours for each day, repeat. Backfilling a month is painful, and bulk operations through the UI are clunky at best.

Here's the thing though: my AI assistants already know what I'm working on. They see my commits, my conversations, the problems I'm solving throughout the day. They can log my time with more detail and accuracy than I ever could from memory at the end of the week.

So I built an [MCP server](https://github.com/TRANZACT/tempo-filler-mcp-server) that lets me tell an AI assistant "fill my October hours" and have it figure out the rest. Took under 3 hours using AI coding assistants, now open source on GitHub and published to NPM.

## The Solution

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) lets you extend AI assistants with custom tools. I built an MCP server that connects to the Tempo API, so any MCP-compatible assistant (Claude, VS Code Copilot, etc.) can create, read, and delete worklogs using natural language.

What you can do:

- "Get my July worklogs" → Returns issue summaries and dates
- "Log 8 hours to PROJ-1234 for July 10" → Creates the worklog entry
- "Fill all weekdays with 8h to PROJ-1234" → Bulk creates entries for working days only

The server handles schedule awareness (working vs non-working days), validates issues exist, and processes bulk operations concurrently.

## How It Figures Out Context

The magic happens because my AI assistant already has access to everything I've been working on. Using the [GitHub CLI](https://cli.github.com/), the assistant can pull my commits across all repos for any time period: which projects I touched, when, and what I was doing based on commit messages. Using the [Jira CLI](https://github.com/ankitpokhrel/jira-cli), it can see which issues I've viewed, updated, or been assigned to recently. And using [Microsoft Graph](https://learn.microsoft.com/en-us/powershell/microsoftgraph/), it can check my Outlook calendar for PTO, all-day meetings, or other context.

So when I say "fill my October hours," the assistant:

1. Pulls my GitHub commits for October → "You worked on project-alpha (12 commits), project-beta (8 commits), internal-tools (3 commits)"
2. Pulls my Jira history → "You touched PROJ-1234, PROJ-5678, INFRA-901"
3. Checks my calendar → "You were out October 14-16, had all-day meetings on October 22"
4. Cross-references repos to Jira projects → Maps commits to the right issues
5. Proposes a breakdown → "I suggest 6h/day to PROJ-1234 (skipping your PTO days), 2h to PROJ-5678 for the days you had meetings on that project"

I can review the proposal, adjust if something looks off, and approve. The MCP server then bulk-creates all the worklogs in one shot.

This is more accurate than anything I could reconstruct from memory. The commit timestamps don't lie, and the assistant can see patterns I'd miss, like that I worked on three different projects in one day and should split hours accordingly.

## How I Built It

### API Discovery Phase

First I needed to understand how Tempo's API actually worked. I manually logged a couple of hours in Tempo through the web UI while watching Chrome DevTools. Captured all the HTTP requests, response payloads, headers, authentication patterns, the whole flow. Copied everything into a document.

The most important discovery was that Tempo requires numerical issue IDs (`originTaskId`) instead of JIRA's alphanumeric keys (`PROJ-1234`), so you need to resolve the issue key first through JIRA's API before creating worklogs. This isn't obvious from Tempo's documentation.

I also researched how to build MCP servers, read through the [Model Context Protocol docs](https://modelcontextprotocol.io/), looked at example implementations, and decided TypeScript was the right choice based on the SDK maturity and ecosystem.

### Specification Phase

With the API payloads and MCP documentation in hand, I used [GitHub Copilot](https://github.com/features/copilot) with Claude Sonnet 4 to write the [detailed spec](https://github.com/TRANZACT/tempo-filler-mcp-server/blob/main/specs/tempo-filler-mcp-v1.md). This took about 30 minutes of back-and-forth prompting to nail down the design. The spec defined four core tools (`get_worklogs`, `post_worklog`, `bulk_post_worklogs`, `delete_worklog`), two URI-based resources for data access, and prompt templates for common operations.

The spec included the actual API endpoints I'd captured, specific technical decisions like using PAT authentication instead of basic auth, caching resolved issue IDs to minimize API calls, concurrent processing via Promise.all(), and error handling for rate limits, expired tokens, and missing issues.

Having the real API behavior documented plus a complete spec turned out to be critical for the next phase.

### Implementation Phase

With the spec done, I used [Claude Code](https://claude.com/claude-code) to implement the entire TypeScript backend in one session. I gave Claude the spec and it generated the complete codebase, tool implementations, and client logic all at once.

The detailed spec paid off. Claude had enough context to write production-ready code with proper error handling, TypeScript types, concurrent processing, and Tempo API integration. No iterative debugging, no multiple attempts, just one pass and the core functionality worked.

### Refinement Phase

I hit Claude's usage limits after the implementation session, so I switched to GitHub Copilot with Claude Sonnet 4 for debugging and polish. This phase took maybe an hour, mostly fixing API payload formatting and authentication details with the Tempo API.

Total time from spec to working server: under 3 hours.

## What I Learned

**Investigate first, then spec.** I've tried building projects by just prompting "build me X" and letting the AI figure it out. That works for small scripts but falls apart for anything with real APIs. Capturing the actual API behavior in Chrome DevTools gave me the ground truth I needed, then the AI could write a spec that matched reality instead of guessing.

**Use different AI tools for different phases.** Copilot with Claude Sonnet 4 was great for collaborative spec writing, Claude Code was perfect for the one-shot implementation, then back to Copilot for refinement.

**AI-assisted development is fast.** Three hours from API investigation to working, published NPM package that handles authentication, concurrent API calls, and complex business logic. I've spent longer than that just debugging authentication issues in traditional projects.

## The Tech Stack

- TypeScript and Node.js v18+
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol) (v1.17.0+)
- Zod for schema validation, Axios for HTTP, date-fns for date handling
- Tempo REST API with PAT authentication
- stdio transport with optional HTTP support

Install via NPX (`npx @tranzact/tempo-filler-mcp-server`), VS Code extension, or Claude Desktop bundle downloads.

## Using It

Once configured with your Tempo API token, you can talk to your AI assistant naturally:

> "Fill my October hours"

> "Show me what I logged last week"

> "What does my timesheet look like compared to my calendar?"

The assistant pulls context from GitHub, Jira, and my Outlook calendar, automatically skips PTO days, and proposes a breakdown. I review and approve, it handles the rest.

## Open Source

Originally built this for internal use at TRANZACT, now open source for anyone who uses Tempo and wants to automate time tracking. The code is on [GitHub](https://github.com/TRANZACT/tempo-filler-mcp-server) and the package is on [NPM](https://www.npmjs.com/package/@tranzact/tempo-filler-mcp-server).

If you're using JIRA Tempo and any MCP-compatible AI assistant, grab it and see if it saves you time.

## Resources

- [GitHub Repository](https://github.com/TRANZACT/tempo-filler-mcp-server)
- [NPM Package](https://www.npmjs.com/package/@tranzact/tempo-filler-mcp-server)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Tempo API Documentation](https://apidocs.tempo.io/)

{% comment %}
## LinkedIn Post

PUBLISHED: 2025-12-23T14:27:09.782Z

I don't like logging hours. It feels like overhead rather than work. But sometimes it's necessary for client billing or project tracking.

Here's the thing: my AI assistants already know what I'm working on. They see my commits, my Jira activity, the problems I'm solving. They can log my time with more detail and accuracy than I ever could from memory.

So I built an MCP server that lets me say "fill my October hours" and the assistant figures out the rest. It pulls my GitHub commits, cross-references my Jira history, proposes a breakdown, and bulk-creates all the worklogs once I approve.

Built the whole thing in under 3 hours using AI coding assistants:

✅ Captured Tempo's API behavior with Chrome DevTools
✅ Used GitHub Copilot to write a detailed spec
✅ Claude Code generated the entire TypeScript implementation in one session

The commit timestamps don't lie. The assistant can see patterns I'd miss, like that I worked on three different projects in one day and should split hours accordingly.

Originally built for internal use at TRANZACT, now open source.

GitHub: https://github.com/TRANZACT/tempo-filler-mcp-server
Full post: https://juanjofuchs.github.io/ai-development/2025/12/23/building-mcp-server-three-hours.html

#AI #OpenSource #Developer #Automation #Productivity

---

## X/Twitter Thread

PUBLISHED: 2025-12-23T14:27:07.863Z

Tweet 1:
I don't like logging hours. My AI assistants already know what I'm working on, they see my commits and Jira activity. Now they log my time better than I ever could. 🔥

Tweet 2:
"Fill my October hours" - that's the prompt. Assistant pulls GitHub commits, cross-references Jira history, proposes a breakdown. I approve, it bulk-creates the worklogs. 💡

Tweet 3:
Commit timestamps don't lie. The assistant sees patterns I'd miss, like working on three projects in one day and splitting hours accordingly. ✅

Tweet 4:
Built the MCP server in under 3 hours. Captured Tempo's API with Chrome DevTools, wrote spec with Copilot, Claude Code generated the TypeScript in one session.

Tweet 5:
GitHub: https://github.com/TRANZACT/tempo-filler-mcp-server
Full post: https://juanjofuchs.github.io/ai-development/2025/12/23/building-mcp-server-three-hours.html

#AI #OpenSource
{% endcomment %}
