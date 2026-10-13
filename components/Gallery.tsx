"use client";

import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { type Media, mediaSummary, type Work } from "@/lib/works";
import { smooth } from "@/lib/smooth";
import { Arch, type ArchRatio } from "./Arch";
import { Highlights } from "./Highlights";
import { Lightbox, type Position } from "./Lightbox";

// Ritmo da arcada: proporção, largura e desnível de cada nicho, em ciclo.
const RHYTHM: { ratio: ArchRatio; width: string; drop: string }[] = [
  { ratio: "2/3", width: "md:w-[min(24vw,46svh)]", drop: "md:-translate-y-[3svh]" },
  { ratio: "3/4", width: "md:w-[min(18vw,40svh)]", drop: "md:translate-y-[9svh]" },
  { ratio: "2/3", width: "md:w-[min(21vw,42svh)]", drop: "md:-translate-y-[7svh]" },
  { ratio: "3/4", width: "md:w-[min(20vw,44svh)]", drop: "md:translate-y-[5svh]" },
];

const EMPTY_NICHES = 7;
const MOBILE_NICHES = 6;

// No celular a coluna da direita desce meio passo, como uma arcada desencontrada.
const STAGGER = ["", "max-md:translate-y-14"];

const coverClass =
  "object-cover brightness-90 transition duration-700 ease-out group-hover:scale-105 group-hover:brightness-110 group-focus-visible:scale-105";

// Capa do arco: a foto, a capa do vídeo ou, sem capa, o primeiro quadro dele.
function Cover({ media, alt }: { media: Media; alt: string }) {
  const still = media.type === "image" ? media.src : media.poster;

  return (
    <>
      {still ? (
        <Image src={still} alt={alt} fill sizes="(max-width: 768px) 46vw, 26vw" className={coverClass} />
      ) : (
        <video
          src={`${media.src}#t=0.1`}
          aria-label={alt}
          muted
          playsInline
          preload="metadata"
          className={`absolute inset-0 h-full w-full ${coverClass}`}
        />
      )}
      {media.type === "video" && (
        <svg aria-hidden viewBox="0 0 48 48" className="absolute bottom-[7%] left-1/2 size-10 -translate-x-1/2 md:size-12">
          <circle cx="24" cy="24" r="23" className="fill-nanquim/55 stroke-osso" strokeWidth="1.25" />
          <path d="M19.5 15.5 33 24l-13.5 8.5Z" className="fill-osso" />
        </svg>
      )}
    </>
  );
}

type Props = { works: Work[]; showSetupHint: boolean };

