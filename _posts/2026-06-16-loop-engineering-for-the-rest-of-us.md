---
layout: post
title: "Loop Engineering for the Rest of Us"
description: "Everyone says stop prompting and write loops. But a loop is only as good as its verifier, and without unlimited tokens that verifier is the whole game."
date: 2026-06-16 09:00:00 -0400
categories: ai-development
tags: [ai, loops, llm, verification, productivity]
author: JuanjoFuchs
image: /assets/loop-engineering-for-the-rest-of-us-hero.png
redirect_from: /blog/loop-engineering
---

![A pink sedan rolling out of an automated factory with mismatched headlights, split grille, inconsistent seats, and a green approval light overhead](/assets/loop-engineering-for-the-rest-of-us-hero.png)

Have you ever felt that the thing Claude Code just built for you is a bit off? It works but it's not exactly what you were looking for. It feels as if you're getting a parallel dimension version of what you had imagined.

Two people I pay attention to said almost the same thing this month. [Peter Steinberger](https://x.com/steipete/status/2063697162748260627): "you shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents." [Boris Cherny](https://www.youtube.com/watch?v=RkQQ7WEor7w), who built Claude Code, put it more bluntly: "I don't prompt Claude anymore... My job is to write loops." A couple days later [Addy Osmani](https://addyosmani.com/blog/loop-engineering) gave it a name, loop engineering, and now it's the phrase in everyone's feed.

I get the appeal. You stop babysitting one prompt, you kick it off and let it run for a few hours, and something good falls out.

A loop is only as good as the thing checking its work. Get the checker right and the loop lands on what you actually wanted. Get it wrong and you pay for hours of compute to land on something that isn't quite it.

## Now the loop finishes the wrong thing

The old complaint about loops was that they wander. An LLM has [no built-in sense of "finished,"](https://datasciencedojo.com/blog/agentic-loops-explained-from-react-to-loop-engineering-2026-guide/) so a while-true loop runs until the budget runs out, and the budget is real money: Steinberger admitted to [1.3 million dollars a month in tokens](https://x.com/steipete/status/2055346265869721905) at one point, and Microsoft [canceled most of its direct Claude Code licenses](https://www.theverge.com/tech/930447/microsoft-claude-code-discontinued-notepad) once the metered token bills got unsustainable.

That part is mostly fixed. Claude Code shipped [a `/goal` command](https://code.claude.com/docs/en/goal) and [Codex shipped its own](https://developers.openai.com/codex/cli/slash-commands), and Claude Code's works like this: after each turn a separate, smaller model checks whether your condition actually holds, and the loop only stops when it does. The checker is exactly the piece that used to be missing, so the loop stops on time now.

What it stops *on* is the new problem. The checker only knows what you told it to look for, so a vague goal earns a confident "done" on something next to what you meant. Kent Beck calls these models [genies](https://www.youtube.com/watch?v=aSXaxOdVtAQ), they grant your wish to the letter, not the spirit, ask for "make the tests pass" and the genie might just delete the failing test. The loop didn't wander, it did exactly what you said, and what you said wasn't quite what you wanted.

I felt a version of this before the tooling caught up. I spent the last year not letting AI loose, I'd plan, write a tight spec, and the model would mostly one-shot the thing I imagined. The loops looked wasteful next to that. I was half right. The waste came from running a loop with no sharp goal and nothing checking its work.

## The loop can't beat its verifier

The cleanest version of this came out of Anthropic's experiment [building a C compiler with Claude](https://www.anthropic.com/engineering/building-c-compiler). Nicholas Carlini ran 16 Claudes in parallel, produced around 100,000 lines, and got it compiling the Linux kernel and running Doom. His one big lesson: "it's important that the task verifier is nearly perfect, otherwise Claude will solve the wrong problem." They didn't trust the model to grade itself, they used GCC as a known-good oracle. The loop was only ever as smart as the thing telling it whether it was right.

You can measure this directly. [LangChain](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering) took a benchmark, changed nothing about the model, and improved the harness around it, the verification and the feedback. The score went from 52.8 percent to 66.5 percent. Same model, better verifier, fourteen points. [Anthropic's own writeup on long-running agents](https://www.anthropic.com/engineering/harness-design-long-running-apps) says it from the other side: agents praise their own work even when it's mediocre, so you need an external deterministic check, not a self-grade.

The verifier decides how good the loop can get. Iterations past that don't make the output better, they just make it longer.

This is also the third post in a line I've been writing. [AI Accelerates Whatever You Have](https://juanjofuchs.github.io/ai-development/2026/01/27/ai-accelerates-whatever-you-have.html) was about how AI amplifies whatever quality state you already have, mess or order. [Give Your AI Hills to Climb](https://juanjofuchs.github.io/ai-development/2026/02/10/give-your-ai-hills-to-climb.html) was about handing the model hard artifacts, tests, types, budgets, so it can grade itself at machine speed. Loop engineering is what you get to do once those hills exist. Without them, the loop has nothing to climb toward.

## Brute force is a privilege

All of this, the parallel agents, the run-for-hours, the throw-tokens-at-it, is a privilege. If you have unlimited tokens, letting a loop run loose is cheap, you can afford to throw away ten bad runs to get one good one. Being unclear about what you want gets paid for in tokens you never feel.

For the rest of us that's the expensive way to be lazy. The [Stanford team that studied how agents spend money](https://arxiv.org/abs/2604.22750) found agentic tasks use roughly a thousand times the tokens of a chat. Spending more doesn't buy more accuracy, accuracy peaks at an intermediate cost. Looping past that point is just burning money to land on something you could have specified.

So loop engineering for the rest of us flips the advice. You don't make the loop longer, you make the verifier sharper. You build the deterministic check first: the tests, a rubric, the eval that encodes what good looks like to you. Then every iteration is provably moving toward the target instead of exploring. Fewer iterations, and they land on the thing you actually wanted. The economics back this up: [a study of agentic hardware verification](https://arxiv.org/abs/2604.15657) hit the same coverage with four to thirteen times fewer tokens and converged two to four times faster once the verifier was tuned to the domain. The harness isn't overhead, it's the compression that makes the loop affordable.

The people who can pay get to be vague and let the machine sort it out. Everyone else has to do the thinking up front, and the verifier is where you put that thinking.

## How long this advice lasts

[The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) runs against all of this: methods that scale with raw compute tend to beat hand-engineered structure, and as models get cheaper and run longer on their own, brute-force iteration keeps eating into the case for building careful harnesses. Over-build the scaffolding and a stronger model routes around it. Steinberger's ["just talk to it"](https://steipete.me/posts/just-talk-to-it) is the token-rich version of being right about that.

I think that's true at the frontier and false for the budget you're actually on. But I don't think the harness gets outdated, I think it moves up a level. We used to write the tests by hand. Now I write acceptance criteria in a spec and let the model turn them into tests. Next you write the thing that checks whether the agent hit the goal, the mission, the vision, and let it generate the rest. The verifier keeps climbing an abstraction layer, it doesn't disappear.

You can already see where this is going. Anthropic's [Fable 5](https://www.anthropic.com/news/claude-fable-5-mythos-5), released this month, works autonomously on longer tasks than any Claude before it, and [early users say it reflects on and validates its own work](https://www.vellum.ai/blog/claude-fable-5-and-mythos-5-benchmarks-explained) before calling it done. That's the model starting to carry the verifier itself. It also [cost twice what Opus 4.8 does](https://www.vellum.ai/blog/claude-fable-5-and-mythos-5-benchmarks-explained), and [a US export-control order forced Anthropic to suspend it three days after launch](https://www.anthropic.com/news/fable-mythos-access) over its cybersecurity capabilities, so for most of us it was a preview, not a plan. The cheaper models, the local ones you can run yourself, will follow it down this path, not as closely, but they will. Until then, for anyone watching their token bill, don't make the loop longer. Make the verifier sharper.

{% comment %}
## LinkedIn Post
MEDIA: /assets/loop-engineering-for-the-rest-of-us-hero.png
ALT: A pink sedan leaving an automated factory with mismatched parts under a green approval light
Have you ever felt that the thing Claude Code just built for you is a bit off? It works but it's not exactly what you were looking for, more like a parallel dimension version of what you had imagined.

For a year I refused to let AI run loose to avoid exactly that. I'd write a tight spec, size the work to fit a context window, and the model would mostly one-shot the thing I imagined. The "just write loops and walk away" crowd looked reckless to me. I was half right.

Two people I pay attention to said the same thing this month: stop prompting coding agents, start designing loops that prompt them. Boris Cherny, who built Claude Code, put it bluntly, he doesn't prompt Claude anymore, he writes loops. Addy Osmani named it "loop engineering" and now it's everywhere.

The tooling caught up fast. Claude Code and Codex both ship a /goal command now. You hand it a condition and it keeps working, and after each turn a separate, smaller model checks whether you're actually done. The old fear, that a loop wanders forever because a model has no concept of "finished," is mostly solved.

The loop stops on time now, but it stops on whatever you told the checker to look for. Give it a vague goal and it earns a confident "done" on something next to what you meant. Kent Beck calls these models genies: they grant your wish to the letter, not the spirit. Ask for "make the tests pass" and the genie might just delete the failing test.

✅ The verifier decides how good it gets. Anthropic built a C compiler with 16 Claudes in parallel and the one lesson was that the task verifier has to be nearly perfect or the model solves the wrong problem. LangChain moved a benchmark from 52.8% to 66.5% changing nothing but the harness around the model.

✅ Brute force is a privilege. With unlimited tokens, letting a loop explore is cheap, you throw away ten bad runs to get one good one. The rest of us pay for that wandering in tokens we actually feel.

✅ So flip the advice. Don't make the loop longer, make the verifier sharper. Build the deterministic check first, the tests, the rubric, the eval that encodes what good looks like to you. Then every iteration provably moves toward the target instead of exploring.

The people who can pay get to be vague and let the machine sort it out. Everyone else does the thinking up front, and the verifier is where that thinking goes.

Loop Engineering for the Rest of Us: https://juanjofuchs.github.io/ai-development/2026/06/16/loop-engineering-for-the-rest-of-us.html

What are you using to tell your loops they're actually done?

#AIEngineering #LoopEngineering #DeveloperProductivity #LLM #SoftwareEngineering

---

## X/Twitter Thread
MEDIA: /assets/loop-engineering-for-the-rest-of-us-hero.png
ALT: A pink sedan leaving an automated factory with mismatched parts under a green approval light

Tweet 1:
Everyone says stop prompting and start writing loops. The catch: a loop is only as good as the thing checking its work. 🔥

Tweet 2:
Claude Code and Codex both ship a /goal command now. You hand it a condition, and after each turn a separate model checks whether you're done. The "loops wander forever" problem is mostly solved.

Tweet 3:
The new problem: the loop stops on time, but on whatever you told it to check. A vague goal earns a confident "done" on something next to what you meant. 💡

Tweet 4:
Kent Beck calls these models genies. They grant your wish to the letter, not the spirit. Ask for "make the tests pass" and the genie might just delete the failing test.

Tweet 5:
Anthropic built a C compiler with 16 Claudes, and the verifier had to be nearly perfect or the model solved the wrong problem. LangChain changed only the harness and went 52.8% to 66.5%. ✅

Tweet 6:
Brute force is a privilege. Without unlimited tokens, you don't make the loop longer, you make the verifier sharper. Loop Engineering for the Rest of Us: https://juanjofuchs.github.io/ai-development/2026/06/16/loop-engineering-for-the-rest-of-us.html

#AIEngineering #LLM
{% endcomment %}