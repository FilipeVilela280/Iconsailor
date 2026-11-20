'use client';
// Mapa da Localização no estilo do catálogo: mapa claro, Icon Sailor ao centro
// e linhas até aos pontos de interesse. Passar o rato numa distância (ou num ponto) acende a linha.
import { useState } from 'react';
import Image from 'next/image';
import { DISTANCES } from '@/data/media';
import './MapaBarra.css';

// Posições em píxeis na imagem /img/localizacao/mapa-barra.jpg (2100 × 1800).
// "p" liga o ponto à linha correspondente da lista DISTANCES (data/media.js).
const W = 2100, H = 1800;
const SAILOR = [1108, 722];
const POIS = [
  { p: 'escola', name: 'Escola', x: 916, y: 466 },
  { p: 'escola', name: 'CASCI · Pré-escolar e creche', x: 1316, y: 274 },
  { p: 'praia', name: 'Praia do Paredão (Praia Velha)', x: 200, y: 780 },
  { p: 'ria', name: 'Passadiço sobre a Ria', x: 1156, y: 1396 },
  { p: 'parque', name: 'Parque infantil Quinta da Barra', x: 780, y: 1664 },
];

/** Lista de distâncias (passar o rato destaca o ponto no mapa) */
export function Distances({ active, onHover }) {
  return (
    <ul className="dist">
      {DISTANCES.map((d) => (
        <li
          key={d.p}
          className={active === d.p ? 'on' : ''}
          onMouseEnter={() => onHover(d.p)}
          onMouseLeave={() => onHover(null)}
        >
          <b>{d.name}</b><span>{d.v}<small>{d.u}</small></span>
        </li>
      ))}
    </ul>
  );
}

export function MapPhoto({ active, onHover }) {
  const [sx, sy] = SAILOR;
  const tip = POIS.find((q) => q.p === active);
  return (
    <div className={`locmap ${active ? 'has-active' : ''}`}>
      <Image src="/img/localizacao/mapa-barra.jpg" alt="Mapa da Praia da Barra com o Icon Sailor e pontos de interesse" width={W} height={H} sizes="(max-width: 900px) 100vw, 55vw" />
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {/* linhas */}
        {POIS.map((q, k) => (
          <line key={`l${k}`} className={`lm-line ${active === q.p ? 'on' : ''}`} x1={sx} y1={sy} x2={q.x} y2={q.y} pathLength="1" />
        ))}
        {/* pontos */}
        {POIS.map((q, k) => (
          <g
            key={`p${k}`}
            className={`lm-poi ${active === q.p ? 'on' : ''}`}
            transform={`translate(${q.x} ${q.y})`}
            onMouseEnter={() => onHover(q.p)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onHover(active === q.p ? null : q.p)}
          >
            <circle className="hit" r="60" />
            <circle className="ring" r="34" />
            <circle className="dot" r="13" />
          </g>
        ))}
        {/* Icon Sailor */}
        <g className="lm-sailor" transform={`translate(${sx} ${sy})`}>
          <circle className="pulse" r="40" />
          <circle className="pulse p2" r="40" />
          <circle r="44" fill="#fff" />
          <circle r="32" fill="#24453C" />
          <text y="11" textAnchor="middle" fontSize="30" fill="#F3EFE8" fontFamily="var(--font-serif)" fontWeight="600">IS</text>
          <g transform="translate(58 -26)">
            <rect width="270" height="52" fill="#24453C" />
            <text x="22" y="35" fontSize="26" fill="#F3EFE8" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="7">ICON SAILOR</text>
          </g>
        </g>
      </svg>
      {tip && (
        <span className={`lm-tip ${tip.x < W * 0.22 ? 'l' : tip.x > W * 0.78 ? 'r' : ''}`} style={{ left: `${(tip.x / W) * 100}%`, top: `${(tip.y / H) * 100}%` }}>
          {POIS.filter((q) => q.p === active).map((q) => q.name).join(' · ')}
        </span>
      )}
    </div>
  );
}

export default function LocationBlock({ children }) {
  const [active, setActive] = useState(null);
  return (
    <div className="wrap split locsplit">
      <div className="reveal">
        {children}
        <Distances active={active} onHover={setActive} />
        <p className="note">
          Tempos aproximados.{' '}
          <a href="https://www.google.com/maps/search/?api=1&query=40.6402,-8.7426" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Abrir no Google Maps ↗</a>
        </p>
      </div>
      <div className="reveal"><MapPhoto active={active} onHover={setActive} /></div>
    </div>
  );
}
