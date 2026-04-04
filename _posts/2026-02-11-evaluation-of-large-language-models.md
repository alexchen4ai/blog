---
layout: post
title: Evaluation of Large Language Models
date: 2026-02-11
description: A practical guide to LLM benchmarks — what they measure, how they are computed, and how to run them yourself.
tags: llm evaluation benchmarks
categories: ml
related_posts: false
toc:
  beginning: true
---

The landscape of large language model evaluation is rich and sometimes overwhelming. Dozens of leaderboards, hundreds of benchmarks, and no single agreed-upon standard for what "good" means. This post maps out the major categories of evaluation, the key benchmarks within each, and how to actually run them yourself.

> ##### NOTE
>
> Stanford CS224U is an excellent resource for building a deeper theoretical foundation in LLM evaluation beyond what is covered here.
> {: .block-tip }

## LLM Leaderboards

A useful starting point is to see which benchmarks are prominent enough to appear on major leaderboards. The following are the most widely referenced:

1. [Hugging Face Open LLM Leaderboard](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard)
2. [LMSYS Chatbot Arena](https://chat.lmsys.org/) — human preference-based ranking
3. [Can AI Code](https://huggingface.co/spaces/mike-ravkine/can-ai-code-results) — coding-specific evaluation

For a comprehensive academic treatment, the survey paper [Evaluating Large Language Models: A Comprehensive Survey](https://arxiv.org/pdf/2310.19736.pdf) covers the full taxonomy in depth.

## Classification of LLM Evaluation

LLM evaluation broadly splits into two axes: **what** is being evaluated (knowledge, reasoning, alignment, safety, etc.) and **how** it is evaluated (automatic scoring, human judgment, LLM-as-judge).

{% include figure.liquid loading="eager" path="assets/img/LLM_eval.png" title="The classification of LLM evaluation" class="img-fluid rounded z-depth-1" %}

<div class="caption">Figure 1: The classification of LLM evaluation.</div>

The knowledge and capability progression across model generations:

{% include figure.liquid loading="eager" path="assets/img/knowledge_capability_evaluation.png" title="The progress of LLM knowledge capability evaluation" class="img-fluid rounded z-depth-1" %}

<div class="caption">Figure 2: The progress of LLM knowledge capability evaluation.</div>

### Commonsense Reasoning Datasets

| Dataset       | Domain   | Size   | Source               | Task               |
| ------------- | -------- | ------ | -------------------- | ------------------ |
| ARC           | Science  | 7,787  | Various              | Multiple-choice QA |
| QASC          | Science  | 9,980  | Human-authored       | Multiple-choice QA |
| MCTACO        | Temporal | 1,893  | MultiRC              | Multiple-choice QA |
| HellaSWAG     | Event    | 20K    | ActivityNet, WikiHow | Multiple-choice QA |
| PIQA          | Physical | 21K    | Human-authored       | 2-choice QA        |
| Social IQA    | Social   | 38K    | Human-authored       | Multiple-choice QA |
| CommonsenseQA | Generic  | 12,247 | ConceptNet           | Multiple-choice QA |
| OpenBookQA    | Generic  | 6K     | WorldTree            | Multiple-choice QA |

### Multi-Hop Reasoning Datasets

| Dataset     | Domain  | Size    | Hops | Task            |
| ----------- | ------- | ------- | ---- | --------------- |
| HotpotQA    | Generic | 112,779 | 1–3  | Span extraction |
| HybridQA    | Generic | 69,611  | 2–3  | Span extraction |
| MultiRC     | Generic | 9,872   | ~2.4 | Multiple-choice |
| NarrativeQA | Fiction | 46,765  | —    | Generative      |
| MedHop      | Medical | 2,508   | —    | Multiple-choice |
| WikiHop     | Generic | 51,318  | —    | Multiple-choice |

## Benchmarks

Once you have a dataset, you need a benchmark — a standardized procedure that produces a comparable score. The following are the most commonly used:

| Benchmark | Subjects | Language          | Questions | Access |
| --------- | -------- | ----------------- | --------- | ------ |
| MMLU      | 57       | English           | 15,908    | Local  |
| MMCU      | 51       | Chinese           | 11,900    | Local  |
| C-Eval    | 52       | Chinese           | 13,948    | Online |
| AGIEval   | 20       | English + Chinese | 8,062     | Local  |
| M3KE      | 71       | Chinese           | 20,477    | Local  |
| CMMLU     | 67       | Chinese           | 11,528    | Local  |

For holistic evaluation across many tasks simultaneously:

| Benchmark     | Language         | Evaluation Method     | Leaderboard |
| ------------- | ---------------- | --------------------- | ----------- |
| HELM          | English          | Automatic             | Yes         |
| BIG-bench     | English + others | Automatic             | Yes         |
| OpenCompass   | English + others | Automatic + LLM-judge | Yes         |
| Chatbot Arena | English + others | Human preference      | Yes         |
| FlagEval      | English + others | Automatic + Manual    | No          |

## How to Calculate a Benchmark

Understanding the mechanics of benchmark calculation matters — especially when you need to trust the numbers or reproduce them.

### A Concrete Example: TruthfulQA

The [TruthfulQA dataset](https://huggingface.co/datasets/truthful_qa/viewer/multiple_choice) is designed to evaluate whether a model generates factually accurate answers rather than plausible-sounding ones. It is one of the six benchmarks that appear on the Hugging Face Open LLM Leaderboard.

### The Evaluation Harness

Rather than implementing evaluation from scratch for each benchmark, the standard tool is [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness) by EleutherAI. It provides a unified interface for running a model against hundreds of benchmarks with consistent prompting and scoring.

### Zero-Shot vs. Few-Shot Evaluation

The evaluation protocol — zero-shot or few-shot — significantly affects scores and must be reported alongside results:

- **Few-shot:** The model is primed with `k` examples before the test question. A prompt suffix like `"thus, the choice is:"` can steer the model toward a structured answer format (e.g., `A`, `B`, `C`).
- **Zero-shot:** No examples are provided. The model must interpret the task from the question alone. Multiple prompts are sometimes needed: one to elicit a free-form response, another to coerce it into a parseable answer.

### Dataset Splits and Leakage

Pay attention to train/val/test splits. For benchmarks like HellaSwag, models should be fine-tuned only on train and val, with the test set held out strictly for evaluation. Contamination — where test data appears in the pretraining corpus — is a known problem with many public benchmarks and is an active area of research.

## Takeaways

Benchmarks are necessary but imperfect. A few principles worth keeping in mind:

- **No single benchmark is sufficient.** Use a diverse set covering different capabilities and domains.
- **Report the evaluation protocol.** Zero-shot vs. few-shot, prompt format, and framework version all affect results.
- **Be skeptical of leaderboard rankings.** Many benchmarks have been saturated or are potentially contaminated in large pretraining corpora.
- **Human evaluation remains the gold standard** for open-ended generation quality — Chatbot Arena's Elo-based approach is the closest thing to a reliable real-world signal.
