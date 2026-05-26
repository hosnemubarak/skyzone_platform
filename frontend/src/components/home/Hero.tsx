"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRight, Phone } from "lucide-react";
import ParticleField from "@/components/ui/ParticleField";
import MouseGlow from "@/components/ui/MouseGlow";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[70vh] md:min-h-[80vh] bg-primary overflow-hidden flex items-center"
    >
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="/images/hero-bg.png"
          alt=""
          fill
          className="object-cover opacity-50"
          priority
        />
      </motion.div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 hero-grid-pattern-animated" />

      {/* Particle field */}
      <ParticleField count={30} className="absolute inset-0" />

      {/* Mouse glow */}
      <MouseGlow color="rgba(244, 180, 0, 0.12)" size={500} />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/45 to-transparent" />

      {/* Content */}
      <div className="relative w-full max-w-[1200px] mx-auto px-5 flex items-center">
        <div className="max-w-2xl py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 border border-accent/30 bg-accent/10 text-accent text-sm px-4 py-1.5 rounded-full font-medium badge-glow">
              🌞 Leading Energy Solutions Provider
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.4 }}
            className="text-4xl md:text-5xl lg:text-[3.2rem] font-heading font-extrabold text-white leading-tight mt-6"
          >
            Powering Bangladesh with{" "}
            <span className="gradient-text">Reliable Energy</span> &amp;
            Electrical Solutions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.6 }}
            className="text-lg text-white/70 mt-6 max-w-xl leading-relaxed"
          >
            Sky Zone International is your trusted partner for premium solar
            panels, inverters, batteries, and electrical equipment. We deliver
            certified quality products with nationwide distribution across
            Bangladesh.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.8 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Button
              variant="primary"
              size="lg"
              href="/products"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Explore Products
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/contact"
              icon={<Phone className="w-5 h-5" />}
            >
              Contact Us
            </Button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 1.0 }}
            className="flex gap-8 md:gap-12 mt-10 pt-8 border-t border-white/15"
          >
            <div className="flex flex-col">
              <AnimatedCounter
                end={500}
                suffix="+"
                className="text-3xl font-heading font-bold text-accent"
              />
              <span className="text-sm text-white/60">Installations</span>
            </div>
            <div className="flex flex-col">
              <AnimatedCounter
                end={50}
                suffix="+"
                className="text-3xl font-heading font-bold text-accent"
              />
              <span className="text-sm text-white/60">Dealers</span>
            </div>
            <div className="flex flex-col">
              <AnimatedCounter
                end={10}
                suffix="+"
                className="text-3xl font-heading font-bold text-accent"
              />
              <span className="text-sm text-white/60">Years</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gradient line at bottom */}
      <div className="hero-gradient-line" />
    </section>
  );
}
