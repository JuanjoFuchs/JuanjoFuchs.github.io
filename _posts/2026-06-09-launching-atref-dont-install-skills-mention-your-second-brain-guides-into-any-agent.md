---
layout: post
title: "Launching atref: Don't Install Skills, Mention Your Second-Brain Guides Into Any Agent"
description: "Why I reference my curated second-brain guides into Claude Code and Codex instead of packaging them as skills, and the tool I built to do it in one chord."
date: 2026-06-09 09:00:00 -0400
categories: ai-development
tags: [claude-code, ai-agents, second-brain, developer-tools, rust]
image: /assets/atref-picker-second-brain-guides.png
author: JuanjoFuchs
---

![atref's picker open over the desktop, listing second-brain guides like Git Commit Guide and Blog Writing Guide](/assets/atref-picker-second-brain-guides.png)

<div style="position: relative; padding-bottom: 62.5%; height: 0; overflow: hidden;">
  <video style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
         autoplay loop muted playsinline controls poster="/assets/atref-picker-second-brain-guides.png">
    <source src="/assets/videos/atref-picker-demo-v06.mp4" type="video/mp4">
  </video>
</div>

I've been curating my second brain for a few months now. Whenever I find an interesting article or a skill, I read it and write a note. When I catch myself sending Claude the same kind of prompt over and over, I turn it into a guide. I've got a guide for how to commit, one for how to write specs, one for how to update agents.md.

They work great inside my vault. The friction shows up when I'm in another repo. I'll be deep in some project with [Claude Code](https://www.claude.com/claude-code) or [Codex](https://developers.openai.com/codex/cli), I want it to follow my commit guide, and there's no clean way to hand it over. I tab to VS Code, copy the file path, and paste it back so the agent can read it.

I could turn these guides into skills. Skills are a genuinely smart idea, I'm a fan. They lean on progressive disclosure, the agent reads a short description, decides the skill is relevant, then pulls in the full instructions only when it needs them, so the context stays lean. It's a real solution to a real problem, getting curated knowledge into agents and sharing it across people and teams, and it's already helping a lot of people.

My case is just different. A skill is a distribution mechanism, and I don't have a distribution problem. My commit guide is for me, I'm not shipping it to anyone. If I ever needed to share it, I'd reach for a skill without thinking twice. For my own use though, packaging it up for a distribution I don't need is more work than the problem deserves, the guide's already sitting there, I just want to point at it.

There are a couple of practical reasons too. Skills have to be installed where each agent looks for them, so today the same guide ends up duplicated across Claude Code's folder, Codex's folder, every machine I use, or I keep them in sync with symlinks. Now that skills are heading into the Agentic AI Foundation, where AWS, Anthropic, Google, Microsoft, and OpenAI are already agreeing on shared standards, I'd bet we get a single folder every harness reads from and the duplication goes away.

Then there's activation. Even with a skill installed, the agent decides when to pull it in, and sometimes it doesn't. [Vercel ran a nice eval on this](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals), a skill sitting right there got invoked in fewer than half the runs, and a plain routing index in their AGENTS.md scored higher, 100% against 79% for skills with explicit instructions. That's not a knock on skills, it's the nature of auto-invocation, and I expect it to climb toward perfect as the models get better at judging relevance. For now though, for something like my commit guide, I'd rather not leave the loading to that judgment, I'd rather point at it and know it's there.

So even when those rough edges get smoothed out, I'll still reference my guides instead of packaging them, I don't have a distribution problem and that part won't change. The only thing missing was a fast way to drop the reference in wherever I'm typing.

Claude Code already has a great @ picker, you type @, fuzzy-find a file, and it lands in context. The catch is it's built around the current working directory. I've tried `/add-dir` to pull my second brain in as an extra directory, but the @ UX doesn't really work with the added dirs, it still only fuzzy-finds cleanly inside the cwd. So from another repo I can't reach my guides through it.

I also noticed that if I hand Claude Code the full path with an @ in front, it reads the whole guide in one shot, no listing the directory, no grepping, no three-turn detour where it skims the first 20 lines and moves on. The full @-path pulls in the entire document. At least in Claude Code, Codex treats it more like a plain path.

That's atref. It's a small tool that puts a Claude-Code-style @ picker in any text field. I hit Ctrl+Space and a fuzzy picker pops up right at my cursor, nothing to go open. I start typing the name of the guide, it fuzzy-matches across the folders I've pointed it at, handles CamelHumps so I can type gcg and it finds Git Commit Guide, and does smart-case so I don't have to think about capitals. Enter drops the full @-path in where I'm typing, and the guide's in context.

It's picky about what it indexes. I point it at the folders I want and rank them by priority, so my most-used guides surface first. It's git-aware, it follows .gitignore and skips the node_modules and target noise. A file-watcher keeps the index live, so new guides show up without a restart. It all runs as a small Rust app in the tray.

![atref's picker fuzzy-matching the query 'writing style guide' down to a single result](/assets/atref-fuzzy-match-writing-style-guide.png)

It's early. Right now it's Windows only, v0.1 is rough, and it does exactly one thing. But it works, I use it every day to pull my guides into Claude Code and Codex from whatever repo I'm in.

If you want to try it, install with Scoop or PowerShell:

```powershell
# Scoop
scoop bucket add atref https://github.com/JuanjoFuchs/atref
scoop install atref

# or run the installer directly
irm https://raw.githubusercontent.com/JuanjoFuchs/atref/main/install.ps1 | iex
```

winget support is coming soon. The repo's open at [github.com/JuanjoFuchs/atref](https://github.com/JuanjoFuchs/atref), so if something breaks, or there's a reference format you want it to insert, tell me. I'd also like to hear what you'd @-reference first.

{% comment %}
## Social Campaign
CAMPAIGN: launching-atref_20260609
TIMEZONE: America/New_York

### Tuesday - Launch
DATE: 2026-06-09
TIME: 09:00
MEDIA: /assets/videos/atref-fuzzy-picker-demo.mp4
ALT: atref summoning its fuzzy picker and inserting a guide's @-path into an agent in another repo

#### LinkedIn Post
PUBLISHED: 2026-06-09T15:21:08.276Z

I keep a second brain full of guides, how I commit, how I write specs, how I update agents.md. They work great until I'm in another repo and I want Claude Code or Codex to actually follow one of them.

Today that means tabbing to VS Code, copying the file path, and pasting it back so the agent can read it. I did that for months.

I could package them as skills, and skills are a smart idea, but they're a distribution mechanism and I don't have a distribution problem. These guides are for me, I just want to point at them.

So I built atref. Press a chord in any text field, fuzzy-find the guide, hit Enter, and it drops the full @-path right where I'm typing. In Claude Code that @-path gets read in one shot, the whole guide, no listing or grepping.

It's Windows-only v0.1 and rough, but I use it every day.

✅ Install with Scoop or PowerShell (winget coming soon): https://github.com/JuanjoFuchs/atref
Full write-up: https://juanjofuchs.github.io/ai-development/2026/06/09/launching-atref-dont-install-skills-mention-your-second-brain-guides-into-any-agent.html

What's the first guide you'd want your agent to read on demand?

#ClaudeCode #AIEngineering #DeveloperProductivity

#### X/Twitter Thread
PUBLISHED: 2026-06-09T15:21:12.402Z

Tweet 1:
I keep a second brain of guides, how I commit, how I write specs, how I update agents.md. Getting them into Claude Code from another repo was the annoying part.

Tweet 2:
The workaround was copying the path out of VS Code and pasting it into the agent so it reads the file. Did that for months.

Tweet 3:
I could make them skills, but skills are a distribution mechanism and I don't have a distribution problem. These guides are mine, I just want to point at them.

Tweet 4:
So I built atref: a chord in any text field, fuzzy-find the guide, Enter drops the full @-path. Claude Code reads the whole thing in one shot. 🛠️

Tweet 5:
Windows v0.1, rough, but I use it daily. Scoop or PowerShell install (winget soon), repo: https://github.com/JuanjoFuchs/atref. Write-up: https://juanjofuchs.github.io/ai-development/2026/06/09/launching-atref-dont-install-skills-mention-your-second-brain-guides-into-any-agent.html

#ClaudeCode #AIengineering

### Wednesday - Problem
DATE: 2026-06-10
TIME: 09:00
MEDIA: /assets/atref-picker-second-brain-guides.png
ALT: atref's picker open over the desktop, listing second-brain guides like Git Commit Guide and Blog Writing Guide

#### LinkedIn Post
PUBLISHED: 2026-06-10T13:20:22.156Z

A skill sitting right in the agent's context got used in fewer than half the runs. Vercel ran the eval, and a plain routing index in AGENTS.md beat it, 100% against 79%.

That's a big reason I don't package my own coding guides as skills, even though packaging is the obvious move. I keep my guides in a second brain and reference them straight into Claude Code or Codex when I want one followed.

Two rough edges pushed me there, and I think both are temporary.

One is activation. Even with a skill installed, the agent decides when to pull it in, and it doesn't always. That's the eval above, and it's not a knock on skills, it's the nature of auto-invocation, it'll climb toward perfect as the models improve. For must-load knowledge like my commit guide, I'd rather not leave it to that judgment today.

The other is installation. A skill has to live in the folder each agent looks for, so the same guide gets copied into Claude Code's folder, into Codex's folder, onto every machine, or I babysit symlinks. Once skills settle under the Agentic AI Foundation, I'd bet on a single shared folder and the duplication goes away.

So I point at the guide instead, and I built a small tool, atref, to make that one keystroke.

Vercel's numbers: https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals
atref: https://juanjofuchs.github.io/ai-development/2026/06/09/launching-atref-dont-install-skills-mention-your-second-brain-guides-into-any-agent.html

If activation gets reliable enough, would you still want an explicit way to load a specific guide? Curious where the skills folks land on this.

#AIEngineering #ClaudeCode #AIAgents

#### X/Twitter Thread
PUBLISHED: 2026-06-10T13:20:24.003Z

Tweet 1:
A skill sitting right in the agent's context got used in fewer than half the runs. Vercel ran the eval, and a routed AGENTS.md index beat it 100% to 79%. 📊

Tweet 2:
That's a big reason I don't package my coding guides as skills. I keep them in a second brain and reference them straight into Claude Code or Codex instead.

Tweet 3:
Even installed, a skill only helps if the agent decides to pull it in, and it doesn't always. Not a knock on skills, it's the nature of auto-invocation, and it'll improve.

Tweet 4:
There's also installation: a skill lives in each agent's folder, so the same guide gets duplicated across Claude Code, Codex, every machine. Once skills settle under the Agentic AI Foundation, a shared folder fixes that.

Tweet 5:
For a must-load commit guide I'd rather point at it. I built atref to make that one keystroke: https://juanjofuchs.github.io/ai-development/2026/06/09/launching-atref-dont-install-skills-mention-your-second-brain-guides-into-any-agent.html

#AIengineering #ClaudeCode

### Thursday - Implementation
DATE: 2026-06-11
TIME: 09:00
MEDIA: /assets/videos/atref-picker-demo-v06.mp4
ALT: atref summoning its fuzzy picker, matching a guide by name, and inserting the full @-path at the caret

#### LinkedIn Post
atref is a small tool I built that drops a file reference wherever you're typing: hit a chord, fuzzy-find the file, Enter. I use it to feed my second-brain guides to Claude Code and Codex from any repo.

The reason it's worth building is a small Claude Code behavior. Hand Claude Code a full path with an @ in front and it reads the whole document in one shot, no listing the directory, no grepping, no three-turn detour where it skims the first 20 lines and moves on. Claude Code's own @ picker nails this, but it only sees the current working directory. I tried /add-dir to add my second brain, the @ UX still only works cleanly inside the cwd.

So atref brings that one-shot @-path to any folder. Ctrl+Space, a fuzzy picker pops up at my cursor, I type a few letters of the guide, Enter drops the full @-path. It handles CamelHumps, so gcg finds Git Commit Guide, and smart-case so I don't think about capitals.

It's picky about indexing too: folder priority so my most-used guides surface first, git-aware so it skips node_modules and target, and a file-watcher so new guides appear without a restart. Single small Rust app in the tray.

atref: https://juanjofuchs.github.io/ai-development/2026/06/09/launching-atref-dont-install-skills-mention-your-second-brain-guides-into-any-agent.html

Point it at one guide you reference constantly and try it.

#ClaudeCode #Rust #DeveloperProductivity

#### X/Twitter Thread
Tweet 1:
atref is a tool I built that drops a file reference wherever you're typing, a chord, fuzzy-find, Enter. I use it to feed my second-brain guides to Claude Code and Codex from any repo.

Tweet 2:
The reason it's worth it: in Claude Code, an @-path with the full path gets read in one shot, the whole document, no listing or grepping.

Tweet 3:
Claude Code's own @ picker nails this, but it only sees the current working directory. /add-dir doesn't fix the @ UX for outside folders.

Tweet 4:
atref brings that to any folder. Ctrl+Space, fuzzy-find at the cursor, Enter drops the full @-path. CamelHumps: type gcg, get Git Commit Guide. ⌨️

Tweet 5:
Git-aware indexing, folder priority, live file-watcher, all in a small Rust tray app. Scoop or PowerShell install, winget soon: https://github.com/JuanjoFuchs/atref

#ClaudeCode #Rust

### Friday - Takeaway
DATE: 2026-06-12
TIME: 09:00
MEDIA: /assets/atref-picker-second-brain-guides.png
ALT: atref's picker open at the cursor, listing curated second-brain guides ready to @-mention into any agent

#### LinkedIn Post
If you keep a personal knowledge base, your guides, prompts, runbooks, the value is only real if your agents can reach it cheaply.

The pattern that's worked for me: keep the knowledge curated in one place, then reference the exact file on demand instead of packaging it for a distribution you don't need. atref makes that one chord, so I pull my commit guide or my spec guide into Claude Code or Codex from any repo without leaving the keyboard.

Try it: pick one guide you reference all the time, point atref at its folder, and @-mention it next time the agent should follow it. That's the loop.

It's Windows-only v0.1 and it does exactly one thing. macOS, Linux, and the rest of the roadmap are next.

✅ Install with Scoop or PowerShell (winget coming soon)
Repo: https://github.com/JuanjoFuchs/atref
Write-up: https://juanjofuchs.github.io/ai-development/2026/06/09/launching-atref-dont-install-skills-mention-your-second-brain-guides-into-any-agent.html

If something breaks, or there's a reference format you want it to insert, tell me. I read every reply.

#DeveloperProductivity #ClaudeCode #SecondBrain

#### X/Twitter Thread
Tweet 1:
A personal knowledge base is only worth it if your agents can reach it cheaply. Curate in one place, reference the exact file on demand.

Tweet 2:
That's the whole idea behind atref: keep your guides curated, then @-mention the one you need into any agent, from any repo, no packaging.

Tweet 3:
Try it: pick one guide you use constantly, point atref at its folder, @-mention it next time the agent should follow it.

Tweet 4:
Windows v0.1, does exactly one thing. macOS and Linux next. Scoop or PowerShell install, winget soon 🚀

Tweet 5:
Repo and writeup: https://juanjofuchs.github.io/ai-development/2026/06/09/launching-atref-dont-install-skills-mention-your-second-brain-guides-into-any-agent.html, if something breaks or you want a different insert format, tell me.

#ClaudeCode #DeveloperProductivity
{% endcomment %}