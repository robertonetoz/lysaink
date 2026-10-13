import type Lenis from "lenis";

// Instância única do scroll suave, para quem precisa pausar ou rolar a página.
export const smooth: { lenis: Lenis | null } = { lenis: null };
