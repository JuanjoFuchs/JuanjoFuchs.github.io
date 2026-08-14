---
layout: post
title: "Proof of Effort"
description: "Detecting AI in the output is the wrong target. The judgment a person exercises during the session is the measurable one, and a tool could sign it."
date: 2026-08-18 09:00:00 -0400
categories: ai
tags: [ai, authorship, writing, detection, agentic-workflow]
author: JuanjoFuchs
permalink: /blog/proof-of-effort
image: /assets/proof-of-effort-hero.png
---

![A hand rests on a long roll of handwritten work while a stranger stamps the printed page SLOP in red](/assets/proof-of-effort-hero.png)

I think we're putting the effort in the wrong part of the problem with trying to catch AI slop. Catching the machine in the finished text tells you almost nothing you actually wanted to know about it.

I think there's a better way, and it's the opposite direction. Score the thinking that went in. Judge how much of it the person kept and how much they handed to the model, then write that score to a public append-only log, the same kind of thing that already stops anyone forging an HTTPS certificate. Not a blockchain, not a company's database. A record a stranger can check for themselves instead of taking my word for it.

That's what the last two weeks pushed me to. On July 30 LinkedIn shipped a button that lets anyone report a post as AI slop, and three days later Anthropic started marking the text Claude writes so it can be identified as machine-generated. My feed spent the two weeks after celebrating both. Two products, three days apart, aimed at the same place: the artifact, and whether a machine's fingerprints are on it.

## The fingerprint can't do the job people want from it

Anthropic is honest about what the mark is. It's a disclosure mechanism built for the EU AI Act, and they never claimed it measures effort or depth of authorship. Their [own support article](https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content) says the output "can carry a Claude mark even if the underlying ideas, text, or data originated from another source." So the mark can't separate "Claude wrote this" from "Claude touched this." Nobody outside Anthropic can read it yet anyway.

