---
layout: post
title: "The Burden of Memory"
date: 2026-03-22 10:00:00 +0800
tags: ml
lang: en
comments: true
---

> To think is to forget differences, generalize, make abstractions. In the teeming world of Funes there were only details, almost immediate in their presence.
>
> — Jorge Luis Borges, *Funes, His Memory* (1942)

<!--more-->

---

## 1. The Memory Wall

Consider a transformer with 7 billion parameters — a scale now considered as small in production systems. Stored in 32-bit floats, the weights alone occupy:

$$4\text{ bytes} \times 7 \times 10^9 = 28\text{ GB.}$$

To put this in context, the table below lists the GPU memory capacity of common training accelerators:

| GPU | Memory | Memory type | Typical use |
|:----:|:------:|:-----------:|:-----------:|
| RTX 3090 | 24 GB | GDDR6X | Academic / small-scale research |
| A100 (SXM) | 80 GB | HBM2e | Standard data-centre training |
| H100 (SXM) | 80 GB | HBM3 | Current-generation data centre |
| H200 (SXM) | 141 GB | HBM3e | High-memory training workloads |

The 28 GB weight footprint of a 7B model already exceeds the RTX 3090 outright. On an A100 or H100, weights consume 35 % of the available memory before any computation has begun. Even an H200, with 141 GB, cannot hold the full training state for a 7B model on a single device. That is the optimistic number. Training requires considerably more.

First, backpropagation produces one gradient per parameter — a tensor of identical shape to the weight tensor — adding another $4P$ bytes. Second, the Adam optimiser, which is the default for nearly all large-model training, maintains two additional tensors per parameter across all iterations: a running mean of past gradients and a running variance. These must be stored in 32-bit precision for numerical stability, contributing $8P$ bytes more. Third, the forward pass generates intermediate tensors — activations — that must be retained until the backward pass has consumed them; for attention layers, this cost grows quadratically with sequence length.

The parameter-proportional total under standard mixed-precision Adam is **16 bytes per parameter**, or 112 GB for a 7B model. No current single GPU can hold it. Distributing training across multiple GPUs under the naive data-parallel approach — where every GPU holds a full replica of the model — does not help: eight GPUs storing eight identical 112 GB copies waste 896 GB to hold what is, after each optimizer step, exactly the same information eight times over.

The rest of this post accounts for every component of the memory budget in detail, works through what the backward pass requires from each transformer sub-layer, and derives how the ZeRO family of algorithms eliminates the redundancy that data parallelism introduces.

---

## 2. Weights, Precision, and Gradients

### Floating-point formats

Modern accelerators operate most efficiently on 16-bit floats, but training introduces numerical hazards that make 32-bit necessary in certain places. The three formats in common use are:

| Format | Bits | Exponent bits | Mantissa bits | Max value | Approx. precision |
|:-------:|:-----:|:-------------:|:-------------:|:-------------------:|:-----------------:|
| fp32   | 32   | 8             | 23            | $\approx 3.4 \times 10^{38}$ | 7 decimal digits |
| fp16   | 16   | 5             | 10            | 65504     | 3–4 digits       |
| bf16   | 16   | 8             | 7             | $\approx 3.4 \times 10^{38}$ | 2–3 digits       |

The critical asymmetry between fp16 and bf16 is the exponent width. fp16's five exponent bits set its smallest positive normal value at roughly $6 \times 10^{-5}$. Gradient magnitudes during training routinely fall below this floor, causing them to **underflow to zero** — a silent, catastrophic corruption of the update signal. bf16 inherits fp32's eight-bit exponent and therefore its dynamic range, sidestepping underflow at the cost of fewer mantissa bits. For gradient computations, where range matters more than mantissa precision, bf16 is the safer 16-bit format.[^1]

### Mixed-precision training

The standard training recipe — introduced by Micikevicius et al.[^2] and now the default in virtually all large-model frameworks — keeps **two copies of every weight**:

- A **half-precision working copy** (fp16 or bf16, 2 bytes/param) used in the forward and backward passes, where throughput is the priority.
- A **full-precision master copy** (fp32, 4 bytes/param) used in the optimizer step, where accumulated rounding error over thousands of small updates would otherwise degrade the model.

After each optimizer step, the fp32 master is cast back to fp16 to refresh the working copy. This costs **6 bytes/param** for the weight tensors alone.

### Gradients

Backpropagation produces one gradient per parameter, with the same shape as the weight tensor. In mixed-precision training, gradients are accumulated in fp16 during the backward pass and cast to fp32 before the optimizer step, so they occupy **2–4 bytes/param** depending on where in the pipeline you are counting.

The combined cost of weights and gradients is **8–10 bytes/param**. That is already a substantial fraction of the total — but it is not the largest item.

---

## 3. The Adam Optimiser

Stochastic gradient descent with a fixed learning rate $\eta$ maintains no state beyond the current gradient:

$$w \leftarrow w - \eta\, g_t.$$

Its memory overhead is zero: the gradient $g_t$ is needed anyway for the update and is discarded immediately after.

Adam[^3] is different. It maintains two exponential moving averages that serve as adaptive estimates of the gradient's mean and variance across all past steps.

**First moment** — a running mean of the gradient:

$$m_t = \beta_1\, m_{t-1} + (1 - \beta_1)\, g_t.$$

**Second moment** — a running uncentered variance:

$$v_t = \beta_2\, v_{t-1} + (1 - \beta_2)\, g_t^2.$$

Because both $m_0$ and $v_0$ are initialised to zero, the early iterates are biased toward zero. The bias-corrected estimates are:

$$\hat m_t = \frac{m_t}{1 - \beta_1^t}, \qquad \hat v_t = \frac{v_t}{1 - \beta_2^t}.$$

The parameter update is then:

$$w \leftarrow w - \eta\, \frac{\hat m_t}{\sqrt{\hat v_t} + \epsilon}.$$

### The statistical reading

The ratio $\hat m_t / \sqrt{\hat v_t}$ is approximately the **signal-to-noise ratio** of the gradient for that parameter. The numerator $\hat m_t$ is the smoothed gradient — the signal. The denominator $\sqrt{\hat v_t}$ is the root-mean-square of past gradients, a proxy for the standard deviation of the gradient distribution. Parameters with a consistent, low-variance gradient signal receive a large effective step size; parameters whose gradients fluctuate wildly receive a small, cautious one. Adam is performing, dimension-by-dimension, a form of adaptive normalisation that is invariant to the overall scale of the loss.

### Memory cost

Both $m_t$ and $v_t$ must be stored in **fp32**. The reason is numerical: $\hat v_t$ for a near-converged parameter can be extremely small, and the per-step change $(1-\beta_2)(g_t^2 - v_{t-1})$ can be smaller still. In fp16, these tiny differences round to zero, corrupting the adaptive step sizes and stalling convergence. The optimiser states therefore cost **8 bytes/param** regardless of the model's own precision.

Together with the fp32 master weights, the mixed-precision Adam budget per parameter is:

| Component | Precision | Bytes |
|:----------:|:----------:|:------:|
| Working weights | fp16 | 2 |
| Master weights | fp32 | 4 |
| Gradients | fp16 | 2 |
| First moment $m_t$ | fp32 | 4 |
| Second moment $v_t$ | fp32 | 4 |
| **Total** | | **16** |

