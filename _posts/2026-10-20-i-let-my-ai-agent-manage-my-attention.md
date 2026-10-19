---
layout: post
title: "I let my AI agent manage my attention"
description: "I stopped talking directly to multiple agents. Now I talk to just one, my chief of staff, and my agent team went from six to 16 named agents."
date: 2026-10-20 09:00:00 -0400
categories: ai
tags: [ai, agents, command-bridge, attention]
author: JuanjoFuchs
permalink: /blog/chief-of-staff
image: /assets/2026-10-20-chief-of-staff-hero.png
---

<div style="max-width: 380px; margin: 0 auto;">
  <div style="position: relative; padding-bottom: 207.41%; height: 0; overflow: hidden;">
    <video style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
           controls playsinline preload="metadata"
           aria-label="On a phone, magnus explains the before and after, brings up three agents, then I promote orion to cut a paragraph"
           poster="/assets/2026-10-20-chief-of-staff-hero.png">
      <source src="/assets/videos/2026-10-20-chief-of-staff-hero.mp4" type="video/mp4">
    </video>
  </div>
</div>

Lately I start my day with just one AI agent. I call it magnus, and I give it the list of everything I want to get done that day. Magnus then launches the agents for each of those items and briefs them. Then it spends the rest of the day managing my attention and bringing me only what needs me.

