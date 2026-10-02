"use client";

import * as React from "react";
import {
  LazyMotion,
  m,
  useInView,
  useReducedMotion,
  animate,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const loadFeatures = () => import("motion/react").then((mod) => mod.domAnimation);

/**
 * Loads the animation feature bundle lazily (~15kb) instead of shipping the full
 * motion runtime with the initial page JavaScript.
 */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      data-reveal
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </m.div>
  );
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export function Stagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-70px" }}
      variants={container}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div data-reveal className={className} variants={reduce ? undefined : item}>
      {children}
    </m.div>
  );
}

/**
 * Counts up to `to` when scrolled into view. Writes to the DOM node directly
 * instead of React state so it never triggers a re-render per frame.
 */
export function Counter({
  to,
  from = 0,
  duration = 1.6,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  const format = React.useCallback(
    (value: number) =>
      `${prefix}${value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`,
    [decimals, prefix, suffix],
  );

  React.useEffect(() => {
    const node = ref.current;
    if (!node || !inView) return;
    if (reduce) {
      node.textContent = format(to);
      return;
    }
    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate: (value) => {
        node.textContent = format(value);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, from, to, duration, format]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(from)}
    </span>
  );
}

/** Subtle floating motion for hero mock-ups — transform only, GPU friendly. */
export function Float({
  children,
  className,
  amplitude = 8,
  duration = 6,
}: {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <m.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </m.div>
  );
}
