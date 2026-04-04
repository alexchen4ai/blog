---
layout: post
title: Reinforcement Learning for Large Language Models
date: 2026-02-14
description: From the fundamentals of RL — value functions, policy gradients, Q-learning, PPO — to how these ideas translate directly into RLHF and DPO for LLM alignment.
tags: llm reinforcement-learning rlhf dpo ppo
categories: ml
related_posts: false
toc:
  beginning: true
---

Reinforcement learning has become a central technique in the post-pretraining phase of LLM development. RLHF (Reinforcement Learning from Human Feedback) is how models like ChatGPT learned to be helpful, and DPO (Direct Preference Optimization) is its cleaner, more tractable successor. But to understand why these methods work — and where they can fail — it helps to build up from RL fundamentals.

This post covers the core RL concepts, the value-based and policy-based methods that underpin them, and how PPO and DPO are adapted for LLM training.

## Background: The RL Framework

The RL setup involves an **agent** interacting with an **environment** in a loop. At each timestep $t$:

1. The agent observes the current state $S_t$
2. It takes action $A_t$ according to its policy
3. The environment transitions to state $S_{t+1}$ and emits reward $R_{t+1}$

{% include figure.liquid loading="eager" path="assets/img/RL_basic.png" title="The basic reinforcement learning loop" class="img-fluid rounded z-depth-1" %}

<div class="caption">Figure 1: The agent-environment interaction loop in RL.</div>

The tuple $(S_t, A_t, S_{t+1}, R_{t+1})$ is the fundamental unit of experience in RL.

**Key concepts:**

- **Markov property:** The next state depends only on the current state and action, not the full history. This is the assumption that makes RL tractable.
- **Policy** $\pi$: A function mapping states to actions (or distributions over actions). The goal is to find $\pi^*$ — the optimal policy.
- **Reward** $R$: Immediate feedback from the environment after taking an action.
- **Value** $V$: The discounted sum of expected future rewards from a given state — a long-horizon signal, unlike the immediate reward.

> ##### NOTE
>
> Deep learning is not natively designed for RL. RL is fundamentally a mathematical framework, and neural networks are just one (very powerful) way to represent the functions involved. Always think from the math first; the network architecture follows.
> {: .block-tip }

## Value-Based Methods

{% include figure.liquid loading="eager" path="assets/img/RL_classification.png" title="Taxonomy of RL methods" class="img-fluid rounded z-depth-1" %}

<div class="caption">Figure 2: Taxonomy of RL methods — value-based, policy-based, and actor-critic.</div>

Value-based methods learn to estimate how good a given state (or state-action pair) is, then derive a policy implicitly by acting greedily with respect to that estimate.

### The Value Function

The **state-value function** $V_\pi(s)$ gives the expected discounted return starting from state $s$ under policy $\pi$:

$$V_{\pi}(s) = \mathbb{E}_{\tau \sim \pi}\left[ R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \cdots \mid S_t = s \right]$$

The **action-value function** $Q_\pi(s, a)$ adds one more level of granularity — it conditions on both state and action:

$$Q_{\pi}(s, a) = \mathbb{E}_{\pi}\left[ G_t \mid S_t = s, A_t = a \right]$$

The optimal policy then follows directly:

$$\pi^* = \operatorname*{arg\,max}_{a}\, Q^*(s, a)$$

### Bellman Equation and Q-Learning

Computing $V$ or $Q$ by simulating full episodes is expensive. The **Bellman equation** decomposes this into a one-step recursive form:

$$V_\pi(s) = \mathbb{E}_{\pi}\left[ R_{t+1} + \gamma \cdot V_{\pi}(S_{t+1}) \mid S_t = s \right]$$

**Q-learning** is an off-policy method that uses temporal difference (TD) updates to iteratively improve $Q$:

$$Q(S_t, A_t) \leftarrow Q(S_t, A_t) + \alpha \left( R_{t+1} + \gamma \max_a Q(S_{t+1}, a) - Q(S_t, A_t) \right)$$

The $\epsilon$-greedy policy balances exploration and exploitation: take the greedy action with probability $\epsilon$, a random action otherwise.

### Deep Q-Networks (DQN)

When the state space is continuous or too large for a table, we parameterize $Q$ with a neural network $Q_\theta(s, a)$. This is **DQN**. The network is trained to minimize:

$$\mathcal{L}(\theta) = \left( y_j - Q_\theta(\phi_j, a_j) \right)^2$$

where $y_j = r_j + \gamma \max_{a'} \hat{Q}(\phi_{j+1}, a'; \theta^-)$ is the TD target computed using a **target network** $\hat{Q}$ with lagged weights $\theta^-$. A **replay buffer** stores past transitions and provides decorrelated minibatches for stable training.

In code, the TD target computation looks like:

