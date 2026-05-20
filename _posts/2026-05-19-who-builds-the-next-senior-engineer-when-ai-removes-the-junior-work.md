---
layout: post
title: "Who Builds the Next Senior Engineer When AI Removes the Junior Work?"
description: "AI is compressing the work that used to manufacture senior engineers, right when the industry needs senior judgment more than ever."
date: 2026-05-19 09:00:00 -0400
categories: ai-development
tags: [ai, engineering, career, juniors, seniors]
author: JuanjoFuchs
image: /assets/the-ladder-collapse-hero.png
---

![A pyramid with a wide junior base on the left, an arrow pointing right to a diamond with a thin neck where the base used to be](/assets/the-ladder-collapse-hero.png)

Two conversations from earlier this year keep coming back to me. One was with an engineering manager I used to work with, talking about a pipeline of work that was thinning out. Not "the project got cancelled" thin. The kind of thin where you look six months out and start wondering what people will be doing. The work was leaving, and nothing was coming back to fill it. The team was strong, the manager was strong, and the worry was about the juniors.

The other one was on the business side. Someone outside engineering was using Claude Code to automate a workflow that used to need an engineer, and getting good at it pretty fast.

Two unrelated signals, same week. The work juniors used to grow on is being eaten from two sides at once, and almost nobody is talking about where the next generation of senior engineers comes from.

## The Pyramid Trained People by Accident

The old shape of a software org was a pyramid. A few seniors at the top, a wider band of mids, a wide base of juniors. The base did the tedious work, fixing bugs, writing tests, reading unfamiliar code, refactoring, chasing down why staging is broken at 2pm on a Tuesday.

Nobody designed that base to be a training program. It just happened to be one. The tedium was the gym. You can't read fifty thousand lines of someone else's code and not come out the other side with taste. Debugging a flaky test for three days teaches you what reliable code feels like. Refactor a tangled module and the shape of good architecture starts to surface.

