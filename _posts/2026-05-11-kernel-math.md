---
layout: post
title: "Understanding Kernel Design from a Mathematical Perspective"
date: 2026-05-11
description: Relating mathematical concepts — index notation, associative mergeable summaries — to GPU kernel design for ML inference, with case studies on fused operators and FlashAttention.
tags: kernel inference optimization
categories: ml
related_posts: false
toc:
  beginning: true
---

In this blog, we discuss writing kernels for ML model inference, relating some mathematical concepts to kernel design and implementation.

## Mathematical Background

### Index Notation

We use index notation to represent the parallelism of operators for kernels. Index notation includes the **dummy index** and the **free index**. The dummy index means we need some intermediate result to store, while the free index needs to be distributed to threads for computation.

For example, a matmul in PyTorch can be represented as:

$$
C_{ij} = \sum_{k} A_{ik} B_{kj}
$$

where $i, j$ are the free indices and $k$ is the dummy index.

### Associative Mergeable Summary

An associative mergeable summary over a set $S$ consists of:

- A **summary type** $T$ with a merge operation $\oplus: T \times T \to T$ that is associative: $(a \oplus b) \oplus c = a \oplus (b \oplus c)$
- A **lift** function $f: S \to T$ that maps each element to its summary
- An **identity** element $e \in T$ such that $a \oplus e = e \oplus a = a$

This generalizes the commutative monoid by not requiring commutativity — the merge order must be preserved, but partial summaries can still be computed independently and merged. For example, online softmax uses this structure: each partial summary carries a local max, a sum of exponentials, and an accumulator, and these can be merged associatively across thread blocks.

## Case Study

### Fused Vector Add and GeLU

Writing and reading from HBM is expensive, so a natural strategy is to fuse the vector add and GeLU into a single kernel.

**Unfused (two separate kernels):**

First, compute the vector add and write the intermediate result $Z$ to HBM:

$$
Z_i = X_i + Y_i
$$

Then, read $Z$ back from HBM and apply GeLU:

$$
O_i = Z_i \cdot \Phi(Z_i)
$$

where $\Phi$ is the standard Gaussian CDF. This requires one write and one read of the intermediate $Z$ to/from HBM.

**Fused (single kernel):**

$$
O_i = (X_i + Y_i) \cdot \Phi(X_i + Y_i)
$$

The intermediate result $X_i + Y_i$ stays in registers — no HBM round-trip is needed. Since $i$ is a free index with no dummy indices, every element is independent and trivially parallelizable across threads.

### Flash Attention

The typical attention computation is:

$$
O = \text{softmax}\!\left(\frac{QK^T}{\sqrt{d}}\right)V
$$

In index notation:

$$
O_{ij} = \text{softmax}\!\left(\frac{Q_{ik}K_{km}}{\sqrt{d}}\right)V_{mj}
$$

where $Q\in\mathbb{R}^{S\times d}$, $K\in\mathbb{R}^{L\times d}$, $V\in\mathbb{R}^{L\times d_v}$, $d$ is the key/value dimension, $S$ is the sequence length, and $L$ is the KV cache length. Here $i, j$ are the free indices and $k, m$ are the dummy indices. We should write this as one kernel — otherwise we must materialize $QK^T$ to HBM, which is expensive when the sequence or KV cache length is long.

The daunting part is softmax, which breaks naive parallelism over the dummy index $m$. But softmax is row-wise independent, so each query row can be handled separately. The remaining problem: for a single query row, how do we split the reduction over a long KV cache length $L$ across thread blocks?

#### Step 1: What Do We Actually Need?

For a single query row $q$, the attention output is:

$$
O = \sum_{j=1}^{L} \frac{\exp(s_j)}{\sum_{l=1}^{L} \exp(s_l)}\, v_j
$$

where $s_j = \frac{q \cdot k_j}{\sqrt{d}}$. For numerical stability, we subtract the max $m = \max_j s_j$:

$$
O = \frac{\sum_{j=1}^{L} \exp(s_j - m)\, v_j}{\sum_{j=1}^{L} \exp(s_j - m)}
$$

