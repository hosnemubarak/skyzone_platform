"use client";

import { ArrowRight, TrendingUp, Truck, HandshakeIcon, BadgeDollarSign } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import MouseGlow from "@/components/ui/MouseGlow";

const benefits = [
  { icon: TrendingUp, text: "High profit margins" },
  { icon: Truck, text: "Fast & reliable supply chain" },
  { icon: HandshakeIcon, text: "Dedicated dealer support" },
  { icon: BadgeDollarSign, text: "Exclusive dealer pricing" },
];

const stats = [
  { title: "Priority Stock", desc: "Guaranteed product allocation" },
  { title: "Expert Training", desc: "Technical workshops & support" },
  { title: "Marketing Kits", desc: "Digital assets & print designs" },
];

export default function DealerOpportunity() {
  return (
    <section className="py-16 md:py-24 bg-bg-light">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <ScrollReveal direction="left">
            <SectionHeader
              label="Partner With Us"
              title="Become a Sky Zone Dealer"
              align="left"
            />
            <p className="text-gray-600 mt-6 leading-relaxed">
              Join our growing network of authorized dealers across Bangladesh.
              Get access to premium energy products at exclusive prices, dedicated
              support, and marketing resources to grow your business.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {benefits.map((b, index) => (
                <div key={b.text} className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center shrink-0"
                    whileInView={{ scale: [0.8, 1.1, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <b.icon className="w-5 h-5 text-accent" />
                  </motion.div>
                  <span className="text-sm font-medium text-text-dark">{b.text}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button
                variant="primary"
                href="/contact"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Become a Dealer
              </Button>
            </div>
          </ScrollReveal>

          {/* Visual card */}
          <ScrollReveal direction="right">
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-10 text-white relative overflow-hidden">
              <div className="absolute inset-0 hero-grid-pattern-animated opacity-30" />
              <MouseGlow color="rgba(244, 180, 0, 0.1)" size={350} />
              <div className="relative">
                <span className="inline-block bg-accent/20 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                  Dealer Program
                </span>
                <h3 className="text-2xl font-heading font-bold">
                  Grow Your Business With Us
                </h3>
                <p className="text-white/70 mt-3 leading-relaxed">
                  We provide everything you need to succeed — from product training
                  and marketing materials to competitive pricing and priority stock allocation.
                </p>
                <motion.div
                  className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 * index, ease: "easeOut" as const }}

                    >
                      <p className="text-sm font-heading font-semibold text-accent">{stat.title}</p>
                      <p className="text-xs text-white/60 mt-1">{stat.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
