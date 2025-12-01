---
layout: post
title: "How I Vibe Coded hwinfo-tui in Under a Day"
description: "Vibe coding the implementation took minutes. Publishing to PyPI and WinGet in under a day required hours of research and a detailed spec first."
date: 2025-12-02 09:00:00 -0500
categories: ai-development
tags: [python, vibe-coding, claude, github-copilot, terminal-ui, hwinfo, open-source]
author: JuanjoFuchs
---

I vibe coded [hwinfo-tui](https://github.com/JuanjoFuchs/hwinfo-tui) and had it published on PyPI and WinGet in under a day. The implementation itself, giving Claude the spec and getting a working app, took maybe 20 minutes. What enabled shipping that fast wasn't the AI, it was the hours I spent on research and specification beforehand.

Everyone knows vibe coding is fast. The interesting part is what makes the output production-ready instead of a demo that falls apart.

## TL;DR

- **Prep work enables production quality.** The vibe coding was fast because the research and spec were thorough. Skip the research and you get code that works for the demo but breaks in production.
- **Research is underrated.** I spent more time researching than implementing. Reading docs, studying successful implementations, understanding how tools work.
- **Specs should include architecture, not just features.** "Build a terminal hardware monitor" gets mediocre code. A detailed spec with library choices and edge cases gets production code on the first try.
- **The "one shot" only works with context.** Vibe coding without a spec is just iterating on bad architecture.

## The Problem

I wanted to monitor my laptop's CPU temps, fan speeds, and other hardware sensors in real time without opening HWInfo64's GUI. HWInfo64 can export sensor data to CSV but there wasn't a good terminal-based visualization tool that could watch that CSV and plot the data live.

I'd seen [gping](https://github.com/orf/gping)'s elegant terminal UI for network latency and wanted something similar for hardware monitoring, dual Y-axes for different sensor units, fuzzy matching to find sensors quickly, the whole experience.

## The Process

### 1. Research

This is where most vibe coding projects skip ahead and pay for it later. I spent hours reading documentation, discovering tools, understanding how they work, looking at successful implementations. Asked GitHub Copilot about architectural patterns for terminal UIs in Python, plotting libraries, CSV monitoring patterns, real-time update strategies, all discovery with no code yet.

I read through gping's source to understand how it handled multi-line charts. Explored Plotext's documentation to see what it could actually do with braille characters. Checked Rich's live display capabilities for smooth terminal updates. Looked at Typer for CLI patterns.

The research gave me confidence in the stack: Plotext for ASCII charts, Rich for terminal UI, Typer for CLI, Watchdog for file monitoring. All mature libraries with good APIs and active maintenance.

### 2. Specification

I wrote a comprehensive spec document ([`specs/v1.md`](https://github.com/JuanjoFuchs/hwinfo-tui/blob/main/specs/v1.md)) collaboratively with GitHub Copilot. This wasn't just a feature list, it was architecture decisions and implementation details:

- **Features**: CLI interface with `hwinfo-tui sensors.csv sensor1 sensor2`, unit filtering (max 2 distinct units)
- **Architecture**: Plotext for terminal plotting with braille characters, Rich for live display updates, Typer for CLI framework, circular buffers for memory efficiency
- **UI layout**: gping-inspired design with statistics table at top (Last, Min, Max, Avg, P95 columns) and main chart below with dual Y-axes
- **Performance targets**: <50MB memory baseline, <2% CPU overhead, <2 second startup, <100ms display refresh
- **Error handling**: Graceful degradation, automatic CSV reconnection, sensor disconnect recovery, helpful error messages

This took several hours of back-and-forth refinement. At the end I had a complete specification with zero implementation code, defining exactly what the tool should do, how it should handle edge cases, what the CLI interface should look like, how the charting should work.

### 3. Planning

Gave the spec to Claude and asked it to plan the implementation before writing any code. It decided on the file structure, module boundaries, class hierarchy, which functions go where. This took maybe 5 minutes, the spec had enough detail that the planning was straightforward.

### 4. Implementation

One shot. Gave Claude the spec and the plan, asked it to implement everything. Claude generated a fully functional application, CLI interface, real-time CSV monitoring with file watching, terminal UI rendering, interactive charts with Plotext, fuzzy sensor matching, dual-axis support, error handling, all working on the first try.

This is the part that feels like magic but only works because the spec was detailed enough. Claude had all the context it needed, what libraries to use, what the UI should look like, what edge cases to handle.

### 5. Polish

The implementation worked and had tests, so this wasn't debugging. Polish was about running it and deciding if I liked what I saw. Spacing between columns in the stats table, colors for the chart lines, how the legends looked, visual details that only matter once you're staring at the actual output.

I'd run the app, see something that felt off, describe what I wanted different, Claude would tweak it until it felt right. This is the part that actually matters for a product, whether you use it and like it.

### 6. Ship

Wrote a packaging spec and had Claude implement CI/CD. GitHub Actions workflows for automated testing, PyPI publishing on release, Windows executable generation via PyInstaller, WinGet package manifests.

Publishing to WinGet was interesting because the portable app upgrade path has quirks (probably another blog post), but the automation worked.

## What Got Built

<div style="position: relative; padding-bottom: 62.5%; height: 0; overflow: hidden;">
  <video style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
         controls playsinline poster="/assets/videos/hwinfo-tui-demo-poster.png">
    <source src="/assets/videos/hwinfo-tui-demo.mp4" type="video/mp4">
  </video>
</div>

The final tool has:

- **Real-time CSV monitoring** - Watches HWInfo64's CSV export and updates automatically
- **Interactive terminal charts** - ASCII plots using Plotext with smooth updates
- **Dual Y-axes** - Different units (°C, RPM, %) on separate axes
- **Fuzzy sensor matching** - Type partial names and it finds the right sensors
- **Rich statistics** - Min, max, average values alongside the charts

Install with `pip install hwinfo-tui` or `winget install hwinfo-tui`.

## The Tech Stack

- Python 3.8+
- [Rich](https://github.com/Textualize/rich) for terminal UI
- [Plotext](https://github.com/piccolomo/plotext) for ASCII charts
- [Typer](https://github.com/tiangolo/typer) for CLI
- Pandas for CSV handling
- Watchdog for file monitoring
- PyInstaller for Windows executables

## Using It

Point it at HWInfo64's CSV export and specify sensors to watch:

```bash
hwinfo-tui path/to/sensors.csv "CPU Package" "GPU Temperature"
```

The tool watches the CSV, plots the values in real time, handles different units on separate Y-axes, and shows statistics. Press Ctrl+C to exit.

## Open Source

The code is on [GitHub](https://github.com/JuanjoFuchs/hwinfo-tui) under an open source license. If you use HWInfo64 and want terminal-based monitoring, grab it and see if it's useful.

The WORKFLOW.md in the repo documents the complete development process if you want to try this approach for your own projects.

## Resources

- [GitHub Repository](https://github.com/JuanjoFuchs/hwinfo-tui)
- [PyPI Package](https://pypi.org/project/hwinfo-tui/)
- [Install via WinGet](https://github.com/microsoft/winget-pkgs/tree/master/manifests/j/JuanjoFuchs/hwinfo-tui)
- [Development Workflow](https://github.com/JuanjoFuchs/hwinfo-tui/blob/main/WORKFLOW.md)
- [gping (inspiration)](https://github.com/orf/gping)

{% comment %}
## LinkedIn Post

Vibe coded hwinfo-tui and shipped it to PyPI and WinGet in under a day. The actual implementation, giving Claude a spec and getting working code, took maybe 20 minutes. What enabled shipping that fast wasn't the AI.

Everyone knows vibe coding is fast. The interesting part is what makes the output production-ready instead of a demo that falls apart.

My process:

1. Research - Hours reading documentation, studying gping's source, understanding how Plotext and Rich actually work. No code, just learning what's possible.

2. Specification - Wrote a detailed spec covering features, architecture decisions, library choices, UI layout, performance targets, edge cases. Several hours with GitHub Copilot.

3. Planning - Claude decided on file structure and module boundaries based on the spec. 5 minutes.

4. Implementation - One shot. Claude generated the full app from the spec. Working code, first try.

5. Polish - Testing found issues, fast iteration cycles to fix them. A few hours.

6. Ship - CI/CD, PyPI, WinGet. Automated.

The lesson: I spent more time researching than implementing. "Build a terminal hardware monitor" gets mediocre code. A detailed spec with architecture decisions gets production code on the first try.

Vibe coding without a spec is just iterating on bad architecture.

What's your experience with prep work before vibe coding? Finding it matters?

#VibeCoding #Python #OpenSource #AI

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/ai-development/2025/12/02/vibe-coding-hwinfo-tui.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread

Tweet 1 (Hook):
Vibe coded hwinfo-tui and shipped to PyPI + WinGet in under a day. The implementation took 20 minutes. What enabled that wasn't the AI. 🔥

Tweet 2:
Everyone knows vibe coding is fast. The interesting part is what makes the output production-ready instead of a demo that falls apart. 💡

Tweet 3:
Step 1: Research. Hours reading docs, studying gping's source, understanding how libraries actually work. No code, just learning.

Tweet 4:
Step 2: Detailed spec. Features, architecture, library choices, UI layout, performance targets, edge cases. This took the most time.

Tweet 5:
Step 3-4: Planning (5 min) then implementation. One shot. Claude generated the full app from the spec. Working code, first try. ✅

Tweet 6:
Step 5-6: Polish issues from testing, then ship. CI/CD, PyPI, WinGet. All automated.

Tweet 7:
The lesson: I spent more time researching than implementing. Vibe coding without a spec is just iterating on bad architecture. ✨

Tweet 8:
Full breakdown of the process: https://juanjofuchs.github.io/ai-development/2025/12/02/vibe-coding-hwinfo-tui.html

Install: pip install hwinfo-tui

#VibeCoding #Python

---
INSTRUCTIONS:
1. Post as a thread on Wednesday at 9 AM EST (or Tue-Thu between 8-11 AM or 12-2 PM EST)
2. Keep each tweet under 280 characters
3. Link goes in the LAST tweet only (X algorithm suppresses posts with links)
4. Use only 1-2 hashtags total (at the end)
5. Add custom graphic/image to first tweet if possible (screenshot of hwinfo-tui in action)
6. Engage with replies in first hour for algorithm boost

ALTERNATIVE (Single Post):
If you prefer a single post instead of thread, post the hook without link, then immediately reply to your own post with the blog URL.
{% endcomment %}
