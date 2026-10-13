export const site = {
  name: "Lysa Ink",
  url: "https://lysaink.vercel.app",
  artist: "Lysa",
  city: "Uberlândia, MG",
  whatsapp: "5534997220220",
  instagram: "https://www.instagram.com/lysa_ink/",
  instagramHandle: "@lysa_ink",
};

// Destaques do perfil dela no Instagram, na mesma ordem em que aparecem lá.
export const highlights = [
  { label: "disponíveis", href: "https://www.instagram.com/stories/highlights/18318821806186527/" },
  { label: "+ tattoos", href: "https://www.instagram.com/stories/highlights/17948849033337583/" },
  { label: "cicatrizados", href: "https://www.instagram.com/stories/highlights/17845148449940950/" },
  { label: "processos", href: "https://www.instagram.com/stories/highlights/18085279783424480/" },
];

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
