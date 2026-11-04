---
layout: post
title: "Agents with Jobs, Not Goals"
description: "I haven't needed /goal since my agents got roles and responsibilities. Now I spend more time defining the roles and correcting the routing."
date: 2026-11-03 09:00:00 -0500
categories: ai
tags: [ai, agents, command-bridge, roles]
author: JuanjoFuchs
permalink: /blog/agents-with-jobs
image: /assets/2026-11-03-agents-with-jobs-hero.png
---

<div style="max-width: 540px; margin: 0 auto;">
  <div style="position: relative; padding-bottom: 125%; height: 0; overflow: hidden;">
    <video style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
           autoplay loop muted playsinline
           aria-label="Envelopes leave a to-do list, land in an inbox labelled Chief of staff, and go to the role that owns them, where a dotted ring fills. Each turns into a document, chart, container, program or log in a list of finished work."
           poster="/assets/2026-11-03-agents-with-jobs-hero.png">
      <source src="/assets/videos/2026-11-03-agents-with-jobs-hero.mp4" type="video/mp4">
    </video>
  </div>
</div>

## I stopped using /goal

I haven't needed `/goal` since I gave my agents roles and responsibilities. The team I introduced in [The Chief of Staff](https://juanjofuchs.com/blog/chief-of-staff) can keep pushing on those responsibilities without me having to tell each agent what to do next.

