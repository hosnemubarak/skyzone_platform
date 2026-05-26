"use client";

import { Phone, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import ParticleField from "@/components/ui/ParticleField";
import { companyInfo } from "@/data/navigation";

export default function ContactCTA() {
  return (
    <section className="relative bg-gradient-to-r from-primary to-primary-dark py-16 animated-gradient-bg overflow-hidden">
      {/* Particle field overlay */}
      <ParticleField count={8} className="absolute inset-0" />

      <div className="relative max-w-[1200px] mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white text-shimmer-effect">
                Ready to Power Your Future?
              </h2>
              <p className="text-white/70 mt-2 max-w-xl">
                Get in touch with our team for product inquiries, installation
                quotes, or partnership opportunities. We&apos;re here to help.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="glow-pulse-accent rounded-full">
                <Button
                  variant="primary"
                  href="/contact"
                  icon={<Phone className="w-4 h-4" />}
                >
                  Contact Us
                </Button>
              </div>
              <a
                href={companyInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-whatsapp text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
