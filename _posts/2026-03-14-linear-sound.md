---
layout: post
title: "Sound of Linearity"
date: 2026-03-14 14:00:00 +0800
tags: music
lang: en
comments: true
---

> "The idea of the world as composed of weightless atoms is striking just because we know the weight of things so well."
>
> — Italo Calvino, *Six Memos for the Next Millennium* (1988)

<!--more-->

---

## Why Sounds Add: The Wave Equation

Sound is a longitudinal pressure wave in air. If \\(p(x, t)\\) is the excess pressure at position \\(x\\) and time \\(t\\), it obeys the **acoustic wave equation**:

$$
\frac{\partial^2 p}{\partial t^2} = c^2 \frac{\partial^2 p}{\partial x^2},
$$

where \\(c \approx 343\\) m/s is the speed of sound at room temperature. This is a **linear** PDE. Every term involves \\(p\\) raised to exactly the first power. If \\(p_1\\) and \\(p_2\\) are both solutions, then so is any linear combination \\(\alpha p_1 + \beta p_2\\). This is the **superposition principle**, and it is why two sounds simply add at your eardrum.

The linearity is not an approximation — it is exact within the regime where the pressure fluctuation is small relative to ambient atmospheric pressure \\(P_0 \approx 10^5\\) Pa. At conversational levels (60 dB SPL) the pressure fluctuation is about \\(2 \times 10^{-2}\\) Pa — roughly one part in five million of ambient pressure. Even at painfully loud levels (120 dB SPL), the fluctuation is only about 20 Pa, still less than 0.02% of ambient. In this regime, the restoring force of the compressed gas is linear in the displacement, and the wave equation holds with excellent accuracy.

Nonlinearity appears only at extreme conditions: shock waves from explosions, sonic booms, and the snapping of a bullwhip all involve pressure fluctuations comparable to ambient pressure, where the wave equation must be replaced by the nonlinear Euler equations. For everything we encounter in music — even the loudest amplified performance — air is linear, and sounds genuinely add.

This one physical fact casts a long shadow. It means that the total acoustic field at your ear is the vector sum of all sound sources in the room, with no cross-terms. A violin and a piano do not interact in the air between them. They interact only at the ear — and there the question is how the auditory system decomposes the mixture back into its sources.

---

## Signals as Vectors in Function Space

The physicist's "pressure at a point" is the mathematician's "real-valued function of time." The collection of all such functions that are square-integrable over a period \\(T\\) — those satisfying

$$
\int_0^T \lvert p(t) \rvert^2\, dt < \infty
$$

— forms a **Hilbert space** denoted \\(L^2([0, T])\\). This is the infinite-dimensional analogue of Euclidean space \\(\mathbb{R}^n\\), and the analogy is exact:

| Vectors in \\(\mathbb{R}^n\\)               | Signals in \\(L^2([0,T])\\)                                              |
|:--------------------------------------------|:-------------------------------------------------------------------------|
| \\(\mathbf{v} = (v_1, \ldots, v_n)\\)       | \\(p(t)\\), a function of time                                           |
| Scalar multiplication \\(\alpha \mathbf{v}\\)| Amplitude scaling \\(\alpha\, p(t)\\)                                    |
| Vector addition \\(\mathbf{u} + \mathbf{v}\\)| Superposition \\(p(t) + q(t)\\)                                          |
| Dot product \\(\mathbf{u} \cdot \mathbf{v}\\)| Inner product \\(\langle p, q \rangle = \tfrac{1}{T}\int_0^T p(t)\,q(t)\,dt\\) |
| Euclidean norm \\(\lVert \mathbf{v} \rVert\\)| RMS amplitude \\(\lVert p \rVert = \sqrt{\langle p, p \rangle}\\)        |
| Orthogonality \\(\mathbf{u} \cdot \mathbf{v} = 0\\)| \\(\langle p, q \rangle = 0\\): signals share no common frequency content |

The Fourier series is the orthogonal decomposition of a signal onto the orthonormal basis \\(\{\varphi_n\}\\) where \\(\varphi_n(t) = e^{i 2\pi n t / T}\\). Computing a Fourier coefficient \\(c_n = \langle p, \varphi_n \rangle\\) is literally projecting the signal onto a basis vector, exactly as one projects a geometric vector onto a coordinate axis. Parseval's theorem — that \\(\sum_n \lvert c_n \rvert^2 = \lVert p \rVert^2\\) — is the Pythagorean theorem in Hilbert space.

The function-space perspective makes one fact unavoidable: **two sounds played simultaneously are a single vector in \\(L^2\\), obtained by adding the two component vectors**. The richness of what we hear — beating, harmony, timbre, roughness, interference — is entirely a consequence of which basis we use to decompose that sum, and how our perceptual system performs that decomposition.

---

## The Fourier Series and Its Relatives

### The core idea

In 1807, Joseph Fourier presented a claim that seemed outrageous to many of his contemporaries:[^11] **any** periodic signal — no matter how jagged or complicated its shape — can be written exactly as a sum of pure sine and cosine waves. For a signal \\(x(t)\\) with period \\(T = 1/f\\), the **Fourier series** is:

$$
x(t) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \Bigl[ a_n \cos(2\pi n f t) + b_n \sin(2\pi n f t) \Bigr].
$$

Each term oscillates at a **harmonic frequency** \\(nf\\): the fundamental \\(f\\) when \\(n=1\\), the octave \\(2f\\) when \\(n=2\\), and so on. The coefficients \\(a_n\\) and \\(b_n\\) tell us how much of each sinusoid is present.

Using Euler's formula \\(e^{i\theta} = \cos\theta + i\sin\theta\\), the real sine-cosine pairs collapse into a single **complex exponential** per harmonic:

$$
x(t) = \sum_{n=-\infty}^{\infty} c_n\, e^{\,i 2\pi n f t},
\qquad
c_n = \frac{1}{T} \int_0^T x(t)\, e^{-i 2\pi n f t}\, dt.
$$

The complex coefficient \\(c_n\\) encodes both amplitude and phase. Its **magnitude** \\(\lvert c_n \rvert\\) is the amplitude of the \\(n\\)-th harmonic, and its **argument** \\(\arg(c_n)\\) is its phase. Because real signals satisfy \\(c_{-n} = c_n^\ast\\), the negative-frequency terms carry no new information. Plotting \\(\lvert c_n \rvert\\) against frequency \\(nf\\) gives the **amplitude spectrum** — the signal's frequency-domain portrait. The timbre we hear is almost entirely determined by the shape of this spectrum.

---

### Orthogonality: the geometric foundation

Why can we extract each \\(c_n\\) by integration? The answer is **orthogonality**. Define the inner product of two complex-valued signals over one period as:

$$
\langle u,\, v \rangle = \frac{1}{T} \int_0^T u(t)\, \overline{v(t)}\, dt,
$$

where \\(\overline{v}\\) denotes the complex conjugate. The Fourier basis functions \\(\varphi_n(t) = e^{i 2\pi n f t}\\) are **orthonormal** under this inner product:

$$
\langle \varphi_m,\, \varphi_n \rangle
= \frac{1}{T} \int_0^T e^{i 2\pi (m-n) f t}\, dt
= \begin{cases} 1 & \text{if } m = n, \\ 0 & \text{if } m \neq n. \end{cases}
$$

This is exactly the same geometric idea as orthogonal coordinate axes in \\(\mathbb{R}^3\\): to find how much of a vector lies along axis \\(\hat{e}_n\\), you take the dot product \\(\mathbf{v} \cdot \hat{e}_n\\). Here, to find how much of the signal lies along basis function \\(\varphi_n\\), you take the inner product \\(\langle x, \varphi_n \rangle = c_n\\).

