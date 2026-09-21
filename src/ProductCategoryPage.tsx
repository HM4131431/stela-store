import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { Product, ProductCategory } from './products';
import { CATEGORIES, getProductsByCategory } from './products';
import { ProductGrid } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';

export function ProductCategoryPage({
  category,
  onBackToProducts,
  onBackToMenu,
}: {
  category: ProductCategory;
  onBackToProducts: () => void;
  onBackToMenu: () => void;
}) {
  const info = CATEGORIES.find((c) => c.slug === category);
  const products: Product[] = getProductsByCategory(category);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="relative min-h-screen px-6 py-10 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))]" />
      <div className="mx-auto max-w-5xl rounded-[32px] border border-white/40 bg-white/25 p-4 shadow-[0_25px_80px_rgba(93,77,138,0.12)] backdrop-blur-lg sm:p-8">
        <button
          onClick={onBackToMenu}
          className="mb-10 flex items-center gap-2 text-sm font-medium tracking-[0.01em] text-neutral-800 transition-colors hover:text-neutral-950"
        >
          <ArrowRight size={18} />
          بازگشت
        </button>

        <h1 className="mb-4 text-center font-serif text-3xl text-neutral-900 sm:text-4xl">
          {info?.name || 'محصولات'}
        </h1>
        {info?.description && (
          <p className="mb-12 text-center text-neutral-700">{info.description}</p>
        )}

        <div className="mb-12 flex justify-center">
          <button
            onClick={onBackToProducts}
            className="flex items-center gap-2 text-sm font-medium tracking-[0.01em] text-neutral-800 transition-colors hover:text-neutral-950"
          >
            <ArrowRight size={16} />
            بازگشت به محصولات
          </button>
        </div>

        {products.length ? (
          <ProductGrid
            products={products}
            onProductClick={(product) => setSelectedProduct(product)}
          />
        ) : (
          <p className="text-center font-serif text-lg text-neutral-700">
            به‌زودی محصولات این دسته اضافه می‌شوند
          </p>
        )}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}


