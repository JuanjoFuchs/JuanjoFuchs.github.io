---
layout: post
title: "Why Engineering Managers Are Secretly Great at AI"
description: "The skills that made you a good engineering manager—clear communication, critical review, strategic delegation—are exactly what AI collaboration requires."
date: 2026-02-10 09:00:00 -0500
categories: ai
tags: [ai, engineering-management, vibe-coding, leadership]
author: JuanjoFuchs
image:
---

I spent 13 years managing engineers—explaining what to build, reviewing their output, pushing back on bad architectural decisions. Turns out those exact skills are what make AI collaboration work. The irony is that EMs who stopped coding years ago might be better positioned for AI than developers who never managed anyone.

## The Skills That Transfer

Here's what engineering managers do every day:

| EM Skill | AI Equivalent |
|----------|---------------|
| Explaining what to build | Prompt engineering, articulating intent |
| Discussing architectural trade-offs | Guiding AI approach, constraining solutions |
| Reviewing PRs with a critical eye | Reviewing AI output, catching errors |
| Critiquing wrong decisions | Rejecting bad suggestions, course-correcting |

These aren't adjacent skills, they're the *same* skills applied to a different collaborator. When I prompt Claude or Copilot, I'm doing what I did in every 1:1 with a developer: explaining the goal, providing context, setting constraints, reviewing output, giving feedback.