The orthogonality property is what makes the integral formula work. When you compute \\(\langle x, \varphi_n \rangle\\), all the other Fourier components \\(c_m\, \varphi_m\\) with \\(m \neq n\\) integrate to zero — they do not "bleed into" the coefficient you are trying to extract.

A direct consequence is **Parseval's theorem**, which states that the total energy is the same whether you compute it in the time domain or the frequency domain:

$$
\frac{1}{T}\int_0^T \lvert x(t) \rvert^2\, dt = \sum_{n=-\infty}^{\infty} \lvert c_n \rvert^2.
$$

Energy is conserved across the decomposition. No information is lost or invented by the transform.

---

### The Discrete Fourier Transform

In practice — in computers, digital audio workstations, and DSP chips — signals are not continuous functions but sequences of **samples**. Given \\(N\\) equally spaced samples \\(x[0], x[1], \ldots, x[N-1]\\) (collected at sample rate \\(f_s\\)), the **Discrete Fourier Transform** (DFT) is:

$$
X[k] = \sum_{n=0}^{N-1} x[n]\, e^{-i 2\pi k n / N}, \qquad k = 0, 1, \ldots, N-1.
$$

Each output bin \\(X[k]\\) is a complex number. Its magnitude \\(\lvert X[k] \rvert\\) is the amplitude at frequency \\(k \cdot f_s / N\\), and its argument is the phase. The inverse DFT recovers the original samples:

$$
x[n] = \frac{1}{N} \sum_{k=0}^{N-1} X[k]\, e^{i 2\pi k n / N}.
$$

The same orthogonality holds in the discrete setting. Define the inner product for length-\\(N\\) sequences as \\(\langle u, v \rangle = \tfrac{1}{N} \sum_n u[n]\, \overline{v[n]}\\). The discrete basis vectors \\(\mathbf{f}_k = \bigl(1,\, \omega_N^k,\, \omega_N^{2k},\, \ldots,\, \omega_N^{(N-1)k}\bigr)\\), where \\(\omega_N = e^{i 2\pi / N}\\) is the primitive \\(N\\)-th root of unity, are orthogonal: \\(\langle \mathbf{f}_k, \mathbf{f}_m \rangle = 0\\) for \\(k \neq m\\).

---

### The DFT as a matrix

Stacking the \\(N\\) output values into a vector \\(\mathbf{X}\\) and the input into \\(\mathbf{x}\\), the DFT is a **linear map**:

$$
\mathbf{X} = W\, \mathbf{x},
$$

where \\(W\\) is the \\(N \times N\\) **DFT matrix** with entries \\(W_{kn} = \omega^{kn}\\) and \\(\omega = e^{-i 2\pi / N}\\). For \\(N = 4\\), writing \\(\omega = e^{-i\pi/2} = -i\\):

$$
W_4 = \begin{pmatrix}
1 & 1  & 1  & 1  \\
1 & -i & -1 & \phantom{-}i  \\
1 & -1 & 1  & -1 \\
1 & \phantom{-}i  & -1 & -i
\end{pmatrix}.
$$

Each row is a sampled complex sinusoid at a different frequency. The first row (all ones) extracts the DC component; the second row samples one full cycle of \\(e^{-i2\pi t}\\) at \\(t = 0, 1/4, 1/2, 3/4\\); and so on.

The matrix \\(W\\) satisfies \\(W W^\ast = N I\\), or equivalently \\((W/\sqrt{N})(W/\sqrt{N})^\ast = I\\) — it is **unitary** up to a \\(\sqrt{N}\\) scaling. This is the matrix statement of orthogonality: the rows of \\(W\\) form an orthogonal set, which is why \\(\mathbf{x} = (1/N) W^\ast \mathbf{X}\\) cleanly inverts the transform.

Naively, computing \\(W\mathbf{x}\\) costs \\(O(N^2)\\) operations. The **Fast Fourier Transform** (FFT), discovered in full generality by Cooley and Tukey in 1965,[^12] exploits the recursive structure of \\(W\\) — specifically the fact that \\(\omega^{kn}\\) for even and odd \\(n\\) factors into two smaller DFTs — reducing the cost to \\(O(N \log N)\\). For \\(N = 65536\\) samples, this is the difference between 4 billion and 1 million operations.

---

### Fourier's blind spot: time

Fourier analysis answers "which frequencies are present" but says nothing about **when** they occur. To see why this matters, consider a recording of a single piano note. The note begins with a sharp mechanical click as the hammer strikes the string — a broadband transient lasting a few milliseconds — and then sustains for several seconds with a clear harmonic pitch. If you compute the Fourier transform of the entire recording as a single block, you get one spectrum: a mixture of the sharp attack and the sustained tone, smeared together. The attack has its energy spread evenly across time, and so does the sustain. There is no way to look at that spectrum and see "the click happened at 0.1 s, and the 440 Hz fundamental started 5 ms later." The Fourier transform has destroyed the temporal information.

This is not a computational limitation — it is a fundamental consequence of the **Heisenberg uncertainty principle** for time-frequency analysis. For any signal, define the **time spread** \\(\Delta t\\) and **frequency spread** \\(\Delta f\\) as the standard deviations of energy in the time and frequency domains. Then:

$$
\Delta t \cdot \Delta f \;\geq\; \frac{1}{4\pi}.
$$

A basis function cannot be simultaneously narrow in time and narrow in frequency. The complex exponentials \\(e^{i2\pi nft}\\) of the Fourier basis are the extreme case in one direction: they are perfectly localised in frequency (a single spike in the spectrum) but extend over the entire time axis with constant amplitude. They tell you exactly *what* frequency, but give no information about *when*.

---

### The Short-Time Fourier Transform (STFT)

The pragmatic fix is to analyse the signal in short overlapping slices. Choose a **window function** \\(g(t)\\) — a smooth, bell-shaped function that is large near \\(t = 0\\) and decays to zero on both sides. Sliding it to position \\(\tau\\) gives a localised lens \\(g(t - \tau)\\) that amplifies the signal near time \\(\tau\\) and suppresses it elsewhere. The **Short-Time Fourier Transform** is then a standard Fourier transform applied to each windowed slice:

$$
\mathrm{STFT}(\tau, f) = \int_{-\infty}^{\infty} x(t)\; g(t - \tau)\; e^{-i 2\pi f t}\, dt.
$$

Sweeping \\(\tau\\) across the recording produces a 2D function of time \\(\tau\\) and frequency \\(f\\). Plotting \\(\lvert \mathrm{STFT}(\tau, f) \rvert^2\\) as a heat-map — time on the horizontal axis, frequency on the vertical, brightness encoding amplitude — gives a **spectrogram**. The piano example would show a bright horizontal smear at \\(t = 0.1\\) s (the broadband attack) followed by discrete horizontal bars at 440 Hz, 880 Hz, 1320 Hz, … (the harmonic series of the sustained note). The temporal structure that the Fourier transform lost is now visible.

**Why not just cut the signal with a rectangular window?** Multiplying by a rectangle — setting \\(g(t) = 1\\) inside a window and \\(g(t) = 0\\) outside — creates two sharp edges. By the Fourier convolution theorem, multiplying in time equals convolving in frequency with the Fourier transform of \\(g\\). For a rectangle, that is a sinc function \\(\sin(\pi f T)/(\pi f T)\\), which has slow-decaying side-lobes extending far from the main peak. A sharp 440 Hz sine tone would "leak" energy into every other frequency bin — a phenomenon called **spectral leakage** — making nearby frequencies appear contaminated. Smooth window functions suppress this leakage at the cost of wider main lobes (worse frequency resolution):

