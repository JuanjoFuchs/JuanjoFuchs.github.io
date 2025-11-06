---
layout: post
title: "Building HWInfo-TUI in 24 Hours with AI"
description: "How I built a terminal hardware monitor using spec-driven development with AI. From idea to published package on PyPI and WinGet."
date: 2025-11-18 09:00:00 -0500
categories: ai-development
tags: [python, ai, claude, github-copilot, terminal-ui, hwinfo, open-source]
author: JuanjoFuchs
---

I built [hwinfo-tui](https://github.com/JuanjoFuchs/hwinfo-tui) in under 24 hours using AI-assisted development. It's a terminal UI for monitoring hardware sensors from HWInfo64, inspired by [gping](https://github.com/orf/gping). The tool is published on PyPI and WinGet, and it's open source.

## The Problem

I wanted to monitor my laptop's CPU temps, fan speeds, and other hardware sensors in real time without opening HWInfo64's GUI. HWInfo64 can export sensor data to CSV, but there wasn't a good terminal-based visualization tool that could watch that CSV and plot the data live.

I'd seen gping's elegant terminal UI for network latency and wanted something similar for hardware monitoring, dual Y-axes for different sensor units, fuzzy matching to find sensors quickly, the whole experience.

## The Five-Phase Process

### Phase 1: Vision & Research

Instead of jumping into code, I used AI to research the ecosystem. Asked GitHub Copilot about architectural patterns for terminal UIs in Python, plotting libraries that work in the terminal, CSV monitoring best practices, and how real-time updates should work. This phase was pure discovery, no implementation.

The research pointed me to Plotext for ASCII charts, Rich for terminal UI, Typer for the CLI, and Watchdog for file monitoring. All mature libraries with good APIs.

### Phase 2: Specification-First Development

I wrote a comprehensive spec document ([`specs/v1.md`](https://github.com/JuanjoFuchs/hwinfo-tui/blob/main/specs/v1.md)) collaboratively with GitHub Copilot. The spec covered:

- **Technical requirements**: CLI interface with `hwinfo-tui sensors.csv sensor1 sensor2`, unit filtering logic (max 2 distinct units), interactive controls (pause, zoom, pan, theme cycling)
- **Architecture decisions**: Plotext for terminal plotting with braille characters, Rich for live display updates, Typer for CLI framework, circular buffers for memory efficiency
- **UI layout**: gping-inspired design with statistics table at top (Last, Min, Max, Avg, P95 columns) and main chart below with multiple Y-axes
- **Performance targets**: <50MB memory baseline, <2% CPU overhead, <2 second startup, <100ms display refresh
- **Error handling**: Graceful degradation, automatic CSV reconnection, sensor disconnect recovery, helpful error messages

This took several hours of back-and-forth refinement, but at the end I had a complete specification with zero implementation code. The spec defined exactly what the tool should do, how it should handle edge cases, what the CLI interface should look like, and how the charting should work with dual Y-axes.

### Phase 3: Implementation Sprint

I gave the complete spec to Claude Sonnet 4 and asked it to implement everything. Claude generated a fully functional application with CLI interface, real-time CSV monitoring with file watching, terminal UI rendering using Rich, interactive charts with Plotext, fuzzy sensor matching, dual-axis support, and error handling.

This phase took maybe 2-3 hours of iterating with Claude to get the implementation right, but the code quality was production-ready. Clean architecture, proper error handling, type hints throughout.

### Phase 4: Collaborative Refinement

Real-world testing found edge cases and UX issues. CSV encoding problems on Windows, sensor names with special characters, visual polish for the chart updates, better error messages. I refined these specific behaviors with Claude, making judgment calls on user experience while Claude handled the systematic implementation work.

This is where the human-AI collaboration really mattered. I'd test, identify issues, describe what needed fixing, and Claude would implement the solution. Fast iteration cycles.

### Phase 5: Production Readiness

I wrote a packaging spec document and had AI implement the CI/CD pipeline. The result was automated GitHub Actions workflows, PyPI publishing on release, Windows executable generation via PyInstaller, and WinGet package manifests.

Publishing to WinGet was interesting because the portable app upgrade path has quirks (that's probably another blog post), but the automation worked.

## What Got Built

The final tool has:

- **Real-time CSV monitoring** - Watches HWInfo64's CSV export and updates automatically
- **Interactive terminal charts** - ASCII plots using Plotext with smooth updates
- **Dual Y-axes** - Different units (°C, RPM, %) on separate axes
- **Fuzzy sensor matching** - Type partial names and it finds the right sensors
- **Rich statistics** - Min, max, average values alongside the charts
- **Cross-platform** - Python package works anywhere (though HWInfo64 is Windows-only)

Install with `pip install hwinfo-tui` or `winget install hwinfo-tui`.

## Key Learnings

**Specification-driven development works.** Writing the complete spec before any implementation meant Claude had enough context to generate correct code. I've tried the "just start coding and iterate" approach with AI and it leads to architectural problems that are hard to fix later.

**Different AI tools for different phases.** GitHub Copilot was great for research and spec writing, Claude Sonnet 4 was perfect for the implementation sprint. They have different strengths.

**Humans still drive vision and quality.** I decided what to build, what good UX looks like, which edge cases mattered, and whether the code met quality standards. AI handled the systematic implementation work.

**Time compression is real.** This would've taken me 2-3 weeks part-time using traditional development. I spent 12-16 hours across multiple nights, mostly on strategic decisions rather than typing boilerplate.

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

Built a terminal UI for monitoring hardware sensors in under 24 hours using AI-assisted development. The tool (hwinfo-tui) is now published on PyPI and WinGet, and it's open source.

The approach was spec-driven development with a five-phase process:

Phase 1: Used AI to research the ecosystem - terminal UI patterns, plotting libraries, CSV monitoring. Pure discovery, no code.

Phase 2: Wrote comprehensive spec with GitHub Copilot covering technical requirements, library choices (Plotext, Rich, Typer), UX flows, and performance targets. Complete specification with zero implementation.

Phase 3: Gave the spec to Claude Sonnet 4 and it generated the full application - CLI, real-time CSV monitoring, terminal charts, fuzzy sensor matching, dual Y-axes, error handling. Production-ready code.

Phase 4: Real-world testing found edge cases, refined with AI while making human judgment calls on UX.

Phase 5: AI-generated CI/CD pipeline for PyPI publishing, Windows executables, and WinGet packages.

Three key takeaways:

✅ Specification-driven development works - Complete spec before implementation gives AI enough context to generate correct code

✅ Different tools for different phases - Copilot for research/spec, Claude for implementation sprint

✅ Time compression is real - Traditional estimate was 2-3 weeks, actual was 12-16 hours across multiple nights focusing on strategic decisions

The tool monitors HWInfo64 sensors in real time with ASCII plots, handles different units on dual Y-axes, and includes fuzzy sensor matching. Install with pip install hwinfo-tui or winget install hwinfo-tui.

What's your experience with spec-driven AI development? Finding similar time compression?

#AI #Python #OpenSource #DevTools #TerminalUI

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/2025/11/18/building-hwinfo-tui-24-hours.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread

Tweet 1 (Hook):
Built a terminal hardware monitor in 24 hours using AI. Now published on PyPI and WinGet. Here's the spec-driven approach that made it work. 🔥

Tweet 2:
Wanted gping's elegant terminal UI for hardware sensors instead of network latency. HWInfo64 exports to CSV but no good terminal visualization existed. 💡

Tweet 3:
Five-phase process: Research ecosystem with AI first (no code). Write complete spec with Copilot covering architecture, libraries, UX, performance targets.

Tweet 4:
Phase 3: Gave complete spec to Claude Sonnet 4. It generated the full app - CLI, real-time monitoring, ASCII charts, fuzzy matching, dual Y-axes. Production ready. ✅

Tweet 5:
Phase 4-5: Refined edge cases with AI making human UX decisions. Generated CI/CD for PyPI, Windows executables, WinGet packages. All automated.

Tweet 6:
Traditional estimate: 2-3 weeks. Actual: 12-16 hours across nights. Focused on strategic decisions, AI handled systematic implementation. ✨

Tweet 7:
The lesson: Complete spec before implementation. AI needs context to generate correct code. "Just start coding" with AI creates architectural problems.

Tweet 8:
Full breakdown of the 5-phase spec-driven process and development workflow: https://juanjofuchs.github.io/2025/11/18/building-hwinfo-tui-24-hours.html

Install: pip install hwinfo-tui

#Python #AI

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
