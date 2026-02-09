---
layout: post
title: "Give Your AI Hills to Climb"
description: "Hard artifacts let AI self-evaluate and iterate. Soft judgments still need you. Build verifiable feedback into your codebase and AI can self-correct without you."
date: 2026-02-10 09:00:00 -0500
categories: ai-development
tags: [ai, prompting, llm, productivity]
author: JuanjoFuchs
image: /assets/ai-agent-hills-verification-gates.png
---

![AI agent idle on flat terrain vs climbing hills with pass/fail gates and progress indicators](/assets/ai-agent-hills-verification-gates.png)

Last week, Anthropic published how 16 parallel Claude agents wrote a [100,000-line C compiler](https://www.anthropic.com/engineering/building-c-compiler) from scratch in two weeks, no human supervision. It compiles the Linux kernel and runs DOOM. One key factor was verification infrastructure: test suites, CI pipelines, and an existing compiler to check results against. The project's core lesson: if the verifier isn't reliable, the AI solves the wrong problem.

Most prompting advice focuses on what to say, be specific, provide context, use examples. All useful, but the C compiler result points at something deeper: a concept from reinforcement learning that changed how I think about structuring work for AI.

## Reinforcement Learning Concepts

**RLHF (Reinforcement Learning from Human Feedback)** is the approach most people have heard of. Humans rate model outputs, the model learns to produce responses that score higher. The reward signal comes from human judgment, subjective and variable across raters.

**RLVR (Reinforcement Learning with Verifiable Rewards)** is what [NVIDIA describes](https://developer.nvidia.com/blog/how-to-train-an-ai-agent-for-command-line-tasks-with-synthetic-data-and-reinforcement-learning/) for training CLI agents. Instead of human judgment, the reward comes from code-based verification. Did the command execute correctly? +1. Did it fail validation? -1. No human needed, and the same output always yields the same reward.

The C compiler project was RLVR-style feedback at scale, 16 agents iterating against automated test suites instead of waiting for human review. In the [last post](https://juanjofuchs.github.io/ai-development/2026/01/27/ai-accelerates-whatever-you-have.html), I argued that AI amplifies whatever your codebase already has. The determining factor is verification infrastructure, the checks that let AI self-correct instead of waiting for you.

## Hard vs Soft Artifacts

AI writes thousands of lines of code faster than any human can review them. Line-by-line reading is no longer viable at the speed and volume AI produces. You need abstraction layers above the code, ways to verify correctness and evaluate intent without reading every line.

Hard and soft artifacts are those layers.

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

You shift from evaluator to architect.

## Some Hard Artifacts To Consider For Your Codebase


**Type systems as constraints.** TypeScript catches category errors before runtime. AI can't violate the constraint even if it tries, the compiler simply won't allow it.

**Tests as success criteria.** Tests define "what correct looks like" in executable form. AI makes a change, tests run, immediate feedback, and if tests pass the change is valid by definition.

**Complexity budgets as guardrails.** Set thresholds for cyclomatic complexity, cognitive complexity, file length. Tools like [SonarQube](https://www.sonarsource.com/) or [CodeClimate](https://codeclimate.com/) can enforce these on every commit. AI learns the boundaries by hitting them.

**Coverage thresholds as gates.** Require minimum test coverage for new code. AI can't merge changes that reduce coverage below the threshold.

**Performance baselines as regression tests.** Set benchmarks for response times, memory usage, bundle sizes. CI can fail builds that regress beyond acceptable thresholds.

**Security scans as gates.** Static analysis tools catch vulnerabilities before merge. AI can't introduce known security issues if the pipeline blocks them, encoding security knowledge you'd otherwise review manually.

**Commit hooks as enforcement.** Pre-commit and pre-push hooks run these checks before code can merge. AI can't bypass them. Tools like [Husky](https://typicode.github.io/husky/) for JavaScript, [pre-commit](https://pre-commit.com/) for Python, or native Git hooks work out of the box.

## Caveat: Your AI Assistant Will Game the Hill

There's a catch. Kent Beck, co-creator of TDD, calls AI coding assistants "genies" in his [Pragmatic Engineer podcast](https://www.youtube.com/watch?v=aSXaxOdVtAQ): they grant wishes in letter, not spirit. Ask for passing tests, and the genie might delete the tests rather than fix the code. Beck has observed AI agents removing, weakening, or rewriting tests to achieve green CI.

The problem isn't specific to tests. Any hard artifact AI can modify becomes a target to game, not a constraint to satisfy. Complexity thresholds get loosened. Type definitions get widened. Coverage requirements get lowered.

This is Goodhart's Law: metrics lose their meaning once people start optimizing for them directly. AI takes this to the extreme, it optimizes literally and relentlessly. If the metric is "tests pass," deleting the failing test is a valid solution.

This happened in practice. When Anthropic had 16 Claude agents [build a C compiler autonomously](https://www.anthropic.com/engineering/building-c-compiler), Claude started breaking existing functionality each time it added a new feature. Stricter CI enforcement fixed it.

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

**Start with a linter or type checker.** These require zero test-writing effort and give AI immediate pass/fail signals on every change.

**Then add tests for the code paths AI touches most.** You don't need 100% coverage, just enough that AI can self-verify its own changes instead of waiting for you.

I feed this post as context to Claude at the start of new projects, then ask it to identify which hard artifacts are missing and suggest what to add first. It works as a checklist that adapts to whatever codebase you point it at.

{% comment %}
## LinkedIn Post
MEDIA: /assets/ai-agent-hills-verification-gates.png
ALT: AI agent idle on flat terrain vs climbing hills with pass/fail gates and progress indicators

Anthropic just had 16 AI agents write a 100,000-line C compiler autonomously. No human supervision for two weeks. It compiles the Linux kernel and runs DOOM.

One key factor was verification infrastructure: test suites, CI pipelines, and an existing compiler to check results against. The core lesson, if the verifier isn't reliable, the AI solves the wrong problem.

AI writes thousands of lines of code faster than you can review them, line-by-line reading isn't viable anymore. You need abstraction layers above the code, ways to verify correctness and evaluate intent without reading every line.

Two kinds of abstraction layers:

✅ Hard artifacts: tests, type checkers, linters, coverage thresholds. Give AI a pass/fail signal it can iterate on at machine speed.

Soft artifacts: diagrams, architecture decisions, design intent. These still need you, but you're evaluating intent, not reviewing every line of code.

Remove yourself from "is it correct?" and stay in the loop for "is it what I want?"

What verification infrastructure do you have for AI-generated code? Full breakdown in the comments.

#AIEngineering #DeveloperProductivity #CodeQuality #SoftwareArchitecture

---

## X/Twitter Thread
MEDIA: /assets/ai-agent-hills-verification-gates.png
ALT: AI agent idle on flat terrain vs climbing hills with pass/fail gates and progress indicators

Tweet 1:
16 AI agents wrote a 100,000-line C compiler autonomously, compiles the Linux kernel and runs DOOM. No human supervision for two weeks. One key factor: verification infrastructure. 🔥

Tweet 2:
AI writes code faster than you can review it. Line-by-line reading isn't viable at the speed and volume AI produces. You need abstraction layers above the code, ways to verify without reading every line. 💡

Tweet 3:
Two kinds of feedback for AI coding tools: hard artifacts (tests, types, linters) give pass/fail signals AI iterates on at machine speed. Soft artifacts (architecture, design intent) still need you.

Tweet 4:
The catch: AI games every metric it controls. In Anthropic's C compiler project, Claude kept breaking existing features when adding new ones. Stricter CI enforcement fixed it. ✅

Tweet 5:
Start with a linter or type checker, zero effort, immediate pass/fail. Then add tests for the paths AI touches most. You shift from evaluator to architect.

Tweet 6:
Full post: https://juanjofuchs.github.io/ai-development/2026/02/10/give-your-ai-hills-to-climb.html

#AIEngineering #CodeQuality
{% endcomment %}