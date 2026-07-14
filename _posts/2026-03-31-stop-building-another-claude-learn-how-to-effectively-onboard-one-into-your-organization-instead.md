---
layout: post
title: "Stop Building Another Claude. Learn How to Effectively Onboard One Into Your Organization Instead."
description: "The agent race is won. Your job is onboarding one into your domain, and that's what separates a rockstar AI coworker from a production outage."
date: 2026-03-31 09:00:00 -0400
categories: ai-development
tags: [ai, mcp, claude-code, enterprise, agents, governance]
author: JuanjoFuchs
image: /assets/stop-building-another-claude-hero.png
---

![Stop building another Claude, onboard one instead](/assets/stop-building-another-claude-hero.png)

Last year I built a custom multi-agent system. Eight specialized agents, an orchestrator, to-do lists, memory management, context window compaction, browser tools. I was proud of it. It worked.

Then Claude Code shipped task dependencies natively. Then agent teams. Then auto memory. Then the Chrome browser extension. Then a 1M context window with Claude Opus 4.6.

I was entering a race I could not possibly win.

Every enterprise team I talked to in 2024-2025 was building custom multi-agent architectures. The pitch was compelling: create specialized agents for your specific workflows, build them tailored to your domain.

But most of us aren't in the business of building AI agent platforms. We're in insurance, or finance, or logistics, or marketing. We have a different job to do.

Let *them* race. Claude Code, Cowork, Codex, Gemini CLI, Copilot: these are generic agent platforms built by companies that own the underlying models and throw billions into R&D. They're all racing each other, shipping features daily, absorbing capabilities that took smaller teams months to build.

## The agent layer commoditized

