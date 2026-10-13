"use client";

import { motion, useScroll, useTransform } from "motion/react";

const LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#trabalhos", label: "Trabalhos" },
  { href: "#processo", label: "Processo" },
];

export function Nav() {
  const { scrollY } = useScroll();
  // O nome só aparece no topo depois que o letreiro do início sai de cena.
  const wordmark = useTransform(scrollY, [380, 640], [0, 1]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-linear-to-b from-nanquim from-55% to-transparent pb-7 text-osso">
      <nav aria-label="Principal" className="flex items-center justify-between gap-6 px-5 py-3 md:py-4 lg:pr-10 lg:pl-28">
        <motion.a
          href="#topo"
          style={{ opacity: wordmark }}
          className="font-gotica flex min-h-11 items-center text-3xl leading-none font-semibold"
        >
          Lysa
        </motion.a>
        <ul className="hidden items-center gap-9 text-lg md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="underline-offset-8 hover:underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#agendar"
          className="flex min-h-11 items-center border border-current bg-nanquim px-4 text-lg leading-snug transition-colors hover:bg-osso hover:text-nanquim active:bg-osso active:text-nanquim"
        >
          Pedir orçamento
        </a>
      </nav>
    </header>
  );
}
