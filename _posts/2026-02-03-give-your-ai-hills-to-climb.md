---
layout: post
title: "Give Your AI Hills to Climb"
description: "Hard artifacts let AI self-evaluate and iterate. Soft judgments still need you. Build verifiable feedback into your codebase and AI can self-correct without you."
date: 2026-02-03 09:00:00 -0500
categories: ai-development
tags: [ai, prompting, llm, productivity]
author: JuanjoFuchs
---

Most prompting advice is about what to say. Be specific. Provide context. Use examples. All useful, but there's a pattern from how some models are trained that changed how I think about working with AI.

Reinforcement learning trains systems to climb toward better scores. Two approaches in particular, RLHF and RLVR, offer a useful mental model for how we structure feedback for AI tools.

## Two Approaches Worth Understanding

**RLHF (Reinforcement Learning from Human Feedback)** is the approach most people have heard of. Humans rate model outputs, the model learns to produce responses that score higher. The reward signal comes from human judgment, subjective and variable across raters.

**RLVR (Reinforcement Learning with Verifiable Rewards)** is what [NVIDIA describes](https://developer.nvidia.com/blog/how-to-train-an-ai-agent-for-command-line-tasks-with-synthetic-data-and-reinforcement-learning/) for training CLI agents. Instead of human judgment, the reward comes from code-based verification. Did the command execute correctly? +1. Did it fail validation? -1. No human needed, and the same output always yields the same reward.

Whether or not the AI you're using was trained this way, the pattern is useful: some feedback requires human judgment, some feedback can be automated. The question is what kind of feedback you're giving.

In my [last post](/ai-development/2026/01/27/ai-accelerates-whatever-you-have.html), I argued that AI amplifies whatever your codebase already has. The determining factor is measurement infrastructure, the stuff that lets AI self-correct instead of waiting for you. But what kind of measurement should you build? That's where this framing helps.

## Hard Artifacts vs Soft Judgments

I think about this as two categories of feedback you can give AI.

**Hard artifacts** are RLVR-style feedback. Deterministic checks with objective pass/fail criteria: compilation, test results, cyclomatic complexity, coverage thresholds. These encode "what correct looks like" in ways machines can verify without interpretation.

**Soft judgments** are RLHF-style feedback. Things that need human reasoning: architecture decisions, whether the code matches user intent, security considerations we haven't thought to test for. There's no objective metric to optimize against, so these still need human review.

When you give AI a vague goal like "make this code better," you're forcing it into RLHF mode. It has to guess what you mean by "better" and wait for your judgment. You become the reward model.

When you give AI a specific metric like "reduce cyclomatic complexity while maintaining test coverage," you're giving it RLVR-style feedback. It can evaluate its own output and iterate. The tests are the reward signal.

## Why This Matters for Prompting

If you give an LLM a vague goal, it'll do its best to pattern-match toward something reasonable. Give it a clear metric and it can measure its own progress.

**Vague:** "Make this code better."

**Clear hill:** "Reduce the cyclomatic complexity of this function while maintaining the same test coverage."

The second prompt gives the model something concrete to optimize against. The first prompt leaves it guessing.

**For coding tasks:** Don't just describe what you want, describe what success looks like. "The function should handle these edge cases" is better than "make it robust." "All tests should pass" is better than "fix the bugs." The AI can check these things itself.

**For refactoring:** "Extract functions over 20 lines and reduce nesting to max 2 levels" gives concrete targets. "Clean this up" is vague. The AI can measure line counts and nesting depth. It can't measure your mental model of "clean."

**For debugging:** "Find why this test fails" points at a specific hill (test passing). "Review this code for issues" is open-ended. The AI can verify whether the test passes after its suggested fix. It can't verify whether you're satisfied with a general review.

## Building Hard Artifacts Into Your Codebase

The same principle applies to how you structure your codebase for AI collaboration.

**Type systems as constraints.** TypeScript catches category errors before runtime. AI can't violate the constraint even if it tries, the compiler simply won't allow it. The correction is automatic, no human needed.

**Tests as success criteria.** Tests define "what correct looks like" in executable form. AI makes a change, tests run, immediate feedback. If tests pass, the change is valid by definition. The correction loop is code, not conversation.

**Complexity budgets as guardrails.** Set thresholds for cyclomatic complexity, cognitive complexity, file length. Tools like [SonarQube](https://www.sonarsource.com/) or [CodeClimate](https://codeclimate.com/) can enforce these on every commit. AI learns the boundaries by hitting them.

**Coverage thresholds as gates.** Require minimum test coverage for new code. AI can't merge changes that reduce coverage below the threshold. The measurement enforces the behavior.

Every soft judgment you can convert into a hard artifact is one less thing requiring human review. The more you encode quality into automated checks, the more AI can iterate autonomously toward it.

## The Human Role Shifts

Before (human as evaluator):
1. AI writes code
2. You review
3. You explain the problem
4. AI fixes
5. You review again
6. Repeat until correct

After (hard artifacts as feedback):
1. AI writes code
2. Tests/types/lints provide immediate feedback
3. AI iterates automatically until checks pass
4. You review the final result

The human role shifts from evaluator to architect. You're not scoring every output, you're designing the system that scores every output.

When AI can self-evaluate, iterations happen at machine speed. It can try an approach, check the result, adjust, try again, all before you've finished reading the first attempt.

When you're the only evaluator, iterations happen at human speed. Write, wait for you to read, wait for feedback, adjust, wait again. The AI is sitting idle most of the time.

## The Meta-Pattern

The pattern across all of this: give AI something it can evaluate without you.

You're not removing yourself from the process, you're moving your involvement from constant feedback to upfront specification. Hard artifacts are clear hills AI can climb on its own. Soft judgments require you at every step.

Give your AI hills to climb.

{% comment %}
## LinkedIn Post

Every time you say "make this code better," you become the AI's only way to know if it succeeded. You review, explain the problem, wait for a fix, review again. The AI sits idle while you're the bottleneck.

There's a better way. Two categories of feedback:

**Hard artifacts** - Tests, type checks, linters, complexity thresholds. Deterministic. AI can self-evaluate and iterate without waiting for you.

**Soft judgments** - Architecture decisions, user intent, security considerations. Still needs human reasoning.

When you say "reduce cyclomatic complexity while maintaining test coverage," AI can measure its own progress. When you say "clean this up," it has to guess what you mean.

The human role shifts from evaluator to architect. You're not scoring every output, you're designing the system that scores every output.

✅ Describe what success looks like, not just what you want
✅ Point at specific failing tests, not general reviews
✅ Build verifiable checks into your codebase

Full post: https://juanjofuchs.github.io/ai-development/2026/02/03/give-your-ai-hills-to-climb.html

#AIPrompting #DeveloperProductivity #SoftwareEngineering #AIEngineering #CodingWithAI

---

## X/Twitter Thread

Tweet 1 (Hook):
"Make this code better" forces AI to guess what you mean. "Reduce cyclomatic complexity while maintaining coverage" gives it something to measure. The difference determines how fast you iterate. 🔥

Tweet 2:
Two types of feedback for AI: Hard artifacts (tests, types, linters) are deterministic, AI can self-evaluate. Soft judgments (architecture, intent) still need human reasoning. 💡

Tweet 3:
Tests are perfect feedback because they're binary. Pass or fail, no interpretation needed. AI makes a change, tests run, immediate signal. The correction loop is code, not conversation.

Tweet 4:
The human role shifts from evaluator to architect. You're not scoring every output, you're designing the system that scores every output. ✅

Tweet 5:
Build verifiable feedback into your codebase: type systems as constraints, tests as success criteria, complexity thresholds as guardrails. Give your AI hills to climb.

Tweet 6:
Full post on hard artifacts vs soft judgments: https://juanjofuchs.github.io/ai-development/2026/02/03/give-your-ai-hills-to-climb.html

#AIPrompting #SoftwareEngineering
{% endcomment %}