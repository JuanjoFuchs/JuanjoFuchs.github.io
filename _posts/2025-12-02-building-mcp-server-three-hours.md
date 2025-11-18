---
layout: post
title: "Building an MCP Server in 3 Hours with AI"
description: "How I built tempo-filler-mcp-server using Claude and GitHub Copilot. From spec to working TypeScript in one session."
date: 2025-12-02 09:00:00 -0500
categories: ai-development
tags: [mcp, ai, claude, github-copilot, typescript, automation, jira, tempo]
author: JuanjoFuchs
---

I built an [MCP server](https://github.com/TRANZACT/tempo-filler-mcp-server) in under 3 hours using AI coding assistants. The project lets AI assistants manage Tempo time tracking in JIRA through natural language, and it's now open source on GitHub and published to NPM.

## The Problem

Filling out time tracking in JIRA Tempo is tedious. You log into JIRA, navigate to Tempo, find the right issue, enter hours for each day, repeat. If you need to backfill a month of hours it's painful, and bulk operations through the UI are clunky at best.

I wanted to tell an AI assistant "fill all my October weekdays with 8 hours on PROJ-1234" and have it just work.

## The Solution

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) lets you extend AI assistants with custom tools. I built an MCP server that connects to the Tempo API, so any MCP-compatible assistant (Claude, VS Code Copilot, etc.) can create, read, and delete worklogs using natural language.

Here's what you can do:

- "Get my July worklogs" → Returns issue summaries and dates
- "Log 8 hours to PROJ-1234 for July 10" → Creates the worklog entry
- "Fill all weekdays with 8h to PROJ-1234" → Bulk creates entries for working days only

The server handles schedule awareness (working vs non-working days), validates issues exist, and processes bulk operations concurrently.

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

This is where the detailed spec paid off. Claude had enough context to write production-ready code with proper error handling, TypeScript types, concurrent processing, and Tempo API integration. No iterative debugging, no multiple attempts, just one pass and the core functionality worked.

### Refinement Phase

I hit Claude's usage limits after the implementation session, so I switched to GitHub Copilot with Claude Sonnet 4 for debugging and polish. This phase took maybe an hour, mostly fixing API payload formatting and authentication details with the Tempo API.

Total time from spec to working server: under 3 hours.

## What I Learned

**Investigate first, then spec.** I've tried building projects by just prompting "build me X" and letting the AI figure it out. That works for small scripts but falls apart for anything with real APIs. Capturing the actual API behavior in Chrome DevTools gave me the ground truth I needed, then the AI could write a spec that matched reality instead of guessing.

**Use different AI tools for different phases.** Copilot with Claude Sonnet 4 was great for collaborative spec writing, Claude Code was perfect for the one-shot implementation, and then back to Copilot for refinement. They each have strengths.

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

> "Show me what I logged last week"

> "Fill all my September weekdays with 8 hours to PROJ-5678"

> "Delete all my worklogs from October 15"

The assistant uses the MCP server tools to handle the Tempo API calls, validation, and bulk processing. It's like having a smart command-line interface that understands natural language.

## Open Source

Originally built this for internal use at TRANZACT, but it's now open source for anyone exploring AI-driven productivity workflows. The code is on [GitHub](https://github.com/TRANZACT/tempo-filler-mcp-server) and the package is on [NPM](https://www.npmjs.com/package/@tranzact/tempo-filler-mcp-server).

If you're using JIRA Tempo and any MCP-compatible AI assistant, grab it and see if it saves you time.

## Resources

- [GitHub Repository](https://github.com/TRANZACT/tempo-filler-mcp-server)
- [NPM Package](https://www.npmjs.com/package/@tranzact/tempo-filler-mcp-server)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Tempo API Documentation](https://apidocs.tempo.io/)

{% comment %}
## LinkedIn Post

I built an MCP server in under 3 hours using AI coding assistants. The project lets AI assistants manage Tempo time tracking in JIRA through natural language, and it's now open source.

Here's the process: Started by capturing Tempo's API behavior with Chrome DevTools while manually logging hours. Most important discovery was that Tempo requires numerical issue IDs instead of JIRA's alphanumeric keys, not obvious from the docs. Used GitHub Copilot with Claude Sonnet 4 to write a detailed spec based on the captured payloads, then Claude Code generated the entire TypeScript implementation in one session.

Three key takeaways from building this:

✅ Investigate first, then spec - Capturing real API behavior gave me ground truth, then AI could write accurate specs instead of guessing

✅ Use different AI tools for different phases - Copilot for collaborative spec writing, Claude Code for one-shot implementation, back to Copilot for refinement

✅ Three hours from API investigation to published NPM package - I've spent longer debugging auth issues in traditional projects

The server handles natural language commands like "fill all my October weekdays with 8 hours on PROJ-1234" and processes bulk operations concurrently. Originally built for internal use at TRANZACT, now open source for anyone exploring AI-driven productivity workflows.

What's your experience building with AI coding assistants? Found any workflows that work particularly well?

#AI #OpenSource #Developer #Automation #Productivity

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/ai-development/2025/11/25/building-mcp-server-three-hours.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread

Tweet 1 (Hook):
Built an MCP server in 3 hours using AI coding assistants. Total time from API investigation to published NPM package. Here's the process that made it work. 🔥

Tweet 2:
Started by watching Chrome DevTools while manually logging hours in Tempo. Captured all the HTTP requests, payloads, auth patterns. Ground truth beats guessing. 💡

Tweet 3:
Key discovery: Tempo requires numerical issue IDs, not JIRA's alphanumeric keys. You have to resolve PROJ-1234 to a number first. Not in the docs anywhere.

Tweet 4:
Used the captured API data to write a detailed spec with GitHub Copilot + Claude Sonnet 4. Then gave the spec to Claude Code and it generated the entire TypeScript backend in one session. ✅

Tweet 5:
The lesson: investigate first, spec second, implement third. AI can't guess API quirks but it's incredibly fast once it has accurate context.

Tweet 6:
Server now handles natural language like "fill all October weekdays with 8h on PROJ-1234" and processes bulk ops concurrently. Open sourced it. ✨

Tweet 7:
Complete breakdown of the 3-hour dev process and what I learned about AI-assisted development: https://juanjofuchs.github.io/ai-development/2025/11/25/building-mcp-server-three-hours.html

#AI #OpenSource

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
