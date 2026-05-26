"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: string;
  delay: string;
  opacity: number;
  color: string;
}

export default function ParticleField({ count = 18, className }: ParticleFieldProps) {
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: `${Math.random() * 8 + 10}s`,
      delay: `${Math.random() * 10}s`,
      opacity: Math.random() * 0.5 + 0.2,
      color: i % 3 === 0 ? "var(--color-accent)" : i % 3 === 1 ? "var(--color-electric)" : "rgba(255,255,255,0.6)",
    }));
  }, [count]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}
