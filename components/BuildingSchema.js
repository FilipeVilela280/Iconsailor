'use client';
import { UNITS, ST_FILL, unitsOnFloor } from '@/data/units';

// Geometria simplificada de cada piso (caixa 100 × 100), desenhada a partir das plantas de arquitetura.
const ZONES = {
  norte: 'M16 4 H90 V37 H16 Z',
  poente: 'M0 27 H16 V37 H33 V100 H0 Z',
  nascente: 'M60 37 H90 V100 H33 V70 H60 Z',
};
const CORE = 'M33 37 H60 V70 H33 Z';
const LABEL = { norte: [53, 21], poente: [16, 68], nascente: [70, 72] };
const REC_H = 'M0 0 H50 V25 H65 V100 H0 Z';

/** Planta-chave de um piso: frações coloridas pelo estado, a selecionada destacada */
export function KeyPlan({ floor, selected, onSelect, onHover, filter, mono, size = '100%' }) {
  const recuado = floor === 3;
  const units = unitsOnFloor(floor);
  const fillOf = (u) => {
    if (selected === u.id) return '#24453C';
    if (mono) return '#E7E0D4';
    return ST_FILL[u.st];
  };
  const txt = (u) => (selected === u.id ? '#F3EFE8' : '#24453C');
  return (
    <svg viewBox="-4 -4 108 108" style={{ width: size, display: 'block' }}>
      {/* contorno exterior + varandas */}
      {!recuado && <path d="M16 0 H97 V100 H90 V4 H16 Z" fill="#EFEAE1" />}
      {recuado ? (
        <>
          <rect x="0" y="0" width="100" height="100" fill="#EFEAE1" />
          <rect x="70" y="30" width="24" height="22" fill="#bfe0d8" stroke="#3E6E5F" strokeWidth=".6" />
          <text x="82" y="43" textAnchor="middle" fontSize="4" fill="#24453C" fontFamily="var(--font-sans)" letterSpacing=".4">PISCINA</text>
          <text x="82" y="78" textAnchor="middle" fontSize="4" fill="#6B6A63" fontFamily="var(--font-sans)" letterSpacing=".4">TERRAÇO</text>
        </>
      ) : (
        <path d={CORE} fill="#D9D3C8" />
      )}
      {units.map((u) => {
        const d = recuado ? REC_H : ZONES[u.zone];
        const [lx, ly] = recuado ? [28, 60] : LABEL[u.zone];
        const vis = filter ? filter(u) : true;
        return (
          <g key={u.id} className="u" opacity={vis ? 1 : 0.3} onClick={() => onSelect?.(u.id)} onMouseEnter={() => onHover?.(u.id)}>
            <path d={d} fill={fillOf(u)} stroke="#fff" strokeWidth="1.2" />
            <text x={lx} y={ly} textAnchor="middle" fontSize="11" fontFamily="var(--font-serif)" fontWeight="600" fill={txt(u)}>{u.id}</text>
            <text x={lx} y={ly + 7} textAnchor="middle" fontSize="4.2" fontFamily="var(--font-sans)" letterSpacing=".5" fill={txt(u)}>{u.ty === 'T4' ? 'T4 DUPLEX' : u.ty}</text>
          </g>
        );
      })}
      {!recuado && <text x="46.5" y="55" textAnchor="middle" fontSize="3.6" fill="#6B6A63" fontFamily="var(--font-sans)" letterSpacing=".4">ESCADA</text>}
    </svg>
  );
}

/** Alçado simplificado: pisos empilhados, o(s) piso(s) da fração destacados */
export function Elevation({ floors = [], current, onPick, size = '100%' }) {
  const rows = [3, 2, 1, 0];
  const y = (f) => (3 - f) * 16 + 4;
  return (
    <svg viewBox="0 0 140 72" style={{ width: size, display: 'block' }}>
      <line x1="2" y1="68" x2="138" y2="68" stroke="#24453C" strokeWidth=".8" />
      {rows.map((f) => {
        const on = floors.includes(f);
        const x = f === 3 ? 22 : 14, w = f === 3 ? 70 : 112;
        return (
          <g key={f} className={onPick ? 'u' : undefined} onClick={() => onPick?.(f)}>
            <rect x={x} y={y(f)} width={w} height="14" fill={on ? '#24453C' : current === f ? '#9CC5B2' : '#E7E0D4'} stroke="#fff" />
            {/* janelas */}
            {Array.from({ length: f === 3 ? 4 : 7 }).map((_, i) => (
              <rect key={i} x={x + 5 + i * (f === 3 ? 17 : 15.5)} y={y(f) + 4} width="7" height="6" fill={on ? '#3E6E5F' : '#fff'} opacity=".8" />
            ))}
            <text x={x + w + 4} y={y(f) + 9.5} fontSize="5.5" fill="#6B6A63" fontFamily="var(--font-sans)">{f === 3 ? 'R' : f}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function BuildingSchema(props) {
  return <KeyPlan {...props} />;
}

export { UNITS };