export function Gallery({ works, showSetupHint }: Props) {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const [open, setOpen] = useState<Position | null>(null);
  const rangeValue = useMotionValue(0);

  // No desktop a seção fica presa e o scroll vertical anda a arcada de lado.
  // No celular vira duas colunas desencontradas, que mostram mais peças por
  // tela e rolam com o polegar; com movimento reduzido, uma faixa de arrastar.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const pinnable = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");

    const measure = () => {
      const next = pinnable.matches ? Math.max(0, el.offsetWidth - window.innerWidth) : 0;
      setRange(next);
      rangeValue.set(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    pinnable.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      pinnable.removeEventListener("change", measure);
    };
  }, [rangeValue, works.length]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform([scrollYProgress, rangeValue], ([progress, distance]: number[]) => -progress * distance);

  // Foco por teclado em um nicho fora da tela: leva a página até ele.
  const reveal = (el: HTMLElement) => {
    if (!range || !section.current) return;
    if (viewport.current) viewport.current.scrollLeft = 0;
    const centered = el.offsetLeft + el.offsetWidth / 2 - window.innerWidth / 2;
    const top = section.current.offsetTop + Math.min(range, Math.max(0, centered));
    if (smooth.lenis) smooth.lenis.scrollTo(top);
    else window.scrollTo({ top });
  };

  const pinned = range > 0;
  const empty = works.length === 0;

  return (
    <section
      ref={section}
      id="trabalhos"
      aria-labelledby="trabalhos-titulo"
      className="relative"
      style={pinned ? { height: `calc(100svh + ${range}px)` } : undefined}
    >
      <div
        ref={viewport}
        className={`py-20 md:sticky md:top-0 md:flex md:h-svh md:items-center md:py-0 ${
          pinned ? "overflow-hidden" : "md:snap-x md:snap-mandatory md:overflow-x-auto"
        }`}
      >
        <motion.div
          ref={track}
          style={{ x }}
          className="grid grid-cols-2 gap-x-4 gap-y-9 px-5 pb-14 md:flex md:w-max md:items-center md:gap-[5vw] md:px-[7vw] md:pb-0 lg:pl-28"
        >
          <header className="col-span-2 mb-4 md:mb-0 md:w-[32vw] md:shrink-0 md:snap-start">
            <h2 id="trabalhos-titulo" className="font-gotica text-[clamp(4rem,9vw,8.5rem)] leading-[0.9] font-black">
              Trabalhos
            </h2>
            <p className="mt-6 max-w-[26ch] text-xl text-cinza">
              {empty
                ? "As peças tatuadas entram aqui, uma em cada arco."
                : "Cada arco guarda uma peça. Toque para ver todas as fotos e vídeos dela."}
            </p>
            {empty && showSetupHint && (
              <p className="mt-6 max-w-[36ch] border-l-2 border-labio pl-4 text-base">
                Coloque as fotos e vídeos em <code className="font-semibold">public/galeria</code> e recarregue a
                página. <code className="font-semibold">tatuagem1.jpg</code> é a capa;{" "}
                <code className="font-semibold">tatuagem1.1.jpg</code>, <code className="font-semibold">1.2</code>…
                continuam o mesmo carrossel.
              </p>
            )}
          </header>

          {empty
            ? Array.from({ length: EMPTY_NICHES }, (_, i) => {
                const rhythm = RHYTHM[i % RHYTHM.length];
                return (
                  <div
                    key={i}
                    aria-hidden
                    className={`md:shrink-0 md:snap-center ${STAGGER[i % 2]} ${i >= MOBILE_NICHES ? "max-md:hidden" : ""} ${rhythm.width} ${rhythm.drop}`}
                  >
                    <Arch ratio={rhythm.ratio} className="text-osso/60">
                      <div className="absolute inset-0 bg-radial-[at_50%_22%] from-fuligem via-nanquim to-nanquim" />
                    </Arch>
                  </div>
                );
              })
            : works.map((work, i) => {
                const rhythm = RHYTHM[i % RHYTHM.length];
                const summary = mediaSummary(work.media);
                const name = `trabalho ${i + 1}`;
                return (
                  <figure key={work.id} className={`md:shrink-0 md:snap-center ${STAGGER[i % 2]} ${rhythm.width} ${rhythm.drop}`}>
                    <button
                      type="button"
                      onClick={() => setOpen({ work: i, slide: 0 })}
                      onFocus={(event) => reveal(event.currentTarget)}
                      aria-label={summary ? `Abrir ${name}, ${summary.toLowerCase()}` : `Abrir ${name}`}
                      className="group block w-full cursor-zoom-in"
                    >
                      <Arch ratio={rhythm.ratio} className="text-osso">
                        <Cover media={work.media[0]} alt={`Tatuagem feita pela Lysa, ${name}`} />
                      </Arch>
                    </button>
                    {summary && (
                      <figcaption className="mt-4 text-center text-base leading-snug text-cinza md:mt-5 md:text-lg">
                        {summary}
                      </figcaption>
                    )}
                  </figure>
                );
              })}

          <div
            onFocus={(event) => reveal(event.target as HTMLElement)}
            className="col-span-2 mt-16 md:mt-0 md:w-[min(34rem,44vw)] md:shrink-0 md:snap-center"
          >
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="group inline-block">
              <span className="font-gotica block text-[clamp(2.5rem,4.4vw,4.25rem)] leading-none font-bold">
                Mais no Instagram
              </span>
              <span className="mt-4 block text-xl text-cinza underline decoration-labio decoration-2 underline-offset-6 group-hover:text-osso">
                {site.instagramHandle}
              </span>
            </a>
            <Highlights />
          </div>
        </motion.div>
      </div>

      <Lightbox works={works} position={open} onChange={setOpen} />
    </section>
  );
}
