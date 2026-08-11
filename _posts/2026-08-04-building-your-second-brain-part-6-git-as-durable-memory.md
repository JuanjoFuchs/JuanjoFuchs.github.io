---
layout: post
title: "Building Your Second Brain, Part 6: Git as Durable Memory"
description: "My agent writes down what it understood me to mean. The verbatim prompt in the commit message is the only record of what I actually said."
date: 2026-08-04 09:00:00 -0400
categories: productivity
tags: [second-brain, git, obsidian, ai, productivity]
author: JuanjoFuchs
image: /assets/part-6-git-durable-memory-hero.png
series: second-brain
series_order: 6
series_title: "Git as Durable Memory"
series_blurb: "the commit message as the record of why a note changed, and the words that changed it."
redirect_from: /blog/second-brain-6
---

![A robot seen from behind draws one index card from rows of cards hung on glowing emerald cords in a dark archive](/assets/part-6-git-durable-memory-hero.png)

{% include series-nav.html %}

A few days ago I couldn't remember what made me add a Prompt field to my commit messages.

It's my own rule, written in my own guide, and it's the format every substantive commit has used since. I knew what the field does and why it's there. What I'd lost was the incident behind it, the specific problem that made me stop and change the format.

So I asked the log:

```bash
git log --oneline -S "Prompt:" -- "Git Commit Guide.md"
```

```
45944fd Rule that dictated prompts get annotated, never rewritten
4b4e72f Add Prompt field to commit format to preserve user intent verbatim
```

