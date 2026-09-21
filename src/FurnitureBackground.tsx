import React, { useEffect, useState } from 'react';

type Point = {
  x: number;
  y: number;
};

const FurnitureBackground: React.FC = () => {
  const [mouse, setMouse] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const polygonStyle = (left: string, top: string, width: string, height: string, bg: string, rotate = 0) => ({
    position: 'absolute' as const,
    left,
    top,
    width,
    height,
    background: bg,
    opacity: 0.72,
    transform: `translate3d(${mouse.x * 16}px, ${mouse.y * 16}px, 0) rotate(${rotate}deg)`,
    transition: 'transform 300ms ease',
    clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
  });

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        background:
          'linear-gradient(120deg, #f4c3dd 0%, #d8caee 28%, #d9ecf8 52%, #cfeef2 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 20% 18%, rgba(255,255,255,0.38), transparent 20%), radial-gradient(circle at 78% 22%, rgba(255,255,255,0.18), transparent 24%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12), transparent 30%)',
        }}
      />

      <div style={polygonStyle('0%', '0%', '56%', '52%', 'linear-gradient(135deg, rgba(242,177,218,0.95), rgba(194,170,240,0.78))', 0)} />
      <div style={polygonStyle('18%', '10%', '64%', '58%', 'linear-gradient(135deg, rgba(210,183,230,0.85), rgba(216,215,247,0.72))', 12)} />
      <div style={polygonStyle('42%', '8%', '60%', '42%', 'linear-gradient(135deg, rgba(203,227,245,0.72), rgba(179,232,227,0.68))', -10)} />
      <div style={polygonStyle('12%', '38%', '70%', '58%', 'linear-gradient(135deg, rgba(238,190,216,0.7), rgba(208,220,249,0.68))', -18)} />
      <div style={polygonStyle('46%', '42%', '58%', '57%', 'linear-gradient(135deg, rgba(177,220,235,0.72), rgba(205,204,242,0.62))', 8)} />
      <div style={polygonStyle('0%', '50%', '60%', '52%', 'linear-gradient(135deg, rgba(244,192,219,0.8), rgba(201,214,250,0.7))', 10)} />
      <div style={polygonStyle('34%', '58%', '62%', '44%', 'linear-gradient(135deg, rgba(196,230,242,0.75), rgba(211,191,236,0.76))', -14)} />

      <div
        style={{
          position: 'absolute',
          inset: '10% 10% auto 10%',
          height: '74%',
          borderRadius: '28px',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.06)',
          transform: `perspective(1600px) rotateX(${mouse.y * 1.2}deg) rotateY(${mouse.x * 1}deg)`,
          transition: 'transform 350ms ease',
        }}
      />
    </div>
  );
};

export default FurnitureBackground;