- **Rectangular**: sharpest main lobe, worst leakage. Use only when you know the signal fits exactly inside the window with no discontinuity at the edges.
- **Hann** (raised cosine \\(g(t) = \tfrac{1}{2}(1 - \cos(2\pi t/T))\\)): good all-around suppression. The standard choice for music and audio.
- **Gaussian** (\\(g(t) = e^{-t^2/(2\sigma^2)}\\)): achieves the minimum Heisenberg uncertainty product — the "tightest" possible time-frequency tile. Used in the Gabor transform (see below).

**The fixed trade-off.** No matter which smooth window you choose, its time width \\(\Delta t\\) and frequency width \\(\Delta f\\) are set once and apply uniformly to every frequency in the analysis. To distinguish 20 Hz from 21 Hz, you need \\(\Delta f \leq 1\\) Hz, which requires a window of duration \\(\Delta t \gtrsim 1\\) second. At that same 1-second window, the time resolution is 1 second — meaning a 2 ms drum transient gets blurred into a 1-second smear. Conversely, a 5 ms window resolves the transient well but blurs all frequency distinctions finer than 200 Hz.

In speech processing and music analysis, practitioners typically choose windows of 20–50 ms with 75% overlap between successive windows. This captures phoneme-level dynamics in speech and note-level dynamics in music, while still resolving the fundamental frequency of typical voices. But it is always a compromise — you are choosing a fixed ruler and applying it uniformly to a signal that may contain structure at many different time scales simultaneously.

**The STFT as a bank of bandpass filters.** There is an equivalent interpretation of the STFT that connects directly to the cochlea. Each row of the spectrogram at a fixed frequency \\(f_0\\) is the output of passing the signal through a **bandpass filter** centred at \\(f_0\\) with bandwidth \\(\approx 1/\Delta t\\), then reading off the instantaneous envelope. The full STFT is therefore equivalent to an array of such filters, one per frequency bin, all with the same bandwidth — a **uniform filter bank**. The cochlea does essentially the same thing, but its filters widen with frequency (the critical bands we will discuss in the cochlea section below), making it a non-uniform filter bank. The difference between uniform and non-uniform bandwidth is precisely the difference between STFT and wavelets.

---

### Wavelets: localised in both time and frequency

The STFT's limitation is its uniformity: every frequency gets the same window size. But physical and perceptual reality is not uniform. A 40 Hz bass note needs several cycles — at least 25 ms — to establish its pitch. A 4000 Hz transient is over in less than 1 ms. It makes no sense to analyse both with the same window.

Wavelets replace the STFT's fixed window with one that **scales automatically with frequency**: narrow at high frequencies (good time resolution where events are brief) and wide at low frequencies (good frequency resolution where we need to distinguish close pitches). This is possible because all the wavelet basis functions are derived from a single prototype.

#### The mother wavelet and the 1/√a normalisation

Start with a single function \\(\psi(t)\\) called the **mother wavelet**. It must be oscillatory (so it can detect frequency content) and localised (so it decays to zero far from the origin). From it, build a whole family by two operations:

- **Scaling by \\(a > 0\\)**: stretch the wavelet horizontally by factor \\(a\\). When \\(a > 1\\) the wavelet is slower-oscillating (lower frequency); when \\(a < 1\\) it is faster-oscillating (higher frequency).
- **Translating by \\(b\\)**: shift the centre of the wavelet to time \\(b\\).

The scaled-translated family is:

$$
\psi_{a,b}(t) = \frac{1}{\sqrt{a}}\, \psi\!\left(\frac{t - b}{a}\right).
$$

The factor \\(1/\sqrt{a}\\) is not cosmetic — it is an **energy normalisation**. When you stretch a wavelet by \\(a\\), its duration grows by \\(a\\) but its amplitude stays the same, so its energy (the integral of \\(\lvert\psi\rvert^2\\)) would grow by \\(a\\) without correction. Dividing by \\(\sqrt{a}\\) ensures every member of the family has the same total energy, so comparisons of wavelet coefficients at different scales are meaningful.

If the mother wavelet \\(\psi\\) has a dominant oscillation at a "centre frequency" \\(f_c\\) (measured in cycles per unit of \\(t\\)), then \\(\psi_{a,b}\\) oscillates at frequency \\(f_c / a\\). Large \\(a\\) → low frequency; small \\(a\\) → high frequency. This is the inverse-proportionality that makes scale a "frequency-like" coordinate.

#### The Continuous Wavelet Transform

The **CWT** coefficient at scale \\(a\\) and position \\(b\\) is the inner product of the signal with \\(\psi_{a,b}\\):

$$
W(a, b) = \int_{-\infty}^{\infty} x(t)\; \overline{\psi_{a,b}(t)}\, dt
= \frac{1}{\sqrt{a}} \int_{-\infty}^{\infty} x(t)\; \overline{\psi\!\left(\frac{t-b}{a}\right)}\, dt.
$$

Read this as: slide the (scaled, conjugated) mother wavelet to position \\(b\\), multiply it by the signal, and integrate. If the signal near time \\(b\\) oscillates at frequency \\(\approx f_c/a\\) — i.e. its local oscillation matches the frequency and shape of \\(\psi_{a,b}\\) — the integral is large. If the signal looks nothing like the wavelet at that location, the integral is small or zero. The CWT is therefore a **local correlation** between the signal and the scaled wavelet template.

Plotting \\(\lvert W(a, b) \rvert^2\\) with \\(b\\) on the horizontal axis and \\(a\\) (or equivalently \\(f_c/a\\)) on the vertical axis gives a **scalogram** — the wavelet analogue of the spectrogram.

#### The Haar wavelet: the simplest example, worked out

The Haar wavelet is the easiest to follow concretely. It is:

$$
\psi_{\text{Haar}}(t) =
\begin{cases}
+1 & 0 \leq t < \tfrac{1}{2}, \\
-1 & \tfrac{1}{2} \leq t < 1, \\
\phantom{+}0 & \text{otherwise.}
\end{cases}
$$

It is a brief positive pulse followed immediately by a brief negative pulse of the same duration. What does it detect? The Haar coefficient \\(W(a, b)\\) at scale \\(a\\) is proportional to the difference between the average of \\(x\\) over \\([b, b + a/2]\\) and the average over \\([b + a/2, b + a]\\). If those two local averages are equal, the coefficient is zero. If they differ — meaning the signal rises or falls across that \\(a\\)-length window — the coefficient is large. The Haar wavelet detects **local steps or transitions** of duration \\(a\\) around time \\(b\\).

At small scale \\(a\\), it finds rapid micro-transitions (e.g. the leading edge of a drum hit). At large \\(a\\), it finds slow amplitude changes across the whole phrase. For a sustained 440 Hz sine tone, the Haar CWT has large coefficients at scale \\(a = 1/880\\) s (half the period, matching the positive-negative half-cycles) and near-zero at all other scales — correctly identifying the dominant frequency.

Because the Haar wavelet is discontinuous, it introduces small artefacts when used for compression or smooth reconstruction. Real applications use smoother wavelets.

#### The Morlet wavelet: a Gaussian-windowed sinusoid

The Morlet wavelet is the most widely used in audio and neuroscience:

$$
\psi_{\text{Morlet}}(t) = e^{i \omega_0 t}\, e^{-t^2/2},
$$

