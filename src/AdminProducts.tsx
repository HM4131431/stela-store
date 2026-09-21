import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  BadgeDollarSign,
  ImageIcon,
  Layers3,
  Package,
  PlusCircle,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  CATEGORIES,
  getStoredProducts,
  removeCommentsForProduct,
  saveProducts,
  type Product,
  type ProductCategory,
} from './products';

type ProductDraft = {
  name: string;
  category: ProductCategory;
  image: string;
  price: string;
  description: string;
  specs: string;
  available: boolean;
  featured: boolean;
};

const emptyDraft: ProductDraft = {
  name: '',
  category: 'tables',
  image: '',
  price: '',
  description: '',
  specs: '',
  available: true,
  featured: false,
};

const normalizePriceText = (value: string) => {
  const clean = String(value)
    .replace(/تومان|Toman|tomans/gi, '')
    .replace(/٬|,/g, '')
    .trim();

  if (!clean) return 'قیمت وارد نشده';

  const digitsOnly = clean.replace(/[۰-۹]/g, (char) =>
    '۰۱۲۳۴۵۶۷۸۹'.indexOf(char).toString(),
  ).replace(/\D/g, '');

  if (!digitsOnly) return clean || 'قیمت وارد نشده';

  const numeric = Number(digitsOnly);
  if (!Number.isFinite(numeric) || numeric <= 0) return clean || 'قیمت وارد نشده';

  return `${new Intl.NumberFormat('en-US').format(numeric)} تومان`;
};

const formatPrice = (value: string) => {
  return normalizePriceText(value);
};

