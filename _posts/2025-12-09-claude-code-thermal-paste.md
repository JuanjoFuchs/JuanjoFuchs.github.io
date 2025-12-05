---
layout: post
title: "Claude Code Made Me Change My Laptop's Thermal Paste"
description: "CPU throttling for months, tried everything. Claude analyzed screenshots from hwinfo-tui and found the issue hiding in the data: thermal paste failure."
date: 2025-12-09 09:00:00 -0500
categories: hardware troubleshooting
tags: [hardware, thermal, ai, claude, hwinfo-tui, troubleshooting, dell]
author: JuanjoFuchs
---

More like convinced me, actually.

I had been dealing with thermal throttling on my Dell Precision 5570 for over two years. CPU would hit 100°C under moderate load and throttle constantly, the laptop was unusable at times. Some folks suggested opening it up and changing the thermal paste but I'd never done that before, so I didn't want to risk it.

Tried the usual fixes: cooling stand, cleaned the fans, adjusted power profiles. Nothing helped. Then I pasted temperature chart screenshots to Claude Code and it diagnosed the problem in one shot. The thermal paste had failed, and the clue was hiding in plain sight. But more importantly, Claude explained what was happening so clearly that it finally convinced me to open the laptop and change the paste myself.

## Building hwinfo-tui

As any respectable engineer might do, instead of directly fixing the issue, I first built a tool!

I needed to see temperature trends, not just current values. HWInfo64 is great at collecting sensor data but its UI shows you the current reading, maybe min/max/avg. That's not enough when you're trying to understand what happens over time during a throttling event.

HWInfo64 has some graphical plotting options but they open extra windows I didn't want to deal with. I was already spending most of my time in the terminal with Claude Code, so I wanted something that would plot there. Nothing existed.

So I built [hwinfo-tui](/ai-development/2025/12/02/vibe-coding-hwinfo-tui.html), a terminal tool that watches HWInfo64's CSV export and plots live charts. Dual Y-axes so you can overlay different sensors, see how temps changed under load, when throttling kicked in, what the relationship was between different readings.

The key insight with time graphs is that you stop focusing on the numbers and start seeing correlations. I don't mean just spikes and valleys, I mean the gaps - the vertical space between two lines over time. If the gap between CPU core temp and package temp grows over the course of a session, that tells you something. If the gap between core temp and TjMAX shrinks as load increases, you're watching the CPU approach its throttle point. You can see all of this without reading a single number, the visual patterns tell the story.

## Feeding Charts to Claude