`4b4e72f` is from May 12th, 81 days before the day I ran that query, and it answered me in the sentences I typed at the time. [Part 5 of this series](https://juanjofuchs.github.io/productivity/2026/07/14/building-your-second-brain-part-5-the-capture-loop.html) ended on the line that the git history is a knowledge layer of its own, every decision I made about every idea queryable, and that it deserved a post. This is that post.

It could only answer that way because of what's sitting in it. Strip the Prompt field out and the same query still finds the same commit, and what comes back is Claude's account of what I meant that morning, written by Claude, approved by me, and by then the only version anyone has. That's what a git history holds by default. Mine held exactly that for its first 450-odd commits, and I'd bet yours is holding it now.

## The Log Holds a Different Record Than the Notes

My vault is a folder of markdown notes in a git repo. The phone pushes it, my agent commits to it, and I review the diffs before anything lands. So the history exists. The question is what's in it.

Git stores the files, and the commit message stores an account of why they changed. In an agent workflow that account gets written by the agent. I read it, approve it, and move on. Six months later it's the only record of the decision, and every sentence in it is Claude's version of what I said.

That's memory rot, and it's quiet while it's happening. Each commit body is a reasonable summary. Nothing is wrong on the day. The loss shows up when a future agent reads the log to understand a decision and gets an interpretation of an interpretation.

Dylan Zhang measured what that costs. In his paper [Useful Memories Become Faulty When Continuously Updated by LLMs](https://dylanzsz.github.io/faulty-memory/), GPT-5.4 solves problems from the ARC-AGI reasoning benchmark at 100%, then consolidates what it learned into memory using the ground-truth solutions to those exact problems, and drops to 54%. Every input was correct. The rewriting is what corrupted it. His design rule is the one I care about: "Raw episodes are first-class evidence, not material to be compressed away."

The fix is one field. Put the verbatim prompt in the commit body, above the reasoning, so my words sit on top and the agent's account sits underneath and both survive. The notes hold the content, the log holds why the content changed and the words that changed it.

## What Goes in the Commit

The format:

```
Short summary of the change (imperative mood)

Prompt: "Verbatim prompt(s) that initiated this work."

Motivation: What was wrong, missing, or insufficient.
Decision: What we chose to do about it.
Why: The reasoning behind that choice.
```

Prompt goes first because it's the only tier-1 record. Motivation, Decision and Why are useful and they're an interpretation, so they sit below the thing they're interpreting. When the two seem to diverge, the Prompt wins.

The label drifts depending on how the words arrived, my last few commits say `Prompt (spoken, live over the voice tunnel, across three rounds):` and `Prompt (spoken, live from the car):`, which is provenance I want and didn't plan for. The position is the part that's fixed.

I quote the prompts that carried a judgment, where I set a criterion, made a trade-off, or picked a direction. I skip the "ok do it" and "looks good" turns, there's no judgment in them. Two or three prompts usually cover a session.

I dictate most of my prompts and the transcription mangles names. "clot code" for Claude Code, "dash dash bear" for `--bare`. Those get a bracketed gloss and the original stays put:

```
Prompt: "help me document how to invoke clot code [Claude Code]
        programmatically from outside of clot code, like from Codex"
```

The gloss never replaces the original. A dictation error is mechanical and visibly wrong, nobody is fooled by "dash dash bear". An LLM's correction is fluent and invisible and it reads as authoritative, so the evidence of a misunderstanding is exactly what gets polished away. Clean up the field and it becomes Claude's output, which kills the only reason it's there.

I don't commit every change. I commit at the end of a session, in logical units, one coherent change per commit. If I'd write two different Motivation paragraphs for two sets of edits, that's two commits. When I forget to commit at all, I use `sb`, a small CLI in the vault that wraps git and the Claude Code session logs behind one command. `sb sessions` and `sb prompts` read those logs back and return what I actually typed, so the commit can still carry the real words.

## Why the Commit and Not the Session Log

Claude Code keeps session logs, and they hold prompts verbatim, so the raw words already exist somewhere. Those files belong to Claude Code. They live in its directory, under its retention policy, with a default I didn't choose and a setting I can change but don't own. The vault and its git log are mine.

That's why the prompt goes in the commit body instead of staying a pointer to a session file. The record has to live in the thing I own, in a format I chose, next to the change it explains, and it has to still be there when the tool that produced it isn't the tool I use anymore.

The May 12th commit, trimmed:

```
Add Prompt field to commit format to preserve user intent verbatim

Prompt: "When I use the term 'raw fallback,' I am referring to the
        prompts that I am sending to the AI agent with my judgment and
        my criteria... The only things that are truly raw are my prompts."
        "I think we need to keep some sort of verbatim copy of my prompt,
        regardless of how long the session is or how many terms we do
        before committing..."

Motivation: ...every paragraph in the body is Claude's distillation of
what I asked for, even when I approve it...

Why: This is the Faulty Memory paper applied to my vault...
```

The two quoted fragments are what I actually said. The Motivation and the Why underneath are Claude's account of the same conversation, useful and one interpretive layer removed from it. The second fragment is the rule in one sentence, keep a verbatim copy regardless of how long the session is.

## You Don't Have to Learn Git

My agents write every commit message in the vault, and they're expert git users. `bisect`, `blame` and the pickaxe are arcane enough that most of the people who'd get value out of a queryable history never learned them, and that barrier is gone. You describe what you're looking for and the agent runs the plumbing.

So the history was already there. Every change to every note, with a message explaining it, and several ways to query it. What was missing was that the message held the agent's account of my thinking, and the Prompt field is what closed that.

The commands, for anyone who wants to run them by hand:

```bash
git log --oneline -i --grep "memory rot"            # commits whose message mentioned it
git log --oneline -S "Prompt:" -- "Git Commit Guide.md"  # where that exact text was added or removed
git blame "Git Commit Guide.md"                     # which commit put this line here
git log --oneline --follow -- "Git Commit Guide.md"  # the file's history, across renames
```

`--grep` searches commit messages, and the `-i` matters more than you'd think, without it you miss every commit that capitalised the thing differently. `-S` is the pickaxe, it finds commits where the *number of occurrences* of a string changed, so it lands on the moment text was written or deleted. `blame` gives you a hash per line and `git show <hash>` turns that hash back into the Prompt and the reasoning.

What I actually run is a wrapper:

```bash
sb log "memory rot"
```

```
# Read the Prompt field first — it's JJ's words (ground truth); Motivation/Decision/Why is the agent's interpretation.

2000c9b Capture the Part 6 interview: the spine, one agent's error, and the hero concept
2700627 Add SkillOpt + Algorithmic Monocultures articles and linguistic relativity concept
bcc6dac Add self-improving-agents-without-memory-rot synthesis note + second-brain seed
```

`sb log` wraps `git log --grep`. It finds the commits and it also tells whatever is reading them which part of the message is mine and which part is Claude's, so the ordering rule from the guide travels with the results.

That's what makes keeping the history worth anything. A log I can't interrogate is an archive I never open, and that's what git was for anyone who never learned the plumbing. Now I ask in English and get an answer.

## What It Costs

Storing the prompt costs one field in a commit message, plus the discipline to paste in what I typed instead of what we agreed it meant afterwards. Everything else was already there, the vault was already a git repo, my agent was already writing the commit messages, I was already reviewing the diffs before anything landed.

Eighty-some days isn't long. I've got commits in there from February and I'll be reading them next year, and by then I'll have forgotten a lot more than one commit rule.

{% comment %}
## LinkedIn Post
PUBLISHED: 2026-08-04T13:21:04.967Z

MEDIA: /assets/part-6-git-durable-memory-hero.png
ALT: A robot seen from behind draws one index card from rows of cards hung on glowing emerald cords in a dark archive

I couldn't remember what made me add a Prompt field to my commit messages. I knew what the field does and why it's there, what I'd lost was the incident behind it. One query answered it, in my own words, 80-some days later.

My second brain is in git, so I assumed I had the history of every note. What my repo actually stored about WHY things changed was my agent's account of my thinking, written by the agent, approved by me on a day when it looked fine.

📌 The commit body is a distillation. Motivation, Decision, Why are useful paragraphs and every one of them is Claude's version of what I asked for, even when I approve it. Six months later that's the only record of the decision.

📌 The fix is one field. Prompt, verbatim, above everything the agent wrote. My words on top, the interpretation underneath, both preserved. Dictated ones get a bracketed gloss and never a silent correction, "clot code [Claude Code]".

Dylan Zhang measured the cost: GPT-5.4 solves ARC-AGI at 100%, then drops to 54% after consolidating the ground-truth solutions into memory, with every input correct and the rewriting doing the damage.

My agents write every commit message and they're expert git users, so I already had full history of every change. Blame, bisect, the pickaxe, I don't type any of them. What was missing was memory rot, and the Prompt field is what closed it.

Building Your Second Brain, Part 6: Git as Durable Memory, on what my git log actually stores 👇
https://juanjofuchs.github.io/productivity/2026/08/04/building-your-second-brain-part-6-git-as-durable-memory.html

#SecondBrain #Obsidian #AI #Git #Productivity

---

## X/Twitter Thread
PUBLISHED: 2026-08-04T13:21:06.237Z

MEDIA: /assets/part-6-git-durable-memory-hero.png
ALT: A robot seen from behind draws one index card from rows of cards hung on glowing emerald cords in a dark archive

Tweet 1 (Hook):
I forgot what made me add my own commit rule. My git log answered in my own words, 80-some days later, because of a field I'd put there on purpose. Strip that field and what comes back is your agent's summary of your thinking. 🧠

Tweet 2:
The commit body (Motivation/Decision/Why) is Claude's distillation of what I asked for, even when I approve it. So the format got one more field on top, Prompt, my verbatim words sitting above everything the agent wrote. That's the fix for memory rot.

Tweet 3:
Dylan Zhang measured the cost. GPT-5.4 solves ARC-AGI at 100%, consolidates the ground-truth solutions into memory, and drops to 54%. Every input was correct. The rewriting is what corrupted it.

Tweet 4:
My agents write every commit message and they're expert git users, so I already had full history of every change. I don't run blame, pickaxe or --grep by hand. You can use git as memory without ever learning it. What was missing was memory rot.

Tweet 5:
Claude Code's session logs live under its retention policy. My vault and its git log belong to me, so the verbatim prompt goes in the commit body where I own it.

Building Your Second Brain, Part 6: Git as Durable Memory
https://juanjofuchs.github.io/productivity/2026/08/04/building-your-second-brain-part-6-git-as-durable-memory.html

#SecondBrain #Git

---
INSTRUCTIONS:
- LinkedIn: Post Tuesday-Thursday. URL in post body (the Comments API exists but is gated behind LinkedIn's Community Management partner program, which individual developers can't access). NOTE: the 8-10 AM EST window in the Social Media Promotion Guide is contradicted by 2026 timing data (Sprout: 11 AM-5 PM; Buffer: 3-8 PM, and it rates mornings and Tuesdays as weaker) — worth re-testing before the guide is trusted.
- X/Twitter: Post as thread. Image attached to first tweet. Link only in last tweet.
{% endcomment %}