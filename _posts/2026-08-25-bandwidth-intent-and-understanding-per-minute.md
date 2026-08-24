---
layout: post
title: "Bandwidth: Intent and Understanding Per Minute"
description: "Intent going in and understanding coming back are separate bandwidth constraints. Four steps widened both."
date: 2026-08-25 09:00:00 -0400
categories: ai
tags: [ai, agents, voice, intent, taste]
author: JuanjoFuchs
permalink: /blog/intent-per-minute
image: /assets/intent-per-minute-2d-poster.png
---

![Emerald curve climbing through four steps on an Intent per Minute versus Understanding per Minute plot](/assets/intent-per-minute-2d-poster.png)

You type a prompt, get a wall of text back, skim it, approve it. When the next turn is still off, you blame the model.

I do this, and Opus 5 makes it worse. Its replies are long, and I have stopped reading them in their entirety. The model may have produced something useful and I didn't fully understand it, so the next prompt I send is no sharper than the last.

In this format, the bandwidth of both channels is constrained: intent going in and understanding coming back.

## Four steps

I used to type and read back. Dictation tools came next, then full back-and-forth audio, then the agent showing me things. Each step changed a specific channel of the loop.

**Type in + read back.** This is where most people still live. You hunt for the words, type them one letter at a time, then wait and read. The bandwidth in both channels stays constrained. I have shipped plenty this way before I ever dictated anything. It works. It also throttles how much of what I meant gets across, and how much of what came back I absorb.

**Dictate + read back.** Speech widens the intent channel first, so more intent makes it in. But understanding still comes back through text. I can say more, but I still have to extract the understanding from a wall of words.

**Talk both ways.** This is the jump I felt. Dictation widened the intent channel. But being able to listen to a clear explanation while still reading the spec, the code, or whatever the agent is working on dramatically widened the bandwidth of the understanding channel. I've been using [voice-tunnel](https://juanjofuchs.com/blog/voice-tunnel), my agent voice tool, for everything. With both channels widened, I can send far more context, and enough understanding comes back to sharpen my next turn.

**Talk both ways + show me.** Hearing a description still leaves me extracting the understanding from it. However, the agent can put the actual output in front of me: the data, the plot, the running system, a recording of the feature being driven. The understanding channel carries evidence instead of a write-up.

## Intent per minute

Intent per minute is how much of what I mean gets through to the agent per minute.

Typing forces me to compress my thought before the agent sees it. Speaking lets me send the examples, constraints, tradeoffs, corrections, and reasons as they occur to me. What sounds like rambling is often where the context lives. I state the goal, catch a missing constraint as I hear myself say it, and explain why one tradeoff beats another.