The detectors people fall back on are worse. [Seven of them](https://arxiv.org/abs/2304.02819) run over essays by non-native English speakers produced a 61.3% false-positive rate, and enriching the vocabulary dropped it to 11.6%. They score linguistic sophistication and report it as authorship. I write in my second language every day, so that one doesn't read as abstract to me.

Every one of these instruments is pointed at the finished text, and whether a machine's fingerprints are on the words tells you nothing about whether anybody thought before writing them.

## It doesn't matter if the AI writes the output

What matters is how much thought and effort came into the AI, the context you gave it, the corrections you made, the directions you rejected. That question has a property the detection question doesn't have: the answer gets written down while it's happening.

I wrote [The LLMphant in the Room](https://juanjofuchs.com/blog/llmphant) back in November and it made half of this argument already: authorship lives in the ideas, not the words, and what counts is whether you own what's being said. I still believe that. It also has a hole in it I couldn't close at the time, which is that ownership is something you assert about yourself. I gave the reader no way to check it.

## What the session log already records

Nearly every AI chat leaves a log. The context you supplied, the answers you rejected, the moment you tell it that it went the wrong way and to look again. In the session that produced this post, three places in my vault were proposed as the home of an old idea of mine, I rejected two, and the hint I gave found the third. Each was a few seconds of typing and together they decided the shape of the piece.

That's the signal, and it's already sitting in a timestamped file on my disk that nobody reads.

There is real math for something adjacent. [Xie et al.](https://arxiv.org/abs/2408.14792) measure how much the human's input *determined* the output. That is not the same quantity. A long lazy copy-pasted spec determines a lot and shows no judgment at all, and a three-word correction determines almost nothing and can be the reason the work landed. Determination is not thinking, and thinking is what I want to count.

## Proof of effort

So read the log instead, and grade every turn on three things.

**What kind of effort it was.** Cognitive load comes in three flavours, and Sweller named them decades before any of this: intrinsic load is the difficulty the problem genuinely has, extraneous load is everything you burn fighting the tool instead of the problem, and germane load is the effort that actually builds understanding. Germane is the one worth paying for. Extraneous is waste no matter how exhausting it felt.

**What you were doing.** Framing the problem, supplying context the model couldn't have, evaluating what came back, correcting it, or handing the task over.

**How much judgment you delegated.** This is the one that matters most, and it runs from keeping the decision entirely to saying "you choose." Two people can send the same number of messages and sit at opposite ends of it.

A small model does the labelling. It reads each of your turns with the eight before it for context and nothing after, because judging someone on information they didn't have yet is hindsight, not measurement. None of the three dimensions needs the model's internals. They're readable from what the human said, which is why this works on chat logs that were never built to be scored.

Then compute a fingerprint from the result, have the harness sign it, and publish it per turn while the session is still running, to a ledger anyone can verify. I want you to check what a tool observed and signed rather than trust my account of my own thinking. Same trust structure as Anthropic's watermark, pointed at the input instead of the output, with no single vendor holding the key.

Publishing as it happens is what stops you fabricating a session afterwards. It does not stop you fabricating one live. If I control the harness I can have a model play both sides, invent the corrections and the dead ends, and stream that performance to the ledger in real time for the price of a few extra API calls. Timestamps alone don't fix that, and I'd rather say so than let the ledger carry more weight than it holds.

What would fix it is making each link genuinely slow to compute, so the chain can't be produced faster than the session it claims to describe. That's the piece I haven't built, and somebody else already has.

Pieces of this exist already and I'd be lying if I claimed the shape was mine alone. [ZK-PoP](https://arxiv.org/abs/2603.00179) built the expensive-to-forge chain, but it only certifies that a human was there. [SWE-chat](https://arxiv.org/abs/2604.20779) classified human pushback across 6,000 sessions, but read it as a measure of the agent, not the person. [C2PA](https://spec.c2pa.org/specifications/specifications/2.1/specs/C2PA_Specification.html) signs a document's edit history and its spec deliberately refuses to grade it.

Three pieces that don't talk to each other, and none of them score the quality of the judgment. That gap is the only part I'd claim.

## What it costs

Four objections, and I don't have a clean answer to any of them.

Whoever signs becomes the authority. Asking people to trust Anthropic or OpenAI to certify their thinking is the same key-holder problem I just complained about in the watermark, wearing a different hat. A public ledger fixes verification, it does nothing about who gets to run the classifier.

Forgery gets expensive, it doesn't get impossible. A model can generate a convincing session, and the better the models get the cheaper that generation gets. Expensive-to-fake is how a signal works, and expensive slides toward cheap over time.

Effort isn't quality. [Paul Deane's keystroke work at ETS](https://files.eric.ed.gov/fulltext/EJ1109294.pdf) found that longer pauses correlate with *lower* scoring essays, so any score built on visible deliberation rewards labored inefficiency and rates a diligent novice above a fluent expert. Publish it as a metric and Goodhart eats it inside a month, people will perform the corrections instead of making them.

And I might be biased and defensive here. I write with AI, and I'm proposing a standard under which what I do counts as real work. Saying that out loud doesn't disable the bias, it just means you should weigh the argument on its own and not take my word for it.

## Measuring the session that produced this

I built the scoring half and ran it over the session that produced this post. The classifier and the hash chain exist. The signing and the ledger don't, so what follows is a number and a chain sitting on my own disk, which is exactly as trustworthy as I am until the other half is built.

Averaged across every turn I took, I kept about 85% of the decisions myself rather than handing them to the model. Roughly 39% of the effort was germane, the kind that builds understanding. Roughly 31% was extraneous, and I know exactly what that was: half an hour lost to a bug in my own microphone setup. Nobody told it that. It read the log and found it.

The arithmetic is deliberately dull, because a score you can't take apart is a score nobody should trust. The 39% is simply the share of turns labelled germane. The 85% is the average of the delegation labels after weighting them: keeping the decision counts as one, handing it over entirely counts as zero, and the two levels in between are worth 0.75 and 0.35.

Those weights are a judgment call, and they're mine. That is the part I most want argued with, which is why the rubric ships as data with a version stamp rather than buried in code. Change the weights and you change the number, so the number is only ever meaningful next to the rubric that produced it.

Treat the numbers as illustrations, not measurements.

## Where this leaves me

Proof of authorship is unfixable, and the tooling being young has nothing to do with it. The mark can't tell writing from proofreading. The detectors punish people writing in a second language. A verification key fixes neither, so Anthropic can ship one next quarter and both of those stay exactly where they are.

Proof of effort might not be. What I have is one session, one number, and a classifier that gets about half its calls wrong, which is a long way from a standard.

It's pointed at the part of the problem where the thinking actually happens though, and that's more than I can say for the report button.

{% comment %}
## LinkedIn Post
MEDIA: /assets/proof-of-effort-social.png
ALT: A hand rests on a long roll of handwritten work while a stranger stamps the printed page SLOP in red

I think we're putting the effort in the wrong part of the problem with trying to catch AI slop.

On July 30 LinkedIn shipped a button that lets anyone report a post as AI slop. Three days later Anthropic started watermarking the text Claude writes. Both are aimed at the finished artifact, and the finished artifact can't answer the question people are actually asking.

📌 Anthropic's own support article says the output can carry a Claude mark even if the ideas, text and data originated somewhere else. The mark can't separate "Claude wrote this" from "Claude touched this."

📌 Nobody outside Anthropic can read it yet. Without a verification key, LinkedIn can't check it and neither can the person hitting report.

📌 Seven detectors run over TOEFL essays by non-native English writers produced a 61.3% false-positive rate. Enrich the vocabulary and it drops to 11.6%, so they're scoring linguistic sophistication and reporting it as authorship.

So I built the opposite thing.

It reads the log of an AI session and grades each turn on the thinking behind it: whether I supplied real context, whether I evaluated what came back, whether I corrected it, or whether I just handed the decision over. It scores the judgment I kept, not the words either of us produced. Then it chains those turns into a hash, so the record can't be quietly rewritten afterwards.

The point is that you don't have to believe me. The tool observes, the tool signs, and a stranger checks. Same trust structure as Anthropic's watermark, pointed at the input instead of the output.

I ran it on the session that produced this post. Averaged across every turn I took, I kept about 85% of the decisions myself rather than handing them to the model. The classifier behind that number gets roughly half its calls wrong, which was the most useful thing it told me.

Proof of Effort 👇
https://juanjofuchs.com/blog/proof-of-effort

Nobody has to read your session. Would you publish the fingerprint of how much judgment went into your last piece of work?

#AI #ClaudeCode #Writing #Authorship

---

## X/Twitter Thread
MEDIA: /assets/proof-of-effort-social.png
ALT: A hand rests on a long roll of handwritten work while a stranger stamps the printed page SLOP in red

Tweet 1 (Hook):
I think we're putting the effort in the wrong part of the problem with trying to catch AI slop.

LinkedIn shipped a report-as-AI-slop button on July 30. Anthropic started watermarking Claude's text three days later. Both aimed at the output. 🧵

Tweet 2:
Anthropic's own support article: the output can carry a Claude mark even if the ideas, text or data came from another source. The mark can't separate "Claude wrote this" from "Claude touched this."

Tweet 3:
Nobody outside Anthropic can read the mark yet either. No verification key exists, so LinkedIn can't check it and neither can the person hitting report.

Tweet 4:
Seven detectors over TOEFL essays by non-native English writers: 61.3% false positives, one detector flagging 97.8%. Richer vocabulary drops it to 11.6%. They score linguistic sophistication and report it as authorship.

Tweet 5:
So I built the opposite thing. It reads the session log and grades each turn on the thinking behind it: context I supplied, calls I made, corrections I issued, decisions I handed over. It scores the judgment, not the words.

Tweet 6:
The tool observes, the tool signs, a stranger checks. Nobody has to read your session to see the result.

Pieces exist already: ZK-PoP, SWE-chat, C2PA. None score judgment quality. That's the only part I'd claim.

Tweet 7:
I ran it on the session behind this post. Averaged over every turn, I kept about 85% of the decisions myself. The classifier behind that is half wrong, which was the useful part.

Proof of Effort
https://juanjofuchs.com/blog/proof-of-effort

#AI #ClaudeCode

---

## Newsletter
SUBJECT: Proof of Effort
PREVIEW: Everyone is checking whether a machine wrote it. Nobody is checking whether anybody thought.
MEDIA: /assets/proof-of-effort-hero.png
ALT: A hand rests on a long roll of handwritten work while a stranger stamps the printed page SLOP in red

I think we're putting the effort in the wrong part of the problem with trying to catch AI slop.

LinkedIn shipped a button that lets anyone report a post as AI slop, and three days later Anthropic started marking the text Claude writes. My feed spent two weeks celebrating both, and I kept landing on the same thought.

**Why the fingerprint can't work.** Anthropic's own documentation says the output carries a Claude mark even when the ideas came from somewhere else, so it can't separate "Claude wrote this" from "Claude touched this." Nobody outside Anthropic can read the mark yet anyway. And the detectors people fall back on flagged 61.3% of TOEFL essays by non-native English writers as machine-written. I write in my second language every day, so that one isn't abstract to me.

**What I'd measure instead.** Not the text, the session. Nearly every AI chat already records the context you supplied, the answers you rejected, the corrections that changed the direction of the work. That's the judgment, and it's already sitting in a timestamped file nobody reads.

**How it would work.** A classifier reads the log and grades each turn on the thinking behind it. The harness runs it and signs the result, and the score gets published while the session is still open, so it can't be assembled afterwards. You publish the fingerprint, never the transcript. The tool observes, the tool signs, a stranger checks. **Proof of effort instead of proof of authorship.**

**What it costs.** Whoever signs becomes the authority, which is the same key-holder problem I just complained about. Publishing live stops you faking a session afterwards, not faking one in real time. Effort isn't quality, and better writers pause less. And I'm the guy proposing a standard under which my own work counts, which you should weigh accordingly.

**What I actually have.** One session, scored: averaged across every turn, I kept about 85% of the decisions myself. From a classifier that gets roughly half its calls wrong, which was the most useful thing it told me.

That's the whole argument. The post has the sources, the prior art it doesn't replace, and the longer version of every objection above.

---
INSTRUCTIONS:
- LinkedIn: Post Tuesday-Thursday. URL in post body (the Comments API is gated behind LinkedIn's Community Management partner program, which individual developers can't access).
- X/Twitter: Post as thread. Media attached to first tweet. Link only in last tweet.
- MEDIA for LinkedIn and X is the titled social card (/assets/proof-of-effort-social.png). The newsletter uses the clean hero, because the email already shows the subject line and the headline.
{% endcomment %}