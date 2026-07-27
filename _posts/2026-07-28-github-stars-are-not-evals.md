---
layout: post
title: "GitHub Stars Are Not Evals"
description: "caveman advertised 65% token savings, a paired benchmark measured 8.5%. Both authors published real evals. A star count measures nothing about your work."
date: 2026-07-28 09:00:00 -0400
permalink: /ai-development/2026/07/28/github-stars-are-not-evals.html
categories: ai-development
tags: [ai, claude-code, agent-skills, evals, second-brain]
author: JuanjoFuchs
image: /assets/github-stars-are-not-evals-hero.png
---

![A white-gloved hand raises a single glowing gold star into pure darkness, the star the only light in frame](/assets/github-stars-are-not-evals-hero.png)

Two Claude Code add-ons blew up this summer. [caveman](https://github.com/JuliusBrussee/caveman) is a skill that makes your agent narrate in pidgin so it writes fewer words, and the repo description calls it a "Claude Code skill that cuts 65% of tokens by talking like caveman." [rtk](https://github.com/rtk-ai/rtk) is a "CLI proxy that reduces LLM token consumption by 60-90% on common dev commands," which compresses shell output before your agent reads it. Between them they have more than 167,000 stars.

Denis Shiryaev at JetBrains ran both through paired A/B benchmarks, same tasks, same model, one arm with the tool and one without. [caveman came out at 8.5%](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/) fewer output tokens across the 82 SkillsBench tasks where both arms ran cleanly, 592k down to 542k, about 240 billed trials, roughly $106. [rtk came out more expensive](https://blog.jetbrains.com/ai/2026/07/rtk-claude-code-token-savings/), "a median +7.6% more expensive per task (p=0.004)" at low reasoning effort and flat at high effort, "+0.1% (p=0.99)," across 86 tasks and 425 trials for about $320. Quality was unchanged in both. Meanwhile rtk's own dashboard reported 96.2 million tokens saved, 99.8%, while the bill went up.

If you installed either one because the star count said it was worth installing, you bought a number nobody measured on your work. And the star count is what most of us use to decide.

## Both authors ran the evals

Neither of these is somebody overselling on purpose.

caveman ships `benchmarks/` and `evals/` directories with results committed and reproducible, plus a file literally called `docs/HONEST-NUMBERS.md` covering when the skill wins, when it loses, and how to check for yourself. The README scopes the claim before a critic could: "Caveman only shrinks output tokens." Input and reasoning tokens go untouched, it discloses the skill's own overhead of roughly 1,000 to 1,500 input tokens per turn, and it gives the range behind the 65% average, 22% to 87% across ten prompts.

rtk goes further and concedes the criticism inside its own README: "RTK cuts up to 90% of the bash output your agent reads. That is what RTK measures, and it is not the same as cutting your bill by 90%."

Before I lean any harder on those benchmarks: JetBrains isn't a neutral referee, they sell [their own repository intelligence layer for coding agents](https://blog.jetbrains.com/ai/2026/07/introducing-jetbrains-context-repository-intelligence-for-coding-agents/), shipped the same month as these two write-ups. The methodology and harness are public, so anyone can check the work. It's still two tools, one category, one person measuring, and token savings is the category most prone to counterfactual problems.

Shiryaev's verdicts land where the two READMEs already were. caveman is "safe, honest about style, oversold on savings." rtk is "Honest engineering, wrong counterfactual," the counterfactual being the run you'd have had without it.

## Why the 65% never reaches your bill

Both gaps come from the same place.

caveman's 65% is real for what it was measured on, chat-style prose where the narration *is* the output. Agentic coding output is mostly code, diffs, tool-call payloads and error strings, and the skill preserves all of that byte-exact on purpose. What's left to compress is the narration between tool calls, a thin slice, so crushing it hard still only moves the number by single digits.

rtk's counter compares its compressed output against the full raw output, and that raw output was never going to be billed. The Bash hook it works through only ever sees about 20% of what comes back from tools, because Claude Code's own Read and Grep never pass through it. Those 96.2 million saved tokens are measured against a session that never happened.

The author's side of this is reasonable and I'd do the same thing. If I have an idea that works on my machine, I want to share it. I'm not going to spend weeks and a pile of tokens proving it holds up in every scenario somebody might throw at it, that stops being sharing an idea and turns into software engineering. The caveman author measured what they had, on ten prompts, and wrote the range down, more than most people do.

The failure is on my side, when I install it because the number looked good. I inherit the distance between their setup and mine, and they never agreed to own that distance. It's the shape I wrote about [last week with vibe coding](https://juanjofuchs.github.io/ai-development/2026/07/21/the-vibe-coder-liberty-paradox-who-maintains-what-ai-lets-anyone-ship.html), one layer down: they decided how far their own effort would go, and installing their work makes everything past that point mine.

## A star means somebody liked the idea

Both repo descriptions still carry the naked headline, the 65% and the 60-90% and nothing else. The 22-to-87 range lives in caveman's README. The scope caveat lives in `docs/HONEST-NUMBERS.md`. The paragraph where rtk's author says its metric isn't your bill sits several screens down.

A star carries none of that. It's one click, and the click can mean almost anything. Someone thought the idea was good. A few wanted the repo findable again next month. Plenty read "why use many token when few token do trick," laughed, and hit the button on the way past without installing anything at all. Every one of those is a real signal about an idea, and not one of them is a run on your codebase against a baseline. A star has never been a measurement, least of all one taken on your work.

Philipp Schmid from Google DeepMind opened his AI Engineer World's Fair talk, [Don't Ship Skills Without Evals](https://www.youtube.com/watch?v=0vphxNt4wyk), by polling the room. Everyone used skills, and on the show of hands, "no one has evals." (Quotes from the talk transcript, spoken filler trimmed.)

caveman and rtk are the well-documented ones. If the two with committed benchmark directories don't transfer to your work, the median one isn't going to either.

None of this says skills don't work. In the same talk Schmid puts the average gain from a skill at roughly 15% across about 100 SkillsBench tasks, and the format is fine. A folder with a SKILL.md is a good way to move a practice around.

## You can't debug a skill you never read

Money is the easy cost to see. The expensive one is diagnosis.

When an agent run goes badly you're already choosing between the model being off and the task being too hard for it. Schmid says as much from the author's side: "you might not know if your task fails because your skill is bad or if your task fails because it's way too challenging for the model." Install something you haven't read and you add a third suspect you can't investigate, because you don't know what it's telling your agent to do.

Geoffrey Huntley put it plainly: ["LLMs are essentially mirrors. They mirror the skill of the operator."](https://ghuntley.com/mirrors/) He means your craft there. Copying somebody's folder into your setup transfers their file, not their craft.

## What I do instead of installing

I read them. Point an agent at the repo, have it read everything and explain the actual idea, what's good in it and what doesn't apply to how I work. Have it strip the scaffolding, the edge cases, and the productionization for people who aren't me. What's left is usually small. Then it interviews me on how I really do that task, and the output is a guide in my vault, in my words, routed from AGENTS.md so I know when it should fire and can tell when it didn't.

Two sizes of outcome. The big one was John Lindquist's [claude-imps](https://github.com/johnlindquist/claude-imps), one natural-language front end per CLI so you never read `--help` again. I took the idea and dropped the packaging: his runs on Bun and the Claude Agent SDK, and I wanted a deterministic parser handling the common case with no model at all. What came out is a PowerShell version and a guide I own. Installing would have been one command, this took real work, and the result matches how I work.

The small one was Matt Pocock's [grilling skill](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md), which I wrote up in [how I write specs with AI](https://juanjofuchs.github.io/ai-development/2026/06/30/how-i-write-specs-with-ai.html). Twelve lines and 136 words including the frontmatter, barely a hundred words of actual instruction. All the value is in the idea, and the idea doesn't need a folder: make the model interview you down every branch of the design tree. I've used it on every spec since.

Most people skip routing, but it decides whether the skill fires at all. [Vercel ran evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) on Next.js 16 APIs that weren't in the training data, and in 56% of cases the agent never invoked the available skill at all. Their skills arm passed 79% of the eval tasks, an AGENTS.md docs index passed all of them, against a 53% no-docs baseline.

I'd be refuting my own post if I handed you that 47-point jump as proof. The comparison moved three things at once: whether the knowledge was always in context, what the knowledge actually was, and how it was formatted. It's a direction, not a clean measurement of routing, and Vercel benefits from AGENTS.md catching on. [Lulla and co-authors](https://arxiv.org/abs/2601.20404) measured AGENTS.md across 10 repositories and 124 pull requests and got the same direction, a median 28.6% cut in runtime and 16.6% in output tokens. I do it because it's held up across my own repos and my vault since January.

Skills still fit the explicit one-shot workflows you trigger on purpose, and I said as much launching [atref](https://juanjofuchs.github.io/ai-development/2026/06/09/launching-atref-dont-install-skills-mention-your-second-brain-guides-into-any-agent.html), my tool for pulling vault guides into any agent: a skill is a distribution mechanism, and I don't have a distribution problem.

The other reason the knowledge lives in my own files is that the agent race isn't over. I made that argument [back in March](https://juanjofuchs.github.io/ai-development/2026/03/31/stop-building-another-claude-learn-how-to-effectively-onboard-one-into-your-organization-instead.html): the process knowledge is ours, everything else is becoming commodity. If Codex wins next quarter, a vault of guides comes with me, and a folder of installed skills is somebody else's format in somebody else's directory.

Keep the skill if you want it. Just know what's in it.

## Anthropic already ships the harness

The objection to all of this is that reading and distilling every skill you meet is more work than one install command, and running a real A/B is worse. The second half stopped being true.

Anthropic's own [skill-creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md), the skill they publish in their open skills repo, already includes the harness. It tells you to "spawn two subagents in the same turn," one with the skill and one without, then use the time while those runs are in flight to draft the quantitative assertions you'll grade them against. It captures `total_tokens` and `duration_ms` for both arms, grades the outputs, and ships a viewer for the results. The paired method Shiryaev spent about $426 on across two benchmarks is sitting inside the tool people use to write skills.

Schmid's version is one sentence: "…always try to run evals with and without the skill enabled. And if the model achieves the performance without even triggering the skill, you know you can retire that skill."

That works on guides you wrote yourself too, and mine haven't been through it. Shiryaev's closing line from the rtk benchmark is about compression tools, and it holds for anything you're deciding whether to adopt: "If you evaluate any context-compression tool, measure the paired bill, not the tool's diff."

{% comment %}
## LinkedIn Post
MEDIA: /assets/github-stars-are-not-evals-hero.png
ALT: A white-gloved hand raises a single glowing gold star into pure darkness, the star the only light in frame

caveman is a Claude Code skill with more than 93,000 stars, and its repo description says it "cuts 65% of tokens by talking like caveman." rtk is a CLI proxy with more than 73,000 stars that "reduces LLM token consumption by 60-90% on common dev commands."

Denis Shiryaev at JetBrains ran both through paired A/B benchmarks. caveman came out at 8.5% fewer output tokens across 82 agentic coding tasks where both arms ran cleanly, not 65%. rtk came out a median 7.6% MORE expensive per task at low reasoning effort, while its own dashboard reported 96.2 million tokens saved. Quality was unchanged in both.

Neither author was overselling.

caveman ships committed benchmarks, an evals directory, and a file called docs/HONEST-NUMBERS.md. Its README says "Caveman only shrinks output tokens." rtk's README concedes the exact criticism: "RTK cuts up to 90% of the bash output your agent reads. That is what RTK measures, and it is not the same as cutting your bill by 90%."

And I'd do the same thing they did. If something works on my machine and I think the idea is good, I want to share it. I'm not going to spend weeks and a pile of tokens proving it holds up on your setup too. That's a reasonable line for an author to draw around their own effort. The moment I install their work, the distance between their setup and mine is mine to own, and they never agreed to carry it.

Both did the work, both scoped the claim, and 167,000 stars later the numbers people repeat are still 65% and 60-90%, because the star and the one-line description carry the headline while the caveats live in docs/.

That's the problem with using a star count to decide what to install. A star means somebody liked the idea enough to click once. Nobody who clicked ran your tasks, on your repo, against a baseline. And if the two best-documented ones don't transfer, the median skill isn't going to either. Philipp Schmid polled the room at the AI Engineer World's Fair and got the same answer: everyone uses skills, no one has evals.

What I do instead:

📌 Point an agent at the repo, have it explain the actual idea and strip the scaffolding that isn't for me.
📌 Have it interview me on how I really do that task, then write a guide in my words, in my vault.
📌 Route it from AGENTS.md so I know when it should fire and can tell when it didn't. Vercel found the agent never invoked an available skill in 56% of eval cases.

Skills work, Schmid puts the average gain at about 15% across SkillsBench, and the format is fine. Keep the skill if you want it. Just know what's in it, because when a run goes wrong you can't debug a file you never read.

Full post:
https://juanjofuchs.github.io/ai-development/2026/07/28/github-stars-are-not-evals.html

#AI #ClaudeCode #AgentSkills #Evals #SecondBrain

---

## X/Twitter Thread
MEDIA: /assets/github-stars-are-not-evals-hero.png
ALT: A white-gloved hand raises a single glowing gold star into pure darkness, the star the only light in frame

Tweet 1:
caveman: 93k stars, "cuts 65% of tokens."

Measured by JetBrains on 82 clean agentic-coding pairs: 8.5%.

The author wasn't lying. The number was real, it was just measured on chat prompts, not on your work. 🔥

Tweet 2:
rtk: 73k stars, "60-90% token savings."

Paired benchmark: a median 7.6% MORE expensive per task at low reasoning effort, flat at high.

Its own dashboard reported 96.2M tokens saved, against raw output Claude Code already truncates. 💡

Tweet 3:
Both authors ran evals. caveman ships benchmarks/, evals/, and docs/HONEST-NUMBERS.md.

rtk's own README: "That is what RTK measures, and it is not the same as cutting your bill by 90%."

They measured it and wrote it down. A star count doesn't carry any of that.

Tweet 4:
93k people clicked a button because an idea was good. Not one of those clicks was a paired run on your codebase.

Philipp Schmid polled a room at the AI Engineer World's Fair: everyone uses skills, no one has evals. These two are the good case. ✅

Tweet 5:
So don't install it, read it. Have your agent explain the idea, strip the scaffolding, write a guide in your own words, and route it from AGENTS.md so you notice when it doesn't fire.

https://juanjofuchs.github.io/ai-development/2026/07/28/github-stars-are-not-evals.html

#AI #ClaudeCode
{% endcomment %}