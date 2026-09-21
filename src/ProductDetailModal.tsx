import { MessageSquare, Send, ShoppingCart, Star, X } from 'lucide-react';
import { useState } from 'react';
import type { Product, ProductComment } from './products';
import { addCommentToProduct, CATEGORIES, getCommentsForProduct } from './products';

const formatDisplayPrice = (value: string) => {
  const text = String(value || '').replace(/تومان|Toman|tomans/gi, '').trim();
  const digits = text.replace(/٬|,/g, '').replace(/[۰-۹]/g, (char) =>
    '۰۱۲۳۴۵۶۷۸۹'.indexOf(char).toString(),
  );
  const numeric = Number(digits.replace(/\D/g, ''));

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return value || 'قیمت وارد نشده';
  }

  return `${new Intl.NumberFormat('en-US').format(numeric)} تومان`;
};

const CART_KEY = 'stela-cart';

type CartLine = {
  productId: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
};

export function ProductDetailModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [commentDraft, setCommentDraft] = useState({ name: '', text: '' });
  const [comments, setComments] = useState<ProductComment[]>(() => getCommentsForProduct(product.id));
  const [quantity, setQuantity] = useState(1);

  const submitComment = () => {
    if (!commentDraft.name.trim() || !commentDraft.text.trim()) return;

    addCommentToProduct(product.id, {
      name: commentDraft.name.trim(),
      text: commentDraft.text.trim(),
    });

    setComments(getCommentsForProduct(product.id));
    setCommentDraft({ name: '', text: '' });
  };

  const addToCart = () => {
    if (typeof window === 'undefined') return;

    const current = JSON.parse(window.localStorage.getItem(CART_KEY) || '[]') as CartLine[];
    const existing = current.find((item) => item.productId === product.id);

    const next = existing
      ? current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      : [...current, {
          productId: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity,
        }];

    window.localStorage.setItem(CART_KEY, JSON.stringify(next));
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="font-serif text-2xl text-neutral-900">{product.name}</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-8 p-5 md:grid-cols-2 md:p-8">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
            <img src={product.image} alt={product.name} className="h-full min-h-[320px] w-full object-cover" />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-neutral-500">
                {CATEGORIES.find((category) => category.slug === product.category)?.name || product.category}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                {product.available ? 'موجود' : 'ناموجود'}
              </span>
            </div>

            <div>
              <p className="text-3xl font-serif text-neutral-900">{formatDisplayPrice(product.price)}</p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
              <span className="text-sm text-neutral-600">تعداد:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  className="h-9 w-9 rounded-full border border-neutral-300 text-lg text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                >
                  −
                </button>
                <span className="min-w-8 text-center font-medium text-neutral-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((current) => current + 1)}
                  className="h-9 w-9 rounded-full border border-neutral-300 text-lg text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={addToCart}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-base font-medium text-white transition hover:bg-neutral-700"
            >
              <ShoppingCart size={18} />
              افزودن به سبد خرید
            </button>

            <div>
              <h3 className="mb-3 text-lg font-medium text-neutral-900">توضیحات</h3>
              <p className="leading-8 text-neutral-600">
                {product.description || 'توضیحی برای این محصول ثبت نشده است.'}
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-medium text-neutral-900">مشخصات</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                {(product.specs && product.specs.length ? product.specs : ['جنس باکیفیت', 'طراحی کاربردی', 'امکان سفارش‌گذاری']).map((spec) => (
                  <li key={spec} className="flex items-center gap-2">
                    <Star size={14} className="text-neutral-700" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 p-5 md:p-8">
          <div className="mb-4 flex items-center gap-2 text-neutral-900">
            <MessageSquare size={18} />
            <h3 className="font-serif text-2xl">نظرات مشتریان</h3>
          </div>

          <div className="space-y-4">
            {comments.length ? (
              comments.map((comment) => (
                <div key={comment.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <strong className="text-neutral-900">{comment.name}</strong>
                    <span className="text-xs text-neutral-500">
                      {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                  <p className="leading-7 text-neutral-600">{comment.text}</p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
                هنوز نظری برای این محصول ثبت نشده است.
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[180px_1fr_auto]">
            <input
              value={commentDraft.name}
              onChange={(e) => setCommentDraft((current) => ({ ...current, name: e.target.value }))}
              placeholder="نام شما"
              className="rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 outline-none transition focus:border-neutral-900"
            />

            <input
              value={commentDraft.text}
              onChange={(e) => setCommentDraft((current) => ({ ...current, text: e.target.value }))}
              placeholder="نظر شما درباره این محصول"
              className="rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 outline-none transition focus:border-neutral-900"
            />

            <button
              onClick={submitComment}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              <Send size={16} />
              ارسال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
