"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { submitInquiry } from "@/services/api/inquiries";
import type { Product } from "@/data/products";

export default function ProductInquiryForm({ product }: { product: Product }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState(
    `Dear Sky Zone International, I am interested in inquiring about the "${product.name}". Please send me pricing, availability, and technical catalog information.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = "Full name is required";
    if (!phone.trim()) tempErrors.phone = "Phone number is required";
    if (!email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Invalid email format";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await submitInquiry({
        name,
        email,
        phone,
        company,
        message,
        inquiry_type: "product",
        product_name: product.name,
      });

      setIsSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      setErrors({ submit: err.message || "An error occurred" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isSuccess ? (
        // The Inquiry Form
        <motion.form
          key="inquiry-form"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleInquirySubmit}
          className="space-y-5 text-text-dark"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm md:text-base font-semibold text-white/90 uppercase tracking-wider mb-2.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(
                  "w-full bg-white/5 border text-white rounded-xl px-4.5 py-3.5 text-base focus:outline-none focus:bg-white/10 transition-all",
                  errors.name ? "border-red-400" : "border-white/10 focus:border-accent"
                )}
                placeholder="John Doe"
              />
              {errors.name && (
                <span className="text-xs text-red-400 font-semibold mt-1.5 block">{errors.name}</span>
              )}
            </div>

            {/* Company Input */}
            <div>
              <label className="block text-sm md:text-base font-semibold text-white/90 uppercase tracking-wider mb-2.5">
                Company Name
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4.5 py-3.5 text-base focus:outline-none focus:bg-white/10 focus:border-accent transition-all"
                placeholder="Energy Tech Ltd."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm md:text-base font-semibold text-white/90 uppercase tracking-wider mb-2.5">
                Work Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full bg-white/5 border text-white rounded-xl px-4.5 py-3.5 text-base focus:outline-none focus:bg-white/10 transition-all",
                  errors.email ? "border-red-400" : "border-white/10 focus:border-accent"
                )}
                placeholder="john@company.com"
              />
              {errors.email && (
                <span className="text-xs text-red-400 font-semibold mt-1.5 block">{errors.email}</span>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm md:text-base font-semibold text-white/90 uppercase tracking-wider mb-2.5">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={cn(
                  "w-full bg-white/5 border text-white rounded-xl px-4.5 py-3.5 text-base focus:outline-none focus:bg-white/10 transition-all",
                  errors.phone ? "border-red-400" : "border-white/10 focus:border-accent"
                )}
                placeholder="+880 1712-345678"
              />
              {errors.phone && (
                <span className="text-xs text-red-400 font-semibold mt-1.5 block">{errors.phone}</span>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm md:text-base font-semibold text-white/90 uppercase tracking-wider mb-2.5">
              Inquiry details / Message
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4.5 py-3.5 text-base focus:outline-none focus:bg-white/10 focus:border-accent transition-all resize-none"
              placeholder="Provide estimated quantities, configurations, shipping instructions..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            {errors.submit && (
              <div className="mb-4 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {errors.submit}
              </div>
            )}
            <div className="glow-pulse-accent rounded-full">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing Inquiry...
                  </>
                ) : (
                  <>
                    Submit Official Request
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

        </motion.form>
      ) : (
        // Success Message Animation Card
        <motion.div
          key="success-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
          className="h-full flex flex-col items-center justify-center text-center py-10"
        >
          <div className="w-16 h-16 bg-accent/20 border border-accent/20 text-accent rounded-full flex items-center justify-center shadow-lg mb-6 animate-bounce">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">Inquiry Received Successfully!</h3>
          <p className="text-sm md:text-base text-white/70 mt-3 max-w-md">
            Thank you for contacting Sky Zone International. Your request regarding <strong>{product.name}</strong> is in our queue.
          </p>
          <p className="text-sm text-white/50 mt-2">
            A verification email was sent to your address. Our commercial sales representatives will connect with you within 24 hours.
          </p>
          
          <Button
            onClick={() => setIsSuccess(false)}
            variant="secondary"
            size="sm"
            className="mt-8"
          >
            Submit Another Inquiry
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
