'use client';
import { useState } from 'react';
import { DISTANCES } from '@/data/media';
import { Mark } from './Icons';

/** Lista de distâncias + mapa ilustrado (passar o rato numa distância destaca o ponto) */
export function Distances({ active, onHover }) {
  return (
    <ul className="dist">
      {DISTANCES.map((d) => (
        <li key={d.p} onMouseEnter={() => onHover(d.p)} onMouseLeave={() => onHover(null)} style={active === d.p ? { paddingLeft: 8 } : undefined}>
          <b>{d.name}</b><span>{d.v}<small>{d.u}</small></span>
        </li>
      ))}
    </ul>
  );
}

function Poi({ id, active, cx, cy, label, lx, ly, color = '#9CC5B2', children }) {
  return (
    <g className="poi">
      <circle className="halo" cx={cx} cy={cy} r={active === id ? 18 : 10} fill={color} opacity=".35" />
      {children || <circle cx={cx} cy={cy} r="5" fill="#3E6E5F" />}
      {label && <text x={lx} y={ly} fontSize="12" fontFamily="var(--font-sans)" fill="#24453C" fontWeight="600">{label}</text>}
    </g>
  );
}

export function MapSvg({ active }) {
  return (
    <svg viewBox="0 0 600 640">
      <defs>
        <pattern id="sand" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".7" fill="#d8ccb6" /></pattern>
        <pattern id="waves" width="40" height="14" patternUnits="userSpaceOnUse"><path d="M0 7 Q10 2 20 7 T40 7" fill="none" stroke="#c9dde3" strokeWidth="1" /></pattern>
      </defs>
      <rect width="600" height="640" fill="#F6F2EA" />
      <path d="M0 0 H170 C160 120 150 240 140 330 C130 430 120 540 110 640 H0 Z" fill="#DCE8EC" />
      <path d="M0 0 H170 C160 120 150 240 140 330 C130 430 120 540 110 640 H0 Z" fill="url(#waves)" />
      <path d="M170 0 C160 120 150 240 140 330 C130 430 120 540 110 640 H140 C150 540 160 430 170 330 C180 240 190 120 200 0Z" fill="url(#sand)" />
      <path d="M140 300 C220 290 300 300 360 320 C420 340 470 330 600 300 V380 C470 410 420 420 360 400 C300 380 220 370 135 370 Z" fill="#CFE2E4" />
      <path d="M360 400 C380 470 390 560 395 640 H470 C460 560 450 470 430 410Z" fill="#CFE2E4" />
      <path d="M140 318 L60 300" stroke="#a9a196" strokeWidth="5" strokeLinecap="round" />
      <path d="M138 365 L70 382" stroke="#a9a196" strokeWidth="5" strokeLinecap="round" />
      <g stroke="#e6ded0" strokeWidth="6" fill="none" strokeLinecap="round">
        <path d="M220 40 L250 290" /><path d="M200 120 L520 140" /><path d="M210 210 L560 225" /><path d="M330 30 L345 290" /><path d="M440 60 L455 290" />
        <path d="M200 460 L360 450" /><path d="M190 560 L370 560" /><path d="M260 400 L270 640" />
      </g>
      <path d="M470 300 L520 395" stroke="#8d8578" strokeWidth="5" />
      <text x="525" y="360" fontSize="11" fill="#8d8578" fontFamily="var(--font-sans)" letterSpacing="1.5">PONTE DA BARRA</text>
      <text x="40" y="190" fontSize="13" fill="#7fa1ab" fontFamily="var(--font-serif)" fontStyle="italic" transform="rotate(-86 40 190)">Oceano Atlântico</text>
      <text x="400" y="365" fontSize="15" fill="#6f98a3" fontFamily="var(--font-serif)" fontStyle="italic">Ria de Aveiro</text>
      <text x="232" y="520" fontSize="11" fill="#9a9488" fontFamily="var(--font-sans)" letterSpacing="2">COSTA NOVA ↓</text>
      <text x="470" y="96" fontSize="11" fill="#9a9488" fontFamily="var(--font-sans)" letterSpacing="2">AVEIRO ↗</text>
      <Poi id="praia" active={active} cx={168} cy={200} label="Praia da Barra" lx={182} ly={186} />
      <Poi id="farol" active={active} cx={232} cy={280} label="Farol da Barra" lx={244} ly={268} color="#B9533C">
        <g transform="translate(226 252)">
          <rect x="3" y="4" width="6" height="22" fill="#fff" stroke="#B9533C" /><rect x="3" y="9" width="6" height="4" fill="#B9533C" />
          <rect x="3" y="17" width="6" height="4" fill="#B9533C" /><rect x="2" y="0" width="8" height="4" fill="#24453C" />
        </g>
      </Poi>
      <Poi id="ria" active={active} cx={330} cy={318} />
      <Poi id="costa" active={active} cx={290} cy={580} label="Costa Nova" lx={304} ly={584} />
      <g transform="translate(300 175)">
        <circle r="28" fill="#24453C" opacity=".12">
          <animate attributeName="r" values="18;34;18" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".25;0;.25" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle r="17" fill="#24453C" />
        <foreignObject x="-12" y="-12" width="24" height="24"><Mark color="#F3EFE8" style={{ width: 24, height: 24, display: 'block' }} /></foreignObject>
        <rect x="24" y="-14" width="104" height="28" fill="#24453C" />
        <text x="34" y="5" fontSize="12" fill="#F3EFE8" fontFamily="var(--font-serif)" letterSpacing="2.5" fontWeight="600">ICON SAILOR</text>
      </g>
      <g transform="translate(550 590)" fontFamily="var(--font-sans)" fontSize="10" fill="#6B6A63">
        <path d="M0 -18 L5 0 L0 -4 L-5 0Z" fill="#24453C" /><text x="-3" y="-22">N</text>
      </g>
    </svg>
  );
}

export default function LocationBlock({ children }) {
  const [active, setActive] = useState(null);
  return (
    <div className="wrap split" style={{ alignItems: 'start' }}>
      <div className="reveal">
        {children}
        <Distances active={active} onHover={setActive} />
        <p className="note">
          Tempos aproximados.{' '}
          <a href="https://www.google.com/maps/search/Praia+da+Barra,+%C3%8Dlhavo" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Abrir no Google Maps ↗</a>
        </p>
      </div>
      <div className="mapbox reveal"><MapSvg active={active} /></div>
    </div>
  );
}
