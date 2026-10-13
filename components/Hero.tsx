"use client";

import { motion, type MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Arch } from "./Arch";

const BAT =
  "M50,13 L48,10 L46.5,3 L44,11 C38,5 20,1 2,12 Q11,15 13,27 Q21,22 27,33 Q35,26 42,35 Q47,34 50,43 Q53,34 58,35 Q65,26 73,33 Q79,22 87,27 Q89,15 98,12 C80,1 62,5 56,11 L53.5,3 L52,10 Z";

// Destino de cada morcego da revoada, em vw/vh a partir do centro do arco.
const FLOCK = [
  { x: -40, y: -34, size: 9, turn: -16 },
  { x: 38, y: -38, size: 12, turn: 14 },
  { x: -46, y: 4, size: 6, turn: -28 },
  { x: 44, y: -8, size: 7, turn: 22 },
  { x: -24, y: -44, size: 5, turn: -6 },
  { x: 22, y: -46, size: 6, turn: 8 },
  { x: 47, y: 26, size: 5, turn: 30 },
];

type BatProps = (typeof FLOCK)[number] & { progress: MotionValue<number> };

function Bat({ x, y, size, turn, progress }: BatProps) {
  const left = useTransform(progress, [0.04, 1], ["0vw", `${x}vw`]);
  const top = useTransform(progress, [0.04, 1], ["0vh", `${y}vh`]);
  const scale = useTransform(progress, [0.04, 0.5], [0.15, 1]);
  const opacity = useTransform(progress, [0.04, 0.12, 0.85, 1], [0, 1, 1, 0]);

  return (
    <motion.div className="absolute text-osso" style={{ x: left, y: top, scale, opacity, rotate: turn, width: `${size}vmin` }}>
      <svg viewBox="0 0 100 46" className="asas block w-full" fill="currentColor">
        <path d={BAT} />
      </svg>
    </motion.div>
  );
}

function Wordmark({ left, right, className }: { left: MotionValue<string>; right: MotionValue<string>; className: string }) {
  return (
    <span className={`font-gotica flex text-[min(47vw,72svh)] leading-none font-black select-none md:text-[min(41vw,72svh)] ${className}`}>
      <motion.span style={{ x: left }}>Ly</motion.span>
      <motion.span style={{ x: right }}>sa</motion.span>
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const left = useTransform(scrollYProgress, [0, 0.8], ["0vw", "-17vw"]);
  const right = useTransform(scrollYProgress, [0, 0.8], ["0vw", "17vw"]);
  const archScale = useTransform(scrollYProgress, [0, 1], [1, 1.24]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const scene = useTransform(scrollYProgress, [0.78, 1], [1, 0]);
  const caption = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  return (
    <section ref={ref} id="topo" className={reduce ? "relative" : "relative h-[190svh]"}>
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <motion.div style={{ opacity: scene }} className="absolute inset-0 flex items-center justify-center">
          <motion.h1
            aria-label="Lysa"
            className="absolute"
            initial={{ opacity: 0, filter: "blur(18px)", scale: 1.06 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            transition={{ duration: 1.6, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <Wordmark left={left} right={right} className="text-osso" />
          </motion.h1>

          {!reduce && FLOCK.map((bat) => <Bat key={`${bat.x}${bat.y}`} {...bat} progress={scrollYProgress} />)}

          <motion.div
            className="absolute w-[min(52vw,42svh)] md:w-[min(60vw,42svh)]"
            initial={{ clipPath: "inset(100% -6% -6% -6%)" }}
            animate={{ clipPath: "inset(-6% -6% -6% -6%)" }}
            transition={{ duration: 1.3, delay: 0.5, ease: [0.7, 0, 0.2, 1] }}
          >
            <motion.div style={{ scale: archScale }}>
              <Arch ratio="2/3" className="text-osso">
                <motion.div style={{ scale: photoScale }} className="absolute inset-0">
                  <Image
                    src="/lysa/lysa3.jpg"
                    alt="Retrato da tatuadora Lysa, de franja reta, delineado gatinho e batom vermelho escuro"
                    fill
                    preload
                    sizes="(max-width: 768px) 75vw, 520px"
                    className="object-cover object-[62%_40%]"
                  />
                </motion.div>
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-nanquim to-transparent" />
              </Arch>
            </motion.div>
          </motion.div>

          <motion.div
            aria-hidden
            className="pointer-events-none absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.5 }}
          >
            <Wordmark left={left} right={right} className="contorno" />
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: caption }}
          className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-5 pb-7 lg:px-10 lg:pb-9 lg:pl-24"
        >
          <motion.p
            className="max-w-[16ch] text-xl leading-tight sm:max-w-none sm:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            Tatuagem dark e blackwork
            <span className="block text-cinza">Uberlândia, MG</span>
          </motion.p>
          <motion.p
            className="text-right text-base text-cinza"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.1 }}
          >
            Role para entrar
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
