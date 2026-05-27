"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { motion } from "framer-motion";
import SocialIcon from "@/components/ui/SocialIcon";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import ParticleField from "@/components/ui/ParticleField";
import MouseGlow from "@/components/ui/MouseGlow";
import { companyInfo } from "@/data/navigation";

import { submitInquiry } from "@/services/api/inquiries";

export default function ContactPageContent() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSubmitted(false);

    try {
      await submitInquiry({
        ...formData,
        inquiry_type: "contact",
      });

      setSubmitted(true);
      setFormData({
        name: "",
        company: "",
        phone: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-electric focus:ring-2 focus:ring-electric/20 outline-none transition-all text-text-dark placeholder:text-gray-400 hover:scale-[1.02] transition-transform";

  return (
    <>
      {/* Page Hero */}
      <section className="relative bg-primary pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/contact-hero-bg.png"
          alt=""
          fill
          className="object-cover opacity-40 pointer-events-none z-0"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30 z-0" />
        {/* Animated grid pattern */}
        <div className="hero-grid-pattern-animated absolute inset-0 z-0" />
        {/* Particle field */}
        <ParticleField count={12} className="absolute inset-0 z-0" />
        {/* Mouse glow */}
        <MouseGlow color="rgba(244, 180, 0, 0.08)" size={400} />

        <div className="relative max-w-[1200px] mx-auto px-5 z-10">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent text-xs font-bold px-3.5 py-1.5 rounded-full mb-4 badge-glow">
            <Phone className="w-3.5 h-3.5" /> Contact Us
          </span>

          <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
            <a href="/" className="hover:text-accent transition-colors">Home</a>
            <span>/</span>
            <span className="text-white">Contact</span>
          </div>

          <motion.h1
            className="text-4xl md:text-5xl font-heading font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Contact Us
          </motion.h1>

          <motion.p
            className="text-lg text-white/70 mt-4 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Have a question or need a quote? Reach out to our team and we&apos;ll get back to you promptly.
          </motion.p>
        </div>

        {/* Hero gradient line */}
        <div className="hero-gradient-line" />
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading font-bold text-2xl text-text-dark">Send us a Message</h2>
              <p className="text-gray-500 mt-2">
                Fill out the form below and our team will respond within 24 hours.
              </p>

              {submitted && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                  Thank you! Your message has been sent. We&apos;ll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputClasses}
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className={inputClasses}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Installation Quote">Installation Quote</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Partnership">Partnership Opportunity</option>
                </select>
                <textarea
                  placeholder="Your Message *"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={inputClasses + " resize-none"}
                />

                {error && (
                  <div className="text-red-500 text-sm mt-2">
                    {error}
                  </div>
                )}

                <div className="glow-pulse-accent rounded-full">
                  <Button variant="primary" type="submit" className="w-full" disabled={loading} icon={!loading && <Send className="w-4 h-4" />}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <ScrollReveal direction="right">
              <div className="space-y-6">
                {/* Info Card */}
                <div className="bg-primary rounded-xl p-8 text-white animated-border-gradient">
                  <h3 className="font-heading font-semibold text-xl">Contact Information</h3>
                  <div className="space-y-6 mt-6">
                    {[
                      {
                        icon: MapPin,
                        label: "Address",
                        value: companyInfo.address,
                        href: companyInfo.mapLink,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      },
                      {
                        icon: Phone,
                        label: "Phone",
                        value: companyInfo.phone,
                        href: `tel:${companyInfo.phone}`,
                      },
                      {
                        icon: Mail,
                        label: "Email",
                        value: companyInfo.email,
                        href: `mailto:${companyInfo.email}`,
                      },
                      {
                        icon: Clock,
                        label: "Business Hours",
                        value: `${companyInfo.hours}\n${companyInfo.closedDay}`,
                      },
                    ].map(({ icon: Icon, label, value, href, target, rel }) => (
                      <div key={label} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-white/50 text-xs uppercase tracking-wider">{label}</p>
                          {href ? (
                            <a
                              href={href}
                              target={target}
                              rel={rel}
                              className="text-white/90 text-sm mt-0.5 block hover:text-accent transition-colors whitespace-pre-line font-medium"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="text-white/90 text-sm mt-0.5 whitespace-pre-line font-medium">{value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp */}
                <a
                  href={companyInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-whatsapp text-white py-3.5 rounded-xl font-semibold hover:opacity-90 hover:scale-105 transition-all whatsapp-pulse"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>

                {/* Social Links */}
                <div>
                  <p className="text-sm text-gray-500 mb-3">Follow us on social media</p>
                  <motion.div
                    className="flex gap-3"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: { staggerChildren: 0.1 },
                      },
                    }}
                  >
                    {(["facebook", "linkedin", "youtube"] as const).map((type) => (
                      <motion.a
                        key={type}
                        href={companyInfo.social[type === "youtube" ? "youtube" : type]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-xl bg-bg-light flex items-center justify-center text-text-dark hover:bg-primary hover:text-white transition-all duration-300"
                        aria-label={type}
                        variants={{
                          hidden: { opacity: 0, scale: 0.8 },
                          visible: {
                            opacity: 1,
                            scale: 1,
                            transition: { duration: 0.3, ease: "easeOut" as const },
                          },
                        }}
                      >
                        <SocialIcon type={type} />
                      </motion.a>
                    ))}
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="pb-16 md:pb-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-xl overflow-hidden shadow-lg shadow-[0_20px_60px_rgba(11,42,74,0.12)]"
          >
            <iframe
              src="https://maps.google.com/maps?q=22.3363729,91.8322532&z=18&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sky Zone International Office Location"
              className="w-full"
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