[Doug Engelbart](https://www.dougengelbart.org/pubs/augment-3906.html) argued in 1962 that our effect on the world is limited by what we can transmit through our motor channels, while what we understand is limited by what comes back through our sensory channels. A keyboard constrains the intent channel. A wall of text constrains the understanding channel.

## Understanding per minute

Understanding per minute is how much of the result I actually take in per minute. Reading a reply is not the same as hearing it and immediately responding, "No, not that, the other thing."

Opus 5 can hand back a long response full of technically good arguments that I can barely understand. If I skim it and approve the next step, the agent gets almost none of my judgment on the next turn, and my taste starts disappearing from the artifact.

Show me widens the understanding channel because I can inspect the result instead of extracting understanding from another explanation. That understanding becomes judgment, which sharpens intent on the next turn.

## What reaches the artifact

More intent in and more understanding back means more of my taste reaches the output.

I wrote that [taste debt](https://juanjofuchs.com/blog/taste-debt) is shortcuts in the judgment you apply to what gets built, the decisions you let the AI make because the output looked fine. It is the gap between the taste I have and the taste that reached the artifact.

## Show me

I don't trust diagrams. I trust data.

That's why I built a way for my agents to drive live notebooks: they can show me the data while we keep talking. I don't need to understand every line of code or reconstruct every input before I evaluate the result. Tables and plots land in front of me, and I inspect what the computation produced. Inspecting the output is how I verify what the artifact did and understand its behavior.

Here is the loop running. I ask for the plot out loud, the agent writes the cell and runs it, and the chart in this post appears in front of me. Then I ask for the section word counts and inspect those too. The waits are cut, and each cut says how many seconds it removed.

<div style="position: relative; padding-bottom: 62.34%; height: 0; overflow: hidden;">
  <video style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
         controls playsinline poster="/assets/videos/intent-per-minute-notebook-demo-poster.png">
    <source src="/assets/videos/intent-per-minute-notebook-demo.mp4" type="video/mp4">
  </video>
</div>

An AI-authored picture or diagram can explain what the agent understands. That is useful, but it is not an objective representation of what was built. Claude Code [artifacts](https://code.claude.com/docs/en/artifacts), [Thariq Shihipar's HTML approach](https://claude.com/blog/using-claude-code-the-unreasonable-effectiveness-of-html), and the [ELI5 plugin](https://github.com/anthropics/claude-plugins-community/tree/main/eli5) make those explanations easier to take in. Verification is different. I need to see the actual data, computation, or system state behind the work. That is what widens understanding per minute for me.

A chart of the real output can still mislead me. A bad transformation or the wrong slice can misrepresent something technically real. In a notebook, the chart sits beside the cell that produced it, so I can inspect the transformation and fix it. That trace is what I trust.

## The next channel

The next channel is the one between the agent and my environment. I widened it through my second brain and the tooling around it. I will write about that soon.

For now, I keep asking the agent to show me the notebook. I can see the data, decide what I think, and tell it what to change while the decision is still fresh.

{% comment %}
## LinkedIn Post
MEDIA: /assets/videos/intent-per-minute-notebook-demo.mp4
ALT: An agent writes and runs a notebook cell by voice, and the Intent per Minute curve renders next to the voice tunnel orb

I type a prompt, get a wall of text back, skim, approve, then wonder why the next turn is still off.

Opus 5 makes it worse. Its replies are long, and I have stopped reading them in their entirety. The model may have produced something useful and I didn't fully understand it, so the next prompt is no sharper than the last.

In this format, the bandwidth of both channels is constrained: intent going in and understanding coming back.

I moved through four steps:

1. Type in + read back
2. Dictate + read back
3. Talk both ways
4. Talk both ways + show me

Dictation widened the intent channel. What sounds like rambling is often where the examples, constraints, tradeoffs, and reasons live.

Talking both ways widened the understanding channel. I can listen to a clear explanation while still reading the spec, the code, or whatever the agent is working on.

Then show me put the actual output in front of me: the data, the plot, the running system, a recording of the feature being driven. The understanding channel carries evidence instead of a write-up.

More intent in and more understanding back means more of my taste reaches the output.

I don't trust diagrams. I trust data.

Bandwidth: Intent and Understanding Per Minute:
https://juanjofuchs.com/blog/intent-per-minute

Which of those four steps are you on?

#AI #ClaudeCode #Agents #DeveloperProductivity #VoiceAI

---

## X/Twitter Thread
MEDIA: /assets/videos/intent-per-minute-notebook-demo.mp4
ALT: An agent writes and runs a notebook cell by voice, and the Intent per Minute curve renders next to the voice tunnel orb

Tweet 1 (Hook):
Opus 5 made one of my agent problems worse. Its replies are long. I stopped reading them in their entirety. The model may have produced something useful, but if I don't fully understand it, my next prompt is no sharper than the last.

Tweet 2:
I think of the bottleneck as two channels: intent going in, understanding coming back. Intent per minute is how much of what I mean gets through to the agent. Understanding per minute is how much of the result I actually take in.

Tweet 3:
I moved through four steps: type + read, dictate + read, talk both ways, talk + show me. Dictation widened intent. Spoken replies widened understanding because I could listen while still reading the spec, code, or whatever the agent was changing.

Tweet 4:
Then show me put the actual output in front of me: data, plots, a running system, a recording of the feature. The understanding channel carried evidence instead of another write-up.

Tweet 5:
An AI-authored diagram can explain what the agent understands. It is not an objective representation of what was built. Verification means seeing the actual data, computation, or system state behind the work.

Tweet 6:
More intent in and more understanding back means more of my taste reaches the output.

Bandwidth: Intent and Understanding Per Minute:
https://juanjofuchs.com/blog/intent-per-minute

#AI #ClaudeCode

---

## Newsletter
SUBJECT: I don't trust diagrams. I trust data.
PREVIEW: Opus 5 made one of my agent bottlenecks worse.
MEDIA: /assets/intent-per-minute-2d-poster.png
ALT: Emerald curve climbing through four steps on an Intent per Minute versus Understanding per Minute plot

Opus 5 has made a strange problem worse for me: its replies are long enough that I have stopped reading them in their entirety.

The model may have produced something useful. But if I didn't fully understand it, the next prompt is no sharper than the last.

I started thinking about this as two channels: intent going in and understanding coming back.

Over time I moved from typing, to dictation, to talking both ways, to asking the agent to show me the actual output.

Dictation widened the first channel. Talking both ways widened the second because I could listen while still looking at the spec or code. Then show me put the data, the plot, and the running system in front of me.

That last step matters. I don't trust a diagram just because the AI drew it. A diagram can explain what the agent understands, but it is not an objective representation of what was built. I trust the data, computation, or system state behind the work.

More intent in and more understanding back means more of my taste reaches the output.

I wrote the full idea here:

https://juanjofuchs.com/blog/intent-per-minute

---
INSTRUCTIONS:
- LinkedIn: Post Tuesday-Thursday. URL in post body (the Comments API is gated behind LinkedIn's Community Management partner program, which individual developers can't access).
- X/Twitter: Post as thread. Media attached to first tweet. Link only in last tweet.
- MEDIA for LinkedIn, X, and the newsletter is the plot poster (/assets/intent-per-minute-2d-poster.png).
{% endcomment %}