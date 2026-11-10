// Logótipo (símbolo) e ícones partilhados

/** Símbolo Icon Sailor: duas velas + linha de água. Usa a cor do texto (currentColor). */
export function Mark({ className, style, color }) {
  return (
    <svg className={className} style={{ color, ...style }} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M25 4 C33 13 38 24 40 37 H25 Z" fill="currentColor" />
      <path d="M21 12 C16 19 11 28 8 37 H21 Z" fill="currentColor" opacity=".45" />
      <rect x="6" y="41" width="36" height="2.4" rx="1.2" fill="currentColor" />
    </svg>
  );
}

export function Brand({ style, markSize = 40 }) {
  return (
    <span className="brand" style={style}>
      <Mark className="mark" style={{ width: markSize, height: markSize }} />
      <span className="wm"><b>ICON SAILOR</b><small>PRAIA DA BARRA</small></span>
    </span>
  );
}

export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 18 10" aria-hidden="true">
      <path d="M0 5h16M12 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function Play({ style }) {
  return (
    <svg viewBox="0 0 24 24" style={style} aria-hidden="true"><path d="M6 3v18l15-9z" fill="currentColor" /></svg>
  );
}
