import { MetadataRoute } from 'next';
import { products } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://skyzoneintl.com';

  // Core static routes
  const routes = ['', '/about', '/contact', '/products'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic product routes
  const productRoutes = products
    .filter(product => product.published !== false)
    .map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
  }));

  return [...routes, ...productRoutes];
}
