'use client'

import { motion, type Variants } from "framer-motion";
import React, { useState, useEffect, useCallback, useRef } from "react";

// ──────────────────────────────────────────────
// Shared easing & duration tokens
// ──────────────────────────────────────────────
const ease = [0.25, 0.1, 0.25, 1] as const; // cubic-bezier for natural feel
const duration = 0.6;

// ──────────────────────────────────────────────
// FadeIn — fade + slide on scroll into view
// ──────────────────────────────────────────────
interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  once?: boolean;
}

const directionOffset = (dir: FadeInProps["direction"], distance: number) => {
  switch (dir) {
    case "up": return { y: distance };
    case "down": return { y: -distance };
    case "left": return { x: distance };
    case "right": return { x: -distance };
    default: return { y: distance };
  }
};

export const FadeIn = ({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 30,
  duration: dur = duration,
  once = true,
}: FadeInProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, ...directionOffset(direction, distance) }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once, margin: "-60px" }}
    transition={{ duration: dur, delay, ease }}
  >
    {children}
  </motion.div>
);

// ──────────────────────────────────────────────
// StaggerContainer + StaggerItem
// ──────────────────────────────────────────────
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

const containerVariants: Variants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: { staggerChildren: staggerDelay },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

export const StaggerContainer = ({
  children,
  className,
  staggerDelay = 0.12,
  once = true,
}: StaggerContainerProps) => (
  <motion.div
    className={className}
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once, margin: "-60px" }}
    custom={staggerDelay}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div className={className} variants={itemVariants}>
    {children}
  </motion.div>
);

// ──────────────────────────────────────────────
// ScaleOnHover — subtle scale + lift on hover
// ──────────────────────────────────────────────
export const ScaleOnHover = ({
  children,
  className,
  scale = 1.02,
}: {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}) => (
  <motion.div
    className={className}
    whileHover={{ scale, y: -4, transition: { duration: 0.3, ease } }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </motion.div>
);

// ──────────────────────────────────────────────
// SlideIn — horizontal slide entrance
// ──────────────────────────────────────────────
export const SlideIn = ({
  children,
  className,
  from = "right",
  delay = 0,
  distance = 60,
}: {
  children: React.ReactNode;
  className?: string;
  from?: "left" | "right";
  delay?: number;
  distance?: number;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, x: from === "right" ? distance : -distance }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease }}
  >
    {children}
  </motion.div>
);

// ──────────────────────────────────────────────
// AnimatedDivider — grows from left
// ──────────────────────────────────────────────
export const AnimatedDivider = ({ className }: { className?: string }) => (
  <motion.div
    className={className || "h-[1px] bg-[#E6E4D9]"}
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ duration: 0.8, ease }}
    style={{ transformOrigin: "left" }}
  />
);

// ──────────────────────────────────────────────
// IconBounce — spring hover for icons
// ──────────────────────────────────────────────
export const IconBounce = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    className={className}
    whileHover={{
      scale: 1.2,
      rotate: 5,
      transition: { type: "spring", stiffness: 400, damping: 15 },
    }}
    whileTap={{ scale: 0.9 }}
  >
    {children}
  </motion.div>
);

// ──────────────────────────────────────────────
// TextReveal — blur-in text reveal
// ──────────────────────────────────────────────
export const TextReveal = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.7, delay, ease }}
  >
    {children}
  </motion.div>
);

// ──────────────────────────────────────────────
// Typewriter — character-by-character typing with blinking cursor
// Supports sequential chaining via onComplete callback
// ──────────────────────────────────────────────
interface TypewriterProps {
  text: string;
  className?: string;
  speed?: number;        // ms per character
  delay?: number;        // ms before typing starts
  cursor?: boolean;      // show blinking cursor
  onComplete?: () => void;
}

export const Typewriter = ({
  text,
  className,
  speed = 30,
  delay = 0,
  cursor = true,
  onComplete,
}: TypewriterProps) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete; // keep ref fresh without re-triggering effect

  // Start after delay
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Type characters one by one (only re-run when text/speed/started change, NOT onComplete)
  useEffect(() => {
    if (!started) return;
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
        onCompleteRef.current?.();
      } else {
        setDisplayed(text.slice(0, indexRef.current));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <span className={className}>
      {displayed}
      {cursor && !done && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-[#D25F3D] ml-[2px] align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      )}
      {cursor && done && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-[#D25F3D] ml-[2px] align-middle"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
      )}
    </span>
  );
};

// ──────────────────────────────────────────────
// TypewriterSequence — plays multiple paragraphs in order
// Each paragraph starts typing after the previous one finishes
// ──────────────────────────────────────────────
interface TypewriterSequenceProps {
  paragraphs: { text: string; className?: string }[];
  speed?: number;
  initialDelay?: number;
  gap?: number; // ms gap between paragraphs
  onAllComplete?: () => void;
}

export const TypewriterSequence = ({
  paragraphs,
  speed = 25,
  initialDelay = 300,
  gap = 200,
  onAllComplete,
}: TypewriterSequenceProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());
  const onAllCompleteRef = useRef(onAllComplete);
  onAllCompleteRef.current = onAllComplete;
  const totalRef = useRef(paragraphs.length);
  totalRef.current = paragraphs.length;
  const gapRef = useRef(gap);
  gapRef.current = gap;

  // Stable callback per paragraph index
  const handleComplete = useCallback((i: number) => {
    setCompletedSet((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
    if (i < totalRef.current - 1) {
      setTimeout(() => setActiveIndex(i + 1), gapRef.current);
    } else {
      setTimeout(() => onAllCompleteRef.current?.(), gapRef.current);
    }
  }, []);

  return (
    <>
      {paragraphs.map((p, i) => {
        const isCompleted = completedSet.has(i);
        const isActive = i === activeIndex && !isCompleted;
        return (
          <div key={i} className={`relative ${p.className || ""}`}>
            {/* Invisible full text always present — reserves exact height */}
            <span className="invisible" aria-hidden="true">{p.text}</span>
            {/* Visible layer */}
            <span className="absolute inset-0">
              {isCompleted ? (
                p.text
              ) : isActive ? (
                <Typewriter
                  text={p.text}
                  speed={speed}
                  delay={i === 0 ? initialDelay : 0}
                  cursor
                  onComplete={() => handleComplete(i)}
                />
              ) : null}
            </span>
          </div>
        );
      })}
    </>
  );
};
