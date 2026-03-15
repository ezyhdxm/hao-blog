---
layout: post
title: "Chladni Plates"
date: 2026-03-14 13:30:00 +0800
tags: music
lang: en
comments: true
---

> Avaramente de la clepsidra se desprenden
> gotas de lenta miel o de invisible oro
> que en el tiempo reiteran un tejido
> eterno, frágil, enigmático y claro.
> — Jorge Luis Borges, *“Caja de música”*

<!--more-->

## The Shape of Sound

Sound is vibration in air pressure. When something vibrates, it pushes and pulls the surrounding air, and if we measure that pressure at a fixed location over time, we obtain a waveform. When the vibration repeats regularly, we hear it as a musical pitch. The number of repetitions per second is called the frequency, measured in Hertz (Hz).

People often describe sound using visual metaphors, but sound can also create genuine visual structure. It does not only unfold in time. We can also freeze a moment and ask how the vibration is distributed across space. Seen this way, sound becomes geometry. A vibrating surface does not move uniformly: some regions oscillate strongly, while others barely move at all. One of the most beautiful ways to reveal this hidden spatial structure is through a Chladni plate.

---

### From Musical Sound to Visible Geometry

In the following video, a metal plate is driven by sound while sand is sprinkled on its surface.

{% include embed-iframe.html
src="https://www.youtube.com/embed/Q3oItpVa9fs"
title="CYMATICS: Science Vs. Music - Nigel Stanford"
%}

This is where the connection to music becomes direct. A musical tone is not just something we hear. It is also a physical forcing signal: an oscillating pressure wave in air that pushes on nearby objects. The plate responds to that forcing, and under the right conditions the response becomes large enough to organize the sand into striking patterns.

Here is the basic mechanism:

* the sound wave exerts an oscillating force on the plate,
* the plate responds by vibrating up and down,
* regions with large motion shake sand away,
* regions with almost no motion retain sand,
* and the sand traces out the stationary curves of the vibration.

These stationary curves are called **nodal lines**. They are the places where the plate’s displacement is essentially zero throughout the motion.

So a Chladni pattern is not random decoration. It is the visible footprint of how the plate vibrates under sound.

---

### What Would a Pure Sine Wave Do?

Suppose the plate is driven by a **pure sine wave**, meaning a single clean frequency. Mathematically, the forcing would look like

$$
F(x,y,t) = G(x,y)\cos(\omega t),
$$

where \\(G(x,y)\\) describes how strongly the sound pushes different parts of the plate, and \\(\omega\\) is the driving angular frequency.

This is the simplest possible musical input: one frequency, no harmonics, no timbral complexity. Physically, it is like playing a perfectly pure tone next to the plate.

A pure sine wave does **not** automatically produce an arbitrary complicated pattern. Instead, it tries to drive the plate at one specific frequency. If that frequency is far from the plate’s preferred frequencies, the response is weak. The plate moves a little, but no clean large-scale pattern emerges. But if the sine wave is close to one of the plate’s natural frequencies, then the corresponding vibration pattern gets strongly amplified. That is when the sand suddenly organizes into a sharp Chladni figure.

So a pure sine wave acts like a probe: it asks the plate,

> “Do you like vibrating at this frequency?”

If the answer is yes, the plate responds dramatically.

---

### The Forced Plate Equation

To describe this mathematically, let

$$
u(x, y, t),
$$

be the vertical displacement of the plate at position \\((x,y)\\) and time \\(t\\).

For a thin elastic plate, the motion is modeled by the **forced plate equation**

$$
\rho h \, u_{tt} + D \, \nabla^4 u = F(x,y,t),
$$

where:

* \\(\rho\\) is the **material density**,
* \\(h\\) is the **plate thickness**,
* \\(D\\) is the **bending stiffness**,
* \\(\nabla^4 = \nabla^2(\nabla^2)\\) is the **biharmonic operator**, and
* \\(F(x,y,t)\\) is the external forcing from the sound wave.

This equation says that the plate’s acceleration and its elastic resistance to bending must balance the external driving force.

That forced term is the key musical ingredient. Without it, we would only be describing how the plate vibrates on its own after being disturbed. With it, we can model what happens when a speaker, violin, synthesizer, or any sustained tone continuously pumps energy into the plate.

---

### Why the Plate Has Preferred Patterns

Before understanding the forced problem, we first need to understand how the plate behaves when left to itself. So let us momentarily remove the forcing and look at

$$
\rho h \, u_{tt} + D \, \nabla^4 u = 0.
$$

In vibration problems, a natural class of solutions is one where every point oscillates sinusoidally in time while the spatial shape stays fixed. So we try

