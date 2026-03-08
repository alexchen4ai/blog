'use client'

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// ──────────────────────────────────────────────
// Geometric Network Background (v2 — clean, no ink splatters)
// - Floating nodes with organic sine-wave drift
// - Connection lines form a constellation pattern
// - Mouse interaction: nodes attract toward cursor
// ──────────────────────────────────────────────

interface NetworkNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  alpha: number;
  phaseX: number;
  phaseY: number;
  freqX: number;
  freqY: number;
  ampX: number;
  ampY: number;
}

const ParticleBackground = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<NetworkNode[]>([]);
  const animFrameRef = useRef<number>(0);
  const dimensionsRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);

  // Initialize nodes spread across full canvas
  const initNodes = useCallback((w: number, h: number) => {
    const nodes: NetworkNode[] = [];
    const count = Math.max(60, Math.min(140, Math.floor(w * h * 0.0001)));

    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;

      nodes.push({
        x, y,
        baseX: x,
        baseY: y,
        radius: Math.random() * 2 + 0.8,
        alpha: Math.random() * 0.35 + 0.1,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        freqX: 0.15 + Math.random() * 0.3,
        freqY: 0.12 + Math.random() * 0.25,
        ampX: 12 + Math.random() * 30,
        ampY: 10 + Math.random() * 25,
      });
    }
    return nodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeHandler = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      dimensionsRef.current = { w: rect.width, h: rect.height };
      nodesRef.current = initNodes(rect.width, rect.height);
      timeRef.current = 0;
    };

    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    const MOUSE_RADIUS = 200;
    const CONNECT_DIST = 150;

    const animate = () => {
      const { w, h } = dimensionsRef.current;
      ctx.clearRect(0, 0, w, h);
      const mouse = mouseRef.current;
      timeRef.current += 0.016;
      const t = timeRef.current;

      const nodes = nodesRef.current;

      // ── Update node positions ──
      for (const node of nodes) {
        // Organic sine-wave wandering (two layers for irregularity)
        const wanderX = Math.sin(t * node.freqX + node.phaseX) * node.ampX
                       + Math.sin(t * node.freqX * 0.5 + node.phaseY * 1.5) * node.ampX * 0.4;
        const wanderY = Math.cos(t * node.freqY + node.phaseY) * node.ampY
                       + Math.cos(t * node.freqY * 0.7 + node.phaseX * 1.2) * node.ampY * 0.3;

        const targetX = node.baseX + wanderX;
        const targetY = node.baseY + wanderY;

        // Smooth interpolation toward wander target
        node.x += (targetX - node.x) * 0.03;
        node.y += (targetY - node.y) * 0.03;

        // Mouse attract
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 1.8;
          node.x += (dx / dist) * force;
          node.y += (dy / dist) * force;
        }
      }

      // ── Draw connection lines ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const opacity = (1 - dist / CONNECT_DIST) * 0.2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200, 200, 200, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // ── Draw mouse connections ──
      for (const node of nodes) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const opacity = (1 - dist / MOUSE_RADIUS) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(180, 180, 180, ${opacity})`;
          ctx.lineWidth = 0.4;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      // ── Draw nodes ──
      for (const node of nodes) {
        // Outer circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 200, ${node.alpha})`;
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 240, 240, ${node.alpha * 1.8})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resizeHandler);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [initNodes]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={className || "absolute inset-0 w-full h-full"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ pointerEvents: "auto" }}
    />
  );
};

export default ParticleBackground;
