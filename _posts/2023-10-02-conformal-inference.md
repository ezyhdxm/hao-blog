---
layout: post
title: "Conformal Inference"
comments: true
date:  2023-10-02 22:13:00 -0500
tags: general-statistics
lang: en
---

> Utterly disastrous. ― ChatGPT.

<!--more-->
{: class="table-of-content"}
* TOC
{:toc}
---



### The Dark Ages of Statistics

Statisticians, bless their hearts, have a knack for realizing that their machine learning models resemble a toddler's attempt at juggling flaming swords – utterly disastrous. And when it comes to deriving confidence intervals for the parameters in your beloved deep learning models, they're about as lost as a penguin in the Sahara. Even their cherished Lasso, which they've clung to for nearly three decades, remains shrouded in uncertainty, like a mysterious soup recipe passed down through generations. Not to mention trying to find a confidence interval for a BERT parameter. It is like searching for the meaning of life in a cereal box – utterly pointless. 

Statisticians, you see, are a bit like the steadfast believers who think there's hidden wisdom in their linear models. They're like the person who insists that eating kale will solve all of life's problems. On the flip side, computer scientists are the skeptics, the atheists of the tech world, who wouldn't hesitate to use theory papers as toilet papers. Nobody believes that BERT can unravel the secrets of protein folding; it's as absurd as expecting a dishwasher to write Shakespearean sonnets. Yet it simple works. 

Some statisticians have thrown in the towel when it comes to dissecting the enigma of ResNet-50. Yet, they're still determined to offer you confidence intervals, just like your mom insisting you eat your veggies, except these veggies are so-called statistical uncertainty. Why, you ask? Well, they want your facial recognition system to be as indecisive as a cat contemplating a closed door. So, they've conjured up a whole new realm called "conformal inference" to make sure your front door is a revolving one.

### How to Ensure That Your Facial Recognition System Can Simultaneously Grant and Deny Access to Your Home

Imagine this: you've got a trusty training set, a batch of $$n$$ independent and identically distributed samples, snugly wrapped as $$Z_i = (X_i, Y_i)$$. Now, let's sprinkle a little mystery into the mix. Imagine there's an independently observed covariate, let's call it $$X_{n+1}$$, plucked from the same distribution as your training set comrades. Your mission, should you choose to accept it, is to conjure up an interval, let's dub it $$C(X_{n+1})$$. This magical interval needs to be crafted with a dash of uncertainty, a pinch of audacity, so that it confidently hugs $$Y_{n+1}$$ with a probability of at least $$1 - \alpha$$:  

$$
\mathbb{P}(Y_{n+1} \in C(X_{n+1})) \geq 1 - \alpha.
$$

Now, here's where the plot thickens. Enter your favorite machine learning algorithm, a wizard in the art of unveiling the mystical connection between $$X$$ and $$Y$$, producing the marvelous estimated function $$\hat{\mu}$$. We assume that the algorithm does not depend on the order of the input training data. Here's where the magic happens. When you feed this algorithm the ensemble of $$Z_1, \ldots, Z_{n+1}$$, the residuals $$R_i = Y_i - \hat{\mu}(X_i)$$, my friend, are like a box of assorted chocolates –– tantalizingly exchangeable! Looking at the rank of the $$(n+1)$$th residual $$R_{n+1}$$, it has a uniform distribution over the discrete set $$[n+1] := \{1, 2, \ldots, n+1\}$$. We normalized the rank as 

$$
\pi(Y_{n+1}) := \frac{1}{n+1}\sum_{i=1}^{n+1} I(R_{i} \geq R_{n+1}) = \frac{1}{n+1} + \frac{1}{n+1}\sum_{i=1}^{n} I(R_{i} \geq R_{n+1}).
$$

Therefore, for some $$y \in \mathbb{R}$$, we statisticians would be able to test the null hypothesis that declares
$$H_0 : Y_{n+1} = y$$
by firing up our trusty machine learning algorithm once more, this time on the data $$Z_1, \ldots, Z_n, (X_{n+1}, y)$$. Let the algorithm work its magic, and you'll be left with a fresh batch of residuals,  $$R_{y,1}, \ldots, R_{y, n+1}$$. Under this audacious null hypothesis, $$\pi(y)$$ possesses a uniform distribution over the discrete set $$\{\frac{1}{n+1}, \ldots, 1\}$$. We pick the upper $$\alpha$$-quantile of this distribution: $$\frac{\lceil (1-\alpha) (n+1) \rceil}{n+1}$$. If $$\pi(y)$$ struts its stuff and is greater than this $$\alpha$$-quantile, you're in the rejection business. Goodbye null hypothesis! Now, for the grand finale. If we flip the hypothesis testing problem, we can craft a predictive interval of level at least $$(1 - \alpha)$$ by

$$
C(X_{n+1}) = \{y\in \mathbb{R}: (n+1) \pi(y) \leq \lceil (1-\alpha) (n+1) \rceil\}. 
$$

Great! Now, your facial recognition system dares not to be arrogant and presumptuous anymore!