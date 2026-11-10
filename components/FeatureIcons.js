// Ícones de linha das características (estilo do catálogo)
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };

const ICONS = {
  vista: (<g {...P}><rect x="14" y="6" width="20" height="28" /><path d="M24 6v28M14 20h20M28 10l3-3M29 14l3-3" /><path d="M6 34h36M10 34v3h28v-3" /></g>),
  garagem: (<g {...P}><path d="M10 38V12h28v26" /><path d="M14 16h20M14 20h20M14 24h20M14 16v22M34 16v22" /><path d="M5 38h38" /></g>),
  vmc: (<g {...P}><path d="M24 22c-6-1-8-8-3-11" /><path d="M26 24c1-6 8-8 11-3" /><path d="M24 26c6 1 8 8 3 11" /><path d="M22 24c-1 6-8 8-11 3" /><path d="M30 6c5 2 9 6 10 11M40 19v3" /></g>),
  terraco: (<g {...P}><path d="M14 13c2-5 18-5 20 0z" /><path d="M24 8v30" /><path d="M14 25l2 13M14 31h6l1 7M34 25l-2 13M34 31h-6l-1 7" /><path d="M5 38h38" /></g>),
  varanda: (<g {...P}><rect x="16" y="8" width="16" height="16" /><path d="M24 8v16" /><path d="M10 24h28M12 24v12M16 24v12M20 24v12M24 24v12M28 24v12M32 24v12M36 24v12" /><path d="M5 37h38" /></g>),
};

export default function FeatureIcon({ name }) {
  return <svg className="ficon" viewBox="0 0 48 44" aria-hidden="true">{ICONS[name]}</svg>;
}
