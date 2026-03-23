---
layout: post
title: "爵士乐的万能公式：ii-V-I 和弦进行及其变体"
date: 2026-03-23 10:00:00 +0800
tags: music
lang: zh
comments: true
---

> 音乐、幸福的状态、神话、被时间磨损的面孔、某些黄昏和某些地方，试图向我们诉说一些什么，或者曾经说过一些我们不该错过的话，或者即将说出什么；这种启示从未到来的临近感，也许就是审美现象的本质。
>
> — 豪尔赫·路易斯·博尔赫斯，《另一次审判》（1952）

<!--more-->

{: class="table-of-content"}
* TOC
{:toc}

---

<div class="tech-note">
<strong>关于本文的乐谱与音频</strong>

<p>文中所有乐谱使用 <a href="https://abcnotation.com/" target="_blank">ABC 记谱法</a>（ABC notation）编写，由 <a href="https://abcjs.net/" target="_blank">abcjs</a> 库在浏览器中即时渲染为标准五线谱 SVG。每个谱例下方都有一个播放器，点击 <strong>▶</strong> 即可通过浏览器内置的 Web Audio API 合成钢琴音色播放——无需插件，无需下载任何音频文件。</p>

<p><strong>什么是 ABC 记谱法？</strong><br>
ABC 是一种用纯文本描述乐谱的格式。一段完整的 ABC 由<em>头部字段</em>和<em>音符行</em>两部分组成：</p>

<pre class="tech-code">X:1          % 曲目编号（必填，值任意）
M:4/4        % 拍号
L:1/4        % 基准音符时值（1/4 = 四分音符）
Q:1/4=72     % 速度：每分钟 72 拍
K:C          % 调号（C大调；K:Am = A小调，K:F = F大调）

"D-7"[DFAc]2 "G7"[GBdf]2 | "C△"[CEGB]4 |]</pre>

<p><strong>音符写法：</strong></p>
<ul>
  <li>大写字母 <code>C D E F G A B</code> → C4–B4（中央 C 所在八度）</li>
  <li>小写字母 <code>c d e f g a b</code> → C5–B5（高八度）</li>
  <li>逗号后缀 <code>C,</code> → 降低一个八度（C3）；撇号后缀 <code>c'</code> → 升高一个八度（C6）</li>
  <li>前缀 <code>_</code> = 降号（<code>_B</code> = B♭），前缀 <code>^</code> = 升号（<code>^F</code> = F♯）</li>
</ul>

<p><strong>时值：</strong>数字是基准时值的倍数。<code>L:1/4</code> 时，<code>2</code> = 二分音符，<code>4</code> = 全音符，<code>1</code> = 四分音符，<code>/2</code> = 八分音符。</p>

<p><strong>和弦（同时发音）：</strong>用方括号包住多个音符，如 <code>[DFAc]</code> = D、F、A、C 同时发音。</p>

<p><strong>和弦符号标注：</strong>在音符前加带引号的字符串，如 <code>"D-7"[DFAc]2</code>，会在谱面对应位置上方显示和弦名称。</p>

<p><strong>小节线：</strong><code>|</code> = 普通小节线，<code>|]</code> = 结尾双小节线。</p>

<p>要在本博客添加新谱例，复制任意一个 <code>&lt;div class="abc-example"&gt;</code> 块，修改 <code>&lt;pre class="abc-source"&gt;</code> 内的 ABC 文本即可；页面底部的脚本会自动渲染并挂载播放器。</p>
</div>

---

## 1. 万能公式

如果说爵士乐有一个不可动摇的和声核心，那大概就是 **ii-V-I** 进行了。几乎每一首爵士标准曲都建立在它之上，或者至少在某个角落藏着它。"Autumn Leaves"里每隔两小节出现一次，"All The Things You Are"把它串成一条五度圈的项链，"Moment's Notice"的开头就是一连串高速的 ii-V-I……

以 C 大调为例，ii-V-I 就是：

$$\text{D-7} \longrightarrow \text{G7} \longrightarrow \text{C}\Delta$$

Mark Levine 在《爵士钢琴书》（*The Jazz Piano Book*）里开门见山：这三个和弦都来自 C 大调的各个调式，是爵士和声中**演奏频率最高的三个和弦**。它们的性格由**三音**和**七音**决定：

