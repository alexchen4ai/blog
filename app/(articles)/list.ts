import mdLargeLanguageModel from "./md/blog/largeLanguageModel.md";
import mdLlmEval from "./md/blog/llmEval.md";
import mdLanguageModel from "./md/blog/languageModel.md";
import mdOnDeviceAI from "./md/thinking/onDeviceAI.md";


export interface IArticleInfo {
    id: string;
    title: string;
    description: string;
    content: string;
    createdAt: string;
    cover?: string;
    group: string;
    tag: string;
}



export const articleList: IArticleInfo[] = [
    {
        id: "2",
        title: "Optimization for Inference of Large Language Model",
        description: "To run the language model faster and especially on the edge devices, we need to optimize the model. This…",
        content: mdLargeLanguageModel,
        createdAt: "2026-02-11",
        group: "Blog",
        tag: "Math Theories",
    },
    {
        id: "3",
        title: "Evaluation of Large Language Models",
        description: "Today, the landscape of large language models (LLMs) is rich with diverse evaluation benchmarks. In this blog post, we'll explore the various benchmarks…",
        content: mdLlmEval,
        createdAt: "2026-02-11",
        group: "Blog",
        tag: "Large Language Models",
    },
    {
        id: "4",
        title: "Why On-Device AI Matters",
        description: "On-device AI is one of the most important directions in the field. Here is why privacy, latency, hardware, and cost all point toward intelligence that lives with you.",
        content: mdOnDeviceAI,
        createdAt: "2026-03-07",
        group: "Thinking",
        tag: "On-Device AI",
    },
    {
        id: "5",
        title: "Reinforcement Learning for Large Language Model",
        description: "Reinforcement learning is a common technique applied to the large language model area. This article covers RL fundamentals, value-based and policy-based methods, PPO, and DPO for LLM training.",
        content: mdLanguageModel,
        createdAt: "2026-02-14",
        group: "Blog",
        tag: "Large Language Models",
    },
];