Kent Beck calls this the [transfer from synthetic to analytical skills](https://tidyfirst.substack.com/p/90-of-my-skills-are-now-worth-0). The synthetic work, the typing, the looking up of syntax, the figuring out which method to call, is where the analytical work gets earned. He says his father earned analytical skills through synthetic work that doesn't exist anymore, and you can fail to make the jump if the synthetic work is gone before you get there.

Ben Werdmuller [says it more bluntly](https://werd.io/2025/good-vibes-bad-vendors): "friction is training." Debugging, refactoring, and failure are what build engineers. Without that friction, the senior never forms.

The ladder existed because the base existed, the work funded itself without anybody having to plan it.

## AI Is Turning the Pyramid Into a Diamond

That base is being compressed. Routine implementation, the work that used to feed the bottom of the pyramid, is the work AI is best at. The human work that's left skews up the chain: intent, review, verification, accountability for what ships.

The signal is already in the data. Stanford's Digital Economy Lab tracked ADP payroll records and [found a relative employment decline](https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/) for 22-25 year olds in AI-exposed occupations, while experienced workers in the same occupations stayed stable. Anthropic's own [labor market study](https://www.anthropic.com/research/labor-market-impacts) found no broad unemployment spike, but a suggestive slowdown in hiring of young workers aged 22-25 in exposed roles. The U.S. Census CES working paper on [early career hiring](https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-27.pdf) sees the same pattern in industry-state cells, with the appropriate caution that COVID, remote work, and monetary policy all complicate the causal story.

The BLS numbers tell the same story from a different angle. Narrowly-defined [computer programmer roles](https://www.bls.gov/ooh/computer-and-information-technology/computer-programmers.htm) are projected to decline, while the broader [software developer category](https://www.bls.gov/ooh/Computer-and-Information-Technology/Software-developers.htm) is still projected to grow. The labor that gets called "programming" is shrinking, the labor that gets called "engineering" is not, the shape is going from a pyramid to a diamond with a thin neck where the base used to be.

## More Seniors Needed, Fewer Being Made

The new shape needs more senior judgment than the old one. Reviewing what AI produces, deciding what's worth shipping, debugging weird emergent behavior across systems, that's senior work. So is owning whether something actually works in production.

At the same time, the shrinking base gives fewer people the experiences that produce that judgment. Shen and Tamkin [studied skill formation with AI assistance](https://arxiv.org/abs/2601.20245) and found that when users delegate instead of engage, AI impairs conceptual understanding, code reading, and debugging. AI-enhanced productivity isn't a shortcut to competence. Microsoft and Carnegie Mellon found something similar at the cognitive level, higher confidence in generative AI is [associated with less critical thinking](https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/), and oversight skill atrophies if people never practice the underlying work.

The industry needs more senior engineers than ever, and it's compressing the work that used to produce them. We're running the senior pipeline at higher load on a base we're actively shrinking.

I've started thinking about this as [cognitive debt](https://daedalus.umkc.edu/cognitive-debt-care-of-the-habitat/) at career scale, when nobody coming up holds the theory of the craft anymore because they never did the work that builds it.

## The New Ladder Has to Be Deliberate

I don't have a clean playbook for rebuilding the ladder. Nobody does. The old one ran on accidental friction, and the friction is gone.

What I can name is the shape of the new reps. The senior skills that used to be earned through implementation work, taste, judgment, architectural instinct, debugging intuition, have to be earned through different work now. Juniors need reps in:

- **Writing intent.** Specifications, plans, acceptance criteria. The work that comes before the code, where you decide what's worth building and what tradeoffs you'll accept.
- **Reviewing AI output.** Not skimming, reviewing. Reading the diff like you wrote it yourself, asking what's wrong with it, what edge case it missed, what it did that you wouldn't have done.
- **Debugging emergent behavior.** AI-generated systems fail in different ways than human-written ones. Practicing the debugging on systems you didn't write end-to-end is closer to what the senior job actually is.
- **Verification and observability.** Hills the AI can climb, [as I wrote about before](https://juanjofuchs.github.io/ai-development/2026/02/10/give-your-ai-hills-to-climb.html). Setting up the metrics, the tests, the targets that turn vague AI output into something checkable. Juniors can start practicing this without waiting for seniority.
- **Owning outcomes.** Not "I wrote this function." Owning that a workflow works, that a system stays up, that a metric moves. Take accountability earlier and the accountability instinct shows up earlier.

That's the operating mode I've been calling [Super IC](https://juanjofuchs.github.io/ai-development/2026/04/21/the-call-to-become-a-super-ic.html) at the top, and the [onboarding craft](https://juanjofuchs.github.io/ai-development/2026/03/31/stop-building-another-claude-learn-how-to-effectively-onboard-one-into-your-organization-instead.html) one floor down. The new ladder is engineers practicing those skills earlier than they used to, on smaller scopes, with seniors and managers designing work that builds those skills on purpose.

Beck made the same case from the junior side last week in ["Hey, N00b, We Didn't Hire You to Complete Tasks"](https://tidyfirst.substack.com/p/hey-n00b-we-didnt-hire-you-to-complete). His framing is sharper than mine: companies pay junior salaries today as the option premium on the senior they'll become, and nobody cares how many tasks the junior completes. The deliberate gym is what makes that option worth something.

Which means seniors have a job to do too. Senior engineers and engineering managers have to decide which work to keep human, which work to keep visible, which reviews to slow down on purpose so the junior can read the code and ask why. That's mentorship designed around AI-mediated work, not against it.

I don't know if the industry will actually do this. The short-term throughput math says ship faster, use AI more, hire fewer juniors. Ten years out, the question is where the seniors are going to come from. Most companies pick the short-term answer because the long-term one is somebody else's problem.

The strong teams will figure something out. The business-side folks will keep getting better at automating their own work. The pipeline question is real, and so is the answer most engineering managers don't want to hear: the work that used to fill juniors' calendars isn't coming back, and the job is to design what fills it instead.

The industry still needs seniors, it's dismantling the system that used to create them, and somebody has to design the new one.

{% comment %}
## Social Campaign
CAMPAIGN: ladder_collapse_20260519
TIMEZONE: America/New_York

### Tuesday - Launch
DATE: 2026-05-19
TIME: 09:00
MEDIA: /assets/the-ladder-collapse-hero.png
ALT: A pyramid with a wide junior base on the left, an arrow pointing right to a diamond with a thin neck where the base used to be

#### LinkedIn Post
PUBLISHED: 2026-05-19T13:18:04.511Z


An engineering manager I used to work with told me his team's pipeline is thinning, not in the "this project got cancelled" way, in the "what will my juniors be doing in six months" way. The work was leaving, and nothing was coming back to fill it.

Same week, on the business side, someone outside engineering was using Claude Code to automate a workflow that used to need an engineer, getting good at it pretty fast.

Two unrelated signals. The work juniors used to grow on is being eaten from both sides at once.

The old software org was a pyramid. A wide base of juniors did the tedious work, debugging, refactoring, reading unfamiliar code, chasing why staging broke at 2pm. Nobody designed that as a training program, it just happened to be one. The tedium was the gym.

AI is compressing that base into a diamond. Wide top of senior judgment work (intent, review, verification, accountability), thin neck where the base used to be.

📌 The new shape needs more senior judgment than ever
📌 The shrinking base gives fewer people the experiences that produce that judgment
📌 Short-term throughput math wins, ten-year senior pipeline math is somebody else's problem

The industry still needs seniors, and it's dismantling the system that used to create them.

Full post:
https://juanjofuchs.github.io/ai-development/2026/05/19/who-builds-the-next-senior-engineer-when-ai-removes-the-junior-work.html

Curious if you're seeing this in your org.

#AI #Engineering #CareerDevelopment #SoftwareEngineering #FutureOfWork

#### X/Twitter Thread
PUBLISHED: 2026-05-19T13:18:06.667Z


Tweet 1:
Two conversations keep coming back to me.

An engineering manager worried about a thinning pipeline: "what will my juniors be doing in six months." Same week, someone outside engineering used Claude Code to automate work that used to need an engineer. 🔥

Tweet 2:
The work juniors used to grow on is being eaten from both sides. AI compresses the routine implementation, the business side absorbs what used to need an engineer.

The old pyramid was wide at the base, the new shape is a diamond with a thin neck where the gym used to be.

Tweet 3:
The contradiction nobody says out loud:

The new shape needs more senior judgment than ever (review, verification, accountability). The shrinking base gives fewer people the experiences that produce that judgment.

Senior pipeline at higher load, base actively shrinking. 💡

Tweet 4:
Short-term throughput math says ship faster, hire fewer juniors.

Ten years out, the question is where the seniors will come from.

Most companies pick the short-term answer because the long-term one is somebody else's problem. ✅

Tweet 5:
Full post: https://juanjofuchs.github.io/ai-development/2026/05/19/who-builds-the-next-senior-engineer-when-ai-removes-the-junior-work.html

#AI #Engineering

### Wednesday - The Data
DATE: 2026-05-20
TIME: 09:00
MEDIA: /assets/the-ladder-collapse-hero.png
ALT: A pyramid with a wide junior base on the left, an arrow pointing right to a diamond with a thin neck where the base used to be

#### LinkedIn Post
PUBLISHED: 2026-05-20T14:31:52.345Z


22-25 year olds in AI-exposed jobs are losing employment. Workers over 30 in the same jobs aren't. Stanford has the data, Anthropic has it, the Census Bureau has it.

The base of the pyramid is shrinking. That's not a junior problem, that's a senior pipeline problem.

Stanford's Digital Economy Lab tracked ADP payroll records and found a relative employment decline for 22-25 year olds in AI-exposed occupations. Experienced workers in the same occupations stayed stable.

Anthropic's labor market study found no broad unemployment spike, but a suggestive slowdown in hiring of young workers aged 22-25 in exposed roles.

The U.S. Census CES working paper on early career hiring sees the same pattern in industry-state cells, with the appropriate caution that COVID, remote work, and monetary policy all complicate the causal story.

The BLS numbers tell it from a different angle. Computer programmer roles are projected to decline. The broader software developer category is still projected to grow. The labor called "programming" is shrinking, the labor called "engineering" is not.

The work AI leaves for humans skews senior, reviewing what AI produces, deciding what's worth shipping, debugging emergent behavior, owning whether something actually works in production. The industry needs more senior judgment than ever, and it's compressing the work that used to produce it.

Full post:
https://juanjofuchs.github.io/ai-development/2026/05/19/who-builds-the-next-senior-engineer-when-ai-removes-the-junior-work.html

What's your read on the data?

#AI #SoftwareEngineering #LaborMarket #FutureOfWork #CareerDevelopment

#### X/Twitter Thread
PUBLISHED: 2026-05-20T14:31:54.188Z


Tweet 1:
"AI is taking junior jobs" misses the harder problem. The base isn't just shrinking, the shape of software work is changing, and the data is already in. 🔥

Tweet 2:
Stanford tracked ADP payroll: 22-25 employment declines in AI-exposed roles while experienced workers stay stable.

Anthropic saw slower young-worker hiring in exposed roles.

Census CES saw the same pattern.

Tweet 3:
BLS from a different angle:

Computer programmer roles, projected to decline.

Software developer category, projected to grow.

The labor called "programming" is shrinking. The labor called "engineering" is not. 💡

Tweet 4:
The work AI leaves for humans skews senior. Reviewing what AI produces, deciding what's worth shipping, debugging emergent behavior across systems, owning whether something actually works in production.

Senior shape, with a thinner base feeding it. ✅

Tweet 5:
Full post: https://juanjofuchs.github.io/ai-development/2026/05/19/who-builds-the-next-senior-engineer-when-ai-removes-the-junior-work.html

#AI #SoftwareEngineering

### Thursday - The Option Premium
DATE: 2026-05-21
TIME: 09:00
MEDIA: /assets/the-ladder-collapse-hero.png
ALT: A pyramid with a wide junior base on the left, an arrow pointing right to a diamond with a thin neck where the base used to be

#### LinkedIn Post

NOTE: Tag Kent Beck when publishing.

Kent Beck dropped a post last week called "Hey, N00b, We Didn't Hire You to Complete Tasks." One line in it: "we are paying your salary now as the option premium on the engineer you are going to become." Nobody cares how many tasks you complete.

That's the economic case for the deliberate gym I've been arguing for. You pay junior salaries today as a bet on the senior they'll be in five years. Compress the work that builds the senior, you've burned the option.

Beck has a second piece, "90% of My Skills Are Now Worth $0," on the transfer from synthetic skills to analytical skills. The synthetic work is the typing, the syntax, the figuring out which method to call. The analytical skills are taste and judgment, earned through the synthetic work. He says his father made the same career jump 40 years ago. Some of his father's peers didn't make it. Some of ours won't either.

Ben Werdmuller put it bluntly in "Good Vibes, Bad Vendors": friction is training. AI compresses the friction. For somebody who hasn't earned the analytical skills yet, skipping the synthetic work is skipping the path itself.

Shen and Tamkin studied skill formation with AI assistance and found that when users delegate instead of engage, AI impairs conceptual understanding, code reading, and debugging. AI-enhanced productivity is not a shortcut to competence.

Full post:
https://juanjofuchs.github.io/ai-development/2026/05/19/who-builds-the-next-senior-engineer-when-ai-removes-the-junior-work.html

What did you learn from synthetic work that you couldn't have learned any other way?

#AI #SoftwareEngineering #EngineeringCulture #Mentorship #LearningInPublic

#### X/Twitter Thread

NOTE: Tag @kentbeck in tweet 1 (verify handle before posting).

Tweet 1:
@kentbeck on hiring juniors: "we are paying your salary now as the option premium on the engineer you are going to become."

Nobody cares how many tasks you complete. 🔥

Tweet 2:
That's the economic case for the gym we're losing. You pay junior salaries today as a bet on the senior they'll be in 5 years.

Compress the work that builds the senior, you've burned the option.

Tweet 3:
His other essay, "90% of My Skills Are Now Worth $0," makes the personal case. Synthetic work (typing, syntax, picking the right method) is where analytical skills (taste, judgment) get earned. 💡

Tweet 4:
Friction is training (Werdmuller). AI compresses the friction. The senior never forms.

Shen and Tamkin: when users delegate instead of engage, AI impairs conceptual understanding, code reading, debugging. ✅

Tweet 5:
Full post: https://juanjofuchs.github.io/ai-development/2026/05/19/who-builds-the-next-senior-engineer-when-ai-removes-the-junior-work.html

#AI #SoftwareEngineering

### Friday - The New Reps
DATE: 2026-05-22
TIME: 09:00
MEDIA: /assets/the-ladder-collapse-hero.png
ALT: A pyramid with a wide junior base on the left, an arrow pointing right to a diamond with a thin neck where the base used to be

#### LinkedIn Post

Most of the senior engineers I know got there by doing work that doesn't exist anymore. Debugging weird production failures, refactoring legacy code, reading thousands of lines someone else wrote. AI does most of that now.

Which is great if you've already earned the senior skills. If you haven't, the path you would have walked is gone.

I don't have a clean playbook for rebuilding it. Nobody does. What I can name is the shape of the new reps. Juniors need practice in:

1. **Writing intent.** Specs, plans, acceptance criteria. The work that comes before the code, where you decide what's worth building and what tradeoffs you'll accept.

2. **Reviewing AI output.** Not skimming, reviewing. Reading the diff like you wrote it yourself, asking what's wrong with it, what edge case it missed.

3. **Debugging emergent behavior.** AI-generated systems fail in different ways than human-written ones. Practicing the debugging on systems you didn't write end-to-end is closer to what the senior job actually is.

4. **Verification and observability.** Setting up the metrics, tests, and targets that turn vague AI output into something checkable. Juniors can start practicing this without waiting for seniority.

5. **Owning outcomes.** Not "I wrote this function." Owning that a workflow works, that a system stays up, that a metric moves.

Seniors and engineering managers have a job here too. Decide which work to keep human, which reviews to slow down on purpose so the junior can read the code and ask why.

Full post:
https://juanjofuchs.github.io/ai-development/2026/05/19/who-builds-the-next-senior-engineer-when-ai-removes-the-junior-work.html

Which of these is your team practicing right now?

#AI #SoftwareEngineering #EngineeringLeadership #Mentorship #CareerDevelopment

#### X/Twitter Thread

Tweet 1:
The accidental gym is gone. The deliberate one has to be built.

If you can't rely on tedious junior work to produce taste anymore, what reps replace it? 🔥

Tweet 2:
Five reps for juniors:

1. Writing intent (specs, plans, acceptance criteria)
2. Reviewing AI output (read the diff like you wrote it)
3. Debugging emergent behavior
4. Verification and observability
5. Owning outcomes, not "I wrote this function"

Tweet 3:
Verification is the one juniors can start practicing without waiting for seniority. Hills the AI can climb, metrics, tests, targets that turn vague output into something checkable. 💡

Tweet 4:
Seniors and managers have a job here too. Decide which work to keep human, which reviews to slow down on purpose so the junior can read the code and ask why.

Mentorship designed around AI-mediated work, not against it. ✅

Tweet 5:
Full post: https://juanjofuchs.github.io/ai-development/2026/05/19/who-builds-the-next-senior-engineer-when-ai-removes-the-junior-work.html

#AI #SoftwareEngineering
{% endcomment %}