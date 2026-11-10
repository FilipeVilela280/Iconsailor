'use client';
import { SPOTS } from '@/data/parking';

/**
 * Planta esquemática do estacionamento.
 * unit  → fração cujos lugares ficam destacados
 * mini  → versão pequena (só o número dos lugares destacados)
 */
export default function ParkingPlan({ unit, mini = false, onPick }) {
  const T = mini ? 0 : 1;
  return (
    <svg viewBox="0 0 1043 1043" style={{ width: '100%', display: 'block' }}>
      {/* zonas */}
      <rect x="8" y="5" width="1027" height="1030" fill="#F6F2EA" stroke="#24453C" strokeWidth={mini ? 10 : 6} />
      <rect x="15" y="575" width="1012" height="455" fill="#E9E3D8" />
      <line x1="15" y1="575" x2="1027" y2="575" stroke="#24453C" strokeWidth="4" strokeDasharray="18 12" />

      {/* acessos e núcleo */}
      <rect x="790" y="10" width="58" height="290" fill="#DED7CA" />
      <rect x="398" y="600" width="152" height="280" fill="#CFC8BB" />
      <rect x="850" y="655" width="172" height="375" fill="url(#ramp)" />
      <defs>
        <pattern id="ramp" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="26" height="26" fill="#E9E3D8" /><line x1="0" y1="0" x2="0" y2="26" stroke="#CFC8BB" strokeWidth="8" />
        </pattern>
      </defs>

      {/* lugares */}
      {SPOTS.map((s) => {
        const [x, y, w, h] = s.r;
        const on = s.u === unit;
        return (
          <g key={s.n} className={onPick ? 'u' : undefined} onClick={() => onPick?.(s.u)}>
            <rect x={x} y={y} width={w} height={h} fill={on ? '#24453C' : mini ? '#E7E0D4' : '#FFFDF9'}
              stroke={on ? '#24453C' : '#BDB4A5'} strokeWidth={mini ? 6 : 3} />
            {s.t === 'b' && !on && <path d={`M${x} ${y}L${x + w} ${y + h}M${x + w} ${y}L${x} ${y + h}`} stroke="#E2DBCF" strokeWidth="3" />}
            {(T || on) && (
              <text x={x + w / 2} y={y + h / 2 + (mini ? 30 : 6)} textAnchor="middle" fontFamily="var(--font-serif)"
                fontSize={mini ? 100 : 54} fontWeight="600" fill={on ? '#F3EFE8' : '#24453C'}>{s.n}</text>
            )}
            {T && (
              <g textAnchor="middle" fontFamily="var(--font-sans)" fill={on ? '#9CC5B2' : '#6B6A63'}>
                <text x={x + w / 2} y={y + h / 2 + 42} fontSize="20" letterSpacing="2" fontWeight="600">{s.u}</text>
                <text x={x + w / 2} y={y + h / 2 + 68} fontSize="19">{s.a.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} m²</text>
              </g>
            )}
          </g>
        );
      })}

      {T && (
        <g fontFamily="var(--font-sans)" fill="#6B6A63" letterSpacing="5" fontSize="22">
          <text x="40" y="300">ESTACIONAMENTO DESCOBERTO</text>
          <text x="40" y="555">ESTACIONAMENTO COBERTO · SOB O EDIFÍCIO</text>
          <text x="474" y="735" textAnchor="middle" fontSize="15" letterSpacing="1">ELEVADOR</text>
          <text x="474" y="760" textAnchor="middle" fontSize="15" letterSpacing="1">ESCADA</text>
          <text x="936" y="850" textAnchor="middle" fill="#24453C">ACESSO</text>
          <text x="936" y="880" textAnchor="middle" fontSize="40" fill="#24453C">↓</text>
        </g>
      )}
    </svg>
  );
}
