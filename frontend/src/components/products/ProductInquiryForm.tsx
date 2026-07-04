"use client";

import { useState } from "react";
import { Send, Check, User, Mail, Phone, Building2, MessageSquare } from "lucide-react";
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
        // Premium SaaS Inquiry Form
        <motion.form
          key="inquiry-form"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleInquirySubmit}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-electric transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "w-full bg-slate-50 border rounded-xl pl-11 pr-4 py-3.5 text-[15px] text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all shadow-sm",
                    errors.name 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-slate-200 focus:border-electric focus:ring-electric/20 hover:border-slate-300"
                  )}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <span className="text-xs text-red-500 font-semibold mt-1.5 block ml-1">{errors.name}</span>
              )}
            </div>

            {/* Company Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Company Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-electric transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-[15px] text-slate-900 focus:outline-none focus:bg-white focus:border-electric focus:ring-4 focus:ring-electric/20 hover:border-slate-300 transition-all shadow-sm"
                  placeholder="Energy Tech Ltd."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Work Email <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-electric transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full bg-slate-50 border rounded-xl pl-11 pr-4 py-3.5 text-[15px] text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all shadow-sm",
                    errors.email 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-slate-200 focus:border-electric focus:ring-electric/20 hover:border-slate-300"
                  )}
                  placeholder="john@company.com"
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500 font-semibold mt-1.5 block ml-1">{errors.email}</span>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-electric transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cn(
                    "w-full bg-slate-50 border rounded-xl pl-11 pr-4 py-3.5 text-[15px] text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all shadow-sm",
                    errors.phone 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
                      : "border-slate-200 focus:border-electric focus:ring-electric/20 hover:border-slate-300"
                  )}
                  placeholder="+880 1712-345678"
                />
              </div>
              {errors.phone && (
                <span className="text-xs text-red-500 font-semibold mt-1.5 block ml-1">{errors.phone}</span>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
              Inquiry details / Message
            </label>
            <div className="relative group">
              <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-slate-400 group-focus-within:text-electric transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-[15px] text-slate-900 focus:outline-none focus:bg-white focus:border-electric focus:ring-4 focus:ring-electric/20 hover:border-slate-300 transition-all shadow-sm resize-none"
                placeholder="Provide estimated quantities..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            {errors.submit && (
              <div className="mb-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {errors.submit}
              </div>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full justify-center shadow-[0_4px_14px_0_rgba(0,118,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,118,255,0.23)] hover:-translate-y-0.5 transition-all"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Inquiry...
                </>
              ) : (
                <>
                  Submit Official Request
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
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
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 text-emerald-500 rounded-full flex items-center justify-center shadow-sm mb-6 animate-bounce">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Inquiry Received Successfully!</h3>
          <p className="text-[15px] text-slate-600 mt-3 max-w-md leading-relaxed">
            Thank you for contacting Sky Zone International. Your request regarding <strong className="text-slate-900">{product.name}</strong> is in our queue.
          </p>
          <p className="text-sm text-slate-400 mt-3">
            A verification email was sent to your address. Our commercial sales representatives will connect with you within 24 hours.
          </p>
          
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            size="sm"
            className="mt-8 border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            Submit Another Inquiry
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
