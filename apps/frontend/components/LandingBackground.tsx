"use client";

import { useEffect, useRef } from "react";

const DOT_RADIUS = 1.5;
const DOT_SPACING = 20;
const CURSOR_RADIUS = 200;
const CELL_SIZE = CURSOR_RADIUS;
const PUSH_STRENGTH = 28;
const STIFFNESS = 0.12;
const DAMPING = 0.82;
const SETTLE_THRESHOLD_SQ = 0.04;
const TRIG_SIZE = 2048;
const DPR_CAP = 2;
const TWO_PI = Math.PI * 2;

const trigSin = new Float32Array(TRIG_SIZE);
const trigCos = new Float32Array(TRIG_SIZE);
for (let i = 0; i < TRIG_SIZE; i++) {
  const a = (i / TRIG_SIZE) * TWO_PI;
  trigSin[i] = Math.sin(a);
  trigCos[i] = Math.cos(a);
}

export default function LandingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const S = {
      ox: new Float32Array(0),
      oy: new Float32Array(0),
      cx: new Float32Array(0),
      cy: new Float32Array(0),
      vx: new Float32Array(0),
      vy: new Float32Array(0),
      active: new Uint8Array(0),
      phaseIdx: new Uint16Array(0),
      numDots: 0,
      w: 0,
      h: 0,
      mx: -9999,
      my: -9999,
      frame: 0,
      rafId: 0,
      isPaused: false,
      gridCols: 0,
      gridRows: 0,
      cellStarts: new Uint32Array(0),
      cellIndices: new Uint16Array(0),
    };

    function buildDots() {
      const step = DOT_RADIUS * 2 + DOT_SPACING;
      const cols = Math.ceil(S.w / step) + 1;
      const rows = Math.ceil(S.h / step) + 1;
      const px = (S.w - (cols - 1) * step) / 2;
      const py = (S.h - (rows - 1) * step) / 2;
      const total = cols * rows;

      S.numDots = total;
      S.ox = new Float32Array(total);
      S.oy = new Float32Array(total);
      S.cx = new Float32Array(total);
      S.cy = new Float32Array(total);
      S.vx = new Float32Array(total);
      S.vy = new Float32Array(total);
      S.active = new Uint8Array(total);
      S.phaseIdx = new Uint16Array(total);

      const ox = S.ox;
      const oy = S.oy;
      const cx = S.cx;
      const cy = S.cy;
      const phaseIdx = S.phaseIdx;

      let idx = 0;
      for (let r = 0; r < rows; r++) {
        const y = py + r * step;
        for (let c = 0; c < cols; c++) {
          const x = px + c * step;
          ox[idx] = x;
          oy[idx] = y;
          cx[idx] = x;
          cy[idx] = y;
          phaseIdx[idx] = ((Math.floor(x / 30) * 7 + Math.floor(y / 30) * 13) & 0x7FF) % TRIG_SIZE;
          idx++;
        }
      }
    }

    function buildGrid() {
      S.gridCols = Math.ceil(S.w / CELL_SIZE) + 1;
      S.gridRows = Math.ceil(S.h / CELL_SIZE) + 1;
      const cells = S.gridCols * S.gridRows;

      const ox = S.ox;
      const oy = S.oy;
      const counts = new Uint32Array(cells);
      for (let i = 0; i < S.numDots; i++) {
        const gx = Math.floor(ox[i]! / CELL_SIZE);
        const gy = Math.floor(oy[i]! / CELL_SIZE);
        counts[gy * S.gridCols + gx]!++;
      }

      S.cellStarts = new Uint32Array(cells + 1);
      let sum = 0;
      for (let i = 0; i < cells; i++) {
        S.cellStarts[i] = sum;
        sum += counts[i]!;
      }
      S.cellStarts[cells] = sum;

      const pos = new Uint32Array(cells);
      S.cellIndices = new Uint16Array(S.numDots);
      for (let i = 0; i < S.numDots; i++) {
        const gx = Math.floor(ox[i]! / CELL_SIZE);
        const gy = Math.floor(oy[i]! / CELL_SIZE);
        const ci = gy * S.gridCols + gx;
        S.cellIndices[S.cellStarts[ci]! + pos[ci]!] = i;
        pos[ci]!++;
      }
    }

    const cv = canvas;
    const cxt = ctx;
    function resize() {
      const parent = cv.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      S.w = rect.width;
      S.h = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, DPR_CAP);
      cv.width = S.w * dpr;
      cv.height = S.h * dpr;
      cxt.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
      buildGrid();
    }

    function onMouse(e: MouseEvent) {
      const rect = cv.getBoundingClientRect();
      S.mx = e.clientX - rect.left;
      S.my = e.clientY - rect.top;
      if (S.isPaused) {
        S.isPaused = false;
        S.rafId = requestAnimationFrame(tick);
      }
    }

    function onLeave() {
      S.mx = -9999;
      S.my = -9999;
    }

    const crSq = CURSOR_RADIUS * CURSOR_RADIUS;

    function tick() {
      S.frame++;
      const t = S.frame * 0.016;

      const idleAmpX = trigSin[Math.floor(t * 9.375) % TRIG_SIZE]! * 0.1;
      const idleAmpY = trigCos[Math.floor(t * 7.8125) % TRIG_SIZE]! * 0.1;
      const tIdx5 = Math.floor(t * 15.625) % TRIG_SIZE;
      const tIdx4 = Math.floor(t * 12.5) % TRIG_SIZE;

      const cursorOnCanvas = S.mx > -9990;
      let anyActive = false;

      const cx = S.cx;
      const cy = S.cy;
      const ox = S.ox;
      const oy = S.oy;
      const vx = S.vx;
      const vy = S.vy;
      const active = S.active;
      const phaseIdx = S.phaseIdx;
      const numDots = S.numDots;

      if (cursorOnCanvas) {
        const ccx = Math.floor(S.mx / CELL_SIZE);
        const ccy = Math.floor(S.my / CELL_SIZE);
        const minCX = Math.max(0, ccx - 1);
        const maxCX = Math.min(S.gridCols - 1, ccx + 1);
        const minCY = Math.max(0, ccy - 1);
        const maxCY = Math.min(S.gridRows - 1, ccy + 1);

        const cellStarts = S.cellStarts;
        const cellIndices = S.cellIndices;

        for (let gy = minCY; gy <= maxCY; gy++) {
          for (let gx = minCX; gx <= maxCX; gx++) {
            const ci = gy * S.gridCols + gx;
            const end = cellStarts[ci + 1]!;
            for (let j = cellStarts[ci]!; j < end; j++) {
              const di = cellIndices[j]!;
              const dx = S.mx - cx[di]!;
              const dy = S.my - cy[di]!;
              const distSq = dx * dx + dy * dy;

              if (distSq < crSq) {
                const dist = Math.sqrt(distSq);
                const force = 1 - dist / CURSOR_RADIUS;
                const push = force * force * PUSH_STRENGTH;
                const ttx = ox[di]! - (dx / dist) * push;
                const tty = oy[di]! - (dy / dist) * push;

                vx[di]! += (ttx - cx[di]!) * STIFFNESS;
                vy[di]! += (tty - cy[di]!) * STIFFNESS;
                vx[di]! *= DAMPING;
                vy[di]! *= DAMPING;
                cx[di]! += vx[di]!;
                cy[di]! += vy[di]!;
                active[di] = 1;
                anyActive = true;
              }
            }
          }
        }
      }

      for (let i = 0; i < numDots; i++) {
        if (active[i]!) {
          const sidx = (phaseIdx[i]! + tIdx5) % TRIG_SIZE;
          const cidx = (phaseIdx[i]! + tIdx4) % TRIG_SIZE;
          const ttx = ox[i]! + trigSin[sidx]! * idleAmpX;
          const tty = oy[i]! + trigCos[cidx]! * idleAmpY;

          vx[i]! += (ttx - cx[i]!) * STIFFNESS;
          vy[i]! += (tty - cy[i]!) * STIFFNESS;
          vx[i]! *= DAMPING;
          vy[i]! *= DAMPING;
          cx[i]! += vx[i]!;
          cy[i]! += vy[i]!;

          const dx = cx[i]! - ttx;
          const dy = cy[i]! - tty;
          if (dx * dx + dy * dy < SETTLE_THRESHOLD_SQ) {
            active[i] = 0;
          } else {
            anyActive = true;
          }
        } else {
          const sidx = (phaseIdx[i]! + tIdx5) % TRIG_SIZE;
          const cidx = (phaseIdx[i]! + tIdx4) % TRIG_SIZE;
          cx[i] = ox[i]! + trigSin[sidx]! * idleAmpX;
          cy[i] = oy[i]! + trigCos[cidx]! * idleAmpY;
          vx[i] = 0;
          vy[i] = 0;
        }
      }

      cxt.clearRect(0, 0, S.w, S.h);
      cxt.fillStyle = "rgba(181,133,255,0.7)";
      cxt.beginPath();

      for (let i = 0; i < numDots; i++) {
        cxt.moveTo(cx[i]! + DOT_RADIUS, cy[i]!);
        cxt.arc(cx[i]!, cy[i]!, DOT_RADIUS, 0, TWO_PI);
      }

      cxt.fill();

      if (!anyActive && !cursorOnCanvas) {
        S.isPaused = true;
        return;
      }

      S.rafId = requestAnimationFrame(tick);
    }

    const ro = new ResizeObserver(resize);
    const parentEl = canvas.parentElement;
    if (parentEl) ro.observe(parentEl);

    resize();

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    S.rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(S.rafId);
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
