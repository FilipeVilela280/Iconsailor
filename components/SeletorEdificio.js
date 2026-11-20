'use client';
// Seletor de frações sobre o render da fachada (como nos sites de promotoras):
// passar o rato numa fração acende-a (cor do estado) e mostra a informação; clicar abre a ficha.
// Contornos em píxeis da imagem /img/exterior/ext-fachada.jpg (1920 × 1920).
import { useRef, useState } from 'react';
import { UNITS, ST_NAME, m2, floorLabel } from '@/data/units';
import { TYPES } from '@/data/types';
import './SeletorEdificio.css';

const IMG = '/img/exterior/ext-fachada.jpg';
const W = 1920, H = 1920;
const VIEW = [120, 380, 1700, 1300]; // recorte visível: x, y, largura, altura

// Frações visíveis na fachada da frente (sul). Uma fração pode ter vários contornos (o duplex H).
export const SHAPES = [
  { id: 'H', points: '163,557 426,557 426,509 1258,509 1175,576 1175,687 1651,687 1651,778 163,778' }, // H · piso 3 recuado
  { id: 'H', points: '163,778 703,778 703,1046 163,1046' },     // H · piso 2
  { id: 'G', points: '703,778 1718,778 1718,1046 703,1046' },
  { id: 'E', points: '163,1046 703,1046 703,1309 163,1309' },
  { id: 'D', points: '703,1046 1718,1046 1718,1309 703,1309' },
  { id: 'B', points: '163,1309 684,1309 684,1578 163,1578' },
  { id: 'A', points: '968,1309 1565,1309 1565,1578 968,1578' },
];
// Frações nas traseiras (não se veem neste render)
const BACK = ['C', 'F', 'I'];

const unit = (id) => UNITS.find((u) => u.id === id);

export default function SeletorEdificio({ selected, onHover, onSelect }) {
  const [hover, setHover] = useState(null);
  const [pos, setPos] = useState([0, 0]);
  const box = useRef(null);
  const move = (e) => {
    const r = box.current.getBoundingClientRect();
    setPos([e.clientX - r.left, e.clientY - r.top]);
  };
  const enter = (id) => { setHover(id); onHover && onHover(id); };
  const leave = () => { setHover(null); onHover && onHover(null); };
  const active = hover || selected;
  const u = hover ? unit(hover) : null;

  return (
    <div className="seletor reveal" ref={box} onMouseMove={move} onMouseLeave={leave}>
      <div className="sel-img" style={{ aspectRatio: `${VIEW[2]} / ${VIEW[3]}` }}>
        <svg viewBox={VIEW.join(' ')} preserveAspectRatio="xMidYMid slice">
          <image href={IMG} x="0" y="0" width={W} height={H} />
          {SHAPES.map((s, k) => (
            <polygon
              key={k}
              points={s.points}
              className={`st-${unit(s.id).st} ${active === s.id ? 'hov' : ''}`}
              onMouseEnter={() => enter(s.id)}
              onClick={() => onSelect && onSelect(s.id)}
            >
              <title>Fração {s.id}</title>
            </polygon>
          ))}
        </svg>
      </div>

      {u && (
        <div className={`sel-tip ${pos[0] > (box.current?.clientWidth || 0) * 0.62 ? 'left' : ''}`} style={{ left: pos[0], top: pos[1] }}>
          <small className="fl">{floorLabel(u)}</small>
          <b>{TYPES[u.model].name.split(' ')[0]} · {u.id}</b>
          <span className={`st-txt ${u.st}`}>{ST_NAME[u.st]}</span>
          <small>{m2(u.int)} interior{u.ext?.length ? ` · ${m2(u.ext.reduce((a, e) => a + e[1], 0))} exterior` : ''}</small>
          <em>Clique para ver a ficha →</em>
        </div>
      )}

      <div className="sel-foot">
        <p className="sel-hint">Passe o rato sobre o edifício e clique numa fração</p>
        <div className="sel-back">
          <span>Nas traseiras</span>
          {BACK.map((id) => {
            const b = unit(id);
            return (
              <button key={id} className={`st-${b.st} ${active === id ? 'on' : ''}`} onMouseEnter={() => onHover && onHover(id)} onMouseLeave={() => onHover && onHover(null)} onClick={() => onSelect && onSelect(id)}>
                {id}<small>{TYPES[b.model].name.split(' ')[0]} · {floorLabel(b).replace(' · Recuado', '')}</small>
              </button>
            );
          })}
        </div>
      </div>
      <div className="sel-legend">
        <span><i className="d" />Disponível</span><span><i className="r" />Reservado</span><span><i className="v" />Vendido</span>
      </div>
    </div>
  );
}
