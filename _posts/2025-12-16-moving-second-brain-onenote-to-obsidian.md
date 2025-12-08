---
layout: post
title: "How I Moved My Second Brain from OneNote to Obsidian"
description: "OneNote's closed format made it impossible for AI agents to access my notes. Obsidian's plain markdown files, YAML front matter, and Dataview queries make it perfect for AI workflows."
date: 2025-12-16 09:00:00 -0500
categories: productivity
tags: [obsidian, onenote, second-brain, gtd, mcp, ai, productivity, dataview]
author: JuanjoFuchs
---


I used OneNote as my second brain for years. It worked fine until I wanted AI agents to help me manage my notes. OneNote stores everything in a proprietary format that's essentially a black box to external tools. I needed something AI could actually read and write to, so I migrated to [Obsidian](https://obsidian.md/).

## What's a Second Brain?

A second brain is an external system where you offload everything you need to remember. Ideas, tasks, projects, reference material, meeting notes, everything goes into the system so your actual brain can focus on thinking instead of remembering. The concept comes from Tiago Forte's book [Building a Second Brain](https://www.buildingasecondbrain.com/book) but the core idea is simple: capture everything externally, organize it so you can find it, and review it regularly.

## Second Brain vs GTD

These are different systems that complement each other. A second brain is primarily about **knowledge management**, collecting and connecting information so you can find it later and build on it. GTD (Getting Things Done) is about **task management**, turning inputs into actionable next steps and tracking them to completion.

Second brain answers "where did I put that article about X?" and "what do I know about Y?" GTD answers "what should I work on next?" and "what am I waiting for from others?"

I use GTD for organization, not the PARA method from second brain methodology. GTD already has the structure I need: Projects (outcomes requiring multiple actions), Areas of Focus (ongoing responsibilities), and Reference material (information to keep but not act on). My second brain is just the container where all of this lives, with an ubiquitous inbox where everything lands first, next actions with context tags like `@computer` or `@calls`, waiting-for lists for delegated items, and someday/maybe for ideas I'm not acting on yet. Weekly reviews keep everything current.

One of GTD's key principles is ubiquitous capture, you need to be able to capture ideas anywhere, anytime. [Obsidian has mobile apps](https://obsidian.md/mobile) for iOS and Android, and I use Git to sync my vault between devices. Idea hits me on my phone, I capture it to the inbox, it's there when I sit down at my computer. The plain markdown files make this simple, any Git client works for sync.

Obsidian's [daily notes](https://help.obsidian.md/Plugins/Daily+notes) feature is my inbox. I have a shortcut mapped to `obsidian://daily` that opens today's note instantly, I dump whatever comes to mind there. Ideas, tasks, random thoughts, links to check later, it all goes in the daily note. No formatting, no organizing, just capture. The processing happens later.

## Why OneNote Stopped Working

OneNote is great for capturing and organizing notes visually. The problem is the file format. Everything lives in `.one` files that only Microsoft tools can read properly. When I started using AI coding assistants and wanted them to access my notes, I hit a wall.

I couldn't ask Claude to "check my project notes for context" because Claude couldn't read OneNote files. The MCP (Model Context Protocol) ecosystem was growing, but no MCP server could parse OneNote's format reliably. My second brain was locked in a format that only I could access, which defeated the purpose of having an external system if my AI assistants couldn't use it.

## Why I Love Obsidian

