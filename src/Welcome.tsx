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
        }, 100);
      }
    }, 100);

    return () => clearInterval(t1);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <button
        onClick={go}
        className="group flex flex-col items-center cursor-pointer"
      >
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-[0.18em] text-neutral-900 min-h-[1.2em]">
          {text1}
        </h1>

        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-[0.12em] text-neutral-900 mt-2 min-h-[1.2em]">
          {text2}
        </h2>

        <span
          className={`mt-12 text-sm tracking-[0.35em] text-neutral-500 uppercase transition-all duration-700 ${
            showClick ? 'opacity-100' : 'opacity-0'
          } group-hover:text-neutral-900 group-hover:tracking-[0.45em]`}
        >
          CLICK HERE
        </span>
      </button>
    </div>
  );
}
