"use client";

import { useState } from "react";
import Image from "next/image";
import { Settings, ShieldCheck, Box, Layers, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";

export default function ProductDetailGallery({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{ transformOrigin: string } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => {
    setZoomStyle(null);
  };

  const galleryViews = [
    { label: "Product Photo", icon: Layers },
    { label: "Technical Schematic", icon: Settings },
    { label: "Quality & QA", icon: ShieldCheck },
    { label: "Package Contents", icon: Box },
  ];

  return (
    <div className="space-y-4">
      {/* Main Gallery Viewer */}
      <div>
        {activeImage === 0 && (
          <div
            className="relative h-[360px] sm:h-[420px] md:h-[460px] w-full rounded-2xl overflow-hidden bg-bg-light border border-gray-100 flex items-center justify-center cursor-zoom-in group select-none shadow-sm"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-contain p-6 transition-transform duration-250 ease-out"
              style={
                zoomStyle
                  ? { transform: "scale(1.6)", ...zoomStyle }
                  : { transform: "scale(1)" }
              }
            />
            {!product.published ? (
              <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md z-10 animate-pulse">
                Coming Soon
              </span>
            ) : product.badge && (
              <span className="absolute top-4 left-4 bg-accent text-primary text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md z-10">
                {product.badge}
              </span>
            )}
            <span className="absolute bottom-4 right-4 text-[10px] bg-white/70 hover:bg-white text-gray-500 px-2 py-1 rounded border border-gray-200 backdrop-blur-sm transition-all pointer-events-none">
              Hover to Zoom
            </span>
          </div>
        )}

        {activeImage === 1 && (
          <div className="relative h-[360px] sm:h-[420px] md:h-[460px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white font-mono p-6 flex flex-col justify-between hero-grid-pattern shadow-sm">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
            
            <div className="flex justify-between items-start z-10 border-b border-white/10 pb-3">
              <span className="text-xs md:text-sm text-sky-400 font-bold tracking-widest flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                TECHNICAL DIMENSION SCHEMATIC
              </span>
              <span className="text-[10px] md:text-xs text-white/40">SCALE: N.T.S</span>
            </div>

            {/* Technical drawing mockup */}
            <div className="flex-1 flex items-center justify-center my-4 relative">
              <div className="w-[85%] h-[75%] border border-dashed border-sky-500/40 rounded flex flex-col items-center justify-center p-4 bg-sky-500/5 relative">
                {/* Horizontal dimension line */}
                <div className="absolute -bottom-6 left-0 right-0 h-px bg-sky-500/80">
                  <div className="absolute left-0 -top-1.5 w-px h-4 bg-sky-500" />
                  <div className="absolute right-0 -top-1.5 w-px h-4 bg-sky-500" />
                  <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-2 text-xs text-sky-400 font-semibold tracking-wider whitespace-nowrap">
                    {product.specs.find(s => s.label.toLowerCase().includes("dimension") || s.label.toLowerCase().includes("size"))?.value || "Standard Width"}
                  </div>
                </div>

                {/* Vertical dimension line */}
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-sky-500/80">
                  <div className="absolute top-0 -left-1.5 w-4 h-px bg-sky-500" />
                  <div className="absolute bottom-0 -left-1.5 w-4 h-px bg-sky-500" />
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-slate-900 py-1.5 text-xs text-sky-400 font-semibold tracking-wider rotate-90 origin-center whitespace-nowrap">
                    {product.specs.find(s => s.label.toLowerCase().includes("height") || s.label.toLowerCase().includes("depth"))?.value || "Height Profile"}
                  </div>
                </div>

                <div className="w-14 h-14 rounded-full border border-sky-400/40 flex items-center justify-center text-sky-400 bg-sky-950/50 mb-3 shadow-inner">
                  <Settings className="w-7 h-7 animate-spin-slow" />
                </div>
                <span className="text-xs text-sky-300 font-semibold text-center truncate max-w-full px-2">{product.name}</span>
                <span className="text-xs text-white/50 mt-1">WEIGHT: {product.specs.find(s => s.label.toLowerCase().includes("weight"))?.value || "Standard Weight"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-white/60 border-t border-white/10 pt-3 z-10">
              <div>TYPE: {product.specs[1]?.value || "Standard Model"}</div>
              <div className="text-right">WARRANTY: {product.specs.find(s => s.label.toLowerCase().includes("warranty"))?.value || "Standard"}</div>
            </div>
          </div>
        )}

        {activeImage === 2 && (
          <div className="relative h-[360px] sm:h-[420px] md:h-[460px] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-primary-deeper to-primary border border-gray-200 p-6 flex flex-col justify-between text-white shadow-md">
            <div className="absolute top-0 right-0 w-36 h-36 bg-accent/10 rounded-full blur-3xl" />
            <div className="border-b border-white/10 pb-3 flex justify-between items-center z-10">
              <span className="text-xs md:text-sm text-accent font-bold tracking-widest flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                SKY ZONE QUALITY ASSURANCE
              </span>
              <span className="text-xs text-white/40">VERIFIED</span>
            </div>

            <div className="flex-1 flex flex-col justify-center my-4 space-y-3 z-10">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">100% Quality Inspection</h4>
                  <p className="text-xs text-white/60">Fully audited for efficiency, safety parameters and structural load standards.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">IEC & Certification Standard</h4>
                  <p className="text-xs text-white/60">All product components are verified by international agencies (IEC, CE, ISO).</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">Linear Performance Guarantee</h4>
                  <p className="text-xs text-white/60">Backed by Sky Zone International&apos;s authorized regional distributor service warranty.</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-white/40 text-center border-t border-white/10 pt-3 z-10">
              Secure Supply &middot; Authorized Bangladesh Importer &amp; Distributor
            </div>
          </div>
        )}

        {activeImage === 3 && (
          <div className="relative h-[360px] sm:h-[420px] md:h-[460px] w-full rounded-2xl overflow-hidden bg-bg-light border border-gray-200 p-6 flex flex-col justify-between text-text-dark shadow-sm">
            <div className="border-b border-gray-200 pb-3 flex justify-between items-center">
              <span className="text-xs md:text-sm text-primary font-bold tracking-widest flex items-center gap-1.5">
                <Box className="w-4 h-4 text-electric" />
                CARGO &amp; SHIPPING CONTENTS
              </span>
              <span className="text-xs text-gray-400">READY</span>
            </div>

            <div className="flex-1 flex flex-col justify-center my-4 space-y-4">
              <p className="text-sm text-gray-500 leading-relaxed">
                Each order is packed using industrial heavy-duty shockproof crating. Ready for transport to Chittagong, Dhaka, and nationwide.
              </p>

              <ul className="space-y-2 text-sm md:text-base text-gray-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric shrink-0 mt-2" />
                  <span><strong>1x</strong> {product.name} (Sealed Retail/Bulk Unit)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric shrink-0 mt-2" />
                  <span><strong>1x</strong> Factory Datasheet &amp; Wiring Guide</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric shrink-0 mt-2" />
                  <span><strong>1x</strong> Sky Zone Official Warranty Certificate</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-electric shrink-0 mt-2" />
                  <span>Essential connector kit / basic brackets (where applicable)</span>
                </li>
              </ul>
            </div>

            <div className="text-xs text-gray-400 text-center border-t border-gray-200 pt-3">
              Transit Insurance &middot; Secure Packaging &middot; Safe Dispatch Guarantee
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Gallery View Tabs / Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {galleryViews.map((view, i) => {
          const Icon = view.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={cn(
                "flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                activeImage === i
                  ? "bg-primary border-primary text-white shadow-md glow-pulse-accent"
                  : "bg-bg-light border-gray-200 hover:border-accent text-gray-500 hover:text-text-dark hover:bg-white hover:scale-105 transition-transform"
              )}
            >
              <Icon className={cn("w-4 h-4 mb-1 shrink-0", activeImage === i && "icon-ring-animated relative")} />
              <span className="text-[11px] md:text-xs font-bold tracking-tight uppercase line-clamp-1">{view.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