$$
u(x,y,t) = \phi(x,y)\cos(\omega t),
$$

where:

* \\(\phi(x,y)\\) is the spatial shape, and
* \\(\omega\\) is the angular frequency.

Substituting this into the PDE gives

$$
u_{tt} = -\omega^2 \phi(x,y)\cos(\omega t),
$$

and

$$
\nabla^4 u = \bigl(\nabla^4 \phi(x,y)\bigr)\cos(\omega t).
$$

Putting both into the equation,

$$
\rho h \bigl(-\omega^2 \phi\cos(\omega t)\bigr) + D\bigl(\nabla^4\phi\bigr)\cos(\omega t) = 0.
$$

Dividing out the common factor \\(\cos(\omega t)\\), we obtain

$$
D\,\nabla^4\phi = \rho h\,\omega^2\phi.
$$

Equivalently,

$$
\nabla^4 \phi = \lambda \phi,
\qquad
\lambda = \frac{\rho h}{D}\omega^2.
$$

This is an **eigenvalue problem**.

---

### What an Eigenvalue Problem Means Here

In linear algebra, an eigenvector \\(v\\) of a matrix \\(A\\) satisfies

$$
Av = \lambda v.
$$

Applying the matrix does not change the direction of the vector; it only rescales it.

The same idea appears here, except the “matrix” is now the differential operator \\(\nabla^4\\), and the “vector” is now a function \\(\phi(x,y)\\). We are looking for special shapes \\(\phi\\) such that applying \\(\nabla^4\\) preserves the shape and only rescales it.

These special shapes are the plate’s **normal modes**. Each one comes with its own frequency

$$
\omega_n = \sqrt{\frac{D}{\rho h}\lambda_n}.
$$

So the plate has a discrete collection of preferred vibration patterns

$$
\phi_1, \phi_2, \phi_3, \ldots
$$

and corresponding preferred frequencies

$$
\omega_1, \omega_2, \omega_3, \ldots.
$$

Those are the frequencies the plate “likes” to ring at.

---

### Back to Music: Forcing and Resonance

Now return to the forced equation

$$
\rho h \, u_{tt} + D \, \nabla^4 u = F(x,y,t).
$$

If the forcing is a pure sine wave,

$$
F(x,y,t) = G(x,y)\cos(\omega t),
$$

then the plate is being continuously driven at the single frequency \\(\omega\\).

Here is the central idea:

* if \\(\omega\\) is far from all natural frequencies, the response stays relatively small;
* if \\(\omega\\) is close to one natural frequency \\(\omega_n\\), that mode is strongly amplified;
* as a result, the motion of the plate becomes dominated by the spatial pattern \\(\phi_n(x,y)\\).

This amplification is called **resonance**.

That is why Chladni figures are so clean. The sound does not excite every possible shape equally. Near resonance, one mode dominates, and the plate effectively settles into one geometric pattern.

In reality, there is always some damping, so the amplitude does not grow forever. But it can still become much larger near resonance than away from it.

---

### Why One Mode Can Dominate

The cleanest way to express this is to expand the displacement in the plate’s normal modes:

$$
u(x,y,t) = \sum_n c_n(t)\phi_n(x,y).
$$

When we substitute this into the PDE, each coefficient \\(c_n(t)\\) behaves roughly like a driven oscillator:

$$
\ddot{c}_n + \omega_n^2 c_n = f_n(t),
$$

where \\(f_n(t)\\) is the part of the forcing aligned with mode \\(\phi_n\\).

So the plate is not one mysterious object. It is more like a whole collection of oscillators, one for each mode. A pure sine wave at frequency \\(\omega\\) selectively pumps energy into whichever oscillator has \\(\omega_n\\) closest to \\(\omega\\).

That is the mathematical reason a single musical tone can pick out a single visible pattern.

---

### Nodal Lines and Chladni Figures

Once one mode dominates, the displacement looks approximately like

$$
u(x,y,t) \approx \phi_n(x,y)\cos(\omega t).
$$

The **nodal lines** are the curves where

$$
\phi_n(x,y) = 0.
$$

These are the points that do not move, even while nearby regions oscillate strongly. Sand is shaken away from large-motion regions and collects along these stationary curves.

So the Chladni pattern is, quite literally, the zero set of an eigenfunction made visible.

And this is the beautiful bridge to music: a pure tone in air becomes a forcing term in a PDE; the PDE selects a resonant eigenmode; and the eigenmode writes its geometry onto the plate in sand.

That is why pitch is not only something we hear. Under the right conditions, it is also something we can see.
