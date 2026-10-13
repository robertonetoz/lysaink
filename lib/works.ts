export type Media =
  | { type: "image"; src: string }
  | { type: "video"; src: string; poster: string | null };

export type Work = {
  id: string;
  media: Media[];
};

// "3 fotos", "Vídeo", "2 fotos e 1 vídeo". Uma foto sozinha não precisa de rótulo.
export function mediaSummary(media: Media[]) {
  const videos = media.filter((item) => item.type === "video").length;
  const photos = media.length - videos;
  const parts: string[] = [];

  if (photos > 1 || (photos === 1 && videos > 0)) parts.push(photos === 1 ? "1 foto" : `${photos} fotos`);
  if (videos === 1 && photos === 0) parts.push("vídeo");
  else if (videos > 0) parts.push(videos === 1 ? "1 vídeo" : `${videos} vídeos`);
  if (parts.length === 0) return null;

  const text = parts.join(" e ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