| 和弦 | 类型 | 三音 | 七音 | 对应调式 |
|:----:|:----:|:----:|:----:|:--------:|
| D-7 (ii) | 小七和弦 | 小三度 (F) | 小七度 (C) | D Dorian |
| G7 (V) | 属七和弦 | 大三度 (B) | 小七度 (F) | G Mixolydian |
| C△ (I) | 大七和弦 | 大三度 (E) | 大七度 (B) | C Ionian |

五音（完全五度）在这三个和弦里都存在，唯一例外的是小调 ii 级的半减七和弦——这个后面会说。正因为五音千篇一律，Levine 告诉学生：**三音和七音是真正重要的两个音**。

根音依次 D → G → C，全是**五度圈下行**（或四度上行）。这是西方功能和声中方向感最强的运动，也是爵士乐数百首标准曲共用同一套和声语汇的原因。

<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=72
K:C
"D-7"[DFAc]2 "G7"[GBdf]2 | "C△"[CEGB]4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

---

## 2. 三音与七音：声部导向的秘密

Levine 把三音和七音叫做决定和弦"质量"（quality）的音。在 ii-V-I 里，这两个声部的运动几乎是精密机械一样：

| 和弦 | 三音 | 七音 |
|:----:|:----:|:----:|
| D-7 | F | C |
| G7 | B | F |
| C△ | E | B |

每次和弦交替，就有一个声部**半音下行**：
- D-7 的**七音 C** → G7 的**三音 B**：半音下行 ✓
- G7 的**七音 F** → C△的**三音 E**：半音下行 ✓
- 另一个声部保持不动（F→F，B→B）

Levine 强调：**七音永远往下走半步**（*The seventh always comes down a half step*）。这是三音组合弦（three-note voicings）最核心的技术要点。

### 三音组合弦：A 位与 B 位

三音组合弦（three-note voicings）是爵士钢琴最实用的基础：
- **左手**：弹根音
- **右手**：弹三音和七音

右手的两音有两种摆放方式，Levine 称为 **A 位**和 **B 位**：

| 位置 | 小手指（底音） | 顶音 |
|:----:|:-------------:|:----:|
| A 位 | 三音 | 七音 |
| B 位 | 七音 | 三音 |

以 C 大调 ii-V-I 为例，A 位是这样的（右手，下面是三音）：

<!--
  HOW TO ADD A NEW MUSIC EXAMPLE
  ================================
  Copy the entire <div class="abc-example">...</div> block below and edit the
  ABC notation inside the <pre class="abc-source"> element.

  The page-level <script> at the bottom automatically:
    1. Reads the ABC text from the hidden <pre>
    2. Renders it as an SVG score into <div class="abc-score">
    3. Wires a Play/Stop/Restart audio player into <div class="abc-player">
       (uses the browser's Web Audio API — no audio files needed)

  ── ABC NOTATION QUICK REFERENCE ──────────────────────────────────────
  Header lines (must come first, one per line):
    X:1        Tune index — required, value doesn't matter
    M:4/4      Time signature (3/4, 6/8, etc. also work)
    L:1/4      Base note length: 1/4 = quarter note, 1/8 = eighth note
    Q:1/4=72   Tempo: 72 quarter-note beats per minute
    K:C        Key signature (K:Am = A minor, K:F = F major, etc.)

  Notes:
    Uppercase C D E F G A B  →  C4–B4 (the octave starting at middle C)
    Lowercase c d e f g a b  →  C5–B5 (one octave higher)
    Suffix ,   (comma)       →  lower by one octave  (C, = C3)
    Suffix '   (apostrophe)  →  raise by one octave  (c' = C6)
    Prefix _   (underscore)  →  flat    (_B = B♭,  _e = E♭5)
    Prefix ^   (caret)       →  sharp   (^F = F♯,  ^G = G♯)

  Durations (multiples of the base length L:1/4):
    [note]1  = quarter note   [note]2  = half note   [note]4  = whole note

  Block chords (several notes played together):
    [Fc]  plays F4 and C5 simultaneously
    [G_ABf] plays G4, A♭4, B4, F5

  Chord-symbol labels (shown above the staff):
    "D-7"[DFAc]2   renders the label "D-7" above the chord

  Bar lines:
    |    regular bar line
    |]   final (double) bar line

  Common accidentals reset at the next bar line.
  ──────────────────────────────────────────────────────────────────────