[Obsidian](https://obsidian.md/) stores everything as plain markdown files in a local folder. That's it. No proprietary format, no cloud dependency, no sync service required. Your notes are just `.md` files you can open with any text editor, version control with git, or read with any tool that understands text.

This is huge for AI integration. LLMs are exceptionally good at reading and writing markdown. It's one of the formats they handle best because so much of their training data includes markdown documentation, README files, and technical writing. When your notes are markdown, AI can work with them natively.

### Plain Markdown Files

Every note is a standalone `.md` file. No database, no proprietary container, just text files in folders. This means:

- Any tool that reads text can read your notes
- You can version control your vault with git
- Backups are just file copies
- If Obsidian disappears tomorrow, your notes still work

AI assistants can read markdown directly, parse the structure (headings, lists, code blocks), and write valid markdown back. There's no translation layer needed, the format AI works in natively is the format your notes live in.

### YAML Front Matter

[Front matter](https://jekyllrb.com/docs/front-matter/) is a block of YAML metadata at the top of a markdown file, delimited by `---`. It's a pattern that originated with static site generators like Jekyll but has become a standard way to add structured metadata to markdown documents.

```yaml
---
tags: [project, area/open-source]
status: active
priority: 2
due-date: 2025-12-31
---
```

AI models understand front matter extremely well. It's structured, predictable, and appears constantly in their training data. When Claude reads a note with front matter, it immediately understands the metadata and can use it for filtering, sorting, or context. When writing notes, AI can add appropriate front matter without being told the exact format.

This matters for querying. Front matter fields become queryable properties. I can ask "show me all active projects with priority 1" and the system can actually answer that because the metadata is structured.

### Dataview: SQL for Your Notes

[Dataview](https://blacksmithgu.github.io/obsidian-dataview/) is an Obsidian plugin that lets you query your notes like a database. You write queries in a SQL-like language called DQL (Dataview Query Language), and it pulls data from your notes based on front matter, tags, links, and inline fields.

For example, to see all my incomplete tasks tagged with `@computer`:

```dataview
TASK
FROM #project
WHERE !completed AND contains(text, "@computer")
```

Or to list all active projects sorted by priority:

```dataview
TABLE status, priority, due-date
FROM "Projects"
WHERE status = "active"
SORT priority ASC
```

Dataview supports four query types: TABLE for spreadsheet-like views, LIST for bullet points, TASK for interactive task lists, and CALENDAR for date-based visualization. The queries update live as your notes change.

For AI workflows, Dataview is powerful because Claude can run these queries through MCP. Instead of searching through notes manually, I can ask Claude to "check what's due this week" and it executes a Dataview query against my vault. The structured front matter plus Dataview queries means AI can answer questions about my notes programmatically.

### Graph and Linking

Obsidian uses wiki-style `[[links]]` to connect notes. These aren't just navigation, they create a graph of relationships between ideas. The graph view visualizes these connections, but more importantly, AI can traverse them.

When Claude searches my vault through MCP, it can follow links to find related context. If I'm working on a blog post and mention a project, Claude can follow the link to that project's note, see its status, check related tasks, and pull in relevant context I might not have thought to mention explicitly.

## Setting Up MCP for Obsidian

The key piece is an MCP server that gives AI assistants access to your vault. I use the [Obsidian MCP Plugin](https://github.com/aaronsb/obsidian-mcp-plugin), which runs directly inside Obsidian as a community plugin. No separate server to manage, it just works.

The plugin provides several tool groups. The ones I use most:
- **Vault** - Search, read, create, and edit files
- **View** - Display notes and navigate the vault
- **Graph** - Traverse links, find paths between concepts, analyze connections
- **Dataview** - Execute DQL queries directly from Claude

This is what makes the whole system work. Claude can search my vault semantically, follow links between notes, and run Dataview queries to find what I need.

I was inspired by [Claudesidian](https://github.com/heyitsnoah/claudesidian), a pre-configured vault starter kit for Claude Code. Its philosophy, "AI amplifies thinking, not just writing", resonated with me. I built my own system adapted to my GTD workflow instead of using the full starter kit.

## Making It Work with AI Agents

The real power comes from giving AI context about how your system works. MCP servers let Claude read and write to your vault, but Claude doesn't automatically know your organizational conventions. You need to tell it.

### Setting Up AGENTS.md

I have an `AGENTS.md` file in my vault that explains my system. It's a plain markdown file that describes:

1. **File naming conventions** - How to identify different note types
2. **Front matter schema** - What fields exist and their allowed values
3. **GTD conventions** - How tasks, projects, and contexts work
4. **AI behavior rules** - What agents should and shouldn't do

Here's a simplified version of what mine looks like:

```markdown
# Vault Instructions for AI Agents

## Core Principle
AI agents should focus on structure and organization, NOT content creation.
- ✅ DO: Add/update tags, create links, fix formatting, organize files, run queries
- ❌ DON'T: Write tasks, notes, or content unless explicitly requested

## File Naming
Project files use emoji prefixes by area:
- 📦 for open-source projects (area/open-source)
- 💼 for work projects (area/work)
- 🏠 for home projects (area/home)
- 💰 for finance projects (area/finance)
- 🧠 for personal projects (area/personal)

Central hub: `🎯 GTD Dashboard.md`

## Front Matter Schema
- `status`: active | waiting | completed | someday
- `priority`: 1 (high) to 3 (low)
- `due-date`: YYYY-MM-DD format
- `tags`: [project, area/work] or [project, area/personal], etc.

## GTD Conventions
- Next actions: `- [ ] Task description @context`
- Contexts: @computer, @calls, @office, @errands, @home
- Waiting for: `- [ ] Waiting for [person] to [action]`

## Agent Workflow
Before every response:
1. SEARCH the vault for relevant context
2. READ discovered files
3. ACT on findings (use tools, not suggestions)
4. RESPOND with vault-informed knowledge
```

The key is being specific about conventions and explicit about what AI should and shouldn't do. I own my content, Claude manages the structure.

### What This Enables

With this context, Claude knows that:
- Projects use emoji prefixes by area (📦 for open-source, 💼 for work, etc.)
- Next actions have `- [ ]` checkboxes with context tags like `@computer` or `@calls`
- The GTD dashboard at `🎯 GTD Dashboard.md` is the central hub
- Front matter fields like `status`, `priority`, and `due-date` are queryable via Dataview

I can tell Claude "add a task to the blog project" and it knows exactly where to put it, what format to use, and what context tag makes sense. Or "what's due this week" and it can run a Dataview query to find it. The AGENTS.md file turns generic MCP access into system-aware assistance.

The real test is inbox processing. My daily notes pile up with random captures, and Claude knows how to process them. It reads through the daily notes, identifies actionable items versus reference material, creates tasks in the right projects with proper context tags, and moves someday/maybe ideas to that list. What used to be a manual weekly review task now takes a single prompt: "process my inbox."

If you're considering the switch from a closed note-taking app: having your notes in a format that AI can actually work with changes what's possible. Plain markdown, YAML front matter, and Dataview queries create a system that's both human-readable and machine-queryable.

{% comment %}
## LinkedIn Post

Moved my second brain from OneNote to Obsidian. Not because Obsidian is trendy, because OneNote's closed format made it impossible for AI to help me.

OneNote stores everything in proprietary `.one` files. When I wanted Claude to access my notes for context, I hit a wall. No MCP server could read the format.

Obsidian stores notes as plain markdown files. That matters because:

✅ LLMs are exceptionally good at reading/writing markdown, it's native to them
✅ YAML front matter gives you structured metadata AI understands instantly
✅ Dataview plugin lets you query notes with SQL-like syntax, and AI can run those queries

Now Claude searches my vault semantically, edits notes directly, runs Dataview queries to find what needs attention. I tell it "add a task to the blog project" and it knows exactly where to put it.

Plus Obsidian has mobile apps and syncs via Git. Ubiquitous capture, one of GTD's core principles, actually works.

If your notes are in a closed format, you're limiting what AI can help you with.

#Obsidian #SecondBrain #Productivity #AI #PKM

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/productivity/2025/12/23/moving-second-brain-onenote-to-obsidian.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread

Tweet 1 (Hook):
Moved my second brain from OneNote to Obsidian. Not for the features, because OneNote's closed format locked my AI assistants out completely. 🔒

Tweet 2:
Obsidian stores notes as plain markdown. LLMs are exceptionally good at markdown, it's one of the formats they handle best. Your notes become native to AI. 💡

Tweet 3:
YAML front matter adds structured metadata AI understands instantly. Tags, status, priority, dates, all queryable without teaching the model anything.

Tweet 4:
Dataview plugin is SQL for your notes. Query by front matter, tags, links. Claude can run these queries through MCP to find what I need. ✨

Tweet 5:
Mobile apps + Git sync = ubiquitous capture. Idea hits me on my phone, it's in my inbox when I sit down at my computer. GTD actually works now.

Tweet 6:
Full breakdown of why markdown + front matter + Dataview makes Obsidian perfect for AI workflows: https://juanjofuchs.github.io/productivity/2025/12/23/moving-second-brain-onenote-to-obsidian.html

#Obsidian #Productivity

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
