---
layout: post
title: "Launching voice-tunnel: Talk to Your Coding Agent From Your Phone"
description: "voice-tunnel is a local CLI that gives any coding agent a two-way voice channel to your phone browser. No app, no account, no speech API, no GPU."
date: 2026-08-11 09:00:00 -0400
categories: ai
tags: [ai, voice, cli, agentic-workflow, open-source]
author: JuanjoFuchs
image: /assets/voice-tunnel-demo-poster.png
---

<div style="max-width: 380px; margin: 0 auto;">
  <div style="position: relative; padding-bottom: 179.63%; height: 0; overflow: hidden;">
    <video style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
           controls playsinline preload="metadata"
           aria-label="Phone in hand running the voice-tunnel page while an agent ships a release"
           poster="/assets/voice-tunnel-demo-poster.png">
      <source src="/assets/videos/voice-tunnel-demo.mp4" type="video/mp4">
    </video>
  </div>
</div>

I open-sourced [voice-tunnel](https://github.com/JuanjoFuchs/voice-tunnel) last week, a local CLI that gives your coding agent a two-way voice channel to your phone browser. No app, no account, no cloud speech API, no GPU.

I wanted my own Jarvis, driving my own coding agents by voice while I'm out of the house. Every route to that was somebody else's service: an app from the store, an account to create, a subscription to pay, and my speech leaving my machine to come back as text from someone else's servers. I didn't want to install or pay for any of that.

This has been sitting in [my inbox](https://juanjofuchs.github.io/productivity/2026/07/14/building-your-second-brain-part-5-the-capture-loop.html) since June 18th:

> I want to be able to talk to my claude from my phone. Like I talk on the phone, say stuff and claude says stuff back, but talks fast like a real person [...] I should be able to interrupt. I wonder if something like this exists, I bet it does

It did exist, in pieces. Every ingredient was shipping somewhere, and none of the assemblies were the shape I wanted, so I built the one I wanted.

## Speech got good enough on a CPU

The reason to accept somebody else's service used to be a real one. Recognition wanted a GPU or a datacenter, decent synthesis wanted the same, so sending your voice off the machine was the only route that worked at conversation speed.

Recognition runs on [Parakeet TDT 0.6B v2](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v2), a 600-million-parameter model that [sherpa-onnx ships as an int8 ONNX build](https://k2-fsa.github.io/sherpa/onnx/pretrained_models/offline-transducer/nemo-transducer-models.html). On my 20-core desktop CPU that's a real-time factor of 0.114, so 7.4 seconds of speech comes back transcribed in 0.85 seconds. Synthesis is [Piper](https://github.com/OHF-Voice/piper1-gpl) (GPL-3.0, `pip install piper-tts`), loaded in-process and warmed when the server starts instead of spawned per reply, which made synthesis 7 to 26 times faster depending on the length of the line.

Neither number came from tuning. The first live session did recognition in 2.64 seconds and spoke in the robotic system voice your OS ships with, so the good numbers came from replacing both.

All of it fits in 219 MB at minimum and about 1.0 GB with the better models loaded, and there's no GPU path at all, the word CUDA does not appear anywhere in the source. So the speech half runs on the same machine as the agent, on hardware I already own, and it costs nothing per minute of talking.

## The intelligence is the agent you already run

The tool holds no model and makes no decisions. It turns your speech into lines in a log and text into speech, and the agent that started it does all of the thinking. What answers you is a coding agent with real reasoning, on your own harness, with your tools and your repo already in front of it.

If your AI agent can run Bash, it can use this and it can talk to you.

Claude Code, Codex and Grok have each driven it unchanged, and I wrote an integration for none of them. Driving this is running a command and reading what comes back, which is the one capability all of them already have, so the set of agents that work isn't a list I maintain and it grows without me.

The conversation is three commands. `serve` opens the tunnel, `watch` blocks until you say something and returns every turn after the cursor it was handed, `say` speaks a line back. `voice-tunnel describe` returns all of it as JSON, so onboarding is one call, with no MCP server to configure and no documentation to keep in sync.

The cursor is what makes the split safe. Your agent can spend thirty seconds thinking about the last thing you said and every word you spoke in the meantime is still waiting when it comes back to `watch`.

I'm not claiming nobody else does local voice to a phone. [Paseo](https://github.com/getpaseo/paseo) has 13k stars and [runs the same local Parakeet and Kokoro models on CPU](https://paseo.sh/docs/voice) over your own Claude Code and Codex sessions. The shape I wanted was smaller: a CLI tool that any AI agent which can run Bash can use, and that's it. I didn't want to create another cloud. Paseo is a daemon, native apps and a pairing flow. This is three verbs and a log file. I've written about why I keep picking that side in [Stop Building Another Claude](https://juanjofuchs.github.io/ai-development/2026/03/31/stop-building-another-claude-learn-how-to-effectively-onboard-one-into-your-organization-instead.html).

## Shipping a release while running errands

The video at the top is one real session with the phone in my hand, *"can you hear me"*, then shipping a release end to end. The `skipped Ns` badges are the agent thinking, and I left that time visible instead of cutting it out. Fifteen to thirty seconds a turn is normal, that's a reasoning agent running commands on your machine and it's the trade I took deliberately, the tunnel's own half of the round trip is about two seconds.

I've done the same thing on a Saturday morning away from my desk, phone in hand and nothing else, which is where it stopped being a demo for me.

Two pieces do most of the work of making it feel like a conversation. Turns end when you *sound* finished rather than when a fixed silence timer runs out, so a finished question closes early and a trailing "I was thinking that maybe we could…" gets room. And you can interrupt it mid-sentence, but only you can, a voiceprint has to agree before a reply stops, so the television and the agent's own voice leaking back through the speakers both leave it talking. The gate is a similarity score against my enrolled voiceprint, and one second of audio is enough to run it.

## I sent agents to read the prior art for me

Reading code that isn't yours used to cost a week, so mostly you skip it and rebuild what someone already solved. Before writing anything I sent agents into [VoiceMode](https://github.com/mbailey/voicemode) and [HuggingFace's speech-to-speech](https://github.com/huggingface/speech-to-speech) with instructions to come back with what was worth taking, and that's the part of this build I'd repeat on anything else.

It paid for itself in an afternoon. VoiceMode had built a browser transport and then deleted all of it, which told me local-to-phone was the hard part before I'd written a line. And I'd been hand-tuning a silence timer to decide when you'd stopped speaking, always wrong in one direction or the other, when the HuggingFace repo turned out to run an 8 MB model that decides it by listening to how the sentence lands. It's in the tool now, and that's [Smart Turn](https://github.com/pipecat-ai/smart-turn) above.

## Two commands

```bash
npm install -g @juanjofuchs/voice-tunnel
```

Then paste this to your coding agent:

> Run `voice-tunnel describe` and follow it end to end: install anything missing, start the tunnel under your own name, give me the URL to open on my phone, and then stay in `watch` so you can hear me.

That's the whole handoff. Your agent installs the engines and downloads the models, then starts the server and hands you back a URL. Open it on your phone, tap once, say *"hey Claude, can you hear me?"*

The one thing your agent can't do for you is HTTPS. A phone only hands a web page a microphone in [a secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts), and [`getUserMedia` is HTTPS or localhost only](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia), so a plain LAN address like `http://192.168.1.20:8765` gives you *no microphone at all* rather than a broken one. Run `tailscale serve --bg 8765` and use the address it prints, and your agent will tell you when this applies.

## This post was interviewed through it

The interview that produced this post was held over the tunnel, from my phone, the agent asking me the questions and reading my answers back to me off the turn log. If your AI agent can run Bash, it can use this and it can talk to you.

Repo: [github.com/JuanjoFuchs/voice-tunnel](https://github.com/JuanjoFuchs/voice-tunnel), MIT licensed, published on [PyPI](https://pypi.org/project/voice-tunnel/), [npm](https://www.npmjs.com/package/@juanjofuchs/voice-tunnel) and WinGet. Issues and PRs welcome.

{% comment %}
## LinkedIn Post
MEDIA: /assets/videos/voice-tunnel-demo.mp4
ALT: Phone in hand running the voice-tunnel page while an agent ships a release

I wanted my own Jarvis. I wanted to drive my own coding agents by voice, from my phone, without installing an app, creating an account, or paying anyone per minute of talking.

So I built voice-tunnel, and I did this launch post's interview through the tool itself, from my phone.

📌 Speech recognition and speech synthesis run on a CPU now, fast enough for a real conversation. No GPU. On my desktop, 7.4 seconds of speech comes back transcribed in 0.85 seconds, and the whole setup is about 1 GB of models.

📌 What answers you is not a speech model. It's a coding agent with real reasoning, on your own harness, with your tools and your repo already in front of it.

Claude Code, Codex and Grok have each driven it unchanged, and I wrote an integration for none of them. If your AI agent can run Bash, it can use this and it can talk to you.

Two commands, and only the first one is yours:

npm install -g @juanjofuchs/voice-tunnel

Then paste this to your coding agent:

"Run voice-tunnel describe and follow it end to end: install anything missing, start the tunnel under your own name, give me the URL to open on my phone, and then stay in watch so you can hear me."

It installs the engines, starts the server, and hands you back a URL to open on your phone. MIT licensed: https://github.com/JuanjoFuchs/voice-tunnel

Launching voice-tunnel: Talk to Your Coding Agent From Your Phone 👇
https://juanjofuchs.github.io/ai/2026/08/11/launching-voice-tunnel-talk-to-your-coding-agent-from-your-phone.html

What would you say to your coding agent if you could say it out loud?

#ClaudeCode #VoiceEngineering #AIEngineering #OpenSource

---

## X/Twitter Thread
MEDIA: /assets/videos/voice-tunnel-demo.mp4
ALT: Phone in hand running the voice-tunnel page while an agent ships a release

Tweet 1 (Hook):
I wanted my own Jarvis. So I built voice-tunnel, a local CLI that gives any coding agent a two-way voice channel to your phone browser. No app, no account, and your speech never leaves the machine. 🎤

Tweet 2:
Speech recognition and synthesis run on a CPU now, fast enough for real conversation. No GPU. On my desktop voice-tunnel transcribes 7.4 seconds of speech in 0.85 seconds, and the whole setup is about 1 GB of models.

Tweet 3:
What answers you is not a speech model. It's a coding agent with real reasoning, on your own harness, with your tools and your repo already in front of it.

Tweet 4:
Claude Code, Codex and Grok have each driven voice-tunnel unchanged, and I wrote an integration for none of them. If your AI agent can run Bash, it can use this and it can talk to you.

Tweet 5:
Install it, then paste one line to your agent: "Run voice-tunnel describe and follow it end to end, then stay in watch so you can hear me." That's the whole handoff.

Tweet 6:
I did this launch post's own interview through voice-tunnel, from my phone.

Launching voice-tunnel: Talk to Your Coding Agent From Your Phone
https://juanjofuchs.github.io/ai/2026/08/11/launching-voice-tunnel-talk-to-your-coding-agent-from-your-phone.html

#ClaudeCode #VoiceEngineering

---
INSTRUCTIONS:
- LinkedIn: Post Tuesday-Thursday. URL in post body (the Comments API is gated behind LinkedIn's Community Management partner program, which individual developers can't access).
- X/Twitter: Post as thread. Media attached to first tweet. Link only in last tweet.
- MEDIA is the demo video (2.8 MB, 540x970 portrait, 77 s). Both platforms accept it as native video; the poster frame /assets/voice-tunnel-demo-poster.png is the fallback if a video upload fails.
{% endcomment %}