For a 7B model: $7 \times 10^9 \times 16 = 112\text{ GB}$. This is the parameter-proportional floor, before any data has been seen. It exceeds the capacity of an A100 or H100 (80 GB) outright, sits within 30 GB of an H200 (141 GB) before a single activation is counted, and is nearly five times the memory of an RTX 3090 (24 GB). On no single GPU commonly available today can a 7B model be trained without distributing the state across devices.


### Beyond Adam: the optimizer memory footprint in general

Adam's 8 bytes per parameter for optimizer state is not a fixed law — it is a consequence of maintaining two moment tensors. Different optimizers carry different footprints.

**Adan** (Adaptive Nesterov Momentum)[^8] maintains three moment tensors per parameter: a first moment of gradients $m_t$, a first moment of gradient *differences* $v_t = \beta_2(g_t - g_{t-1})$ (a Nesterov-inspired term), and a second moment $n_t$ of the combined signal. All three are stored in fp32, giving **12 bytes/param** for optimizer states and a total mixed-precision footprint of **20 bytes/param** — 25 % higher than Adam. Adan also requires caching the previous step's gradient $g_{t-1}$, adding another 2 bytes/param, for a total of 22 bytes/param.

**Lion** (EvoLved Sign Momentum)[^9] maintains only a single momentum tensor and applies its sign, giving **4 bytes/param** for optimizer states and a total of **12 bytes/param** — cheaper than Adam. The trade-off is a less adaptive step.

The general principle: the optimizer state cost is $4k$ bytes/param where $k$ is the number of fp32 tensors the optimizer maintains per parameter. ZeRO distributes these $k$ tensors across GPUs; its memory reduction factor is the same regardless of $k$.

---

## 4. Backpropagation and Activation Retention

The previous sections established the parameter-proportional cost: weights, their gradients, and optimizer states. The activation cost arises from a different source — the structure of the backward pass. This section reviews why.

### The computation graph

A transformer's forward pass evaluates the loss $\mathcal{L}$ by composing a sequence of differentiable operations. Let $a_0 = x$ be the input and define:

$$a_\ell = f_\ell(a_{\ell-1};\, \theta_\ell), \qquad \ell = 1, \ldots, N,$$

where $f_\ell$ is the $\ell$-th operation with parameters $\theta_\ell$ and output $a_\ell$. The loss is $\mathcal{L} = h(a_N)$ for some scalar-valued $h$.

### The chain rule

Define the upstream gradient $g_\ell = \partial \mathcal{L} / \partial a_\ell$. At the output, $g_N = \partial h / \partial a_N$. For any preceding layer the chain rule gives:

$$g_{\ell-1} = \left(\frac{\partial a_\ell}{\partial a_{\ell-1}}\right)^\!\top g_\ell, \qquad \frac{\partial \mathcal{L}}{\partial \theta_\ell} = \left(\frac{\partial a_\ell}{\partial \theta_\ell}\right)^\!\top g_\ell.$$

Both local Jacobians — $\partial a_\ell / \partial a_{\ell-1}$ and $\partial a_\ell / \partial \theta_\ell$ — are in general functions of $a_{\ell-1}$, the layer's input during the forward pass. The upstream gradient $g_\ell$ arrives from the layer above; the weights $\theta_\ell$ are already in memory. The **only additional quantity** the backward pass requires is $a_{\ell-1}$, produced during the forward pass and not yet discarded.


### Concrete backward formulas

The chain rule yields a small set of matrix calculus identities that appear repeatedly in transformer backpropagation. Throughout, $\frac{d\mathcal{L}}{dX}$ denotes the gradient matrix with the same shape as $X$.

**The transpose rule.** For any bilinear operation $Y = AXB$:

$$\frac{d\mathcal{L}}{dX} = A^\top \frac{d\mathcal{L}}{dY} B^\top.$$

The upstream gradient is sandwiched between the transposes of the non-differentiated factors. All linear-layer identities below are special cases with one factor set to the identity.

**Linear layer** $Y = XW^\top$ (input $X \in \mathbb{R}^{B \times d_{\mathrm{in}}}$, weight $W \in \mathbb{R}^{d_{\mathrm{out}} \times d_{\mathrm{in}}}$):

$$\frac{d\mathcal{L}}{dX} = \frac{d\mathcal{L}}{dY}\, W, \qquad \frac{d\mathcal{L}}{dW} = \left(\frac{d\mathcal{L}}{dY}\right)^\!\top X.$$

The input $X$ appears in $d\mathcal{L}/dW$, confirming that it must be retained for the backward pass.

**Elementwise nonlinearity** $Y = \sigma(X)$:

$$\frac{d\mathcal{L}}{dX} = \frac{d\mathcal{L}}{dY} \odot \sigma'(X).$$