where \\(\omega_0\\) is a parameter setting the number of oscillation cycles inside the Gaussian envelope (typically \\(\omega_0 = 6\\)). The first factor \\(e^{i\omega_0 t}\\) is an oscillation at angular frequency \\(\omega_0\\); the second factor \\(e^{-t^2/2}\\) is a Gaussian window that localises it in time.

Compare this with the STFT using a Gaussian window \\(g(t) = e^{-t^2/(2\sigma^2)}\\) centred at \\(\tau\\). The STFT at frequency \\(f_0\\) is:

$$
\mathrm{STFT}(\tau, f_0) = \int x(t)\, e^{-{(t-\tau)^2}/{2\sigma^2}}\, e^{-i 2\pi f_0 t}\, dt.
$$

The Morlet CWT at scale \\(a\\) and position \\(b\\) is:

$$
W(a, b) = \frac{1}{\sqrt{a}} \int x(t)\, e^{-{(t-b)^2}/{2a^2}}\, e^{-i \omega_0 (t-b)/a}\, dt.
$$

These are the same computation — convolve the signal with a Gaussian-windowed sinusoid centred at \\((b, \omega_0/a)\\) — except that in the STFT the Gaussian width \\(\sigma\\) is **fixed** and the oscillation frequency \\(f_0\\) varies across the grid, while in the CWT the oscillation frequency \\(\omega_0/a\\) **and** the Gaussian width \\(a\\) both change together proportionally. The Morlet wavelet is a **self-scaling STFT**: at high frequencies, the Gaussian window automatically narrows so the time localisation improves; at low frequencies, it widens to give better frequency resolution.

#### Time-frequency tiling

The Heisenberg uncertainty principle says each basis element occupies a minimum area in the time-frequency plane. The specific shape of each element's tile is what distinguishes the three approaches:

- **Fourier series**: infinitely thin vertical strips — perfect frequency resolution, no time resolution. Every tile has height 1/T and width ∞.
- **STFT**: a uniform grid of rectangles. Every tile has the same width \\(\Delta t\\) (set by the window duration) and the same height \\(\Delta f = 1/\Delta t\\). A 50 ms window gives 20 Hz frequency resolution at all frequencies, from 20 Hz to 20 000 Hz.
- **Wavelets**: a grid of rectangles that grow wider and shorter as frequency decreases. At 4000 Hz the tile is narrow in time and tall in frequency; at 100 Hz it is wide in time and short in frequency. The ratio \\(\Delta f / f\\) — the **constant Q** — stays fixed. Every octave gets the same number of analysis channels, matching the logarithmic spacing of musical pitch.

For music and speech, the wavelet tiling is far more natural. A vowel's pitch harmonics at 100, 200, 300, … Hz are closely spaced and require fine frequency resolution (wide, short tiles at the bottom). A consonant's fricative noise at 3000–8000 Hz spans a wide range and changes quickly, requiring fine time resolution (narrow, tall tiles at the top).

#### The Discrete Wavelet Transform: a filter bank in disguise

The CWT is computationally costly — computing \\(W(a, b)\\) at all scales and positions is redundant. The **Discrete Wavelet Transform** (DWT) extracts the essential information by sampling scales in powers of two (\\(a = 1, 2, 4, 8, \ldots\\)) and positions in proportion to scale (\\(b = 0, a, 2a, \ldots\\)).

The DWT is implemented as a **two-channel filter bank**, applied repeatedly:

1. Pass the signal through a **low-pass filter** \\(h[n]\\) (the scaling filter) → output is a coarse approximation of the signal.
2. Pass the signal through a **high-pass filter** \\(g[n]\\) (the wavelet filter, related to the mother wavelet) → output captures the fine detail at the current scale.
3. **Downsample** both outputs by 2 (keep every other sample).
4. Apply the same two filters to the low-pass output → repeat, extracting detail at the next coarser scale.

After \\(J\\) levels, you have \\(J\\) detail channels (each capturing oscillations at a different octave) plus one coarse approximation channel. Together they contain exactly as many samples as the original signal — no information is lost. This is the discrete counterpart of the CWT, and it runs in \\(O(N)\\) time — faster than even the FFT.

In practice, each level's detail channel corresponds to a frequency octave:
- Level 1 details: highest octave (e.g. 11 025–22 050 Hz at 44.1 kHz sample rate)
- Level 2 details: next octave (5513–11 025 Hz)
- Level 3 details: 2756–5513 Hz
- … and so on down to the bass register.

This perfectly mirrors the octave structure of musical scales, which is why wavelet decompositions are natural tools for music transcription, onset detection, and pitch estimation.

Some commonly used mother wavelets:

- **Haar**: the step function above — computationally trivial, discontinuous. Good for detecting sharp edges.
- **Daubechies \\(D_N\\)**: a family of smooth compact wavelets with \\(N\\) vanishing moments (meaning they are "blind" to polynomial trends of degree up to \\(N - 1\\)). \\(D_4\\) and \\(D_8\\) are standard choices for compression. JPEG 2000 uses the biorthogonal CDF 9/7 pair, which allows for symmetric filters and efficient lossy compression.[^14]
- **Morlet**: the complex Gaussian-windowed sinusoid above — not compactly supported, but gives the most interpretable scalograms for audio and neural signal analysis.
- **Symlets and Coiflets**: variants of Daubechies wavelets with improved symmetry, used in signal denoising.

#### When to use STFT vs wavelets

Use the **STFT** when you need a uniform frequency grid (e.g. musical note detection, speech recognition feature extraction, or anything comparing to a fixed-frequency reference like a tuner). Use **wavelets** when the signal has structure at multiple time scales simultaneously (transient detection, denoising by thresholding detail coefficients, compression, or any analysis where bass and treble events have fundamentally different durations).

---

### Other decompositions worth knowing

The Fourier series and wavelets are not the only ways to decompose a signal. Different decompositions are better suited to different structures and goals.

**Discrete Cosine Transform (DCT).** Uses only cosines (no sines), producing purely real coefficients. The **Type-II DCT** is defined as:

$$
C[k] = \sum_{n=0}^{N-1} x[n]\, \cos\!\left(\frac{\pi}{N}\!\left(n + \tfrac{1}{2}\right) k\right).
$$

Cosines form a basis that minimises the energy in high-frequency coefficients for smooth real signals, making the DCT almost optimal for compression. MP3 and AAC audio codecs use the **Modified DCT** (MDCT), which overlaps analysis windows and discards half the coefficients per frame, achieving both compression and artifact-free reconstruction.[^13] JPEG images use the DCT blockwise for the same reason.

**The Laplace Transform.** Generalises the Fourier transform by replacing \\(i2\pi f\\) with a complex variable \\(s = \sigma + i\omega\\):

$$
\mathcal{L}\{x\}(s) = \int_0^{\infty} x(t)\, e^{-s t}\, dt.
$$

The real part \\(\sigma\\) allows the transform to converge for signals that grow in time. More importantly, it maps differential equations into algebraic ones: a system's frequency response, stability (pole locations relative to the imaginary axis), and transient behaviour all become visible in the \\(s\\)-plane. The **Z-transform** is the discrete analogue, mapping difference equations into polynomials and underpinning digital filter design.

**Principal Component Analysis / Karhunen-Loève Transform.** The transforms above use fixed, universal basis functions (sines, wavelets, cosines). PCA/KLT chooses the basis **from the data itself**: it finds the set of orthogonal directions that capture the maximum variance in a collection of signals. Each principal component is a data-adaptive "mode" that explains as much of the remaining variance as possible after accounting for previous components. This is the signal decomposition used in speech recognition feature extraction (LDA), face recognition (eigenfaces), and dimensionality reduction generally. It is optimal for a specific dataset but cannot be written down without first seeing that data.

