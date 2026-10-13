"use client";

import { motion, type MotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Arch } from "./Arch";

const STATEMENT = "Você finalmente encontrou alguém que faz tattoo dark em Uberlândia.";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.24em] inline-block">
      {children}
    </motion.span>
  );
}

// A frase vai sendo preenchida de tinta, palavra por palavra, com o scroll.
function InkedStatement() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "start 28%"] });
  const words = STATEMENT.split(" ");

  return (
    <h2 ref={ref} className="font-gotica text-[clamp(2.6rem,7.2vw,6.25rem)] leading-[0.98] font-semibold text-balance">
      {reduce
        ? STATEMENT
        : words.map((word, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {word}
            </Word>
          ))}
    </h2>
  );
}

export function About() {
  const photo = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: photo, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <section id="sobre" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 pt-28 pb-32 lg:px-10 lg:pt-40 lg:pl-28">
      <InkedStatement />

      <div className="mt-20 grid items-end gap-14 md:grid-cols-12 lg:mt-28">
        <div ref={photo} className="md:col-span-5">
          <Arch ratio="3/4" className="text-osso">
            <motion.div style={{ y }} className="absolute -inset-y-[8%] inset-x-0">
              <Image
                src="/lysa/lysa1.jpg"
                alt="Lysa de máscara e luvas pretas, tatuando o braço de uma cliente"
                fill
                sizes="(max-width: 768px) 92vw, 480px"
                className="object-cover"
              />
            </motion.div>
          </Arch>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pb-6">
          <div className="max-w-[34rem] space-y-6 text-xl leading-[1.65]">
            <p>
              Sou a Lysa. Tatuo só com preto: blackwork sólido, pontilhismo e traço pesado, em desenhos que eu mesma
              crio.
            </p>
            <p>
              Morcegos, corvos, caveiras, catedrais, bruxas e vampiros. O que mora no escuro é o que eu mais gosto de
              desenhar. Cada projeto nasce para o lugar do corpo onde vai ficar, então nenhuma peça sai igual a outra.
            </p>
            <p>O estúdio fica em Uberlândia, Minas Gerais. Orçamento e agenda são combinados direto comigo.</p>
          </div>

          <dl className="mt-12 grid max-w-[34rem] grid-cols-[auto_1fr] items-center gap-x-8 gap-y-3 border-t border-osso/20 pt-8 text-lg sm:gap-x-10">
            <dt className="text-cinza">Estilo</dt>
            <dd>Dark, blackwork, pontilhismo</dd>
            <dt className="text-cinza">Onde</dt>
            <dd>Uberlândia, MG</dd>
            <dt className="text-cinza">Orçamento</dt>
            <dd>
              <a
                href="#agendar"
                className="-my-2 inline-flex min-h-11 items-center underline decoration-labio decoration-2 underline-offset-6 hover:text-labio"
              >
                Preencha a ficha
              </a>
            </dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
