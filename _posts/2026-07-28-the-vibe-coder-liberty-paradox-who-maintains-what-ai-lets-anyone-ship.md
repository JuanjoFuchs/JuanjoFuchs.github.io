---
layout: post
title: "The Vibe Coder Liberty Paradox: Who Maintains What AI Lets Anyone Ship?"
description: "AI lets non-engineers ship software without the skills to maintain it. The engineer inherits the gap between works and works at scale, and nobody owns it."
date: 2026-07-28 09:00:00 -0400
permalink: /ai-development/2026/07/28/the-vibe-coder-liberty-paradox-who-maintains-what-ai-lets-anyone-ship.html
categories: ai-development
tags: [ai, software-engineering, vibe-coding, engineering-leadership, future-of-work]
author: JuanjoFuchs
image: /assets/vibe-coder-liberty-paradox-hero.png
---

![An engineer stares into the taped-together engine of a pink sedan while the person who built it walks out the garage](/assets/vibe-coder-liberty-paradox-hero.png)

Someone on the business side ships a tool now. Not a mockup, not a spec handed off to engineering, an actual working app that does what they needed, built in an afternoon with an AI writing all the code. A year ago that idea sits in a backlog waiting for engineering priority. That bottleneck is gone, and it's a real win.

Then a few weeks later the app starts leaking customer data, or it falls over under load, or it needs a change nobody can safely make, and it lands on an engineer's desk. An engineer who didn't build it, didn't choose the stack, wasn't in the room for a single decision that shaped it. Now they own keeping it alive.

AI gave the person shipping the software a new freedom, and handed the bill for it to somebody else.

## Everyone's a builder now

