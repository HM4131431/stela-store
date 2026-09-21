import React, { useEffect, useState } from 'react';
import Welcome from './Welcome';
import MainMenu from './MainMenu';
import ProductsScreen from './ProductsScreen';
import { ProductCategoryPage } from './ProductCategoryPage';
import CartScreen from './CartScreen';
import ContactScreen from './ContactScreen';
import AdminProducts from './AdminProducts';
import FurnitureBackground from './FurnitureBackground';
import PaymentGatewayScreen from './PaymentGatewayScreen';
import type { ProductCategory } from './products';

const BASE = '/';
const ADMIN_SECRET = 'stela-admin-2026';
const ADMIN_PASSWORD = '980107';

const joinBasePath = (p = '/') => {
  const clean = p.startsWith('/') ? p : `/${p}`;
  if (BASE === '/') return clean;
  return `${BASE}${clean === '/' ? '' : clean}`;
};

const path = () => {
  if (new URLSearchParams(window.location.search).get('admin') === ADMIN_SECRET) return '/admin/products';
  const p = window.location.pathname;
  if (BASE === '/') return p || '/';
  return p.startsWith(BASE) ? p.slice(BASE.length) || '/' : p;
};

const getRedirectPath = () => {
  const redirect = new URLSearchParams(window.location.search).get('redirect');
  if (!redirect) return null;
  return redirect.startsWith('/') ? redirect : `/${redirect}`;
};

export default function App() {
  const [s, setS] = useState<any>('welcome');
  const [cat, setCat] = useState<ProductCategory | null>(null);
  const [fade, setFade] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const nav = (next: any, p = '/') => {
    setFade(true);

    setTimeout(() => {
      history.pushState({}, '', joinBasePath(p));
      setS(next);
      setFade(false);
    }, 600);
  };

  useEffect(() => {
    const redirect = getRedirectPath();
    if (redirect) {
      const nextUrl = `${BASE}${redirect === '/' ? '' : redirect}`;
      history.replaceState({}, '', nextUrl);
    }

    const h = () => {
      const p = path();
      const isAdminRequest = new URLSearchParams(window.location.search).get('admin') === ADMIN_SECRET;

      if (p === '/admin/products' && isAdminRequest) {
        setAdminUnlocked(adminPassword === ADMIN_PASSWORD || localStorage.getItem('stela-admin-pass') === ADMIN_PASSWORD);
        setS(adminPassword === ADMIN_PASSWORD || localStorage.getItem('stela-admin-pass') === ADMIN_PASSWORD ? 'admin' : 'welcome');
        return;
      }

      const m = p.match(
        /^\/products\/(tables|shelves|stands|clothes-racks)$/
      );

      if (m) {
        setCat(m[1] as ProductCategory);
        setS('cat');
      } else if (p === '/products') {
        setS('products');
      } else if (p === '/cart') {
        setS('cart');
      } else if (p === '/payment') {
        setS('payment');
      } else if (p === '/contact') {
        setS('contact');
      } else if (p === '/') {
        setS('welcome');
      } else {
        setS('menu');
      }
    };

    h();
    addEventListener('popstate', h);

    return () => removeEventListener('popstate', h);
  }, [adminPassword]);

  const submitAdminPassword = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      localStorage.setItem('stela-admin-pass', ADMIN_PASSWORD);
      setAdminUnlocked(true);
      setS('admin');
      return;
    }

    setAdminPassword('');
    setAdminUnlocked(false);
    setS('welcome');
  };

  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <FurnitureBackground />
      </div>

      <main
        className={`relative z-10 min-h-screen transition-all duration-700 ${
          fade ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {s === 'welcome' && (
          (() => {
            const isAdminRoute = new URLSearchParams(window.location.search).get('admin') === ADMIN_SECRET;

            if (isAdminRoute) {
              return (
                <div className="flex min-h-screen items-center justify-center px-6">
                  <div className="rounded-[32px] border border-white/40 bg-white/30 p-8 text-center shadow-[0_25px_80px_rgba(93,77,138,0.12)] backdrop-blur-lg">
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
                      admin access
                    </p>
                    <h1 className="mb-6 font-serif text-3xl text-neutral-900">ورود به پنل مدیریت</h1>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="رمز عبور را وارد کنید"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-right outline-none transition focus:border-neutral-900"
                    />
                    <button
                      onClick={submitAdminPassword}
                      className="mt-5 w-full rounded-xl bg-neutral-900 px-5 py-3 text-base font-medium text-white transition hover:bg-neutral-700"
                    >
                      ورود
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <Welcome go={() => { setS('menu'); history.pushState({}, '', joinBasePath('/menu')); }} />
            );
          })()
        )}

        {s === 'menu' && (
          <div className="relative min-h-screen flex items-center justify-center px-6">
            <div className="absolute top-6 left-6 sm:top-8 sm:left-10 z-20">
              <span className="text-xs sm:text-sm tracking-[.3em] text-neutral-900 font-serif uppercase">
                Stela Design
              </span>
            </div>

            <div className="relative z-10">
              <MainMenu
                onNavigate={(x) =>
                  nav(
                    x,
                    x === 'products'
                      ? '/products'
                      : x === 'cart'
                      ? '/cart'
                      : '/contact'
                  )
                }
              />
            </div>
          </div>
        )}

        {s === 'products' && (
          <ProductsScreen
            onBack={() => nav('menu')}
            onNavigateCategory={(c) => {
              setCat(c);
              nav('cat', `/products/${c}`);
            }}
          />
        )}

        {s === 'cat' && cat && (
          <ProductCategoryPage
            category={cat}
            onBackToProducts={() => nav('products', '/products')}
            onBackToMenu={() => nav('menu')}
          />
        )}

        {s === 'cart' && (
          <CartScreen
            onBackToProducts={() => nav('products', '/products')}
            onBackToMenu={() => nav('menu')}
          />
        )}

        {s === 'admin' && (
          (() => {
            if (adminUnlocked || localStorage.getItem('stela-admin-pass') === ADMIN_PASSWORD) {
              return <AdminProducts />;
            }

            return (
              <div className="flex min-h-screen items-center justify-center px-6">
                <div className="rounded-[32px] border border-white/40 bg-white/30 p-8 text-center shadow-[0_25px_80px_rgba(93,77,138,0.12)] backdrop-blur-lg">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
                    access denied
                  </p>
                  <h1 className="mb-4 font-serif text-3xl text-neutral-900">دسترسی محدود</h1>
                  <button
                    onClick={() => {
                      setAdminPassword('');
                      setAdminUnlocked(false);
                      setS('welcome');
                      history.pushState({}, '', joinBasePath('/'));
                    }}
                    className="rounded-xl bg-neutral-900 px-5 py-3 text-base font-medium text-white transition hover:bg-neutral-700"
                  >
                    بازگشت به صفحه اصلی
                  </button>
                </div>
              </div>
            );
          })()
        )}

        {s === 'contact' && (
          <ContactScreen onBack={() => nav('menu')} />
        )}

        {s === 'payment' && (
          <PaymentGatewayScreen onBack={() => nav('menu')} />
        )}
      </main>
    </>
  );
}
