export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Books',
  'Toys',
] as const;

export const PRODUCT_REVALIDATION_TIME = 3600; // 1 hour for ISR
export const LOW_STOCK_THRESHOLD = 10;

export const API_ROUTES = {
  PRODUCTS: '/api/products',
  PRODUCT_BY_SLUG: (slug: string) => `/api/products/${slug}`,
  ADMIN_PRODUCTS: '/api/admin/products',
  AUTH: '/api/auth',
} as const;

export const APP_ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  ADMIN_PRODUCT: (id: string) => `/admin/products/${id}`,
  LOGIN: '/login',
  RECOMMENDATIONS: '/recommendations',
} as const;

export const ITEMS_PER_PAGE = 12;

