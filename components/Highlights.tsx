"use client";

import { motion } from "motion/react";
import { highlights } from "@/lib/site";
import { useGaze } from "./useGaze";

const ALMOND = "M13,50 Q50,17 87,50 Q50,83 13,50Z";

// Um olho para cada destaque, como as capas do perfil dela: muda o tamanho da
// íris, a inclinação e a pupila (a segunda é de gata).
const EYES = [
  { pupil: "round", tilt: -4, iris: 17 },
  { pupil: "slit", tilt: 5, iris: 19 },
  { pupil: "round", tilt: 4, iris: 15 },
  { pupil: "round", tilt: -7, iris: 18 },
] as const;

function Eye({ index }: { index: number }) {
  const { pupil, tilt, iris } = EYES[index % EYES.length];
  const { ref, x, y } = useGaze<SVGSVGElement>(7, 4);
  const clip = `destaque-olho-${index}`;

  return (
    <svg ref={ref} aria-hidden viewBox="0 0 100 100" className="block w-full">
      <defs>
        <clipPath id={clip}>
          <path d={ALMOND} />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="49" fill="none" className="stroke-osso/75" strokeWidth="1.25" />
      <circle cx="50" cy="50" r="44.5" className="fill-fuligem" />

      <g transform={`rotate(${tilt} 50 50)`} fill="none">
        {/* dobras das pálpebras, em traço fino de gravura */}
        <path d="M10,44 Q50,5 90,44" className="stroke-osso/55" strokeWidth="1" />
        <path d="M17,35 Q50,6 83,35" className="stroke-osso/30" strokeWidth="0.8" />
        <path d="M19,61 Q50,90 81,61" className="stroke-osso/40" strokeWidth="0.9" />

        <g className="olho" style={{ animationDelay: `${index * 1.9}s` }}>
          <path d={ALMOND} className="fill-osso" />
          <g clipPath={`url(#${clip})`}>
            <motion.g style={{ x, y }}>
              <circle cx="50" cy="50" r={iris} className="fill-osso stroke-nanquim" strokeWidth="1.6" />
              {/* íris hachurada: um anel grosso tracejado vira raios */}
              <circle
                cx="50"
                cy="50"
                r={iris * 0.68}
                className="stroke-nanquim"
                strokeWidth={iris * 0.5}
                strokeDasharray="0.9 1.5"
              />
              {pupil === "slit" ? (
                <ellipse cx="50" cy="50" rx={iris * 0.2} ry={iris * 0.86} className="fill-nanquim" />
              ) : (
                <circle cx="50" cy="50" r={iris * 0.44} className="fill-nanquim" />
              )}
              <circle cx={50 - iris * 0.28} cy={50 - iris * 0.34} r={iris * 0.13} className="fill-osso" />
            </motion.g>
            {/* sombra da pálpebra de cima sobre o olho */}
            <path d="M13,50 Q50,17 87,50" className="stroke-nanquim" strokeWidth="6" />
          </g>
        </g>
      </g>
    </svg>
  );
}

export function Highlights() {
  return (
    <div className="mt-10 md:mt-12">
      <p className="text-lg text-cinza">Destaques do perfil</p>
      <ul className="mt-4 grid grid-cols-4 gap-x-2 gap-y-6 sm:gap-x-5">
        {highlights.map((highlight, i) => (
          <li key={highlight.href}>
            <a
              href={highlight.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${highlight.label}, destaque no Instagram`}
              className="group flex flex-col items-center gap-2.5 text-center"
            >
              <span className="block w-full max-w-28 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
                <Eye index={i} />
              </span>
              <span className="font-gotica text-[1.05rem] leading-tight font-medium sm:text-xl">{highlight.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
