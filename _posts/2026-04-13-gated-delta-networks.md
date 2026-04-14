---
layout: post
title: "Gated Delta Networks: Improving Mamba2 with the Delta Rule"
date: 2026-04-13
description: A reading note on Liu et al., 2024 — how combining Mamba2's decay gate with DeltaNet's selective memory update yields a flexible recurrent model, and why its parallel training algorithm requires a matrix inverse.
tags: transformers mamba linear-attention
categories: ml
related_posts: false
toc:
  beginning: true
---

_A short reading note on Liu et al., 2024_

## From Softmax Attention to Linear Attention

Standard Transformer attention computes:

$$
O = \text{softmax}\!\left(\frac{QK^T}{\sqrt{d}}\right)V
$$

where $Q \in \mathbb{R}^{L \times d_k}$, $K \in \mathbb{R}^{L \times d_k}$, $V \in \mathbb{R}^{L \times d_v}$. This scales quadratically with sequence length $L$.

Linear attention drops the softmax and computes $O = (QK^T)V$. By changing the association order to $Q(K^TV)$, we can derive a recurrent form. Expanding per-token:

$$
o_t = \sum_{i=1}^{t} v_i (k_i^T q_t) = \left(\sum_{i=1}^{t} v_i k_i^T\right) q_t
$$

Defining the **state matrix** $S_t = \sum_{i=1}^{t} v_i k_i^T \in \mathbb{R}^{d_v \times d_k}$, we get a linear recurrence:

$$
S_t = S_{t-1} + v_t k_t^T, \quad o_t = S_t q_t
$$

This is the key insight: instead of storing all past $K, V$ tokens, we compress them into a fixed-size state $S_t$. Inference becomes $O(1)$ per step in memory, regardless of sequence length.

## Mamba2: Adding a Decay Gate

Vanilla linear attention has no forgetting — $S_t$ accumulates everything, and once the number of stored key-value pairs exceeds $d_k$ (the state dimension), memory collisions become inevitable and retrieval degrades.

Mamba2 addresses this by introducing a scalar decay gate $\alpha_t \in (0, 1)$:

$$
S_t = \alpha_t S_{t-1} + v_t k_t^T, \quad o_t = S_t q_t
$$

This uniformly decays all stored associations at each step, allowing the model to forget old information. However, the decay is **indiscriminate** — if the model needs to forget one specific key-value pair, _all_ pairs get equally decayed. This leads to poor long-term retention when the needle is buried deep in a long context.

## DeltaNet: The Delta Update Rule

DeltaNet takes a different approach. Instead of decaying everything, it **selectively replaces** the value associated with the current key. The delta rule (Widrow et al., 1960) first erases the old value for key $k_t$, then writes a blended new value:

$$
S_t = S_{t-1} - \underbrace{(S_{t-1} k_t)}_{\text{old value } v_t^{\text{old}}} k_t^T + \underbrace{(\beta_t v_t + (1-\beta_t) S_{t-1} k_t)}_{\text{new value } v_t^{\text{new}}} k_t^T
$$

where $\beta_t \in (0, 1)$ is the writing strength. Simplifying:

$$
S_t = S_{t-1}(I - \beta_t k_t k_t^T) + \beta_t v_t k_t^T
$$

This is much more surgical — it only modifies the association for $k_t$ while leaving others intact. DeltaNet excels at associative recall benchmarks because of this precision. But it has a blind spot: it can only update **one** key-value pair at a time, so it lacks the ability to rapidly clear out large amounts of irrelevant context (e.g., during a topic switch).

## Gated DeltaNet: Best of Both Worlds

The key observation from the paper is that gating and the delta rule are **complementary**:

- **Gating** ($\alpha_t$): enables rapid, wholesale memory erasure (set $\alpha_t \to 0$ to flush the state)
- **Delta rule** ($\beta_t$): enables precise, targeted updates (modify one association without affecting others)

Gated DeltaNet combines both into a single update rule:

$$
S_t = S_{t-1}\bigl(\alpha_t(I - \beta_t k_t k_t^T)\bigr) + \beta_t v_t k_t^T
$$

When $\alpha_t \to 1$, this reduces to the pure delta rule. When $\alpha_t \to 0$, the state is flushed regardless. This unified mechanism gives the model flexible memory control — it can selectively update specific associations _and_ perform bulk forgetting when needed.

From an online learning perspective, this is equivalent to SGD on the regression loss $\mathcal{L}(S_t) = \frac{1}{2}\|S_t k_t - v_t\|^2$ with an **adaptive weight decay** $\alpha_t$ — a technique well-known in deep learning optimization.

## The Parallel Training Challenge: Where the Matrix Inverse Appears

The recurrent form is great for inference but sequential — each $S_t$ depends on $S_{t-1}$. For efficient GPU training, we need a parallel algorithm.

The trick is **chunkwise parallelism**: split the sequence into chunks of size $C$, and within each chunk, partially expand the recurrence. For DeltaNet, the transition involves products of generalized Householder matrices $(I - \beta_t k_t k_t^T)$. Using the classical **WY representation**, these products can be expressed via an auxiliary matrix $T$:

$$
T = \left[I + \text{strictLower}\!\left(\text{diag}(\boldsymbol{\beta}) \cdot (\Gamma \odot KK^T)\right)\right]^{-1} \text{diag}(\boldsymbol{\beta})
$$

where $\Gamma$ is the decay-aware mask with entries $\Gamma_{ij} = \gamma_i / \gamma_j$ (cumulative products of $\alpha$). This is where the **matrix inverse** appears — the lower-triangular system encodes the sequential dependencies within a chunk. The matrix is $C \times C$ (chunk size, typically small), so the inverse is tractable and the overall algorithm remains rich in matrix multiplications suitable for tensor cores.

With $T$ computed, the transformed values $\tilde{U} = TV$ and keys $W = TK$ allow the chunk-level state update and output to be expressed as matmuls:

$$
S_{[t+1]} = \vec{S}_{[t]} + \left(\tilde{U}_{[t]} - \overleftarrow{W}_{[t]} S_{[t]}^T\right)^T \vec{K}_{[t]}
$$

$$
O_{[t]} = \overleftarrow{Q}_{[t]} S_{[t]}^T + \left(Q_{[t]} K_{[t]}^T \odot M\right)\left(\tilde{U}_{[t]} - \overleftarrow{W}_{[t]} S_{[t]}^T\right)
$$

where the arrows denote decay-scaled versions of the variables (decayed to chunk boundaries). This preserves the $O(L)$ complexity while enabling hardware-efficient parallel training.

## Architecture and Hybrids

The full Gated DeltaNet block follows the Llama macro architecture (token mixer + SwiGLU MLP). For the token mixer: $q, k, v$ are produced via linear projection → short convolution → SiLU, with **L2 normalization** on $q, k$ for training stability. The scalars $\alpha, \beta$ use linear projections, and the output passes through normalization and gating before the final projection.

The paper also proposes hybrid variants that interleave Gated DeltaNet with other layers:

- **Gated DeltaNet-H1**: Gated DeltaNet + sliding window attention (SWA)
- **Gated DeltaNet-H2**: Mamba2 + Gated DeltaNet + SWA

The hybrid models combine the recurrent layers' efficient long-range modeling with attention's strength at local patterns and precise retrieval, achieving the best results across benchmarks while maintaining competitive training throughput.
