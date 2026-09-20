export default function Welcome({ go }: { go: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <button
        onClick={go}
        className="group flex flex-col items-center cursor-pointer"
      >
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-[0.18em] text-neutral-900">
          WELCOME TO
        </h1>

        <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-[0.12em] text-neutral-900 mt-2">
          STELA DESIGN
        </h2>

        <span className="mt-12 text-sm tracking-[0.35em] text-neutral-500 uppercase transition-all duration-300 group-hover:text-neutral-900 group-hover:tracking-[0.45em]">
          CLICK HERE
        </span>
      </button>
    </div>
  );
}
