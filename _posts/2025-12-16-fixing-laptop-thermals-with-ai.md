---
layout: post
title: "How AI Diagnosed My Laptop's Thermal Problem"
description: "CPU throttling for months, tried everything. Claude analyzed screenshots from hwinfo-tui and found the issue hiding in the data: thermal paste failure."
date: 2025-12-16 09:00:00 -0500
categories: hardware troubleshooting
tags: [hardware, thermal, ai, claude, hwinfo-tui, troubleshooting, dell]
author: JuanjoFuchs
---

My Dell Precision 5570 had thermal throttling issues for months. CPU would hit 95°C under load and throttle constantly, making the laptop unusable at times. I tried laptop stands with coolers, cleaned the fans multiple times, adjusted power settings, nothing worked.

Then I fed screenshots of temperature charts to Claude Code and it diagnosed the problem in minutes. Turns out the thermal paste had failed, and the clue was hiding in plain sight.

## The Problem

The throttling was severe. Running any moderately intensive task would cause the CPU to throttle within seconds. Fans would spin up to max RPM, the laptop would get uncomfortably hot, and performance would tank.

I tried the usual fixes:
- Laptop cooling stand with extra fans
- Cleaned the internal fans and heatsinks
- Adjusted Windows power profiles
- Monitored temps with HWInfo64

Nothing made a difference. HWInfo64 showed high temps but only displayed the current value, so I couldn't see patterns over time or correlate throttling with temperature changes.

## Building the Monitoring Tool

