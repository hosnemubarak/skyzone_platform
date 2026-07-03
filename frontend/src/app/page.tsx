import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";

// Lazy load below-the-fold components with ssr: false
// so they don't block server-side rendering or inflate the initial JS bundle
const AboutPreview = dynamic(() => import("@/components/home/AboutPreview"), { ssr: false });
const ProductCategories = dynamic(() => import("@/components/home/ProductCategories"), { ssr: false });
const FeaturedProducts = dynamic(() => import("@/components/home/FeaturedProducts"), { ssr: false });
const BrandsPartners = dynamic(() => import("@/components/home/BrandsPartners"), { ssr: false });
const DealerOpportunity = dynamic(() => import("@/components/home/DealerOpportunity"), { ssr: false });
const ContactCTA = dynamic(() => import("@/components/home/ContactCTA"), { ssr: false });

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <ProductCategories />
      <FeaturedProducts />
      <BrandsPartners />
      <DealerOpportunity />
      <ContactCTA />
    </>
  );
}
