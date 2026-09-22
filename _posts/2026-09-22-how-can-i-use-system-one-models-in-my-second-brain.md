---
layout: post
title: "How can I use System One models in my second brain?"
description: "A new kind of AI judges instead of writing. I point one at my own second brain, and it beats keyword and semantic search at finding the post I meant."
date: 2026-09-22 09:00:00 -0400
categories: ai
tags: [second-brain, system-one-models, jev, search, ai]
author: JuanjoFuchs
permalink: /blog/system-one-models
image: /assets/system-one-models-hero.png
---

![Ranking my posts on whether human judgment stays valuable: Jev's relevance bars long, semantic short, keyword mostly zero.](/assets/system-one-models-hero.png)


The last few years of AI have been about one kind of model getting bigger, generative models that write, reason, and explain. There's a second kind now. [TypeSafe's Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), out since September 15 2026, is what they call a "System One model," it makes fast structured decisions my code can use directly, and it doesn't write anything. The names borrow from Kahneman, System 1 as quick judgment and System 2 as slow deliberation, we have been using the slow ones all this time.

I have a second brain full of notes and published posts, and a lot of tools around it, like browser tools. Some of them make decisions constantly: browser tools that pick what button to click next, and search that has to find notes whose exact words I've forgotten. So, naturally I wondered whether a judgement model like Jev can help here. I started with the browser tools, then on improving my second brain search over my published posts.

TypeSafe prices Jev at $0.042 per million input tokens, with output tokens free, answers in milliseconds and supports parallel processing. At these metrics I can put judgment inside a tool where I'd never thought of wiring up a generative model because of cost and speed restrictions.


## Games, simulated cars, and compaction

LinkedIn and X are full of very nice demos of Jev.

