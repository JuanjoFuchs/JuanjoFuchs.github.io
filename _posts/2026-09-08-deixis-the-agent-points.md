---
layout: post
title: "Deixis: the agent points"
description: "Pointing at the exact element while speaking, across multiple agent lanes, is my newest step in increasing the bandwidth of understanding."
date: 2026-09-08 09:00:00 -0400
categories: ai
tags: [ai, agents, voice, deixis, canvas]
author: JuanjoFuchs
permalink: /blog/deixis
image: /assets/deixis-command-bridge-hero.png
---

![The kepler agent orb lit, pointing at a highlighted node in a nested diagram, four lanes above, transcript beside.](/assets/deixis-command-bridge-hero.png)

Deixis is context-dependent reference, words like "this", "that", "here" and "then" get their meaning from the situation in which they're used. Pointing can supply that context. You can't know what any of them mean without knowing what the speaker is gesturing at. [Pointing is how humans establish joint attention](https://holgerdiessel.uni-jena.de/Deixis%20and%20demonstratives.pdf), two people locked onto the same thing and both aware that they are looking at it.

I've been [exploring how to increase the bandwidth between me and my agents](https://juanjofuchs.com/blog/intent-per-minute), how much intent I can transmit and how much I can truly understand of what comes back. I work with AI every day, for coding, research, writing, in my second brain, basically everything. The newest iteration on increasing this bandwidth is the agent pointing at the exact element on a shared canvas while it explains it.

## Seeing isn't understanding

In my [previous post](https://juanjofuchs.com/blog/intent-per-minute), "show me" was the last step that let the agent put the actual output in front of me. I built [voice-tunnel](https://juanjofuchs.com/blog/voice-tunnel) for two-way audio with my coding agents, but it was lacking this "show me" step, [Command Bridge](https://github.com/JuanjoFuchs/command-bridge) was the natural evolution of that, so several agents could talk to me and drive a shared canvas to show me stuff.

When the agent and I are trying to line up on an idea, how a system is shaped, what a plan is going to do, a diagram is a thousand times better than a wall of text. [Larkin and Simon](https://mechanism.ucsd.edu/bill/teaching/F12/cs200/Readings/larkin.whyadiagramissometimesworth.1987.pdf) showed why back in 1987, a diagram pays off when the bottleneck is spatial, when seeing the relationships saves you the inference. Aligning on a concept is the spatial case.

But a diagram in a canvas is still a diagram you have to decode in your mind to understand it. I'm the one looking at the boxes and the arrows the agent drew, and I'm the one turning them back into understanding. If I can't tell which box the agent is talking about, I have to spend a turn on realigning the agent before we can discuss what that box means. That takes bandwidth away from understanding the idea.



## Deixis

So, the agent draws the concept and points at the exact element as it names it. The box lights up on the mention, so I can follow the explanation with my attention already on the right element of the diagram.

The timing has to be exact. The highlight has to hit on the word or just before it, never after. David McNeill measured hand gestures against speech and found the stroke leads the stressed syllable, and [a 2024 motion-capture study found early or synchronized gestures help recall while late ones hurt it](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1345906/full). A mark that fires a beat late points at the wrong word and reads as noise, so Command Bridge drives the highlight off the measured word timings instead of guessing them.

None of this is new as an idea. Richard Bolt's [Put-That-There](https://dl.acm.org/doi/10.1145/800250.807503) wired voice and pointing together at a screen in 1980, "put that there" only works because the gesture pins down what "that" and "there" mean. Command Bridge is the version where the agent is the one pointing, on a canvas it drew itself.

<div style="position: relative; padding-bottom: 62.27%; height: 0; overflow: hidden;">
  <video style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
         controls playsinline preload="metadata"
         aria-label="The Command Bridge canvas: the kepler agent points at each node of a concept diagram as it names it, the highlighted box tracking the word, across three diagrams."
         poster="/assets/videos/deixis-command-bridge-demo-poster.jpg">
    <source src="/assets/videos/deixis-command-bridge-demo.mp4" type="video/mp4">
  </video>
</div>

## Multiple lanes

Voice Tunnel only worked with one agent, and that meant I was often waiting 30 to 45 seconds between turns while it read files, executed code, reasoned, etc. I needed a way to reduce my idle time in between turns.

Command Bridge allows running multiple agents on the same bridge with named lanes, e.g. kepler, atlas, magnus, dexter across the top of the screen. I can switch to kepler's lane and give it something to work on, then switch to atlas while kepler thinks, and follow atlas's explanation on its canvas. Each lane keeps its agent's current state visible in the canvas when I return to it, so I can pick up the context from the screen.

That makes switching between tasks easier. I don't have to hold every diagram and every agent's last explanation in memory while I'm working with another. I can come back to a lane, hear the agent's explanation, see what the agent is working on, and have it point at the part it needs to discuss.

This feels like [managing a team live on a command-bridge](https://juanjofuchs.com/blog/managers-and-ai). I'm keeping each agent unblocked and making sure I understand where it's going so that we stay aligned and making progress.

## The loop


I like to work with 3 to 6 agents at the same time and I try to make sure I divide my attention equally across all agents and that I keep them all busy most of the time.

So, I start command bridge, fire up the agents, start giving them instructions to read my second brain, scan code, etc, and come back to me with a short explanation of what it understands from reading all that. While that agent is off doing all those activities, I switch to the next and dispatch that same task, and so on with the rest of agents. When the first agent is done with its report, it will raise its hand in its lane and will have an explanation waiting for me, I switch back to its lane, hear and see its explanation to see if the agent is aligned, if not, I provide feedback and let it work for some time while I see the other agents' reports. That way I can multi-task and keep myself and the agents busy while being able to pick up the context of what each lane is working on quickly, both visually and auditorially.

I believe this is the future of interacting with the AI, text in and text out was just the beginning, two-way audio conversations was the next step, deixis is the current step and I believe there's still room to continue pushing new ways of increasing the bandwidth between us and our AIs.

{% comment %}
## LinkedIn Post
MEDIA: /assets/videos/deixis-command-bridge-demo.mp4
ALT: The kepler agent highlights each node as it names it, across three concept diagrams on the Command Bridge canvas.

Deixis is context-dependent reference, words like "this", "that", "here" get their meaning from the situation in which they're used. I've been exploring how to increase the communication bandwidth between me and my agents, how much intent I can transmit and how much I can truly understand what they send back.

I work with AI every day, for coding, research, writing, in my second brain. The amount I can truly understand of what my agents say constrains how far I can take that work.

The newest iteration on increasing this bandwidth is deixis, the agent pointing at the exact element on a shared canvas while it explains it. The agent creates a diagram to explain the concept and while it talks points at the exact element as it names it. The box lights up as its mentioned, so I can follow the explanation with my attention already on the right element of the diagram.

I am also exploring running multiple agents at the same time each with their own lane, canvas and deixis. This way, while one agent reasons or executes code, I can switch to another lane and talk to a different agent on a different task. When I return, the canvas shows what that agent is working on, so I can recover the context from the screen.

This feels like managing a team live on a command-bridge. I'm keeping each agent unblocked and making sure I understand where it's going so that we stay aligned and making progress.

I believe this is the future of interacting with the AI, text in and text out was just the beginning, two-way audio conversations was the next step, deixis is the current step and I believe there's still room to continue pushing new ways of increasing the bandwidth between us and our AIs.

Command Bridge is open source: https://github.com/JuanjoFuchs/command-bridge

Deixis: the agent points
https://juanjofuchs.com/blog/deixis

#AI #ClaudeCode #Agents #VoiceAI

---

## X/Twitter Thread
MEDIA: /assets/videos/deixis-command-bridge-demo.mp4
ALT: The kepler agent highlights each node as it names it, across three concept diagrams on the Command Bridge canvas.

Tweet 1 (Hook):
I've been increasing the bandwidth between me and my agents. The newest step is deixis: the agent draws a concept and points at the exact element as it names it. The box lights up on the word, so my attention is already on the right part of the diagram.

Tweet 2:
Deixis is context-dependent reference, words like this, that, here that only mean something in context. A diagram still takes work to decode, and if I can't tell which box the agent means I burn a turn realigning. Pointing puts us on the same element at once.

Tweet 3:
I also run several agents at once, each with its own lane, canvas and deixis. While one reasons or runs code, I switch to another lane and a different task. When I come back, the canvas shows what it's working on, so I recover the context from the screen.

Tweet 4:
It feels like managing a team live on a command-bridge. I keep three to six agents busy and divide my attention across them. When one raises its hand I switch back, hear and see its explanation, and check we're still aligned.

Tweet 5:
Text in and text out was just the beginning. Two-way audio was the next step. Deixis is the current one, and I think there's still room to keep increasing the bandwidth between us and our AIs.

Tweet 6:
Command Bridge is open source: https://github.com/JuanjoFuchs/command-bridge

https://juanjofuchs.com/blog/deixis

#AI #ClaudeCode

---

## Newsletter
SUBJECT: My agents point while they explain
PREVIEW: Increasing the bandwidth between me and my agents, across several lanes.
MEDIA: /assets/videos/deixis-command-bridge-demo.mp4
ALT: The kepler agent highlights each node as it names it, across three concept diagrams on the Command Bridge canvas.

I've been exploring how to increase the bandwidth between me and my agents, how much intent I can transmit and how much I can truly understand of what they send back. I work with AI every day, for coding, research, writing, in my second brain, and how much I understand of what my agents say is what constrains how far I can take the work.

The newest step is deixis. The agent draws a diagram to explain a concept, and as it talks it points at the exact element it's naming. The box lights up on the mention, so I can follow the explanation with my attention already on the right part of the diagram, instead of spending a turn working out which box it means.

I'm also running several agents at once, each with its own lane, canvas and deixis. While one reasons or runs code, I switch to another lane and a different task, and when I come back the canvas shows what that agent is working on so I can pick the context back up from the screen. It feels like managing a team live on a command-bridge.

Text in and text out was just the beginning, two-way audio was the next step, and deixis is the current one. I think there's still room to keep pushing new ways of increasing the bandwidth between us and our AIs.

The post has a recording of kepler pointing through three concept diagrams, and Command Bridge is open source: https://github.com/JuanjoFuchs/command-bridge

https://juanjofuchs.com/blog/deixis

---
INSTRUCTIONS:
- LinkedIn: URL in post body.
- X/Twitter: Post as thread. Media attached to first tweet. Link only in last tweet.
- MEDIA for LinkedIn, X, and the newsletter is the demo video (/assets/videos/deixis-command-bridge-demo.mp4).
{% endcomment %}