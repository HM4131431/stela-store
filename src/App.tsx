import React, { useEffect, useState } from 'react';
import MainMenu from './MainMenu';
import ProductsScreen from './ProductsScreen';
import { ProductCategoryPage } from './ProductCategoryPage';
import CartScreen from './CartScreen';
import ContactScreen from './ContactScreen';
import FurnitureBackground from './FurnitureBackground';
import type { ProductCategory } from './products';

const BASE = '/stela-store';

const path = () => {
  const p = window.location.pathname;
  return p.startsWith(BASE) ? p.slice(BASE.length) || '/' : p;
};

export default function App() {
  const [s, setS] = useState<any>('welcome');
  const [cat, setCat] = useState<ProductCategory | null>(null);
  const [fade, setFade] = useState(false);

  const nav = (next: any, p = '/') => {
    setFade(true);

    setTimeout(() => {
      history.pushState({}, '', BASE + p);
      setS(next);
      setFade(false);
    }, 600);
  };

  useEffect(() => {
    const h = () => {
      const p = path();

      const m = p.match(
        /^\/products\/(tables|shelves|stands|clothes-racks)$/
      );

      if (m) {
        setCat(m[1] as ProductCategory);
        setS('cat');
      } else if (p === '/products') {
        setS('products');
      } else {
        setS('menu');
      }
    };

    h();
    addEventListener('popstate', h);

    return () => removeEventListener('popstate', h);
  }, []);

  return (
    <>
      {/* لایه مستقل پس‌زمینه — همیشه روی کل سایت */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <FurnitureBackground />
      </div>

      {/* لایه مستقل محتوای سایت */}
      <main
        className={`relative z-10 min-h-screen transition-all duration-700 ${
          fade
            ? 'opacity-0 scale-95'
            : 'opacity-100 scale-100'
        }`}
      >


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
                      : '/'
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
            onBackToProducts={() =>
              nav('products', '/products')
            }
            onBackToMenu={() =>
              nav('menu')
            }
          />
        )}

        {s === 'cart' && (
          <CartScreen
            onBackToProducts={() =>
              nav('products', '/products')
            }
            onBackToMenu={() =>
              nav('menu')
            }
          />
        )}

        {s === 'contact' && (
          <ContactScreen
            onBack={() => nav('menu')}
          />
        )}

      </main>
    </>
  );
}
