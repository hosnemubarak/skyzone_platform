export const dynamic = 'force-static';
import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";

import { getFeaturedProducts } from "@/lib/api";

// Lazy load below-the-fold components for faster initial page load (code splitting)
const AboutPreview = dynamic(() => import("@/components/home/AboutPreview"));
const ProductCategories = dynamic(() => import("@/components/home/ProductCategories"));
const FeaturedProducts = dynamic(() => import("@/components/home/FeaturedProducts"));
const BrandsPartners = dynamic(() => import("@/components/home/BrandsPartners"));
const DealerOpportunity = dynamic(() => import("@/components/home/DealerOpportunity"));
const ContactCTA = dynamic(() => import("@/components/home/ContactCTA"));

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <Hero />
      <AboutPreview />
      <ProductCategories />
      <FeaturedProducts products={featuredProducts} />
      <BrandsPartners />
      <DealerOpportunity />
      <ContactCTA />
    </>
  );
}