I remembered reading that [multimodal models understand time-series data better when you show them plots](https://arxiv.org/abs/2410.02637) instead of raw numbers. So I tried an experiment.

I asked Claude Code to use hwinfo-tui to list all available sensors, then gave me commands to generate different charts. I ran those commands, took screenshots of the charts showing various combinations of sensors - core temps, package temp, power consumption, throttling status - and pasted them all into Claude Code.

![hwinfo-tui showing thermal issues - CPU package at 100°C while cores at 86°C, constant thermal throttling](/assets/hwinfo-tui-thermal-throttling.png)

This is the part that surprised me. I'd been staring at these numbers for months. I knew the temps were high, I knew the throttling was constant, but I couldn't connect the dots to a root cause. Claude looked at the same charts and immediately saw the pattern I'd been missing.

I could have had Claude write Python scripts to analyze the CSV with Pandas, compute correlations, find anomalies. That probably would have worked too, but it would have taken more turns, more tokens, more back-and-forth. With screenshots, Claude diagnosed the issue and gave me a clear answer in one shot.

## What Claude Found

Claude pointed out something I'd completely missed. Here's how it explained it:

> Look at the gap between the CPU Package line and the Core Temperatures line in your charts. In a healthy system, those two lines should track close together - maybe 5-10°C apart. In your charts, there's a consistent 13-23°C gap between them.
>
> That gap is the problem. The CPU throttling system responds to **package temperature**, not core temperature. When the package runs that much hotter than the cores, it means heat isn't transferring efficiently from the CPU die to the heatsink. The thermal interface has degraded.
>
> The combination of that large gap, low power consumption (50% of limit), and constant throttling is a **strong diagnostic signature** of thermal contact failure.

I didn't know any of this before. Reading the gap between two lines on a chart as a diagnostic for heat dissipation - that was new to me, and it made everything click.

## The Fix

Claude's recommendation was clear: repaste the CPU. The thermal interface had failed.

A colleague helped me open the laptop and repaste it. I'd never done this before, but Claude's explanation of what was happening made me confident enough to try. We cleaned the old paste and used a [PTM7950 phase change thermal pad](https://www.lttstore.com/products/ptm7950-phase-change-thermal-pad) instead of regular paste - it's easier to apply (especially if you cool it in the fridge first), lasts longer, and performs better than traditional compounds.

Package temp dropped from 97°C to 68°C. Throttling went from constant to zero. Two years of problems, fixed in an afternoon.

![hwinfo-tui after repaste - CPU package at 68°C average, thermal throttling gone, gap between package and cores now normal](/assets/hwinfo-tui-thermal-fixed.png)

## What I Learned

Give the AI enough context and it can explain things you couldn't figure out yourself. I'd been staring at these numbers for months without connecting the dots. Once Claude could see the full picture, it explained the problem clearly enough that I finally felt confident to act. Two years of hesitation, solved by a clear explanation.

{% comment %}
## LinkedIn Post

Claude Code made me change my laptop's thermal paste. More like convinced me, actually.

Two years of thermal throttling. CPU hitting 100°C, laptop unusable at times. Folks kept saying "just repaste it" but I'd never opened a laptop before, didn't want to risk it.

As any respectable engineer might do, instead of directly fixing the issue, I first built a tool. hwinfo-tui plots HWInfo64 sensor data over time in the terminal. The key insight with time graphs: stop focusing on numbers, start watching the gaps between lines.

I had charts but couldn't diagnose the problem. Then I fed the screenshots to Claude Code.

Claude saw what I'd been missing for months: "Look at the gap between the CPU Package line and Core Temperatures. In a healthy system, those lines track close together. In your charts, there's a consistent 13-23°C gap. That gap is the problem - heat isn't transferring efficiently from the CPU to the heatsink."

I didn't know any of this before. Reading the gap between two lines as a diagnostic for heat dissipation - that was new to me.

Used a PTM7950 phase change thermal pad instead of regular paste (easier to apply if you cool it in the fridge first). Package temp dropped from 97°C to 68°C. Throttling gone. Two years of problems fixed in an afternoon.

Give the AI enough context and it can explain things you couldn't figure out yourself.

#AI #Hardware #Troubleshooting #Claude

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/hardware/troubleshooting/2025/12/09/claude-code-thermal-paste.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread

Tweet 1 (Hook):
Claude Code made me change my laptop's thermal paste. More like convinced me, actually. Two years of throttling, folks kept saying "just repaste it" but I'd never opened a laptop before. 🔥

Tweet 2:
As any respectable engineer might do, instead of directly fixing the issue, I first built a tool. hwinfo-tui plots HWInfo64 sensor data over time in the terminal. 💡

Tweet 3:
Key insight with time graphs: stop focusing on numbers, start watching the gaps between lines. The vertical space between two sensors over time tells a story you can see without reading a single number.

Tweet 4:
I had charts but couldn't diagnose the problem. Fed screenshots to Claude Code, it saw what I'd been missing for months. ✅

Tweet 5:
"Look at the gap between CPU Package and Core Temperatures. In a healthy system, those lines track close together. That gap means heat isn't transferring efficiently from the CPU to the heatsink."

Tweet 6:
Used a PTM7950 phase change thermal pad instead of regular paste (easier to apply if you cool it in the fridge first). Package temp dropped from 97°C to 68°C. Throttling gone. ✨

Tweet 7:
Give the AI enough context and it can explain things you couldn't figure out yourself.

Tweet 8:
Full story: https://juanjofuchs.github.io/hardware/troubleshooting/2025/12/09/claude-code-thermal-paste.html

#Hardware #AI

---
INSTRUCTIONS:
1. Post as a thread on Wednesday at 9 AM EST (or Tue-Thu between 8-11 AM or 12-2 PM EST)
2. Keep each tweet under 280 characters
3. Link goes in the LAST tweet only (X algorithm suppresses posts with links)
4. Use only 1-2 hashtags total (at the end)
5. Add screenshots from hwinfo-tui showing the temperature charts if possible
6. Engage with replies in first hour for algorithm boost

ALTERNATIVE (Single Post):
If you prefer a single post instead of thread, post the hook without link, then immediately reply to your own post with the blog URL.
{% endcomment %}
