import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const CART_KEY = 'stela-cart';

type CartLine = {
  productId: string;
  name: string;
  image: string;
  price: string;
  quantity: number;
};

const parsePrice = (value: string) => {
  const digits = String(value || '')
    .replace(/تومان|Toman|tomans/gi, '')
    .replace(/٬|,/g, '')
    .replace(/[۰-۹]/g, (char) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(char).toString())
    .replace(/\D/g, '');

  return Number(digits || '0');
};

const formatPrice = (value: number) => `${new Intl.NumberFormat('en-US').format(value)} تومان`;

export default function CartScreen({ onBackToProducts, onBackToMenu }: { onBackToProducts: () => void; onBackToMenu: () => void }) {
  const [items, setItems] = useState<CartLine[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = JSON.parse(window.localStorage.getItem(CART_KEY) || '[]') as CartLine[];
    setItems(Array.isArray(stored) ? stored : []);
  }, []);

  const updateCart = (nextItems: CartLine[]) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(CART_KEY, JSON.stringify(nextItems));
    }
    setItems(nextItems);
  };

  const changeQuantity = (productId: string, delta: number) => {
    const next = items
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      )
      .filter((item) => item.quantity > 0);

    updateCart(next);
  };

  const removeItem = (productId: string) => {
    updateCart(items.filter((item) => item.productId !== productId));
  };

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0),
    [items],
  );

  const submitToGateway = () => {
    if (!items.length) return;

    const payload = {
      createdAt: new Date().toISOString(),
      items: items.map((item) => ({
        id: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: parsePrice(item.price),
      })),
      total: totalPrice,
      totalItems,
    };

    if (typeof window !== 'undefined') {
      const gateway = new URL(`${window.location.origin}${'/stela-store'}/payment`);
      gateway.searchParams.set('order', JSON.stringify(payload));
      gateway.searchParams.set('amount', String(totalPrice));
      window.localStorage.setItem('stela-last-order', JSON.stringify(payload));
      window.location.href = gateway.toString();
    }
  };

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

        <h1 className="mb-10 text-center font-serif text-3xl text-neutral-900 sm:text-4xl">سبد خرید</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/60 bg-white/40 text-neutral-800">
              <ShoppingCart size={36} />
            </div>
            <p className="font-serif text-lg text-neutral-800">سبد خرید شما خالی است</p>
            <button
              onClick={onBackToProducts}
              className="mt-2 border border-white/60 bg-white/40 px-8 py-3 text-sm text-neutral-900 transition hover:bg-white/55"
            >
              بازگشت به محصولات
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 rounded-[26px] border border-white/50 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.14))] p-4 shadow-[0_22px_45px_rgba(93,77,138,0.12)]">
                  <img src={item.image} alt={item.name} className="h-24 w-24 rounded-2xl object-cover" />

                  <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row">
                    <div className="min-w-0">
                      <h2 className="font-medium text-neutral-900">{item.name}</h2>
                      <p className="mt-1 text-sm text-neutral-700">{formatPrice(parsePrice(item.price))}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/35 px-2 py-1">
                        <button type="button" onClick={() => changeQuantity(item.productId, -1)} className="rounded-full p-1 text-neutral-800 hover:bg-white/40"><Minus size={15} /></button>
                        <span className="min-w-6 text-center text-sm text-neutral-900">{item.quantity}</span>
                        <button type="button" onClick={() => changeQuantity(item.productId, 1)} className="rounded-full p-1 text-neutral-800 hover:bg-white/40"><Plus size={15} /></button>
                      </div>

                      <button type="button" onClick={() => removeItem(item.productId)} className="rounded-full p-2 text-neutral-700 transition hover:bg-red-500/10 hover:text-red-600" aria-label="حذف محصول">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-[26px] border border-white/50 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.14))] p-5 shadow-[0_22px_45px_rgba(93,77,138,0.12)]">
              <h2 className="mb-4 font-serif text-2xl text-neutral-900">جمع سفارش</h2>

              <div className="space-y-3 text-sm text-neutral-700">
                <div className="flex justify-between">
                  <span>تعداد اقلام</span>
                  <strong className="text-neutral-900">{totalItems}</strong>
                </div>
                <div className="flex justify-between">
                  <span>جمع کل</span>
                  <strong className="text-neutral-900">{formatPrice(totalPrice)}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={submitToGateway}
                className="mt-6 w-full rounded-xl bg-neutral-900 px-5 py-3 text-base font-medium text-white transition hover:bg-neutral-700"
              >
                ثبت سفارش و پرداخت
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
