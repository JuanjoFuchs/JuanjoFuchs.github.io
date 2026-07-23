---
layout: post
title: "Building Your Second Brain, Part 5: The Capture Loop"
description: "Most Claude + Obsidian setups sort your inbox into folders. The capture loop I use searches what I already wrote before anything gets filed."
date: 2026-07-14 09:00:00 -0400
categories: productivity
tags: [second-brain, obsidian, ai, productivity, gtd]
author: JuanjoFuchs
image: /assets/the-capture-loop-hero.png
series: second-brain
series_order: 5
series_title: "The Capture Loop"
series_blurb: "catching the idea and searching what you already wrote, before anything gets filed."
---

![A man walks a forest trail dictating into his phone while a robot beside him stitches his idea into a web of older notes](/assets/the-capture-loop-hero.png)

{% include series-nav.html %}

Every post in this series so far assumes you already have an idea worth writing about. The spec has to spec something. The editorial loop has to edit something.

This post is the origin story, where the input comes from.

## The Idea Problem

Ideas don't arrive on schedule. They show up in the shower, in the middle of a meeting, while reading something completely unrelated to what you're supposed to be doing. And they leave just as fast. By the time you're back at your desk with a free moment, the idea that felt sharp an hour ago is gone.

Most of my good ideas used to die that way. They weren't bad, I just had nowhere to put them the second they appeared.

So the first job is catching the idea before it evaporates.

## Ubiquitous Capture

My inbox is the daily note. One file per day, named for the date, `2026-07-14.md`, sitting in the vault root. Anything that crosses my mind goes into it the moment it happens, half-formed and badly worded. No structure, no folders, no deciding where it belongs. The only rule is zero friction, because friction is what kills capture.

