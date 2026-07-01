"use client";

/*
  NeuralBackground

  A lightweight animated <canvas> that draws drifting "neuron" nodes with
  connecting lines (a constellation / neural-net feel) behind the hero.
  - Uses the brand colors (green #22c55e / orange #f97316).
  - Respects prefers-reduced-motion: renders a single static frame instead
    of animating.
  - Cleans up its requestAnimationFrame + resize listener on unmount.
*/

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

const NODE_COUNT = 42;
const MAX_LINK_DISTANCE = 130;
const COLORS = ["34, 197, 94", "249, 115, 22"]; // primary green, accent orange (rgb)

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let animationId = 0;

    const seedNodes = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length === 0) seedNodes();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Connecting lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_LINK_DISTANCE) {
            const opacity = (1 - dist / MAX_LINK_DISTANCE) * 0.35;
            ctx.strokeStyle = `rgba(${a.color}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const node of nodes) {
        ctx.fillStyle = `rgba(${node.color}, 0.9)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      }
      draw();
      animationId = requestAnimationFrame(step);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reducedMotion) {
      draw(); // one static frame
    } else {
      step();
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
