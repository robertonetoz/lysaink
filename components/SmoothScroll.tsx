"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { smooth } from "@/lib/smooth";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
    smooth.lenis = lenis;

    return () => {
      lenis.destroy();
      smooth.lenis = null;
    };
  }, []);

  return null;
}
