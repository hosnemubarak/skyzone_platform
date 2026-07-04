"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
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

  const inputClasses =
    "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-electric focus:ring-2 focus:ring-electric/20 outline-none transition-all text-text-dark placeholder:text-gray-400 hover:scale-[1.02] transition-transform";
  const errorInputClasses =
    "w-full px-4 py-3 rounded-xl border border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all text-text-dark placeholder:text-gray-400 hover:scale-[1.02] transition-transform";

  return (
    <AnimatePresence mode="wait">
      {!isSuccess ? (
        <motion.form
          key="inquiry-form"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleInquirySubmit}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <input
                type="text"
                placeholder="Full Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? errorInputClasses : inputClasses}
              />
              {errors.name && (
                <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <input
                type="text"
                placeholder="Phone Number *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={errors.phone ? errorInputClasses : inputClasses}
              />
              {errors.phone && (
                <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Work Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? errorInputClasses : inputClasses}
              />
              {errors.email && (
                <span className="text-xs text-red-500 mt-1 block">{errors.email}</span>
              )}
            </div>
          </div>

          <div>
            <textarea
              rows={5}
              placeholder="Inquiry details / Message *"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClasses + " resize-none"}
            />
          </div>

          <div>
            {errors.submit && (
              <div className="text-red-500 text-sm mb-3">
                {errors.submit}
              </div>
            )}
            <div className="glow-pulse-accent rounded-full mt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isSubmitting}
                icon={!isSubmitting && <Send className="w-4 h-4" />}
              >
                {isSubmitting ? "Sending Inquiry..." : "Submit Official Request"}
              </Button>
            </div>
          </div>
        </motion.form>
      ) : (
        <motion.div
          key="success-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
          className="h-full flex flex-col items-center justify-center text-center py-10"
        >
          <div className="w-16 h-16 bg-green-50 border border-green-100 text-green-500 rounded-full flex items-center justify-center shadow-sm mb-6 animate-bounce">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Inquiry Sent Successfully!</h3>
          <p className="text-gray-600 mt-3 max-w-md">
            Thank you for contacting Sky Zone International. Your request regarding <strong>{product.name}</strong> has been received. We will respond within 24 hours.
          </p>
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            size="sm"
            className="mt-8"
          >
            Send Another Inquiry
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
