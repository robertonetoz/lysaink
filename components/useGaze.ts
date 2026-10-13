"use client";

import { useSpring } from "motion/react";
import { useEffect, useRef } from "react";

// Faz um olho acompanhar o cursor (ou o último toque, no celular).
// Devolve o deslocamento da pupila, limitado a `reachX` e `reachY`.
// `originY` é a altura do olho dentro do elemento, de 0 (topo) a 1 (base).
export function useGaze<T extends Element>(reachX: number, reachY: number, originY = 0.5) {
  const ref = useRef<T>(null);
  const x = useSpring(0, { stiffness: 160, damping: 20 });
  const y = useSpring(0, { stiffness: 160, damping: 20 });

  useEffect(() => {
    const follow = (event: PointerEvent) => {
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height * originY);
      const distance = Math.hypot(dx, dy) || 1;
      const pull = Math.min(1, distance / 260);
      x.set((dx / distance) * reachX * pull);
      y.set((dy / distance) * reachY * pull);
    };

    window.addEventListener("pointermove", follow, { passive: true });
    window.addEventListener("pointerdown", follow, { passive: true });
    return () => {
      window.removeEventListener("pointermove", follow);
      window.removeEventListener("pointerdown", follow);
    };
  }, [x, y, reachX, reachY, originY]);

  return { ref, x, y };
}