In Claude Code, [`/goal` takes a condition you want satisfied](https://code.claude.com/docs/en/goal). A model checks after each turn whether that condition holds, and when it does, the goal clears. The agent has finished what you asked it to do.

A role continues after a goal is met. I can resume an agent and it figures out goals within its responsibilities, then keeps pushing on them.

For this post, I told my chief of staff I needed help getting started. It knew which agent to start, and that agent knew exactly where to look: my reflections, my backlog, and what I'd already published. It came back with three topics. That's beyond a goal, which is great.

## Defining the roles

My work now is deciding what each agent should be responsible for. Each time AI takes over the work at one level, I move up to the next one, which I wrote about in [Claude Just Gave You a Dry Promotion](https://juanjofuchs.com/blog/dry-promotion). This level looks a lot like managing engineers: you define the role, delegate the work and correct it, which is why [engineering managers are naturally great at AI](https://juanjofuchs.com/blog/managers-and-ai). When my chief of staff's to-do column filled up with work that wasn't its job, I asked it, "Why do you have so many to dos?" We ended up creating a few new roles to take that work over.

Most of my agents could do most of this work, so when I assign a task I'm not only assigning it, I'm also shaping the roles. Sending a task to the agent that owns it teaches the team what each agent should do and what it shouldn't do.

I caught myself giving work to the wrong agent and told my chief of staff, "I need you to keep me honest on who I assign stuff to based on the Agent Roster." Three minutes later it had updated its operating procedure, so it now checks me before I make that mistake again. When I correct an agent, I expect that correction to go into its operating procedure or the corresponding guide.

## Keeping the roles in order

I keep correcting these assignments so future tasks can route automatically. If I don't keep the roles in order, it gets messy fast.

In [AI Accelerates Whatever You Have](https://juanjofuchs.com/blog/ai-accelerates), I wrote that maintaining order requires energy, that's the second law of thermodynamics. With an agent team, most of that energy goes into keeping the roles and responsibilities clear. If I stop, every new agent is one more place for work to land in the wrong hands, and the entropy accelerates.

AI accelerates whatever you have, so I want the benefits of clear roles to compound too. A correction written into a procedure gives the chief of staff a rule to use on future assignments, so I don't have to make the same routing decision again. Each correction adds to the previous ones, and the agents use that accumulated guidance to route work to the role responsible for it.

[Command Bridge](https://github.com/JuanjoFuchs/command-bridge), the tool I built to talk to my agents by voice, keeps every turn in a local log, so I can go back over what I said to them. My chief of staff's operating procedure includes inspecting the last seven days of those turns against the board of everything I've asked for, so none of my asks get neglected.

## Start with your sessions

I used to run 3 to 6 agents at once and struggled to keep them all busy. Now the roster has 23 agents with defined roles and responsibilities, and it's still growing.

My first roster started from a week of conversations with my agents, 2,119 messages. The recurring work was already there in what I'd been asking them to do. Your session logs hold that record too, so I'd recommend auditing them for what keeps happening and creating roles around that.

{% comment %}
KIT_SENT: 2026-11-03T19:45:51Z
## Social Campaign
CAMPAIGN: agents-with-jobs_20261103
TIMEZONE: America/New_York
NOTE: Daily slots Tue-Fri at 4 PM ET, weeks 3-4 of the trial (JJ, 11-02 12:36: "If that's part of the test, yes, let's change it."), text plus one link to the blog. Each day has its own media (JJ, 11-02 14:18: "from Wednesday forward use those different moments."): Tuesday the full hero, Wednesday and Thursday clips from it, Friday its last frame.

### Tuesday - Launch
DATE: 2026-11-03
TIME: 16:00
MEDIA: /assets/videos/2026-11-03-agents-with-jobs-hero.mp4
ALT: Envelopes leave a to-do list, land in an inbox labelled Chief of staff, and go to the role that owns them, where a dotted ring fills. Each becomes a document, chart, container, program or log.

#### LinkedIn Post
PUBLISHED: 2026-11-03T19:45:45.652Z

I haven't needed /goal since my agents got roles and responsibilities.

In Claude Code, /goal takes a condition you want satisfied. A model checks after each turn whether that condition holds, and when it does, the goal clears. The agent has finished what you asked it to do.

A role continues after a goal is met. I can resume an agent and it figures out goals within its responsibilities, then keeps pushing on them.

This post is an example. I told my chief of staff, the one agent I talk to, that I needed help getting started on it. It knew which agent to start, and that agent knew exactly where to look: my reflections, my backlog, and what I'd already published. It came back with three topics. I didn't have to tell either of them where to look or what to do next.

That's beyond a goal, which is great.

Agents with Jobs, Not Goals: https://juanjofuchs.com/blog/agents-with-jobs

#AIAgents #ClaudeCode #AI #DeveloperProductivity

#### X/Twitter Thread
PUBLISHED: 2026-11-03T19:45:49.734Z

Tweet 1:
I haven't needed /goal in Claude Code since my AI agents got roles and responsibilities.

Tweet 2:
In Claude Code, /goal takes a condition, a model checks after each turn whether it holds, and when it does the goal clears. A role continues after that: I resume an agent and it figures out its own goals within its responsibilities.

Tweet 3:
I told my AI chief of staff I needed help starting a blog post. It knew which agent to start, and that agent knew where to look: my reflections, my backlog, and what I'd already published. It came back with three topics.

Tweet 4:
Agents with Jobs, Not Goals: https://juanjofuchs.com/blog/agents-with-jobs

#AIAgents #ClaudeCode

### Wednesday - Defining the roles
DATE: 2026-11-04
TIME: 16:00
MEDIA: /assets/videos/2026-11-03-agents-with-jobs-wed.mp4
ALT: A list of tasks moves up one at a time into an inbox labelled Chief of staff, which sends each to the role that owns it.

#### LinkedIn Post
PUBLISHED: 2026-11-04T21:01:41.909Z

My work now is deciding what each of my 23 AI agents should be responsible for.

Each time AI takes over the work at one level, I move up to the next one. This level looks a lot like managing engineers: you define the role, delegate the work and correct it.

When my chief of staff's to-do column filled up with work that wasn't its job, I asked it, "Why do you have so many to dos?" We ended up creating a few new roles to take that work over.

Most of my agents could do most of this work, so when I assign a task I'm not only assigning it, I'm also shaping the roles. Sending a task to the agent that owns it teaches the team what each agent should do and what it shouldn't do.

I make the mistake too. I caught myself giving work to the wrong agent and told my chief of staff, "I need you to keep me honest on who I assign stuff to based on the Agent Roster." Three minutes later it had updated its operating procedure, the note it reads when it starts up, so it now checks me before I make that mistake again.

When I correct an agent, I expect that correction to go into its operating procedure or the corresponding guide.

https://juanjofuchs.com/blog/agents-with-jobs

#AIAgents #AI #EngineeringManagement

#### X/Twitter Thread
PUBLISHED: 2026-11-04T21:01:46.522Z

Tweet 1:
My work now is deciding what each of my 23 AI agents should be responsible for. It looks a lot like managing engineers: define the role, delegate the work and correct it.

Tweet 2:
Most of my AI agents could do most of the work. So when I assign a task I'm also shaping the roles: sending it to the agent that owns it teaches the team what each agent should and shouldn't do.

Tweet 3:
I told my AI chief of staff, "I need you to keep me honest on who I assign stuff to based on the Agent Roster." Three minutes later it had updated its operating procedure, so it now checks me first.

Tweet 4:
Agents with Jobs, Not Goals: https://juanjofuchs.com/blog/agents-with-jobs

#AIAgents #ClaudeCode

### Thursday - Why it compounds
DATE: 2026-11-05
TIME: 16:00
MEDIA: /assets/videos/2026-11-03-agents-with-jobs-thu.mp4
ALT: Several roles work at once, each dotted ring filling at its own pace, while finished files land in a list on the right.

#### LinkedIn Post
Every new AI agent is one more place for work to land in the wrong hands.

I run a team of 23 agents, each with a role. I keep correcting who gets what so that future tasks can route automatically. If I don't keep the roles in order, it gets messy fast.

Maintaining order requires energy, that's the second law of thermodynamics. With an agent team, most of that energy goes into keeping the roles and responsibilities clear. If I stop, the entropy accelerates.

AI accelerates whatever you have, so I want the benefits of clear roles to compound too. A correction written into a procedure gives my chief of staff a rule to use on future assignments, so I don't have to make the same routing decision again. Each correction adds to the previous ones, and the agents use that guidance to route work to the role responsible for it.

Keeping the record helps. Command Bridge, the tool I built to talk to my agents by voice, keeps every turn in a local log. My chief of staff's operating procedure includes inspecting the last seven days of those turns against the board of everything I've asked for, so none of my asks get neglected.

How are you keeping your agents' work from getting messy?

https://juanjofuchs.com/blog/agents-with-jobs

#AIAgents #ClaudeCode #AI

#### X/Twitter Thread
Tweet 1:
Every new AI agent is one more place for work to land in the wrong hands. Maintaining order requires energy, and with an agent team most of that energy goes into keeping roles and responsibilities clear.

Tweet 2:
AI accelerates whatever you have, so I want the benefits of clear agent roles to compound too. A correction written into a procedure is a routing decision I don't have to make again.

Tweet 3:
My AI chief of staff inspects the last seven days of my voice turns against the board of everything I've asked for, so none of my asks get neglected. Command Bridge keeps every turn in a local log.

Tweet 4:
Agents with Jobs, Not Goals: https://juanjofuchs.com/blog/agents-with-jobs

#AIAgents #ClaudeCode

### Friday - Start with your sessions
DATE: 2026-11-06
TIME: 16:00
MEDIA: /assets/2026-11-03-agents-with-jobs-hero.png
ALT: The last frame of the animation: an inbox labelled Chief of staff, six role names above dotted rings, and a list of finished work such as tuesday-post.md.

#### LinkedIn Post
I built my first team of AI agents from messages I'd already sent.

I used to run 3 to 6 agents at once and struggled to keep them all busy. Now my roster has 23 agents with defined roles and responsibilities, and it's still growing.

That roster started from a week of conversations with my agents. The recurring work was already there in what I'd been asking them to do.

Your session logs hold that record too. If you want to try this, audit them for what keeps happening and create roles around that. Then, when you correct an agent, put the correction in the note it reads when it starts up, so the role gets better every time you use it.

Agents with Jobs, Not Goals: https://juanjofuchs.com/blog/agents-with-jobs

#AIAgents #ClaudeCode #AI #DeveloperProductivity

#### X/Twitter Thread
Tweet 1:
I built my first team of AI agents from messages I'd already sent. The recurring work was already there in what I'd been asking them to do.

Tweet 2:
I used to run 3 to 6 AI agents at once and struggled to keep them all busy. Now my roster has 23 agents with defined roles and responsibilities, and it's still growing.

Tweet 3:
Your AI session logs already hold your team's roles. Audit them for what keeps happening and create roles around that.

Tweet 4:
Agents with Jobs, Not Goals: https://juanjofuchs.com/blog/agents-with-jobs

#AIAgents #ClaudeCode

---

## Newsletter
SUBJECT: I stopped using /goal
PREVIEW: My agents have roles and responsibilities now, so they keep pushing after a goal would have ended.
MEDIA: /assets/2026-11-03-agents-with-jobs-hero.png
ALT: The last frame of the animation: an inbox labelled Chief of staff, six role names above dotted rings, and a list of finished work such as tuesday-post.md.

I haven't needed /goal since I gave my agents roles and responsibilities. In Claude Code, /goal takes a condition you want satisfied, and when a model confirms it holds, the goal clears. A role continues after that. I can resume an agent and it figures out goals within its responsibilities, then keeps pushing on them.

For this week's post, I told my chief of staff I needed help getting started. It knew which agent to start, and that agent knew exactly where to look: my reflections, my backlog, and what I'd already published. It came back with three topics.

My work now is deciding what each agent should be responsible for. It looks a lot like managing engineers: you define the role, delegate the work and correct it. Most of my agents could do most of this work, so every assignment also shapes the roles. When I correct an agent, I expect that correction to go into its operating procedure or the corresponding guide.

I keep at it so future tasks can route automatically. Maintaining order requires energy, and if I stop, every new agent is one more place for work to land in the wrong hands. AI accelerates whatever you have, so I want the benefits of clear roles to compound too.

I used to run 3 to 6 agents at once and struggled to keep them all busy. Now the roster has 23. My first roster started from a week of conversations with my agents, 2,119 messages. Your session logs hold that record too, so I'd recommend auditing them for what keeps happening and creating roles around that.

Read the full post: https://juanjofuchs.com/blog/agents-with-jobs

---
INSTRUCTIONS:
Publishes Tue 2026-11-03, permalink /blog/agents-with-jobs. Slots Tue-Fri at 4 PM ET, text plus one link to the blog and that day's media. The video and PNG come from the approved hero animation. The 11/5 slot falls on his Not So Boring AI demo day.
{% endcomment %}