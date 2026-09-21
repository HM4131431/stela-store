import { ArrowRight, Instagram, Phone } from 'lucide-react';

export default function ContactScreen({ onBack }: { onBack: () => void }) {
  const items = [
    { I: Phone, l: '09375406950', h: 'tel:09375406950', kind: 'phone' },
    { I: Instagram, l: '@Stela_Design', h: 'https://www.instagram.com/Stela_Design/', kind: 'instagram' },
  ];

  return (
    <div className="relative min-h-screen px-6 py-10 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.08))]" />

      <div className="mx-auto max-w-5xl rounded-[32px] border border-white/40 bg-white/25 p-4 shadow-[0_25px_80px_rgba(93,77,138,0.12)] backdrop-blur-lg sm:p-8">
        <button
          onClick={onBack}
          className="mb-10 flex items-center gap-2 text-sm font-medium tracking-[0.01em] text-neutral-800 transition-colors hover:text-neutral-950"
        >
          <ArrowRight size={18} />
          بازگشت
        </button>

        <h1 className="mb-16 text-center font-serif text-3xl text-neutral-900 sm:text-4xl">تماس با ما</h1>

        <div className="flex flex-col items-center justify-center gap-12 sm:flex-row sm:gap-20">
          {items.map(({ I, l, h, kind }) => (
            <a
              key={l}
              href={h}
              target={h.startsWith('http') ? '_blank' : undefined}
              rel={h.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex flex-col items-center gap-5"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/60 bg-white/40 text-neutral-800 shadow-[0_18px_45px_rgba(145,126,181,0.18)] transition-all duration-300 group-hover:scale-110 group-hover:border-white/90">
                <I size={30} />
              </span>
              <span
                className={
                  kind === 'phone'
                    ? 'font-mono text-base font-semibold tracking-[0.08em] text-neutral-900 sm:text-lg'
                    : 'text-base font-bold tracking-[0.04em] text-neutral-900 sm:text-lg'
                }
              >
                {l}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

