---
layout: post
title: "Synthesizer from Scratch (Part I): Pitch, Frequency, and Beating"
date: 2026-03-14 13:30:00 +0800
tags: music
lang: en
comments: true
---

> In this first post, we start with the foundation: pitch, frequency, and beating.

<!--more-->

## What Is Pitch, Really?

Sound is vibration in air pressure. When something vibrates, it pushes and pulls the surrounding air. If we measure pressure over time, we get a waveform.

When this vibration repeats regularly, we perceive a musical pitch. The number of repetitions per second is called **frequency**, measured in Hertz (Hz).

## Why 440 Hz?

In modern music, the standard reference pitch is **A = 440 Hz**. That means the waveform repeats 440 times each second.

Historically, orchestras used many different reference pitches, roughly from 430 Hz to 450 Hz. Even today, some orchestras tune slightly higher, like 442 Hz, because it can sound brighter.

## 438 Hz vs 440 Hz

To our ears, 438 Hz and 440 Hz sound almost identical. But when played together, the combined sound gets louder and softer repeatedly. This is called **beating**.

The beat rate equals the frequency difference. If two tones differ by 2 Hz, we hear about two beats per second.

## Try It Yourself

The demo below hides a reference tone. Tune your frequency until the beating nearly disappears.

<section class="beating-game" data-beating-game>
  <div class="beating-game-header">
    <h3>Tune the hidden frequency</h3>
    <span class="beating-game-round">Round <span data-role="round-value">1</span></span>
  </div>

  <p class="beating-game-hint">
    Move the slider while listening. When the pulsing fades, you have matched the target.
  </p>

  <div class="beating-game-freq-group">
    <div class="beating-game-freq-row">
      <label for="guess-slider">Your frequency</label>
      <span class="beating-game-freq-display" data-role="guess-value">440.00 Hz</span>
    </div>
    <input
      id="guess-slider"
      data-role="slider"
      type="range"
      min="436"
      max="444"
      step="0.05"
      value="440">
  </div>

  <div class="beating-game-controls">
    <div class="beating-game-actions">
      <button type="button" class="btn-primary" data-role="start">Start</button>
      <button type="button" data-role="stop" disabled>Stop</button>
      <button type="button" data-role="your-tone">Your tone</button>
      <button type="button" data-role="target-tone" disabled>Target tone</button>
    </div>

    <div class="beating-game-actions">
      <button type="button" class="btn-accent" data-role="reveal">Reveal answer</button>
      <button type="button" data-role="new-round">New round</button>
    </div>
  </div>

  <div class="beating-game-result" data-role="result-box" hidden>
    <div class="beating-game-result-row">
      <span>Target</span>
      <strong data-role="target-value">-</strong>
    </div>
    <div class="beating-game-result-row">
      <span>Difference</span>
      <strong data-role="diff-value">-</strong>
    </div>
    <div class="beating-game-result-row">
      <span>Score</span>
      <strong><span data-role="score-value">-</span> / 100</strong>
    </div>
  </div>

  <noscript>
    <p>This demo requires JavaScript and Web Audio. You can still read the article without the interactive block.</p>
  </noscript>
</section>

<script src="{{ '/assets/javascripts/beating-game.js' | relative_url }}"></script>

## Why This Matters for Synth Building

Beating is not just a music trick. It is a direct consequence of adding waves together, and this idea appears everywhere in synthesis and signal processing.

If you can hear and understand this interaction, you are already thinking like a synth designer.

## Next: Part 2

In Part 2, we will generate these tones digitally with oscillators and compare sine, square, sawtooth, and triangle waves.
