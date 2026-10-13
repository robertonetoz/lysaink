"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { site, whatsappLink } from "@/lib/site";
import { useGaze } from "./useGaze";

// Lua em pontilhismo: o ruído é comparado com um degradê, então a densidade
// dos pontos cresce de verdade em direção à sombra, como no dotwork.
function Moon() {
  return (
    <svg aria-hidden viewBox="0 0 600 600" className="block h-full w-full">
      <defs>
        <filter id="pontilhado" x="0" y="0" width="1" height="1">
          <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="1" seed="11" result="ruido" />
          <feComposite in="ruido" in2="SourceGraphic" operator="arithmetic" k1="0" k2="-1" k3="1" k4="0.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 28 -16.5" />
        </filter>
        <radialGradient id="lua-sombra" cx="36%" cy="30%" r="78%">
          <stop offset="30%" stopColor="#000" stopOpacity="0.2" />
          <stop offset="72%" stopColor="#000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.95" />
        </radialGradient>
        <clipPath id="lua-disco">
          <circle cx="300" cy="300" r="300" />
        </clipPath>
      </defs>
      <circle cx="300" cy="300" r="300" className="fill-osso" />
      <g clipPath="url(#lua-disco)">
        <g filter="url(#pontilhado)">
          <rect width="600" height="600" fill="url(#lua-sombra)" />
          <ellipse cx="205" cy="170" rx="62" ry="48" fill="#000" fillOpacity="0.22" />
          <ellipse cx="395" cy="140" rx="38" ry="30" fill="#000" fillOpacity="0.18" />
          <ellipse cx="120" cy="320" rx="44" ry="58" fill="#000" fillOpacity="0.2" />
          <ellipse cx="450" cy="300" rx="70" ry="54" fill="#000" fillOpacity="0.16" />
        </g>
      </g>
    </svg>
  );
}

// Gata preta sentada na frente da lua. As pupilas acompanham o cursor.
function Cat() {
  const { ref, x: lookX, y: lookY } = useGaze<SVGSVGElement>(4.5, 1.5, 0.27);

  return (
    <svg ref={ref} aria-hidden viewBox="0 0 200 260" className="block h-full w-auto overflow-visible">
      <path className="rabo" d="M158,244 C200,246 208,204 184,188" fill="none" stroke="#000" strokeWidth="13" strokeLinecap="round" />
      <path
        fill="#000"
        d="M80,98 C58,120 34,170 36,215 C37,240 44,255 52,260 L148,260 C156,255 163,240 164,215 C166,170 142,120 120,98 Z M64,62 L60,14 L94,42 Z M136,62 L140,14 L106,42 Z"
      />
      <ellipse cx="100" cy="70" rx="40" ry="33" fill="#000" />
      {[84, 116].map((cx) => (
        <g key={cx} transform={`translate(${cx} 71)`}>
          <g className="olho">
            <path d="M-10,0 Q0,-7.5 10,0 Q0,7.5 -10,0Z" className="fill-osso" />
            <motion.ellipse rx="2.2" ry="5.6" fill="#000" style={{ x: lookX, y: lookY }} />
          </g>
        </g>
      ))}
    </svg>
  );
}

const footerLink = "flex min-h-11 items-center px-2 underline-offset-8 hover:underline";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rise = useTransform(scrollYProgress, [0, 1], ["46%", "0%"]);

  return (
    <footer ref={ref} className="relative overflow-hidden">
      <div className="relative mx-auto flex h-[min(124vw,88svh,720px)] max-w-7xl items-end justify-center">
        <motion.div
          style={{ y: reduce ? 0 : rise }}
          className="absolute bottom-[-18%] left-1/2 aspect-square w-[min(118vw,640px)] -translate-x-1/2 will-change-transform"
        >
          <Moon />
        </motion.div>
        <div className="relative h-[min(58vw,320px)]">
          <Cat />
        </div>
      </div>

      <div className="relative bg-nanquim">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 pt-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:flex-row md:items-end md:justify-between md:gap-8 md:pb-12 lg:px-10 lg:pl-28">
          <div>
            <p className="font-gotica text-6xl leading-none font-black">Lysa Ink</p>
            <p className="mt-3 text-lg text-cinza">Tatuagem dark e blackwork em {site.city}</p>
          </div>
          <ul className="-mx-2 flex flex-wrap gap-x-5 text-xl md:gap-x-7">
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={footerLink}>
                Instagram
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={footerLink}>
                WhatsApp
              </a>
            </li>
            <li>
              <a href="#topo" className={footerLink}>
                Voltar ao topo
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
