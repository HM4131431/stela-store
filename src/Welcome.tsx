import { useEffect, useState } from 'react';

export default function Welcome({ go }: { go: () => void }) {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [showClick, setShowClick] = useState(false);

  const first = 'WELCOME TO';
  const second = 'STELA DESIGN';

  useEffect(() => {
    let i = 0;

    const t1 = setInterval(() => {
      i++;
      setText1(first.slice(0, i));

      if (i >= first.length) {
        clearInterval(t1);

        let j = 0;

        const t2 = setInterval(() => {
          j++;
          setText2(second.slice(0, j));

          if (j >= second.length) {
            clearInterval(t2);
            setTimeout(() => setShowClick(true), 500);
          }
        }, 90);
      }
    }, 90);

    return () => clearInterval(t1);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <style>{`
        @keyframes drift {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(18px, -12px, 0) scale(1.04); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes waveFloat {
          0%, 100% { transform: translateX(0) translateY(0) scaleY(1); }
          50% { transform: translateX(25px) translateY(-12px) scaleY(1.04); }
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(255, 182, 176, 0.22); }
          50% { box-shadow: 0 0 60px rgba(255, 182, 176, 0.42); }
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(184,130,216,0.28),transparent_22%),radial-gradient(circle_at_72%_28%,rgba(255,136,126,0.12),transparent_20%),linear-gradient(135deg,#120d2c_0%,#1d1a4c_35%,#1a1a4a_100%)]" />

      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute left-[-5%] top-[34%] h-[50vw] w-[50vw] min-h-[420px] min-w-[420px] rounded-full opacity-95"
          style={{
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.45), rgba(201,124,255,0.86) 18%, rgba(131,65,199,0.95) 56%, rgba(67,40,128,0.98) 100%)',
            animation: 'drift 16s ease-in-out infinite',
          }}
        />

        <div className="absolute left-[18%] right-[-18%] top-[31%] h-[52%] rounded-[40%] border border-white/15 bg-[radial-gradient(circle_at_40%_25%,rgba(255,160,146,0.92),rgba(245,118,137,0.94)_18%,rgba(120,81,214,0.86)_58%,rgba(61,48,141,0.92)_100%)] opacity-90"
          style={{
            transform: 'rotate(-10deg)',
            animation: 'waveFloat 18s ease-in-out infinite',
          }}
        />

        <div className="absolute left-[-10%] right-[10%] bottom-[-18%] h-[48%] rounded-[42%] border border-white/15 bg-[radial-gradient(circle_at_32%_20%,rgba(160,130,255,0.62),rgba(84,67,170,0.9)_52%,rgba(35,29,85,0.95)_100%)] opacity-80"
          style={{
            transform: 'rotate(-15deg)',
            animation: 'waveFloat 22s ease-in-out infinite reverse',
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_48%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <button
          onClick={go}
          className="group flex cursor-pointer flex-col items-center"
        >
          <h1 className="min-h-[1.2em] font-serif text-3xl tracking-[0.2em] text-white/90 sm:text-4xl md:text-5xl">
            {text1}
          </h1>

          <h2 className="mt-2 min-h-[1.2em] font-serif text-4xl tracking-[0.11em] text-white sm:text-5xl md:text-7xl">
            {text2}
          </h2>

          <span
            className={`mt-10 inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-6 py-3 text-[10px] font-medium tracking-[0.35em] text-white/85 uppercase backdrop-blur-sm transition-all duration-700 ${
              showClick ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            } group-hover:border-white/50 group-hover:bg-white/10 group-hover:tracking-[0.42em]`}
            style={{ animation: showClick ? 'pulseGlow 2.8s ease-in-out infinite' : 'none' }}
          >
            CLICK HERE
          </span>
        </button>
      </div>
    </div>
  );
}
