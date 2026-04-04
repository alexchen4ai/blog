---
layout: book-review
title: "Robotic Manipulation: Perception, Planning, and Control"
author: Russ Tedrake
categories: robotics engineering ai
tags: recommended
buy_link: https://manipulation.csail.mit.edu/
date: 2026-03-01
released: 2020
stars: 5
status: Reading
---

Russ Tedrake's MIT course notes on robotic manipulation are among the best technical resources I have found on the subject. The book covers the full stack — robot hardware and simulation, perception with depth cameras, grasp planning, and control — with a rigor that is rare in online educational material.

What makes it stand out is the integration of Drake throughout. Rather than treating simulation as an afterthought, Tedrake builds the entire curriculum around a well-engineered physics engine and block-diagram modeling framework. The discussion of `MultibodyPlant`, `HardwareStation`, and the `HardwareStationInterface` abstraction is particularly valuable — it is one of the clearest explanations I have seen of how to bridge simulation and real hardware in a principled way.

The chapter on robot hardware alone is worth the read. The treatment of position-controlled vs. torque-controlled arms, reflected inertia, and why PID gains are often tunable per-joint despite highly coupled dynamics gives you the intuition that most robotics textbooks skip over.

Available free online at [manipulation.csail.mit.edu](https://manipulation.csail.mit.edu/).