**Empirical Mode Decomposition (EMD).**[^15] A fully data-adaptive, non-linear decomposition that requires no prescribed basis at all. It extracts **Intrinsic Mode Functions** (IMFs) by iteratively subtracting local oscillations identified by envelope interpolation — a process called sifting. Each IMF is a locally narrow-band signal, and the set of IMFs reconstructs the original exactly. EMD handles non-stationary and non-linear signals where Fourier and wavelets struggle, and is used in biomedical signal analysis (EEG, ECG) and geophysics. The price is that IMFs have no closed-form mathematical definition; the algorithm defines them implicitly.

The right decomposition depends on what structure you want to expose:

- Frequency content of a periodic signal → **Fourier series / DFT**
- Time-frequency evolution of audio → **STFT (spectrogram)**
- Multi-scale transient structure → **Wavelets**
- Compression of smooth real data → **DCT / MDCT**
- Linear system analysis → **Laplace / Z-transform**
- Data-specific dimensionality reduction → **PCA / KLT**
- Non-stationary, non-linear signals → **EMD**

---

## A Catalogue of Linear Operations

A map \\(L: L^2 \to L^2\\) is **linear** when

$$
L(\alpha p + \beta q) = \alpha\, L(p) + \beta\, L(q)
$$

for all signals \\(p, q\\) and scalars \\(\alpha, \beta\\). Linearity means: the system's response to a mixture is the mixture of its individual responses. The following operations are all linear, and together they are the basic vocabulary of audio signal processing.

**Amplitude scaling** \\((S_\alpha p)(t) = \alpha\, p(t)\\). Multiplying by a constant changes loudness without affecting frequency content. Gain stages in amplifiers, volume knobs, and mixing faders are all amplitude scaling.

**Time delay** \\((D_\tau p)(t) = p(t - \tau)\\). Shift the signal backward in time by \\(\tau\\) seconds. Room reflections, reverb taps, delay pedals, and the finite speed of sound between a speaker and a listener are all delay operations. A pure tone \\(\cos(2\pi f t)\\) delayed by \\(\tau\\) becomes \\(\cos(2\pi f t - 2\pi f \tau)\\): the frequency is preserved, only the phase changes.

