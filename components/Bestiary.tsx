"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Fragment, useRef } from "react";

const ROWS = [
  ["morcegos", "corvos", "caveiras", "catedrais", "bruxas", "mariposas"],
  ["vampiros", "gatos pretos", "espinhos", "olhos", "adagas", "criaturas"],
];

function Star() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="mx-[0.35em] inline-block size-[0.3em] shrink-0 fill-labio">
      <path d="M12 0c.9 7.2 4.8 11.1 12 12-7.2.9-11.1 4.8-12 12-.9-7.2-4.8-11.1-12-12C7.2 11.1 11.1 7.2 12 0Z" />
    </svg>
  );
}

function Row({ words, className }: { words: string[]; className: string }) {
  return (
    <span className={`flex items-center whitespace-nowrap ${className}`}>
      {[...words, ...words].map((word, i) => (
        <Fragment key={i}>
          {word}
          <Star />
        </Fragment>
      ))}
    </span>
  );
}

// Duas faixas com os temas que ela tatua, correndo em sentidos opostos com o scroll.
export function Bestiary() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const forward = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const backward = useTransform(scrollYProgress, [0, 1], ["-28%", "0%"]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Temas que a Lysa tatua: ${ROWS.flat().join(", ")}.`}
      className="font-gotica overflow-hidden py-10 text-[clamp(3.5rem,10vw,9rem)] leading-[1.05] font-bold"
    >
      <motion.div aria-hidden style={{ x: reduce ? 0 : forward }} className="w-max">
        <Row words={ROWS[0]} className="text-osso" />
      </motion.div>
      <motion.div aria-hidden style={{ x: reduce ? 0 : backward }} className="w-max">
        <Row words={ROWS[1]} className="contorno" />
      </motion.div>
    </div>
  );
}
