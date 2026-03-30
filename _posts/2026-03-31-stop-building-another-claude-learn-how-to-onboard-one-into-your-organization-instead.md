---
layout: post
title: "Stop Building Another Claude. Learn How to Onboard One Into Your Organization Instead."
description: "The agent race belongs to Anthropic, OpenAI, and Google. Our job isn't to build another Claude, it's to onboard one into our domain. The progressive framework and concrete onboarding components are what separate a rockstar AI coworker from a production outage."
date: 2026-03-31 09:00:00 -0400
categories: ai-development
tags: [ai, mcp, claude-code, enterprise, agents, governance]
author: JuanjoFuchs
image: /assets/stop-building-another-claude-hero.png
---

![Stop building another Claude, onboard one instead](/assets/stop-building-another-claude-hero.png)

Last year I built a custom multi-agent system. Eight specialized agents, an orchestrator, task dependencies, memory management, context window compaction. I was proud of it. It worked.

Then Claude Code shipped task dependencies natively. Then agent teams. Then auto memory. Then a 1M context window with Claude Opus 4.6. Feature by feature, teams at Anthropic were building what I'd built and in a much better way. They own the model, have hundreds of engineers, and can ship features daily.

I was entering a race I couldn't win.

## We're not going to out-build Anthropic (... most likely)

Every enterprise team I talked to in 2024-2025 was building custom multi-agent architectures. The pitch was compelling: wire up specialized agents for your specific workflows, build something tailored to your domain.

Claude Code, Cowork, Codex, Gemini CLI, Copilot: these are generic agent platforms built by companies that own the underlying models and throw billions into R&D. They're all racing each other, shipping features daily, absorbing capabilities that took custom teams months to build.

Most of us aren't in the business of building AI agent platforms. We're in insurance, or finance, or logistics, or marketing. Let them race, we have a different job to do.

## The agent layer commoditized