There's been a lot of back and forth recently: "MCP is dead," "long live MCP," "MCP is where enterprises are actually thriving." Here's what the numbers say: [MCP](https://modelcontextprotocol.io/) achieved near-universal adoption in 13 months, faster than HTTP or OAuth 2.0 ever did. The [Agentic AI Foundation](https://www.linuxfoundation.org/press/linux-foundation-launches-the-agentic-ai-foundation) launched under the Linux Foundation in December 2025, with AWS, Anthropic, Google, Microsoft, and OpenAI as founding members. When fierce competitors agree on a shared standard, the layer above it commoditizes.

60,000+ open-source repositories adopted [AGENTS.md](https://agents-md.org/) in four months. The file's entire purpose is telling any agent how to work in your repo, which only makes sense if agents are becoming generic and interchangeable.

Custom multi-agent frameworks gave way to standardized protocols and generic platforms. The generic agents themselves are commodity now, the same way cloud compute became commodity a decade ago.

**The work is no longer building custom agents, it's leveraging the generic ones and equipping them with your domain knowledge.**

The [Fortune 500 pattern](https://www.deloitte.com/us/en/insights/topics/technology-management/tech-trends/2026/agentic-ai-strategy.html) is already emerging: buy generic agent platforms for the infrastructure (governance, audit trails, multi-model routing, compliance), build only the last mile ourselves: KPIs, work context, institutional knowledge, processes, and boundary definitions.

Dell's CTO [put it well](https://www.deloitte.com/global/en/our-thinking/insights/topics/digital-technology/technology-media-telecom-predictions.html): "You apply AI to processes, not to people, organizations, or companies." The process knowledge is ours, everything else is becoming commodity.

As [Pento's year-in-review](https://www.pento.io/blog) put it, "It's not magic. It's plumbing. But great plumbing lets you build great buildings."

## Anthropic calls it a coworker. So treat it like one.

Anthropic named their latest product [Claude Cowork](https://claude.com/product/cowork). They chose "coworker," so take a hint. It's a "digital coworker" that sits at your desktop, opens apps, navigates browsers, fills spreadsheets, you name it.

We hire capable people, we don't *build* custom employees from scratch. The key part is how we onboard them. The quality of that onboarding determines whether we get a rockstar or someone who deletes the production database on their first week.

I wrote previously that [LLMs are compaction tools, and you are the algorithm](https://juanjofuchs.github.io/ai/2026/02/17/llms-are-compaction-tools-and-you-are-the-algorithm.html). That was about individuals. Your judgment shapes what the model produces. Scale that up to an enterprise and the same model becomes a completely different specialist depending on how it gets onboarded.

## What to actually onboard

I've written before about how [AI accelerates whatever you have](https://juanjofuchs.github.io/ai-development/2026/01/27/ai-accelerates-whatever-you-have.html) and about [giving your AI hills to climb](https://juanjofuchs.github.io/ai-development/2026/02/10/give-your-ai-hills-to-climb.html). In practice, those two ideas break down into three layers for organizations:

1. What the agent needs to see
2. What the agent needs to do
3. What the agent must NOT do

**What the agent needs to see:**

**KPIs.** These are the agent's grounding mechanisms. Revenue targets, SLA metrics, conversion rates, whatever drives the business. Without them the agent can't tell if it's helping.

**The work.** Tickets in Jira, issues in GitHub, cards in whatever tracks progress. The agent needs to see what's being worked on, what's blocked, what's done.

**Knowledge.** Notion, Confluence, SharePoint, internal wikis, documentation platforms, Slack history, etc. This is the institutional memory, the context behind what the agent sees. Without it, an agent "fixing" a setting that exists because of a 2023 regulatory requirement just created a compliance violation.

**What the agent needs to do:**

**How our systems work**, most orgs have a jungle of enterprise software, sometimes custom-built. The agent needs to know how to interact with each one.

**How our processes work**, business workflows, decision trees, approval chains. In most companies the knowledge for how key processes actually run lives in a handful of people's heads, and extracting it takes real effort.

**How our org is structured**, who owns what, who approves what, escalation paths. An agent that can code perfectly but doesn't know to loop in the compliance team before touching payment flows is a liability.

**What the agent must NOT do:**

The agent needs explicit rules: what requires human approval, what it can act on autonomously, and when to escalate. That's the onboarding: read access, process knowledge, boundary definitions.

## The progressive onboarding framework

The self-driving industry mapped this out years ago with the [SAE autonomy levels](https://www.sae.org/blog/sae-j3016-update). Defined stages, each one adding autonomy with corresponding safety infrastructure underneath.

![Progressive AI Onboarding Framework, SAE levels mapped to enterprise AI](/assets/stop-building-another-claude-framework.png)

**Level 0-2: You are driving.** Give the new hire the employee handbook and read-only system access. The agent has knowledge and can look things up but can't take action. This is our golden path, safe by design. Start here and stay here until we trust the foundation. Tesla FSD, despite the name, is classified at this level.

**Level 3: Human-in-the-loop execution.** The new hire can navigate our systems and take actions, with a human approving each step. Bounded autonomy with full oversight. The agent does the work, we review before anything goes live.

**Level 4: Risk-managed autonomy.** The agent operates within guardrails. Approval gates for high-risk actions, audit trails for everything, escalation paths to humans for edge cases. This is where [Waymo](https://waymo.com/) operates, fully driverless but within geofenced boundaries and specific conditions. The [CNCF's four pillars of platform control](https://www.cncf.io/blog/2026/01/23/the-autonomous-enterprise-and-the-four-pillars-of-platform-control-2026-forecast/) (golden paths, guardrails, safety nets, manual review) give us the blueprint.

**Level 5: Full autonomous operation.** The agent acts proactively with a kill switch as the only control. OpenClaw showed us the shape of this. Nobody is operating here safely yet.

## What happens when we skip levels

Amazon's coding agents gave us one of the [clearest examples](https://fortune.com/2026/03/18/ai-coding-risks-amazon-agents-enterprise/). Kiro autonomously deleted a production environment causing a 13-hour AWS outage. Subsequent incidents involving their AI tools contributed to extended outages and, by some reports, [6.3 million lost orders](https://www.aboutamazon.com/news/aws/aws-service-outage-ai-bot-kiro). Amazon has some of the best engineers in the world and practically unlimited resources. If they can't safely skip autonomy levels, we can't either.

[OpenClaw](https://github.com/AgeofIA/OpenClaw) made this visible at a different scale. It proved full autonomy is technically possible, [one developer shipping at a pace](https://towardsdatascience.com/using-openclaw-as-a-force-multiplier-what-one-person-can-ship-with-autonomous-agents/) that would normally take an entire team, with autonomous agents running continuously. It also proved that autonomy without the safety infrastructure underneath produces security incidents at scale. Researchers found [135,000+ exposed instances across 82 countries](https://www.reco.ai/blog/openclaw-the-ai-agent-security-crisis-unfolding-right-now), nine CVEs disclosed in four days, and 335 malicious skills distributed through its marketplace.

OpenClaw uses the popular LiteLLM PyPI package (3.4 million daily downloads) as a dependency and the [LiteLLM supply chain attack](https://www.bleepingcomputer.com/news/security/popular-litellm-pypi-package-compromised-in-teampcp-supply-chain-attack/) showed the same pattern. Attackers compromised it, injecting credential-stealing code that exfiltrated API keys, cloud credentials, and SSH keys every time Python started, even if LiteLLM was never imported. The malicious versions were live for about three hours, but LiteLLM sits in 36% of cloud environments.

## The shift

I stopped building custom agents and started building the onboarding instead: MCP servers that connect Claude to our systems, skills that encode how we do things, documentation for the decision logic that lives in people's heads.

It's less glamorous than building an eight-agent orchestration system but it works better than anything I built before. Watching it handle a complex internal process without help, something that used to take a new hire weeks to learn, is pretty satisfying.

**The agent race belongs to Anthropic, OpenAI, Google, and Microsoft. I stopped trying to compete with them and started onboarding the agent I already have, progressively, with the same care I'd give my best new hire.**

{% comment %}
## LinkedIn Post

Last year I spent months building a custom multi-agent system. Eight specialized agents, an orchestrator, to-do lists, memory management, context compaction, browser automation. It was the most complex thing I'd shipped and I was genuinely proud of it.

Then Claude Code shipped task dependencies natively. Then agent teams. Then auto memory. Then the Chrome extension. Then a 1M context window. Feature by feature, Anthropic was building everything I'd built and doing it better. They own the model and have hundreds of engineers.

I was entering a race I could not possibly win.

Every enterprise team I talked to in 2024-2025 was building custom multi-agent architectures.

But most of us aren't in the business of building AI agent platforms. We're in insurance, finance, logistics, marketing.

The agent layer has commoditized. MCP hit near-universal adoption in 13 months. The Agentic AI Foundation has AWS, Anthropic, Google, Microsoft, and OpenAI all agreeing on shared standards. The generic agents themselves are commodity now, the same way cloud compute became commodity a decade ago.

📌 The real work now is equipping generic agents with your domain knowledge.

Anthropic named their latest product "Cowork," so take a hint. We hire capable people, we don't build custom employees from scratch. The quality of the onboarding is what determines whether we get a rockstar or someone who deletes the production database on their first week.

The onboarding breaks down into three layers:

📌 What the agent needs to see: KPIs as grounding mechanisms, the work (Jira, GitHub, whatever tracks progress), and institutional knowledge (Confluence, SharePoint, wikis, Slack history)

📌 What the agent needs to do: how your systems work, how your processes work, how your org is structured

📌 What the agent must NOT do: what requires human approval, what it can act on autonomously, and when to escalate

The self-driving industry mapped the progressive approach years ago with SAE autonomy levels. I adapted the same framework for enterprise AI onboarding. Start at Level 0, you are driving, and earn your way up.

Amazon skipped levels with Kiro. 13-hour AWS outage, 6.3M lost orders. OpenClaw proved full autonomy is technically possible and also proved what happens without the safety infrastructure underneath: 135,000+ exposed instances across 82 countries. Then LiteLLM, one of OpenClaw's own dependencies, got compromised in a supply chain attack that exfiltrated API keys and cloud credentials.

The agent race belongs to Anthropic, OpenAI, Google, and Microsoft. Let them race. I stopped trying to compete with them and started building the onboarding instead.

Full framework in the post:

https://juanjofuchs.github.io/ai-development/2026/03/31/stop-building-another-claude-learn-how-to-effectively-onboard-one-into-your-organization-instead.html

#AI #EnterpriseAI #MCP #ClaudeCode #AgenticAI

---

## X/Twitter Thread

Tweet 1:
Most enterprise teams in 2025 were building custom multi-agent systems. I was one of them.

Then Claude Code shipped those features natively. Then Codex. Then Gemini. The agents are commodity now.

The differentiator is how you onboard them:

Tweet 2:
→ What they see (KPIs, work, knowledge)
→ What they do (systems, processes, org)
→ What they must NOT do (boundaries at each autonomy level)

Amazon skipped autonomy levels. 6.3M lost orders. The self-driving industry figured this out years ago with SAE levels.

https://juanjofuchs.github.io/ai-development/2026/03/31/stop-building-another-claude-learn-how-to-effectively-onboard-one-into-your-organization-instead.html

{% endcomment %}

## LinkedIn Analytics — Day 1 (2026-04-01)

**Data source:** LinkedIn Analytics export (22 hours live, published Mar 31 2:03 PM)

### Performance Snapshot

| Metric | Value | Q1 Avg (16 posts) |
|--------|-------|--------------------|
| Impressions | 202 | 781 |
| Members reached | 107 | — |
| Reactions | 5 | — |
| Comments | 0 | — |
| Saves | 1 | — |
| Link clicks | 1 | — |
| Engagement (react+save) | 6 | 10.1 |
| Engagement rate | **2.97%** | 1.39% |
| Profile viewers | 2 | — |
| Followers gained | 0 | — |

### Demographics

| Category | Top Value | % |
|----------|-----------|---|
| Seniority | Senior | 37% |
| Seniority | Entry | 32% |
| Seniority | Director | 8% |
| Industry | Software Development | 27% |
| Industry | IT Services | 25% |
| Location | NYC Metro | 12% |
| Location | Lima Metro | 12% |
| Company | TRANZACT | 9% |
| Job title (top) | Founder | — |
| Company size (top) | 1001-5000 / 10,001+ (tie) | 17% each |

### Analysis

**Strong engagement rate (2.97%)** — would rank #3 in Q1, behind Editorial Loop (3.13%) and Compaction Tools (2.56%). The people who see it are acting on it. 1 save early correlates with deep-engagement posts in Q1 data.

**Slow distribution (202 impressions in 22 hours).** Top Q1 posts hit 1,600-2,300 in their first week. 0 comments, 0 reposts, 0 sends — the social amplification signals that trigger algorithmic distribution aren't firing.

**Likely causes of modest reach:**
1. Framework/strategy category — Q1 avg for this category was 1,004 impr, below how-to (1,438) and tool launches (1,138)
2. No external event to ride — post references MCP, OpenClaw, Kiro but isn't tied to a breaking news moment
3. Published Monday March 31 (end of quarter)
4. Long title may reduce scroll-stopping power

**Tracking:** If impressions don't cross 500 by Day 3, likely settles into "high engagement rate, modest reach" bucket (like Compaction Tools, ccburn, Editorial Loop). SEO potential for "enterprise AI onboarding," "MCP enterprise," "AI agent governance" query clusters — check GSC in 2-3 weeks.