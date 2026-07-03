import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";

// Lazy load below-the-fold components for faster initial page load (code splitting)
const AboutPreview = dynamic(() => import("@/components/home/AboutPreview"));
const ProductCategories = dynamic(() => import("@/components/home/ProductCategories"));
const FeaturedProducts = dynamic(() => import("@/components/home/FeaturedProducts"));
const BrandsPartners = dynamic(() => import("@/components/home/BrandsPartners"));
const DealerOpportunity = dynamic(() => import("@/components/home/DealerOpportunity"));
const ContactCTA = dynamic(() => import("@/components/home/ContactCTA"));

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