So to compute the output, we need three things: the max $m$, the denominator $\ell = \sum_j \exp(s_j - m)$, and the numerator $u = \sum_j \exp(s_j - m)\, v_j$.

#### Step 2: Split into Two Disjoint Subsets

Take two disjoint subsets $A, B$ with $A \cup B = \{1, \dots, L\}$. For each subset, we independently compute its own local version of these three quantities:

$$
m_A = \max_{j \in A} s_j, \quad \ell_A = \sum_{j \in A} \exp(s_j - m_A), \quad u_A = \sum_{j \in A} \exp(s_j - m_A)\, v_j
$$

$$
m_B = \max_{j \in B} s_j, \quad \ell_B = \sum_{j \in B} \exp(s_j - m_B), \quad u_B = \sum_{j \in B} \exp(s_j - m_B)\, v_j
$$

Each subset uses its own local max for numerical stability. The question is: can we recover the global result from $(m_A, \ell_A, u_A)$ and $(m_B, \ell_B, u_B)$ alone?

#### Step 3: Merge

Yes. Let $m_C = \max(m_A, m_B)$. We rescale everything to this common max:

$$
\ell_C = e^{m_A - m_C}\, \ell_A + e^{m_B - m_C}\, \ell_B
$$

$$
u_C = e^{m_A - m_C}\, u_A + e^{m_B - m_C}\, u_B
$$

$$
O = \frac{u_C}{\ell_C}
$$

This works because $e^{m_A - m_C}$ corrects each partial sum from its local max to the global max. Critically, the merge does not depend on the order of $A$ and $B$ — swapping them gives the same result. This is exactly what we need for GPU execution, where SMs process tiles in arbitrary order. By recursively applying this divide-and-conquer strategy, we can compute the attention output for the entire query matrix in parallel.

#### Step 4: Reduction Operators Across Threads

The merge formulas in Step 3 rely on two fundamental reduction operators: **max** and **sum**. Both are associative and commutative, which means they can be computed in any order across threads — exactly what we need for GPU parallelism.

**Max reduction.** Each thread block computes a local max $m_i$ over its tile of scores. To obtain the global max, we reduce across thread blocks:

$$
m = \max(m_1, m_2, \dots, m_P)
$$

where $P$ is the number of partitions. This is a tree reduction: pairs of threads compare their local maxes, the winners compare again, and so on in $\lceil \log_2 P \rceil$ steps. In practice this happens first within a warp via shuffle instructions, then across warps via shared memory.

**Sum reduction.** Once the global max $m$ is known (or as we merge incrementally), each thread block's partial denominator must be rescaled and summed:

$$
\ell = \sum_{i=1}^{P} e^{m_i - m}\, \ell_i
$$

This is again a standard sum reduction — each thread contributes $e^{m_i - m}\, \ell_i$, and the partial sums are accumulated with the same tree pattern. The numerator $u$ follows identically:

$$
u = \sum_{i=1}^{P} e^{m_i - m}\, u_i
$$

These are exactly the merge formulas from Step 3, applied across $P$ thread blocks instead of two subsets. The key insight is that max and sum are the only two reduction primitives needed — max gives us the global shift for numerical stability, and sum (with the exponential correction factor) lets us accumulate both the denominator and the weighted value numerator. Because both reductions are associative, thread blocks can finish their local work in any order and merge results incrementally as they become available.

#### Identifying the Auxiliary Variables

The critical auxiliary state is the triple $(m, \ell, u)$ — the running max, the rescaled denominator, and the rescaled numerator. These are exactly the variables FlashAttention maintains per query row. Each thread block processes a tile of keys, produces a partial $(m, \ell, u)$, and the results are merged incrementally with $\oplus$.

This way of thinking generalizes: whenever you face a reduction that isn't a simple sum or max, start from the final expression you need, try splitting it into two disjoint parts, and ask what variables are needed to merge them. The variables you discover become your summary state, and the merge formula becomes your $\oplus$. For softmax, the "recipe" turned out to be $(m, \ell, u)$ — the max is the non-obvious ingredient that makes everything else rescalable.
