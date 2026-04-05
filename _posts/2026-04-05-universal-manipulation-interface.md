---
layout: post
title: "Universal Manipulation Interface: In-The-Wild Robot Teaching Without In-The-Wild Robots"
date: 2026-04-05
description: A reading note on Chi et al., 2024 — how a handheld gripper with a fisheye camera and mirrors enables hardware-agnostic demonstration collection anywhere, and what retargeting steps bridge the gap to a real robot.
tags: robotics imitation-learning manipulation
categories: ml
related_posts: false
toc:
  beginning: true
---

_A short reading note on "Universal Manipulation Interface: In-The-Wild Robot Teaching Without In-The-Wild Robots" (Chi et al., 2024)_

Collecting robot demonstrations at scale requires either expensive teleoperation rigs or time on real hardware. UMI sidesteps both constraints with a **handheld data collection interface**: a carefully designed gripper that a human operator holds directly. Demonstrations captured this way are hardware-agnostic and can be collected anywhere, then deployed onto a target robot through a structured retargeting pipeline.

## Hardware Design: Gripper, GoPro, and Mirrors

The device consists of a 3D-printed parallel gripper instrumented with:

- A **GoPro fisheye camera** mounted at the wrist, providing a wide field of view that captures the workspace and the object being manipulated.
- **Two flat mirrors angled on each side** of the gripper, reflecting the scene from slightly offset viewpoints into the same camera frame.

The mirrors are the most elegant detail. Because a single fisheye frame now encodes two laterally shifted views of the scene — each occupying a different region of the image — the policy can implicitly recover **depth from stereo disparity** without any additional sensors or calibration hardware. The GoPro records everything in a single stream; the stereo structure is baked into the optics.

## Relative Action Representation

The critical design choice in UMI is what gets recorded. Rather than logging absolute end-effector poses in a world frame, UMI records **relative end-effector displacements** — the change in 6-DoF gripper pose between consecutive timesteps:

$$a_t = \Delta T_t = T_{t}^{-1} T_{t+1} \in SE(3)$$

This has an important consequence: **the robot arm's configuration is entirely absent from both observations and actions.** The policy sees wrist-camera images and outputs relative gripper motions — nothing about the joint angles, link lengths, or kinematics of whatever arm is holding the gripper.

The flip side is that UMI cannot be fully end-to-end. Because the policy emits Cartesian relative targets rather than joint commands, a **model-based controller** on the target robot must solve inverse kinematics and track those targets. The neural network handles perception and high-level motion; the arm's own controller handles the rest.

## Retargeting to a Target Robot

Raw demonstrations are not directly deployable. Two preprocessing steps adapt the data to a specific robot:

**1. Latency alignment.** Every real robot has a response delay between receiving a command and executing it. If the recorded action sequence is played back without compensation, the effective timing is shifted and the policy sees stale observations. UMI estimates the target robot's end-to-end latency $\tau$ and shifts the action labels accordingly:

$$a_t^{\text{aligned}} = a_{t + \tau}$$

This ensures that the observation-action pairs in training reflect what the robot will actually experience at inference time.

**2. Kinematic filtering.** Not every human demonstration is reachable by the target robot. Joint limits, workspace boundaries, and velocity/acceleration caps all constrain what motions are physically executable. Demonstrations that require the target robot to move through configurations outside its feasible set are discarded. This step is necessarily robot-specific: the same human motion may be valid for one arm and infeasible for another.

## Policy and Results

UMI uses **Diffusion Policy** as the learning backbone, conditioned on the wrist-camera image stream. Across tasks like cup arrangement, dynamic tossing, and bimanual cloth folding — all with in-the-wild demonstrations collected in homes and outdoor environments — UMI achieves strong transfer to a stationary robot arm with no robot-specific data collection. The interface enables non-expert users to collect usable demonstrations in minutes.