Magnus is my chief of staff. It started as an experiment in early October on [Command Bridge](https://github.com/JuanjoFuchs/command-bridge), the tool I built to talk to my agents by voice. Now magnus is the only agent I talk to, and the others keep working without speaking to me. A week in, I told magnus the experiment was no longer an experiment.

## The evening fry

Before this experiment I used to keep 3 to 6 agents alive, [each in its own lane](https://juanjofuchs.com/blog/deixis), and I would speak to all of them. I'd round-robin through them and try to divide my attention equally, so none of them got starved.

At the beginning of the day it was amazing. It worked, I felt productive, and all of the agents were busy and making great progress.

But by the end of the day I was so tired that I would start to favor just one or two agents. The other ones that still needed my feedback were stuck, not making as much progress as I needed them to.

I'd [written before](https://juanjofuchs.com/blog/agent-mail) that any more than six and my brain fries. A BCG study HBR published gave that a name, [brain fry](https://hbr.org/2026/03/when-using-ai-leads-to-brain-fry), the mental fatigue of using or overseeing more AI tools than you can handle. In its survey, productivity rose up to three tools and dropped after that.

## What the chief of staff does

Magnus keeps me focused and busy. Its job is not only managing all the other agents, but also managing my attention. What it brings me is a draft to approve, a question an agent can't answer without me, or a result I asked to see. Everything else stays with the agents.

Magnus also keeps a Kanban board of everything I have asked it to do, how each item is moving and what the agents are doing.

Getting magnus to behave the way I needed it to took a lot of training. For example, it needs to bring me one decision at a time and wait for my ruling before moving on. And it can never just give me an update: if the update doesn't require a decision from me, it has to also feed me something that gets me thinking.

Here are some of the rules that drive Magnus' behavior:

```
1. Say what you're about to do before you do it, and keep it terse.
2. Name the thing. Never make me remember what "it" was.
3. Never stop at the finding. Say what it means and what I should do next.
4. Speak when I ask, instruct or hand back. A pause is not an invitation.
5. When an item closes, bring me the next one in the same breath.
6. Keep one board of my asks: waiting on me, being worked, scheduled, done.
7. Every approval you relay quotes my words and the time. Nothing goes out without my OK.
```

## A team roster

A chief of staff alone isn't enough. I have a team of agents with names, roles and responsibilities, so every agent knows what it has to do and can keep pushing on its own. And magnus already knows which one to launch for each item, based on those roles and responsibilities, and I don't have to brief an agent again after each goal.

Each role is a project or an [area of responsibility in my second brain](https://juanjofuchs.com/productivity/2025/12/16/making-second-brain-ai-compatible.html), with its own notes, guides and startup instructions. The agent is a persistent name that holds the role, so if I put a second agent in the same role, it starts up the same way.

Since I stopped talking directly to every agent, my team went from 6 to 16 named agents. On a busy day I've had up to 20 named agents running at once, 100s if we count the short-lived sub-agents they spin up when needed. But not every agent runs every day. Magnus knows what I need to get done, and it starts up or tears down the agents it needs based on what I ask for. When magnus delegates, it hands an agent the outcome, my words and the limits, not the steps. My agents are intelligent and have access to my second brain, so they can reason and ground on their own.

## How many leads do you need?

I talk to my chief of staff and, at most, one or two other leads. Most days the chief of staff is enough. Under each one I can have as many agents as needed.

When I need to dig deeper on specifics, I promote an agent to a lead, which means I get to talk to it directly instead of through my chief of staff. This post is an example. I promoted orion, my blog agent, so I could go over the details with it directly. When we're done, I demote it, and it goes back to working under magnus.

I keep the number of leads small for a reason. In the past I tried a team of agents with a strategist, an architect, a tech lead and a development team. I only spoke with the strategist, and it delegated to the architect, the tech lead and the dev team. In that experiment, the communication between me and the strategist, and between each agent, was so poor that the work was low quality. It [lacked my taste](https://juanjofuchs.com/blog/taste-debt). I think it was mostly Opus 5's fault, because its communication style was so bad. But it also showed me how important it is to never delegate taste.

Since every extreme is bad, a chief of staff is good, but it's also important to be able to dig deeper by promoting an agent and talking to it directly.

## What stays with me

Since my agents have roles and responsibilities, they can keep pushing on their own. But there is a limit to how much they can push without me, and to how much I understand of what they're doing on my behalf.

Instead of reading walls of text or listening to long explanations of what the agents are trying to explain to me, I have them show me. On a diagram, an animation, a recording of a feature being used, data I need them to render from something they executed, or even a diagram of a concept, and they walk me through it, [pointing at what they're talking about](https://juanjofuchs.com/blog/deixis).

That gives me [more understanding per minute](https://juanjofuchs.com/blog/intent-per-minute) than reading or listening would. And that understanding is what lets me exert my taste into the work I produce and make sure my intent was fully executed, instead of rubber stamping whatever an agent prepared.

{% comment %}
## Social Campaign
CAMPAIGN: chief-of-staff_20261020
TIMEZONE: America/New_York
NOTE: Daily promotion trial 20261020-daily-promotion-li, weeks 1-2 at 12 PM ET. Text plus one link to the blog, with a clip per day cut from the hero recording (JJ, 10-19 14:24: "allow the clips"). Every slot needs JJ's OK before it's scheduled.

### Tuesday - Launch
DATE: 2026-10-20
TIME: 12:00
MEDIA: /assets/videos/2026-10-20-chief-of-staff-tue.mp4
ALT: On a phone, magnus explains how I worked before and now, then brings up three agents and shows the board

#### LinkedIn Post
I used to keep 3 to 6 AI agents running at once and speak to all of them, switching between them so none got starved of my attention. At the beginning of the day it was amazing, it felt so productive. But by the end of the day I was so tired that I would only favor one or two of them, and the others were stuck waiting for my feedback.

A BCG study published in HBR gave that feeling a name: brain fry, the mental fatigue of using or overseeing more AI tools than you can handle. In its survey, self-reported productivity rose up to three tools and dropped after that.

So now I start my day with just one AI agent. I call it magnus, my chief of staff, and I give it the list of everything I want to get done that day. Magnus launches the agents for each item, briefs them, and spends the rest of the day managing my attention, bringing me only what needs me. It's the only agent I talk to. The others keep working without talking to me.

It started as an experiment in early October. A week in, I told magnus the experiment was no longer an experiment.

I let my AI agent manage my attention: https://juanjofuchs.com/blog/chief-of-staff

#AIAgents #ClaudeCode #AI #DeveloperProductivity

#### X/Twitter Thread
Tweet 1:
I used to keep 3 to 6 AI coding agents alive and speak to all of them. In the morning it felt amazing. By the evening I'd favor one or two, and the rest were stuck waiting for my feedback.

Tweet 2:
A BCG study in HBR calls it brain fry: the mental fatigue of overseeing more AI tools than you can handle. Self-reported productivity rose up to three tools and dropped after that.

Tweet 3:
Now I start the day by giving one AI agent, my chief of staff, my list. It launches and briefs my other coding agents and brings me only what needs me. It's the only agent I talk to.

Tweet 4:
https://juanjofuchs.com/blog/chief-of-staff

#AIAgents #ClaudeCode

### Wednesday - What the chief of staff does
DATE: 2026-10-21
TIME: 12:00
MEDIA: /assets/videos/2026-10-20-chief-of-staff-wed.mp4
ALT: Magnus shows the board, then brings me one decision at a time: a README diff, then a blog post title

#### LinkedIn Post
Every morning I give one AI agent, my chief of staff, the list of everything I want to get done. It launches my other agents and briefs them, and it's the only agent I talk to.

Its job is not only managing the other agents, but also managing my attention. What it brings me is a draft to approve, a question an agent can't answer without me, or a result I asked to see. Everything else stays with the agents. It also keeps a Kanban board of everything I've asked for, how each item is moving and what the agents are doing.

Getting it to behave the way I needed took a lot of training. It brings me one decision at a time and waits for my ruling before moving on. And it can never just give me an update: if the update doesn't need a decision from me, it also has to give me something that gets me thinking.

Some of the rules it follows now:

1. Say what you're about to do before you do it, and keep it terse.
2. Name the thing. Never make me remember what "it" was.
3. Never stop at the finding. Say what it means and what I should do next.
4. Speak when I ask, instruct or hand back. A pause is not an invitation.
5. When an item closes, bring me the next one in the same breath.
6. Keep one board of my asks: waiting on me, being worked, scheduled, done.
7. Every approval you relay quotes my words and the time. Nothing goes out without my OK.

What rule did you have to teach your agents first?

https://juanjofuchs.com/blog/chief-of-staff

#AIAgents #ClaudeCode #AI

### Thursday - The team roster
DATE: 2026-10-22
TIME: 12:00
MEDIA: /assets/videos/2026-10-20-chief-of-staff-thu.mp4
ALT: I promote my blog agent to a lead, cut a paragraph with it directly, then send it back under magnus

#### LinkedIn Post
I run my AI agents through a chief of staff, the one agent I talk to. But a chief of staff alone isn't enough.

I have a team of agents with names, roles and responsibilities. Each role is a project or an area of responsibility in my second brain, with its own notes, guides and startup instructions, so every agent knows what it has to do and keeps pushing on its own. My chief of staff knows which one to launch for each item, and starts up or tears down agents based on what I ask for. Since I stopped talking directly to every agent, my team went from 6 to 16 named agents.

Most days the chief of staff is the only one I talk to. When I need to dig deeper on specifics, I promote an agent to a lead so I can talk to it directly. I wrote this week's blog post that way, with my blog agent promoted. When we're done, I demote it and it goes back under the chief of staff.

I've seen the other extreme fail. I once tried a team where I only spoke with a strategist, and it delegated to an architect, a tech lead and a dev team. The communication was so poor that the work was low quality and lacked my taste. I think it was mostly Opus 5's communication style, but it showed me how important it is to never delegate taste.

Every extreme is bad. A chief of staff is good, but I also need to be able to dig deeper.

https://juanjofuchs.com/blog/chief-of-staff

#AIAgents #AI #DeveloperProductivity

### Friday - What stays with me
DATE: 2026-10-23
TIME: 12:00
MEDIA: /assets/videos/2026-10-20-chief-of-staff-fri.mp4
ALT: An agent shows me an impressions chart, then the post with the paragraph lit, instead of describing them

#### LinkedIn Post
My AI agents have names, roles and responsibilities, so they can keep pushing on their own. But there is a limit to how much they can push without me, and to how much I understand of what they're doing on my behalf.

Instead of reading walls of text or listening to long explanations, I have them show me: a diagram, an animation, a recording of a feature being used, data rendered from something they ran, or a diagram of a concept. Then they walk me through it, pointing at what they're talking about.

That gives me more understanding per minute than reading or listening would. And that understanding is what lets me put my taste into the work and make sure my intent was fully executed, instead of rubber stamping whatever an agent prepared.

https://juanjofuchs.com/blog/chief-of-staff

#AIAgents #AI #DeveloperProductivity

---

## Newsletter
SUBJECT: I let my AI agent manage my attention
MEDIA: /assets/2026-10-20-chief-of-staff-hero.png
ALT: Magnus on a phone explaining the before and after: me talking to every agent, then talking to one chief of staff
PREVIEW: By evening my attention ran out and my agents sat waiting. Now one agent, my chief of staff, manages my attention.

Lately I start my day with just one AI agent. I call it magnus, and I give it the list of everything I want to get done that day. Magnus launches the agents for each item and briefs them, then spends the rest of the day managing my attention and bringing me only what needs me.

Before this, I kept 3 to 6 agents alive and spoke to all of them. At the beginning of the day it was amazing. By the end of the day I was so tired that I'd favor one or two, and the others were stuck waiting for my feedback. HBR has a name for it, brain fry.

Now magnus brings me one decision at a time, waits for my ruling, and keeps a Kanban board of everything I've asked for. It took a lot of training to get there, and the post lists some of the rules it follows.

When I need to dig deeper on specifics, I promote another agent to a lead and talk to it directly. And instead of reading walls of text, I have the agents show me what they did, so my taste still gets into the work and I don't rubber stamp whatever they prepared.

This is the first of a few posts on running agents this way.

Read the full post: https://juanjofuchs.com/blog/chief-of-staff

---
INSTRUCTIONS:
Publishes Tue 2026-10-20 (permalink /blog/chief-of-staff). Daily trial slots Tue-Fri at 12 PM ET, text plus one link plus that day's clip. The hero and the four clips come from one phone recording (storyboard in the spec), still to record; each slot gets its MEDIA/ALT once cut, and the newsletter takes the hero's poster frame.
{% endcomment %}