import React, { useEffect, useState } from "react";

type Point = {
  x: number;
  y: number;
};

const FurnitureBackground: React.FC = () => {
  const [mouse, setMouse] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", move, { passive: true });

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  const item = (
    x: number,
    y: number,
    size: number,
    depth: number,
    rotate: number
  ) => ({
    position: "absolute" as const,
    left: `${x}%`,
    top: `${y}%`,
    width: `${size}px`,
    height: `${size}px`,
    opacity: 0.18,
    transform: `translate3d(${mouse.x * depth}px, ${
      mouse.y * depth
    }px, 0) rotate(${rotate}deg)`,
    transition: "transform 350ms cubic-bezier(.22,.61,.36,1)",
  });

  // میز کوچک
  const Table = () => (
    <svg viewBox="0 0 160 120" width="100%" height="100%">
      <rect x="25" y="25" width="110" height="12" rx="4" fill="#9b8064" />
      <path
        d="M35 37L45 100M125 37L115 100"
        stroke="#252229"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M45 100H115"
        stroke="#252229"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );

  // شلف
  const Shelf = () => (
    <svg viewBox="0 0 160 140" width="100%" height="100%">
      <path
        d="M35 20V120M125 20V120"
        stroke="#252229"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <rect x="28" y="25" width="104" height="9" rx="3" fill="#9b8064" />
      <rect x="28" y="65" width="104" height="9" rx="3" fill="#b0977d" />
      <rect x="28" y="105" width="104" height="9" rx="3" fill="#9b8064" />

      <rect x="45" y="39" width="9" height="20" fill="#777" />
      <rect x="60" y="43" width="14" height="16" fill="#aaa" />
      <rect x="92" y="82" width="18" height="20" fill="#888" />
    </svg>
  );

  // رگال
  const Rack = () => (
    <svg viewBox="0 0 160 150" width="100%" height="100%">
      <path
        d="M35 125L55 30M125 125L105 30M55 30H105"
        stroke="#252229"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M65 45Q65 37 72 37Q79 37 79 45"
        fill="none"
        stroke="#777"
        strokeWidth="3"
      />

      <path
        d="M87 45Q87 37 94 37Q101 37 101 45"
        fill="none"
        stroke="#777"
        strokeWidth="3"
      />

      <path
        d="M58 47L68 55L66 91H52L54 57Z"
        fill="#a98291"
      />

      <path
        d="M80 47L90 54L88 96H74L76 56Z"
        fill="#8b8c9b"
      />

      <path
        d="M102 47L112 55L110 90H96L98 56Z"
        fill="#8d9c91"
      />

      <path
        d="M38 125H122"
        stroke="#252229"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,

        background:
          "radial-gradient(circle at 20% 20%, rgba(190,170,145,.10), transparent 28%)," +
          "radial-gradient(circle at 80% 70%, rgba(150,135,125,.07), transparent 30%)," +
          "linear-gradient(135deg,#fdfcf9 0%,#f8f6f2 50%,#f3f0eb 100%)",
      }}
    >
      {/* 1 - میز */}
      <div style={item(3, 7, 125, 5, -4)}>
        <Table />
      </div>

      {/* 2 - شلف */}
      <div style={item(21, 16, 115, 7, 3)}>
        <Shelf />
      </div>

      {/* 3 - رگال */}
      <div style={item(43, 5, 125, 9, -2)}>
        <Rack />
      </div>

      {/* 4 - میز */}
      <div style={item(72, 10, 115, 6, 3)}>
        <Table />
      </div>

      {/* 5 - شلف */}
      <div style={item(89, 25, 125, 8, -3)}>
        <Shelf />
      </div>

      {/* 6 - رگال */}
      <div style={item(5, 53, 130, 10, 2)}>
        <Rack />
      </div>

      {/* 7 - میز */}
      <div style={item(29, 67, 130, 12, -4)}>
        <Table />
      </div>

      {/* 8 - شلف */}
      <div style={item(57, 73, 120, 7, 4)}>
        <Shelf />
      </div>

      {/* 9 - رگال */}
      <div style={item(78, 55, 130, 11, -3)}>
        <Rack />
      </div>

      {/* 10 - میز */}
      <div style={item(88, 82, 125, 9, 3)}>
        <Table />
      </div>

      {/* نورهای بسیار ظریف */}
      <div
        style={{
          position: "absolute",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          left: "42%",
          top: "35%",
          background:
            "radial-gradient(circle,rgba(255,255,255,.7),transparent 70%)",
        }}
      />
    </div>
  );
};

export default FurnitureBackground;