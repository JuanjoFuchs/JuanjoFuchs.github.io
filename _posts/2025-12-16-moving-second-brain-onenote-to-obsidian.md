---
layout: post
title: "Making Your Second Brain AI-Compatible"
description: "I was great at capturing ideas but terrible at processing them. Five years of OneNote left me with a growing inbox I couldn't leverage. Moving to Obsidian let AI help with the part I'm bad at."
date: 2025-12-16 09:00:00 -0500
categories: productivity
tags: [obsidian, onenote, second-brain, gtd, mcp, ai, productivity]
author: JuanjoFuchs
---

I've used [GTD (Getting Things Done)](https://gettingthingsdone.com/) for years and OneNote as my second brain for the past five. The capture part worked great, I'd dump ideas, tasks, meeting notes, random thoughts, everything went into the inbox. The processing part? Not so much. My inbox kept growing and I never quite caught up.

It still worked, sort of. I could search for things and usually find them. But I wasn't seeing connections between ideas, couldn't traverse my notes to connect dots, wasn't leveraging the full power of everything I'd captured. It was a dump-and-maybe-retrieve system, not a second brain.

Then I started using AI assistants for everything and realized they could help with exactly the part I'm bad at: processing, organizing, finding connections. There was just one problem. OneNote stores everything in proprietary `.one` files that AI can't read.

## What's a Second Brain?

A second brain is an external system where you offload everything you need to remember. Ideas, tasks, projects, reference material, it all goes into the system so your actual brain can focus on thinking instead of remembering. The concept comes from Tiago Forte's book [Building a Second Brain](https://www.buildingasecondbrain.com/book), the core idea is simple: capture everything externally, organize it so you can find it, review it regularly.

GTD complements this with structure for task management. Projects are outcomes requiring multiple actions, Areas of Focus are ongoing responsibilities, Reference is information to keep but not act on. My second brain is the container where all of this lives: an inbox where everything lands first, next actions with context tags like `@computer` or `@calls`, waiting-for lists, someday/maybe for ideas I'm not acting on yet.

The problem is that GTD requires discipline. Weekly reviews, inbox processing, keeping everything current. I'm good at capturing, I have shortcuts and quick-capture tools everywhere. Processing requires sitting down and making decisions about each item, and that's where I fall behind.

## The Dump-and-Search Trap

For five years my system was: capture everything to OneNote, search when I need something. It worked well enough that I didn't fix it. Need that article about X? Search for it. What was that idea I had? Search for keywords I remember.

But search only finds what you're looking for. It doesn't show you connections you didn't know existed, doesn't surface that idea from six months ago that's relevant to what you're working on now, doesn't help you traverse your own thinking. My notes were isolated islands, not a connected knowledge graph.

The real cost was in the inbox. Hundreds of uncategorized items piling up because processing them manually felt overwhelming. Each one needed a decision: is this actionable? What project does it belong to? What's the next action? Multiply that by hundreds of items and it's no wonder I kept putting it off.

## AI Could Help (If It Could Read My Notes)

AI assistants are good at exactly what I'm bad at: systematically processing information, categorizing items, finding patterns, suggesting connections. Claude/Copilot/Gemini could help me process that inbox, identify what's actionable versus reference material, spot connections between ideas I'd forgotten about.

But Claude couldn't read OneNote. The `.one` format is proprietary, essentially a black box to external tools. The [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) ecosystem was growing with servers for all kinds of tools, but nothing could parse OneNote reliably. My second brain was locked in a format only I could access.

## Why Markdown Changes Everything