[GitHub's research](https://github.blog/developer-skills/career-growth/hard-and-soft-skills-for-developers-coding-in-the-age-of-ai/) backs this up: "Communication skills are important as developers navigate prompt engineering. The best AI prompts are clear, direct, and well thought out—and communicating with fellow humans in the workplace isn't much different."

That last part is the key. If you've spent years learning to communicate technical requirements clearly to humans, you've been training for AI collaboration without knowing it.

## The Rookie Developer Mental Model

[IT Revolution's research on vibe coding](https://itrevolution.com/articles/vibe-coding-pairing-vs-delegation/) offers the best mental model I've found: "Treating the AI like a somewhat skilled but rookie developer is a helpful mindset: you can delegate grunt work to it, but you must review its output thoroughly and mentor/correct it when it goes off track."

EMs have been doing exactly this for years. The delegation patterns are identical:

- Assess task complexity before assigning
- Provide clear context and constraints
- Set checkpoints for review
- Give specific feedback, not just "this is wrong"

Think about pair programming. The navigator guides strategy while the driver writes code. EMs have been navigators for years—reviewing, guiding, course-correcting. Now the driver is AI, but the navigator role is unchanged.

When I started using Claude Code seriously, I noticed something strange: the rhythm felt familiar. Explain the goal, watch the implementation, catch the mistakes, redirect. It's the same loop I ran with junior engineers, just faster and without the awkward "let's schedule a sync" dance.

## The FAAFO Framework

Gene Kim and Steve Yegge's [Vibe Coding](https://itrevolution.com/product/vibe-coding/) book introduces the FAAFO framework for understanding AI coding's value: Fast, Ambitious, Autonomous, Fun, Optionality. EM skills map to every dimension.

**Fast**: EMs know how to unblock work and remove friction. When AI gets stuck, you recognize the pattern—unclear requirements, missing context, wrong approach. You've debugged these problems with humans for years.

**Ambitious**: EMs have vision for what "could be built" that exceeds current team capacity. AI removes the constraint. That feature you shelved because it would take two sprints? Now it's a weekend project.

**Autonomous**: EMs spent years coordinating between teams, waiting on dependencies, aligning schedules. AI eliminates the coordination tax. You can iterate directly without waiting for someone else's calendar.

**Fun**: Building beats managing. AI lets EMs return to creation. I stopped coding not because I couldn't, but because the friction wasn't worth it given everything else on my plate. AI removes that friction.

**Optionality**: EMs are used to exploring multiple approaches before committing. "Let's prototype both and see which works" is a natural instinct. AI makes this cheap.

## The Maker vs Manager Schedule Advantage

Paul Graham's famous essay divides work into maker schedule and manager schedule. Developers thrive on maker schedule—long uninterrupted blocks for deep creative work. EMs are forced into manager schedule—days sliced into 30-60 minute chunks with constant context switching.

Here's the thing: AI iteration cycles are short. You prompt, review output, refine, prompt again. Each cycle is 5-30 minutes. This maps perfectly to manager schedule, not maker schedule.

Developers often struggle with this. They're used to deep flow states where they hold the entire problem in their head for hours. AI breaks that rhythm—constant interruptions to review, correct, re-prompt. It feels jarring if you're optimized for maker schedule.

EMs are already trained for it. Years of back-to-back 30-minute 1:1s, context switching between completely different projects, quick deep-dives then moving on, making decisions with incomplete information under time pressure. The ability to load context quickly, make a judgment call, provide clear feedback, then move to the next thing—that's manager schedule survival. It's also exactly how AI collaboration works.

The connection to FAAFO's Autonomy dimension is direct. Without AI, EMs coordinate with multiple devs on their own timelines. Lots of waiting, async communication, alignment meetings. With AI, you iterate directly in 30-minute chunks. No coordination tax. The manager schedule becomes a feature because you control the entire loop.

## The Drift

The Vibe Coding book describes "the Drift"—mental alignment between developer and AI collaborator where implementation matches vision. EMs achieve this drift with their teams constantly. Getting a developer to understand your vision and execute on it is the same skill as getting AI to understand your intent.

Kim notes that AI eliminates two coordination taxes EMs know well: organizational friction (no waiting for dependent teams) and the mind-reading tax (your implementation matches your vision because you guide it directly). Every EM has experienced the frustration of explaining something clearly, waiting a week for implementation, then seeing something that missed the point entirely. AI feedback loops are minutes, not days.

## Countering the "EMs Are Obsolete" Narrative

The threat is real. [Gartner predicts](https://www.success.com/middle-managers-are-disappearing/) 69% of manager workload automated by AI. Deloitte says half of middle management roles may vanish. DoorDash already runs 200,000+ drivers with no direct supervisors—algorithms handle scheduling, ratings, and performance management.

But that's the *coordination* role. Status reports, project tracking, basic decision routing. The EMs who survive are the ones who pivot to AI-human collaboration. The skills aren't obsolete—they're being redirected.

The old EM role: coordinate humans who code. The new EM role: direct AI that codes, with human judgment on architecture, quality, and priorities. Companies are moving away from command-and-control toward coaching, facilitation, and strategic oversight—recognizing that technology can't replace the messy human parts where relationships and context matter.

## The Archmage Returns

The Vibe Coding book opens with stories of "Archmage" coders coming out of retirement because AI removed the friction that drained their passion. Gene Kim himself returned to hands-on coding after 17 years.

EMs are in the same position. Many stopped coding not because they couldn't, but because the overhead wasn't worth it. Setting up environments, debugging dependencies, remembering syntax for languages you haven't touched in years. AI handles all of that. The strategic thinking and architectural judgment that made you a good EM? Still valuable, now directly applicable.

I managed 60 engineers across multiple teams. The shift to AI collaboration felt less like learning something new and more like returning to building with better leverage. The judgment about what to build, how to structure it, what trade-offs matter—that's the hard part. AI handles the typing.

## Practical Tips for EMs

**Use your delegation instincts.** Assess task complexity before prompting, just like before assigning to a dev. Simple tasks get simple prompts. Complex tasks need context, constraints, examples.

**Apply your review rigor.** Don't accept AI output you wouldn't accept from a junior. Read the code. Question the approach. Push back on weird decisions.

**Leverage context switching.** Your 30-minute deep-dive training is perfect for AI iteration cycles. Don't fight for flow state—embrace the short loops.

**Trust your architectural judgment.** You know what good looks like, even if you haven't written production code recently. That judgment is the valuable part.

**Embrace the navigator seat.** Guide, review, course-correct. Same as always, faster feedback loops.

## The Bottom Line

The skills that made you a good engineering manager—clear communication, critical review, strategic delegation, architectural judgment—are exactly what AI collaboration requires. Developers who never managed anyone are learning these skills from scratch. You've been practicing them for years.

The question isn't whether EMs can use AI effectively. It's whether you'll leverage the skills you already have or keep thinking you need to "learn to code again" first. You don't. You need to apply the skills you already have to a new kind of collaborator.

{% comment %}
## LinkedIn Post
MEDIA:
ALT:

Spent 13 years managing engineers. Explaining what to build, reviewing PRs, pushing back on bad architecture. Turns out those exact skills are what make AI collaboration work.

The irony is that EMs who stopped coding years ago might be better positioned for AI than developers who never managed anyone.

Here's why:

✅ Explaining intent to developers = prompt engineering
✅ Reviewing PRs with a critical eye = reviewing AI output
✅ Delegating effectively = knowing what to hand off to AI
✅ 30-minute context switching (manager schedule) = perfect for AI iteration cycles

Developers often struggle with AI because it breaks their flow state. They're optimized for 4-hour deep work blocks. AI iteration is 5-30 minute loops—review, refine, re-prompt.

That's manager schedule. We've been training for this without knowing it.

The threat that "AI will replace middle managers" misses the point. It'll replace the coordination role. The EMs who pivot to AI-human collaboration—directing AI with human judgment on architecture and quality—those skills are more valuable than ever.

What's your experience? Have management skills helped or hindered your AI adoption?

#EngineeringManagement #AI #VibeCoding #Leadership #TechLeadership

---
INSTRUCTIONS:
1. Copy the text above (without the Liquid comment tags)
2. Post to LinkedIn during peak hours (Tue-Thu, 8-10 AM or 12-2 PM EST)
3. Immediately add FIRST COMMENT with blog link: https://juanjofuchs.github.io/ai/2026/02/10/engineering-managers-secretly-great-at-ai.html
4. Engage actively in the first hour - respond to comments quickly

---

## X/Twitter Thread
MEDIA:
ALT:

Tweet 1 (Hook):
Spent 13 years managing engineers. Explaining goals, reviewing PRs, pushing back on bad decisions. Turns out those exact skills are what make AI collaboration work. 🧵

Tweet 2:
The core EM skills map directly to AI:
- Explaining what to build → prompting
- Reviewing PRs critically → reviewing AI output
- Effective delegation → knowing what to hand off
- Critiquing wrong decisions → course-correcting AI

Tweet 3:
Here's the weird part: EMs who stopped coding years ago might be BETTER at AI than devs who never managed anyone. Those communication and review skills? Devs are learning them from scratch. EMs have years of practice. 💡

Tweet 4:
The maker vs manager schedule angle is underrated. Devs want 4-hour flow states. AI breaks that rhythm—5-30 min cycles of prompt, review, refine. That's manager schedule. We've been training for this. ✅

Tweet 5:
"AI will replace middle managers" misses the point. It'll replace coordination tasks. The EMs who pivot to directing AI with human judgment? More valuable than ever.

Tweet 6:
Full breakdown of why EM skills transfer to AI collaboration: https://juanjofuchs.github.io/ai/2026/02/10/engineering-managers-secretly-great-at-ai.html

#EngineeringManagement #AI

---
INSTRUCTIONS:
1. Post as a thread on Wednesday at 9 AM EST (or Tue-Thu between 8-11 AM or 12-2 PM EST)
2. Keep each tweet under 280 characters
3. Link goes in the LAST tweet only (X algorithm suppresses posts with links)
4. Use only 1-2 hashtags total (at the end)
5. Engage with replies in first hour for algorithm boost

ALTERNATIVE (Single Post):
If you prefer a single post instead of thread, post the hook without link, then immediately reply to your own post with the blog URL.
{% endcomment %}