Requires $X$ (or equivalently $\sigma'(X)$, which is a function of $X$).

**Scaled dot-product** $S = QK^\top / \sqrt{d_h}$:

$$\frac{d\mathcal{L}}{dQ} = \frac{d\mathcal{L}}{dS} \frac{K}{\sqrt{d_h}}, \qquad \frac{d\mathcal{L}}{dK} = \left(\frac{d\mathcal{L}}{dS}\right)^\!\top \frac{Q}{\sqrt{d_h}}.$$

Requires both $Q$ and $K$.

**Weighted sum** $O = PV$:

$$\frac{d\mathcal{L}}{dP} = \frac{d\mathcal{L}}{dO} V^\top, \qquad \frac{d\mathcal{L}}{dV} = P^\top \frac{d\mathcal{L}}{dO}.$$

Requires $P$ (for $d\mathcal{L}/dV$) and $V$ (for $d\mathcal{L}/dP$).

**Row-wise softmax** $P = \operatorname{softmax}(S)$. Define the per-row scalar $D_i = \sum_k P_{ik}\, (d\mathcal{L}/dP_{ik})$. Then:

$$\frac{d\mathcal{L}}{dS_{ij}} = P_{ij}\left(\frac{d\mathcal{L}}{dP_{ij}} - D_i\right).$$

Requires $P$ (the softmax output), not $S$. This is the identity that forces the $L^2$ memory cost in standard attention.

### The retention contract

The backward pass processes layers in reverse order: layer $N$ first, layer $1$ last. Consequently:

- The input to layer $1$ is produced first during the forward pass but consumed last during the backward pass — it must survive the entire forward sweep.
- The input to layer $N$ is produced last and consumed first — it is freed almost immediately.

In general, $a_{\ell-1}$ must remain alive from forward step $\ell$ until the backward pass completes layers $N, N-1, \ldots, \ell$. At peak, all $N$ inputs are simultaneously in memory, with total cost proportional to the sum of their sizes.

### What the Jacobian requires: a cost taxonomy

Different operations produce Jacobians with different information requirements.

**Elementwise operations.** For $a_\ell = \sigma(a_{\ell-1})$ applied coordinatewise, the Jacobian is diagonal: $\partial a_\ell / \partial a_{\ell-1} = \operatorname{diag}(\sigma'(a_{\ell-1}))$. For ReLU, $\sigma'(x) = \mathbf{1}[x > 0] = \mathbf{1}[a_\ell > 0]$, so only a single bit per element is needed — the full input can be reconstructed or discarded. For GELU, $\sigma'(x) = \Phi(x) + x\phi(x)$ depends on $x$ itself, so the input must be stored.

**Linear layers.** For $a_\ell = a_{\ell-1} W^\top$, the Jacobian with respect to $W$ is $a_{\ell-1}$ (the input, must be stored) and the Jacobian with respect to $a_{\ell-1}$ is $W$ (already in memory as a weight). Storing the input, and nothing else, is sufficient.

**Softmax.** For row-wise $P = \operatorname{softmax}(S)$, the Jacobian $\partial P_{ij} / \partial S_{ik} = P_{ij}(\delta_{jk} - P_{ik})$ is a function of the **output** $P$, not the input $S$. The backward pass therefore requires $P$ to be available — not $S$. As will be seen in Section 5c, this produces an unavoidable $BHL^2$ activation cost.

This taxonomy — elementwise ops need little, linear layers need their input, softmax needs its output — governs every entry in the layer-by-layer accounting that follows.

---

## 5. Activations: A Layer-by-Layer Account

The backward pass computes gradients via the chain rule, differentiating through every operation performed during the forward pass in reverse order. To differentiate through an operation, you generally need the operation's **inputs** (or some function of them) available at backward time. Those inputs were produced during the forward pass and must therefore be kept in memory from the moment they are created until the corresponding backward step executes — which, for early layers, means surviving the entire forward pass through all subsequent layers.

This section traces exactly what each transformer component retains, and why.

Throughout, $B$ denotes batch size, $L$ sequence length, $d$ the model's hidden dimension, $H$ the number of attention heads, $d_h = d/H$ the per-head dimension, and $d_\text{ff}$ the feed-forward width (typically $4d$). All tensor sizes are quoted in elements; multiply by 2 for fp16/bf16.

---

### 5a. Layer Normalisation

**Forward pass.** For an input $x \in \mathbb{R}^{B \times L \times d}$, layer normalisation[^4] computes per-token statistics and then applies a learned affine transformation:

$$\mu = \frac{1}{d}\sum_{i=1}^d x_i, \qquad \sigma^2 = \frac{1}{d}\sum_{i=1}^d (x_i - \mu)^2,$$

$$\hat{x} = \frac{x - \mu}{\sqrt{\sigma^2 + \varepsilon}}, \qquad y = \gamma \odot \hat{x} + \beta,$$

where $\gamma, \beta \in \mathbb{R}^d$ are learned scale and shift parameters.

**Backward pass.** The gradients of the learnable parameters are:

$$\frac{\partial L}{\partial \gamma} = \sum_{b,\ell} \frac{\partial L}{\partial y_{b,\ell}} \odot \hat{x}_{b,\ell}, \qquad \frac{\partial L}{\partial \beta} = \sum_{b,\ell} \frac{\partial L}{\partial y_{b,\ell}}.$$

Computing $\partial L / \partial x$ involves a more elaborate expression that depends on $\mu$, $\sigma^2$, $\hat{x}$, and $\gamma$. In practice, frameworks store the raw input $x$ (from which $\mu$ and $\sigma^2$ can be recomputed cheaply), or cache $\hat{x}$ directly.

**Stored for backward:** the input $x$, shape $[B, L, d]$ — approximately $BLd$ elements.

---

### 5b. Linear Projections

A linear layer $y = xW^\top + b$ with $x \in \mathbb{R}^{B \times L \times d_\text{in}}$ and $W \in \mathbb{R}^{d_\text{out} \times d_\text{in}}$ has backward pass:

$$\frac{\partial L}{\partial W} = \left(\frac{\partial L}{\partial y}\right)^\top x, \qquad \frac{\partial L}{\partial x} = \frac{\partial L}{\partial y}\, W.$$

The upstream gradient $\partial L / \partial y$ arrives from the layer above; $W$ is already resident in memory as a model weight. The **only activation** that must be stored is the **input** $x$.

**Stored for backward:** input $x$, shape $[B, L, d_\text{in}]$.

This pattern — store only the input, nothing else — is the baseline. Every component that deviates from it incurs additional activation memory.

---

### 5c. Multi-Head Attention

Multi-head attention[^5] is the component where the activation cost departs most severely from the linear baseline. The deviation is quadratic in sequence length.

#### Forward pass

Let $X \in \mathbb{R}^{B \times L \times d}$ be the input to the attention block.

**Step 1 — Project and split into heads.**

$$Q = XW_Q^\top \in \mathbb{R}^{B \times L \times d}, \quad K = XW_K^\top \in \mathbb{R}^{B \times L \times d}, \quad V = XW_V^\top \in \mathbb{R}^{B \times L \times d},$$

then reshape each to $\mathbb{R}^{B \times H \times L \times d_h}$.

**Step 2 — Scaled dot-product scores.**

$$S = \frac{QK^\top}{\sqrt{d_h}} \in \mathbb{R}^{B \times H \times L \times L}.$$

**Step 3 — Softmax.**

$$P = \text{softmax}(S) \in \mathbb{R}^{B \times H \times L \times L},$$

applied row-wise over the last dimension (the key axis).

**Step 4 — Weighted sum.**

$$O = PV \in \mathbb{R}^{B \times H \times L \times d_h}.$$

**Step 5 — Output projection.**

Reshape $O$ to $\mathbb{R}^{B \times L \times d}$ and apply $W_O$.

#### Backward pass

Let $dO$ denote $\partial L / \partial O$, available from the layer above.

**Step B1 — Differentiate through** $O = PV$.

$$dV = P^\top \, dO \in \mathbb{R}^{B \times H \times L \times d_h},$$

$$dP = dO \, V^\top \in \mathbb{R}^{B \times H \times L \times L}.$$

Both require $P$ and $V$ to be available.

**Step B2 — Differentiate through the row-wise softmax** $P = \text{softmax}(S)$.

For a single row $s \in \mathbb{R}^L$ with $p = \text{softmax}(s)$ and upstream gradient $dp$, the Jacobian $\partial p_j / \partial s_i = p_j(\delta_{ij} - p_i)$ gives:

$$ds_i = \sum_j \frac{\partial p_j}{\partial s_i}\, dp_j = p_i \, dp_i - p_i \sum_j p_j\, dp_j = p_i\!\left(dp_i - p^\top dp\right).$$

Defining the per-row scalar $D_i = \sum_j P_{ij}\, dP_{ij} = (P \odot dP)\mathbf{1}$ (where the sum is over the key axis), the gradient of the full score matrix is:

$$\boxed{dS_{ij} = P_{ij}\!\left(dP_{ij} - D_i\right).}$$

This step requires $P$ — the softmax output — to be available. There is no way to compute $dS$ without it.

**Step B3 — Differentiate through** $S = QK^\top / \sqrt{d_h}$.

$$dQ = \frac{dS \cdot K}{\sqrt{d_h}} \in \mathbb{R}^{B \times H \times L \times d_h}, \qquad dK = \frac{dS^\top \cdot Q}{\sqrt{d_h}} \in \mathbb{R}^{B \times H \times L \times d_h}.$$

Both require $Q$ and $K$ to be available.

Finally, gradients of the projection weights require the attention block's input $X$:

$$\frac{\partial L}{\partial W_Q} = (\text{appropriate reshape of}\; dQ)^\top X, \quad \text{and similarly for}\; W_K, W_V, W_O.$$

#### What must be stored

| Tensor | Shape | Elements |
|:-------:|:------:|:--------:|
| Input $X$ | $[B, L, d]$ | $BLd$ |
| Queries $Q$ | $[B, H, L, d_h]$ | $BLd$ |
| Keys $K$ | $[B, H, L, d_h]$ | $BLd$ |
| Values $V$ | $[B, H, L, d_h]$ | $BLd$ |
| Attention probabilities $P$ | $[B, H, L, L]$ | $BHL^2$ |
| Output $O$ (before projection) | $[B, H, L, d_h]$ | $BLd$ |

The first five entries are $5BLd$ elements — linear in $L$, comparable to the other components. The sixth entry, $P$, is $BHL^2$ — **quadratic in sequence length**.

#### The $L^2$ problem

For a 7B-class model with $B=4$, $H=32$, $L=2048$ and fp16 (2 bytes per element):

$$BHL^2 \times 2\text{ bytes} = 4 \times 32 \times 2048^2 \times 2 \approx 1.07\text{ GB per layer.}$$

Across 32 layers this is approximately **34 GB** — comparable to the entire non-attention activation cost. At $L = 8192$:

$$4 \times 32 \times 8192^2 \times 2 \approx 17.2\text{ GB per layer,} \quad \times 32\text{ layers} \approx 550\text{ GB.}$$

Extending context to longer sequences under standard attention is, at this scale, simply infeasible. The $L^2$ dependence of $P$ is the root cause. Eliminating it requires restructuring the attention computation itself — refraining from materialising the full $L \times L$ matrix and instead computing attention in tiles small enough to fit in fast on-chip memory, deriving what the backward pass needs (essentially a per-row log-sum-exp scalar, rather than the full matrix) from the tiled computation. That restructuring is the subject of a later post.

---

### 5d. Feed-Forward Network

A standard transformer feed-forward block applies two linear layers with a nonlinearity between them:

$$x_1 = X W_1^\top + b_1 \in \mathbb{R}^{B \times L \times d_\text{ff}},$$

$$x_2 = \text{GELU}(x_1) \in \mathbb{R}^{B \times L \times d_\text{ff}},$$

$$\text{out} = x_2 W_2^\top + b_2 \in \mathbb{R}^{B \times L \times d}.$$

**Backward pass.** Working in reverse:

$$\frac{\partial L}{\partial W_2} = \left(\frac{\partial L}{\partial \text{out}}\right)^\top x_2 \quad\Rightarrow\quad \text{need } x_2.$$

$$\frac{\partial L}{\partial x_2} = \frac{\partial L}{\partial \text{out}}\, W_2.$$

$$\frac{\partial L}{\partial x_1} = \frac{\partial L}{\partial x_2} \odot \text{GELU}'(x_1) \quad\Rightarrow\quad \text{need } x_1.$$

The derivative of $\text{GELU}(t) = t\,\Phi(t)$, where $\Phi$ is the standard Gaussian CDF, is:

$$\text{GELU}'(t) = \Phi(t) + t\,\phi(t),$$

where $\phi$ is the standard Gaussian density. This requires the pre-activation value $x_1$ to be stored.

$$\frac{\partial L}{\partial W_1} = \left(\frac{\partial L}{\partial x_1}\right)^\top X \quad\Rightarrow\quad \text{need } X \text{ (the block's input).}$$

**Stored for backward:** the input $X$ ($BLd$ elements), the pre-GELU activation $x_1$ ($BLd_\text{ff}$), and the post-GELU activation $x_2$ ($BLd_\text{ff}$).

With $d_\text{ff} = 4d$, the two intermediate tensors together contribute $8BLd$ elements — the largest single activation cost in the entire transformer layer.

---

### 5e. Per-Layer Activation Budget

Collecting the contributions from every sub-component of one transformer layer:

| Sub-component | Tensors stored | Elements |
|:--------------:|:---------------:|:-------:|
| Pre-attention LayerNorm | input | $BLd$ |
| Attention input $X$ | shared with LN output | $—$ |
| $Q, K, V$ | three projections | $3BLd$ |
| Attention probabilities $P$ | **quadratic** | $BHL^2$ |
| Attention output $O$ | before output proj | $BLd$ |
| Output projection input | $O$ reshaped | $—$ |
| Pre-FFN LayerNorm | input | $BLd$ |
| FFN input | shared with LN output | $—$ |
| FFN pre-activation $x_1$ | | $4BLd$ |
| FFN post-activation $x_2$ | | $4BLd$ |
| **Total (linear terms)** | | $\approx 14\,BLd$ |
| **Total** | | $14\,BLd + BHL^2$ |

The $14BLd$ estimate merges several bookkeeping choices (some tensors are shared between a LayerNorm output and the next sub-layer's input); the exact count varies by implementation. The $BHL^2$ term, however, is implementation-invariant: every standard attention implementation must materialise $P$ somewhere.

### Activation checkpointing and selective recomputation

Storing all activations for all $N_\text{layers}$ layers simultaneously costs $O(N_\text{layers})$ times the per-layer budget. **Gradient checkpointing** (also called rematerialisation)[^6] trades computation for memory: store only a sparse set of checkpoint tensors at layer boundaries, discard everything in between, and recompute the discarded activations from the nearest checkpoint when they are needed during the backward pass.

**Mechanics.** During the forward pass, each transformer block computes its output normally but frees all intermediate tensors except the block's input tensor, which is saved as the checkpoint. During the backward pass, when the backward computation reaches that block, the full forward pass is re-executed from the checkpoint to regenerate the discarded activations before the gradient step runs. Only one block's worth of intermediate activations is live in memory at any point.

**Optimal checkpoint interval.** With $N_\text{layers}$ layers and checkpoints every $k$ layers:

- Memory: $N_\text{layers}/k$ checkpoint tensors held simultaneously, plus at most $k$ layers of intermediate activations being recomputed at any point $\Rightarrow O(N_\text{layers}/k + k)$.
- Optimised by $k = \sqrt{N_\text{layers}}$, yielding $O(\sqrt{N_\text{layers}})$ memory.
- Compute overhead: each layer is forward-passed twice — once during the forward sweep (discarded), once again during the backward sweep — giving approximately $\tfrac{1}{3}$ extra compute relative to no checkpointing.

**Selective recomputation: prioritising by memory-to-compute ratio.** Not all activations are equally costly to store, and not all are equally cheap to recompute. The natural criterion for deciding what to checkpoint versus what to recompute is the ratio:

$$\rho = \frac{\text{memory saved (bytes)}}{\text{FLOPs to recompute}}.$$

A high $\rho$ means recomputation is cheap relative to the storage it frees. The table below evaluates this trade-off for each major activation in a transformer layer (fp16 storage, suppressing constants):

| Activation | Bytes stored | FLOPs to recompute | Verdict |
|:-----------:|:------------:|:------------------:|:--------:|
| LayerNorm $\mu$, $\sigma^2$ | $2BL$ | $O(BLd)$ — single pass over $d$ | Always recompute; negligible cost |
| FFN post-activation $x_2$ | $4BLd_\text{ff}$ | $O(BLd_\text{ff})$ — elementwise GELU on $x_1$ | Recompute trivially once $x_1$ is available |
| FFN pre-activation $x_1$ | $4BLd_\text{ff}$ | $O(BL \cdot d \cdot d_\text{ff})$ — one matmul $W_1$ | Worth recomputing if memory-constrained |
| Attention $Q$, $K$, $V$ | $3BLd$ | $O(BL \cdot d^2)$ — three matmuls | Moderate; typically kept unless extremely tight |
| Attention probabilities $P$ | $2BHL^2$ | $O(BHL^2 d_h)$ — $QK^\top$ matmul + softmax | **Highest priority to recompute** at long $L$ |

The attention probability matrix $P$ dominates. Its storage cost is $BHL^2$ — quadratic in sequence length — while the recomputation requires one matrix multiplication ($Q$ against $K^\top$, costing $O(BHL^2 d_h)$ FLOPs) plus a row-wise softmax. At $L = 2048$, $H = 32$, $d_h = 128$: storing $P$ costs approximately 1 GB per layer (fp16), while recomputing it costs roughly $4 \times 32 \times 2048^2 \times 128 \approx 70$ GFLOP per layer. Whether this is worthwhile depends on whether memory or compute is the binding constraint; at long contexts, it almost always is.

**Common strategies in practice.** Three checkpointing granularities are widely used:

1. **Block-level checkpointing.** Save only the input to each transformer block; recompute the entire block (attention + FFN) during the backward pass. Reduces per-layer activation memory to a single $BLd$ checkpoint tensor at the cost of one full extra forward pass. This is the most common default.

2. **Sub-block checkpointing.** Save the input to each attention sub-layer and each FFN sub-layer separately. Halves the recomputation cost at the price of two $BLd$ checkpoint tensors per layer instead of one.

3. **Selective tensor retention.** Keep $Q$, $K$, $V$, $x_1$, $x_2$ — the non-quadratic activations — and discard only $P$. The attention backward regenerates $P$ from the stored $Q$ and $K$ on demand. This eliminates the $BHL^2$ term while avoiding the most expensive weight-contraction recomputations.

Strategy 3 is effectively what memory-efficient attention implementations adopt intrinsically: rather than materialising $P$ in HBM at all, they compute attention in tiles that fit in fast on-chip SRAM, accumulating $O$ directly without ever staging the full $L \times L$ matrix. The backward pass regenerates each tile of $P$ from $Q$ and $K$ in the same tiled fashion, storing only a single scalar per query position — the log-sum-exp of each row's scores — to ensure numerical stability. This eliminates the $BHL^2$ activation term entirely.

---

## 6. The Full Memory Budget

Assembling all the components for a 7B-class model ($d = 4096$, $H = 32$, 32 layers) trained with mixed-precision Adam on sequences of length $L = 2048$ with batch size $B = 4$:

**Parameter-proportional cost** (independent of data):

$$16 \times 7 \times 10^9\text{ bytes} \approx 112\text{ GB.}$$

**Activation cost per layer** (fp16, 2 bytes/element):

- Linear terms: $14 \times 4 \times 2048 \times 4096 \times 2 \approx 940\text{ MB}$
- Attention matrix $P$: $4 \times 32 \times 2048^2 \times 2 \approx 1072\text{ MB}$
- Total per layer: ≈ 2 GB

**Activation cost across all 32 layers:** ≈ 64 GB.

**Grand total on a single GPU:** ≈ **176 GB**, well above the 80 GB ceiling.

The scaling with sequence length is the sharpest constraint. Doubling $L$ to 4096 quadruples the $BHL^2$ term per layer, adding roughly 128 GB of activation memory. At $L = 8192$, the activation cost alone exceeds 550 GB.
### Additional GPU memory consumers

The 176 GB figure above counts model state and activations only. Several further categories claim GPU memory in every training run, and are routinely the source of the "out of memory" errors that appear even when the theoretical budget suggests headroom.

**CUDA runtime context.** Each GPU process initialises a CUDA driver context that loads device firmware, kernel binaries, and library code (cuBLAS, cuDNN, cuFFT). This overhead is fixed regardless of model size and typically amounts to 200 MB–1 GB per GPU. It appears in `nvidia-smi` even before any tensor has been allocated.

**PyTorch caching allocator fragmentation.** PyTorch does not return freed tensor memory directly to the GPU driver. Instead, it maintains a memory cache: freed blocks remain reserved and are reused for subsequent allocations of matching size. The difference between `torch.cuda.memory_reserved()` and `torch.cuda.memory_allocated()` represents this pool of reserved-but-idle memory. In long training runs with varied tensor shapes, this gap routinely reaches 2–5 GB. Calling `torch.cuda.empty_cache()` releases the pool back to the driver, but has no effect on currently-allocated tensors.

**NCCL communication buffers.** NCCL (NVIDIA Collective Communications Library) stages send and receive data in device-memory buffers before transferring them over NVLink or InfiniBand. Each active communication channel requires a staging buffer of roughly 64 MB by default (tunable via the `NCCL_BUFFSIZE` environment variable). On a node with 8 GPUs, this accumulates to roughly 500 MB–1 GB of device memory claimed by the communication library rather than by any model tensor.

**cuBLAS and cuDNN workspace.** Large matrix multiplications query cuBLAS for the fastest available kernel. Many high-performance GEMM algorithms require a scratch workspace — a temporary device buffer that can reach several gigabytes — allocated for the duration of the kernel. PyTorch allocates this from its cache, so it is included in `memory_reserved`, but it competes with activation tensors for the peak-memory budget.

**Gradient accumulation buffers.** When training with gradient accumulation over $K$ micro-batches, the gradient tensor must persist across all $K$ forward-backward passes before the optimizer step. Under DDP or ZeRO-1, this means a $2P$-byte fp16 buffer is live throughout all $K$ steps. Under ZeRO-2/3, only the $2P/N$-byte shard persists, which is the principal memory benefit of gradient sharding under accumulation.

As a practical rule of thumb, budget an additional **2–4 GB** per GPU for runtime overhead above the model-state and activation totals. On systems with many GPUs per node and long-context training, the overhead is at the higher end of that range.


---

## 7. Data Parallelism and Its Limits

The standard multi-GPU training strategy is **data parallelism**: every GPU holds a complete replica of the model and processes a different mini-batch independently. After the backward pass on each GPU, the gradients are averaged across all GPUs via an **all-reduce** collective, and each GPU performs an identical optimizer step on its local copy.

An all-reduce on a ring of $N$ GPUs has a communication volume of:

$$\frac{2(N-1)}{N} \times \Psi \approx 2\Psi \quad \text{for large } N,$$

where $\Psi$ is the size of the tensor being reduced — in this case, the gradient buffer of $2P$ bytes (fp16). The cost is $\approx 4P$ bytes transferred per GPU per step.

PyTorch's **Distributed Data Parallel** (DDP) implements this scheme with gradient bucketing and overlapping of communication with backward computation. DDP scales compute efficiently: $N$ GPUs process $N$ times as many samples per second as one.

What DDP does not do is reduce **memory**: each of the $N$ GPUs holds an identical 112 GB copy of the parameter-proportional memory. After every optimizer step, all $N$ copies of $m_t$, $v_t$, and the fp32 master weights are byte-for-byte identical. With $N = 8$ GPUs, 896 GB of aggregate VRAM stores the same values eight times over. This redundancy is pure waste — and it is exactly what ZeRO removes.

---

## 8. Communication Primitives

Distributed training moves tensors between devices using a small set of standardised **collective operations**. Before analysing ZeRO, it is worth being precise about what these operations do and what they cost. This section builds the necessary vocabulary from first principles; readers who have not previously encountered distributed systems may find the setup unfamiliar, so we state our assumptions explicitly.

### System model and assumptions

Throughout this section, $N$ denotes the number of GPUs participating in training and $\Psi$ the size of the tensor being communicated, measured in bytes.

**A1 — Distributed memory.** Each device possesses its own private memory. No device can directly read or write another device's tensor; every byte that crosses a device boundary must be explicitly transmitted over a network link. This is in contrast to shared-memory multiprocessor systems, where all processors access a common address space. GPUs in separate machines — and even GPUs in the same machine connected only via PCIe — satisfy A1.

**A2 — Message-passing.** The only inter-device communication primitive is an explicit send/receive of a contiguous buffer between two devices. All higher-level collective operations (broadcast, all-reduce, and so on) are composed from sequences of such point-to-point messages.

**A3 — Synchronous collectives.** A collective operation is a *global synchronisation barrier*: every device in the communicator group must call the operation before any device may proceed past it. Formally, let $t_k^{\text{call}}$ be the time at which device $k$ calls the collective. No device $k$ may resume computation until every other device $j$ has completed its send and receive obligations, i.e. until $\max_j t_j^{\text{done}} \leq t_k^{\text{resume}}$ for all $k$. A slow device stalls the entire group. This assumption simplifies the analysis considerably; asynchronous variants exist but are beyond the scope of this post.

**A4 — Linear cost model.** Transmitting $\Psi$ bytes over a link with peak unidirectional bandwidth $B$ (bytes per second) and per-message latency $\alpha$ (seconds) takes time

$$T(\Psi) = \alpha + \frac{\Psi}{B}.$$

For the large buffers typical in model training — a 7B gradient buffer is $\Psi \approx 14$ GB — the latency term satisfies $\alpha \ll \Psi/B$ and is negligible. We therefore report **communication volume** (bytes per device) rather than wall time. Volume is hardware-independent and provides a clean basis for comparing ZeRO stages; wall time follows by dividing by the available bandwidth $B$ of the interconnect in use.

### The four collectives

**Broadcast.** One device (the root) sends a tensor of size $\Psi$ to all $N - 1$ others. After the operation, all devices hold identical copies.

**All-reduce.** Every device holds a tensor of size $\Psi$. The operation computes an elementwise reduction (typically sum) across all devices and delivers the result to every device. Used in DDP to average gradients.

**Reduce-scatter.** Every device holds a tensor of size $\Psi$, conceptually partitioned into $N$ chunks of size $\Psi/N$. The operation sums chunk $i$ across all devices and delivers it to device $i$. After the operation, device $i$ holds only the $i$-th chunk of the global sum — the full result is distributed, not replicated.

**All-gather.** Every device holds a tensor of size $\Psi/N$ (its local shard). The operation concatenates all shards into a tensor of size $\Psi$ and delivers the full tensor to every device. The inverse of reduce-scatter.

The identity that ties them together:

$$\text{all-reduce} = \text{reduce-scatter} \;+\; \text{all-gather.}$$

An all-reduce on a tensor of size $\Psi$ is implemented as a reduce-scatter (producing $\Psi/N$ bytes per device) followed by an all-gather (returning $\Psi$ bytes to every device). This decomposition is the foundation of ZeRO.

### Ring all-reduce: communication volume is independent of $N$

A naïve all-reduce would designate one device as an aggregator, collect all tensors there, sum them, and broadcast the result. Each of the $N - 1$ non-aggregator devices would send $\Psi$ bytes and receive $\Psi$ bytes, giving a total per-device volume of $O(N\Psi)$ — the aggregator alone handles $O(N\Psi)$ bytes, becoming a bottleneck. The **ring all-reduce** algorithm eliminates this bottleneck by distributing the work evenly.

**Ring topology assumption.** We assume the $N$ devices are arranged in a directed logical ring: device $k$ sends to device $(k+1) \bmod N$ and receives from device $(k-1) \bmod N$. Each device may transmit and receive simultaneously on its respective links (full-duplex). No device is special; every device performs exactly the same sequence of operations. Under A2 and A4, we count the bytes each device must transmit.

The algorithm proceeds in two phases.

**Phase 1 — Reduce-scatter.** Partition the $\Psi$-byte tensor into $N$ contiguous chunks of size $\Psi/N$. In each of $N-1$ steps, every device sends one chunk to its right neighbour and accumulates the chunk received from its left neighbour. After $N-1$ steps, device $k$ holds the fully reduced (summed) version of chunk $k$. Bytes sent per device: $(N-1) \times \Psi/N$.

**Phase 2 — All-gather.** Each device now holds one fully reduced chunk and needs all $N$ chunks. In each of $N-1$ steps, every device forwards the chunk it currently holds to its right neighbour. After $N-1$ steps every device holds the complete reduced tensor. Bytes sent per device: $(N-1) \times \Psi/N$.

Total communication volume per device:

$$V_{\text{all-reduce}} = 2 \cdot \frac{N-1}{N} \cdot \Psi \xrightarrow{N \to \infty} 2\Psi.$$

This is the key result: **the bandwidth cost of an all-reduce is approximately $2\Psi$ per device, regardless of the number of devices**. Adding more GPUs to a ring does not increase the per-device volume (for large $N$). By the same argument, a reduce-scatter or all-gather alone costs approximately $\Psi$ per device.

*Remark on topology.* The constant $2$ in $2\Psi$ is specific to the ring. Tree-based all-reduces achieve the same asymptotic volume but with better latency scaling — $O(\log N \cdot \alpha)$ versus the ring's $O(N \cdot \alpha)$ — because the tree halves the number of active devices at each level. For the large buffers in model training, the bandwidth term $\Psi/B$ dominates and the ring is preferred; for small messages (e.g., synchronising scalar statistics across many nodes), latency dominates and a tree or recursive-halving topology is preferable.

### Hardware interconnects and their impact

The achievable bandwidth $B$ depends critically on the physical link between devices:

| Interconnect | Typical bandwidth | Scope |
|:-------------:|:-----------------:|:------:|
| NVLink 4 | 900 GB/s (bidirectional) | Within a single node |
| PCIe 5.0 × 16 | 64 GB/s (bidirectional) | Within a node, no NVLink |
| InfiniBand NDR | 400 Gb/s ≈ 50 GB/s | Between nodes |
| Ethernet (100 GbE) | ≈ 12 GB/s | Between nodes, commodity |

Within a node equipped with NVLink, an all-reduce of a 7B-model gradient buffer ($\Psi \approx 14$ GB in fp16) takes roughly $2 \times 14 / 900 \approx 31$ ms — well within the time budget of a typical backward pass. Across nodes on InfiniBand NDR, the same operation takes $2 \times 14 / 50 \approx 560$ ms, a significant fraction of training time at large batch sizes.

This bandwidth gap is the reason practitioners choose different ZeRO stages for intra-node and inter-node parallelism. ZeRO-3's additional per-layer all-gathers (approximately $3\Psi$ total per step) are affordable on NVLink but can dominate on slower interconnects.

---

## 9. ZeRO: Eliminating Redundancy Stage by Stage

The **Zero Redundancy Optimizer** (ZeRO)[^7] partitions the parameter-proportional memory across the $N$ GPUs, so that each GPU holds only $1/N$ of each component. The algorithm proceeds in three stages of increasing aggressiveness.

Let $P$ denote the number of model parameters and write the mixed-precision Adam cost as:

$$\underbrace{2P}_{\text{fp16 weights}} + \underbrace{2P}_{\text{fp16 grads}} + \underbrace{4P}_{\text{fp32 master}} + \underbrace{4P}_{m_t} + \underbrace{4P}_{v_t} = 16P \text{ bytes.}$$

For convenience write the optimizer-state cost as $12P$ bytes (fp32 master weights + two moment tensors).

### Stage 1 — Shard optimizer states

Each GPU owns a contiguous $1/N$ slice of $m_t$, $v_t$, and the fp32 master weights. The fp16 working weights and gradients remain fully replicated on every GPU — needed for the forward and backward passes exactly as in DDP.

After the all-reduce on gradients, each GPU runs the optimizer step **only for its responsible slice**, updating its own $1/N$ fragment of $m_t$, $v_t$, and the fp32 master. A subsequent **all-gather** then redistributes the updated fp16 working weights so every GPU has the full model ready for the next iteration.

Memory per GPU: $2P + 2P + 12P/N = 4P + 12P/N$.

### Stage 2 — Also shard gradients

Instead of all-reducing the full gradient buffer (which would replicate the complete gradient on every GPU), ZeRO-2 performs a **reduce-scatter**: the gradient contributions from all GPUs are summed globally, and each GPU retains only the $1/N$ shard that corresponds to the optimizer-state partition it is responsible for.

Since each GPU's gradient shard aligns exactly with its optimizer-state shard, the optimizer step proceeds without any additional communication. The all-gather of updated fp16 weights follows as before.

Memory per GPU: $2P + 2P/N + 12P/N = 2P + 14P/N$.

### Stage 3 — Also shard parameters

ZeRO-3 shards the fp16 working weights as well. Each GPU permanently holds only $1/N$ of the fp16 parameters. Before each layer's **forward** pass, an all-gather reconstructs the layer's full weight tensor on all GPUs. After the forward computation, the non-local shards are freed. The same all-gather is repeated before each layer's **backward** pass. After computing local gradients, a reduce-scatter returns each GPU to its own gradient shard.

Memory per GPU: $2P/N + 2P/N + 12P/N = 16P/N$.

This is a true $1/N$ reduction in the parameter-proportional memory cost. The 112 GB budget for a 7B model becomes **14 GB across 8 GPUs** — well within the capacity of any device in the table above, including a consumer RTX 3090.

### Memory comparison

| Strategy | fp16 params | fp16 grads | Optimizer states | **Total per GPU** |
|:---------:|:-----------:|:-----------:|:----------------:|:-----------------:|
| DDP | $2P$ | $2P$ | $12P$ | $16P$ |
| ZeRO-1 | $2P$ | $2P$ | $12P/N$ | $4P + 12P/N$ |
| ZeRO-2 | $2P$ | $2P/N$ | $12P/N$ | $2P + 14P/N$ |
| ZeRO-3 | $2P/N$ | $2P/N$ | $12P/N$ | $16P/N$ |

For 8 GPUs and a 7B model:

| Strategy | Memory per GPU |
|:---------:|:--------------:|
| DDP | 112 GB |
| ZeRO-1 | 21.5 GB |
| ZeRO-2 | 15.75 GB |
| ZeRO-3 | 14 GB |

ZeRO-1 alone eliminates the dominant optimizer-state cost with minimal engineering complexity. ZeRO-3 achieves the maximum reduction but requires restructuring both the forward and backward passes.

### Memory layout across GPUs: a visual summary

The diagrams below show how $P$ parameters' worth of state is distributed across four GPUs under each strategy. Each labelled block is owned and maintained by the indicated GPU; empty space denotes state that lives on a different GPU. `W` = fp16 working weights, `G` = fp16 gradients, `OS` = optimizer states (fp32 master weights + $m_t$ + $v_t$).

```
DDP  (16P per GPU — all state fully replicated)

  GPU 0  [   W   ][   G   ][             OS             ]
  GPU 1  [   W   ][   G   ][             OS             ]
  GPU 2  [   W   ][   G   ][             OS             ]
  GPU 3  [   W   ][   G   ][             OS             ]
          <- 2P -> <- 2P -> <----------- 12P ----------->

ZeRO-1  (4P + 12P/N per GPU — shard optimizer states)

  GPU 0  [   W   ][   G   ][ OS.0 ]
  GPU 1  [   W   ][   G   ]        [ OS.1 ]
  GPU 2  [   W   ][   G   ]                [ OS.2 ]
  GPU 3  [   W   ][   G   ]                        [ OS.3 ]
          <- 2P -> <- 2P -> <--- 12P/N each ------->

ZeRO-2  (2P + 14P/N per GPU — also shard gradients)

  GPU 0  [   W   ][ G.0 ][ OS.0 ]
  GPU 1  [   W   ]        [ G.1 ][ OS.1 ]
  GPU 2  [   W   ]                [ G.2 ][ OS.2 ]
  GPU 3  [   W   ]                        [ G.3 ][ OS.3 ]
          <- 2P -> <2P/N> <--- 12P/N each ------->

ZeRO-3  (16P/N per GPU — shard all three components)

  GPU 0  [ W.0 ][ G.0 ][ OS.0 ]
  GPU 1          [ W.1 ][ G.1 ][ OS.1 ]
  GPU 2                  [ W.2 ][ G.2 ][ OS.2 ]
  GPU 3                          [ W.3 ][ G.3 ][ OS.3 ]
          <2P/N> <2P/N> <--- 12P/N each ------->
```

The diagonal pattern in ZeRO-3 reflects that each GPU is authoritative for a distinct parameter slice. Before each transformer layer's forward pass, an all-gather reconstructs `W` for that layer on all GPUs; after the backward pass, a reduce-scatter returns each GPU to its own gradient shard. Those transient all-gathers are the sole communication overhead that ZeRO-3 adds relative to ZeRO-2.


### ZeRO compatibility: which optimizers qualify?

ZeRO distributes optimizer state by assigning each GPU a disjoint slice of the parameter index space and having it maintain only the optimizer tensors for that slice. This works if and only if the optimizer's update for parameter $i$ depends only on parameter $i$'s own gradient and state — never on other parameters' gradients. This is the **per-parameter independence** condition.

**Adan** satisfies it. The updates for $m_t$, $v_t$, $n_t$ at index $i$ are functions only of $g_t[i]$ and $g_{t-1}[i]$. ZeRO can shard all three moment tensors alongside the parameters with no additional communication cost. The per-GPU memory becomes $22P/N$ bytes under ZeRO-3 (instead of $16P/N$ for Adam), but the sharding mechanism is identical.

**Muon** does not satisfy it for ZeRO stages 2 and 3.[^10] Muon's core step orthogonalises the gradient matrix $G \in \mathbb{R}^{m \times n}$ via Newton-Schulz iterations:

$$X_0 = G / \|G\|_F, \qquad X_{k+1} = \tfrac{3}{2}X_k - \tfrac{1}{2}X_k X_k^\top X_k.$$

Each iteration computes $X_k X_k^\top \in \mathbb{R}^{m \times m}$, which requires the full rows of $X_k$. Under ZeRO-2 or ZeRO-3, $G$ is row-sharded across GPUs: each GPU holds $m/N$ rows. Computing $X_k X_k^\top$ then requires an all-gather to reconstruct $X_k$ — entirely defeating the gradient-sharding memory saving. ZeRO-1 (which shards only optimizer states, leaving gradients fully replicated) is compatible with Muon, since the full gradient matrix is available on every GPU for the Newton-Schulz step.

**Shampoo** and **K-FAC** do not support ZeRO-2 or ZeRO-3 without modification.[^11] Both maintain per-layer Kronecker-factor matrices — for a weight $W \in \mathbb{R}^{m \times n}$, Shampoo stores $L_t \in \mathbb{R}^{m \times m}$ and $R_t \in \mathbb{R}^{n \times n}$, updated as $L_t \leftarrow L_{t-1} + G_t G_t^\top$ and $R_t \leftarrow R_{t-1} + G_t^\top G_t$. Computing $G_t G_t^\top$ requires the complete gradient matrix, so ZeRO-2/3 gradient sharding again forces an all-gather. Moreover, the Kronecker factors have dimension $m$ and $n$, not the number of parameters; they cannot be naively partitioned along the parameter axis that ZeRO uses.

The pattern is clear: optimizers whose state and update are **elementwise** across parameters (Adam, Adan, Lion, AdaGrad, RMSprop) are ZeRO-compatible at all stages. Optimizers that treat a weight matrix as a matrix — applying global spectral operations or accumulating outer-product statistics — require the full gradient matrix and are therefore incompatible with ZeRO-2/3 gradient sharding without extra communication.


---

## 10. Communication Cost

A legitimate concern: if ZeRO introduces extra all-gathers and reduce-scatters, does it increase the total communication bandwidth consumed per training step?

Recall that DDP all-reduces the gradient buffer:

$$\text{DDP communication} = 2\Psi \approx 2 \times 2P\text{ bytes} = 4P\text{ bytes per GPU.}$$

(The factor of 2 in the ring all-reduce formula accounts for the reduce-scatter and all-gather phases that an all-reduce implicitly performs.)

**ZeRO-1 and ZeRO-2** replace the all-reduce with a reduce-scatter on gradients ($\Psi$ bytes) followed by an all-gather of updated fp16 weights ($\Psi$ bytes):

$$\text{ZeRO-1/2 communication} = \Psi + \Psi = 2\Psi = 4P\text{ bytes per GPU.}$$

Identical to DDP. The memory savings in ZeRO-1 and ZeRO-2 are genuinely **free** in terms of communication.

**ZeRO-3** additionally performs a per-layer all-gather of fp16 weights before each forward and backward pass:

- Forward all-gathers: $\Psi$ bytes total across all layers.
- Backward all-gathers: $\Psi$ bytes total.
- Reduce-scatter of gradients: $\Psi$ bytes.

$$\text{ZeRO-3 communication} \approx 3\Psi = 6P\text{ bytes per GPU,}$$

approximately **1.5× the DDP cost**. Whether this overhead is acceptable depends on the ratio of interconnect bandwidth to compute throughput. On a single node with NVLink (600 GB/s bidirectional), the per-layer all-gathers overlap almost entirely with compute. Across nodes connected by InfiniBand (typically 200–400 Gb/s), the communication can become the bottleneck, and ZeRO-3 may reduce throughput even as it reduces memory. Practitioners typically apply ZeRO-1 or ZeRO-2 within a node and reserve ZeRO-3 for models that genuinely cannot be partitioned otherwise.

---

## 11. Where This Leaves Us

The memory budget of a training run has three distinct components, each governed by different physics.

The **parameter-proportional** cost — 16 bytes per parameter for mixed-precision Adam — is fixed by the choice of optimiser and independent of input data. ZeRO distributes this cost across GPUs with no loss of statistical efficiency and, for Stages 1 and 2, no extra communication.

The **activation** cost scales linearly with $BLd$ per layer across all non-attention components, and quadratically with $L$ through the attention probability matrix $P$. Activation checkpointing reduces the linear terms to $O(\sqrt{N_\text{layers}})$ memory at the cost of extra compute, but leaves the $L^2$ term intact. Eliminating the $L^2$ term is fundamentally an algorithmic question about how attention is computed, not a question about how memory is distributed.

The **communication** cost of ZeRO is equivalent to DDP for Stages 1 and 2, and 1.5× DDP for Stage 3.

Together, ZeRO and activation checkpointing make it possible to train models whose parameter count and context length would otherwise require impractical amounts of hardware. The parameter-proportional ceiling is lifted by distributing the redundant optimizer state; the quadratic activation ceiling requires a different approach.

---

## References

[^1]: Kalamkar, D., et al. (2019). A Study of BFLOAT16 for Deep Learning Training. *arXiv:1905.12322*. Documents the numerical advantages of bf16's extended dynamic range for gradient accumulation relative to fp16.

[^2]: Micikevicius, P., et al. (2018). Mixed Precision Training. *International Conference on Learning Representations (ICLR)*. Introduces the loss-scaling technique that stabilises fp16 gradient computation and the fp32 master-weight recipe that is now standard.

[^3]: Kingma, D. P., & Ba, J. (2015). Adam: A Method for Stochastic Optimization. *International Conference on Learning Representations (ICLR)*. The original paper derives the bias-correction terms and establishes the adaptive-learning-rate interpretation.

[^4]: Ba, J. L., Kiros, J. R., & Hinton, G. E. (2016). Layer Normalization. *arXiv:1607.06450*. Introduces the per-token normalisation used in transformers, in contrast to the per-channel batch normalisation of earlier networks.

[^5]: Vaswani, A., et al. (2017). Attention Is All You Need. *Advances in Neural Information Processing Systems (NeurIPS)*. The original transformer paper establishing the scaled dot-product attention mechanism analysed in Section 5c.

[^6]: Chen, T., et al. (2016). Training Deep Nets with Sublinear Memory Cost. *arXiv:1604.06174*. Derives the $\sqrt{N}$ optimal checkpointing interval and analyses the compute–memory trade-off of rematerialisation.

[^7]: Rajbhandari, S., Rasley, J., Ruwase, O., & He, Y. (2020). ZeRO: Memory Optimizations Toward Training Trillion Parameter Models. *Proceedings of SC'20 (International Conference for High Performance Computing, Networking, Storage, and Analysis)*. Introduces all three ZeRO stages and provides the communication-volume analysis reproduced in Section 10.

[^8]: Xie, X., Zhou, P., Li, H., Lin, Z., & Yan, S. (2024). Adan: Adaptive Nesterov Momentum Algorithm for Faster Optimizing Deep Models. *IEEE Transactions on Pattern Analysis and Machine Intelligence*. Introduces the three-moment update and analyses its convergence properties.

[^9]: Chen, X., Liang, C., Huang, D., Real, E., Wang, K., Liu, Y., ... & Le, Q. V. (2024). Symbolic Discovery of Optimization Algorithms. *Advances in Neural Information Processing Systems (NeurIPS)*. Derives Lion via program search; the sign-based update requires only a single momentum tensor.

[^10]: Kosson, A., Wortsman, M., Modoranu, I., & Jaggi, M. (2024). Muon: Momentum + Orthogonalization for the Update of Neural networks. Introduces the Newton-Schulz orthogonalization step and analyses its per-layer memory and compute requirements.

[^11]: Vyas, N., Morwani, D., Zhao, R., Shapira, I., Brandfonbrener, D., Janson, L., & Kakade, S. (2024). SOAP: Improving and Stabilizing Shampoo using Adam. *arXiv:2409.11321*. Shampoo introduced in: Gupta, V., Koren, T., & Singer, Y. (2018). Shampoo: Preconditioned Stochastic Tensor Optimization. *International Conference on Machine Learning (ICML)*.