[Obsidian](https://obsidian.md/) stores notes as plain markdown files in a local folder. No proprietary format, no cloud dependency, just `.md` files you can open with any text editor or read with any tool that understands text.

LLMs handle markdown exceptionally well. So much of their training data is markdown: documentation, README files, technical writing. When your notes are markdown, AI works with them natively. No translation layer, no parsing issues, the format AI thinks in is the format your notes live in.

### Front Matter for Progressive Discovery

[Front matter](https://jekyllrb.com/docs/front-matter/) is YAML metadata at the top of a markdown file:

```yaml
---
tags: [project, area/open-source]
status: active
priority: 2
due-date: 2025-12-31
---
```

AI models understand front matter immediately. It's structured, predictable, appears constantly in their training data. When Claude reads a note, it sees the front matter first and instantly knows the metadata before reading the content. This enables progressive discovery, AI can scan front matter across many files to find what's relevant before diving into full content.

Front matter fields become queryable properties. "Show me all active projects with priority 1" is answerable because the metadata is structured, not buried in prose.

### Links Create Traversable Relationships

Obsidian uses wiki-style `[[links]]` to connect notes. These aren't just navigation, they create a graph of relationships between ideas. When I mention a project in my daily notes and link to it, that connection exists in the structure, not just in my memory.

Plugins like [Dataview](https://blacksmithgu.github.io/obsidian-dataview/) let you query notes like a database, filtering by front matter, tags, or links. The file system becomes a queryable knowledge base.

## What MCP Enables

The bridge between Obsidian and AI is an [MCP server](https://github.com/aaronsb/obsidian-mcp-plugin). This gives Claude direct access to my vault, but it's more than just file access:

- **Navigate links without reading every file** - Claude can traverse connections between notes, following the relationship graph I've built without loading all the content
- **Query projects and tasks directly** - Instead of text search, Claude can query by front matter fields, find all active projects, or list tasks with specific context tags
- **Understand structure, not just content** - The combination of front matter, links, and queries means AI sees my vault the way I organize it, not as a pile of text files

This is the key difference from just "AI can read files." AI can navigate my knowledge graph intelligently, the same way I would but faster and more systematically.

### The GTD Dashboard: A Semantic Map

The piece that ties it all together is my GTD Dashboard, a single markdown file with Dataview queries that aggregates everything:

~~~markdown
## 📂 Active Projects

```dataview
TABLE WITHOUT ID file.link AS "Project",
  filter(file.tags, (t) => contains(t, "area/"))[0] AS "Area"
FROM #project WHERE status = "active"
SORT priority ASC
```
Returns all projects with status: active in front matter, sorted by priority

## 🎯 Next Actions by Context

### 🖥️ Computer
```dataview
TASK WHERE !completed AND contains(text, "@computer")
GROUP BY file.link
```
Returns all uncompleted tasks containing @computer, grouped by source project

### 📞 Calls
```dataview
TASK WHERE !completed AND contains(text, "@calls")
GROUP BY file.link
```
Returns all uncompleted tasks containing @calls, grouped by project

## 💡 Someday/Maybe Ideas

```dataview
TABLE WITHOUT ID file.link as "File", L.text as "Idea"
FROM #someday-maybe FLATTEN file.lists as L
WHERE contains(L.text, "#someday-maybe")
```
Returns ideas tagged #someday-maybe from across all project files, aggregated in one view
~~~

AI reads this one file and instantly understands my entire system state: active projects across work, personal, and open-source areas, next actions organized by context, someday/maybe ideas scattered across project files. No searching, no crawling through every note, just one semantic entry point.

When I ask "what should I work on?" the AI doesn't need to search, it reads the dashboard, sees my @computer tasks grouped by project, and can give me context-aware suggestions. When I say "add this idea to my blog backlog," it knows exactly where blog post ideas live because the dashboard shows the structure.

The dashboard becomes the table of contents for AI to understand the vault at a glance, then dive deeper into specific projects as needed.

## Teaching AI Your Conventions

MCP gives access, but Claude doesn't automatically know how I organize things. I have an `AGENTS.md` file in my vault that explains my system. Here's an excerpt:

```markdown
# Vault Instructions for AI Agents

## Core Operating Principle: Search First, Act Autonomously

MANDATORY WORKFLOW - Execute on EVERY user request:
1. PAUSE  → Do not respond immediately
2. SEARCH → Query vault for relevant context
3. READ   → Review discovered files for existing knowledge
4. ACT    → Use available tools autonomously
5. RESPOND → Provide answer based on vault knowledge

Before every response, verify:
- Have I searched the vault for relevant context?
- Have I read the files that were found?
- Am I responding with knowledge from the vault or my own assumptions?

## Core Principle: User Creates Content

AI agents should focus on structure and organization, NOT content creation.
- ✅ DO: Add/update tags, create links, fix formatting, organize files, run queries
- ❌ DON'T: Write tasks, notes, or content unless explicitly requested

The user owns their content - agents manage the structure.

## Processing The Inbox (Daily Notes)

Daily notes serve as the inbox. Processing requires analysis and user approval.

Important Rules:
- Never act without approval - Always propose first, execute after confirmation
- Never change core content - The user's words are sacred; only move, never edit
- Preserve original wording - Move content exactly as written
- Ask when uncertain - Better to clarify than assume wrong destination
```

The key sections define how AI should approach every interaction (search the vault first), what it should and shouldn't do (structure not content), and specific workflows like inbox processing. With this context, I can say "process my inbox" and Claude knows to read my daily notes, propose where each item should go, wait for approval, then move content without changing my words.

## AI as Processing Partner

The real payoff is inbox processing. My daily notes pile up with random captures, exactly like they did in OneNote. The difference is now I can say "process my inbox" and Claude reads through the daily notes, identifies actionable items versus reference material, creates tasks in the right projects with proper context tags, moves someday/maybe ideas to that list.

What used to be a manual weekly review I'd procrastinate on now takes a single prompt. Claude handles the systematic processing I'm bad at, I make the judgment calls on anything ambiguous.

I was inspired by [Claudesidian](https://github.com/heyitsnoah/claudesidian), a vault starter kit for Claude Code. Its philosophy, "AI amplifies thinking, not just writing", captures what this is about. AI doesn't replace my thinking, it helps me actually use the thinking I've already captured.

If your notes are in a closed format, you're limiting what AI can help with. The format of your second brain determines whether AI can be a thinking partner or just a chat window.

{% comment %}
## LinkedIn Post

I'm great at capturing ideas, terrible at processing them. 🧠

Five years of "Getting Things Done" with OneNote left me with an inbox of hundreds of items I never got around to organizing. Search worked well enough, I could find things when I needed them. But I wasn't seeing connections between ideas, couldn't traverse my own thinking. Just dump and maybe retrieve.

Then I realized AI assistants could help with exactly the part I'm bad at: systematically processing items, finding patterns, suggesting connections. 🤖

One problem: OneNote's proprietary format is a black box to AI.

Moved to Obsidian. Here's why it changes everything:

📁 **Plain markdown files** - LLMs handle markdown natively, it's in their training data. No translation layer needed.

🏷️ **YAML front matter** - Structured metadata AI understands instantly. Tags, status, priority, all queryable.

🔗 **Wiki-style links** - Create a graph of relationships between ideas that AI can traverse.

📊 **Dataview queries** - SQL for your notes. My GTD Dashboard pulls active projects, tasks by context, and someday/maybe ideas from across the entire vault with simple queries.

The real magic is the GTD Dashboard. AI reads one file and instantly understands my entire system: projects organized by area, tasks grouped by context (@computer, @calls, @errands), ideas scattered across files aggregated in one view.

Now I say "process my inbox" and my AI assistant reads my daily notes, proposes where each item should go, waits for approval, moves content without changing my words.

Weekly review that I'd procrastinate on? Single prompt. ✅

The format of your second brain determines whether AI can be a thinking partner or just a chat window.

#Obsidian #SecondBrain #Productivity #AI #GTD

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/productivity/2025/12/16/moving-second-brain-onenote-to-obsidian.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread

Tweet 1 (Hook):
I'm great at capturing ideas, terrible at processing them. 🧠

Five years of OneNote left me with hundreds of inbox items I never organized. Sound familiar?

Tweet 2:
AI assistants are good at exactly what I'm bad at: systematically processing information, finding patterns, suggesting connections. 🤖

But AI couldn't read my OneNote files. Proprietary format = black box.

Tweet 3:
Moved to Obsidian. Plain markdown files that LLMs handle natively, it's in their training data. No translation layer needed. 📁

Tweet 4:
YAML front matter gives structured metadata AI understands instantly. Tags, status, priority, dates, all queryable without teaching the model anything. 🏷️

Tweet 5:
The secret weapon: a GTD Dashboard with Dataview queries. One markdown file that aggregates projects, tasks by context, and ideas from across the vault. 📊

Tweet 6:
AI reads that one file and instantly understands my entire system. No crawling through every note, just one semantic entry point to my knowledge graph. 🔗

Tweet 7:
Now I say "process my inbox" and AI reads my daily notes, proposes where items go, waits for approval, moves content without changing my words. Weekly review in one prompt. ✅

Tweet 8:
The format of your second brain determines whether AI can be a thinking partner or just a chat window.

Full breakdown: https://juanjofuchs.github.io/productivity/2025/12/16/moving-second-brain-onenote-to-obsidian.html

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