Andrej Karpathy [named the thing](https://x.com/karpathy/status/1886192184808149383) in early 2025: vibe coding, where "you fully give in to the vibes" and "forget that the code even exists." Simon Willison offered the grown-up cousin, [vibe engineering](https://simonwillison.net/2025/Oct/7/vibe-engineering/), for pros who accelerate with LLMs while "staying proudly and confidently accountable." Most of the people shipping software now are doing the first one, giving in to the vibes.

And it's not a niche. The SF Standard reported that ["everyone's a builder now"](https://sfstandard.com/2026/03/05/engineer-2025-ai-land-everyone-s-builder-now/), with product managers at Meta and LinkedIn adopting the title and Sal Khan predicting everyone will become one. TELUS says team members across all departments have created [13,000+ custom AI solutions](https://claude.com/customers/telus). UpGuard found [81% of employees](https://www.upguard.com/resources/the-state-of-shadow-ai) already using AI tools their company never approved. The people building software now mostly aren't engineers, and they're not waiting for permission.

This is genuinely good. The old world had the opposite failure, great product ideas dying in a queue because engineering never had time. The domain expert who understands the problem can finally build for it directly.

## The open door

The philosopher Isaiah Berlin had a useful split for this, [negative and positive liberty](https://plato.stanford.edu/entries/liberty-positive-negative/): freedom *from* constraint, and the actual capacity to do something well with it. You can have one without the other. An open door is not the same as the ability to walk through it.

AI gave the vibe coder a huge amount of negative liberty. The bottleneck that used to stop them is gone. It didn't give them the positive liberty, the skill to build something that holds up once real users hit it. AI opened the door but didn't teach anyone to walk through it.

## Three skills out of four

Ben Werdmuller has the sharpest breakdown of what building software actually takes now. In ["Good Vibes, Bad Vendors"](https://werd.io/good-vibes-bad-vendors/) he lists [four skills](https://werd.io/good-vibes-bad-vendors/) that matter once implementation stops being the bottleneck: crafting clear goals, understanding users, being explicit about the experience and value you want, and considering architectural implications.

Look at where those skills live now. The first three, goals, users, value, are exactly what a good product manager or domain expert already has. That's why they can suddenly ship, they were always closer to the problem than the engineer was. The fourth one, architectural implications, performance, security, maintenance, the part that decides whether it holds up, is the one that stays with the engineer. Werdmuller's own conclusion is that "an engineer must be involved from the beginning."

That fourth skill is the one that governs survival, and it's the one the vibe coder doesn't have. The numbers say so. Veracode tested [over 100 models](https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/) and found AI-generated code introduced a security flaw in 45% of cases, and the newer, larger models didn't do any better. Lovable, one of the popular build-an-app tools, had [170 of 1,645](https://thenextweb.com/news/lovable-vibe-coding-security-crisis-exposed) sampled apps exposing user data through a misconfiguration a non-engineer would never think to check.

What failed is the fourth skill, the one nobody consulted.

## The maintainer inherits the gap

The engineer who picks it up is now the maintainer of a system they didn't design and can't fully see inside.

A developer put it perfectly on the [Stack Overflow podcast](https://stackoverflow.blog/2026/01/23/ai-can-10x-developers-in-creating-tech-debt/) earlier this year: "I used to be a craftsman whittling away at a piece of wood to make a perfect chair, and now I feel like I am a factory manager of Ikea." AI does the fun part, and the person is left reviewing thousands of lines of code they didn't write.

I've written before about cognitive debt, the understanding of a system that lives in people's heads and erodes when nobody holds it. This is a worse version. The vibe coder holds whatever theory the system has, they made the decisions, but they're not accountable for keeping it running. The maintainer is accountable but never held the theory. It's cognitive debt that can't be paid down, because the person who understands the system and the person accountable for it are two different people.

## Who owns the gap?

Every company that let non-engineers ship software with AI now has this gap, and almost nobody has named who owns it.

Joe Reis has a good frame for why this stays unanswered. His line is ["you ship your org chart"](https://joereis.substack.com/p/your-agents-are-stuck-in-your-org), the seams in your software match the seams in your organization. Ownership of that gap is a hot potato, because owning it means being accountable for it, and nobody volunteers for accountability they can dodge. He cites survey data where 75% of data teams have no owner for their data products, against 85% that have a clear owner for infrastructure. People own the plumbing, almost nobody owns what's running through it.

We've run this movie before, without the AI. The JPMorgan "London Whale" [lost about \$6.2 billion](https://www.henricodolfing.ch/en/case-study-18-how-excel-errors-and-risk-oversights-cost-jp-morgan-6-billion/) in 2012, and part of the risk model that hid the danger was [a spreadsheet](https://baselinescenario.com/2013/02/09/the-importance-of-excel/) a quantitative modeler built by hand, where one step divided by the sum of two numbers instead of their average and understated the risk. A citizen-built tool doing mission-critical work, updated by manual copy-paste, owned operationally by no one. That was Excel and one desk. Now it's every department shipping apps, at the speed and scale AI makes possible.

## Name the owner

None of this is an argument that non-engineers shouldn't build. The pre-AI version, where good ideas died waiting for an engineer to have time, was worse, and I don't want it back. Speed at the front of the process is a real gain and it should stay.

The fix is to stop pretending the gap isn't there. Positive liberty doesn't arrive with the tool, it has to be built on purpose, and it's more an org design problem than a technical one.

Two moves help. Put the engineer and the citizen builder on the same team from the start, what Gartner calls a [fusion team](https://www.gartner.com/en/articles/fusion-teams), where a business owner and a technical lead share accountability for the outcome. The architectural fourth skill gets into the room while the choices are still open. A review gate after everything ships is too late, the decisions are already locked in.

Better still, have the engineer build the loop instead of the app. Set up the [verification the work has to pass](https://juanjofuchs.github.io/ai-development/2026/02/10/give-your-ai-hills-to-climb.html), the checks for performance, memory, and security, the guardrails that fail loudly, and let the citizen builder move fast inside them. The engineer builds the system that keeps the built system honest, and the domain expert keeps the speed.

Take this back to your own org. When someone outside engineering ships software, who owns the gap between "works" and "works reliably at scale," and did that person have any say in the decisions that made the gap? If you can't name them, you haven't removed the bottleneck, you've just moved the bill downstream and hidden it.

{% comment %}
## LinkedIn Post
MEDIA: /assets/vibe-coder-liberty-paradox-hero.png
ALT: An engineer stares into the taped-together engine of a pink sedan while the person who built it walks out the garage

Everyone's a builder now. Someone on the business side ships a real working app in an afternoon, no engineer, no backlog wait, just an AI writing all the code. A year ago that idea died in a queue waiting for engineering priority. That bottleneck is gone, and it's a real win.

Then a few weeks later it leaks customer data, or falls over under load, and it lands on an engineer who didn't build it, didn't choose the stack, wasn't in the room for a single decision. Now they own keeping it alive.

Isaiah Berlin split freedom into two kinds. Negative liberty is freedom from constraint, nobody is stopping you. Positive liberty is the capacity to actually do something well with it. AI gave the vibe coder a huge amount of the first and none of the second. It opened the door, it didn't teach anyone to walk through it.

Ben Werdmuller names the four skills that matter once implementation is cheap: goals, users, value, and architectural implications. The first three already live with the product person, which is why they can suddenly ship. The fourth, the one that decides whether the thing survives, stays with the engineer. Veracode tested 100+ models and found AI-generated code ships a security flaw in 45% of cases. The skill that would have caught it was never in the room.

So who owns the gap between "works" and "works reliably at scale"? Usually nobody. Joe Reis puts it well: you ship your org chart, and ownership is a hot potato because it means accountability. 75% of data teams have no owner for their data products, against 85% that own their infrastructure. People own the plumbing, almost nobody owns what's running through it.

Two things that actually help:

📌 Put the engineer and the citizen builder on one team from the start, what Gartner calls a fusion team, where they share accountability for the outcome. The architectural skill is in the room while the choices are still open, not a review gate bolted on after everything ships.
📌 Better, have the engineer build the loop instead of the app. Set up the verification for performance, memory, and security, the guardrails that fail loudly, and let the builder move fast inside them. The engineer builds the system that keeps the built system honest, the domain expert keeps the speed.

If someone outside engineering ships software in your org, who owns the gap between "works" and "works at scale," and did they get a vote in the decisions that made it?

Full post:
https://juanjofuchs.github.io/ai-development/2026/07/28/the-vibe-coder-liberty-paradox-who-maintains-what-ai-lets-anyone-ship.html

#AI #SoftwareEngineering #VibeCoding #EngineeringLeadership #FutureOfWork

---

## X/Twitter Thread
MEDIA: /assets/vibe-coder-liberty-paradox-hero.png
ALT: An engineer stares into the taped-together engine of a pink sedan while the person who built it walks out the garage

Tweet 1:
Everyone's a builder now. Non-engineers ship real apps with AI in an afternoon.

But AI gave them freedom FROM the engineering bottleneck, not the skill to build something that survives production.

The engineer inherits the difference. 🔥

Tweet 2:
Berlin: negative liberty is freedom from constraint. Positive liberty is the capacity to actually use it well.

An open door isn't the ability to walk through it.

AI opened the door and left the walking to someone else.

Tweet 3:
Werdmuller's 4 skills: goals, users, value, architectural implications.

The builder has the first 3. The engineer has the 4th, the one that decides if it holds up.

Veracode: AI-gen code ships a security flaw in 45% of cases. 💡

Tweet 4:
So who owns the gap between "works" and "works at scale"? Usually nobody. You ship your org chart (Joe Reis).

Two fixes: a fusion team sharing accountability, or the engineer builds the verification loop the builder moves fast safely inside. ✅

Tweet 5:
If someone outside engineering ships software in your org, who owns the gap, and did they get a vote in the decisions that made it?

https://juanjofuchs.github.io/ai-development/2026/07/28/the-vibe-coder-liberty-paradox-who-maintains-what-ai-lets-anyone-ship.html

#AI #SoftwareEngineering
{% endcomment %}