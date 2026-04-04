---
layout: post
title: Optimizing LLM Inference for On-Device Deployment
date: 2026-02-11
description: A practical overview of quantization, pruning, KV cache, and hardware-specific techniques for running large language models faster — with a focus on edge devices.
tags: llm inference optimization quantization on-device-ai
categories: ml
related_posts: false
toc:
  beginning: true
---

Running a large language model fast enough to be useful — especially on edge hardware — requires going beyond the standard HuggingFace pipeline. This post covers the main optimization techniques, from high-level strategies to the arithmetic of quantization, with a focus on on-device deployment.

> ##### NOTE
>
> The techniques here are primarily relevant to inference-time optimization. Training-time efficiency (gradient checkpointing, mixed-precision training, etc.) is a separate topic.
{: .block-tip }

## Overview

The main levers for accelerating LLM inference are:

1. **Quantization** — Reduce the precision of weights and activations, shrinking memory footprint and increasing arithmetic throughput.
2. **Pruning** — Remove near-zero weights to reduce the effective parameter count.
3. **Low-level implementation** — Rewrite hot paths in C++, Rust, or CUDA/Metal rather than relying on Python dispatch.
4. **KV cache** — Cache intermediate key and value projections across generation steps to avoid recomputation.
5. **Hardware-specific kernels** — Exploit the memory hierarchy of a specific accelerator (e.g., FlashAttention for NVIDIA GPUs, HVX intrinsics for Qualcomm Hexagon).

The relative importance of each depends on the deployment target. For edge devices, quantization and low-level implementation are the highest-leverage tools.

## Quantization

> ##### NOTE
>
> Quantization converts weights and activations from a high-precision format (e.g., FP32) to a lower-precision format (e.g., INT8 or INT4). The compressed representation is stored and loaded from memory; dequantization happens on-the-fly during computation. This is the key insight: you save memory bandwidth without necessarily sacrificing all the numerical fidelity of the computation.
{: .block-tip }

### Post-Training Quantization vs. Quantization-Aware Training

| Method | When it runs | Quality | Cost |
| --- | --- | --- | --- |
| Post-Training Quantization (PTQ) | After training | Moderate | Low |
| Quantization-Aware Training (QAT) | During training | High | High |

PTQ is the practical default for most deployments — you do not have access to the original training pipeline, and the quality degradation is acceptable for INT8 and, increasingly, INT4.

Within PTQ:

- **Dynamic quantization:** Weights are quantized ahead of time; activations are quantized on-the-fly during inference.
- **Static quantization:** Both weights and activations are quantized statically, using calibration data to determine ranges.

### Data Representation

Understanding the formats helps reason about the tradeoffs:

| Format | Bits | Sign | Exponent | Mantissa | Range |
| --- | --- | --- | --- | --- | --- |
| FP32 | 32 | 1 | 8 | 23 | ~$10^{-38}$ to $10^{38}$ |
| FP16 | 16 | 1 | 5 | 10 | ~$6 \times 10^{-8}$ to $6 \times 10^{4}$ |
| BF16 | 16 | 1 | 8 | 7 | ~$10^{-38}$ to $10^{38}$ |
| INT8 | 8 | — | — | — | $-128$ to $127$ |
| INT4 | 4 | — | — | — | $-8$ to $7$ |

FP16 offers better precision than BF16, but BF16 preserves the dynamic range of FP32 — which matters more for deep networks where intermediate activations can span many orders of magnitude. INT8 and INT4 are integer-only and require explicit quantization/dequantization steps.

### Affine Quantization Scheme

The standard approach maps a floating-point value $x$ to a quantized integer $x_q$ via:

$$x_q = \text{round}\!\left(\frac{x}{S} + Z\right)$$

where:

- $S$ is the **scale factor** (a float that sets the step size)
- $Z$ is the **zero point** (an integer that maps zero exactly)
- $\text{round}$ clips to the representable integer range

In practice, quantization is applied block-wise — different blocks of the weight matrix get different scale factors and zero points — which preserves local numerical fidelity better than a single global scale.

Not all layers are quantized equally. Embedding layers and the final logit projection are often kept in higher precision because their weight ranges are harder to compress without quality loss.

## KV Cache

During autoregressive generation, each new token attends to all previous tokens. Without caching, this requires recomputing the key and value projections for the full context at every step — an $O(n^2)$ operation in sequence length.

The KV cache stores these projections after they are computed, so each step only processes the new token's key/value pair and appends it to the cache. This reduces per-step compute from $O(n)$ to $O(1)$ in the attention mechanism.

At long context lengths, the KV cache itself becomes the memory bottleneck. Techniques like **sliding window attention**, **grouped-query attention (GQA)**, and **multi-query attention (MQA)** reduce cache size by sharing key/value heads across query heads.

## Hardware-Specific Optimization

General-purpose kernels leave performance on the table. The most impactful hardware-specific optimization is **FlashAttention** for NVIDIA GPUs, which reformulates the attention computation to minimize HBM reads and writes by fusing the softmax and matrix multiplications into a single kernel that fits in SRAM.

The same principle applies to other accelerators:

- **Qualcomm Hexagon (HVX):** Matrix-vector multiplications can be vectorized using 128-byte HVX registers, and DMA prefetching can overlap memory transfers with compute.
- **Apple Neural Engine:** Operations must be expressed as CoreML ops; arbitrary compute graphs require fallback to the CPU or GPU.
- **Arm Mali / Adreno GPU (OpenCL):** Hand-tuned kernels with local memory tiling and explicit vectorization can significantly outperform auto-generated code.

## Existing Solutions

For practical on-device deployment, the two most important formats and runtimes are:

**GGUF + llama.cpp** — [llama.cpp](https://github.com/ggerganov/llama.cpp) is the de-facto runtime for running quantized models locally. It uses the GGUF format (successor to GGML), supports Q4_K_M, Q8_0, and a range of other quantization schemes, and has backends for CPU, CUDA, Metal, Vulkan, OpenCL, and Qualcomm's Hexagon DSP. For most on-device use cases, this is the right starting point.

**Ollama** — [Ollama](https://github.com/ollama/ollama) wraps llama.cpp with a model management layer and a local API server, making it easy to pull and run models with a single command. Useful for development; less suitable for embedded or mobile deployment.

**HuggingFace Transformers + bitsandbytes** — For server-side inference or development, HuggingFace's `bitsandbytes` integration provides straightforward PTQ in Python. Less control than GGUF but easier to prototype with.

The right choice depends on deployment target, latency budget, and how much control you need over the execution path.
