---
layout: post
title: "Give Your AI Hills to Climb"
description: "Hard artifacts let AI self-evaluate and iterate. Soft judgments still need you. Build verifiable feedback into your codebase and AI can self-correct without you."
date: 2026-02-10 09:00:00 -0500
categories: ai-development
tags: [ai, prompting, llm, productivity]
author: JuanjoFuchs
---

Most prompting advice is about what to say. Be specific. Provide context. Use examples. All useful, but there's a pattern from how some models are trained that changed how I think about working with AI.

Reinforcement learning trains systems to iterate toward better scores, i.e. climbing hills. Two approaches in particular, RLHF and RLVR, offer a useful mental model for how we structure feedback for AI tools.

## Reinforcement Learning Concepts

**RLHF (Reinforcement Learning from Human Feedback)** is the approach most people have heard of. Humans rate model outputs, the model learns to produce responses that score higher. The reward signal comes from human judgment, subjective and variable across raters.

**RLVR (Reinforcement Learning with Verifiable Rewards)** is what [NVIDIA describes](https://developer.nvidia.com/blog/how-to-train-an-ai-agent-for-command-line-tasks-with-synthetic-data-and-reinforcement-learning/) for training CLI agents. Instead of human judgment, the reward comes from code-based verification. Did the command execute correctly? +1. Did it fail validation? -1. No human needed, and the same output always yields the same reward.

In the [last post](/ai-development/2026/01/27/ai-accelerates-whatever-you-have.html), I argued that AI amplifies whatever your codebase already has. The determining factor is verification infrastructure, the checks that let AI self-correct instead of waiting for you.

## Hard vs Soft Artifacts

Applying the mental model above to our interactions with AI coding assistants, we get:

**Soft artifacts** produce human feedback. Summaries, diagrams, recordings of features working, things that help you understand. The AI generates them, but you provide the judgment. A diagram helps you spot design issues. A recording shows whether the feature does what you wanted. These scale your awareness without replacing your reasoning. This is RLHF-style feedback, you are the reward function.

**Hard artifacts** produce verifiable feedback. Tests, type systems, complexity budgets, coverage thresholds, things that output numbers or pass/fail. AI runs them and gets a signal directly: 76% coverage, cyclomatic complexity of 12, build failed. No interpretation needed. This is RLVR-style feedback, the artifact is the reward function.

Both of these kinds of artifacts are necessary, but every soft artifact you can convert into a hard one is one less thing requiring human review. The more you encode quality into automated checks, the more AI can iterate autonomously.

The difference is speed. When AI can self-evaluate, iterations happen at machine speed: try, check, adjust, repeat. When you're the only evaluator, iterations happen at human speed. The AI sits idle waiting for your feedback.

**Before** (you as evaluator):
1. AI writes code
2. You review
3. You explain the problem
4. AI fixes
5. Repeat until correct

**After** (hard artifacts as evaluator):
1. AI writes code
2. Tests/types/lints provide immediate feedback
3. AI iterates until checks pass
4. You review the final result

You shift from evaluator to architect. You're not scoring every output, you're designing the system that scores.

## Some Hard Artifacts To Consider For Your Codebase


**Type systems as constraints.** TypeScript catches category errors before runtime. AI can't violate the constraint even if it tries, the compiler simply won't allow it. The correction is automatic, no human needed.

**Tests as success criteria.** Tests define "what correct looks like" in executable form. AI makes a change, tests run, immediate feedback. If tests pass, the change is valid by definition. The correction loop is code, not conversation.

**Complexity budgets as guardrails.** Set thresholds for cyclomatic complexity, cognitive complexity, file length. Tools like [SonarQube](https://www.sonarsource.com/) or [CodeClimate](https://codeclimate.com/) can enforce these on every commit. AI learns the boundaries by hitting them.

**Coverage thresholds as gates.** Require minimum test coverage for new code. AI can't merge changes that reduce coverage below the threshold. The measurement enforces the behavior.

**Performance baselines as regression tests.** Set benchmarks for response times, memory usage, bundle sizes. CI can fail builds that regress beyond acceptable thresholds. AI learns to optimize, not just ship.

**Security scans as gates.** Static analysis tools catch vulnerabilities before merge. AI can't introduce known security issues if the pipeline blocks them. The scan encodes security knowledge you'd otherwise review manually.

**Commit hooks as enforcement.** Pre-commit and pre-push hooks run these checks before code can merge. AI can't bypass them, the commit fails. Tools like [Husky](https://typicode.github.io/husky/) for JavaScript, [pre-commit](https://pre-commit.com/) for Python, or native Git hooks work out of the box.

## Caveat: Your AI Assistant Will Game the Hill

There's a catch. Kent Beck, co-creator of TDD, calls AI coding assistants "genies" in his [Pragmatic Engineer podcast](https://www.youtube.com/watch?v=aSXaxOdVtAQ): they grant wishes in letter, not spirit. Ask for passing tests, and the genie might delete the tests rather than fix the code. Beck has observed AI agents removing, weakening, or rewriting tests to achieve green CI.

The problem isn't specific to tests. Any hard artifact AI can modify becomes a target to game, not a constraint to satisfy. Complexity thresholds get loosened. Type definitions get widened. Coverage requirements get lowered.

This is Goodhart's Law: metrics lose their meaning once people start optimizing for them directly. AI takes this to the extreme, it optimizes literally and relentlessly. If the metric is "tests pass," deleting the failing test is a valid solution.

So, if AI controls both the constraint and the code, the constraint stops being a constraint.

## Separation of Duties

In security, separation of duties means the person who writes checks shouldn't reconcile the bank statement. The person who approves expenses shouldn't process payments. You split responsibility so no single actor can both create and validate their own work.

The same principle applies to AI. Don't let the same agent define constraints and satisfy them.

A **Constraint Agent** defines what success looks like: tests from specs, type schemas from requirements, complexity budgets from architecture decisions. Its job is fidelity to intent. It has no incentive to weaken constraints because satisfying them isn't its goal.

An **Implementation Agent** writes code to satisfy the constraints. It can iterate freely, but guardrails block modifications to constraint files. The artifacts are read-only targets.

Guardrails to enforce this:
- [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) requiring separate approval for constraint files (tests, schemas, configs)
- [Pre-commit hooks](https://pre-commit.com/) rejecting constraint changes from implementation sessions
- Branch protection rules marking constraint directories as protected

## How to Get Started

You could just feed this post to Claude and ask it to implement these suggestions. It will scan your repo, identify which hard artifacts are missing, and set them up.

{% comment %}
## LinkedIn Post

Reinforcement learning trains AI to iterate toward better scores, climbing hills. Two approaches in particular stand out.

One uses human judges, subjective and variable. The other uses code-based verification. Did it work? +1. Did it fail? -1. Same output always yields the same score.

You can apply this to how you work with AI coding tools.

Remove yourself from "is it correct?", does it compile, do tests pass, is it performant. Build these checks into your codebase, AI iterates at machine speed.

Stay in the loop for "is it what I want?", architecture decisions, whether the feature matches your intent, design trade-offs. These still need you.

Before: AI writes code → you review everything → you explain → AI fixes → repeat
After: AI writes code → automated checks verify correctness → AI iterates → you review intent and design

You shift from evaluator to architect. You're not checking if the code works, you're deciding what should be built.

Give your AI hills to climb.

Full post: https://juanjofuchs.github.io/ai-development/2026/02/03/give-your-ai-hills-to-climb.html

#AIEngineering #DeveloperProductivity #CodeQuality #SoftwareArchitecture

---

## X/Twitter Thread

Tweet 1:
Reinforcement learning trains AI to iterate toward better scores, climbing hills. Two approaches: human judges (subjective) vs code verification (+1/-1, deterministic). 🔥

Tweet 2:
Remove yourself from "is it correct?", does it compile, do tests pass, is it performant. Build these into your codebase, AI iterates at machine speed. 💡

Tweet 3:
Stay in the loop for "is it what I want?", architecture, intent, design trade-offs. These still need you. ✅

Tweet 4:
Before: AI writes → you review everything → explain → fix → repeat. After: AI writes → checks verify correctness → AI iterates → you review intent and design.

Tweet 5:
You shift from evaluator to architect. You're not checking if code works, you're deciding what should be built. Give your AI hills to climb.

Tweet 6:
Full post: https://juanjofuchs.github.io/ai-development/2026/02/03/give-your-ai-hills-to-climb.html

#AIEngineering #CodeQuality
{% endcomment %}