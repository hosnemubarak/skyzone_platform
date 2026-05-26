"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";

const features = [
  "Certified Quality Products",
  "Nationwide Distribution Network",
  "Expert Technical Support",
  "Competitive Pricing",
];

/* ── Staggered list variants ── */
const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const checkIconVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 18 },
  },
};


/* ── TiltCard ── */
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(800px) rotateX(0deg) rotateY(0deg)");
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setCanHover(mq.matches);
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canHover || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 8;
      const rotateX = ((centerY - y) / centerY) * 8;
      setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    },
    [canHover]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg)");
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform,
        transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ── Main component ── */
export default function AboutPreview() {
  return (
    <section className="bg-bg-light py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text side */}
          <ScrollReveal direction="left">
            <SectionHeader
              label="About Us"
              title="Your Trusted Partner in Energy Solutions"
              align="left"
            />
            <p className="text-gray-600 mt-6 leading-relaxed">
              Sky Zone International is a leading Bangladesh-based supplier,
              importer, and distributor of premium energy and electrical
              solutions. Since our founding, we have been committed to powering
              homes, businesses, and industries with reliable, certified
              products from globally trusted brands.
            </p>

            {/* Staggered checkmarks */}
            <motion.ul
              className="space-y-3 mt-6"
              variants={listVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature) => (
                <motion.li
                  key={feature}
                  className="flex items-center gap-3"
                  variants={itemVariants}
                >
                  <motion.span variants={checkIconVariants} className="shrink-0">
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </motion.span>
                  <span className="text-text-dark font-medium">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>

            <div className="mt-8">
              <Button
                variant="outline"
                href="/about"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Learn More About Us
              </Button>
            </div>
          </ScrollReveal>

          {/* Image side */}
          <ScrollReveal direction="right">
            <TiltCard>
              <motion.div
                className="relative rounded-xl overflow-hidden shadow-2xl"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                viewport={{ once: true }}
              >
                <Image
                  src="/images/about-team.png"
                  alt="Sky Zone International team"
                  width={600}
                  height={450}
                  className="w-full h-auto rounded-xl"
                />
                {/* Floating badge */}
                <div className="float-animation absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-white/95 backdrop-blur rounded-xl p-3 sm:p-4 shadow-lg border border-gray-100 flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-accent shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm font-heading font-bold text-primary leading-tight">
                      Certified Partner
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                      Global Quality Standards
                    </p>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
