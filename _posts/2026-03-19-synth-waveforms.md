---
layout: post
title: "Basic Waveforms in Synthesis"
date: 2026-03-19 10:00:00 +0800
tags: music
lang: en
comments: true
---

> Every synthesizer sound you have ever heard began with a simple repeating shape. Before filters, envelopes, or effects, there is a single oscillating wave. This post introduces the concept of the oscillator and the four basic waveforms at the heart of synthesis — with the mathematics and, crucially, the sounds themselves.

<!--more-->

## What Is an Oscillator?

An **oscillator** is a circuit or algorithm that generates a periodic signal — a signal that repeats at a fixed rate. In a synthesizer, the oscillator is the sound source. Everything else (filters, amplifiers, modulation) shapes that raw signal, but the oscillator is where it begins.

The fundamental property of an oscillator is its **frequency** \\(f\\), measured in Hertz (Hz): the number of complete cycles per second. Human hearing covers roughly 20 Hz to 20 000 Hz.[^1] Middle A on a piano is 440 Hz — a pitch standardised internationally at that value.[^2]

The **period** \\(T\\) is the duration of one cycle:

$$
T = \frac{1}{f}.
$$

At 440 Hz the period is about 2.27 milliseconds. The **amplitude** \\(A\\) controls the loudness — the peak displacement from zero.

A general oscillator signal can be written as:

$$
x(t) = A \cdot w(f \cdot t),
$$

where \\(w\\) is a periodic function with period 1 (one normalised cycle), \\(f\\) scales time so that \\(w\\) repeats \\(f\\) times per second, and \\(A\\) sets the peak level. The shape of \\(w\\) is what distinguishes one waveform from another.

There are four classical waveform shapes, each with its own timbre and Fourier structure. Before describing them, it is worth recalling the mathematical tool that ties them all together.

---

## Fourier Series for Waveforms

Any periodic signal \\(x(t)\\) with period \\(T = 1/f\\) decomposes as:

$$
x(t) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \Bigl[ a_n \cos(2\pi n f t) + b_n \sin(2\pi n f t) \Bigr].
$$

The coefficient \\(a_n\\) or \\(b_n\\) measures how much of the \\(n\\)-th harmonic frequency \\(nf\\) is present. The basis functions \\(\cos(2\pi nft)\\) and \\(\sin(2\pi nft)\\) are orthogonal over one period, so each coefficient can be extracted independently — computing one harmonic's contribution does not disturb any other. Plotting the harmonic amplitudes against frequency gives the **amplitude spectrum**, the frequency-domain fingerprint of the waveform. The timbre we hear is almost entirely determined by the shape of that spectrum.

This is the Fourier machinery we need to read the waveform formulas below: each formula is the Fourier series of that waveform shape, derived from first principles. For the full treatment — orthogonality proofs, the DFT and its matrix form, the FFT, the STFT and spectrogram, wavelets, and other decompositions — see the [The Linear Structure of Sound]({{ '/2026/03/14/linear-sound.html' | relative_url }}) post.

---

## The Sine Wave

The sine wave is the purest possible tone. It is the only periodic waveform that contains a **single frequency** — no harmonics, no overtones. Every other waveform can be built from sine waves added together, which is why the sine is the atom of acoustics.

$$
x(t) = A \sin(2\pi f t).
$$

Pressing Play below generates a sine at 220 Hz (A3). Move the slider to change frequency and hear how the pitch rises and falls. The waveform canvas shows two and a half cycles of its smooth, symmetrical shape.

<div class="waveform-demo" data-waveform="sine" data-color="#4a9eff" data-default-freq="220">
  <canvas data-role="canvas" class="waveform-canvas" width="700" height="100"></canvas>
  <div class="waveform-controls">
    <button data-role="play" class="waveform-play-btn" type="button">Play</button>
    <div class="waveform-freq-group">
      <label>Frequency</label>
      <input data-role="freq" type="range" min="80" max="880" value="220" step="1">
      <span data-role="freq-display" class="waveform-freq-display">220 Hz</span>
    </div>
  </div>
  <noscript>
    <p>This demo requires JavaScript and the Web Audio API.</p>
  </noscript>
