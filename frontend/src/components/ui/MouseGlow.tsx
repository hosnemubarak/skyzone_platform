"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MouseGlowProps {
  color?: string;
  size?: number;
  opacity?: number;
  className?: string;
}

export default function MouseGlow({
  color = "rgba(244, 180, 0, 0.15)",
  size = 400,
  opacity = 1,
  className,
}: MouseGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  // Use motion values instead of useState to avoid React re-renders on every mousemove
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    setIsHoverDevice(window.matchMedia("(hover: hover)").matches);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - size / 2);
      mouseY.set(e.clientY - rect.top - size / 2);
    },
    [mouseX, mouseY, size]
  );

  if (!isHoverDevice) return <div ref={containerRef} className={cn("absolute inset-0 pointer-events-none", className)} />;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      <motion.div
        className="pointer-events-none absolute rounded-full"
        style={{
          x: springX,
          y: springY,
          width: size,
          height: size,
          opacity: isVisible ? opacity : 0,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
        animate={{ opacity: isVisible ? opacity : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
