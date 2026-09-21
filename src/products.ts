export type ProductCategory = 'tables' | 'shelves' | 'stands' | 'clothes-racks';

export type ProductComment = {
  id: string;
  name: string;
  text: string;
  createdAt: string;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  image: string;
  images?: string[];
  description?: string;
  dimensions?: string;
  materials?: string[];
  colors?: string[];
  price: string;
  available: boolean;
  featured?: boolean;
  specs?: string[];
  comments?: ProductComment[];
};

const p = (
  id: string,
  name: string,
  category: ProductCategory,
  image: string,
  description: string,
  price: string,
): Product => ({
  id,
  name,
  category,
  image,
  description,
  price,
  available: true,
  specs: ['طراحی مینیمال', 'جنس باکیفیت', 'تحویل سریع'],
  comments: [],
});

export const PRODUCTS: Product[] = [];

export type CategoryInfo = {
  slug: ProductCategory;
  name: string;
  description: string;
};

export const CATEGORIES: CategoryInfo[] = [
  { slug: 'tables', name: 'میز', description: 'میزهای مینیمال و کاربردی' },
  { slug: 'shelves', name: 'شلف و قفسه', description: 'شلف و قفسه‌های دیواری و ایستاده' },
  { slug: 'stands', name: 'استند', description: 'استندهای نمایشی و کاربردی' },
  { slug: 'clothes-racks', name: 'رگال', description: 'رگال‌های لباس و استندهای آویز' },
];

const STORAGE_KEY = 'stela-products';
const COMMENTS_KEY = 'stela-comments';
const RESET_KEY = 'stela-reset-demo-catalog';

function clearDemoCatalogOnce() {
  if (typeof window === 'undefined') return;

  if (window.localStorage.getItem(RESET_KEY) === 'done') return;

  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(COMMENTS_KEY);
  window.localStorage.setItem(RESET_KEY, 'done');
}

clearDemoCatalogOnce();

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean).map((product) => ({
      ...product,
      specs: Array.isArray(product.specs) ? product.specs : [product.description || 'محصول جدید'],
      comments: Array.isArray(product.comments) ? product.comments : [],
    }));
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getCommentsForProduct(productId: string): ProductComment[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(COMMENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const comments = Array.isArray(parsed[productId]) ? parsed[productId] : [];
    return comments.filter(Boolean);
  } catch {
    return [];
  }
}

export function saveProductComments(productId: string, comments: ProductComment[]) {
  if (typeof window === 'undefined') return;

  try {
    const raw = window.localStorage.getItem(COMMENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[productId] = comments;
    window.localStorage.setItem(COMMENTS_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
}

export function addCommentToProduct(
  productId: string,
  comment: Omit<ProductComment, 'id' | 'createdAt'>,
) {
  const comments = getCommentsForProduct(productId);
  const nextComment: ProductComment = {
    ...comment,
    id: `comment-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  saveProductComments(productId, [nextComment, ...comments]);
  return nextComment;
}

export function removeCommentsForProduct(productId: string) {
  if (typeof window === 'undefined') return;

  try {
    const raw = window.localStorage.getItem(COMMENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    delete parsed[productId];
    window.localStorage.setItem(COMMENTS_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
}

export function getAllProducts(): Product[] {
  return [...PRODUCTS, ...getStoredProducts()];
}

export function getProductsByCategory(c: ProductCategory) {
  return getAllProducts().filter((p) => p.category === c);
}