</div>

Because the sine has no harmonics, it sounds hollow, almost clinical. Flutes and whistles approximate it, but most acoustic instruments are richer. The synthesiser's other waveforms are built from infinitely many sines layered on top of each other — the Fourier series.

---

## The Square Wave

The square wave flips instantly between \\(+A\\) and \\(-A\\), spending exactly half its period at each extreme:

$$
x(t) =
\begin{cases}
+A & \text{if } \sin(2\pi f t) > 0, \\
-A & \text{if } \sin(2\pi f t) < 0.
\end{cases}
$$

Those sharp jumps contain a rich harmonic series. The **Fourier decomposition** of the square wave is:

$$
x(t) = \frac{4A}{\pi} \sum_{\substack{k=1 \\ k \text{ odd}}}^{\infty} \frac{1}{k} \sin(2\pi k f t)
= \frac{4A}{\pi}\!\left[\sin(2\pi f t) + \frac{1}{3}\sin(6\pi f t) + \frac{1}{5}\sin(10\pi f t) + \cdots\right].
$$

Only **odd harmonics** appear (1×, 3×, 5×, … the fundamental frequency), each falling off at rate \\(1/k\\). This gives the square wave its characteristic hollow, reedy buzz — similar to a clarinet, which also emphasises odd harmonics through its cylindrical bore.[^3]

<div class="waveform-demo" data-waveform="square" data-color="#ff6b6b" data-default-freq="220">
  <canvas data-role="canvas" class="waveform-canvas" width="700" height="100"></canvas>
  <div class="waveform-controls">
    <button data-role="play" class="waveform-play-btn" type="button">Play</button>
    <div class="waveform-freq-group">
      <label>Frequency</label>
      <input data-role="freq" type="range" min="80" max="880" value="220" step="1">
      <span data-role="freq-display" class="waveform-freq-display">220 Hz</span>
    </div>
  </div>
  <noscript>
    <p>This demo requires JavaScript and the Web Audio API.</p>
  </noscript>
</div>

The square wave was central to early video game music: the programmable sound generator chips of the late 1970s and 1980s — the AY-3-8910, the NES 2A03, the SID — produced square and pulse waves directly in hardware.[^4] Switching a digital output between two voltage levels was inexpensive, and the resulting bold, easily recognisable tone cut through small speakers.

---

## The Pulse Wave: Generalising the Square

The square wave spends exactly half its period at \\(+A\\) and half at \\(-A\\). But there is no reason to fix that ratio at 50 %. The **pulse wave** generalises the square by introducing a **duty cycle** \\(d \in (0,1)\\) — the fraction of the period spent in the high state:

$$
x(t) =
\begin{cases}
+A & \text{if } (ft \bmod 1) < d, \\
-A & \text{otherwise.}
\end{cases}
$$

At \\(d = \tfrac{1}{2}\\) this is exactly the square wave. Smaller \\(d\\) gives a narrow positive spike; larger \\(d\\) gives a narrow negative notch. The parameter \\(d\\) is called the **pulse width** (or duty cycle), and varying it while the note plays is called **pulse-width modulation** (PWM).

### Harmonic content as a function of \\(d\\)

The Fourier series of the pulse wave is:

$$
x(t) = A(2d-1) + \sum_{k=1}^{\infty} \frac{4A \sin(k\pi d)}{k\pi} \cos(2\pi k f t - k\pi d).
$$

The DC offset \\(A(2d-1)\\) shifts to zero at \\(d = \tfrac{1}{2}\\) and is inaudible (filtered out by speakers and ears alike). The key quantity is the **amplitude of the \\(k\\)-th harmonic**:

$$
\boxed{|H_k| = \frac{4A}{k\pi}\,\bigl|\sin(k\pi d)\bigr|.}
$$

This single formula contains every waveform we care about:

