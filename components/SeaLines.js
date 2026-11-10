// Decoração "carta náutica": linhas batimétricas (ondas finas) que se movem devagar,
// duas linhas verticais a emoldurar o conteúdo e as coordenadas da Barra.
// Uso: dentro de uma <section className="blk sea"> → <SeaLines /> (ou <SeaLines light /> em fundo claro)

const W = 1200; // largura de um período; o SVG desenha 2 períodos para o movimento ser contínuo

function wave(y, amp, cycles, phase) {
  let d = `M0 ${y}`;
  for (let x = 0; x <= W * 2; x += 240) {
    const yy = y + amp * Math.sin((x / W) * cycles * Math.PI * 2 + phase);
    d += ` L${x} ${yy.toFixed(1)}`;
  }
  return d;
}

// [altura, amplitude, ondas por período, fase, tracejado]
const LINES = [
  [70, 14, 1, 0, false],
  [105, 10, 2, 1.2, true],
  [140, 16, 1, 2.4, false],
  [175, 8, 2, 0.6, true],
];

export default function SeaLines({ light = false, coords = '40.6402 · −8.7426' }) {
  return (
    <div className={`sea-lines ${light ? 'light' : ''}`} aria-hidden="true">
      <svg className="sea-waves" viewBox={`0 0 ${W * 2} 240`} preserveAspectRatio="none">
        {LINES.map(([y, a, c, p, dash], i) => (
          <path key={i} d={wave(y, a, c, p)} fill="none" vectorEffect="non-scaling-stroke"
            strokeDasharray={dash ? '2 6' : undefined} className={i % 2 ? 'w2' : 'w1'} />
        ))}
      </svg>
      <span className="sea-frame" />
      <span className="sea-coords">{coords}</span>
    </div>
  );
}