-->
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=72
K:C
"D-7"[Fc]2 "G7"[FB]2 | "C△"[EB]4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

注意声部走向：F 保持不动（从 D-7 的三音变成 G7 的七音），顶音 C 下行半步到 B（D-7 七音 → G7 三音）；然后 B 保持，F 下行半步到 E（G7 七音 → C△ 三音）。两个声部交替半音下行，右手几乎不离位——这就是 Levine 所说的"七音永远往下走半步"的完美示范。

B 位把两音对调（七音在下，三音在上）：

<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=72
K:C
"D-7"[cf]2 "G7"[Bf]2 | "C△"[Be]4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

Levine 建议在五度圈里的全部 12 个调上练习这两种位置，直到成为肌肉记忆。

以下是**五度圈顺序**的全部 12 个调。每例**前两小节** A 位（三音在下），**后两小节** B 位（七音在下）；低音谱号左手弹各和弦根音。

<p><strong>C 大调（D-7 → G7 → C△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"D-7"[Fc]2 "G7"[FB]2 | "C△"[EB]4 || "D-7"[cf]2 "G7"[Bf]2 | "C△"[Be]4 |]
V:2 clef=bass
D,2 G,2 | C,4 || D,2 G,2 | C,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

<p><strong>F 大调（G-7 → C7 → F△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"G-7"[_Bf]2 "C7"[_Be]2 | "F△"[Ae]4 || "G-7"[F_B]2 "C7"[E_B]2 | "F△"[EA]4 |]
V:2 clef=bass
G,2 C,2 | F,4 || G,2 C,2 | F,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

<p><strong>B♭ 大调（C-7 → F7 → B♭△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"C-7"[_E_B]2 "F7"[_EA]2 | "Bb△"[DA]4 || "C-7"[_B_e]2 "F7"[A_e]2 | "Bb△"[Ad]4 |]
V:2 clef=bass
C,2 F,2 | _B,4 || C,2 F,2 | _B,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

<p><strong>E♭ 大调（F-7 → B♭7 → E♭△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"F-7"[_A_e]2 "Bb7"[_Ad]2 | "Eb△"[Gd]4 || "F-7"[_E_A]2 "Bb7"[D_A]2 | "Eb△"[DG]4 |]
V:2 clef=bass
F,2 _B,2 | _E,4 || F,2 _B,2 | _E,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

<p><strong>A♭ 大调（B♭-7 → E♭7 → A♭△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"Bb-7"[_D_A]2 "Eb7"[_DG]2 | "Ab△"[CG]4 || "Bb-7"[_A_d]2 "Eb7"[G_d]2 | "Ab△"[Gc]4 |]
V:2 clef=bass
_B,2 _E,2 | _A,4 || _B,2 _E,2 | _A,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

<p><strong>D♭ 大调（E♭-7 → A♭7 → D♭△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"Eb-7"[_G_d]2 "Ab7"[_Gc]2 | "Db△"[Fc]4 || "Eb-7"[_D_G]2 "Ab7"[C_G]2 | "Db△"[CF]4 |]
V:2 clef=bass
_E,2 _A,2 | _D,4 || _E,2 _A,2 | _D,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

<p><strong>G♭ 大调（A♭-7 → D♭7 → G♭△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"Ab-7"[B_g]2 "Db7"[Bf]2 | "Gb△"[_Bf]4 || "Ab-7"[_GB]2 "Db7"[FB]2 | "Gb△"[F_B]4 |]
V:2 clef=bass
_A,2 _D,2 | _G,4 || _A,2 _D,2 | _G,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

<p><strong>B 大调（C#-7 → F#7 → B△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"C#-7"[EB]2 "F#7"[E^A]2 | "B△"[^D^A]4 || "C#-7"[Be]2 "F#7"[^Ae]2 | "B△"[^A^d]4 |]
V:2 clef=bass
^C,2 ^F,2 | B,4 || ^C,2 ^F,2 | B,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