- **\\(d = \tfrac{1}{2}\\) (square):** \\(\sin(k\pi/2) = 0\\) for all even \\(k\\), so even harmonics vanish. Only the odd series 1×, 3×, 5×, … survives — exactly the square wave result.
- **\\(d \to 0\\) (narrow spike):** \\(\sin(k\pi d) \approx k\pi d\\), so \\(\lvert H_k \rvert \approx 4Ad\\). The factor \\(k\\) in the numerator cancels the \\(k\\) in the denominator, leaving every harmonic at roughly the same amplitude. The spectrum is almost flat — extremely bright and buzzy, like a short click repeated at rate \\(f\\).
- **Intermediate \\(d\\):** the sinc-shaped envelope \\(\lvert\sin(k\pi d)\rvert/k\\) creates nulls at harmonics where \\(k\pi d = n\pi\\), i.e. at integer multiples of \\(1/d\\). Moving \\(d\\) away from \\(\tfrac{1}{2}\\) progressively restores the even harmonics and changes the timbre from hollow to nasal to thin.

### A pulse wave is the difference of two sawtooths

There is an elegant algebraic identity that illuminates why a narrow pulse sounds brighter. If \\(\text{saw}(t)\\) is a sawtooth at frequency \\(f\\), then a sawtooth delayed by \\(d/f\\) seconds has its \\(k\\)-th harmonic phase-shifted by \\(2\pi k d\\). Taking the difference:

$$
\text{saw}(t) - \text{saw}\!\left(t - \tfrac{d}{f}\right)
= \frac{4A}{\pi}\sum_{k=1}^{\infty} \frac{(-1)^{k+1}\sin(k\pi d)}{k}
\cos(2\pi k f t - k\pi d).
$$

Up to the alternating sign (which only shifts phase, not spectral content), this is precisely the pulse wave formula. **A pulse wave is the difference between two sawtooth waves, one delayed by a fraction \\(d\\) of the period.** Analogue synthesisers sometimes generate pulse waves this way internally.

As \\(d\\) approaches \\(\tfrac{1}{2}\\), the two sawtooths are half a period apart. Their even harmonics are in phase and cancel; their odd harmonics add — leaving the pure odd-harmonic signature of the square wave. As \\(d\\) shrinks, fewer harmonics cancel, and the pulse spectrum fills in to approach the full sawtooth series.

### Why frequency makes waveforms harder to tell apart

The perceptual difference between pulse widths depends critically on the **fundamental frequency**. At a low pitch like 110 Hz, the harmonics are spaced 110 Hz apart. Moving \\(d\\) from 0.5 to 0.3 restores the 2nd harmonic at 220 Hz, the 4th at 440 Hz, the 6th at 660 Hz — all clearly audible, all within the most sensitive range of human hearing. The change in timbre is dramatic.

At a high pitch like 1760 Hz (A6), the same duty-cycle shift restores even harmonics at 3520, 7040, 10 560 Hz. The 3520 Hz harmonic is present but sits at a frequency where equal-loudness curves show sharply reduced sensitivity; the 7040 and 10 560 Hz harmonics are near or above the practical ceiling of most listeners and speakers. The spectral differences that were vivid at 110 Hz are now buried above the hearing threshold.

More precisely: what our ears use to classify waveform timbre is the amplitude pattern of the first eight or so resolved harmonics. At 110 Hz those harmonics span 110–880 Hz — all within the most discriminating region of the cochlea. At 1760 Hz the same first-eight harmonics span 1760–14 080 Hz, where the auditory filter bandwidths are wider (less harmonic resolution) and sensitivity is falling. The information is present in the signal, but our auditory system loses the ability to extract it.

**Practical consequence:** a synthesiser patch built on a narrow pulse sounds noticeably thin and nasal in the bass register, but at high octaves it converges toward the same bright, slightly indistinct timbre as the sawtooth. This is why sound designers often pair pulse-width modulation with low-register patches — the ear can actually hear the sweep.

Try the demo below. At **110 Hz**, drag the pulse width from 50 % toward 10 % and listen to the timbre narrow and sharpen. Then raise the frequency to **880 Hz** or beyond and repeat the sweep — the timbral change is far subtler.

