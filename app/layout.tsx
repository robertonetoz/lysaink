import type { Metadata, Viewport } from "next";
import { Grenze, Grenze_Gotisch } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { ArchDefs } from "@/components/Arch";
import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThornSpine } from "@/components/Thorns";

const gotica = Grenze_Gotisch({
  subsets: ["latin"],
  variable: "--font-grenze-gotisch",
  display: "swap",
});

const texto = Grenze({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-grenze",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lysa Ink | Tatuagem dark e blackwork em Uberlândia, MG",
  description:
    "Lysa tatua blackwork, pontilhismo e temas góticos em Uberlândia, MG. Veja os trabalhos e peça seu orçamento pelo WhatsApp.",
  openGraph: {
    title: "Lysa Ink | Tatuagem dark e blackwork",
    description: "Blackwork, pontilhismo e temas góticos em Uberlândia, MG.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${gotica.variable} ${texto.variable}`}>
      <body>
        <ArchDefs />
        <SmoothScroll />
        <Nav />
        <ThornSpine />
        {children}
        <div className="grao" aria-hidden />
      </body>
    </html>
  );
}