<p><strong>E 大调（F#-7 → B7 → E△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"F#-7"[Ae]2 "B7"[A^d]2 | "E△"[^G^d]4 || "F#-7"[EA]2 "B7"[^DA]2 | "E△"[^D^G]4 |]
V:2 clef=bass
^F,2 B,2 | E,4 || ^F,2 B,2 | E,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

<p><strong>A 大调（B-7 → E7 → A△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"B-7"[DA]2 "E7"[D^G]2 | "A△"[^C^G]4 || "B-7"[Ad]2 "E7"[^Gd]2 | "A△"[^G^c]4 |]
V:2 clef=bass
B,2 E,2 | A,4 || B,2 E,2 | A,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

<p><strong>D 大调（E-7 → A7 → D△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"E-7"[Gd]2 "A7"[G^c]2 | "D△"[^F^c]4 || "E-7"[DG]2 "A7"[^CG]2 | "D△"[^C^F]4 |]
V:2 clef=bass
E,2 A,2 | D,4 || E,2 A,2 | D,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

<p><strong>G 大调（A-7 → D7 → G△）</strong></p>
<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=66
K:C
V:1 clef=treble
"A-7"[CG]2 "D7"[C^F]2 | "G△"[B,^F]4 || "A-7"[Gc]2 "D7"[^Fc]2 | "G△"[^FB]4 |]
V:2 clef=bass
A,2 D,2 | G,4 || A,2 D,2 | G,4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

---

## 3. 加入延伸音

基础三音组合弦只有三个音（根音 + 三音 + 七音）。加入**延伸音**（tensions/extensions）可以大幅丰富色彩。Levine 在第五章里给出了每类和弦可以加入的延伸音：

| 和弦类型 | 可加入的延伸音 |
|:--------:|:--------------:|
| 小七（ii 级） | 五音、九音（9）、十一音（11）、六音 |
| 属七（V 级） | 五音、九音（9）、♭九音（b9）、♯九音（+9）、♯十一音（+11）、十三音（13）、♭十三音（b13） |
| 大七（I 级） | ♯四音（+4）、五音、♯五音（+5）、六音（6）、九音（9） |

有一个技术要点 Levine 特别强调：**对于未经变化的 ii-V-I**（即属七和弦没有 b9/+9 等标注时），加法规则是：
- ii 级加**五音**
- V 级加**九音**（或 b9）
- I 级加**五音和九音**

而且 **ii 级的五音和 V 级的九音是同一个音**（D-7 的 A = G7 的 A），这让从 ii 到 V 的过渡异常流畅。

下面是一个带延伸音的 ii-V-I：ii 级加了九音（E），V 级加了九音（A）和七音（F），I 级加了九音（D）：

<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=72
K:C
"D-9"[DFAce]2 "G9"[GBdfa]2 | "C△9"[CEGBd]4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

注意一个 Levine 特别强调的技巧：**D-7 的五音（A）和 G7 的九音（A）是同一个音**——这使 ii-9 到 V-9 的过渡在声部上毫无摩擦。

---

## 4. 小调 ii-V-i

大调 ii-V-I 有一个小调版本，结构上有两处关键不同：

$$\text{Bø} \longrightarrow \text{E7alt} \longrightarrow \text{C-}\Delta$$

（以 A 小调为例，实际进行是 Bø – E7alt – Am）

- **ii 级**变成**半减七和弦**（half-diminished，记作 ø 或 m7b5）：Bm7b5 = B-D-F-A，其中 F 是减五度，这是和声中半减和弦特有的"漂浮感"的来源；
- **V 级**几乎总是带有变化音，最常见是 **E7alt**（E7 变化，含 b9、+9 等），其中 G♯ 是 A 和声小调的导音（leading tone）；
- **i 级**是小七和弦（Am7）或小大七和弦（AmΔ），爵士中小七和弦更常见。

Levine 在第八章用 Wayne Shorter 的 "I Thought About You" 的改编版做示范，其中大量出现 Bø – E7alt 进行，每次解决方式都略有不同。

<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=72
K:Am
"Bø"[B,DFA]2 "E7alt"[E^GBdf]2 | "Am7"[A,CEG]4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

（E7alt 这里简化显示为 E-G♯-B-D-F，即带有导音 G♯ 和 ♭9 音 F 的形态。）