**Differentiation** \\((D p)(t) = p'(t)\\). Acts on each Fourier component as multiplication by \\(i 2\pi n f\\) — scaling amplitude by \\(2\pi n f\\) and rotating phase by \\(\pi/2\\). High frequencies are amplified relative to low frequencies. Velocity microphones (ribbon microphones) measure the velocity of air molecules rather than pressure; their response is the derivative of the pressure wave, which is why they have a natural high-frequency roll-off in their polar pattern.

**Integration** \\((I p)(t) = \int_0^t p(s)\, ds\\). The opposite: scales each component by \\(1/(2\pi n f)\\), suppressing high frequencies. The mechanical displacement of the basilar membrane in the cochlea is related to the integral of the pressure gradient across it.

**Convolution with an impulse response** \\((h * p)(t) = \int_{-\infty}^{\infty} h(\tau)\, p(t - \tau)\, d\tau\\). This is the master operation. Any **linear time-invariant (LTI) system** — a resonant cavity, an electronic filter, the acoustics of a concert hall, a digital reverb unit — is completely characterised by its **impulse response** \\(h(t)\\). The system's output for any input is the convolution of the input with \\(h\\). In the frequency domain, convolution becomes multiplication: \\(\widehat{h * p}(f) = \hat{h}(f)\, \hat{p}(f)\\). This is why equalisation and filtering are straightforward in the frequency domain: each frequency component is independently scaled by the filter's frequency response \\(\hat{h}(f)\\).

**Superposition / mixing** \\(p(t) + q(t)\\). The focus of this post. Mathematically the most elementary linear operation; acoustically the source of beating, interference, harmony, and timbre.

The decisive consequence of linearity is this: **if you know how a system responds to each pure sine wave separately, you know how it responds to any signal**. Write the signal as a Fourier series, pass each harmonic through the system, and sum the results. Each harmonic is processed independently, with no cross-talk. Frequency components that enter a linear system alone also leave alone. New frequencies cannot be created. This is sometimes called the **principle of frequency preservation** — a linear system is incapable of generating harmonic content that was not already present in the input.

We will see, at the end of this post, exactly what happens when that principle fails.

---

## What Happens When We Add Two Sine Waves?

A pure musical tone is a sine wave. If we play two tones at once — say, 438 Hz and 440 Hz — we are adding two sine waves. The air pressure at your ear is the sum of the two pressures. So the combined waveform is

$$
s(t) = A_1 \cos(2\pi f_1 t) + A_2 \cos(2\pi f_2 t),
$$

where \\(f_1\\) and \\(f_2\\) are the frequencies in Hertz, and \\(A_1\\), \\(A_2\\) are the amplitudes. For simplicity, take \\(A_1 = A_2 = 1\\) and work with

$$
s(t) = \cos(2\pi f_1 t) + \cos(2\pi f_2 t).
$$

The question is: what does this sum sound like?

### The trigonometric identity

The key is the sum-to-product identity:

$$
\cos \alpha + \cos \beta = 2 \cos\!\left(\frac{\alpha - \beta}{2}\right) \cos\!\left(\frac{\alpha + \beta}{2}\right).
$$

Applying this with \\(\alpha = 2\pi f_1 t\\) and \\(\beta = 2\pi f_2 t\\):

$$
\cos(2\pi f_1 t) + \cos(2\pi f_2 t)
= 2\cos\!\left(\pi(f_1 - f_2) t\right) \cos\!\left(\pi(f_1 + f_2) t\right).
$$

The sum factors into two cosines:

- **Carrier**: \\(\cos\!\bigl(\pi(f_1 + f_2) t\bigr)\\) oscillates at the **average frequency** \\(\tfrac{f_1 + f_2}{2}\\) — the pitch we hear.
- **Envelope**: \\(2\cos\!\bigl(\pi(f_1 - f_2) t\bigr)\\) oscillates at **half the difference** — a slow oscillation that modulates the loudness.

When the envelope equals \\(\pm 2\\), the two waves are in phase and reinforce (constructive interference). When it equals zero, the waves are exactly out of phase and cancel (destructive interference). The result is a periodic pulsing in amplitude — the **beat**.

### The beat frequency

The envelope \\(2\lvert\cos(\pi(f_1-f_2)t)\rvert\\) completes a full loudness cycle — from loud to silent to loud — twice per period of the cosine, because \\(\lvert\cos\rvert\\) has twice the frequency of \\(\cos\\). The envelope period is \\(2/\lvert f_1 - f_2 \rvert\\), so the time between consecutive peaks is \\(1/\lvert f_1 - f_2 \rvert\\). The **beat frequency** is therefore

$$
\boxed{f_{\text{beat}} = \lvert f_1 - f_2 \rvert.}
$$

If two tones differ by 2 Hz, you hear 2 beats per second. When the frequencies match, beating disappears. This is the physical basis of **tuning by ear**: a musician tunes to eliminate beating between their note and a reference.

Notice what the linear structure guarantees: no new frequency is created. The signal still contains only \\(f_1\\) and \\(f_2\\). The beat at \\(\lvert f_1 - f_2 \rvert\\) is a perception arising from amplitude modulation — not a physical frequency present in the air.

---

## The Phasor Picture

The sum-to-product derivation above is correct but somewhat opaque. The phasor picture makes it geometric and generalises immediately to \\(N\\) waves.

Replace each real cosine with a complex exponential using Euler's formula \\(e^{i\theta} = \cos\theta + i\sin\theta\\). A cosine is the real part:

$$
\cos(2\pi f t) = \operatorname{Re}\!\left[e^{i 2\pi f t}\right].
$$

A **phasor** \\(e^{i 2\pi f t}\\) is a unit vector in the complex plane rotating at angular frequency \\(2\pi f\\) radians per second anticlockwise. Its real part (projection onto the horizontal axis) is the cosine.

Adding two phasors at slightly different frequencies:

$$
e^{i 2\pi f_1 t} + e^{i 2\pi f_2 t}.
$$

Factor out the average-frequency phasor:

$$
= e^{i \pi (f_1 + f_2) t} \left[ e^{i \pi (f_1 - f_2) t} + e^{-i \pi (f_1 - f_2) t} \right]
= e^{i \pi (f_1 + f_2) t} \cdot 2\cos\!\bigl(\pi(f_1 - f_2)t\bigr).
$$

Taking the real part recovers the beating formula — but now the structure is clear geometrically. The two phasors rotate at slightly different rates. At some moments they point in (nearly) the same direction and their sum has magnitude \\(\approx 2\\). Half a beat period later, they point in opposite directions and their sum has magnitude \\(\approx 0\\). The sum phasor spins at the average frequency while its magnitude oscillates at the difference frequency.

### Generalising to N waves

Suppose we have \\(N\\) phasors at frequencies \\(f_1, f_2, \ldots, f_N\\) clustered near a common frequency \\(f_0\\):

$$
S(t) = \sum_{k=1}^{N} A_k e^{i 2\pi f_k t} = e^{i 2\pi f_0 t} \sum_{k=1}^{N} A_k e^{i 2\pi (f_k - f_0) t}.
$$

The factor outside is a carrier phasor spinning at \\(f_0\\). The sum inside is a slowly varying complex amplitude — a **slowly modulated envelope** whose time scale is \\(1/\max_k \lvert f_k - f_0 \rvert\\). When all the component phasors point in the same direction (constructive interference), the envelope peaks. When they cancel, the envelope dips.

This is the mathematical foundation of **wave packets** in physics. A laser pulse, a quantum particle's wavefunction, a radar pulse, and the attack transient of a piano note all share this structure: a carrier oscillation modulated by a slowly varying amplitude that reflects the coherence of many overlapping frequency components.

---

## Many Waves: Interference, Harmony, and Roughness

When many tones are present simultaneously, linear superposition creates a complex interference pattern. The key question is: which pairs of components interfere with each other in a way the ear can detect?

### Interference within a critical band

The ear does not hear arbitrary frequency differences as beats. It groups nearby frequencies into **critical bands** — the roughly 1/3-octave-wide windows within which frequency components share the same place on the basilar membrane and interfere directly (see the next section for the biology). The width of these auditory filters is captured by the **equivalent rectangular bandwidth** (ERB):[^1]

$$
\text{ERB}(f) \approx 24.7\bigl(1 + 4.37\, f / 1000\bigr) \text{ Hz},
$$

where \\(f\\) is in Hz. At 500 Hz, ERB ≈ 80 Hz; at 2000 Hz, ERB ≈ 240 Hz.

Beats are audible when two components fall within a critical band. As the frequency separation increases through a critical band:[^2]

- **\\(\lvert f_1 - f_2 \rvert \lesssim 15\\) Hz**: slow beats, heard as a distinct pulse rate.
- **15 Hz to \\(\sim\\)40 Hz**: fast beats heard as **roughness** — the characteristic dissonant buzz of a minor second or a mistuned unison on a piano.
- **Beyond the critical band**: the two components excite different membrane locations; beating fades and we hear two distinct pitches (a musical interval).

### Harmony and the harmonic series

Musical instruments produce not a single frequency but a **harmonic series**: a fundamental \\(f_0\\) and overtones at \\(2f_0, 3f_0, 4f_0, \ldots\\) Helmholtz argued in 1863 that consonant intervals — octave (2:1), perfect fifth (3:2), perfect fourth (4:3), major third (5:4) — are those whose overtone series align with small beating rates.[^3]

For example, a perfect fifth: \\(f_0\\) and \\(\tfrac{3}{2} f_0\\). The third harmonic of the lower tone is \\(3f_0\\); the second harmonic of the upper tone is \\(3f_0\\). They coincide exactly — zero beating. The fourth harmonic of the lower tone is \\(4f_0\\); the third harmonic of the upper is also \\(\tfrac{9}{2} f_0\\) — these do not align, but their difference \\(\tfrac{1}{2} f_0\\) is a large interval and is not heard as roughness. The major second (9:8), by contrast, has many pairs of nearby harmonics that produce slow, rough beats — it is perceptually unstable.

Consonance and dissonance, on this view, are not arbitrary cultural conventions but consequences of the mathematics of linear superposition applied to harmonic spectra, perceived through the frequency resolution of the cochlea.

---

## The Cochlea: Biology Does the Fourier Transform

The outer ear (pinna) collects sound, the eardrum converts pressure to mechanical vibration, and the three ossicles (malleus, incus, stapes) transfer that vibration to the **oval window** of the cochlea. What happens inside the cochlea is one of the most elegant examples of biological signal processing in the natural world.

### The basilar membrane as a graded resonator

The cochlea is a fluid-filled spiral chamber about 35 mm long when uncoiled.[^4] Running nearly its full length is the **basilar membrane**, a ribbon of tissue that varies continuously in mechanical properties: at the **base** (near the oval window) it is narrow and stiff, resonating with high frequencies; at the **apex** it is wide and flexible, resonating with low frequencies.

When a pure tone enters, it creates a **travelling wave** along the basilar membrane that builds up to a maximum amplitude at the location whose resonant frequency matches the tone — and decays rapidly beyond that point.[^5] The result is a place-to-frequency mapping (**tonotopy**): approximately

$$
x \approx \frac{L}{\alpha} \log\!\left(\frac{f_{\max}}{f}\right),
$$

where \\(x\\) is distance from the apex, \\(L \approx 35\\) mm, \\(f_{\max} \approx 20\,000\\) Hz, and \\(\alpha \approx \ln(f_{\max}/f_{\min}) \approx \ln(1000) \approx 6.9\\). Frequency is encoded as position along a logarithmic scale — matching musical pitch perception, which is also logarithmic (an octave always represents doubling of frequency, regardless of register).

About 3 500 **inner hair cells** are arrayed along the membrane, each one tuned to its characteristic frequency by its location.[^6] They transduce mechanical vibration into neural impulses sent to the auditory cortex via the auditory nerve.

### Why beating requires close frequencies

Two tones at 440 Hz and 442 Hz excite the basilar membrane at almost the same location. Their mechanical vibrations combine before reaching the inner hair cells. The temporal envelope — the \\(2\cos(\pi \cdot 2 \cdot t)\\) factor, pulsing twice per second — is directly felt by the hair cells as a modulation in the amplitude of vibration. The auditory system reports this as a beat at 2 Hz.

Two tones at 440 Hz and 660 Hz (a perfect fifth) excite the membrane at **different locations**. Their vibrations do not combine mechanically. The auditory system processes them as two separate pitches, not as a beating unison.

This is why the critical band is not a fixed Hz width but scales with frequency: the basilar membrane allocates logarithmically distributed frequency resolution, and a "close enough to beat" criterion is defined by mechanical overlap of excitation patterns, not by absolute frequency difference.

### Active amplification and the outer hair cells

A subtlety: the basilar membrane is not a passive resonator. **Outer hair cells** (about 12 000 of them, in three rows alongside the inner hair cells) are electromotile — they actively contract and elongate in response to the traveling wave, injecting energy back into the membrane at the characteristic frequency.[^7] This active amplification makes the cochlea sensitive to sounds as quiet as the thermal motion of air molecules (0 dB SPL ≈ \\(20 \times 10^{-6}\\) Pa). It also introduces **nonlinearity**: the amplification compresses at high levels and generates distortion products — a fact we will return to.

The cochlea is thus simultaneously a mechanical Fourier analyser and an active biological machine with its own internal dynamics. It is approximately linear at low-to-moderate levels, and this approximation is what allows the theory developed here to work. At high levels — and especially in the presence of pathological conditions — its nonlinear character becomes dominant.

---

## A Time Series View: Autocorrelation and Spectral Density

There is a second, complementary mathematical way to see the frequency content of a beating signal, one that connects to statistical signal processing and does not require explicitly computing a Fourier transform.

### Autocorrelation

The **autocorrelation function** of a signal \\(s(t)\\) is defined as

$$
R(\tau) = \lim_{T \to \infty} \frac{1}{2T} \int_{-T}^{T} s(t)\, s(t + \tau)\, dt.
$$

It measures how similar the signal is to a delayed copy of itself. For a pure cosine \\(s(t) = \cos(2\pi f_0 t)\\):

$$
R(\tau) = \frac{1}{2}\cos(2\pi f_0 \tau).
$$

The autocorrelation is itself a cosine at the same frequency — the signal "remembers" its periodicity at every lag.

For the beating signal \\(s(t) = \cos(2\pi f_1 t) + \cos(2\pi f_2 t)\\), expand:

$$
R(\tau) = \frac{1}{2}\cos(2\pi f_1 \tau) + \frac{1}{2}\cos(2\pi f_2 \tau).
$$

The cross-terms \\(\lim_{T\to\infty} \frac{1}{2T}\int \cos(2\pi f_1 t)\cos(2\pi f_2 (t+\tau))\,dt\\) integrate to zero when \\(f_1 \neq f_2\\). So the autocorrelation separates: it has one peak at lag \\(1/f_1\\) and another at lag \\(1/f_2\\), with no trace of the beat frequency \\(\lvert f_1 - f_2 \rvert\\).

This is the mathematical confirmation that the beat is not a new frequency: the autocorrelation, which captures all genuine periodicities in the signal, shows exactly two, at \\(f_1\\) and \\(f_2\\).

### The Wiener–Khinchin theorem and power spectral density

The **Wiener–Khinchin theorem** states that the **power spectral density** (PSD) of a wide-sense stationary signal is the Fourier transform of its autocorrelation:

$$
S(f) = \int_{-\infty}^{\infty} R(\tau)\, e^{-i 2\pi f \tau}\, d\tau.
$$

For the beating signal:

$$
S(f) = \frac{1}{2}\bigl[\delta(f - f_1) + \delta(f + f_1)\bigr] + \frac{1}{2}\bigl[\delta(f - f_2) + \delta(f + f_2)\bigr].
$$

The PSD has exactly two pairs of impulses, at \\(\pm f_1\\) and \\(\pm f_2\\). Nothing at \\(\lvert f_1 - f_2 \rvert\\), nothing at \\((f_1 + f_2)/2\\). The spectrum is sparse and perfectly represents what the signal actually contains.

This has a practical consequence for audio analysis. If you record a beating sound and compute its PSD (via the autocorrelation route or directly via FFT), you can read off the two component frequencies directly. The beat rate \\(\lvert f_1 - f_2 \rvert\\) is inferred by arithmetic from the two spectral peaks — it is not itself a spectral peak.

The autocorrelation approach also generalises to non-periodic signals (like speech or room noise) and to random processes (like thermal noise), giving it much wider applicability than the Fourier series alone.

---

## When Linearity Fails: A Preview

Everything derived so far depended on linearity. In the linear world, a system cannot create new frequencies. Beating is amplitude modulation, not a new spectral component. Two tones in, two frequencies out. But physical and biological systems are only approximately linear, and when the approximation fails, the mathematics changes qualitatively.

### Taylor expansion of a nonlinearity

Suppose a system (an amplifier, the eardrum-ossicle chain, a loudspeaker cone at high displacement, or the outer hair cells of the cochlea) has a small nonlinear component. Its input-output relation can be expanded as a Taylor series:

$$
y = a_1 x + a_2 x^2 + a_3 x^3 + \cdots
$$

Feed in two tones: \\(x(t) = \cos(2\pi f_1 t) + \cos(2\pi f_2 t)\\). The linear term \\(a_1 x\\) produces only \\(f_1\\) and \\(f_2\\) — as expected. The quadratic term \\(a_2 x^2\\) is more interesting:

$$
x^2 = \cos^2(2\pi f_1 t) + 2\cos(2\pi f_1 t)\cos(2\pi f_2 t) + \cos^2(2\pi f_2 t).
$$

Using the product-to-sum identities:

$$
x^2 = \frac{1}{2} + \frac{1}{2}\cos(4\pi f_1 t) + \cos\!\bigl(2\pi(f_1 + f_2)t\bigr) + \cos\!\bigl(2\pi(f_1 - f_2)t\bigr) + \frac{1}{2} + \frac{1}{2}\cos(4\pi f_2 t).
$$

The quadratic nonlinearity generates:
- A DC component (constant offset)
- Second harmonics: \\(2f_1\\) and \\(2f_2\\)
- **Sum frequency**: \\(f_1 + f_2\\)
- **Difference frequency**: \\(f_1 - f_2\\)

The cubic term \\(a_3 x^3\\) generates \\(3f_1\\), \\(3f_2\\), \\(2f_1 \pm f_2\\), and \\(2f_2 \pm f_1\\). These **intermodulation products** proliferate with each order of nonlinearity.

### The crucial distinction: modulation vs intermodulation

In the linear beating case, the signal \\(\cos(2\pi f_1 t) + \cos(2\pi f_2 t)\\) is *amplitude modulated* at rate \\(\lvert f_1 - f_2 \rvert\\), but the signal physically contains only \\(f_1\\) and \\(f_2\\). The beat is a perceptual event, not a spectral one.

In the nonlinear case, the quadratic term produces a genuine physical component at \\(f_1 - f_2\\) in the output signal. If \\(f_1 = 800\\) Hz and \\(f_2 = 1000\\) Hz, a difference tone at 200 Hz is generated — a real, measurable pressure wave.

This is the phenomenon Tartini first observed around 1714 and later documented in print: **Tartini tones** (or "combination tones").[^8] String players heard a mysterious third pitch below two simultaneously bowed notes. The source is cochlear nonlinearity: the active outer hair cells generate a combination tone at \\(2f_1 - f_2\\) (and to lesser extent \\(f_2 - f_1\\)) that is loud enough to be consciously perceived. This **cubic difference tone** at \\(2f_1 - f_2\\) is particularly strong because it is generated by the dominant cubic term in the cochlea's nonlinearity.[^9] For a perfect fifth (\\(f_2 / f_1 = 3/2\\)), the cubic difference tone is at \\(2f_1 - \tfrac{3}{2}f_1 = \tfrac{1}{2}f_1\\) — exactly one octave below the lower note, reinforcing the bass.

Professional musicians use Tartini tones to check the intonation of double-stops without electronic tuners: if the difference tone sings at a stable, recognisable pitch, the interval is in tune.[^10]

### The principle of frequency preservation, broken

In a linear system: only frequencies present in the input appear in the output.  
In a nonlinear system: new frequencies are born from interactions between input frequencies.

This is the boundary between two entirely different worlds of audio processing:

- **Linear world**: filters, EQ, reverb, delay, dynamics (when modelled as linear). Analysis by frequency decomposition. The Fourier transform is the natural language.
- **Nonlinear world**: distortion, saturation, AM and FM synthesis, waveshaping, aliasing, and all the beautiful mathematics of chaos and complexity. The Fourier transform is still useful, but it no longer tells the whole story.

Understanding the linear world thoroughly — its operators, its Hilbert space structure, its biological instantiation in the cochlea, and its implications for harmony and timbre — is prerequisite to understanding why and how nonlinear transformations sound the way they do. The next post in this series will step across that boundary.

---

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

---

## Connections Forward

This post has traced a single idea — linear superposition — through several disciplines:

- **Physics**: the wave equation is linear; air superposes sounds exactly at everyday SPLs.
- **Functional analysis**: signals are vectors in \\(L^2\\); the Fourier decomposition is an orthogonal projection onto a basis.
- **Time-frequency analysis**: the DFT (and FFT), STFT with windowing, CWT and DWT wavelets, DCT, and data-adaptive methods such as PCA and EMD each expose different structure, optimising for different trade-offs between time and frequency resolution.
- **Signal processing**: scaling, delay, differentiation, and convolution are all linear operators; LTI systems preserve frequencies.
- **Acoustics and music**: beating, interference, harmony, and dissonance follow from superposition plus the cochlea's critical bands.
- **Biology**: the basilar membrane performs a physical Fourier transform; tonotopy encodes frequency as place; the cochlea is approximately — but not perfectly — linear.
- **Statistics**: autocorrelation and the Wiener–Khinchin theorem give a second route to the spectrum; beating produces no new spectral peak.
- **Nonlinear preview**: a quadratic nonlinearity generates sum and difference frequencies; Tartini tones are a biological instance of intermodulation distortion.

Each of these threads can be pulled further. The [waveforms post]({{ '/2026/03/19/synth-waveforms.html' | relative_url }}) develops the Fourier series perspective on oscillator shapes. The [Chladni plates post]({{ '/2026/03/14/chladni-plates.html' | relative_url }}) extends the PDE picture to two dimensions and shows how boundary conditions create standing-wave patterns. Future posts will cross into the nonlinear territory previewed in the final section above: FM synthesis, waveshaping, distortion, and the mathematics of systems that generate rather than merely filter.

The linear world is where analysis is tractable. Knowing it precisely is what makes the nonlinear world legible.

---

## References

[^1]: Glasberg, B. R., & Moore, B. C. J. (1990). Derivation of auditory filter shapes from notched-noise data. *Hearing Research*, *47*(1–2), 103–138. <https://doi.org/10.1016/0378-5955(90)90170-T>

[^2]: Zwicker, E., & Fastl, H. (1990). *Psychoacoustics: Facts and Models*. Springer. The roughness threshold of approximately 15–40 Hz frequency separation is discussed in Chapter 10.

[^3]: von Helmholtz, H. (1863). *Die Lehre von den Tonempfindungen als physiologische Grundlage für die Theorie der Musik*. Vieweg. English translation: Ellis, A. J. (Trans.) (1954). *On the Sensations of Tone*. Dover.

[^4]: Robles, L., & Ruggero, M. A. (2001). Mechanics of the mammalian cochlea. *Physiological Reviews*, *81*(3), 1305–1352. <https://doi.org/10.1152/physrev.2001.81.3.1305>

[^5]: von Békésy, G. (1960). *Experiments in Hearing*. McGraw-Hill. von Békésy received the Nobel Prize in Physiology or Medicine in 1961 for the discovery of the travelling wave mechanism.

[^6]: Spoendlin, H. (1969). Innervation patterns in the organ of corti of the cat. *Acta Oto-Laryngologica*, *67*(2–6), 239–254. The figure of approximately 3 500 inner hair cells in humans is consistent across multiple anatomical studies; see also Pickles, J. O. (2008). *An Introduction to the Physiology of Hearing* (3rd ed.). Emerald Group Publishing.

[^7]: Brownell, W. E., Bader, C. R., Bertrand, D., & de Ribaupierre, Y. (1985). Evoked mechanical responses of isolated cochlear outer hair cells. *Science*, *227*(4683), 194–196. <https://doi.org/10.1126/science.3966153>

[^8]: Tartini, G. (1754). *Trattato di musica secondo la vera scienza dell'armonia*. Stamperia del Seminario, Padova. Tartini's own account places his initial discovery around 1714. The English translation of an excerpt appears in Helmholtz (1863/1954), pp. 152–153.

[^9]: Goldstein, J. L. (1967). Auditory nonlinearity. *Journal of the Acoustical Society of America*, *41*(3), 676–689. <https://doi.org/10.1121/1.1910396>

[^10]: The pedagogical use of difference tones for intonation checking is described in Fétis, F.-J. (1844). *Traité complet de la théorie et de la pratique de l'harmonie*, and later formalised in modern string pedagogy; see Galamian, I. (1962). *Principles of Violin Playing and Teaching*. Prentice-Hall.

[^11]: Fourier, J. B. J. (1807). *Mémoire sur la propagation de la chaleur dans les corps solides* (unpublished memoir presented to the Institut de France). Published in expanded form as: Fourier, J. B. J. (1822). *Théorie analytique de la chaleur*. Firmin Didot, Paris. English translation: Freeman, A. (Trans.) (1878). *The Analytical Theory of Heat*. Cambridge University Press.

[^12]: Cooley, J. W., & Tukey, J. W. (1965). An algorithm for the machine calculation of complex Fourier series. *Mathematics of Computation*, *19*(90), 297–301. <https://doi.org/10.2307/2003354>. Earlier special-case algorithms are traced in Heideman, M. T., Johnson, D. H., & Burrus, C. S. (1985). Gauss and the history of the fast Fourier transform. *IEEE ASSP Magazine*, *2*(4), 14–21.

[^13]: Princen, J. P., & Bradley, A. B. (1986). Analysis/synthesis filter bank design based on time domain aliasing cancellation. *IEEE Transactions on Acoustics, Speech, and Signal Processing*, *34*(5), 1153–1161. <https://doi.org/10.1109/TASSP.1986.1164954>. The MDCT as used in MP3 is specified in ISO/IEC 11172-3 (1993); in AAC in ISO/IEC 13818-7 (1997).

[^14]: ISO/IEC 15444-1:2004. *Information technology — JPEG 2000 image coding system: Core coding system*. The choice of the CDF 9/7 biorthogonal wavelet filter pair is described in Annex F. See also: Taubman, D., & Marcellin, M. (2002). *JPEG2000: Image Compression Fundamentals, Standards and Practice*. Kluwer Academic Publishers.

[^15]: Huang, N. E., Shen, Z., Long, S. R., Wu, M. C., Shih, H. H., Zheng, Q., Yen, N.-C., Tung, C. C., & Liu, H. H. (1998). The empirical mode decomposition and the Hilbert spectrum for nonlinear and non-stationary time series analysis. *Proceedings of the Royal Society of London A*, *454*(1971), 903–995. <https://doi.org/10.1098/rspa.1998.0193>
