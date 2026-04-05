---
layout: post
title: "Learning Fine-Grained Bimanual Manipulation with Low-Cost Hardware"
date: 2026-04-04
description: A reading note on ALOHA (Zhao et al., 2023) — how ACT uses action chunking and a Conditional VAE to solve fine manipulation tasks that cause standard imitation learning to fail completely.
tags: robotics transformers imitation-learning manipulation
categories: ml
related_posts: false
toc:
  beginning: true
---

_A short reading note on ALOHA (Zhao et al., 2023)_

Fine manipulation tasks — slotting a battery, threading a zip tie — fail catastrophically with standard imitation learning because small errors compound over time. ALOHA's learning algorithm, **ACT**, attacks this with two ideas: predict _chunks_ of future actions instead of one step at a time, and model the multimodality of human demonstrations with a **Conditional VAE**.

**Observation and action space.** At each timestep the policy observes: 4 RGB camera images (top, front, two wrists) and the current joint positions of both arms (14 DoF total). The action it predicts is a sequence of _target joint positions_ — not torques or currents.

This makes ACT **half end-to-end**: the neural network maps pixels → target joint positions, but a low-level PID controller inside each Dynamixel motor handles the actual current/torque commands to track those targets. The learning side never touches the motor-level signal. This separation simplifies training considerably, but it also means the policy cannot reason about contact forces directly — it relies on the PID loop to absorb those dynamics.

## Understanding the CVAE Through the VAE Analogy

To understand why ACT uses a CVAE, start with the original VAE for images.

A VAE learns to encode images into a latent distribution $q_\phi(z \mid x) \approx \mathcal{N}(\mu, \sigma^2)$, then decode samples back:

$$\mathcal{L} = \underbrace{\mathbb{E}[\log p_\theta(x \mid z)]}_{\text{reconstruction}} - \underbrace{\beta \, D_{\mathrm{KL}}\!\left(q_\phi(z \mid x) \,\|\, \mathcal{N}(0, I)\right)}_{\text{regularization}}$$

At generation time, you sample $z \sim \mathcal{N}(0, I)$ and decode — new images emerge from the learned distribution over all training samples.

**Now replace "image samples" with "action trajectories."** Human demonstrations of the same task are inherently stochastic: the exact handover position mid-air differs every time. ACT treats each demonstration trajectory $a_{t:t+k}$ as a sample from some latent distribution of "styles." The CVAE learns:

$$\mathcal{L}_{\mathrm{ACT}} = \underbrace{\mathrm{MSE}(\hat{a}_{t:t+k},\, a_{t:t+k})}_{\mathcal{L}_{\mathrm{reconst}}} + \beta \underbrace{D_{\mathrm{KL}}\!\left(q_\phi(z \mid a_{t:t+k}, \bar{o}_t) \,\|\, \mathcal{N}(0, I)\right)}_{\mathcal{L}_{\mathrm{reg}}}$$

where $$\bar{o}_t$$ is the proprioceptive observation (joint positions, no images) and $$\hat{a}_{t:t+k}$$ is the predicted action chunk of length $$k$$.

The critical difference from an image VAE: **at test time, instead of sampling noise, ACT sets $z = 0$** (the mean of the Gaussian prior). This keeps inference deterministic and stable — the robot doesn't randomly explore during deployment.

> _Why does this work? The CVAE objective forces the encoder to compress the "style" of a trajectory — the particular way a human chose to do the task — into $z$. At test time, $z = 0$ selects the mean style, which corresponds to the most likely, average-human behavior across all demonstrations._

## Architecture: How z is Extracted

The CVAE **encoder** is a BERT-style transformer. Its input sequence is:

$$[\underbrace{\mathrm{[CLS]}}_{\text{learnable}},\; \underbrace{W_1 \bar{o}_t}_{\text{joints}},\; \underbrace{W_2 a_t,\, \ldots,\, W_2 a_{t+k}}_{\text{action sequence}}] \quad \in \mathbb{R}^{(k+2) \times 512}$$

After passing through 4 self-attention blocks, **only the output at the `[CLS]` position is used** to predict $\mu_z$ and $\sigma_z$. This is the same trick as BERT's sentence-level embedding: the `[CLS]` token aggregates global context from the full sequence into a single vector, from which $z \in \mathbb{R}^{32}$ is sampled via reparameterization.

The encoder is discarded entirely at test time.

## Architecture: How Actions are Decoded (No Autoregression)

The CVAE **decoder** (the actual deployed policy) takes:

- 4 RGB images → ResNet18 → flattened spatial features $\in \mathbb{R}^{1200 \times 512}$
- Joint positions $\bar{o}_t$ → linear projection → $\mathbb{R}^{512}$
- Style variable $z$ → linear projection → $\mathbb{R}^{512}$

These are concatenated and processed by a **transformer encoder** (1202 tokens total). The encoder output serves as _keys_ and _values_ in a transformer decoder.

The decoder's **queries are fixed sinusoidal position embeddings** — one per future timestep:

$$\mathrm{query}_i = \mathrm{SinPE}(i), \quad i = 1, \ldots, k$$

This means the decoder attends to the full observation context (via cross-attention) and outputs all $k$ future actions **in parallel** — there is no autoregressive token generation, no teacher forcing, no causal masking. The output is directly $\hat{a}_{t:t+k} \in \mathbb{R}^{k \times 14}$.

## Action Chunking + Temporal Ensembling

ACT predicts $\pi_\theta(a_{t:t+k} \mid o_t)$ — a chunk of $k$ future joint positions. At each timestep, the policy is queried, producing overlapping predictions. These are merged with exponential weighting:

$$a_t = \frac{\sum_i w_i \cdot \hat{A}_t[i]}{\sum_i w_i}, \quad w_i = \exp(-m \cdot i)$$

where $\hat{A}_t[i]$ is the $i$-th oldest prediction for timestep $t$. Older predictions are down-weighted. This removes jerky switching between chunks and produces smooth robot motion without any extra training cost.

## Results

ACT achieves **80–96% success** on tasks like battery insertion and condiment cup opening — tasks where all prior methods (BeT, RT-1, BC-ConvMLP) essentially fail (0–8%). Ablations confirm that each component matters: removing action chunking drops performance from 44% → 1%, removing CVAE training drops performance from 35% → 2% on human (stochastic) data.
