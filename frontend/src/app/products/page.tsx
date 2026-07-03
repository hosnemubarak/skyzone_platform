export const dynamic = 'force-static';
import { Suspense } from "react";
import ProductsPageContent from "@/components/products/ProductsPageContent";
import { getProductSummaries } from "@/lib/api";

export const metadata = {
  title: "Products",
  description:
    "Browse Sky Zone International's complete range of solar panels, inverters, batteries, IPS/UPS systems, and electrical equipment. Quality certified products with nationwide delivery.",
};

export default async function ProductsPage() {
  const products = await getProductSummaries();
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-light" />}>
      <ProductsPageContent products={products} />
    </Suspense>
  );
}
