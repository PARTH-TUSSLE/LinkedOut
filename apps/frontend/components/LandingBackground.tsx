"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { useEffect, useRef } from "react";

interface Dot {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const TWO_PI = Math.PI * 2;
const DOT_RADIUS = 1.5;
const DOT_SPACING = 20;
const CURSOR_RADIUS = 200;
const PUSH_STRENGTH = 28;
const STIFFNESS = 0.08;
const DAMPING = 0.72;
const DOT_COLOR = "rgba(181,133,255,0.7)";

const DARK_BG: [number, number, number] = [16, 14, 24];
const LIGHT_BG: [number, number, number] = [255, 255, 255];

export default function LandingBackground() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const cvs = canvas;
    const c = ctx;

    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let mx = -9999;
    let my = -9999;
    let raf = 0;
    const crSq = CURSOR_RADIUS * CURSOR_RADIUS;
    const bg: [number, number, number] = [...DARK_BG];

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const parent = cvs.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;

      cvs.width = w * dpr;
      cvs.height = h * dpr;
      cvs.style.width = `${w}px`;
      cvs.style.height = `${h}px`;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);

      build();
    }

    function build() {
      const step = DOT_RADIUS * 2 + DOT_SPACING;
      const cols = Math.ceil(w / step) + 1;
      const rows = Math.ceil(h / step) + 1;
      const px = (w - (cols - 1) * step) / 2;
      const py = (h - (rows - 1) * step) / 2;
      const list: Dot[] = [];

      for (let r = 0; r < rows; r++) {
        const y = py + r * step;
        for (let c2 = 0; c2 < cols; c2++) {
          const x = px + c2 * step;
          list.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
        }
      }

      dots = list;
    }

    function onMouse(e: MouseEvent) {
      const rect = cvs.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }

    function onLeave() {
      mx = -9999;
      my = -9999;
    }

    function tick() {
      const t = performance.now() / 1000;
      const idleX = Math.sin(t * 0.3) * 0.1;
      const idleY = Math.cos(t * 0.25) * 0.1;

      const target = themeRef.current === "dark" ? DARK_BG : LIGHT_BG;
      bg[0] += (target[0] - bg[0]) * 0.03;
      bg[1] += (target[1] - bg[1]) * 0.03;
      bg[2] += (target[2] - bg[2]) * 0.03;

      c.clearRect(0, 0, w, h);
      c.fillStyle = `rgb(${bg[0] | 0},${bg[1] | 0},${bg[2] | 0})`;
      c.fillRect(0, 0, w, h);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]!;

        let tx = d.ox;
        let ty = d.oy;
        tx += Math.sin(d.oy * 0.02 + t * 0.5) * idleX;
        ty += Math.cos(d.ox * 0.02 + t * 0.4) * idleY;

        const dx = mx - d.ox;
        const dy = my - d.oy;
        const distSq = dx * dx + dy * dy;

        if (distSq < crSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = 1 - dist / CURSOR_RADIUS;
          const falloff = force * force;
          const push = falloff * PUSH_STRENGTH;
          tx -= (dx / dist) * push;
          ty -= (dy / dist) * push;
        }

        d.vx += (tx - d.x) * STIFFNESS;
        d.vy += (ty - d.y) * STIFFNESS;
        d.vx *= DAMPING;
        d.vy *= DAMPING;
        d.x += d.vx;
        d.y += d.vy;
      }

      c.fillStyle = DOT_COLOR;
      c.beginPath();

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]!;
        c.moveTo(d.x + DOT_RADIUS, d.y);
        c.arc(d.x, d.y, DOT_RADIUS, 0, TWO_PI);
      }

      c.fill();

      raf = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(resize);
    const parent = cvs.parentElement;
    if (parent) ro.observe(parent);

    resize();

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none", zIndex: 0 }}
    />
  );
}