```python
with torch.no_grad():
    target_max, _ = target_network(data.next_observations).max(dim=1)
    td_target = data.rewards.flatten() + args.gamma * target_max * (1 - data.dones.flatten())

old_val = q_network(data.observations).gather(1, data.actions).squeeze()
loss = F.mse_loss(td_target, old_val)
```

## Policy-Based Methods

Rather than learning a value function and deriving a policy implicitly, policy-based methods directly parameterize and optimize $\pi_\theta$.

**Advantages over value-based methods:**

- Naturally handles continuous and high-dimensional action spaces
- Can represent stochastic policies
- Better convergence properties in practice

**Disadvantages:**

- Often converges to local optima
- High variance in the gradient estimate

The policy objective is the expected total return:

$$J(\theta) = \mathbb{E}_{\tau \sim \pi_\theta}\left[ R(\tau) \right]$$

The **policy gradient theorem** gives us a tractable gradient:

$$\nabla_\theta J(\theta) = \mathbb{E}_{\pi_\theta}\left[ \nabla_\theta \log \pi_\theta(a_t \mid s_t) \cdot R(\tau) \right]$$

The derivation follows from the log-derivative trick:

$$
\begin{aligned}
\nabla_\theta J(\theta) &= \nabla_\theta \sum_\tau P(\tau; \theta) R(\tau) \\
&= \sum_\tau P(\tau; \theta) \frac{\nabla_\theta P(\tau; \theta)}{P(\tau; \theta)} R(\tau) \\
&= \mathbb{E}_{\tau \sim \pi}\left[ \nabla_\theta \log P(\tau; \theta) \cdot R(\tau) \right] \\
&= \mathbb{E}_{\pi_\theta}\left[ \sum_{t=0}^T \nabla_\theta \log \pi_\theta(a_t \mid s_t) \cdot R(\tau) \right]
\end{aligned}
$$

### REINFORCE

The simplest policy gradient algorithm. Collect a full episode, compute the return, and update:

$$\nabla_\theta J(\theta) \approx \frac{1}{m} \sum_{i=1}^m \sum_{t=0}^T \nabla_\theta \log \pi_\theta\!\left(a_t^{(i)} \mid s_t^{(i)}\right) R\!\left(\tau^{(i)}\right)$$

In code (CartPole-style):

```python
class Policy(nn.Module):
    def __init__(self, s_size, a_size, h_size):
        super().__init__()
        self.fc1 = nn.Linear(s_size, h_size)
        self.fc2 = nn.Linear(h_size, a_size)

    def forward(self, x):
        x = F.relu(self.fc1(x))
        return F.softmax(self.fc2(x), dim=1)

    def act(self, state):
        state = torch.from_numpy(state).float().unsqueeze(0).to(device)
        probs = self.forward(state).cpu()
        m = Categorical(probs)
        action = m.sample()
        return action.item(), m.log_prob(action)
```

The training loop computes discounted returns, standardizes them for stability, and applies gradient ascent:

```python
returns = deque()
for t in range(len(rewards))[::-1]:
    disc_return_t = returns[0] if len(returns) > 0 else 0
    returns.appendleft(gamma * disc_return_t + rewards[t])

returns = torch.tensor(returns)
returns = (returns - returns.mean()) / (returns.std() + 1e-8)

policy_loss = [-log_prob * R for log_prob, R in zip(saved_log_probs, returns)]
torch.cat(policy_loss).sum().backward()
optimizer.step()
```

## Actor-Critic and PPO

The main weakness of REINFORCE is high variance in the gradient estimate — returns from different episodes vary wildly. The **actor-critic** method addresses this by replacing the Monte Carlo return $R(\tau)$ with an online value estimate from a learned critic.

Two networks are trained jointly:

- **Actor** $\pi_\theta(s)$: the policy network
- **Critic** $q_w(s, a)$: the value estimator

The **advantage function** further reduces variance by measuring how much better an action is relative to the baseline:

$$A(s_t, a_t) = Q(s_t, a_t) - V(s_t) \approx r_t + \gamma V(s_{t+1}) - V(s_t)$$

### Proximal Policy Optimization (PPO)

PPO stabilizes training by limiting how much the policy can change in a single update. It replaces the standard policy gradient objective with a clipped surrogate:

$$J(\theta) = \hat{\mathbb{E}}_t \left[ \min\left( r_t(\theta) \hat{A}_t,\; \operatorname{clip}(r_t(\theta), 1 - \epsilon, 1 + \epsilon) \hat{A}_t \right) \right]$$

where the probability ratio is:

$$r_t(\theta) = \frac{\pi_\theta(a_t \mid s_t)}{\pi_{\theta_\text{old}}(a_t \mid s_t)}$$

The clip prevents the new policy from deviating too far from the old one, which would otherwise cause unstable large updates.

A PPO agent combines actor and critic in a single network:

```python
class Agent(nn.Module):
    def __init__(self, envs):
        super().__init__()
        obs_dim = np.array(envs.single_observation_space.shape).prod()
        self.critic = nn.Sequential(
            layer_init(nn.Linear(obs_dim, 64)), nn.Tanh(),
            layer_init(nn.Linear(64, 64)), nn.Tanh(),
            layer_init(nn.Linear(64, 1), std=1.0),
        )
        self.actor = nn.Sequential(
            layer_init(nn.Linear(obs_dim, 64)), nn.Tanh(),
            layer_init(nn.Linear(64, 64)), nn.Tanh(),
            layer_init(nn.Linear(64, envs.single_action_space.n), std=0.01),
        )

    def get_action_and_value(self, x, action=None):
        logits = self.actor(x)
        probs = Categorical(logits=logits)
        if action is None:
            action = probs.sample()
        return action, probs.log_prob(action), probs.entropy(), self.critic(x)
```

## Applying PPO to LLM Alignment

The conceptual mapping from classical RL to LLM training (RLHF) is straightforward:

| RL concept  | LLM equivalent                                               |
| ----------- | ------------------------------------------------------------ |
| Environment | The language world; each generated token extends the context |
| State $S_t$ | The full context so far (prompt + generated tokens)          |
| Agent       | The LLM: $\pi_\theta(y \mid x)$                              |
| Action      | Sampling the next token                                      |
| Reward      | A learned reward model trained on human preferences          |

The LLM policy is a product of per-token probabilities:

$$\pi_\theta(y \mid x) = \prod_{i=1}^{T} p(y_i \mid x, y_{0:i-1};\, \theta)$$

### Training the Reward Model

First, a reward model $r_\phi$ is trained on human preference pairs $(y_Y, y_N)$ — preferred and non-preferred responses to the same prompt:

$$\mathcal{L}_R(r_\phi, \mathcal{D}) = -\mathbb{E}_{(x, y_Y, y_N) \sim \mathcal{D}}\left[ \log \sigma\!\left( r_\phi(x, y_Y) - r_\phi(x, y_N) \right) \right]$$

### PPO Fine-Tuning with KL Penalty

With the reward model fixed, the LLM is fine-tuned by maximizing reward while staying close to a reference policy $\pi_\text{ref}$ (typically the SFT model) via a KL penalty:

$$\max_{\pi_\theta}\; \mathbb{E}_{x \sim \mathcal{D},\, y \sim \pi_\theta(y \mid x)} \left[ r_\phi(x, y) \right] - \beta\, \mathbb{D}_\text{KL}\!\left[ \pi_\theta(y \mid x) \,\|\, \pi_\text{ref}(y \mid x) \right]$$

The KL term prevents the model from exploiting the reward model — generating high-scoring outputs that are incoherent or degenerate.

## Direct Preference Optimization (DPO)

PPO-based RLHF is complex: it requires maintaining four models simultaneously (actor, critic, reward model, reference policy) and is notoriously unstable to train. **DPO** eliminates the reward model entirely.

The key insight is that the optimal policy under the KL-penalized objective can be expressed analytically in terms of $\pi_\text{ref}$:

$$p^*(y_1 \succ y_2 \mid x) = \frac{1}{1 + \exp\!\left( \beta \log \frac{\pi^*(y_2 \mid x)}{\pi_\text{ref}(y_2 \mid x)} - \beta \log \frac{\pi^*(y_1 \mid x)}{\pi_\text{ref}(y_1 \mid x)} \right)}$$

This means we can directly optimize the policy on preference data using a classification-style loss, without ever training a separate reward model:

$$\mathcal{L}_\text{DPO}(\pi_\theta; \pi_\text{ref}) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}} \left[ \log \sigma\!\left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_\text{ref}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_\text{ref}(y_l \mid x)} \right) \right]$$

where $y_w$ is the preferred response and $y_l$ is the less preferred one. $\pi_\text{ref}$ is frozen during training.

DPO is simpler, more stable, and has become the dominant approach for preference fine-tuning in open-source LLM pipelines.

## Summary

| Method           | Key idea                                         | Used for                        |
| ---------------- | ------------------------------------------------ | ------------------------------- |
| Q-learning / DQN | Learn $Q^*(s, a)$; act greedily                  | Discrete action spaces, game AI |
| REINFORCE        | Direct policy gradient via Monte Carlo           | Simple policy optimization      |
| Actor-Critic     | Critic reduces policy gradient variance          | Continuous control              |
| PPO              | Clipped surrogate objective for stable updates   | RLHF, robotics                  |
| DPO              | Closed-form policy optimization from preferences | LLM alignment                   |

The progression from Q-learning to DPO reflects a consistent theme: as the action space grows larger and less structured (from Atari to natural language), the methods need to become more sample-efficient and stable. DPO's elegance comes precisely from sidestepping the full RL loop for the specific case where preferences are available.
