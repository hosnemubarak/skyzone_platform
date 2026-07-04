"use client";

import { useState } from "react";
import { Search, X, CheckCircle } from "lucide-react";
import { m as motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { Product } from "@/data/products";

export default function ProductDetailTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<"specs" | "features">("specs");
  const [specQuery, setSpecQuery] = useState("");

  const filteredSpecs = product.specs.filter(
    (s) =>
      (s.label || "").toLowerCase().includes(specQuery.toLowerCase()) ||
      (s.value || "").toLowerCase().includes(specQuery.toLowerCase())
  );

  return (
    <>
      {/* Tabs buttons header */}
      <div className="flex border-b border-gray-200 mb-6 gap-8">
        <button
          onClick={() => setActiveTab("specs")}
          className={cn(
            "pb-3.5 text-base md:text-lg font-bold uppercase tracking-wider relative transition-all cursor-pointer",
            activeTab === "specs" ? "text-primary font-bold" : "text-gray-400 md:hover:text-text-dark"
          )}
        >
          Technical Specifications
          {activeTab === "specs" && (
            <motion.span
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab("features")}
          className={cn(
            "pb-3.5 text-base md:text-lg font-bold uppercase tracking-wider relative transition-all cursor-pointer",
            activeTab === "features" ? "text-primary font-bold" : "text-gray-400 md:hover:text-text-dark"
          )}
        >
          Features &amp; Benefits
          {activeTab === "features" && (
            <motion.span
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
            />
          )}
        </button>
      </div>

      {/* Tab Panel: Specs */}
      {activeTab === "specs" && (
        <ScrollReveal>
          <div>
            {/* Live specification search */}
            <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-xl border border-gray-200 mb-4 max-w-sm">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search specifications..."
                value={specQuery}
                onChange={(e) => setSpecQuery(e.target.value)}
                className="bg-transparent border-none text-sm outline-none text-text-dark w-full placeholder:text-gray-400"
              />
              {specQuery && (
                <button onClick={() => setSpecQuery("")} className="shrink-0 text-gray-400 hover:text-text-dark">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Specs Table — stagger animated */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm">
              {filteredSpecs.length > 0 ? (
                <motion.div
                  className="divide-y divide-gray-100"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.04 } },
                  }}
                >
                  {filteredSpecs.map((spec, i) => (
                    <motion.div
                      key={spec.label}
                      className={cn(
                        "flex flex-col sm:flex-row justify-between py-4 px-6 text-sm transition-colors",
                        i % 2 === 0 ? "bg-bg-light/30" : "bg-white",
                        "hover:bg-accent/5"
                      )}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
                      }}
                    >
                      <span className="font-bold text-text-dark uppercase tracking-wider text-sm sm:w-[40%]">{spec.label}</span>
                      <span className="text-gray-600 font-medium sm:w-[60%] sm:pl-4 mt-1.5 sm:mt-0 leading-relaxed md:text-base">{spec.value}</span>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="py-8 text-center text-gray-400 text-sm">
                  No specifications match &ldquo;{specQuery}&rdquo;
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Tab Panel: Features */}
      {activeTab === "features" && (
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {product.features.map((feature, i) => (
              <div key={i} className="flex gap-4 bg-white p-6 rounded-2xl border border-gray-200/60 shadow-sm group hover:border-electric/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-electric/10 flex items-center justify-center text-electric shrink-0 group-hover:bg-electric group-hover:text-white transition-all icon-ring-animated relative">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base md:text-lg font-semibold text-text-dark leading-snug">{feature}</p>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">Engineered for maximum endurance under severe electrical load.</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}
    </>
  );
}
