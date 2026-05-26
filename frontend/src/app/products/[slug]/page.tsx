import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getProducts } from "@/lib/api";
import ProductDetailContent from "@/components/products/ProductDetailContent";
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
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Sky Zone International"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://skyzoneintl.com/products/${product.id}`,
      "priceCurrency": "BDT",
      "availability": product.published ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      "seller": {
        "@type": "Organization",
        "name": "Sky Zone International"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailContent product={product} relatedProducts={related} />
    </>
  );
}
