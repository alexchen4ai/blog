---
layout: page
title: llama.cpp Backend Engineering
description: Hexagon DSP & OpenCL backends for on-device LLM inference
img: assets/img/1.jpg
importance: 1
category: work
---

[llama.cpp](https://github.com/ggerganov/llama.cpp) is the de-facto open-source runtime for running large language models locally. As part of my work at Qualcomm — and growing out of the on-device AI infrastructure I built at Nexa AI — I have been deeply involved in extending llama.cpp's backend ecosystem to fully leverage Qualcomm silicon.

## Hexagon DSP Backend

Qualcomm's Hexagon DSP is a highly parallel, low-power processor present in every Snapdragon SoC. The Hexagon backend for llama.cpp enables transformer inference to offload key compute kernels (matrix-vector products, attention, activations) directly onto the DSP, bypassing the CPU and GPU for those operations entirely.

Key engineering challenges:

- **Memory layout translation** — aligning tensor strides to Hexagon's VMEM requirements
- **Quantization-aware dispatch** — routing Q4_K, Q8_0, and FP16 weights through the appropriate HVX vector intrinsic paths
- **Latency hiding** — overlapping DMA transfers with HVX compute to minimize stall cycles
- **Graph partitioning** — deciding at the GGML compute graph level which ops run on Hexagon vs. fallback CPU

The result is a significant reduction in prefill and decode latency for 1B–7B models on Snapdragon devices, with substantially lower power draw compared to GPU inference.

## OpenCL Backend

The OpenCL backend targets the Adreno GPU (and any OpenCL 2.0+ device), providing a vendor-neutral path for GPU-accelerated inference without requiring proprietary APIs.

Focus areas:

- **Kernel authoring** — hand-tuned OpenCL kernels for GEMV, GEMM, and softmax that match or exceed vendor-library throughput on Adreno
- **Buffer management** — zero-copy host-device buffer sharing via `cl_mem` with `CL_MEM_USE_HOST_PTR` where the Adreno MMU allows it
- **Mixed-precision execution** — FP16 accumulation with FP32 output for accuracy-performance balance
- **Pipeline caching** — persistent program object caching to eliminate recompile overhead across sessions

## Why It Matters

On-device AI inference is only useful if it runs fast enough to feel instant and efficient enough to preserve battery. The Hexagon and OpenCL backends together give llama.cpp a credible, production-grade execution path on the world's most widely shipped mobile SoC family — bringing capable language models to hundreds of millions of Snapdragon-powered devices without any cloud dependency.
