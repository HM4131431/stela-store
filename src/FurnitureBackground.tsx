import React, { useEffect, useState } from "react";

type Point = { x: number; y: number };

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const FurnitureBackground: React.FC = () => {
  const [mouse, setMouse] = useState<Point>({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setMouse({
          x: clamp((e.clientX / window.innerWidth - 0.5) * 2, -1, 1),
          y: clamp((e.clientY / window.innerHeight - 0.5) * 2, -1, 1),
        });
      });
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
    };
  }, []);

  const motion = (depth: number, tilt = 0) => ({
    transform: `translate3d(${mouse.x * depth}px, ${mouse.y * depth}px, 0) rotate(${mouse.x * tilt}deg)`,
    transition: "transform 220ms cubic-bezier(.22,.61,.36,1)",
  });

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        background:
          "radial-gradient(circle at 15% 18%, rgba(120,91,255,.13), transparent 27%)," +
          "radial-gradient(circle at 86% 18%, rgba(255,103,169,.12), transparent 28%)," +
          "radial-gradient(circle at 52% 92%, rgba(79,190,255,.09), transparent 34%)," +
          "linear-gradient(135deg,#fcfcff 0%,#f7f6fb 52%,#f1eff6 100%)",
      }}
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <filter id="bgBlur"><feGaussianBlur stdDeviation="50" /></filter>
        </defs>
        <circle cx="180" cy="160" r="160" fill="#8b70ff" opacity=".09" filter="url(#bgBlur)" />
        <circle cx="1390" cy="180" r="180" fill="#ff72ab" opacity=".08" filter="url(#bgBlur)" />
        <circle cx="800" cy="850" r="220" fill="#5bc7ff" opacity=".06" filter="url(#bgBlur)" />
      </svg>

      {/* LEFT WALL SHELF */}
      <div style={{ ...motion(11, -0.25), position: "absolute", left: "-35px", top: "8%", width: "390px", height: "300px" }}>
        <svg viewBox="0 0 390 300" width="100%" height="100%">
          <defs>
            <linearGradient id="sMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#62586d" /><stop offset=".5" stopColor="#17151c" /><stop offset="1" stopColor="#81758a" />
            </linearGradient>
            <linearGradient id="sWood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f2e9dc" /><stop offset="1" stopColor="#c8b6a2" />
            </linearGradient>
            <filter id="sShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="18" stdDeviation="15" floodOpacity=".15" /></filter>
          </defs>
          <g filter="url(#sShadow)">
            <path d="M45 252H330" stroke="#958c9d" strokeOpacity=".2" strokeWidth="7" strokeLinecap="round" />
            <path d="M64 40V240M304 40V240" stroke="url(#sMetal)" strokeWidth="8" strokeLinecap="round" />
            <rect x="54" y="54" width="260" height="17" rx="7" fill="url(#sWood)" />
            <rect x="54" y="132" width="260" height="17" rx="7" fill="url(#sWood)" />
            <rect x="54" y="210" width="260" height="17" rx="7" fill="url(#sWood)" />
            <path d="M64 55L41 31M304 55L327 31" stroke="url(#sMetal)" strokeWidth="7" strokeLinecap="round" />
            <g>
              <rect x="83" y="78" width="15" height="44" rx="2" fill="#826dcc" /><rect x="102" y="88" width="12" height="34" rx="2" fill="#dd9fba" /><rect x="118" y="75" width="18" height="47" rx="2" fill="#83afc6" /><rect x="252" y="83" width="16" height="39" rx="2" fill="#d4a77e" /><rect x="271" y="91" width="13" height="31" rx="2" fill="#8176ae" />
              <rect x="96" y="156" width="13" height="38" rx="2" fill="#cf8ca7" /><rect x="113" y="163" width="17" height="31" rx="2" fill="#8a77b9" /><rect x="244" y="153" width="14" height="41" rx="2" fill="#83abc2" /><rect x="262" y="160" width="13" height="34" rx="2" fill="#d1a77a" />
            </g>
            <ellipse cx="211" cy="118" rx="35" ry="10" fill="#d0c8bf" />
            <path d="M177 112C187 91 201 84 213 87C226 90 236 100 245 112" fill="none" stroke="#817688" strokeWidth="4" />
            <path d="M190 191Q210 172 231 190L226 205Q210 213 194 205Z" fill="#d6ccc3" />
            <path d="M210 190C207 175 198 164 189 159M211 190C216 176 224 168 233 164" stroke="#6f9566" strokeWidth="4" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* RIGHT BOOKCASE */}
      <div style={{ ...motion(15, 0.18), position: "absolute", right: "-18px", top: "6%", width: "370px", height: "565px" }}>
        <svg viewBox="0 0 370 565" width="100%" height="100%">
          <defs>
            <linearGradient id="bMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#655b6c" /><stop offset=".55" stopColor="#15131a" /><stop offset="1" stopColor="#867a8c" />
            </linearGradient>
            <linearGradient id="bGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="white" stopOpacity=".34" /><stop offset="1" stopColor="white" stopOpacity=".08" /></linearGradient>
            <filter id="bShadow" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="0" dy="20" stdDeviation="19" floodOpacity=".14" /></filter>
          </defs>
          <g filter="url(#bShadow)">
            <rect x="62" y="22" width="246" height="520" rx="16" fill="url(#bGlass)" stroke="#d7d0dc" strokeWidth="2" />
            <path d="M78 34V530M292 34V530" stroke="url(#bMetal)" strokeWidth="10" strokeLinecap="round" />
            <path d="M80 76H290M80 177H290M80 278H290M80 379H290M80 480H290" stroke="url(#bMetal)" strokeWidth="8" strokeLinecap="round" />
            <g>
              <rect x="94" y="88" width="32" height="70" rx="4" fill="#eadfce" /><rect x="132" y="99" width="27" height="59" rx="4" fill="#947dca" /><rect x="165" y="84" width="22" height="74" rx="4" fill="#d89db7" /><rect x="193" y="98" width="34" height="60" rx="4" fill="#80a8bd" />
              <rect x="92" y="191" width="25" height="74" rx="4" fill="#d3aa80" /><rect x="122" y="201" width="36" height="64" rx="4" fill="#8977b4" /><rect x="163" y="188" width="27" height="77" rx="4" fill="#cf8da9" /><rect x="196" y="202" width="34" height="63" rx="4" fill="#9aad7d" />
              <rect x="94" y="291" width="40" height="71" rx="5" fill="#c8b6a0" /><rect x="141" y="301" width="23" height="61" rx="4" fill="#7ca5bf" /><rect x="171" y="289" width="27" height="73" rx="4" fill="#c88fb0" />
              <rect x="93" y="393" width="28" height="72" rx="4" fill="#9d85c8" /><rect x="128" y="405" width="39" height="60" rx="4" fill="#d0a679" /><rect x="174" y="391" width="22" height="74" rx="4" fill="#7fa8bb" /><rect x="203" y="405" width="29" height="60" rx="4" fill="#cb8da5" />
            </g>
            <path d="M219 150Q240 125 263 148L257 165Q240 173 225 165Z" fill="#d7cfc7" />
            <path d="M241 150C237 135 228 126 220 121M243 150C250 136 260 127 271 124" stroke="#719364" strokeWidth="4" strokeLinecap="round" />
            <text x="226" y="510" fontSize="11" letterSpacing="4" fill="#827987">STELA</text>
          </g>
        </svg>
      </div>

      {/* BOTTOM LEFT TABLE */}
      <div style={{ ...motion(20, -0.25), position: "absolute", left: "-55px", bottom: "-35px", width: "520px", height: "380px" }}>
        <svg viewBox="0 0 520 380" width="100%" height="100%">
          <defs>
            <linearGradient id="tWood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f3eadb" /><stop offset=".55" stopColor="#dac7b1" /><stop offset="1" stopColor="#bda58b" /></linearGradient>
            <linearGradient id="tMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#655b6b" /><stop offset=".5" stopColor="#17151b" /><stop offset="1" stopColor="#807486" /></linearGradient>
            <filter id="tShadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="25" stdDeviation="21" floodOpacity=".18" /></filter>
          </defs>
          <g filter="url(#tShadow)">
            <ellipse cx="275" cy="334" rx="195" ry="21" fill="#968c9d" opacity=".2" />
            <rect x="102" y="72" width="342" height="36" rx="13" fill="url(#tWood)" />
            <path d="M119 104V315M426 104V315M103 296H442" stroke="url(#tMetal)" strokeWidth="14" strokeLinecap="round" />
            <path d="M105 75Q273 37 442 75" fill="none" stroke="#fff" strokeOpacity=".48" strokeWidth="3" />
            <path d="M267 70L267 53" stroke="#69885f" strokeWidth="4" strokeLinecap="round" />
            <path d="M267 53C256 39 246 37 238 39M269 53C278 39 288 33 298 34" stroke="#74986b" strokeWidth="4" strokeLinecap="round" />
            <path d="M253 73Q267 57 281 73L277 91Q267 97 257 91Z" fill="#e6ddd3" />
            <rect x="345" y="55" width="49" height="7" rx="3" fill="#8f79b7" /><rect x="350" y="64" width="41" height="7" rx="3" fill="#d7a0b5" />
          </g>
        </svg>
      </div>

      {/* BOTTOM RIGHT CLOTHING RACK */}
      <div style={{ ...motion(23, 0.3), position: "absolute", right: "-45px", bottom: "-25px", width: "455px", height: "490px" }}>
        <svg viewBox="0 0 455 490" width="100%" height="100%">
          <defs>
            <linearGradient id="rMetal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5f5566" /><stop offset=".52" stopColor="#15131a" /><stop offset="1" stopColor="#85798b" /></linearGradient>
            <filter id="rShadow" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="19" floodOpacity=".16" /></filter>
          </defs>
          <g filter="url(#rShadow)">
            <ellipse cx="245" cy="452" rx="160" ry="18" fill="#968d9d" opacity=".2" />
            <path d="M111 430V83M354 430V83M111 95H354M116 408H349" stroke="url(#rMetal)" strokeWidth="11" strokeLinecap="round" />
            <path d="M160 108Q160 94 172 94Q184 94 184 108M223 108Q223 94 235 94Q247 94 247 108M286 108Q286 94 298 94Q310 94 310 108" fill="none" stroke="#8e8291" strokeWidth="4" />
            <path d="M141 112Q161 100 180 112L193 133L177 147L168 132L166 304H137Z" fill="#d69db7" />
            <path d="M202 112Q223 99 242 113L255 132L239 147L230 132L228 323H198Z" fill="#8c77bb" />
            <path d="M263 112Q283 100 302 113L315 132L299 147L290 132L288 309H258Z" fill="#79a7bb" />
            <path d="M145 164H177M202 192H239M260 182H300" stroke="#fff" strokeOpacity=".32" strokeWidth="2" />
            <path d="M154 329Q174 326 188 339L181 350H150ZM215 348Q236 344 249 357L241 368H209ZM275 333Q295 329 308 342L301 353H270Z" fill="#514957" />
            <text x="286" y="395" fontSize="10" letterSpacing="3.5" fill="#87808d">STELA</text>
          </g>
        </svg>
      </div>

      {/* CENTER PLANT */}
      <div style={{ ...motion(7, 0.1), position: "absolute", left: "50%", top: "52%", width: "220px", height: "220px", transform: `translate(calc(-50% + ${mouse.x * 7}px), calc(-50% + ${mouse.y * 7}px))`, transition: "transform 220ms cubic-bezier(.22,.61,.36,1)" }}>
        <svg viewBox="0 0 220 220" width="100%" height="100%">
          <circle cx="110" cy="96" r="72" fill="#fff" opacity=".35" />
          <path d="M82 179Q110 166 138 179L131 201Q110 210 89 201Z" fill="#d7cec5" />
          <path d="M110 180V105" stroke="#66895d" strokeWidth="5" strokeLinecap="round" />
          <path d="M108 121C93 115 80 105 74 92C95 90 108 100 108 121Z" fill="#7da36a" />
          <path d="M111 133C128 123 142 113 150 99C130 98 115 108 111 133Z" fill="#91ad79" />
          <path d="M107 148C93 142 84 132 81 118C97 118 107 128 107 148Z" fill="#739b64" />
          <path d="M114 159C128 151 139 141 143 126C127 126 116 137 114 159Z" fill="#80a872" />
        </svg>
      </div>

      <div style={{ ...motion(5), position: "absolute", left: "50%", top: "25%", transform: `translateX(calc(-50% + ${mouse.x * 5}px))`, transition: "transform 220ms cubic-bezier(.22,.61,.36,1)", fontFamily: "system-ui, sans-serif", fontSize: "10px", letterSpacing: "4px", color: "rgba(75,68,85,.25)", whiteSpace: "nowrap" }}>
        FURNITURE / FORM / DETAIL
      </div>
    </div>
  );
};

export default FurnitureBackground;
