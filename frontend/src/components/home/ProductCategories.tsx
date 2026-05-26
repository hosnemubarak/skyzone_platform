"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Sun, Zap, Battery, Power, Gauge, Cable, Wrench, Rocket, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { productCategories } from "@/data/products";

const iconMap: Record<string, React.ElementType> = {
  Sun, Zap, Battery, Power, Gauge, Cable, Wrench, Rocket,
};

/* ── Staggered entrance variants ── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },

  },
};

/* ── MagneticCard ── */
interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
}

function MagneticCard({ children, className = "" }: MagneticCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = ((e.clientX - centerX) / (rect.width / 2)) * 4;
    const y = ((e.clientY - centerY) / (rect.height / 2)) * 4;
    setOffset({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: isHovering
          ? "transform 0.15s ease-out"
          : "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ── Main component ── */
export default function ProductCategories() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-5">
        <SectionHeader
          label="Our Products"
          title="Comprehensive Energy Solutions"
          subtitle="From solar panels to electrical equipment — everything you need for reliable energy infrastructure"
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {productCategories.map((cat) => {
            const IconComp = iconMap[cat.icon] || Sun;
            return (
              <motion.div key={cat.slug} variants={itemVariants}>
                <MagneticCard className="h-full">
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="animated-border-gradient block bg-primary p-6 rounded-xl text-white group hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:shadow-xl h-full"
                  >
                    <div className="icon-ring-animated relative w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                      <IconComp className="relative z-10 w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold mt-4">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-white/60 mt-2">
                      {cat.description}
                    </p>
                    <div className="flex items-center gap-1 text-accent text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                      View Products
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </MagneticCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
