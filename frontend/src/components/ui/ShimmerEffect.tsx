"use client";

import { cn } from "@/lib/utils";

interface ShimmerEffectProps {
  className?: string;
}

export default function ShimmerEffect({ className }: ShimmerEffectProps) {
  return (
    <div
      className={cn(
        "shimmer-effect absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-[inherit]",
        className
      )}
    />
  );
}
