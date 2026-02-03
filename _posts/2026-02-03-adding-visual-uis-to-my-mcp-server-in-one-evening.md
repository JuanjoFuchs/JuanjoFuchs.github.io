---
layout: post
title: "Adding Visual UIs to My MCP Server in One Evening"
description: "MCP Apps was announced on a Monday. By Tuesday morning I had interactive calendars and timesheet grids rendering in Claude Desktop. Here's how Claude Code made that possible."
date: 2026-02-03 09:00:00 -0500
categories: ai-development
tags: [mcp, claude, open-source, typescript]
author: JuanjoFuchs
image: /assets/tempo-mcp-apps-timesheet.png
---

![Tempo MCP Server timesheet grid showing worklogs by issue and day](/assets/tempo-mcp-apps-timesheet.png)

I had stopped using MCP servers entirely. Every server I connected would dump its full tool definitions into the context window, and with four or five servers that meant tens of thousands of tokens gone before I typed anything. The context bloat made Claude Code feel sluggish and I kept hitting limits mid-session.

Then Anthropic shipped [Tool Search](https://x.com/trq212/status/2011523109871108570) in January 2026. Instead of loading all tool definitions upfront, Claude Code now keeps a lightweight index and fetches tool details on-demand when you actually need them. The context savings are massive, up to 85% reduction in some cases. I reconnected my MCP servers and they worked without the bloat.

I also added [server instructions](https://modelcontextprotocol.info/blog/server-instructions) to help Claude know when to load my tools and how to sequence them. A simple workflow hint like "always check schedule before creating worklogs" makes a measurable difference, one [case study](https://www.anthropic.com/engineering/advanced-tool-use) showed 25% improvement in model performance with clear instructions.

A week later, on Monday 1/26 MCP Apps was [announced](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/). Servers could now return interactive HTML UIs that render directly in the chat. I had a Tempo time tracking server that returned JSON, Claude would format it as text, and I thought: this could be a visual timesheet instead.

By Tuesday early morning I had it working. The whole implementation took one evening, and most of that speed came from Claude Code.

## What Made It Fast

The MCP team publishes a [SKILL.md](https://github.com/modelcontextprotocol/ext-apps/blob/main/plugins/mcp-apps/skills/create-mcp-app/SKILL.md) with everything Claude needs to know about building MCP Apps. I just gave Claude Code the raw GitHub URL and it had the full context: the architecture, the SDK patterns, the gotchas, all of it. No hunting through docs, no explaining what I wanted to build, just "add MCP Apps support to this server" and Claude knew what that meant.

This is the thing about Claude Code that keeps surprising me. With the right context loaded, it can ship features that would take me days of reading docs and trial-and-error. The skill file turned a learning curve into a straight line.

## What MCP Apps Actually Is

MCP Apps is an extension to the Model Context Protocol that lets servers return interactive UIs instead of just text. Anthropic and OpenAI co-authored it, which is rare and signals this is becoming real infrastructure.

The architecture is straightforward: your tool returns data like normal, but you also register an HTML resource that knows how to display that data. The host (Claude Desktop, VS Code, ChatGPT) renders your HTML in a sandboxed iframe and passes the tool result to it via postMessage. The UI can even call back to your server to fetch more data or trigger actions.

CLI hosts like Claude Code just ignore the UI metadata and get the JSON response. You don't break backwards compatibility, you just add a richer experience for hosts that support it.

## What I Built

Two visual interfaces for [Tempo Filler](https://github.com/TRANZACT/tempo-filler-mcp-server):

**Timesheet Grid** - Ask for your logged hours and see them in a pivot table like Tempo's own UI. Issues as rows, days as columns, color-coded by coverage (green for full days, yellow for under, red for gaps). You can toggle between day/week/month views.

**Schedule Calendar** - Check your work schedule and see a month grid with working days highlighted. Shows required hours per day, handles holidays, gives you a summary of total capacity.

![Schedule calendar showing working days highlighted in a month grid](/assets/tempo-mcp-apps-calendar.png)

Both render inline in the chat. No browser tabs, no context switching, just ask Claude about your hours and see them visualized right there.

## The Implementation

The MCP Apps SDK provides helper functions that handle most of the ceremony. You register your tool with a `_meta.ui.resourceUri` field pointing to a `ui://` resource, then register that resource to serve your bundled HTML.

```typescript
const resourceUri = "ui://tempofiller/get-worklogs.html";

registerAppTool(server, "get_worklogs", {
  description: "Retrieve worklogs for a date range",
  inputSchema: { /* ... */ },
  _meta: { ui: { resourceUri } }
}, async (params) => {
  const data = await fetchWorklogs(params);
  return {
    content: [{ type: "text", text: JSON.stringify(data) }],
    structuredContent: data
  };
});

registerAppResource(server, resourceUri, resourceUri,
  { mimeType: "text/html;profile=mcp-app" },
  async () => ({
    contents: [{ uri: resourceUri, mimeType: "text/html;profile=mcp-app", text: bundledHtml }]
  })
);
```

The UI side uses `@modelcontextprotocol/ext-apps` to receive the tool result:

```typescript
import { App } from "@modelcontextprotocol/ext-apps";

const app = new App({ name: "Worklogs UI", version: "1.0.0" });

app.ontoolresult = (result) => {
  const data = result.structuredContent || JSON.parse(result.content[0].text);
  renderTimesheetGrid(data);
};

app.connect();
```

I used Vite with `vite-plugin-singlefile` to bundle each UI into a self-contained HTML file. The server reads the bundled file and serves it when the host requests the resource.

## Gotchas I Hit

**The `_meta` structure matters.** I initially tried `_meta: { "ui/resourceUri": "..." }` but it needs to be nested: `_meta: { ui: { resourceUri: "..." } }`. Cost me 20 minutes.

**Register handlers before connecting.** In the UI code, you need to set up `app.ontoolresult` and other handlers before calling `app.connect()`. If you connect first, you might miss the initial result.

**Stateless mode for testing.** The MCP SDK supports stateful sessions but browser-based test hosts can have CORS issues with the session headers. Setting `sessionIdGenerator: undefined` gives you stateless mode which works better during development.

**The basic-host is your friend.** The [ext-apps repo](https://github.com/modelcontextprotocol/ext-apps) includes a basic-host example that lets you test UIs in a browser without restarting Claude Desktop. Point it at your HTTP server, call a tool, see your UI render. Iteration cycles dropped to seconds.

## Try It

If you use Jira with Tempo, you can try this now:

```bash
npx @tranzact/tempo-filler-mcp-server
```

Or grab the [desktop extension bundle](https://github.com/TRANZACT/tempo-filler-mcp-server/releases/download/v2.0.0/bundle.dxt) for one-click Claude Desktop install.

The [development guide](https://github.com/TRANZACT/tempo-filler-mcp-server/blob/main/docs/mcp-apps-development.md) documents everything I learned if you want to add MCP Apps to your own server. And if you're building with Claude Code, point it at the [MCP Apps skill file](https://raw.githubusercontent.com/anthropics/anthropic-cookbook/refs/heads/main/skills/mcp-app-development/mcp-app-development.md) and let it do the heavy lifting.

{% comment %}
## LinkedIn Post
PUBLISHED: 2026-02-03T14:50:29.888Z

MEDIA: /assets/tempo-mcp-apps-timesheet.png
ALT: Tempo MCP Server timesheet grid showing worklogs by issue and day with color-coded coverage

I'd stopped using MCP servers entirely. Every server I connected would dump tool definitions into the context window, tens of thousands of tokens gone before I typed anything.

Then Anthropic shipped Tool Search. Instead of loading all tools upfront, Claude Code now fetches them on-demand. Up to 85% reduction in context usage. I reconnected my servers and they worked without the bloat.

I also added server instructions to help Claude know when to load my tools and how to sequence them. One case study showed 25% improvement with clear workflow hints.

A week later, MCP Apps was announced. Servers could return interactive HTML UIs directly in the chat. I had a Tempo time tracking server returning JSON, and I thought: this could be a visual timesheet.

By Tuesday early morning I had it working. One evening of focused work.

What made it fast: the MCP team publishes a skill file with everything Claude needs to build MCP Apps. I gave Claude Code the raw GitHub URL and it had full context, the architecture, SDK patterns, gotchas. No hunting through docs, just "add MCP Apps support" and Claude knew what that meant.

What I built:
✅ Timesheet grid - issues as rows, days as columns, color-coded coverage
✅ Schedule calendar - month view with working days highlighted
✅ Both render inline, no browser tabs, no context switching

Anthropic and OpenAI co-authored this spec. That kind of collaboration is rare.

Try it: npx @tranzact/tempo-filler-mcp-server

Full post with code and the skill file link: https://juanjofuchs.github.io/ai-development/2026/02/03/adding-visual-uis-to-mcp-server.html

#MCP #ClaudeCode #AITools #OpenSource #TypeScript

---

## X/Twitter Thread
PUBLISHED: 2026-02-03T14:50:28.144Z

MEDIA: /assets/tempo-mcp-apps-timesheet.png
ALT: Tempo MCP Server timesheet grid showing worklogs by issue and day with color-coded coverage

Tweet 1:
I'd stopped using MCP servers. Every connected server dumped tool definitions into context, tens of thousands of tokens gone before typing anything. Tool Search fixed that, now Claude Code fetches tools on-demand. 🔥

Tweet 2:
Server instructions help Claude know WHEN to load your tools and HOW to sequence them. "Always check schedule before creating worklogs" - simple hints like this showed 25% improvement in one case study. 💡

Tweet 3:
A week after reconnecting my MCPs, MCP Apps was announced. Servers can return interactive HTML UIs in the chat. Built timesheet grids and calendars for my Tempo server in one evening.

Tweet 4:
What made it fast: the MCP team publishes a skill file for Claude. I gave Claude Code the raw GitHub URL and it had full context for building MCP Apps. No doc hunting, just "add MCP Apps support" and it knew what to do. ✅

Tweet 5:
Anthropic and OpenAI co-authored the MCP Apps spec together. Competitors collaborating on shared infrastructure instead of building proprietary alternatives. That's how standards win.

Tweet 6:
Try it: npx @tranzact/tempo-filler-mcp-server

Skill file for Claude Code: https://raw.githubusercontent.com/anthropics/anthropic-cookbook/refs/heads/main/skills/mcp-app-development/mcp-app-development.md

Full post: https://juanjofuchs.github.io/ai-development/2026/02/03/adding-visual-uis-to-mcp-server.html

#MCP #ClaudeCode
{% endcomment %}