小调 ii-V-i 和大调 ii-V-I 功能相似，但情绪截然不同。ø 和弦里那个减五度（tritone）赋予它一种内敛的、甚至是不安的色彩，比大调版本更具张力，解决到 Am7 时的释放感也更强烈。

---

## 5. Sus 和弦：ii 和 V 合二为一

Levine 在第四章里介绍了 **sus 和弦**，它和 ii-V-I 关系密切：一个 Gsus 和弦等同于 **D-7/G**，即 D 小七和弦以 G 为低音。

$$\text{Gsus} = \text{D-7/G}$$

这意味着 sus 和弦把 ii 和 V 压缩进了同一个和弦——同时保留了两者的功能，又避免了属七和弦那种强烈的解决冲动。Herbie Hancock 的 "Maiden Voyage" 就几乎全由 sus 和弦构成，营造出一种漂浮、开阔的感觉。

<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=72
K:C
"Gsus (=D-7/G)"[Gcdf]2 "G7"[GBdf]2 | "C△"[CEGB]4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

注意 Gsus 到 G7 的变化：只有 C（四音）下行半步到 B（三音），其余不动。这也是 sus 和弦常常作为 V7 的前置或替代的原因。

---

## 6. 变化属七：G7alt

属七和弦是 ii-V-I 张力的核心，而**变化属七**（altered dominant）是张力的顶点。Levine 在第八章里说得很清楚：

> "Alt" is short for "altered." **Altered means much more than just the +9 and the b13: it implies a scale with four alterations, the b9, +9, +11, and b13** of a dominant chord.

也就是说，G7alt 的变化音是：

$$\text{G7alt} = \text{G} \text{-} \text{B} \text{-} \text{F（七音）} \text{ 加上 } \flat9\text{（A}\flat\text{）} \cdot {+}9\text{（B}\flat\text{）} \cdot {+}11\text{（D}\flat\text{）} \cdot \flat13\text{（E}\flat\text{）}$$

在实际演奏中，不可能把所有变化音都加进去——通常取其中几个。最常见的 G7alt 左手组合弦包含 b9 和 b13：

<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=72
K:C
"D-7"[DFAc]2 "G7b9"[G_ABf]2 | "C△"[CEGB]4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

（G7b9 这里显示为 G-A♭-B-F：根音、♭9 音 A♭、大三度 B、小七度 F。A♭ 和 B 相差只有半音，听起来非常刺耳，但正是这种紧张感推动着到 C△ 的解决。完整的 G7alt 在此基础上还可以再加入 ♯9（B♭）和 ♭13（E♭）。）

### G7alt 的一个绝妙技巧

Levine 在第八章揭示了一个让初学者大吃一惊的事实：

> **G7alt 的左手组合弦和 D♭7 的左手组合弦，音符完全相同（异名同音）。**

这是因为 G7alt 包含的四个变化音（A♭/B♭/D♭/E♭）恰好就是 D♭7 的基本音：D♭-F-A♭-C♭（=B）。图 8-6 里，Levine 直接并排写出 G7alt 和 D♭7 来说明这一点。

实际应用：当你要弹 G7alt 时，只需**用弹 D♭7 的指法**——这把两个概念统一了，也为下一节的三全音替代埋下伏笔。

---

## 7. 三全音替代（Tritone Substitution）

Levine 第六章以 Jerome Kern 的 "All The Things You Are" 开篇：先弹原版的 ii-V-I，再弹一个加入了三全音替代的版本，让读者直接用耳朵感受差异。

### 为什么两个属七和弦可以互换？

属七和弦（dominant seventh）的独特性在于：它的**三音和七音构成三全音**（tritone，即增四度/减五度）。G7 的三音 B 和七音 F 之间正好是三全音（B-F）。

而三全音具有对称性：B-F 翻转过来还是 F-B（或 C♭-F）。D♭7 的三音是 F，七音是 C♭（=B）——和 G7 完全相同！

$$G7 \text{ 的三音和七音 } \{B, F\} = D\flat7 \text{ 的七音和三音 } \{C\flat, F\}$$

因此 **G7 和 D♭7 可以相互替代**。把原来的 D-7 – G7 – C△ 换成：

$$\text{D-7} \longrightarrow \text{D}{\flat}\text{7} \longrightarrow \text{C}\Delta$$

