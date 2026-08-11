---
layout: post
title: "Claude Just Gave You a Dry Promotion, and Will Keep Promoting You Until..."
description: "AI promoted you from writing code to directing agents. Feels like losing your taste. It isn't, your taste moves into the evals you design."
date: 2026-06-02 09:00:00 -0400
categories: ai-development
tags: [ai, software-engineering, agents, evals, career]
image: /assets/claude-dry-promotion-hero-irrigation-designer.png
author: JuanjoFuchs
redirect_from: /blog/dry-promotion
---

![A designer sketches an irrigation plan at a field table while machines dig the channels and a shovel sits unused](/assets/claude-dry-promotion-hero-irrigation-designer.png)

So you have stopped writing most of your code. You still ship it. You still own it. You just don't type it anymore.

You write a spec, point a few agents at it, and review what comes back. You add acceptance criteria and verification mechanisms to the spec, so the agents know to continue iterating until they get it right. You just keep an eye on the direction and avoid drift. You get from [idea to working product in minutes](https://juanjofuchs.github.io/ai-development/2026/01/27/ai-accelerates-whatever-you-have.html) now.

That's actually a promotion. Nobody gave you a new title or a raise; your job just changed from writing, refactoring, and running the code to [directing a group of agents](https://juanjofuchs.github.io/ai/2026/01/06/engineering-managers-naturally-great-at-ai.html) that now do it for you. It's a dry promotion with no extra pay, and you never applied to it.

Kent Beck says [the watchmaker era is gone](https://www.youtube.com/watch?v=Kh24KYFfH5Q), the careful by-hand changes to code are mostly the agent's job now. The industry already has a name for the new role, the agent manager. In February it was a prediction in [HBR](https://hbr.org/2026/02/to-thrive-in-the-ai-era-companies-need-agent-managers), by mid-2026 people are calling it the career skill of the year.

## Taste

![Researchers in a field lab analyze soil cores, water samples, and plant leaves to judge what healthy looks like](/assets/dry-promotion-field-analysis-lab.png)

Strip away the typing and what's left is [your taste](https://juanjofuchs.github.io/ai/2026/02/17/llms-are-compaction-tools-and-you-are-the-algorithm.html), your read on what good looks like, which technical decisions hold up under real load and which ones quietly turn into a 3am page six months later. You built it over years, making those calls and living with the consequences.

Taste was never really in making the call. Think about the decisions you used to agonize over by hand, which pattern to reach for, how to structure the module, which library to pull in. Those feel like the craft, but they're educated guesses. Very educated, built on years of scars and a shelf of good books and every system you've watched scale or fall over, but still guesses. There's rarely one right answer, there are a few reasonable approaches, and you don't find out which one was right until the thing runs in production, under real load, during a real incident.

Kent Beck put it bluntly, [most of his coding skills are worth zero now](https://tidyfirst.substack.com/p/90-of-my-skills-are-now-worth-0), the "how to build it" part, while his taste, knowing what's worth building and whether it's any good, gained leverage. You found out whether your architecture was any good when it got paged at scale, never the moment you typed it. So when an agent picks the pattern instead of you, your opinion at the pattern level matters less than it feels like it should. What counts is knowing what good looks like, and being able to tell whether you got it.

## You Can't Decline It

![A lone worker leans on a shovel by one hand-dug furrow, facing a vast plowed field he can't dig by hand](/assets/dry-promotion-shovel-cannot-scale.png)

This is the Peter Principle, you get promoted until you land in a job you're not good at, and AI just promoted you past the work that built your taste. Maybe you'd rather not manage, maybe you got into this to write code, not review it, the math doesn't give you the choice. [Anthropic's data](https://resources.anthropic.com/hubfs/2026%20Agentic%20Coding%20Trends%20Report.pdf) shows engineers can fully hand off only 0 to 20% of their tasks, the rest they supervise, and better models make that worse because faster agents produce more output and more output is more to review. People call it the [oversight gap](https://www.allstacks.com/blog/the-orchestration-gap-what-anthropics-report-means-for-engineering-leaders). Overseeing isn't optional, and it keeps growing.

The catch is how you oversee. It used to mean reading the code, that's where you applied your taste, line by line. At the volume agents produce you can't read it all. Read every PR they open and you're back to the speed you had before the promotion, which kills the point. Skip the reading and trust the output, and your judgment slowly rots, Anthropic [ran a study](https://www.anthropic.com/research/AI-assistance-coding-skills) where junior engineers who leaned on AI to get unstuck scored 17 points lower on the same skills later, worst of all in debugging, the exact muscle you need to tell good output from output that only looks good.

Both ways lose, that's the bind.

## Put Your Taste in the Evals

![A designer drafts detailed blueprints of irrigation control gates, the checkpoints water must pass through](/assets/dry-promotion-engineering-gates.png)

So you write it down. You take your read on what good looks like and bake it into evals, the checks that tell you whether the agent's work is any good without you reading every line. Test coverage, behavior under load, how cleanly it's split into parts, all the way up to whether it does what the spec actually asked for. You define what good means for this system, you build something that measures it, and you let it run against everything the agents produce.

OpenAI and Thrive published a [tax-prep agent](https://openai.com/index/building-self-improving-tax-agents-with-codex/) in May. When a human tax preparer corrects the agent's output, the correction gets captured as structured data, and the corrections that keep recurring turn into evals, concrete checks the system has to pass. Codex then works against those evals to fix itself. Production becomes the signal that drives the improvement, and the engineers stay on the hook for architecture, product decisions, and shipping. The humans moved their judgment up into the evals, and the system got measurably better from one tax season to the next, drafting returns at up to 97% accuracy and lifting throughput by about half.

Evals are [hills for the agent to climb](https://juanjofuchs.github.io/ai-development/2026/02/10/give-your-ai-hills-to-climb.html). You give it a clear, measurable target and it climbs. That target now encodes your taste, and once it's written down it runs against more code than you could ever review by hand. Anthropic's [more recent data](https://www.anthropic.com/research/economic-index-march-2026-report) points the same way, the people getting the most out of AI are the ones staying engaged, augmenting instead of fully automating, and they score higher for it.

I'm not certain this works. Designing evals is my best guess at how you keep your taste while the volume explodes, and it's an early guess in genuinely new territory. It's the move I'm betting on, and so far it's holding.

## What Stays Human

This won't stop here. You went from writing code to [directing agents](https://juanjofuchs.github.io/ai-development/2026/04/21/the-call-to-become-a-super-ic.html), and the abstraction keeps rising, each jump hands another layer to the agents and pushes you up a rung. ([Who becomes a senior](https://juanjofuchs.github.io/ai-development/2026/05/19/who-builds-the-next-senior-engineer-when-ai-removes-the-junior-work.html) when the bottom rung is all agents is a separate problem.)

Two things don't move, no matter how high this goes. The first is intent, deciding what's worth building and why. That comes from being a person in the world with things you actually want and need, the same reason [AI can't have shower thoughts](https://juanjofuchs.github.io/ai/2026/05/05/ai-will-never-have-shower-thoughts-even-if-it-takes-a-shower.html), it doesn't want anything. The second is accountability. When the agents answer the pager and patch production while you sleep, you'll still be the one who answers for whether there were too many incidents and whether they got fixed fast enough. The pager can move to the agent, the responsibility can't.

And I'm sorry, dear reader, I don't have the answer for when the promotions will stop. Nobody does yet, and anyone who claims they do is guessing.

What I'm hopeful about is where the ceiling sits. I think the promotions stop climbing when they hit the two things that stay ours, our ingenuity, the part that decides what's worth doing, and our ownership, the part that answers for it. Machines can take the rung below you forever, they can't take the wanting or the responsibility. So we keep getting promoted, rung after rung, until we're standing on the floor that's ours. I don't know how many rungs are left before we get there. I'm just hopeful that floor holds.

{% comment %}
## Social Campaign
CAMPAIGN: claude_dry_promotion_20260602
TIMEZONE: America/New_York

### Tuesday - Launch
DATE: 2026-06-02
TIME: 09:00
MEDIA: /assets/claude-dry-promotion-hero-irrigation-designer.png
ALT: A designer sketches an irrigation plan at a field table while machines dig the channels and a shovel sits unused

#### LinkedIn Post
PUBLISHED: 2026-06-02T13:10:30.811Z

NOTE: Verify the blog URL slug/date before posting (final Jekyll filename governs the path).

So you've stopped writing most of your code. You still ship it, you still own it, you just don't type it anymore.

You write a spec, add the acceptance criteria and the checks that tell the agents when they're done, point a few of them at it, and review what comes back. Idea to working product in minutes.

That's a promotion, and you never applied for it. Your job changed from writing, refactoring, and running the code to directing the agents that do it for you. More to own, more to oversee, no extra pay. A dry promotion.

It can feel like you're losing the thing that made you good, your taste, the judgment you spent years building by hand. I don't think you're losing it. I think it's moving up a level, out of the code and into how you decide what "good" even means and how you check for it.

The industry already has a name for the new role, the agent manager. In February it was an HBR prediction. By mid-2026 people call it the career skill of the year.

I wrote up where your taste goes when you stop writing the code, and the one question I couldn't answer 👇
https://juanjofuchs.github.io/ai-development/2026/06/02/claude-just-gave-you-a-dry-promotion-and-will-keep-promoting-you-until.html

#AI #SoftwareEngineering #AgenticAI #EngineeringLeadership

#### X/Twitter Thread
PUBLISHED: 2026-06-02T13:10:33.433Z

NOTE: Verify the blog URL slug/date before posting.

Tweet 1:
So you've stopped writing most of your code. You still ship it, you still own it, you just don't type it anymore. That's a promotion you never applied for. 🔥

Tweet 2:
It's a dry promotion. Your job changed from making the thing to directing the agents that make it. More to own, more to oversee, same paycheck.

Tweet 3:
It can feel like you're losing your taste, the thing you spent years building by hand. I don't think you're losing it. I think it's moving somewhere new.

Tweet 4:
The industry already named the new role: agent manager. In Feb it was an HBR prediction. By mid-2026 people call it the career skill of the year.

Tweet 5:
Where your taste goes, and the one question I couldn't answer: https://juanjofuchs.github.io/ai-development/2026/06/02/claude-just-gave-you-a-dry-promotion-and-will-keep-promoting-you-until.html

#AI #SoftwareEngineering

### Wednesday - The Data
DATE: 2026-06-03
TIME: 09:00
MEDIA: /assets/dry-promotion-shovel-cannot-scale.png
ALT: A lone worker leans on a shovel by one hand-dug furrow, facing a vast plowed field he can't dig by hand

#### LinkedIn Post
PUBLISHED: 2026-06-03T12:56:33.996Z

You can't opt out of managing agents. The numbers don't leave room for it.

Anthropic's data: engineers can fully hand off only 0–20% of their tasks. The other 80–100% they supervise. And better models make that worse, faster agents produce more output, and more output is more to review. People call it the oversight gap, and it grows as the models improve.

Overseeing used to mean reading the code, line by line, that's where you applied your taste. At the volume agents produce you can't read it all. Read every PR and you're back to the speed you had before the promotion, which kills the point. Skip the reading and your judgment quietly rots, Anthropic ran a study where juniors who leaned on AI to get unstuck scored 17 points lower on the same skills later, worst of all in debugging, the exact skill you need to tell good output from output that only looks good.

Both paths lose. The fix is upstream, you change how you apply your judgment in the first place, before there's a PR to read.

📌 The people getting the most out of AI stay engaged, they augment instead of automating everything, and they measure better for it.

#AI #SoftwareEngineering #EngineeringLeadership #AICoding

#### X/Twitter Thread
PUBLISHED: 2026-06-03T12:56:36.501Z

Tweet 1:
You can't opt out of managing agents. The numbers don't let you. 💡

Tweet 2:
Anthropic: engineers can fully hand off only 0–20% of their tasks. The other 80–100% they have to supervise.

Tweet 3:
Better models make it worse. Faster agents ship more output, and more output is more to review. They call it the oversight gap.

Tweet 4:
Anthropic found juniors who leaned on AI to get unstuck scored 17 points lower on the same skills later. Worst gap: debugging, the skill you need to judge AI output. ✅

Tweet 5:
The people getting the most out of AI stay engaged. They augment, they don't automate everything.

#AI #AICoding

### Thursday - Source
DATE: 2026-06-04
TIME: 09:00
MEDIA: /assets/dry-promotion-field-analysis-lab.png
ALT: Researchers in a field lab analyze soil cores, water samples, and plant leaves to judge what healthy looks like

#### LinkedIn Post
PUBLISHED: 2026-06-04T13:11:58.745Z

Two ideas reshaped how I think about staying valuable while AI writes the code.

The first is Kent Beck's. He says the watchmaker era is gone, the careful by-hand changes are mostly the agent's job now. His "how to build it" skills, the synthetic ones, are depreciating fast. His taste, knowing what's worth building and whether it's any good, gained leverage. An hour of good judgment now buys more working software than it ever has.

The second is a tax agent OpenAI and Thrive shipped in May. When a human tax preparer corrects the agent's output, that correction gets captured as structured data, and the corrections that keep recurring turn into evals, concrete checks the system has to pass. Codex then works against those evals to fix itself. Production becomes the signal that drives the improvement, the engineers stay on the hook for architecture, product, and shipping, and the system got measurably better from one tax season to the next.

Put those together and they point at one place for your judgment to live: the evals you design. That's where your taste stops being something you apply by hand and starts to scale.

Honest question for the engineering leaders here: if pattern decisions only get graded in production anyway, whose taste is in your evals?

#AI #SoftwareEngineering #EngineeringLeadership #AIAgents

#### X/Twitter Thread
PUBLISHED: 2026-06-04T13:12:01.013Z

Tweet 1:
Kent Beck: the watchmaker era is gone. The careful by-hand changes to code are mostly the agent's job now.

Tweet 2:
His framing: "how to build it" skills depreciate. Taste, what's worth building and whether it's good, gains leverage.

Tweet 3:
OpenAI + Thrive's tax agent: a human correction becomes an eval the system must pass. Codex fixes itself against it. Production corrections become the curriculum. ✨

Tweet 4:
The pattern across both: your judgment moves up into the evals you design.

Tweet 5:
Honest question for eng leaders: if pattern decisions only get graded in production anyway, whose taste is in your evals?

#AI #SoftwareEngineering

### Friday - Practical Takeaway
DATE: 2026-06-05
TIME: 09:00
MEDIA: /assets/dry-promotion-engineering-gates.png
ALT: A designer drafts detailed blueprints of irrigation control gates, the checkpoints water must pass through

#### LinkedIn Post
PUBLISHED: 2026-06-05T13:01:21.363Z

If AI writes most of your code now, spend next week on the checks that read the PRs for you, instead of trying to read them all yourself.

Think of it as writing your taste down, the judgment you'd apply by eye turned into a rubric the agent has to pass:
✅ Does it hold up under the load and edge cases you actually care about?
✅ Is it structured cleanly enough to change six months from now?
✅ Does it do what the spec actually asked for, not just something plausible?
✅ When production catches a miss, does that correction become a permanent check?

That last one compounds. Every real-world failure becomes an eval the system can't fail the same way twice, and your judgment runs against more code than you could ever read by hand.

Then guard the two things no eval covers and no agent should own: deciding what's worth building, and answering for it when it breaks. The pager can move to the agent. The responsibility can't.

Start with one check this week, the piece of "good" you're tired of explaining by hand.

#AI #SoftwareEngineering #EngineeringLeadership #AICoding

#### X/Twitter Thread
PUBLISHED: 2026-06-05T13:01:23.566Z

Tweet 1:
If AI writes most of your code now, stop trying to read every PR. Start designing the checks that read them for you. ✅

Tweet 2:
A rubric you can automate: does it pass the behaviors you actually care about, load, edge cases, the spec's real intent?

Tweet 3:
Is it structured cleanly enough to change later? That's taste you can measure instead of eyeball.

Tweet 4:
When production corrects the agent, make that correction a permanent eval, production becomes the signal that improves the system. 💡

Tweet 5:
Two things you never delegate: deciding what's worth building, and answering for it when it breaks.

#AI #AICoding
{% endcomment %}