<div class="waveform-demo" data-waveform="pulse" data-color="#b07cff" data-default-freq="110" data-default-pw="0.5">
  <canvas data-role="canvas" class="waveform-canvas" width="700" height="100"></canvas>
  <div class="waveform-controls">
    <button data-role="play" class="waveform-play-btn" type="button">Play</button>
    <div class="waveform-freq-group">
      <label>Frequency</label>
      <input data-role="freq" type="range" min="80" max="1760" value="110" step="1">
      <span data-role="freq-display" class="waveform-freq-display">110 Hz</span>
    </div>
  </div>
  <div class="waveform-controls waveform-pw-row">
    <div class="waveform-freq-group">
      <label>Pulse width</label>
      <input data-role="pw" type="range" min="0.05" max="0.95" value="0.5" step="0.01">
      <span data-role="pw-display" class="waveform-freq-display">50%</span>
    </div>
  </div>
  <noscript>
    <p>This demo requires JavaScript and the Web Audio API.</p>
  </noscript>
</div>

---

## The Sawtooth Wave

The sawtooth rises linearly from \\(-A\\) to \\(+A\\) over one period, then drops back instantly — like the tooth of a saw blade:

$$
x(t) = 2A\!\left(ft - \left\lfloor ft + \tfrac{1}{2} \right\rfloor\right).
$$

Here \\(\lfloor \cdot \rfloor\\) is the floor function; the expression gives a linear ramp cycling between \\(-A\\) and \\(+A\\) at frequency \\(f\\). Its Fourier series is:

$$
x(t) = \frac{2A}{\pi} \sum_{k=1}^{\infty} \frac{(-1)^{k+1}}{k} \sin(2\pi k f t)
= \frac{2A}{\pi}\!\left[\sin(2\pi f t) - \frac{1}{2}\sin(4\pi f t) + \frac{1}{3}\sin(6\pi f t) - \cdots\right].
$$

Unlike the square wave, the sawtooth contains **all harmonics** — both even and odd — decaying at rate \\(1/k\\). This makes it the richest and brightest of the basic waveforms. Subtractive synthesis favours it heavily: start with a sawtooth's full harmonic stack, then sculpt with a low-pass filter to selectively remove high harmonics and shape the timbre.

<div class="waveform-demo" data-waveform="sawtooth" data-color="#ffd93d" data-default-freq="220">
  <canvas data-role="canvas" class="waveform-canvas" width="700" height="100"></canvas>
  <div class="waveform-controls">
    <button data-role="play" class="waveform-play-btn" type="button">Play</button>
    <div class="waveform-freq-group">
      <label>Frequency</label>
      <input data-role="freq" type="range" min="80" max="880" value="220" step="1">
      <span data-role="freq-display" class="waveform-freq-display">220 Hz</span>
    </div>
  </div>
  <noscript>
    <p>This demo requires JavaScript and the Web Audio API.</p>
  </noscript>
</div>

String sections and brass patches on classic analogue synthesisers are almost always rooted in the sawtooth. The sound is bright, cutting, and satisfyingly full.

---

## The Triangle Wave

The triangle wave rises and falls linearly in a zigzag:

$$
x(t) =
\begin{cases}
4A\!\left(ft - \lfloor ft \rfloor\right) - A & \text{if } \lfloor ft \rfloor \text{ is even,}\\[4pt]
3A - 4A\!\left(ft - \lfloor ft \rfloor\right) & \text{otherwise.}
\end{cases}
$$

Or more compactly: \\(x(t) = \tfrac{2A}{\pi}\arcsin\!\left(\sin(2\pi ft)\right)\\). The Fourier series contains only **odd harmonics**, but they decay at rate \\(1/k^2\\) — much faster than the square wave's \\(1/k\\):

$$
x(t) = \frac{8A}{\pi^2} \sum_{k=0}^{\infty} \frac{(-1)^k}{(2k+1)^2} \sin\!\bigl(2\pi(2k+1)ft\bigr)
= \frac{8A}{\pi^2}\!\left[\sin(2\pi ft) - \frac{1}{9}\sin(6\pi ft) + \frac{1}{25}\sin(10\pi ft) - \cdots\right].
$$

The \\(1/k^2\\) roll-off means the higher harmonics are very quiet, so the triangle sounds much softer and more mellow than the square wave despite sharing its odd-harmonics structure. The fundamental dominates, with a gentle shimmer from the overtones.