<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=72
K:C
"D-7"[DFAc]2 "D♭7"[_DF_A_c]2 | "C△"[CEGB]4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

低音线从 **D → D♭ → C**，变成了优美的**半音下行**！Levine 说：*"Substituting Db7 for G7 makes the bass line chromatic. Bass players love tritone substitution for this reason."*（用 D♭7 替换 G7，低音线就变成半音级进，贝斯手们超爱这个。）

同时注意：因为 G7alt 和 D♭7 音符相同（见上一节），三全音替代和变化属七在声音上也是高度重叠的。它们实际上是同一件事的两种表述方式。

---

## 8. 后门进行（Backdoor Progression）

标准 ii-V-I 沿五度圈下行到 I 级，但还有一条"后门"路线，借用 **C 的平行小调**（C 自然小调）的和弦：

$$\text{F-7} \longrightarrow \text{B}{\flat}\text{7} \longrightarrow \text{C}\Delta$$

记作 **iv – ♭VII7 – I**，其中 F-7 = C 小调的 iv 级，B♭7 = C 小调的 ♭VII 级属七和弦。

<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=72
K:C
"F-7"[F_Ac_e]2 "B♭7"[DF_A_B]2 | "C△"[CEGB]4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

与正门五度下行不同，后门的低音线是 **F → B♭ → C**，上行四度再上行大二度。它的解决感没有正门那么"不可避免"，多了一种迂回的、从侧面悄然归来的暧昧色彩。Tadd Dameron 的 "Lady Bird"（书中 Levine 称之为 "Lazybird"）是这个进行最著名的应用案例之一。

---

## 9. 链式 ii-V：次属和弦

ii-V-I 可以向前延伸：在主 ii-V 之前，再插入一个**针对 ii 级**的 ii-V，形成：

$$\text{A-7} \longrightarrow \text{D7} \longrightarrow \text{D-7} \longrightarrow \text{G7} \longrightarrow \text{C}\Delta$$

A-7 – D7 是针对 D-7 的 ii-V。D7 是 D 小调的属和弦，作为 C 大调里的**次属和弦**（secondary dominant）出现，带来一个 F♯（D7 的大三度），给进行增添了一点超出调性的色彩，然后在下一小节回落到干净的 D-7。

<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=72
K:C
"A-7"[A,CEG]2 "D7"[D^FAc]2 | "D-7"[DFAc]2 "G7"[GBdf]2 | "C△"[CEGB]4 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

John Coltrane 的 "Moment's Notice"（Levine 专门列入推荐曲目）是链式 ii-V 的经典案例——每隔两小节就换一次调中心，而每次换调都通过一个快速的 ii-V 衔接。在 120 BPM 的速度下演奏，要求演奏者对每个调性里的 ii-V 都有肌肉级别的熟悉程度。

---

## 10. Turnaround（回转进行）

**Turnaround** 通常出现在一首曲子的末尾两小节，把音乐"转回"到开头。最基础的形式是 **I – VI – ii – V**：

$$\text{C}\Delta \longrightarrow \text{A7} \longrightarrow \text{D-7} \longrightarrow \text{G7}$$

<div class="abc-example">
<pre class="abc-source" style="display:none">X:1
M:4/4
L:1/4
Q:1/4=72
K:C
"C△"[CEGB]2 "A7"[A,^CEG]2 | "D-7"[DFAc]2 "G7"[GBdf]2 |]
</pre>
<div class="abc-score"></div>
<div class="abc-player"></div>
</div>

（A7 = A-C♯-E-G，属七和弦，作为 D-7 的次属和弦。）

Turnaround 本质上是一个带有前置次属和弦的扩展 ii-V-I。爵士乐手喜欢对它进行变奏：

| 变体 | 和弦序列 | 说明 |
|:----:|:--------:|:----:|
| 基础 | C△ – A7 – D-7 – G7 | 标准形式 |
| 三全音替代 V | C△ – A7 – D-7 – D♭7 | G7 被三全音代理 |
| 三全音替代 VI+V | C△ – E♭7 – D-7 – D♭7 | 半音下行低音线 |
| 纯小调起头 | C△ – A-7 – D-7 – G7 | VI 级改为小七 |

---

## 11. 在爵士标准曲中的应用

### "Just Friends"（Klenner & Lewis）

