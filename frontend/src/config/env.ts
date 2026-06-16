/**
 * Centralized Environment Configuration Manager for Next.js Frontend
 * Handles reading of process.env variables, type safety, and fallback defaults.
 */

export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // Fallbacks based on environment/runtime context (SSR vs Browser)
  if (typeof window === 'undefined') {
    return 'http://localhost:8000/api';
  }
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api';
  }
  return 'https://api.skyzoneintl.com/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';
