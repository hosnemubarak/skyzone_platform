export const dynamic = 'force-static';
import nextDynamic from "next/dynamic";
import Hero from "@/components/home/Hero";

import { getFeaturedProducts } from "@/lib/api";

// Lazy load below-the-fold components for faster initial page load (code splitting)
const AboutPreview = nextDynamic(() => import("@/components/home/AboutPreview"));
const ProductCategories = nextDynamic(() => import("@/components/home/ProductCategories"));
const FeaturedProducts = nextDynamic(() => import("@/components/home/FeaturedProducts"));
const BrandsPartners = nextDynamic(() => import("@/components/home/BrandsPartners"));
const DealerOpportunity = nextDynamic(() => import("@/components/home/DealerOpportunity"));
const ContactCTA = nextDynamic(() => import("@/components/home/ContactCTA"));

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
