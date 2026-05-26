"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
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
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  useEffect(() => {
    setIsHoverDevice(window.matchMedia("(hover: hover)").matches);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
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
        animate={{
          x: position.x - size / 2,
          y: position.y - size / 2,
          opacity: isVisible ? opacity : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.5 }}
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}