<div class="waveform-demo" data-waveform="triangle" data-color="#6bcb77" data-default-freq="220">
  <canvas data-role="canvas" class="waveform-canvas" width="700" height="100"></canvas>
  <div class="waveform-controls">
    <button data-role="play" class="waveform-play-btn" type="button">Play</button>
    <div class="waveform-freq-group">
      <label>Frequency</label>
      <input data-role="freq" type="range" min="80" max="880" value="220" step="1">
      <span data-role="freq-display" class="waveform-freq-display">220 Hz</span>
    </div>
  </div>
  <noscript>
    <p>This demo requires JavaScript and the Web Audio API.</p>
  </noscript>
</div>

The triangle is a good starting point for flute and mallet sounds. Combined with a gentle filter, it produces a warm, breathy tone that sits well in a mix without becoming strident.

---

## Comparing the Four Waveforms

| Waveform        | Harmonics present             | Harmonic amplitude                              | Character                        |
|:----------------|:------------------------------|:------------------------------------------------|:---------------------------------|
| Sine            | fundamental only              | —                                               | pure, clean                      |
| Triangle        | odd (1, 3, 5, …)              | \\(1/k^2\\)                                     | soft, mellow                     |
| Square          | odd (1, 3, 5, …)              | \\(1/k\\)                                       | hollow, reedy                    |
| Pulse (d ≠ ½)   | all, with nulls at \\(k=n/d\\)| \\(\lvert\sin(k\pi d)\rvert/k\\)                | nasal → thin (varies with \\(d\\))   |
| Sawtooth        | all (1, 2, 3, …)              | \\(1/k\\)                                       | bright, rich                     |

The crucial column is **harmonics present**. The sine is the only waveform with one frequency component. The triangle and square both have odd harmonics, but differ in how fast those harmonics fade (\\(1/k^2\\) versus \\(1/k\\)). The sawtooth is the densest, containing all harmonics and decaying at the same \\(1/k\\) rate as the square.

This is also why the sawtooth and square waves sound brighter or harsher than the triangle at high frequencies: a slow harmonic roll-off means significant energy at high multiples of the fundamental.

---

## What Comes Next

Knowing the four basic waveforms, you already understand the raw material of synthesis. Most of what a synthesiser does from here is **subtraction and modulation**:

- A **low-pass filter** removes high harmonics from a sawtooth, smoothing it into something warmer.
- An **amplitude envelope** shapes how the sound attacks and decays over time.
- An **LFO** (a second oscillator running below 20 Hz) can modulate the pitch, producing vibrato, or the amplitude, producing tremolo.

And, as the [linear structure post]({{ '/2026/03/14/linear-sound.html' | relative_url }}) showed, detuning two oscillators by a few Hz introduces slow amplitude modulation — the wobble that makes a pad sound alive. Two sawtooths, slightly detuned, are the basis of an enormous fraction of synthesiser patches ever made.

The waveform is the beginning. Everything else is sculpting.

---

## References

[^1]: Moore, B. C. J. (2003). *An Introduction to the Psychology of Hearing* (5th ed.). Academic Press. The 20 Hz–20 kHz range is discussed in Chapter 1; individual variation and age-related upper-frequency loss are noted throughout.

[^2]: ISO 16:1975. *Acoustics — Standard tuning frequency (Standard musical pitch)*. International Organization for Standardization. The standard specifies A4 = 440 Hz.

[^3]: Benade, A. H. (1976). *Fundamentals of Musical Acoustics*. Oxford University Press. The cylindrical-bore / odd-harmonic relationship for the clarinet is derived in Chapter 22.

[^4]: Collins, K. (2008). *Game Sound: An Introduction to the History, Theory, and Practice of Video Game Music and Sound Design*. MIT Press. Hardware sound chip specifications are detailed in Chapters 1–2. See also: Stilphen, S. (Ed.). DP Interviews archive at <http://www.digitpress.com/library/interviews/>.

<script src="{{ '/assets/javascripts/waveform-demo.js' | relative_url }}"></script>