[@rajatarorabest](https://x.com/rajatarorabest/status/2102077373411733962) had Jev play 100 games of Snake in a single call and ran it head to head with Claude Opus 5. Same quality of play, about 30 times faster and 100 times cheaper.

Other people have Jev playing [Tetris and Pac-Man](https://x.com/AtharvaXDevs/status/2102067600947834960), [Super Mario Bros](https://x.com/faadilhshaik/status/2100086301894881578), and [Mario Kart 64](https://x.com/shreypandya/status/2100606445758898287). Each hands the model a state of the game and a small set of moves, so you can watch it decide in real time.


[@tamarajtran](https://x.com/tamarajtran/status/2100694549362553153) points it at compaction, scoring every tool call and dropping the irrelevant ones, so trimming a long context becomes instant instead of another summarization prompt.

These demos looked cool, but I kept thinking on how I could apply this to my second-brain and my tooling.

## Decisions my code can use

Jev answers three kinds of typed question: Noul, Choice, and Score.

A Noul returns a probability between 0 and 1 for a yes-or-no question. For my search experiment, the question was whether a particular post was about the idea I wanted to find.

A Choice selects from supplied options and returns probabilities and confidence. That's useful in a browser, where my code can offer actions and ask Jev to pick one.

A Score returns a fractional level on an ordered rubric, along with confidence. That gives me a way to evaluate something against criteria I've already defined.

The input is context plus typed questions, and my code owns what happens after the answers come back. I still have to define useful questions and give Jev sensible options.


## Choosing the next browser action

My first experiment was `browser_jev.py`, a CLI that drives my persistent browser. I adapted the action selection from [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast) to work with my playwright based browser tools.

Playwright takes an accessibility snapshot of the page, and without Jev an LLM has to read that whole snapshot and work out what to click next, which takes tens of seconds and a lot of tokens. Jev picks from the same list of actions in milliseconds, a typed choice instead of a paragraph of reasoning. Reading the accessibility tree also beats the agents that work off screenshots, the tree is already text, exactly what Jev takes, so there's no vision model in the loop.

Each step is a single Jev call that bundles several questions at once. One Choice picks the operation, click or type or select, and a separate Choice picks the target for each of those operations.

Here is roughly what one step sends and gets back:

```json
// request
{
  "model": "jev-latest",
  "state": {
    "page": { "url": "…/wiki/Thinking,_Fast_and_Slow", "title": "Thinking, Fast and Slow" },
    "elements": [
      { "index": "1", "role": "link", "label": "Daniel Kahneman" },
      { "index": "2", "role": "link", "label": "Amos Tversky" },
      { "index": "3", "role": "searchbox", "label": "Search Wikipedia" }
    ]
  },
  "questions": {
    "operation":     { "type": "choice", "criteria": { "CLICK": "…", "TYPE_TEXT": "…", "DONE": "…", "BLOCKED": "…" } },
    "click_target":  { "type": "choice", "criteria": { "1": "Daniel Kahneman", "2": "Amos Tversky" } }
  }
}

// response
{
  "answers": {
    "operation":    { "choice": "CLICK", "probabilities": { "CLICK": 0.99, "TYPE_TEXT": 0.005, "DONE": 0.003 }, "confidence": 0.99 },
    "click_target": { "choice": "1",     "probabilities": { "1": 0.95, "2": 0.05 }, "confidence": 0.95 }
  }
}
```


My code then executes the selected action through Playwright. And Claude Opus drives the browser CLI.

That split is the composition I want in my own tools. My big model, the one running the agent, sets the task and steps in whenever something genuinely needs reasoning, and Jev makes the fast, cheap call at each step about what to do next.


## Can Jev beat keyword and semantic search?

For the next experiment, I wanted a comparison where I knew the material well enough to recognize a good answer. We built an isolated index of only my 46 published blog posts with [qmd](https://github.com/tobi/qmd), my local search tool, and ranked them against three conceptual queries.

Keyword search used [BM25](https://en.wikipedia.org/wiki/Okapi_BM25) with hand-picked terms. Semantic search used qmd's local vectors. Jev received a Noul question for each post, asking for the probability that the post was about the query.

Here is the question I asked about each post:

```json
// request, once per post
{
  "model": "jev-latest",
  "state": { "title": "GitHub Stars Are Not Evals", "text": "… the post …" },
  "questions": {
    "relevant": {
      "type": "noul",
      "instructions": "Is this post about whether a popular AI metric or number actually measures real quality?"
    }
  }
}

// response
{ "answers": { "relevant": { "type": "noul", "noul": 0.95 } } }
```


If I know to search for "evals," a title containing that word should be easy to find. The clearest query was "posts that question whether a popular AI metric or number actually measures real quality." I have a post called *GitHub Stars Are Not Evals*. It's directly about that question.

| Method | Rank for *GitHub Stars Are Not Evals* | Score |
|---|---:|---:|
| Keyword | 2 | 0.79 |
| Semantic | 13 | 0.43 |
| Jev | 1 | 0.95 |

Keyword search did well once it had the right terms. Jev put the post first, and semantic search buried it at number 13.

![The metric-quality query ranked three ways: Jev puts GitHub Stars Are Not Evals first, semantic thirteenth, keyword second.](/assets/system-one-search-metric.png)


Semantic search produced the weakest ranking in this experiment. Keyword search worked well when I supplied the right vocabulary, and Jev helped when I asked about the argument a post made.

So, can it beat semantic and keyword search? I think they complement each other. When I know the exact word, keyword is enough. When I remember the idea but not the words, which is most of the time for me, Jev surfaces the right post, because it reads each one and judges how relevant it is instead of matching text or measuring similarity.


## Composing the next experiment

I think the future is the composition of System One and System Two models, playing together for accuracy as much as speed. Both experiments already point that way. In the browser, my big model sets the task and Jev makes the fast calls. In search, the natural split is to let keyword and semantic pull a shortlist, then have Jev judge relevance on that shortlist instead of every post.

I am still evaluating Jev and how it can complement text generation models for use within my second brain, I believe a thousand more use cases are still to be found, where System One models seep into the specifics of deterministic tooling to make and judge smarter decisions.

{% comment %}
## LinkedIn Post
MEDIA: /assets/system-one-models-hero.png
ALT: The three-way search comparison: Jev's relevance bars long, semantic's short and flat, keyword mostly zero.

TypeSafe's Jev has been out for a week and people are having it play Mario, Tetris, Snake, and beat Opus 5 at it. Meanwhile, I have a second brain full of notes, posts, and tools. And I wanted to see how I could leverage this new System One model there.

Jev is a "System One model" because instead of generating text, it makes a fast, typed decision your code can use directly: a yes/no probability, a pick from a list, a score. Answers in milliseconds, cheap enough to put a judgment inside a tool where I'd never wire up a big generative model.


So, I ran two experiments. In my browser tooling: my big model sets the task and Jev picks each action in milliseconds, off the page's accessibility tree, no screenshots and no vision model in the loop. In search, I ranked my 46 posts three ways to find the one that contained a given idea, and I compared the method against keyword and semantic search.

For "which post questions whether an AI metric measures real quality," Jev put the right post first. Keyword found it once I found the exact words to give the search. And semantic, the fancy one, buried it at thirteenth.

I think the future is the composition of System One and System Two models, playing together for accuracy as much as speed. Both experiments already point that way.

I believe a thousand more use cases are still to be found, where System One models seep into the specifics of deterministic tooling to make and judge smarter decisions.

How can I use System One models in my second brain? https://juanjofuchs.com/blog/system-one-models

#AI #SecondBrain #Search #MachineLearning #TypeSafe

---

## X/Twitter Thread
MEDIA: /assets/system-one-models-hero.png
ALT: The three-way search comparison: Jev's relevance bars long, semantic's short and flat, keyword mostly zero.

Tweet 1:
TypeSafe's Jev has been out a week and people have it playing Mario, Tetris, and Snake, even beating Opus 5. It's a "System One model": no text, just a fast typed decision your code can use. So I pointed it at my second brain. 🧠

Tweet 2:
Jev makes a typed decision in milliseconds: a yes/no probability, a pick from a list, or a score. Cheap enough to put a judgment inside a tool where I'd never wire up a big generative model.

Tweet 3:
Experiment one, the browser: my big model sets the task and Jev picks each action in milliseconds, off the page's accessibility tree. No screenshots, no vision model in the loop.

Tweet 4:
Experiment two, search: I ranked my 46 posts three ways to find the one about a given idea. For "which post questions whether an AI metric measures real quality," Jev put the right post first. Semantic, the fancy one, buried it at #13. 💡

Tweet 5:
The future is the composition of System One and System Two models, playing together for accuracy as much as speed. A thousand more use cases where a judge seeps into deterministic tooling. ✅

Tweet 6:
Full write-up: https://juanjofuchs.com/blog/system-one-models

#AI #SecondBrain

---

## Newsletter
SUBJECT: When you remember the idea but not the words
PREVIEW: A new kind of AI judges instead of writing. I pointed one at my own posts to find things I couldn't search for.
MEDIA: /assets/system-one-models-hero.png
ALT: The three-way search comparison: Jev's relevance bars long, semantic's short and flat, keyword mostly zero.

TypeSafe's Jev has been out for a week, and people are having it play Mario, Tetris, and Snake, even beating Opus 5 at the games. I have a second brain full of notes, posts, and tools, so I wanted to see how I could use this new System One model there.

Jev is a System One model. Instead of generating text, it makes a fast typed decision your code can use directly: a yes/no probability, a pick from a list, a score. Answers in milliseconds, cheap enough to put a judgment inside a tool where I'd never wire up a big generative model.

I ran two experiments. In my browser tooling, my big model sets the task and Jev picks each action in milliseconds, off the page's accessibility tree, no screenshots and no vision model in the loop. In search, I ranked my 46 posts three ways to find the one about a given idea, and compared Jev against keyword and semantic search.

For a question about which post argues an AI metric doesn't measure real quality, Jev put the right post first. Keyword found it once I gave it the exact words. Semantic, the fancy one, buried it at thirteenth.

I think the future is the composition of System One and System Two models, playing together for accuracy as much as speed. A thousand more use cases are still to be found, where these models seep into the specifics of deterministic tooling to make and judge smarter decisions.

Read the full post: https://juanjofuchs.com/blog/system-one-models

---
INSTRUCTIONS:
- Hero is a screenshot of JJ's own three-way search comparison artifact (jev_compare.html), cropped to the meters. JJ chose a real screenshot over an AI-generated hero (2026-09-21). A titled social card is optional; MEDIA points at the hero for now.
- Date/slot: publishing 2026-09-22; Recall moves to 2026-09-29 (JJ confirmed 2026-09-21). Bump Recall's date + redeploy, then deploy this.
- Title is deliberately a question (JJ's call); the style gate suggested a declarative, kept interrogative per his instruction.
{% endcomment %}