I needed to see temperature trends, not just current values. So I built [hwinfo-tui](https://github.com/JuanjoFuchs/hwinfo-tui) to monitor HWInfo64's sensor data over time and plot it in the terminal.

The tool watches HWInfo64's CSV export and creates live charts with multiple sensors on dual Y-axes. I could finally see how temps changed under load, when throttling kicked in, and what the relationship was between different sensors.

## The Multimodal Analysis

I remembered reading that multimodal AI models are good at understanding data patterns by looking at graphs instead of raw numbers. So I tried an experiment.

I asked Claude Code to use hwinfo-tui to list all available sensors, then gave me commands to generate different charts. I ran those commands, took screenshots of the charts showing various combinations of sensors (core temps, package temp, power consumption, throttling status), and pasted them all into Claude Code.

Claude analyzed the screenshots and came back with detailed findings.

## What Claude Found

The diagnosis was surprising. Here's what Claude identified from the charts:

### The Hidden Problem

```
Core Temperatures (avg):  69°C  ← Looks acceptable
CPU Package Temperature:  91.8°C  ← CRITICAL
Temperature Delta:        ~23°C  ← ABNORMAL
```

The CPU was throttling based on package temperature, not core temperature. And the package temp was running 23°C hotter than the core average.

In a healthy system, the delta between core and package temps is typically 5-10°C. A 23°C delta is a strong indicator of thermal contact failure.

### Power Validation

Claude also checked whether this was a power limit issue:

```
Average Power Consumption: 25.1W
Peak Power Consumption:    55.6W
Power Limits (PL1/PL2):    115.0W
```

The laptop was using only 48% of its power limit, so this wasn't about power delivery or TDP constraints. The CPU was thermally throttling while barely drawing half its rated power.

### Throttling Analysis

Looking at the throttling data:
- Thermal throttling active in 97% of samples
- Power limit throttling in only 12% of samples
- Package temps hitting 105°C max
- Core temps appearing "normal" at 69°C average

The combination of high package temp, normal core temp, low power consumption, and constant throttling was what Claude called a "strong diagnostic signature" of thermal paste failure.

## The Fix

Claude's recommendation was clear: the thermal paste had likely dried out or wasn't making proper contact. The large temperature delta between cores and package meant heat wasn't transferring efficiently from the CPU die to the heatsink.

A colleague (Gary) helped me repaste the CPU. We used proper thermal paste application, cleaned the old paste thoroughly, and ensured even mounting pressure.

Results:

```
Before repaste:
- Package temp: 91.8°C average, 105°C max
- Throttling: 97% of the time
- Unusable under load

After repaste:
- Package temp: 65°C average
- Throttling: None
- Completely usable
```

Temperature dropped by ~30°C and the throttling disappeared completely.

## The Key Insight

The insight that solved this was understanding that **CPU throttling responds to package temperature, not just core temperature**.

Most monitoring tools show core temps prominently, and 69°C looks acceptable. But if the package is running at 92°C while cores show 69°C, you have a thermal contact problem. The heat isn't spreading properly across the CPU package or transferring to the cooler.

This is the kind of diagnostic pattern that's hard to spot when you're looking at raw numbers, but Claude identified it immediately from the chart screenshots. The visual representation made the abnormal delta obvious.

## What I Learned

**Multimodal AI is powerful for diagnostics.** Feeding charts to Claude instead of trying to describe temperature patterns in text was significantly more effective. The AI could see the relationships between sensors, identify the abnormal patterns, and diagnose the root cause.

**Package temperature matters more than core temps.** Core temps can look fine while the package is critically hot. Always monitor both when troubleshooting thermal issues.

**Visual monitoring beats spot checks.** Seeing temperature trends over time reveals patterns that spot checks miss. The hwinfo-tui charts made it obvious when throttling correlated with package temp spikes.

**Temperature deltas are diagnostic.** A large gap between core and package temps (>15°C) indicates thermal contact failure, not inadequate cooling capacity.

## The Tech

- **HWInfo64**: Hardware monitoring for Windows
- **hwinfo-tui**: Terminal visualization tool I built ([GitHub](https://github.com/JuanjoFuchs/hwinfo-tui))
- **Claude Code**: Multimodal AI analysis from chart screenshots
- **Dell Precision 5570**: The patient

## Using This Approach

If you're troubleshooting thermal issues:

1. **Monitor both core and package temps** - Core temps alone can be misleading
2. **Look for large temperature deltas** - >15°C between core and package suggests contact problems
3. **Check power consumption** - Rule out power limits before assuming thermal issues
4. **Use visual monitoring** - Charts reveal patterns that spot checks miss
5. **Try multimodal AI analysis** - Feed screenshots to Claude or other vision-capable models

The complete thermal analysis Claude helped me write is in the [hwinfo-tui repo](https://github.com/JuanjoFuchs/hwinfo-tui/blob/main/docs/thermal-throttling-analysis.md) if you want the detailed diagnostic approach.

## Resources

- [hwinfo-tui on GitHub](https://github.com/JuanjoFuchs/hwinfo-tui)
- [Thermal Analysis Document](https://github.com/JuanjoFuchs/hwinfo-tui/blob/main/docs/thermal-throttling-analysis.md)
- [HWInfo64 Download](https://www.hwinfo.com/)
- [Claude Code](https://claude.com/claude-code)

{% comment %}
## LinkedIn Post

Spent months fighting laptop thermal throttling. Tried cooling stands, cleaned fans, adjusted power settings. Nothing worked. CPU would hit 95°C and throttle constantly.

Then I fed temperature chart screenshots to Claude Code and it diagnosed the problem in minutes: thermal paste failure. Here's the part that most guides miss.

Built hwinfo-tui to monitor temps over time since HWInfo64 only shows current values. The tool plots sensor data in real time so I could see patterns. Then I used Claude's multimodal capabilities - took screenshots of multiple sensor charts and asked it to analyze them.

Claude found the hidden problem:

✅ Core temps: 69°C (looked acceptable)
✅ Package temp: 91.8°C (CRITICAL)
✅ Temperature delta: 23°C (abnormal - should be 5-10°C)

In a healthy system, package and core temps are close together. A 23°C delta means thermal contact failure - heat isn't transferring from CPU to cooler properly. Claude also confirmed it wasn't a power limit issue since the laptop was using only 48% of its rated power.

Repasted the CPU with help from a colleague. Results:
- Package temp dropped from 92°C to 65°C
- Throttling went from 97% of the time to zero
- Laptop completely usable again

The key insight: CPU throttling responds to package temperature, not core temperature. Most tools show core temps prominently and 69°C looks fine. But if package is at 92°C while cores show 69°C, you have a contact problem that spot checks won't reveal.

Multimodal AI was incredibly effective for this. Feeding charts to Claude instead of describing patterns in text made the diagnosis instant. The visual representation made the abnormal delta obvious.

Have you tried using multimodal AI for hardware diagnostics? The approach works surprisingly well.

#AI #Hardware #Troubleshooting #Claude #TechTips

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/hardware/troubleshooting/2025/12/09/fixing-laptop-thermals-with-ai.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread

Tweet 1 (Hook):
Fought laptop thermal throttling for months. Tried everything, nothing worked. Fed temperature charts to Claude Code and it diagnosed the problem in minutes: thermal paste failure. 🔥

Tweet 2:
The clue was hiding in the data. Core temps looked fine at 69°C, but package temp was hitting 92°C. That 23°C delta is abnormal - should be 5-10°C in healthy systems. 💡

Tweet 3:
Built hwinfo-tui to monitor temps over time since HWInfo64 only shows current values. Needed to see patterns and correlations between different sensors.

Tweet 4:
Used Claude's multimodal capabilities. Took screenshots of multiple sensor charts (temps, power, throttling) and asked it to analyze them. Visual data >> text descriptions. ✅

Tweet 5:
Claude confirmed: high package temp + normal core temp + low power usage (48% of limit) + constant throttling = thermal contact failure. Classic signature.

Tweet 6:
Repasted the CPU. Package temp dropped from 92°C to 65°C. Throttling went from 97% of the time to zero. Laptop completely usable again. ✨

Tweet 7:
The lesson: CPU throttling responds to package temperature, not core temperature. Most tools emphasize core temps which can look acceptable while package is critical.

Tweet 8:
Complete story with charts, analysis, and diagnostic approach: https://juanjofuchs.github.io/hardware/troubleshooting/2025/12/09/fixing-laptop-thermals-with-ai.html

Full thermal analysis doc: https://github.com/JuanjoFuchs/hwinfo-tui/blob/main/docs/thermal-throttling-analysis.md

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
