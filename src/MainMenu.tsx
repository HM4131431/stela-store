import { Phone, ShieldCheck, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

type MenuOption = {
  icon: typeof ShoppingBag;
  label: string;
  screen: 'products' | 'cart' | 'contact' | 'admin';
};

const OPTIONS: MenuOption[] = [
  { icon: ShoppingBag, label: 'محصولات', screen: 'products' },
  { icon: ShoppingCart, label: 'سبد خرید', screen: 'cart' },
  { icon: Phone, label: 'تماس با ما', screen: 'contact' },
  { icon: ShieldCheck, label: 'پنل مدیریت', screen: 'admin' },
];

export default function MainMenu({
  onNavigate,
}: {
  onNavigate: (s: 'products' | 'cart' | 'contact' | 'admin') => void;
}) {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      setPointer({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center gap-8 sm:flex-row sm:flex-wrap sm:gap-12 md:gap-16">
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.3),rgba(168,200,255,0.16)_28%,rgba(255,160,185,0.12)_48%,transparent_72%)] blur-3xl" />
      </div>

      {OPTIONS.map(({ icon: Icon, label, screen }, i) => (
        <button
          key={label}
          onClick={() => onNavigate(screen)}
          className="group relative flex cursor-pointer flex-col items-center gap-5 opacity-0 animate-[fadeInUp_.6s_ease-out_forwards]"
          style={{
            animationDelay: `${0.3 + i * 0.15}s`,
            transform: `translate3d(${pointer.x * (i + 1) * 5}px, ${pointer.y * (i + 1) * 5}px, 0)`,
            transition: 'transform 300ms ease',
          }}
        >
          <span className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.7),rgba(173,211,255,0.24)_38%,rgba(255,190,214,0.12)_68%,transparent_100%)] opacity-0 transition duration-300 group-hover:opacity-100" />
          <span
            className="flex h-28 w-28 items-center justify-center rounded-full border border-white/40 bg-white/40 text-neutral-800 shadow-[0_18px_45px_rgba(93,77,138,0.18)] backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-white/80 group-hover:shadow-[0_24px_55px_rgba(137,107,186,0.25)] sm:h-32 sm:w-32"
            style={{
              transform: `translate3d(${pointer.x * (i + 1) * 6}px, ${pointer.y * (i + 1) * 6}px, 0)`,
              boxShadow: '0 18px 45px rgba(113, 117, 183, 0.18), 0 0 32px rgba(255, 190, 214, 0.18)',
            }}
          >
            <Icon size={52} strokeWidth={1.5} />
          </span>
          <span className="text-2xl tracking-wide text-neutral-900 sm:text-3xl">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

