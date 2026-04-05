---
layout: post
title: "Diffusion Policy: Visuomotor Policy Learning via Action Diffusion"
date: 2026-04-04
description: A reading note on Chi et al., 2023 — how DDPM-style denoising is applied to robot action generation, why it handles multimodal demonstrations better than explicit policies, and what the inference cost looks like in practice.
tags: robotics diffusion imitation-learning
categories: ml
related_posts: false
toc:
  beginning: true
---

_A short reading note on Chi et al., 2023_

Just as DDPM generates images by iteratively denoising Gaussian noise, Diffusion Policy applies the same process to **robot actions**. The generated artifact — a sequence of joint positions or end-effector poses — is tiny compared to an image, so the model itself is lightweight. The trade-off: to produce a clean action chunk, the model must run the denoising loop $K$ times at inference, requiring higher inference throughput than a single forward-pass policy.

## From Image Diffusion to Action Diffusion

In standard DDPM, the denoising update is:

$$x^{k-1} = \alpha\!\left(x^k - \gamma\,\varepsilon_\theta(x^k, k)\right) + \mathcal{N}(0, \sigma^2 I)$$

where $\varepsilon_\theta$ is a network that predicts the noise added at step $k$, and $\alpha, \gamma, \sigma$ follow a noise schedule. Starting from $x^K \sim \mathcal{N}(0, I)$, you run this $K$ times to get a clean sample $x^0$.

Diffusion Policy makes two changes: (1) replace $x$ with the action sequence $A_t$, and (2) condition the denoiser on the visual observation $O_t$:

$$A_t^{k-1} = \alpha\!\left(A_t^k - \gamma\,\varepsilon_\theta(O_t,\, A_t^k,\, k)\right) + \mathcal{N}(0, \sigma^2 I)$$

The training loss becomes:

$$\mathcal{L} = \mathrm{MSE}\!\left(\varepsilon_k,\; \varepsilon_\theta(O_t,\; A_t^0 + \varepsilon_k,\; k)\right)$$

The observation $O_t$ (images + proprioception) is encoded **once** before the denoising loop — not re-processed at every iteration — which keeps inference tractable.

## Inference Cost

Each inference call requires $K$ forward passes through $\varepsilon_\theta$. With 100 training iterations, DDIM (Song et al., 2021) allows dropping to 10 inference iterations without retraining, giving ~0.1s latency on a 3080 GPU. To amortize this cost, the policy predicts $T_p$ future steps and executes $T_a < T_p$ of them before replanning — the same receding-horizon trick as ACT's action chunking.

## Why This Works Better Than Explicit Policies

Explicit policies (direct regression) struggle with multimodal demonstrations — averaging over two valid trajectories produces a bad in-between trajectory. Diffusion Policy inherits the ability of diffusion models to represent **arbitrary distributions**, including multimodal ones, because the score function $\varepsilon_\theta \approx -\nabla_a \log p(a \mid o)$ does not require estimating any normalization constant. This also makes training significantly more stable than energy-based implicit policies (IBC), which need negative samples to approximate the same quantity.

## Results

Across 15 tasks in simulation and real world, Diffusion Policy improves over prior state-of-the-art by an average of **46.9%**, with near-human performance on tasks like Push-T (95% success) and sauce spreading.
