---
layout: post
title: "Teaching Your Second Brain to Dream"
description: "What sleep does to memory, and how I give my second brain a nightly pass for connections and improvements I review in the morning."
date: 2026-10-06 09:00:00 -0400
categories: [ai, second-brain, obsidian]
tags: [second-brain, dreaming, memory, ai]
author: JuanjoFuchs
permalink: /blog/teaching-your-second-brain-to-dream
image: /assets/teaching-your-second-brain-to-dream-hero.png
series: second-brain
series_order: 8
series_title: "Teaching Your Second Brain to Dream"
series_blurb: "giving my second brain time overnight to connect notes and propose improvements for me to review in the morning."
---

![A robot lies on a charging cradle in a dark server room, an emerald network shaped like a brain floating above its head](/assets/teaching-your-second-brain-to-dream-hero.png)

{% include series-nav.html %}

## A second brain that improves overnight

I want to give my second brain the ability to dream, to improve itself while I'm asleep. If it only stores what I give it, I still have to do all the maintenance. It spends the night making connections between notes and reviewing the day's work for lessons worth keeping.

Finding [connections among existing notes](https://juanjofuchs.com/blog/recall) helps me bring earlier thinking into a new problem. The [capture loop](https://juanjofuchs.com/blog/second-brain-5) searches what I've already written and connects a new idea when it arrives. A nightly pass looks for connections among notes that nothing new has touched.

## What sleep does to memory

Revisiting the day's work helps my second brain keep lessons for later. During deep sleep, the brain [replays the day's memories and moves them](https://europepmc.org/abstract/MED/20046194) from the hippocampus, where they land first, to the cortex, where they're stored for the long term. When researchers [blocked that replay in rats](https://europepmc.org/abstract/MED/19749750), the rats remembered less. The replay also [helps turn memories of individual events into more general patterns](https://europepmc.org/abstract/MED/37023710), and [fits new memories into existing ones](https://europepmc.org/abstract/MED/23354387).

I look for redundant notes to prune, taking inspiration from how sleep turns connections down. A day of learning strengthens connections across the brain, and one theory holds that sleep [scales them back down](https://europepmc.org/abstract/MED/24411729) so the brain can keep learning. In [one study in mice](https://europepmc.org/abstract/MED/28154076), synaptic contact areas were about 18% smaller after sleep, with the largest synapses spared. Most of the connections they measured shrank by about the same proportion. [Another](https://europepmc.org/abstract/MED/28092659) found that REM sleep pruned some newly formed connections and kept others, again in mice.

The nightly pass also looks for connections between notes. In [one experiment](https://europepmc.org/abstract/MED/14737168), more than twice as many people discovered a hidden rule in a task after a night of sleep. REM sleep has also been found to [help combine information that wasn't associated before](https://europepmc.org/abstract/MED/19506253). Replaying related memories [appears to strengthen what they have in common](https://europepmc.org/abstract/MED/21764357).

## Keeping time for my mind to wander

I want AI to handle the operational work while I keep incubation. In my post about [why AI can't have shower thoughts](https://juanjofuchs.com/blog/shower-thoughts), I described how my ideas come while I'm away from a problem. That's my brain's [default mode network](https://europepmc.org/abstract/MED/19433790), and it's active when my mind wanders.

Incubation isn't only sleep. Stepping away from a problem [helps most with open-ended problems I've already put real effort into](https://europepmc.org/abstract/MED/19210055), and a light task during the break can help more than rest. In [one study](https://europepmc.org/abstract/MED/22941876), people who did an undemanding task between attempts got much better at problems they'd seen before, and the gain tracked how much their minds wandered.

With my second brain able to dream, I want it to give me connections to review in the morning, so those connections give me something to think about while my mind wanders, helping me come up with new ideas.

## Reviewing agent memory changes

[Anthropic launched a Dreaming feature](https://platform.claude.com/docs/en/managed-agents/dreams) that reads saved memory and past conversations, then writes a new, reorganized copy of that memory. It can merge duplicates, replace stale or contradicted entries, and surface insights. The original stays intact, so a person can review the new copy or discard it.

[Microsoft's SkillOpt-Sleep](https://github.com/microsoft/SkillOpt/blob/main/docs/sleep/README.md) also implements a way for a person to approve the changes an agent proposes during sleep. It reviews records of agent sessions and proposes updates to the agent's instructions.

[Letta's dreaming](https://docs.letta.com/guides/agents/architectures/sleeptime) changes memory directly, with an optional review by the agent itself before applying changes. The [obsidian-second-brain project](https://github.com/eugeniughelbur/obsidian-second-brain) lets its nightly agent edit notes without waiting for a person to approve each write.

I want proposed rewrites of my notes and instructions to wait for my review.

## The risk of rewriting memory unattended

When an AI rewrites its memory, it writes a new summary, and the next rewrite summarizes that summary. [Research on this](https://dylanzsz.github.io/faulty-memory/) found that after many rounds, the memory drifted toward what the model expected a good lesson to sound like, away from what actually happened. In one small test, a model that could solve a set of puzzles with no memory at all failed more than half of them once its memory had been rewritten again and again from the correct solutions. Keeping the original records, unchanged, did as well as or better than every rewriting approach tested.

Memory can also be poisoned. In [an attack called MemGhost](https://thehackernews.com/2026/07/new-memghost-attack-plants-persistent.html), a single email with hidden instructions got AI agents to write false memories into their own long-term memory. If something like that ends up in my notes or session logs, a nightly pass could follow those instructions.

I want to accumulate improvements alongside the original records, keeping [earlier versions I can return to](https://juanjofuchs.com/blog/second-brain-6).

## The three passes my second brain runs while dreaming

First, **a link pass** makes sure the notes are properly linked. If a note already names a concept, this pass turns that mention into a wikilink. I keep it deterministic and narrow, using exact multi-word mentions and leaving the wording alone. Those links apply automatically.

Second, **a connection pass** looks for connections between notes, the way sleep helps link memories. It picks notes at random, reads them together, and checks whether there's a relationship between them that makes sense. Picking at random reaches notes I haven't opened in months, the ones no search of mine would bring up because nothing I'm working on points to them. The connection I'm hoping for is the kind I described in [Recall](https://juanjofuchs.com/blog/recall): two notes written in different situations, about different things, that turn out to be [connected somehow](https://juanjofuchs.com/blog/taste-debt). Near-certain connections apply automatically, the uncertain ones wait for my review, and the rest are dropped.

Third, **a [Kaizen](https://en.wikipedia.org/wiki/Kaizen) pass**, for continuous improvement, reviews the day's session logs, the transcripts of my conversations with agents. It proposes updates to my guides ([I keep guides instead of skills in my second brain](https://juanjofuchs.com/blog/atref)). A correction from today's session can become a lasting instruction in a guide, which is how I move lessons into long-term memory. Those changes wait for my review alongside the uncertain connections, with the session evidence attached.

I keep a ledger, a log of every link decision, so a rejected link doesn't come back as a new suggestion the next night. It records the notes involved, the reason for the link, and whether it was applied, held for review, or rejected.

## Opening the second brain in the morning

In the morning I have the uncertain connections and guide changes waiting in my inbox, with automatic links already recorded. I review each proposal against the notes and quoted session logs. I don't want to [approve a change just because the output looks fine](https://juanjofuchs.com/blog/taste-debt), without reading what changed.

I review and approve pruning duplicate guides and redundant material, inspired by sleep turning connections down. But before approving a removal, I carefully read what would disappear, with the earlier version kept in [the history](https://juanjofuchs.com/blog/second-brain-6).

Sometimes I see a connection between two of my notes that I didn't know was possible. I read them together, see whether it makes sense, and, maybe, that triggers a new idea in my first brain.

{% comment %}
## LinkedIn Post
MEDIA: /assets/teaching-your-second-brain-to-dream-social.png
ALT: A robot on a charging cradle under an emerald brain of connected dots, titled "Teaching Your Second Brain to Dream"

I want to give my second brain the ability to dream, to improve itself while I'm asleep. If it only stores what I give it, all the maintenance is still on me, and the notes I wrote months ago never get another look unless I go searching for them.

Sleep turned out to be a good model for that. While I sleep, my first brain replays the day, moves what matters into long-term memory, turns down the connections it doesn't need, and links memories that belong together. I borrowed those ideas for my vault.

So every night my second brain does three things while dreaming:

- First, a link pass makes sure my notes are properly linked. Wherever a note already mentions a concept, it turns that mention into a link my agents can follow later. It only touches exact matches and never changes my wording, so those links are applied automatically.
- Second, a connection pass picks notes at random, including ones I haven't opened in months, and looks for relationships that make sense. Near-certain connections apply automatically, and the uncertain ones wait for my review.
- Third, a Kaizen pass, named after the practice of continuous improvement, reads the day's conversations with my agents and proposes updates to my guides and skills. A correction I made today becomes a lasting instruction tomorrow.

The next morning, the uncertain connections, the guide changes, and the duplicates it wants to prune are waiting for me, each next to the notes and session logs behind it.

Sometimes there's a connection between two notes I didn't know was possible, and this makes me think. I want AI to handle the operational work while I keep the thinking that happens when my mind wanders, and a connection like that gives that thinking something to work with. Maybe it triggers a new idea in my first brain.

Teaching Your Second Brain to Dream: https://juanjofuchs.com/blog/teaching-your-second-brain-to-dream

#SecondBrain #Obsidian #AI #KnowledgeManagement

---

## X/Twitter Thread
MEDIA: /assets/teaching-your-second-brain-to-dream-social.png
ALT: A robot on a charging cradle under an emerald brain of connected dots, titled "Teaching Your Second Brain to Dream"

Tweet 1:
I want my second brain to dream, to improve itself while I'm asleep. If it only stores what I give it, all the maintenance is on me, and the notes I wrote months ago never get another look.

Tweet 2:
While I sleep, my first brain replays the day, moves what matters into long-term memory, turns down the connections it doesn't need, and links memories that belong together. I borrowed those ideas for my vault.

Tweet 3:
Every night a link pass makes sure my notes are properly linked. Wherever a note mentions a concept that has its own note, it turns that mention into a link my agents can follow. Exact matches only, and my wording never changes.

Tweet 4:
Then a connection pass picks notes at random, including ones I haven't opened in months, and looks for relationships that make sense. Near-certain connections apply automatically, and the uncertain ones wait for my review.

Tweet 5:
A Kaizen pass, named after the practice of continuous improvement, reads the day's conversations with my agents and proposes updates to the instruction notes they follow. A correction I made today becomes a lasting instruction tomorrow.

Tweet 6:
In the morning there's sometimes a connection between two notes I didn't know was possible, and it gives my mind something to wander with. Maybe it triggers a new idea in my first brain.

https://juanjofuchs.com/blog/teaching-your-second-brain-to-dream

#SecondBrain #AI

---

## Newsletter
SUBJECT: A way to find connections in your old notes
PREVIEW: How my second brain connects old notes overnight and brings proposed changes back for review in the morning.
MEDIA: /assets/teaching-your-second-brain-to-dream-hero.png
ALT: A robot lies on a charging cradle in a dark server room, an emerald network shaped like a brain floating above its head

I want to give my second brain the ability to dream, to improve itself while I'm asleep. If it only stores what I give it, all the maintenance is still on me, and the notes I wrote months ago never get another look unless I go searching for them.

Sleep turned out to be a good model for that. While I sleep, my first brain replays the day, moves what matters into long-term memory, turns down the connections it doesn't need, and links memories that belong together. I borrowed those ideas for my vault.

So every night my second brain does three things while dreaming. First, a link pass makes sure my notes are properly linked. Wherever a note already mentions a concept that has its own note, it turns that mention into a link my agents can follow later. It only touches exact matches and never changes my wording, so those links are applied automatically.

Second, a connection pass picks notes at random, including ones I haven't opened in months, and looks for relationships that make sense. It's looking for the kind of connection that once turned my notes on taste and my notes on technical debt into a post: two notes written in different situations that turn out to be about the same idea. Near-certain connections apply automatically, and the uncertain ones wait for my review.

Third, a Kaizen pass, named after the practice of continuous improvement, reads the day's conversations with my agents and proposes updates to my guides, the instruction notes my agents follow. A correction I made today becomes a lasting instruction tomorrow.

Only the safest changes apply on their own. When an AI rewrites its own memory again and again, it drifts toward what it already expects, so I keep the original records and every proposed rewrite waits for my review.

The next morning, the uncertain connections, the guide changes, and the duplicates it wants to prune are waiting for me, each next to the notes and session logs behind it.

Sometimes there's a connection between two notes I didn't know was possible, and this makes me think. I want AI to handle the operational work while I keep the thinking that happens when my mind wanders, and a connection like that gives that thinking something to work with. Maybe it triggers a new idea in my first brain.

Read the full post: https://juanjofuchs.com/blog/teaching-your-second-brain-to-dream

---
INSTRUCTIONS:
Publishes with the post on Tue 2026-10-06. LinkedIn and X use the titled social card; the newsletter uses the clean hero.
{% endcomment %}