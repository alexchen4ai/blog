---
layout: about
title: about
permalink: /
subtitle: >
  Founder, CEO & Chief Scientist of <a href="https://nexa.ai" target="_blank">Nexa AI</a> (acquired by Qualcomm); Director, <a href="https://www.qualcomm.com" target="_blank">Qualcomm</a>. Santa Clara, CA.

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false
  more_info: >
    <p>Santa Clara, CA</p>
    <p><a href="mailto:alexchen4ai@gmail.com">alexchen4ai@gmail.com</a></p>

selected_papers: true
social: true

announcements:
  enabled: true
  scrollable: false

latest_posts:
  enabled: true
  scrollable: true
  limit: 3
---

<link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap" rel="stylesheet">

I am **Alex (Wei) Chen** <span style="font-family: 'Ma Shan Zheng', cursive; font-size: 1.15em; color: var(--global-theme-color);">陈伟</span>, a Director at [Qualcomm](https://www.qualcomm.com). Before joining Qualcomm through its acquisition of [Nexa AI](https://nexa.ai), I founded Nexa and served as its **Founder, CEO, and Chief Scientist**, with the goal of making generative AI more efficient and accessible on everyday hardware.

At Nexa, our team built the [NexaSDK](https://github.com/NexaAI/nexa-sdk) — an open-source toolkit for running AI models on edge devices that has been widely adopted by the developer community. I was the main technical author behind much of this work, including the **Octopus** model series, **OmniVLM**, **OmniAudio**, and **NexaQuant**. Along the way, we worked closely with engineering teams at [NVIDIA](https://blogs.nvidia.com/blog/rtx-ai-garage-nexa-hyperlink-local-agent/), [AMD](https://www.amd.com/en/developer/resources/technical-articles/2025/advancing-ai-with-nexa-ai--image-generation-on-amd-npu-with-sdxl.html), [Microsoft](https://blogs.windows.com/windowsexperience/2025/11/18/ignite-2025-windows-at-the-frontier-of-work/), [Google](https://developers.googleblog.com/en/gemma-family-and-toolkit-expansion-io-2024/), [IBM](https://www.ibm.com/new/announcements/ibm-granite-4-0-hyper-efficient-high-performance-hybrid-models), and [Intel](https://www.linkedin.com/posts/intel-software_ai-ondeviceai-nexasdk-activity-7376337062087667712-xw7i), and deployed with enterprise partners like Geely, HP, Lenovo, and İşbank.

My interests sit at the intersection of **AI systems**, **LLM/VLM inference**, **hardware-software co-design**, and **robotics**. I'm especially drawn to the question of how we build intelligence that can act in the physical world. I hold a PhD from **Stanford University** (2024) and a Bachelor's from **Tongji University** (2019).

<style>
  .alan-section {
    margin: 2.5rem 0;
  }
  .alan-section h2 {
    margin-bottom: 1.25rem;
    color: var(--global-theme-color);
    font-size: 0.9rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .alan-kicker {
    margin: 1.6rem 0 0.35rem;
    color: var(--global-text-color-light);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .alan-work {
    display: block;
    padding: 1rem 0;
    border-bottom: 1px solid var(--global-divider-color);
  }
  .alan-work:last-child {
    border-bottom: 0;
  }
  .alan-work h3 {
    margin: 0;
    font-size: 1.05rem;
  }
  .alan-work .type {
    margin: 0.15rem 0 0.45rem;
    color: var(--global-text-color-light);
    font-size: 0.85rem;
  }
  .alan-row {
    display: grid;
    grid-template-columns: minmax(150px, 210px) 1fr;
    gap: 1.5rem;
    padding: 0.9rem 0;
    border-bottom: 1px solid var(--global-divider-color);
  }
  .alan-row:last-child {
    border-bottom: 0;
  }
  .alan-brand {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    color: var(--global-text-color);
    font-weight: 700;
  }
  .alan-logo {
    display: inline-block;
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    background: var(--global-text-color);
    opacity: 0.8;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: contain;
    mask-size: contain;
  }
  .alan-row p,
  .alan-work p {
    margin: 0;
  }
  .alan-talks {
    margin: 0;
    padding-left: 1.1rem;
  }
  .alan-talks li {
    margin: 0.45rem 0;
  }
  @media (max-width: 575px) {
    .alan-row {
      grid-template-columns: 1fr;
      gap: 0.45rem;
    }
  }
</style>

<section class="alan-section">
  <h2>Selected Work</h2>
  <div class="alan-work">
    <h3>NexaSDK</h3>
    <p class="type">Runtime</p>
    <p>A GenAI inference runtime that runs models on NPU — <a href="https://github.com/NexaAI/nexa-sdk">8,000+ GitHub stars</a> and #1 on GitHub Trending.</p>
  </div>
  <div class="alan-work">
    <h3>Hyperlink</h3>
    <p class="type">Application</p>
    <p>
      A local AI agent that lives inside your computer — it searches across all your files, fully private. 2.1M views and 30K users in two months, featured by
      <a href="https://blogs.nvidia.com/blog/rtx-ai-garage-nexa-hyperlink-local-agent/">NVIDIA</a>,
      <a href="https://blogs.windows.com/windowsexperience/2025/11/18/ignite-2025-windows-at-the-frontier-of-work/">Microsoft</a>,
      <a href="https://www.qualcomm.com/developer/blog/2026/03/run-nexa-ai-agents-locally-on-snapdragon-pc-with-hexagon-npu">Qualcomm</a>,
      and AMD.
    </p>
  </div>
  <div class="alan-work">
    <h3>Octopus</h3>
    <p class="type">Model</p>
    <p>
      The world's first AI agent model built to run directly on hardware — function calling across PCs, phones, wearables, automotive, and robots — part of a model line that trended
      <a href="https://x.com/Thom_Wolf/status/1864227910099366327">top-3 on Hugging Face</a>,
      featured by <a href="https://developers.googleblog.com/en/gemma-family-and-toolkit-expansion-io-2024/">Google I/O</a>
      and the <a href="https://deepmind.google/models/gemma/gemmaverse/omniaudio/">Google DeepMind blog</a>.
    </p>
  </div>
</section>

<section class="alan-section">
  <h2>Recognition</h2>
  <div class="alan-kicker">Silicon</div>
  <div class="alan-row">
    <div class="alan-brand">
      <span class="alan-logo" role="img" aria-label="Qualcomm logo" style="-webkit-mask-image: url('/assets/img/logos/qualcomm.svg'); mask-image: url('/assets/img/logos/qualcomm.svg');"></span>
      <span>Qualcomm</span>
    </div>
    <p>
      Shipped our work across
      <a href="https://www.qualcomm.com/developer/blog/2025/11/nexa-ai-for-android-simple-way-to-bring-on-device-ai-to-smartphones-with-snapdragon">Snapdragon for Android</a>,
      the <a href="https://www.qualcomm.com/developer/blog/2025/09/omnineural-4b-nexaml-qualcomm-hexagon-npu">Hexagon NPU</a>,
      <a href="https://www.qualcomm.com/developer/blog/2025/10/granite-4-0-to-the-edge-on-device-ai-for-real-world-performance">Granite 4.0 at the edge</a>,
      and <a href="https://www.qualcomm.com/developer/blog/2026/03/qualcomm-nexa-ai-docker-bring-ai-to-iot-robotics-with-nexasdk-linux">IoT &amp; robotics</a> — and featured us seven times in “This Week in AI.”
    </p>
  </div>
  <div class="alan-row">
    <div class="alan-brand">
      <span class="alan-logo" role="img" aria-label="NVIDIA logo" style="-webkit-mask-image: url('/assets/img/logos/nvidia.svg'); mask-image: url('/assets/img/logos/nvidia.svg');"></span>
      <span>NVIDIA</span>
    </div>
    <p>
      Co-launched our
      <a href="https://blogs.nvidia.com/blog/rtx-ai-garage-nexa-hyperlink-local-agent/">local AI agent on RTX</a>,
      featured us at their
      <a href="https://blogs.nvidia.com/blog/rtx-ai-garage-ces-2026-open-models-video-generation/">CES 2026 booth</a>
      as a highlighted startup, and published a
      <a href="https://www.youtube.com/watch?v=dtSIKDm-8CM">1.3M-view feature on YouTube</a>.
    </p>
  </div>
  <div class="alan-row">
    <div class="alan-brand">
      <span class="alan-logo" role="img" aria-label="AMD logo" style="-webkit-mask-image: url('/assets/img/logos/amd.svg'); mask-image: url('/assets/img/logos/amd.svg');"></span>
      <span>AMD</span>
    </div>
    <p>
      Made us a partner for
      <a href="https://www.amd.com/en/corporate/events/ces/partner-quotes-2026.html">CES 2026</a>,
      and published our work on
      <a href="https://www.amd.com/en/developer/resources/technical-articles/2025/advancing-ai-with-nexa-ai--image-generation-on-amd-npu-with-sdxl.html">image generation on its NPU</a>
      and <a href="https://www.amd.com/en/blogs/2025/speed-up-deepseek-r1-distill-4-bit-performance-and.html">DeepSeek R1 speedups</a>.
    </p>
  </div>
  <div class="alan-row">
    <div class="alan-brand">
      <span class="alan-logo" role="img" aria-label="Intel logo" style="-webkit-mask-image: url('/assets/img/logos/intel.svg'); mask-image: url('/assets/img/logos/intel.svg');"></span>
      <span>Intel</span>
    </div>
    <p>Featured us on its <a href="https://www.linkedin.com/posts/intel-software_ai-ondeviceai-nexasdk-activity-7376337062087667712-xw7i">developer channel</a>.</p>
  </div>

  <div class="alan-kicker">Models</div>
  <div class="alan-row">
    <div class="alan-brand">
      <span class="alan-logo" role="img" aria-label="Google DeepMind logo" style="-webkit-mask-image: url('/assets/img/logos/google.svg'); mask-image: url('/assets/img/logos/google.svg');"></span>
      <span>Google DeepMind</span>
    </div>
    <p>
      Featured OmniAudio in the
      <a href="https://deepmind.google/models/gemma/gemmaverse/omniaudio/">Gemmaverse</a>
      and our work at
      <a href="https://developers.googleblog.com/en/gemma-family-and-toolkit-expansion-io-2024/">Google I/O 2024</a>.
    </p>
  </div>
  <div class="alan-row">
    <div class="alan-brand">
      <span class="alan-logo" role="img" aria-label="IBM logo" style="-webkit-mask-image: url('/assets/img/logos/ibm.svg'); mask-image: url('/assets/img/logos/ibm.svg');"></span>
      <span>IBM</span>
    </div>
    <p>
      Named NexaML a
      <a href="https://www.ibm.com/new/announcements/ibm-granite-4-0-hyper-efficient-high-performance-hybrid-models">supported framework for Granite 4.0</a>,
      alongside vLLM, llama.cpp, and MLX.
    </p>
  </div>
  <div class="alan-row">
    <div class="alan-brand">
      <span class="alan-logo" role="img" aria-label="Alibaba logo" style="-webkit-mask-image: url('/assets/img/logos/alibabadotcom.svg'); mask-image: url('/assets/img/logos/alibabadotcom.svg');"></span>
      <span>Alibaba / Qwen</span>
    </div>
    <p>
      Highlighted our
      <a href="https://x.com/Alibaba_Qwen/status/1978154384098754943">day-0 Qwen3-VL support</a>
      and <a href="https://x.com/Alibaba_Qwen/status/1958800193970954657">Qwen3 on Qualcomm NPU</a>.
    </p>
  </div>
  <div class="alan-row">
    <div class="alan-brand"><span>Liquid AI</span></div>
    <p>
      Partnered with us on the
      <a href="https://www.liquid.ai/blog/introducing-lfm2-5-the-next-generation-of-on-device-ai">LFM2.5 launch</a>
      and <a href="https://www.liquid.ai/blog/lfm2-5-1-2b-thinking-on-device-reasoning-under-1gb">LFM2.5 Thinking</a>.
    </p>
  </div>
  <div class="alan-row">
    <div class="alan-brand">
      <span class="alan-logo" role="img" aria-label="Hugging Face logo" style="-webkit-mask-image: url('/assets/img/logos/huggingface.svg'); mask-image: url('/assets/img/logos/huggingface.svg');"></span>
      <span>Hugging Face</span>
    </div>
    <p>
      <a href="https://x.com/Thom_Wolf/status/1864227910099366327">Thomas Wolf</a>
      ranked our models among the most-downloaded, and CEO
      <a href="https://x.com/ClementDelangue/status/1977139487097413820">Clément Delangue</a>
      put out a public collaboration call.
    </p>
  </div>
  <div class="alan-row">
    <div class="alan-brand">
      <span class="alan-logo" role="img" aria-label="OpenAI logo" style="-webkit-mask-image: url('/assets/img/logos/openai.svg'); mask-image: url('/assets/img/logos/openai.svg');"></span>
      <span>OpenAI</span>
    </div>
    <p>Featured our work via <a href="https://x.com/dkundel/status/1976769779336987069">Developer Relations</a>.</p>
  </div>

  <div class="alan-kicker">Platforms</div>
  <div class="alan-row">
    <div class="alan-brand"><span>Microsoft</span></div>
    <p>
      Put us on stage at
      <a href="https://blogs.windows.com/windowsexperience/2025/11/18/ignite-2025-windows-at-the-frontier-of-work/">Ignite 2025 keynote</a>
      as an official partner.
    </p>
  </div>
</section>

<section class="alan-section">
  <h2>Talks &amp; Appearances</h2>
  <ul class="alan-talks">
    <li><a href="https://blogs.windows.com/windowsexperience/2025/11/18/ignite-2025-windows-at-the-frontier-of-work/">Microsoft Ignite 2025</a></li>
    <li><a href="https://blogs.nvidia.com/blog/rtx-ai-garage-ces-2026-open-models-video-generation/">CES 2026 (NVIDIA &amp; AMD booths)</a></li>
    <li>Qualcomm Snapdragon Summit</li>
    <li>PyTorch Conference</li>
    <li>Web Summit</li>
    <li>IBM TechXchange</li>
    <li>Open Data Science Conference</li>
  </ul>
</section>

This blog is where I think out loud about AI, robotics, and the systems behind them. If something sparks a question or a conversation, I'd genuinely love to hear from you.
