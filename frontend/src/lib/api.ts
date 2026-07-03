import { products, productCategories } from "@/data/products";
import type { Product, ProductCategory } from "@/data/products";

/**
 * Centralized API & Data Service Layer for Products.
 * 
 * In the future, these methods can be modified to make async network requests
 * (e.g., fetch from a database, REST API, or Headless CMS) without requiring
 * modifications in the page or component files that consume them.
 */

/**
 * Retrieves all products.
 */
export async function getProducts(): Promise<Product[]> {
  // Simulate network/db delay (optional, currently direct resolver)
  return products;
}

/**
 * Retrieves a single product by its slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

/**
 * Retrieves all product categories.
 */
export async function getProductCategories(): Promise<ProductCategory[]> {
  return productCategories;
}

/**
 * Retrieves related products for a given category (excluding the current product).
 */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

/**
 * Retrieves featured products by picking the top product from each category.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.categorySlug] = (acc[p.categorySlug] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categories = Array.from(new Set(products.map((p) => p.categorySlug)))
    .sort((a, b) => categoryCounts[b] - categoryCounts[a]);

  const groups: Record<string, typeof products> = {};
  categories.forEach((cat) => {
    groups[cat] = products
      .filter((p) => p.categorySlug === cat)
      .sort((a, b) => {
        if (a.published !== b.published) return a.published ? -1 : 1;
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
      });
  });

  const selected: typeof products = [];
  let index = 0;
  while (selected.length < 6) {
    let addedAny = false;
    for (const cat of categories) {
      if (groups[cat] && groups[cat].length > index) {
        selected.push(groups[cat][index]);
        addedAny = true;
        if (selected.length === 6) break;
      }
    }
    if (!addedAny) break;
    index++;
  }

  return selected.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }));
}

/**
 * Retrieves a stripped-down summary version of all products to reduce client JS bundle size.
 */
export async function getProductSummaries() {
  return products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    categorySlug: p.categorySlug,
    price: p.price,
    badge: p.badge,
    image: p.image,
    published: p.published,
    shortDescription: p.shortDescription,
    // Only pass the first 2 specs for the preview card
    specs: p.specs.slice(0, 2),
  }));
}

