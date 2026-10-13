import fs from "node:fs";
import path from "node:path";
import type { Media, Work } from "./works";

const IMAGE = /\.(jpe?g|png|webp|avif)$/i;
const VIDEO = /\.(mp4|webm|mov|m4v)$/i;

const byName = (a: string, b: string) => a.localeCompare(b, "pt-BR", { numeric: true });
const baseOf = (file: string) => file.replace(/\.[^.]+$/, "");

// A continuação de um trabalho leva um ponto e um número depois do nome:
// tatuagem1.jpg é a capa e tatuagem1.1.jpg, tatuagem1.2.jpg... completam o
// mesmo carrossel. tatuagem2.jpg já começa outro trabalho.
const groupOf = (file: string) => baseOf(file).replace(/\.\d+$/, "");

// Lê public/galeria e devolve os trabalhos em ordem de nome. Fotos e vídeos
// soltos são agrupados pelo nome, como acima; uma pasta também vira um
// trabalho, com tudo o que estiver dentro dela.
// Uma imagem com o mesmo nome de um vídeo (video1.mp4 + video1.jpg) é a capa
// dele, não um item à parte.
export function getWorks(): Work[] {
  const root = path.join(process.cwd(), "public", "galeria");
  if (!fs.existsSync(root)) return [];

  const entries = fs.readdirSync(root, { withFileTypes: true });
  const groups = new Map<string, Media[]>();

  const loose = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => byName(baseOf(a), baseOf(b)));

  for (const media of toMedia(loose, (file) => publicPath(file))) {
    const group = groupOf(media.file);
    groups.set(group, [...(groups.get(group) ?? []), media.item]);
  }

  for (const entry of entries.filter((entry) => entry.isDirectory())) {
    const files = fs.readdirSync(path.join(root, entry.name)).sort((a, b) => byName(baseOf(a), baseOf(b)));
    const media = toMedia(files, (file) => publicPath(entry.name, file)).map((found) => found.item);
    if (media.length > 0) groups.set(entry.name, media);
  }

  return [...groups.entries()].sort(([a], [b]) => byName(a, b)).map(([id, media]) => ({ id, media }));
}

function toMedia(files: string[], toPath: (file: string) => string) {
  const videoBases = new Set(files.filter((file) => VIDEO.test(file)).map(baseOf));
  const found: { file: string; item: Media }[] = [];

  for (const file of files) {
    if (VIDEO.test(file)) {
      const poster = files.find((other) => IMAGE.test(other) && baseOf(other) === baseOf(file));
      found.push({ file, item: { type: "video", src: toPath(file), poster: poster ? toPath(poster) : null } });
    } else if (IMAGE.test(file) && !videoBases.has(baseOf(file))) {
      found.push({ file, item: { type: "image", src: toPath(file) } });
    }
  }

  return found;
}

function publicPath(...segments: string[]) {
  return `/galeria/${segments.map(encodeURIComponent).join("/")}`;
}