export default function AdminProducts() {
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'add' | 'delete'>('add');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const totalValue = useMemo(() => {
    return products.reduce((sum, product) => {
      const value = Number(String(product.price).replace(/\D/g, ''));
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
  }, [products]);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setDraft((current) => ({ ...current, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const addProduct = () => {
    if (!draft.name.trim() || !draft.image.trim() || !draft.price.trim()) {
      setError('نام محصول، عکس و قیمت الزامی هستند.');
      return;
    }

    const specs = draft.specs
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const nextProduct: Product = {
      id: `custom-${Date.now()}`,
      name: draft.name.trim(),
      category: draft.category,
      image: draft.image.trim(),
      description: draft.description.trim() || 'محصولی جدید از فروشگاه Stela Design',
      price: normalizePriceText(draft.price),
      available: draft.available,
      featured: draft.featured,
      specs: specs.length ? specs : ['جنس کیفیت‌دار', 'طراحی مدرن', 'تحویل سریع'],
      comments: [],
    };

    const nextProducts = [...products, nextProduct];
    saveProducts(nextProducts);
    setProducts(nextProducts);
    setDraft(emptyDraft);
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeProduct = (id: string) => {
    const nextProducts = products.filter((product) => product.id !== id);
    saveProducts(nextProducts);
    removeCommentsForProduct(id);
    setProducts(nextProducts);
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
              dashboard
            </p>
            <h1 className="font-serif text-3xl text-neutral-900 sm:text-4xl">
              پنل مدیریت پست‌ها
            </h1>
          </div>

          <button className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-neutral-900 hover:text-neutral-900">
            <Sparkles size={16} />
            نسخه پیش‌نمایش
          </button>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between text-neutral-500">
              <Package size={18} />
              <span className="text-xs uppercase tracking-[0.2em]">total</span>
            </div>
            <p className="text-2xl font-serif text-neutral-900">{products.length}</p>
            <p className="mt-2 text-sm text-neutral-500">محصول ثبت‌شده</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between text-neutral-500">
              <Layers3 size={18} />
              <span className="text-xs uppercase tracking-[0.2em]">categories</span>
            </div>
            <p className="text-2xl font-serif text-neutral-900">{CATEGORIES.length}</p>
            <p className="mt-2 text-sm text-neutral-500">دسته‌بندی فعال</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between text-neutral-500">
              <BadgeDollarSign size={18} />
              <span className="text-xs uppercase tracking-[0.2em]">inventory</span>
            </div>
            <p className="text-2xl font-serif text-neutral-900">
              {new Intl.NumberFormat('fa-IR').format(totalValue)}
            </p>
            <p className="mt-2 text-sm text-neutral-500">جمع قیمت محصولات</p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {[
            {
              id: 'add' as const,
              label: 'افزودن پست',
              description: 'ثبت پست جدید با عکس، قیمت و توضیحات',
              icon: <PlusCircle size={22} />,
            },
            {
              id: 'delete' as const,
              label: 'حذف پست',
              description: 'دیدن لیست پست‌ها و حذف هر مورد',
              icon: <Trash2 size={22} />,
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-3xl border p-5 text-right shadow-sm transition ${
                tab === item.id
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-900'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${
                  tab === item.id ? 'bg-white/10 text-white' : 'bg-neutral-100 text-neutral-900'
                }`}>
                  {item.icon}
                </span>
              </div>
              <h2 className="font-serif text-2xl">{item.label}</h2>
              <p className={`mt-2 text-sm ${tab === item.id ? 'text-neutral-200' : 'text-neutral-500'}`}>
                {item.description}
              </p>
            </button>
          ))}
        </div>

        {tab === 'add' ? (
          <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white">
                <PlusCircle size={18} />
              </div>
              <h2 className="font-serif text-2xl text-neutral-900">افزودن پست جدید</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-2 block text-sm text-neutral-700">نام محصول</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="مثلاً میز آرتیستی"
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 outline-none transition focus:border-neutral-900 focus:bg-white"
                />
              </label>

              <label>
                <span className="mb-2 block text-sm text-neutral-700">دسته‌بندی</span>
                <select
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      category: e.target.value as ProductCategory,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 outline-none transition focus:border-neutral-900 focus:bg-white"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-sm text-neutral-700">قیمت</span>
                <input
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                  placeholder="مثلاً 2500000 تومان"
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 outline-none transition focus:border-neutral-900 focus:bg-white"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm text-neutral-700">عکس محصول</span>
                <div className="flex flex-col gap-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-3 sm:flex-row sm:items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-neutral-600 file:mr-4 file:rounded-full file:border-0 file:bg-neutral-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
                  />
                  <input
                    value={draft.image}
                    onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                    placeholder="یا لینک عکس وارد کنید"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 outline-none transition focus:border-neutral-900"
                  />
                </div>
              </label>

              {draft.image && (
                <div className="md:col-span-2 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
                  <img
                    src={draft.image}
                    alt="پیش‌نمایش محصول"
                    className="h-56 w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm text-neutral-700">توضیحات</span>
                <textarea
                  rows={4}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  placeholder="توضیحات محصول، ابعاد، جنس و مزیت‌ها"
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 outline-none transition focus:border-neutral-900 focus:bg-white"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-sm text-neutral-700">مشخصات</span>
                <textarea
                  rows={4}
                  value={draft.specs}
                  onChange={(e) => setDraft({ ...draft, specs: e.target.value })}
                  placeholder={'هر مشخصه را در یک خط جدا بنویسید\nابعاد: 120 × 60\nجنس: چوبی\nرنگ: سفید'}
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 outline-none transition focus:border-neutral-900 focus:bg-white"
                />
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={draft.available}
                  onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-400"
                />
                محصول موجود است
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-400"
                />
                featured
              </label>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={addProduct}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-base font-medium text-white transition hover:bg-neutral-700"
            >
              <PlusCircle size={18} />
              افزودن پست
            </button>
          </section>
        ) : (
          <aside className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-900">
                <ImageIcon size={18} />
              </div>
              <h2 className="font-serif text-2xl text-neutral-900">حذف پست‌ها</h2>
            </div>

            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
                  هنوز محصولی اضافه نشده است.
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="flex gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="truncate font-medium text-neutral-900">{product.name}</p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {CATEGORIES.find((cat) => cat.slug === product.category)?.name || 'دسته نامشخص'}
                          </p>
                        </div>

                        <button
                          onClick={() => removeProduct(product.id)}
                          className="rounded-full p-2 text-neutral-500 transition hover:bg-white hover:text-red-600"
                          title="حذف پست"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-neutral-800">
                          {formatPrice(product.price)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] ${
                            product.available
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-neutral-200 text-neutral-600'
                          }`}
                        >
                          {product.available ? 'موجود' : 'نا موجود'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
