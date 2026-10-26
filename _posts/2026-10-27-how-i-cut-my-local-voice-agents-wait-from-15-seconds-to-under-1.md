---
layout: post
title: "How I cut my local voice agent's wait from 15 seconds to under 1"
description: "On long turns my local voice agent made me wait 15 seconds to hear it. Moving speech to the GPU and transcribing while I talk cut it to under 1."
date: 2026-10-27 09:00:00 -0400
categories: ai
tags: [ai, voice, gpu, command-bridge, latency]
author: JuanjoFuchs
permalink: /blog/fast-voice
image: /assets/2026-10-27-voice-latency-hero.png
---

<div style="max-width: 540px; margin: 0 auto;">
  <div style="position: relative; padding-bottom: 125%; height: 0; overflow: hidden;">
    <video style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
           autoplay loop muted playsinline
           aria-label="A 3D timeline of one long turn of 30 seconds or more, stage by stage: turn detection, speech to text, the agent thinking and the first spoken audio. Speech to text collapses from 7.7 seconds to 0.05, 155 times faster, first audio drops from 7.4 seconds to 0.6, 12 times faster, and the stages shown go from 20.0 to 5.6 seconds while the agent's 4.8 seconds of thinking stay the same."
           poster="/assets/2026-10-27-voice-latency-hero.png">
      <source src="/assets/videos/2026-10-27-voice-latency-long-turn.mp4" type="video/mp4">
    </video>
  </div>
</div>

