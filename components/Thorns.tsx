"use client";

import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { thornPath } from "@/lib/thorns";

// Haste de espinhos fixa na margem: é tatuada conforme a página rola.
export function ThornSpine() {
  const [height, setHeight] = useState(0);
  const [wide, setWide] = useState(false);
  const path = useRef<SVGPathElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");

    // Mede a maior altura possível da tela (100lvh): no celular a barra de
    // endereço some e volta, e a haste não pode encurtar nem redesenhar.
    const measure = () => {
      const probe = document.createElement("div");
      probe.style.cssText = "position:fixed;top:0;width:0;height:100lvh;visibility:hidden";
      document.body.append(probe);
      setHeight(probe.offsetHeight || window.innerHeight);
      probe.remove();
      setWide(desktop.matches);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll();
  const drawn = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.4 });
  const needleX = useMotionValue(0);
  const needleY = useMotionValue(0);

  const cross = wide ? 40 : 14;
  const d = useMemo(
    () => (height ? thornPath(height, { cross, scale: wide ? 1 : 0.36 }) : ""),
    [height, cross, wide],
  );

  useMotionValueEvent(drawn, "change", (value) => {
    const el = path.current;
    if (!el) return;
    const point = el.getPointAtLength(el.getTotalLength() * value);
    needleX.set(point.x);
    needleY.set(point.y);
  });

  if (!height || reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed top-0 left-0.5 z-30 lg:left-3">
      <svg width={cross} height={height} viewBox={`0 0 ${cross} ${height}`} fill="none" className="overflow-visible">
        <path d={d} className="stroke-osso/10" />
        <motion.path
          ref={path}
          d={d}
          className="stroke-osso/80 lg:stroke-osso"
          strokeWidth={wide ? 1.25 : 1}
          strokeLinejoin="miter"
          style={{ pathLength: drawn }}
        />
        <motion.circle r={wide ? 3 : 2.25} className="fill-labio" style={{ cx: needleX, cy: needleY }} />
      </svg>
    </div>
  );
}

// Ramo horizontal entre seções, tatuado quando entra na tela.
export function ThornDivider({ seed = 3 }: { seed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "start 45%"] });
  const d = useMemo(() => thornPath(640, { seed, vertical: false }), [seed]);

  return (
    <div ref={ref} aria-hidden className="mx-auto w-[min(640px,78vw)] text-osso">
      <svg viewBox="0 0 640 40" fill="none" className="h-auto w-full overflow-visible">
        <motion.path
          d={d}
          stroke="currentColor"
          strokeWidth="1.25"
          style={{ pathLength: reduce ? 1 : scrollYProgress }}
        />
      </svg>
    </div>
  );
}
