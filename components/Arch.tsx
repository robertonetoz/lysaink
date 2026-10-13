const RATIOS = { "2/3": 1.5, "3/4": 4 / 3, "1/2": 2 } as const;

export type ArchRatio = keyof typeof RATIOS;

// Arco ogival equilátero: dois arcos de raio igual à largura, centrados nas
// impostas opostas. A ponta fica a 0,866 × largura acima da linha de imposta.
const SPRING = 86.6;

function archPath(height: number, inset = 0) {
  const r = 100 - inset;
  const apex = SPRING - Math.sqrt(r * r - 2500);
  return `M${inset},${height - inset} L${inset},${SPRING} A${r},${r} 0 0 1 50,${apex.toFixed(2)} A${r},${r} 0 0 1 ${100 - inset},${SPRING} L${100 - inset},${height - inset} Z`;
}

function clipId(ratio: ArchRatio) {
  return `arco-${ratio.replace("/", "-")}`;
}

// Recortes em coordenadas relativas, um por proporção. Fica no layout, uma vez.
export function ArchDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        {(Object.keys(RATIOS) as ArchRatio[]).map((ratio) => {
          const spring = (0.866 / RATIOS[ratio]).toFixed(4);
          const ry = (1 / RATIOS[ratio]).toFixed(4);
          return (
            <clipPath key={ratio} id={clipId(ratio)} clipPathUnits="objectBoundingBox">
              <path d={`M0,1 L0,${spring} A1,${ry} 0 0 1 0.5,0 A1,${ry} 0 0 1 1,${spring} L1,1 Z`} />
            </clipPath>
          );
        })}
      </defs>
    </svg>
  );
}

type ArchProps = {
  ratio?: ArchRatio;
  frame?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function Arch({ ratio = "2/3", frame = true, className = "", children }: ArchProps) {
  const height = 100 * RATIOS[ratio];

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: `1 / ${RATIOS[ratio]}` }}>
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `url(#${clipId(ratio)})` }}>
        {children}
      </div>
      {frame && (
        <svg
          aria-hidden
          viewBox={`0 0 100 ${height}`}
          fill="none"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <path d={archPath(height, -3.5)} stroke="currentColor" strokeOpacity="0.4" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </div>
  );
}
