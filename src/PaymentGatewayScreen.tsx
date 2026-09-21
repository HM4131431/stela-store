import { ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';

type PaymentItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type PaymentOrder = {
  createdAt: string;
  items: PaymentItem[];
  total: number;
  totalItems: number;
};

const formatCurrency = (value: number) =>
  `${new Intl.NumberFormat('fa-IR').format(value)} تومان`;

export default function PaymentGatewayScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [paid, setPaid] = useState(false);

  const order = useMemo<PaymentOrder | null>(() => {
    if (typeof window === 'undefined') return null;

    const params = new URLSearchParams(window.location.search);
    const rawOrder = params.get('order');
    const amount = params.get('amount');

    if (!rawOrder) return null;

    try {
      const parsed = JSON.parse(rawOrder) as PaymentOrder;
      if (amount && Number(amount) > 0 && parsed.total !== Number(amount)) {
        parsed.total = Number(amount);
      }
      return parsed;
    } catch {
      try {
        const parsed = JSON.parse(decodeURIComponent(rawOrder)) as PaymentOrder;
        if (amount && Number(amount) > 0 && parsed.total !== Number(amount)) {
          parsed.total = Number(amount);
        }
        return parsed;
      } catch {
        return null;
      }
    }
  }, []);

  const total = Number(order?.total ?? 0);

  const submitPayment = () => {
    if (!order) return;

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('stela-last-order', JSON.stringify(order));
      window.localStorage.removeItem('stela-cart');
    }

    setPaid(true);
  };

  return (
    <div className="relative min-h-screen px-6 py-10 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))]" />

      <div className="mx-auto max-w-4xl rounded-[32px] border border-white/40 bg-white/25 p-4 shadow-[0_25px_80px_rgba(93,77,138,0.12)] backdrop-blur-lg sm:p-8">
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-sm font-medium tracking-[0.01em] text-neutral-800 transition-colors hover:text-neutral-950"
        >
          <ArrowLeft size={18} />
          بازگشت
        </button>

        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-600">
              secure payment
            </p>
            <h1 className="mt-2 font-serif text-3xl text-neutral-900 sm:text-4xl">
              درگاه پرداخت
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            <ShieldCheck size={16} />
            پرداخت امن
          </div>
        </div>

        {!order ? (
          <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white/40 p-8 text-center text-neutral-700">
            اطلاعات سفارش یافت نشد.
          </div>
        ) : paid ? (
          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-8 text-center">
            <CheckCircle2 className="mx-auto mb-4 text-emerald-600" size={52} />
            <h2 className="mb-3 font-serif text-3xl text-emerald-800">پرداخت با موفقیت انجام شد</h2>
            <p className="mb-6 text-neutral-700">
              شماره سفارش شما ثبت شد و درخواست شما در حال آماده‌سازی است.
            </p>
            <button
              onClick={onBack}
              className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-700"
            >
              بازگشت به فروشگاه
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-[28px] border border-white/50 bg-white/30 p-5">
              <h2 className="mb-4 font-serif text-2xl text-neutral-900">خلاصه سفارش</h2>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/40 px-3 py-3">
                    <div>
                      <p className="font-medium text-neutral-900">{item.name}</p>
                      <p className="text-sm text-neutral-600">تعداد: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-neutral-800">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/50 bg-white/30 p-5">
              <h2 className="mb-4 font-serif text-2xl text-neutral-900">جمع کل</h2>

              <div className="space-y-3 text-sm text-neutral-700">
                <div className="flex justify-between">
                  <span>تعداد اقلام</span>
                  <strong className="text-neutral-900">{order.totalItems}</strong>
                </div>
                <div className="flex justify-between">
                  <span>مبلغ قابل پرداخت</span>
                  <strong className="text-neutral-900">{formatCurrency(total)}</strong>
                </div>
              </div>

              <button
                onClick={submitPayment}
                className="mt-6 w-full rounded-xl bg-neutral-900 px-5 py-3 text-base font-medium text-white transition hover:bg-neutral-700"
              >
                تأیید و پرداخت
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
