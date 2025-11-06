"use client";

import { useEffect, useRef } from "react";

interface VoiceVisualizerProps {
  isActive: boolean;
  volume: number;
}

export function VoiceVisualizer({ isActive, volume }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const barsRef = useRef<number[]>(Array(12).fill(0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    const barCount = 12;
    const barWidth = 4;
    const barGap = 8;
    const totalWidth = barCount * barWidth + (barCount - 1) * barGap;

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const startX = centerX - totalWidth / 2;

      // Update bars based on activity and volume
      barsRef.current = barsRef.current.map((currentHeight, i) => {
        if (isActive) {
          // Create wave effect with volume
          const targetHeight = Math.sin(Date.now() / 200 + i * 0.5) * 20 * (0.5 + volume * 2);
          const minHeight = 4;
          const maxHeight = 60;
          const clampedTarget = Math.max(minHeight, Math.min(maxHeight, Math.abs(targetHeight)));
          
          // Smooth transition
          return currentHeight + (clampedTarget - currentHeight) * 0.15;
        } else {
          // Idle state - gentle breathing
          const idleHeight = 8 + Math.sin(Date.now() / 1000 + i * 0.3) * 4;
          return currentHeight + (idleHeight - currentHeight) * 0.05;
        }
      });

      // Draw bars
      barsRef.current.forEach((height, i) => {
        const x = startX + i * (barWidth + barGap);
        const y = centerY - height / 2;

        // Color based on state
        const isDark = document.documentElement.classList.contains("dark");
        let color: string;
        
        if (isActive) {
          color = isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)";
        } else {
          color = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)";
        }

        ctx.fillStyle = color;
        ctx.roundRect(x, y, barWidth, height, barWidth / 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("resize", updateSize);
    };
  }, [isActive, volume]);

  return (
    <div className="flex items-center justify-center min-h-[120px]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: "400px", height: "120px" }}
      />
    </div>
  );
}