Levine 在第三章用 "Just Friends" 作为三音组合弦的第一个实战练习。这首曲子在 G 大调上开始，曲头就是一个 V-I（G7 – GΔ），然后立刻经历 F 大调的 ii-V-I（C-7 – F7 – GΔ），接着是一连串 ii-V 在各调轮转。分析每一次和弦变化，背后几乎都是 ii-V 的逻辑。

{% include embed-iframe.html
   src="https://www.youtube.com/embed/sn_Uryzy0ok"
   title="Just Friends"
   caption="\"Just Friends\" — 聆听时注意每次 ii-V-I 落下时的和声重心变化。"
%}

### "All The Things You Are"（Jerome Kern）

Levine 的第六章以这首曲子开篇，演示三全音替代：原版第三小节的 E-7 – A7 被换成 E-7 – E♭7 之后，低音线 A→E♭ 的大跳变成了 A→A♭ 的半音下行，和声质感立刻现代了许多。这首曲子沿五度圈历经 A♭ → C → E♭ → G 多个调中心，每次转调都由 ii-V-I 衔接。

### "Moment's Notice"（John Coltrane）

Levine 在第三章末尾的推荐曲目里给 "Moment's Notice" 标了双感叹号（Ⅱ），意味着较高难度。快速转调下的链式 ii-V，要求在不同调性里的 ii-V 之间无缝切换，是检验 ii-V-I 功底的好靶子。

### "I Thought About You"（Van Heusen & Mercer）

Levine 在第八章把这首曲子的改编版作为"小调 ii-V-i 加变化属七"的示范。你能看到 **Bø – E7alt** 这个小调 ii-V 反复出现，E7alt 每次都用不同的声部走向解决，完美展示了变化属七的灵活性。

---

## 12. 小结

把所有变体汇总一下：

| 类型 | 结构（以 C 调为例） | 核心特征 |
|:----:|:-------------------:|:--------:|
| 大调基础 | D-7 – G7 – C△ | 五度根音下行，七音半步下行 |
| 三音组合弦（A 位） | 三音在底，七音在上 | 右手几乎不移动 |
| 三音组合弦（B 位） | 七音在底，三音在上 | 同上，对称摆放 |
| 带延伸音 | D-9 – G13 – C△9 | 加五音/九音/十三音 |
| Sus 和弦变体 | Gsus – G7 – C△ | Gsus = D-7/G，悬挂感 |
| 小调 ii-V-i | Bø – E7alt – Am7 | 半减和弦 + 变化属七 |
| 变化属七 | D-7 – G7alt – C△ | b9/+9/+11/b13，最大张力 |
| 三全音替代 | D-7 – D♭7 – C△ | 半音低音下行，G7alt = D♭7 |
| 后门进行 | F-7 – B♭7 – C△ | 借自平行小调，iv – ♭VII7 – I |
| 链式 ii-V | A-7 – D7 – D-7 – G7 – C△ | 次属和弦前置 |
| Turnaround | C△ – A7 – D-7 – G7 | 末尾回转，多种变体 |

Levine 的建议在全书里一以贯之：**用五度圈在所有 12 个调上练习每一种进行**，直到不需要想就能弹。这不是理论上的博闻强记，而是让手指记住音乐的重量。

最终，ii-V-I 的美妙之处在于它既极度简单（三个和弦，一条规律），又极度丰富（sus 和弦、变化属七、三全音替代……每种变体都开辟了新的色彩空间）。理论是回头看音乐现象的一面镜子：先听 "Autumn Leaves"，先听 "I Thought About You"，然后再回来对照这些名词——你会发现耳朵早就认识它们了。

---

## 参考文献

[^1]: Levine, Mark (1989). *The Jazz Piano Book*. Sher Music Co. — 本文的主要参考来源，第二章至第八章系统讲解了 ii-V-I 的基础、三音组合弦、延伸音、三全音替代、左手组合弦及变化音的应用。
[^2]: Levine, Mark (1995). *The Jazz Theory Book*. Sher Music Co.
[^3]: Rawlins, Robert & Eddine Bahha, Nor (2005). *Jazzology: The Encyclopedia of Jazz Theory for All Musicians*. Hal Leonard.

---

{% include abc-music.html %}

