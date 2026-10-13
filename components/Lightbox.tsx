"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { smooth } from "@/lib/smooth";
import type { Work } from "@/lib/works";

export type Position = { work: number; slide: number };

type Props = {
  works: Work[];
  position: Position | null;
  onChange: (position: Position | null) => void;
};

// Pop-up de um trabalho: carrossel com as fotos e vídeos da postagem.
// Avançar no último item passa para o trabalho seguinte, como um álbum.
export function Lightbox({ works, position, onChange }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const isOpen = position !== null;

  const step = useCallback(
    (delta: 1 | -1) => {
      if (!position) return;
      const { work, slide } = position;
      const next = slide + delta;
      if (next >= 0 && next < works[work].media.length) {
        onChange({ work, slide: next });
        return;
      }
      const neighbour = (work + delta + works.length) % works.length;
      onChange({ work: neighbour, slide: delta === 1 ? 0 : works[neighbour].media.length - 1 });
    },
    [position, works, onChange],
  );

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    smooth.lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeButton.current?.focus();

    return () => {
      document.documentElement.style.overflow = "";
      smooth.lenis?.start();
      opener?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      // Com o foco no vídeo, as setas são dele (avançar e voltar o tempo).
      const onVideo = event.target instanceof HTMLVideoElement;
      if (event.key === "Escape") onChange(null);
      if (event.key === "ArrowRight" && !onVideo) step(1);
      if (event.key === "ArrowLeft" && !onVideo) step(-1);

      // Tab não sai do pop-up enquanto ele estiver aberto.
      if (event.key === "Tab" && dialog.current) {
        const focusable = dialog.current.querySelectorAll<HTMLElement>("button, video");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onChange, step]);

  const work = position ? works[position.work] : null;

  return (
    <AnimatePresence>
      {work && position && (
        <LightboxView
          key="pop-up"
          dialog={dialog}
          closeButton={closeButton}
          work={work}
          position={position}
          workCount={works.length}
          onStep={step}
          onClose={() => onChange(null)}
        />
      )}
    </AnimatePresence>
  );
}

// O vídeo começa sozinho e sem som, para não disparar áudio de surpresa em
// quem está passando o carrossel; o som é ligado pelo player.
function VideoSlide({ src, poster, label }: { src: string; poster: string | null; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster ?? undefined}
      aria-label={label}
      controls
      playsInline
      loop
      preload="metadata"
      className="absolute inset-0 h-full w-full bg-nanquim object-contain"
    />
  );
}

type ViewProps = {
  dialog: React.RefObject<HTMLDivElement | null>;
  closeButton: React.RefObject<HTMLButtonElement | null>;
  work: Work;
  position: Position;
  workCount: number;
  onStep: (delta: 1 | -1) => void;
  onClose: () => void;
};

function LightboxView({ dialog, closeButton, work, position, workCount, onStep, onClose }: ViewProps) {
  const slides = work.media.length;
  const name = `Trabalho ${position.work + 1}`;
  const canStep = workCount > 1 || slides > 1;
  const media = work.media[position.slide];
  const label =
    slides > 1
      ? `Tatuagem feita pela Lysa, ${name.toLowerCase()}, item ${position.slide + 1} de ${slides}`
      : `Tatuagem feita pela Lysa, ${name.toLowerCase()}`;

  return (
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={name}
      data-lenis-prevent
      className="fixed inset-0 z-50 flex flex-col bg-nanquim pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex min-h-17 items-center justify-between gap-4 px-5 pt-[env(safe-area-inset-top)] text-lg lg:px-10">
          <p className="text-cinza">
            Trabalho {position.work + 1} de {workCount}
          </p>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            className="min-h-11 border border-osso/50 px-5 hover:bg-osso hover:text-nanquim active:bg-osso active:text-nanquim"
          >
            Fechar
          </button>
        </div>

        <div className="relative mx-3 min-h-0 flex-1 lg:mx-10">
          {/* Arrastar a foto para o lado troca de item. No vídeo o arrasto fica
              desligado, porque o dedo precisa da barra de tempo do player. */}
          <motion.div
            key={media.src}
            className="absolute inset-0 touch-pan-y"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            drag={canStep && media.type === "image" ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              const flicked = Math.abs(info.velocity.x) > 500;
              if (info.offset.x < -70 || (flicked && info.offset.x < 0)) onStep(1);
              else if (info.offset.x > 70 || (flicked && info.offset.x > 0)) onStep(-1);
            }}
          >
            {media.type === "image" ? (
              <Image
                src={media.src}
                alt={label}
                fill
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 70vw"
                draggable={false}
                className="pointer-events-none object-contain select-none"
              />
            ) : (
              <VideoSlide src={media.src} poster={media.poster} label={label} />
            )}
          </motion.div>
        </div>

        {canStep && (
          <div className="flex items-center justify-between gap-3 px-2 py-1 text-lg lg:px-7 lg:py-3">
            <button type="button" onClick={() => onStep(-1)} className="min-h-12 px-3 underline-offset-8 hover:underline">
              Anterior
            </button>
            {slides > 1 && (
              <div aria-hidden className="flex flex-wrap items-center justify-center gap-2.5">
                {work.media.map((item, i) => (
                  <span
                    key={item.src}
                    className={`size-1.5 rotate-45 transition-colors ${i === position.slide ? "scale-150 bg-labio" : "bg-osso/35"}`}
                  />
                ))}
              </div>
            )}
            <button type="button" onClick={() => onStep(1)} className="min-h-12 px-3 underline-offset-8 hover:underline">
              Próxima
            </button>
          </div>
        )}
        <p aria-live="polite" className="sr-only">
          {slides > 1 ? `${media.type === "video" ? "Vídeo" : "Foto"}, item ${position.slide + 1} de ${slides}` : ""}
        </p>
      </div>
    </motion.div>
  );
}
