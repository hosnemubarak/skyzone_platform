"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import ShimmerEffect from "@/components/ui/ShimmerEffect";
import { products } from "@/data/products";

/* ── Animated title with typewriter effect ── */
function AnimatedTitle() {
  const text = "Featured Products";
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 70);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <span ref={ref} className="inline-flex items-center min-h-[36px] md:min-h-[44px]">
      <span>{displayText}</span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
        className="inline-block w-[3px] h-[1.8rem] md:h-[2.4rem] ml-1 bg-accent"
      />
    </span>
  );
}

/* ── 3D tilt card wrapper ── */
function ProductTiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="will-change-transform transition-transform duration-300 ease-out @media(hover:hover)"
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

/* ── Stagger animation variants ── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
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

/* ── Main component ── */
export default function FeaturedProducts() {
  const featured = useMemo(() => {
    const categoryCounts = products.reduce((acc, p) => {
      acc[p.categorySlug] = (acc[p.categorySlug] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categories = Array.from(new Set(products.map((p) => p.categorySlug)))
      .sort((a, b) => categoryCounts[b] - categoryCounts[a]);

    const groups: Record<string, typeof products> = {};
    categories.forEach((cat) => {
      groups[cat] = products
        .filter((p) => p.categorySlug === cat)
        .sort((a, b) => {
          if (a.published !== b.published) {
            return a.published ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
    });

    const selected: typeof products = [];
    let index = 0;
    while (selected.length < 6) {
      let addedAny = false;
      for (const cat of categories) {
        if (groups[cat] && groups[cat].length > index) {
          selected.push(groups[cat][index]);
          addedAny = true;
          if (selected.length === 6) break;
        }
      }
      if (!addedAny) break;
      index++;
    }

    return selected.sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <section className="bg-bg-light py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-5">
        <SectionHeader
          title={<AnimatedTitle />}
          subtitle="Discover our most popular energy solutions trusted for high performance and reliability across Bangladesh"
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {featured.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductTiltCard>
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block bg-white rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Shimmer overlay */}
                  <ShimmerEffect />

                  {/* Image */}
                  <div className="relative h-[220px] overflow-hidden bg-bg-light">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />

                    {!product.published ? (
                      <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 animate-pulse">
                        Coming Soon
                      </span>
                    ) : product.badge && (
                      <span className="absolute top-3 left-3 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full z-10">
                        {product.badge}
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-primary/80 text-white text-xs px-3 py-1 rounded-full z-10">
                      {product.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg text-text-dark">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      {product.shortDescription}
                    </p>

                    {/* Specs preview */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {product.specs.slice(0, 2).map((spec) => (
                        <span
                          key={spec.label}
                          className="text-xs bg-bg-light text-gray-500 px-2 py-1 rounded"
                        >
                          {spec.label}: {spec.value}
                        </span>
                      ))}
                    </div>

                    {/* Bottom */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        {product.priceRange}
                      </span>
                      <span className="text-electric font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Details
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </ProductTiltCard>
            </motion.div>
          ))}
        </motion.div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-all duration-300"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