Most of it gets dictated. I use [Wispr Flow](https://wisprflow.ai/) and just talk, usually while walking, and the text lands in the daily note. The phone runs [GitSync](https://github.com/ViscousPot/GitSync), which commits and pushes the whole vault folder on its own, when I close Obsidian or on a schedule, so a thought I dictate on a trail is already waiting in the repo by the time I sit down and pull.

Dump the whole chain of thought, not just the idea. The conclusion on its own is useless three weeks later, because the reasoning that got me there is exactly what I can't reconstruct. So I ramble. I say why it occurred to me, what it reminded me of, which part I'm unsure about, what it might connect to. It's embarrassing to read back, and it's the most valuable thing in the capture, because months later that ramble is the only record of how I was actually thinking.

The reason this works is background thinking. You catch a rough thought, then you go back to living your life, and your brain keeps chewing on it without you. A few hours later a second piece shows up, then a connection to something you read last week. Those go into the same daily note. The idea gets richer while you're doing the dishes.

This is the one advantage we still have over the models. AI has no shower, no walk, no idle stretch where connections form on their own between unrelated fields. I [wrote a post about that](https://juanjofuchs.github.io/ai/2026/05/05/ai-will-never-have-shower-thoughts-even-if-it-takes-a-shower.html). Capture is how you cash in on it, you offload the remembering to a file so your brain is free to keep making the connections it's actually good at.

By the end of a week the daily notes hold a pile of raw material. Some of it is gold, most of it is noise, and none of it is sorted. That's where the processing comes in, and it's where almost every "second brain" setup I've seen goes wrong.

## The Clarification Standard: What Everyone Else Gets Wrong

I've read a lot of the Claude + Obsidian setups going around. Most process the inbox by sorting: read the items, decide which folder each one belongs in, move it there. Some ship it as a skill, some as a prompt, some as a CLAUDE.md workflow, but the shape is the same: sort the notes, empty the inbox. A few go further and run a real clarify step, asking what the item is before it moves.

Almost none of them search what you already wrote before filing it.

That's the step that changes the outcome, because an idea only means something against what's already in your head. Route an item without checking the destination and you've just relocated the problem. The idea is now sitting in a `someday-maybe` folder, which in GTD is the incubation list for things you might do but aren't committing to now, the one you're supposed to re-read at every weekly review. Skip that review and it's exactly as dead as it was in the daily note, except now it looks handled.

The fix I use is the GTD [two-minute rule](https://gettingthingsdone.com/2020/05/the-two-minute-rule-2/), bent for knowledge work. The original is about doing: if a task takes less than two minutes, do it now instead of tracking it. Mine is about understanding first, before an item leaves the inbox I spend up to two minutes working out what it actually is. Then the original rule still applies on top, if whatever falls out of that takes less than two minutes, I do it right there instead of writing it down for later.

Understanding means three questions, in order:

1. **Does the destination already cover this?** Search the vault first. More of my captures than you'd expect turn out to be a note I already wrote down, sometimes better, months ago. If it's a duplicate, that's a finding, not a failure.
2. **What is this, really?** A next action, a new angle on an existing project, a duplicate, or an open question I can't resolve yet. Naming the type decides where it goes.
3. **Is there a next action to surface?** If the idea implies something to do, that action gets written out explicitly so future-me doesn't have to reconstruct it.

Each type gets a home. A next action goes on the relevant project, a new angle updates the note that already covers it. A duplicate gets merged into the original and deleted, an open question I can't resolve yet becomes its own note that waits for more captures.

The difference shows up fast. Take a real capture of mine, dictated in June: "cognitive debt, technical debt and also taste debt/rot." Sorted the folder way, it lands in `blog-ideas` as a one-liner and sits there forever. Processed with clarification, two minutes of searching turned up something I didn't expect. The vault had plenty to say about cognitive debt, and plenty to say about taste, but the two bodies of work had never touched each other, they only ever met through index pages. The search didn't find the note I was looking for. It proved the note didn't exist, and that the capture was the bridge between two things I'd been circling for months. Those three concept notes got written that same day because the search is what showed they were missing, and [the post](https://juanjofuchs.github.io/ai-development/2026/07/07/taste-debt.html) came out of the gap. The only variable was whether I looked before I filed.

## Git as the Safety Net

Clarification lets me be aggressive about deleting.

Once I've understood an item and found it's a duplicate, or already resolved, or just not worth keeping, I delete it. No `someday-maybe` limbo where ideas go to look busy. I can do that without flinching because the vault is a git repo. Git is the version-control system most engineers use for code: every time you commit, it saves a snapshot of your files, and each commit carries a message where, by convention, you write down why you made the change.

The convention I follow is one idea, one commit. When I process a capture, the commit message records where it went and why, the motivation behind the idea and the decision I made about it. Deleting a duplicate writes down that I found one, with a pointer to the original.

Months later I can ask the history where something went:

```bash
git log -i --grep "taste debt"    # commits whose message mentioned it
git log -S "taste debt"           # commits where the text was introduced or removed
```

The first searches commit messages, and the `-i` matters more than you'd think, without it you miss every commit that capitalised the thing differently. The second is the pickaxe: it finds commits where the *number of occurrences* of the text changed, so I can see the exact moment a note's text was written or deleted, and read the reasoning I left at the time. An idea I killed in March is fully recoverable in July.

Obsidian will keep old versions for you, [File recovery](https://obsidian.md/help/plugins/file-recovery) is on by default and snapshots every few minutes. What a snapshot can't tell you is *why*. It gives you the text back without the thinking, and the thinking is the only part I actually need when I come back months later. The git history is a knowledge layer of its own, every decision I made about every idea is queryable. That's a post of its own (Part 6).

## The Loop Closes

The path, capture to publication:

**Capture** the rough thought in the daily note → **Clarify** it against what already exists → **Route** it to a project, a concept note, or the trash → **Spec** it when it's ready to become a post ([Part 3](https://juanjofuchs.github.io/productivity/2026/03/03/building-your-second-brain-part-3-the-spec-that-wrote-this-post.html)) → **Draft** it → run the **Editorial Loop** ([Part 4](https://juanjofuchs.github.io/productivity/2026/03/17/building-your-second-brain-part-4-the-editorial-loop.html)) → **Publish**.

The taste-debt post traced that exact path. It started as one dictated line in a daily note, got clarified into the bridge between two clusters that had never met, and got routed into three concept notes that didn't exist before the search. It sat there for a few weeks collecting more captures, then became a spec, a draft, and a published post. I can walk back through every step in the git log because each one is a commit.

And then it feeds itself. A published post brings reader replies, a comment that disagrees, a question I didn't answer, my own second thoughts reading it live. Those are new captures. They go back into the daily note, and the loop starts over.

{% comment %}
## LinkedIn Post
MEDIA: /assets/the-capture-loop-hero.png
ALT: A man walks a forest trail dictating into his phone while a robot beside him stitches his idea into a web of older notes

Every Claude + Obsidian setup I've read processes the inbox the same way: read the item, pick a folder, move it. A few go further and ask what the item actually is.

Almost none of them search what you already wrote before filing it.

My capture loop, end to end:

📌 Capture with zero friction. One file per day, named for the date, in the vault root. I dictate into it with Wispr Flow while walking. The phone runs GitSync, which commits and pushes the vault on its own, so a thought from a trail is waiting in the repo before I sit down. I don't have to open anything, file it, or remember to sync.

📌 Dump the chain of thought, not the idea. The conclusion alone is useless three weeks later, the reasoning is the part I can't reconstruct. So I ramble into the phone: why it occurred to me, what it reminded me of, what I'm unsure about. It's embarrassing to read back, and it's the most valuable thing in the capture.

📌 Clarify before routing. The GTD two-minute rule, bent. Original: if it takes under two minutes, do it now. Mine: spend up to two minutes working out what the item actually IS before it leaves the inbox. Three questions: does the destination already cover this (search first), what is it really (next action, new angle, duplicate, open question), and is there a next action to surface. Then the original rule still applies on top, if what falls out takes under two minutes, I do it right there.

📌 Delete aggressively. The vault is a git repo, so deleting is safe. Once I understand an item and it's a duplicate, it goes. One idea, one commit, and the message records where it went and why. `git log -i --grep` finds it months later with the reasoning intact. An idea I killed in March is recoverable in July.

What the search actually buys: one dictated line, "cognitive debt, technical debt and also taste debt/rot." Two minutes of searching turned up that my vault had plenty on cognitive debt and plenty on taste, and the two had never touched. The search didn't find the note I wanted. It proved the note didn't exist, and that the capture was the bridge. Three concept notes and a post came out of that gap.

No idea moves without knowing what already exists where it's going.

Part 5 of the series, tracing one real idea from a dictated daily note to a published post 👇
https://juanjofuchs.github.io/productivity/2026/07/14/building-your-second-brain-part-5-the-capture-loop.html

#SecondBrain #Obsidian #AI #Productivity #GTD

---

## X/Twitter Thread
MEDIA: /assets/the-capture-loop-hero.png
ALT: A man walks a forest trail dictating into his phone while a robot beside him stitches his idea into a web of older notes

Tweet 1 (Hook):
Most Claude + Obsidian setups sort your inbox into folders. A few even ask what the item is. Almost none search what you already wrote before filing it. That's the step that changes the outcome. The capture loop I use instead. 🧠

Tweet 2:
Capture with zero friction: one file per day, dictated with Wispr Flow while walking. GitSync pushes it on its own, so the thought is in the repo before I sit down. Dump the chain of thought, not just the idea, the reasoning is what you can't rebuild later.

Tweet 3:
Clarify before routing: the GTD 2-minute rule, bent. Spend up to 2 min working out what the item IS before it leaves the inbox. Does the destination already cover this? What is it really? Any next action? Then the original rule: if it takes <2 min, just do it.

Tweet 4:
The vault is a git repo, so deleting is safe. Once I understand an item and it's a duplicate, it goes. The commit records where it went and why, and `git log -i --grep` finds it months later. Obsidian keeps your old text; git keeps your reasoning.

Tweet 5:
The loop closes: published posts bring replies, questions, second thoughts. Those are new captures. Full walkthrough, one real idea from daily note to published post:
https://juanjofuchs.github.io/productivity/2026/07/14/building-your-second-brain-part-5-the-capture-loop.html

#SecondBrain #Obsidian

---
INSTRUCTIONS:
- LinkedIn: Post Tuesday-Thursday. URL in post body (the Comments API exists but is gated behind LinkedIn's Community Management partner program, which individual developers can't access). NOTE: the 8-10 AM EST window in the Social Media Promotion Guide is contradicted by 2026 timing data (Sprout: 11 AM-5 PM; Buffer: 3-8 PM, and it rates mornings and Tuesdays as weaker) — worth re-testing before the guide is trusted.
- X/Twitter: Post as thread. Image attached to first tweet. Link only in last tweet.
{% endcomment %}