I talk to my AI agents out loud through [Command Bridge](https://github.com/JuanjoFuchs/command-bridge), a tool I built that lets Claude Code and other agents use a voice that runs on my own laptop. When I talked for 30 seconds or more, I used to wait about 15 seconds after I stopped before I heard the first word back, and that's without counting the time the agent spends thinking about its answer. All 15 of those seconds went to the voice, writing down what I'd said and turning the agent's reply into speech, and now those two steps take 0.67 seconds.

Waiting that long is why I used to juggle agents, I'd talk to one and switch to another while the first was still working on its reply. I didn't buy a faster machine to fix it, it's the same laptop. I just needed to move the voice from the CPU to the GPU, and for my 8 GB GPU to handle that, I first needed to change its thermal paste.

| Voice stages on a long turn | Before | After |
|---|---|---|
| Speech to text | 7.74 s | 0.05 s |
| Voice: agent's answer to first spoken word | 7.39 s | 0.62 s |
| **Voice total** | **15.1 s** | **0.67 s** |
| The agent thinking (unchanged) | 4.8 s | 4.8 s |

## Switching agents to dodge the wait

I first started using two-way voice with my agents through [Voice Tunnel](https://juanjofuchs.com/blog/voice-tunnel), and that long wait made me realize I needed multiple lanes, so that's why I created Command Bridge. Command Bridge gives each agent its own lane, one conversation per agent that I can switch between. I didn't want to wait long for any one of them to respond, so while one agent worked on its reply I'd switch to another one.

Keeping that pace was hard, especially talking to six agents and cycling through all of them, one after another, for the whole day. I've written before that [more than six terminal panes fries my brain](https://juanjofuchs.com/blog/agent-mail), and about [how tired I'd be by the end of the day](https://juanjofuchs.com/blog/chief-of-staff).

## Moving the voice to the GPU

When I launched Voice Tunnel in August, I wrote that [speech on the CPU was now good enough](https://juanjofuchs.com/blog/voice-tunnel), after measuring it on my 20-core desktop. That made sense when the alternative was not having voice at all, or using dictation tools and reading walls of text back. Then I got used to speaking and listening and wanted to push further.

In July I was at the AI Engineer World's Fair and saw Thariq Shihipar from Anthropic, in a [fireside chat](https://simonwillison.net/2026/Jul/21/cat-and-thariq/), talk about being as ambitious as you can with these new models. So I figured there must be a way to make this fast, and I asked magnus to move both, the speech to text and the text to speech, to the GPU. Magnus is the agent I talk to most, the [chief of staff from last week's post](https://juanjofuchs.com/blog/chief-of-staff) that runs my other agents. I told it, "I want this whole thing to be fast. Don't stop until you have a full root cause and a plan of action that you have tested." And I asked to see it live.

## The GPU was throttling

Before any of that could work, we found my laptop's GPU overheating and slowing itself down to cool off. It's an NVIDIA RTX A2000 with 8 GB, and it was sitting at 78 to 83 °C even near idle, with nvidia-smi showing `SW Thermal Slowdown: Active`. The clock was at 607 of its 2,100 MHz.

![HWInfo-TUI plot of the throttled GPU: clock flat at 607 MHz while the temperature swings between 78 and 83 °C](/assets/2026-10-27-gpu-throttled-hwinfo-tui.png)

The cause was thermal paste, the thin layer between the chip and its heatsink that carries the heat away. I'd [repasted this laptop last December](https://juanjofuchs.com/hardware/troubleshooting/2025/12/09/claude-code-thermal-paste.html), but only the CPU, so the GPU still had its original paste. I didn't know that needed to be changed. The same day I replaced it with [PTM7950](https://www.lttstore.com/products/ptm7950-phase-change-thermal-pad). Under the same load the GPU now runs at 1,747 MHz and stays at or under 67.6 °C.

![HWInfo-TUI plot of the GPU after the repaste, under light load: clock holding at 1,177 MHz with a burst to 1,740 MHz, temperature between 68 and 75 °C](/assets/2026-10-27-gpu-after-repaste-hwinfo-tui.png)

Those readings came from HWInfo64's sensor log, and [HWInfo-TUI](https://github.com/JuanjoFuchs/hwinfo-tui), which I [built last year](https://juanjofuchs.com/ai-development/2025/12/02/vibe-coding-hwinfo-tui.html), plots it right in the terminal. If you run models on a laptop GPU, check its clock and temperature first.

## Transcribing while I talk (speech to text)

Command Bridge waited until I finished talking to start writing down what I'd said. We found the transcription model itself took only about 150 milliseconds of the wait. The rest came from transcribing the turn from the beginning after I stopped, so the longer I talked, the longer I waited. On turns where I'd talked for a full minute, that came to 11 to 20 seconds, more than the 7.7-second median across all my turns of 30 seconds or more.

Now [Smart Turn](https://github.com/pipecat-ai/smart-turn), a small model from Pipecat, still decides when I'm done talking, but the turn gets transcribed in pieces while I talk, at every pause of 600 milliseconds or more. When I stop, only the last stretch is left.

Then I moved the transcription model, NVIDIA's [Parakeet](https://huggingface.co/nvidia/parakeet-tdt-0.6b-v2), to the GPU too. The two smaller versions that are published didn't work well there, one was barely faster and the other returned empty text on 20 of 21 test turns, so I converted it to the full-size version. Decoding a turn went from 515 ms on the CPU to 127 ms on the GPU, and together with transcribing in pieces, the wait on long turns went from 7.7 seconds to 0.05, 155 times faster.

## Speaking back faster (text to speech)

Speaking back was the bigger wait on most turns, and it was slow for two reasons: the speech model ran on the CPU, and every reply waited on purpose. The first word I heard came 7.4 seconds after the agent had its answer, at the median, on short turns and long ones alike. [Kokoro](https://huggingface.co/hexgrad/Kokoro-82M), the speech model that reads the replies aloud, ran on the CPU through [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx), and 9.4 seconds of speech took 3.0 seconds to make. On the GPU the same speech took 0.83 seconds.

We also found a fixed 0.8 seconds before every reply, on purpose. I didn't want a deliberate pause, so it went, and now a reply only waits if I'm still talking. Replies also stream phrase by phrase, so the first phrase plays while the rest is still being made. Put together, the time from the agent having its answer to the first spoken word went from 7.4 seconds to 0.6, 12 times faster. The animation below shows a typical turn, the median of all my turns.

<div style="max-width: 540px; margin: 0 auto;">
  <div style="position: relative; padding-bottom: 125%; height: 0; overflow: hidden;">
    <video style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
           autoplay loop muted playsinline
           aria-label="A 3D timeline of a typical turn, the median of all my turns, stage by stage: turn detection, speech to text, the agent thinking and the first spoken audio. First audio collapses from 7.4 seconds to 0.6, 12 times faster, speech to text gets 5 times faster, and the stages shown go from 13.2 to 5.7 seconds while the agent's 4.8 seconds of thinking stay the same."
           poster="/assets/2026-10-27-voice-latency-typical.png">
      <source src="/assets/videos/2026-10-27-voice-latency-typical-turn.mp4" type="video/mp4">
    </video>
  </div>
</div>

## One agent is enough now

The first time I heard a reply less than a second after the agent had it, it felt like having a real conversation. The long waits used to cost me my train of thought or send me off to something else, and the faster back and forth kept me focused.

I built lanes so I could switch agents instead of waiting. Now that replies come back fast and it feels more like a conversation with a lot of back and forth, I can just talk to one agent. I think that's what enabled [my chief of staff](https://juanjofuchs.com/blog/chief-of-staff) as well.

The model helped too. I moved every agent to [Opus 5.5](https://www.anthropic.com/claude-opus-5-5) at medium effort soon after it came out, and its median thinking time for me now is 4.8 seconds, the grey bar in both animations.

## Try it on your own laptop

None of this needs a big machine. My laptop's GPU has 8 GB, and the voice models on it are small, Parakeet has 0.6 billion parameters and Kokoro 82 million.

[Command Bridge](https://github.com/JuanjoFuchs/command-bridge) is open source, and I'd love for you to give it a try.

{% comment %}
## Social Campaign
CAMPAIGN: fast-voice_20261027
TIMEZONE: America/New_York
NOTE: Daily slots Tue-Fri at 12 PM ET, text plus one link to the blog and that day's media. Tuesday and Thursday carry the two 3D animations, Wednesday and Friday the hero still.

### Tuesday - Launch
DATE: 2026-10-27
TIME: 12:00
MEDIA: /assets/videos/2026-10-27-voice-latency-long-turn.mp4
ALT: A 3D timeline of one long turn of 30 seconds or more: turn detection, speech to text, the agent thinking and the first spoken audio. Speech to text collapses from 7.7 seconds to 0.05, first audio from 7.4 seconds to 0.6, the agent's 4.8 seconds of thinking stay the same, and it ends on the big green number marked voice only.

#### LinkedIn Post
My local voice agent now transcribes me 155 times faster and starts speaking back 12 times faster.

I talk to my AI agents out loud, and when I talked for 30 seconds or more I used to wait about 15 seconds after I stopped before I heard the first word back. That's without counting the time the agent spends thinking. Now that wait is 0.67 seconds.

It all runs on my own laptop and its 8 GB GPU, through Command Bridge, the voice tool I built. Those 15 seconds went to the voice, writing down what I'd said and turning the agent's reply into speech.

The biggest drop was the writing down. Command Bridge waited until I finished talking to start transcribing, and then transcribed the turn from the beginning, so the longer I talked, the longer I waited. On a turn where I'd talked for a full minute, that came to 11 to 20 seconds, and the transcription model itself only took about 150 milliseconds of it.

Now the turn gets transcribed in pieces while I talk, at every pause of 600 milliseconds or more, and when I stop only the last stretch is left. With the transcription model on the GPU too, transcription on long turns went from 7.7 seconds to 0.05, 155 times faster.

How I cut my local voice agent's wait from 15 seconds to under 1: https://juanjofuchs.com/blog/fast-voice

#VoiceAI #AIAgents #LocalAI #ClaudeCode

#### X/Twitter Thread
Tweet 1:
When I talked to my AI agents for 30 seconds or more, I used to wait about 15 seconds after I stopped to hear the first word back, before counting the agent's thinking. Now it's 0.67 seconds, all on my laptop's 8 GB GPU.

Tweet 2:
My voice agent waited until I stopped talking to start transcribing, then did the turn from the beginning. On a minute-long turn that was 11 to 20 seconds, and the transcription model itself was only about 150 ms of it.

Tweet 3:
Now my voice agent transcribes in pieces while I talk, at every pause of 600 ms or more, so when I stop only the last stretch is left. With the model on the GPU too, transcription on long turns went from 7.7 s to 0.05 s, 155 times faster.

Tweet 4:
How I cut my local voice agent's wait from 15 seconds to under 1: https://juanjofuchs.com/blog/fast-voice

#VoiceAI #AIAgents

### Wednesday - The overheating GPU
DATE: 2026-10-28
TIME: 12:00
MEDIA: /assets/2026-10-27-gpu-throttled-hwinfo-tui.png
ALT: HWInfo-TUI plot of the throttled GPU: clock flat at 607 MHz while the temperature swings between 78 and 83 °C.

#### LinkedIn Post
The first fix to my voice agent's wait was thermal paste.

I talk to my AI agents through Command Bridge, a voice tool I built that runs on my own laptop. When I asked my agent to move the voice to the GPU, we found the GPU overheating and slowing itself down to cool off. It's an NVIDIA RTX A2000 with 8 GB, and it was sitting at 78 to 83 °C even near idle, with the clock at 607 of its 2,100 MHz.

The cause was thermal paste, the thin layer between the chip and its heatsink that carries the heat away. I'd repasted this laptop last December, but only the CPU, so the GPU still had its original paste. I didn't know that needed to be changed.

The same day I replaced it with PTM7950. Under the same load the GPU now runs at 1,747 MHz and stays at or under 67.6 °C.

Those readings came from HWInfo64's sensor log, and HWInfo-TUI, a tool I built last year, plots it right in the terminal. If you run models on a laptop GPU, check its clock and temperature first.

The full story of cutting the wait from 15 seconds to under 1: https://juanjofuchs.com/blog/fast-voice

#VoiceAI #LocalAI #GPU #AIAgents

#### X/Twitter Thread
Tweet 1:
The first fix to my local voice agent's wait was thermal paste. My laptop's RTX A2000 sat at 78 to 83 °C even near idle, slowed down to 607 of its 2,100 MHz.

Tweet 2:
I'd repasted my laptop last December, but only the CPU. The GPU still had its original thermal paste, the layer that carries the heat from the chip to the heatsink. I didn't know that needed to be changed.

Tweet 3:
After repasting my laptop's GPU with PTM7950, it runs at 1,747 MHz under the same load and stays at or under 67.6 °C.

Tweet 4:
If you run models on a laptop GPU, check its clock and temperature first. HWInfo-TUI, a tool I built last year, plots HWInfo64's sensor log right in the terminal.

Tweet 5:
How I cut my local voice agent's wait from 15 seconds to under 1: https://juanjofuchs.com/blog/fast-voice

#VoiceAI #LocalAI

### Thursday - The voice starts sooner
DATE: 2026-10-29
TIME: 12:00
MEDIA: /assets/videos/2026-10-27-voice-latency-typical-turn.mp4
ALT: A 3D timeline of a typical turn, the median of all my turns: turn detection, speech to text, the agent thinking and the first spoken audio. First audio collapses from 7.4 seconds to 0.6, speech to text gets 5 times faster, the agent's 4.8 seconds of thinking stay the same, and it ends on the big green number marked voice only.

#### LinkedIn Post
My local voice agent now starts speaking 12 times faster, 0.6 seconds after it has its answer instead of 7.4.

On most turns, the longest wait with my voice agent was hearing it speak back. From the agent having its answer to the first word I heard took 7.4 seconds at the median, on short turns and long ones alike.

It was slow for two reasons. The speech model ran on the CPU, and every reply waited on purpose.

The speech model is Kokoro, and on the CPU 9.4 seconds of speech took 3.0 seconds to make. On the GPU the same speech took 0.83 seconds.

We also found a fixed 0.8 seconds before every reply, on purpose. I didn't want a deliberate pause, so it went, and now a reply only waits if I'm still talking. Replies also stream phrase by phrase, so the first phrase plays while the rest is still being made.

https://juanjofuchs.com/blog/fast-voice

#VoiceAI #AIAgents #LocalAI

#### X/Twitter Thread
Tweet 1:
My local voice agent took 7.4 seconds from having its answer to speaking the first word. Now it's 0.6 seconds, 12 times faster, on my laptop's 8 GB GPU.

Tweet 2:
On my laptop's CPU, Kokoro took 3.0 seconds to make 9.4 seconds of speech. On the GPU, the same speech takes 0.83 seconds.

Tweet 3:
My voice agent also waited a fixed 0.8 seconds before every reply, on purpose. I didn't want a deliberate pause. Now a reply only waits if I'm still talking, and the first phrase plays while the rest is still being made.

Tweet 4:
How I cut my local voice agent's wait from 15 seconds to under 1: https://juanjofuchs.com/blog/fast-voice

#VoiceAI #AIAgents

### Friday - One agent is enough
DATE: 2026-10-30
TIME: 12:00
MEDIA: /assets/2026-10-27-voice-latency-hero.png
ALT: The last frame of the long-turn animation: four stages of one long turn on a level time axis, speech to text marked 155 times faster, first audio 12 times faster, and the agent's 4.8 seconds of thinking as an unchanged grey bar.

#### LinkedIn Post
I went from cycling through six AI agents all day to talking to just one.

I first started using two-way voice with my agents through Voice Tunnel, and that long wait made me realize I needed multiple lanes, so I created Command Bridge. It gives each agent its own lane, one conversation per agent that I can switch between, and I'd talk to one agent and switch to another while it worked on a reply, cycling through all of them for the whole day. Keeping that pace was hard.

Then I cut the voice part of the wait on a long turn from 15 seconds to under 1. The first time I heard a reply less than a second after the agent had it, it felt like having a real conversation. The long waits used to cost me my train of thought or send me off to something else, and the faster back and forth kept me focused.

Now that replies come back fast, I can just talk to one agent. I think that's what enabled my chief of staff as well, the agent that runs my other agents.

The model helped too. I moved every agent to Opus 5.5 at medium effort soon after it came out, and its median thinking time for me now is 4.8 seconds.

None of this needs a big machine. My laptop's GPU has 8 GB, and the voice models on it are small, Parakeet has 0.6 billion parameters and Kokoro 82 million. Command Bridge is open source, and I'd love for you to give it a try: https://github.com/JuanjoFuchs/command-bridge

The full post: https://juanjofuchs.com/blog/fast-voice

#VoiceAI #AIAgents #ClaudeCode #OpenSource

#### X/Twitter Thread
Tweet 1:
I used to switch between six AI agents all day because every reply took so long. Now that I hear a reply less than a second after the agent has it, I can just talk to one.

Tweet 2:
The first time my voice agent spoke less than a second after it had its answer, it felt like having a real conversation. The long waits used to cost me my train of thought.

Tweet 3:
My local voice agent runs on a laptop GPU with 8 GB. The voice models are small, Parakeet has 0.6 billion parameters and Kokoro 82 million.

Tweet 4:
Command Bridge is open source: https://github.com/JuanjoFuchs/command-bridge

How I cut its wait from 15 seconds to under 1: https://juanjofuchs.com/blog/fast-voice

#VoiceAI #AIAgents

---

## Newsletter
SUBJECT: My voice agent used to make me wait 15 seconds
MEDIA: /assets/2026-10-27-voice-latency-hero.png
ALT: The last frame of the long-turn animation: four stages of one long turn on a level time axis, speech to text marked 155 times faster, first audio 12 times faster, and the agent's 4.8 seconds of thinking as an unchanged grey bar.
PREVIEW: Now it's under one second, on the same laptop with its 8 GB GPU. It started with new thermal paste.

I talk to my AI agents out loud through Command Bridge, a tool I built that lets Claude Code and other agents use a voice that runs on my own laptop. When I talked for 30 seconds or more, I used to wait about 15 seconds after I stopped before I heard the first word back, and that's before counting the agent's thinking. Waiting that long is why I used to juggle agents.

This week's post is how I cut it to 0.67 seconds on the same laptop. I just needed to move the voice from the CPU to the GPU, and for my 8 GB GPU to handle that, I first needed to change its thermal paste. Then Command Bridge started transcribing my turn in pieces while I talk, so when I stop only the last stretch is left, and transcription on long turns went from 7.7 seconds to 0.05.

The voice coming back got 12 times faster, from 7.4 seconds to 0.6. The speech model moved to the GPU, and the deliberate pause before every reply went away.

It felt like having a real conversation. I stayed focused, and I could just talk to one agent instead of cycling through six. Command Bridge is open source if you want to try it.

Read the full post: https://juanjofuchs.com/blog/fast-voice

---
INSTRUCTIONS:
Publishes Tue 2026-10-27, permalink /blog/fast-voice. Slots Tue-Fri at 12 PM ET, text plus one link to the blog and that day's media. Media rendered from the canvas animations: the two videos are the 3D long-turn and typical-turn animations, and the PNG is the hero poster.
{% endcomment %}