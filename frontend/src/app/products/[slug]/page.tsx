import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, FileText, Settings, Building, Phone, Mail, ArrowRight, Check } from "lucide-react";
import { getProductBySlug, getRelatedProducts, getProducts } from "@/lib/api";
import { formatProductPrice } from "@/lib/utils";
import { companyInfo } from "@/data/navigation";

// Smaller Client Components
import ProductDetailGallery from "@/components/products/ProductDetailGallery";
import ProductDetailTabs from "@/components/products/ProductDetailTabs";
import ProductInquiryForm from "@/components/products/ProductInquiryForm";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ParticleField from "@/components/ui/ParticleField";
import MouseGlow from "@/components/ui/MouseGlow";
import SectionHeader from "@/components/ui/SectionHeader";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export async function generateStaticParams() {
  const allProducts = await getProducts();
  return allProducts.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": `https://skyzoneintl.com${product.image}`,
    "description": product.shortDescription,
    "brand": { "@type": "Brand", "name": product.brand || "Sky Zone International" },
    "offers": {
      "@type": "Offer",
      "url": `https://skyzoneintl.com/products/${product.id}`,
      "priceCurrency": "BDT",
      "price": (product.price ?? 0).toFixed(2),
      "availability": product.published ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      "seller": { "@type": "Organization", "name": "Sky Zone International" }
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Page Breadcrumb Header */}
      <section className="relative bg-primary py-8 pt-32 border-b border-white/5 overflow-hidden">
        <Image
          src="/images/products-hero-bg.png"
          alt=""
          fill
          className="object-cover opacity-40 pointer-events-none z-0"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30 z-0" />
        <div className="hero-grid-pattern-animated absolute inset-0 z-0 pointer-events-none" />
        <ParticleField count={8} className="absolute inset-0 z-0" />
        <MouseGlow color="rgba(244, 180, 0, 0.06)" size={350} />
        
        <div className="relative max-w-[1200px] mx-auto px-5 z-10">
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Link href="/" className="hover:text-accent transition-colors flex items-center gap-1">Home</Link>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <Link href="/products" className="hover:text-accent transition-colors">Products</Link>
            <ChevronRight className="w-4 h-4 text-white/30" />
            <span className="text-white truncate max-w-[200px] md:max-w-none font-medium">{product.name}</span>
          </div>
        </div>
        <div className="hero-gradient-line" />
      </section>

      {/* Product Details Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            
            {/* Left: Image Showcase & Gallery (Grid Span 6) */}
            <div className="lg:col-span-6">
              <ScrollReveal direction="left">
                <ProductDetailGallery product={product} />
              </ScrollReveal>
            </div>

            {/* Right: Info & Pricing (Grid Span 6) */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <ScrollReveal direction="right">
                <div>
                  
                  {/* Category Badges */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex bg-primary/5 border border-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {product.category}
                    </span>
                    {product.brand && (
                      <span className="inline-flex bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {product.brand}
                      </span>
                    )}
                    {product.series && (
                      <span className="inline-flex bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {product.series}
                      </span>
                    )}
                    {!product.published ? (
                      <span className="inline-flex bg-amber-500 border border-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">
                        Coming Soon
                      </span>
                    ) : product.badge && (
                      <span className="inline-flex bg-accent/20 border border-accent/20 text-accent-dark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-heading font-bold text-text-dark leading-tight mt-4">
                    {product.name}
                  </h1>

                  <div className="mt-4 flex flex-wrap items-baseline gap-2 pb-5 border-b border-gray-100">
                    <span className="text-xs md:text-sm text-gray-500 uppercase tracking-wider font-semibold">MRP:</span>
                    <span className="text-2xl md:text-3xl font-bold text-electric text-shimmer-effect">{formatProductPrice(product.price)}</span>
                    <span className="text-xs md:text-sm text-gray-400 italic font-medium">(Contact us for wholesale pricing & B2B quotations)</span>
                  </div>

                  <p className="text-base md:text-lg text-gray-600 mt-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Quick Specs Highlight Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                    {product.specs.slice(0, 3).map((spec) => (
                      <div key={spec.label} className="bg-bg-light border border-gray-200/60 p-4 rounded-xl">
                        <span className="block text-xs md:text-sm text-gray-500 font-bold uppercase tracking-wider">{spec.label}</span>
                        <span className="block text-base md:text-lg font-semibold text-text-dark mt-1">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-3 bg-accent/5 border border-accent/10 rounded-2xl p-5">
                    <h4 className="text-base font-bold text-primary uppercase tracking-wider mb-3">Distributor Advantages:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base text-gray-700">
                      <div className="flex items-center gap-2"><Check className="w-5 h-5 text-accent shrink-0" /><span className="font-medium">Direct Import Pricing</span></div>
                      <div className="flex items-center gap-2"><Check className="w-5 h-5 text-accent shrink-0" /><span className="font-medium">National Warranty Support</span></div>
                      <div className="flex items-center gap-2"><Check className="w-5 h-5 text-accent shrink-0" /><span className="font-medium">Complete Technical Spares</span></div>
                      <div className="flex items-center gap-2"><Check className="w-5 h-5 text-accent shrink-0" /><span className="font-medium">Engineering Project Support</span></div>
                    </div>
                  </div>

                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* Tabs Section: Specs & Features */}
      <section className="py-16 md:py-20 bg-bg-light border-y border-gray-200/50">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <div className="lg:col-span-8">
              <ProductDetailTabs product={product} />
            </div>

            <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm self-start">
              <h4 className="font-heading font-bold text-lg text-text-dark uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">
                Datasheet Downloads
              </h4>
              <p className="text-sm md:text-base text-gray-500 mb-5">
                Access official technical sheets, product drawings, and certifications.
              </p>
              
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-bg-light border border-gray-100 hover:border-electric/30 text-sm md:text-base font-semibold text-text-dark group transition-all">
                  <span className="flex items-center gap-2.5"><FileText className="w-4 h-4 text-red-500" /> Technical Datasheet (PDF)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 group-hover:text-electric transition-all" />
                </a>
                <a href="#" className="flex items-center justify-between p-4 rounded-xl bg-bg-light border border-gray-100 hover:border-electric/30 text-sm md:text-base font-semibold text-text-dark group transition-all">
                  <span className="flex items-center gap-2.5"><Settings className="w-4 h-4 text-blue-500" /> Installation Guide (PDF)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 group-hover:text-electric transition-all" />
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="font-heading font-bold text-base text-text-dark uppercase tracking-wider mb-3">Quick Inquiry Tips</h4>
                <ul className="text-sm md:text-base text-gray-500 space-y-3">
                  <li className="flex items-start gap-2.5"><span className="w-2 h-2 bg-accent rounded-full shrink-0 mt-2" /><span>Include estimated order quantity for accurate quotation discounts.</span></li>
                  <li className="flex items-start gap-2.5"><span className="w-2 h-2 bg-accent rounded-full shrink-0 mt-2" /><span>Mention custom installation conditions (on-grid, coastal location, etc.).</span></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Product Inquiry Form Section */}
      <section id="inquiry-form-section" className="py-16 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="bg-primary-deeper text-white rounded-3xl overflow-hidden shadow-2xl border border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              <div className="lg:col-span-5 p-8 md:p-12 bg-primary flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
                <div>
                  <span className="text-sm md:text-base text-accent font-bold tracking-widest uppercase">B2B Direct Channel</span>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mt-3 text-white leading-tight">
                    Submit Inquiry for {product.name}
                  </h3>
                  <p className="text-base md:text-lg text-white/80 mt-6 leading-relaxed">
                    Sky Zone International delivers wholesale energy equipment and customized solutions nationwide. Fill out the request and our commercial sales desk will get back to you within 24 hours.
                  </p>
                </div>

                <div className="mt-10 lg:mt-0 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white uppercase tracking-wider">Wholesale Orders Only</h4>
                      <p className="text-sm text-white/60 mt-0.5">Minimum quantities apply for dealer pricing benefits.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white uppercase tracking-wider">Direct Support Hotlines</h4>
                      <p className="text-sm text-white/60 mt-0.5">{companyInfo.phone} (Commercial Desk)</p>
                    </div>
                  </div>
                </div>

                <div className="text-sm md:text-base text-white/40 mt-8 lg:mt-0">
                  {companyInfo.name} &middot; Jubilee Road, Chittagong
                </div>
              </div>

              <div className="lg:col-span-7 p-8 md:p-12 bg-white/5 backdrop-blur-md relative">
                <ProductInquiryForm product={product} />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Related Products */}
      {related.length > 0 && (
        <section className="py-16 md:py-24 bg-bg-light border-t border-gray-200/50">
          <div className="max-w-[1200px] mx-auto px-5">
            <SectionHeader label="Related" title="Related Products" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              {related.map((rp) => (
                <ScrollReveal key={rp.id}>
                  <Link
                    href={`/products/${rp.slug}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group border border-gray-100"
                  >
                    <div className="relative h-[180px] overflow-hidden bg-bg-light">
                      <Image
                        src={rp.image}
                        alt={rp.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 right-3 bg-primary/70 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                        {rp.category}
                      </span>
                    </div>
                    <div className="p-6 flex flex-col justify-between min-h-[140px]">
                      <div>
                        <h4 className="font-heading font-bold text-base md:text-lg text-text-dark group-hover:text-electric transition-colors line-clamp-1">
                          {rp.name}
                        </h4>
                        <span className="text-xs md:text-sm font-semibold text-gray-400 mt-2 block uppercase tracking-wider">{rp.specs[0]?.label}: {rp.specs[0]?.value}</span>
                      </div>
                      <span className="text-electric font-semibold text-sm md:text-base flex items-center gap-1 mt-4 group-hover:gap-1.5 transition-all">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