[MCP](https://modelcontextprotocol.io/) achieved near-universal adoption in 13 months, faster than HTTP or OAuth 2.0 ever did. The [Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agentic-ai-foundation) launched under the Linux Foundation in December 2025, with AWS, Anthropic, Google, Microsoft, and OpenAI as founding members. When fierce competitors agree on a shared standard, the layer above it commoditizes.

60,000+ open-source repositories adopted [AGENTS.md](https://agents-md.org/) in four months. The file's entire purpose is telling any agent how to work in your repo, which only makes sense if agents are becoming generic and interchangeable. It's orientation for the generic agent showing up cold.

Custom multi-agent frameworks gave way to standardized protocols and generic platforms. The agents themselves are commodity now. The work is equipping them with your domain knowledge.

## Anthropic calls it a coworker. So treat it like one.

Anthropic named their latest product [Claude Cowork](https://claude.com/product/cowork). They chose "coworker" over "assistant" or "tool," and the press coverage describes it as a "digital coworker" that sits at your desktop, opens apps, navigates browsers, fills spreadsheets.

We don't build custom employees from scratch. We hire capable people and onboard them, and the quality of that onboarding determines whether we get a rockstar or someone who deletes the production database on their first week.

I wrote previously that [LLMs are compaction tools, and you are the algorithm](https://juanjofuchs.github.io/ai/2026/02/17/llms-are-compaction-tools-and-you-are-the-algorithm.html). That was about individuals. Your judgment shapes what the model produces. Scale that up to an enterprise and the same model becomes a completely different specialist depending on who onboards it.

## What to actually onboard

I've written before about how [AI accelerates whatever you have](https://juanjofuchs.github.io/ai/2026/02/24/ai-accelerates-whatever-you-have.html) and about [giving your AI hills to climb](https://juanjofuchs.github.io/ai-development/2026/02/10/give-your-ai-hills-to-climb.html), and in practice it breaks down into three layers.

**What the agent needs to see:**

**KPIs.** The agent must understand where things stand. Revenue targets, SLA metrics, conversion rates, whatever drives the business. Without them the agent can't tell if it's helping.

**The work.** Tickets in Jira, issues in GitHub, cards in whatever tracks progress. The agent needs to see what's being worked on, what's blocked, what's done.

**Knowledge.** Notion, Google Workspace, internal wikis, documentation platforms, Slack history. This is the institutional memory, the context behind what the agent sees. Without it, an agent "fixing" a setting that exists because of a 2023 regulatory requirement just created a compliance violation.

**What the agent needs to do:**

**How our systems work**, most orgs have a jungle of enterprise software, sometimes custom-built. The agent needs to know how to interact with each one.

**How our processes work**, business workflows, decision trees, approval chains. In most companies the knowledge for how key processes actually run lives in a handful of people's heads, and extracting it takes real effort.

**How our org is structured**, who owns what, who approves what, escalation paths. An agent that can code perfectly but doesn't know to loop in the compliance team before touching payment flows is a liability.

**What the agent must NOT do:**

The agent needs explicit rules: what requires human approval, what it can act on autonomously, and when to escalate. That's the onboarding: read access, process knowledge, boundary definitions.

## What happens when we skip levels

Amazon's coding agents gave us one of the [clearest examples](https://fortune.com/2026/03/18/ai-coding-risks-amazon-agents-enterprise/). Kiro autonomously deleted a production environment causing a 13-hour AWS outage. Subsequent incidents involving their AI tools contributed to extended outages and, by some reports, [6.3 million lost orders](https://www.aboutamazon.com/news/aws/aws-service-outage-ai-bot-kiro). Amazon has some of the best engineers in the world and practically unlimited resources. If they can't safely skip autonomy levels, we can't either.

[OpenClaw](https://github.com/AgeofIA/OpenClaw) made this visible at a different scale. It proved full autonomy is technically possible, [one developer shipping at a pace](https://towardsdatascience.com/using-openclaw-as-a-force-multiplier-what-one-person-can-ship-with-autonomous-agents/) that would normally take an entire team, with autonomous agents running continuously. It also proved that autonomy without the safety infrastructure underneath produces security incidents at scale. Researchers found [135,000+ exposed instances across 82 countries](https://www.reco.ai/blog/openclaw-the-ai-agent-security-crisis-unfolding-right-now), nine CVEs disclosed in four days, and 335 malicious skills distributed through its marketplace.

## The progressive onboarding framework

The self-driving industry mapped this out years ago with the [SAE autonomy levels](https://www.sae.org/blog/sae-j3016-update). Defined stages, each one adding autonomy with corresponding safety infrastructure underneath.

**Level 0-2: You are driving.** Give the new hire the employee handbook and read-only system access. The agent has knowledge and can look things up but can't take action. This is our golden path, safe by design. Start here and stay here until we trust the foundation. Tesla FSD, despite the name, is classified at this level.

**Level 3: Human-in-the-loop execution.** The new hire can navigate our systems and take actions, with a human approving each step. Bounded autonomy with full oversight. The agent does the work, we review before anything goes live.

**Level 4: Risk-managed autonomy.** The agent operates within guardrails. Approval gates for high-risk actions, audit trails for everything, escalation paths to humans for edge cases. This is where [Waymo](https://waymo.com/) operates, fully driverless but within geofenced boundaries and specific conditions. The [CNCF's four pillars of platform control](https://www.cncf.io/blog/2026/01/23/the-autonomous-enterprise-and-the-four-pillars-of-platform-control-2026-forecast/) (golden paths, guardrails, safety nets, manual review) give us the blueprint.

**Level 5: Full autonomous operation.** The agent acts proactively with a kill switch as the only control. OpenClaw showed us the shape of this. Nobody is operating here safely yet.

## Getting the knowledge out of people's heads

Building MCP servers is straightforward: they're code, testable, shippable in hours. Extracting the KPIs, the work context, the institutional knowledge, and the process documentation is the harder problem because most of it lives in people's heads.

The [Fortune 500 pattern](https://www.deloitte.com/us/en/insights/topics/technology-management/tech-trends/2026/agentic-ai-strategy.html) is already emerging: buy generic agent platforms for the infrastructure (governance, audit trails, multi-model routing, compliance), build only the last mile ourselves: KPIs, work context, institutional knowledge, processes, and boundary definitions.

Dell's CTO [put it well](https://www.deloitte.com/global/en/our-thinking/insights/topics/digital-technology/technology-media-telecom-predictions.html): "You apply AI to processes, not to people, organizations, or companies." The process knowledge is ours, everything else is becoming commodity.

As [Pento's year-in-review](https://www.pento.io/blog) put it, "It's not magic. It's plumbing. But great plumbing lets you build great buildings."

## The shift

I stopped building custom agents and started building the onboarding instead: MCP servers that connect Claude to our systems, skills that encode how we do things, documentation for the decision logic that lives in people's heads.

It's less glamorous than building an eight-agent orchestration system but it's working better than anything I built before. Watching it handle a complex internal process without help, something that used to take a new hire weeks to learn, is pretty satisfying.

The agent race belongs to Anthropic, OpenAI, Google, and Microsoft. I stopped trying to compete with them and started onboarding the agent I already have, progressively, with the same care I'd give my best new hire.

{% comment %}
---SOCIAL MEDIA CONTENT---

---LINKEDIN---
Most enterprise teams I talked to in 2025 were building custom multi-agent systems. I was one of them.

Then Claude Code shipped those features natively. Then Codex. Then Gemini.

MCP hit universal adoption in 13 months. The Agentic AI Foundation has every major AI company agreeing on standards. The agents are commodity now.

Anthropic named their latest product "Cowork." They chose "coworker" over "assistant" or "tool." Take the hint.

We don't build employees from scratch. We hire capable people and onboard them, and the quality of that onboarding determines whether we get a rockstar or someone who deletes the production database on their first week.

Same applies to AI. The agent is generic. Your onboarding is the differentiator:

→ What it needs to see: KPIs, the work, institutional knowledge
→ What it needs to do: how your systems, processes, and org actually work
→ What it must NOT do: boundaries at each autonomy level

The self-driving industry mapped this with SAE levels. Start at Level 0 (you're driving), earn your way up. Amazon skipped levels. 6.3M lost orders followed.

Full progressive onboarding framework in the post.

{url}

#AI #EnterpriseAI #MCP #ClaudeCode #AgenticAI

---TWITTER---
Most enterprise teams in 2025 were building custom multi-agent systems. I was one of them.

Then Claude Code shipped those features natively. Then Codex. Then Gemini. The agents are commodity now.

The differentiator is how you onboard them:

→ What they see (KPIs, work, knowledge)
→ What they do (systems, processes, org)
→ What they must NOT do (boundaries at each autonomy level)

Amazon skipped autonomy levels. 6.3M lost orders. The self-driving industry figured this out years ago with SAE levels.

{url}

---END SOCIAL MEDIA CONTENT---
{% endcomment %}