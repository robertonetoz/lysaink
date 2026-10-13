function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

type Options = { seed?: number; cross?: number; vertical?: boolean; scale?: number };

// Um único traço contínuo: a haste segue reta e cada espinho sai e volta,
// para que o desenho possa ser "tatuado" do começo ao fim com pathLength.
// `scale` encolhe os espinhos para caber na margem estreita do celular.
export function thornPath(length: number, { seed = 7, cross = 40, vertical = true, scale = 1 }: Options = {}) {
  const rand = mulberry32(seed);
  const mid = cross / 2;
  const sway = (along: number) => Math.sin(along / 70) * 2.5 * scale;
  const pt = (along: number, off: number) => {
    const a = along.toFixed(1);
    const o = (mid + off).toFixed(1);
    return vertical ? `${o},${a}` : `${a},${o}`;
  };

  const foot = 8 * Math.max(scale, 0.6);

  let d = `M${pt(0, sway(0))}`;
  let along = 0;
  let i = 0;

  while (along < length - 80) {
    along += 34 + rand() * 52;
    const side = i % 2 ? 1 : -1;
    const reach = (9 + rand() * 9) * scale;
    const hook = (5 + rand() * 7) * Math.max(scale, 0.6);
    const base = sway(along);

    d += ` L${pt(along, base)}`;
    d += ` Q${pt(along - 1, base + side * reach * 0.45)} ${pt(along - hook, base + side * reach)}`;
    d += ` Q${pt(along + foot * 0.4, base + side * reach * 0.4)} ${pt(along + foot, sway(along + foot))}`;

    along += foot;
    i++;
  }

  return `${d} L${pt(length, sway(length))}`;
}
