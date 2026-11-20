'use client';
// Mapa interativo da Localização (estilo "o que há à volta").
// Dados: data/mapa.js · Motor: Leaflet (BSD), copiado para /public/vendor/leaflet/.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PROJETO, MAPA_FUNDO, CATEGORIAS, LOCAIS } from '@/data/mapa';
import './MapaInterativo.css';

// Ícones simples (linha) por categoria
export const ICONES = {
  educacao: '<path d="M3 9l9-4 9 4-9 4-9-4z"/><path d="M7 11v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4"/><path d="M21 9v5"/>',
  saude: '<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>',
  verdes: '<path d="M12 21v-6"/><path d="M12 15c-4 0-6-3-6-6 0-3.5 3-6 6-6s6 2.5 6 6c0 3-2 6-6 6z"/>',
  praias: '<circle cx="12" cy="11" r="3.5"/><path d="M12 3v2M5.5 6.5 7 8M18.5 6.5 17 8M3 11h2M19 11h2"/><path d="M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0"/>',
  cultura: '<path d="M3 9l9-5 9 5"/><path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9"/><path d="M3 20h18"/>',
  comercio: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  transportes: '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14"/><circle cx="8.5" cy="14" r=".8"/><circle cx="15.5" cy="14" r=".8"/><path d="M7 21l2-4M17 21l-2-4"/>',
  acessos: '<path d="M8 3 5 21M16 3l3 18"/><path d="M12 4v2M12 9v2M12 14v2M12 19v2"/>',
  todos: '<circle cx="12" cy="12" r="3"/><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>',
};
const svg = (k, size = 20) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONES[k] || ''}</svg>`;

// Leaflet carregado uma vez
let loader;
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = '/vendor/leaflet/leaflet.css';
      document.head.appendChild(css);
      const s = document.createElement('script');
      s.src = '/vendor/leaflet/leaflet.js';
      s.onload = () => resolve(window.L);
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }
  return loader;
}

// Ao abrir, o mapa enquadra os locais até esta distância (km). "Ver todos" mostra tudo.
const RAIO_INICIAL = 4;

// Distância em linha reta (km)
function km(a, b) {
  const R = 6371, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const fmtKm = (d) => (d < 1 ? `${Math.round(d * 1000 / 10) * 10} m` : `${d.toFixed(1).replace('.', ',')} km`);

// Espaço ocupado pelos cartões, para os pontos não ficarem tapados
function margens() {
  if (typeof window === 'undefined' || window.innerWidth <= 820) return { paddingTopLeft: [30, 30], paddingBottomRight: [30, 30] };
  const card = document.querySelector('.mi-card');
  const w = card ? card.getBoundingClientRect().right + 40 : 480;
  return { paddingTopLeft: [w, 50], paddingBottomRight: [60, 50] };
}

export default function MapaInterativo({ titulo = 'No centro de tudo', subtitulo = 'Onde tudo fica mais perto' }) {
  const editar = useSearchParams().get('editar') === '1';
  const box = useRef(null);
  const mapRef = useRef(null);
  const layers = useRef({});
  const linha = useRef(null);
  const [ativas, setAtivas] = useState(() => new Set(CATEGORIAS.map((c) => c.id)));
  const [sel, setSel] = useState(null); // índice em LOCAIS
  const [aviso, setAviso] = useState('');

  const contagem = useMemo(() => {
    const m = {};
    LOCAIS.forEach((l) => (m[l.cat] = (m[l.cat] || 0) + 1));
    return m;
  }, []);

  // Cria o mapa
  useEffect(() => {
    let alive = true;
    loadLeaflet().then((L) => {
      if (!alive || !box.current || mapRef.current) return;
      const map = L.map(box.current, { zoomControl: false, scrollWheelZoom: false, attributionControl: true })
        .setView([PROJETO.lat, PROJETO.lng], 13);
      const todosPontos = () => L.latLngBounds([[PROJETO.lat, PROJETO.lng], ...LOCAIS.map((x) => [x.lat, x.lng])]);
      const pertoPontos = () => L.latLngBounds([[PROJETO.lat, PROJETO.lng], ...LOCAIS.filter((x) => km(PROJETO, x) <= RAIO_INICIAL).map((x) => [x.lat, x.lng])]);
      map.verTudo = () => map.flyToBounds(todosPontos(), { ...margens(), duration: 0.8 });
      requestAnimationFrame(() => map.fitBounds(pertoPontos(), margens()));
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.tileLayer(MAPA_FUNDO.url, { attribution: MAPA_FUNDO.atribuicao, maxZoom: 19, subdomains: 'abcd' }).addTo(map);
      map.on('click', (e) => {
        if (editar) {
          const t = `lat: ${e.latlng.lat.toFixed(5)}, lng: ${e.latlng.lng.toFixed(5)},`;
          navigator.clipboard?.writeText(t).catch(() => {});
          setAviso(t);
        } else setSel(null);
      });
      // ativa o scroll do rato só depois de clicar no mapa
      map.once('focus', () => map.scrollWheelZoom.enable());

      // Projeto
      L.marker([PROJETO.lat, PROJETO.lng], {
        zIndexOffset: 1000,
        icon: L.divIcon({
          className: 'mi-proj',
          html: `<span class="mi-proj-pulse"></span><span class="mi-proj-dot">IS</span><span class="mi-proj-label">${PROJETO.nome}</span>`,
          iconSize: [0, 0],
        }),
      }).addTo(map);

      // Locais por categoria
      CATEGORIAS.forEach((c) => (layers.current[c.id] = L.layerGroup().addTo(map)));
      LOCAIS.forEach((l, i) => {
        const g = layers.current[l.cat];
        if (!g) return;
        L.marker([l.lat, l.lng], {
          title: l.nome,
          icon: L.divIcon({ className: 'mi-pin', html: `<span data-i="${i}">${svg(l.cat, 18)}</span>`, iconSize: [36, 36], iconAnchor: [18, 18] }),
        })
          .on('click', (e) => { L.DomEvent.stopPropagation(e); setSel(i); })
          .addTo(g);
      });
      mapRef.current = map;
    });
    return () => {
      alive = false;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [editar]);

  // Mostrar/esconder categorias
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.entries(layers.current).forEach(([id, g]) => {
      if (ativas.has(id)) g.addTo(map); else g.remove();
    });
    if (sel !== null && !ativas.has(LOCAIS[sel].cat)) setSel(null);
  }, [ativas, sel]);

  // Local selecionado: destaque, linha até ao projeto e centrar
  useEffect(() => {
    const map = mapRef.current;
    const L = typeof window !== 'undefined' ? window.L : null;
    if (!map || !L) return;
    document.querySelectorAll('.mi-pin.on').forEach((el) => el.classList.remove('on'));
    linha.current?.remove();
    linha.current = null;
    if (sel === null) return;
    const l = LOCAIS[sel];
    document.querySelector(`.mi-pin span[data-i="${sel}"]`)?.parentElement.classList.add('on');
    linha.current = L.polyline([[PROJETO.lat, PROJETO.lng], [l.lat, l.lng]], { color: '#24453C', weight: 2, dashArray: '6 6', opacity: 0.8 }).addTo(map);
    const m = margens();
    if (window.innerWidth > 820) m.paddingBottomRight = [420, 50]; // cartão do local à direita
    map.flyToBounds(L.latLngBounds([[PROJETO.lat, PROJETO.lng], [l.lat, l.lng]]), { ...m, duration: 0.9, maxZoom: 16 });
  }, [sel]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(''), 5000);
    return () => clearTimeout(t);
  }, [aviso]);

  const toggle = (id) => {
    setAtivas((prev) => {
      const todas = prev.size === CATEGORIAS.length;
      // 1.º clique com tudo ligado: mostra só essa categoria
      if (todas) return new Set([id]);
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n.size ? n : new Set(CATEGORIAS.map((c) => c.id));
    });
  };
  const verTodos = () => {
    setAtivas(new Set(CATEGORIAS.map((c) => c.id)));
    setSel(null);
    mapRef.current?.verTudo();
  };

  const l = sel !== null ? LOCAIS[sel] : null;
  const cat = l ? CATEGORIAS.find((c) => c.id === l.cat) : null;
  const dist = l ? km(PROJETO, l) : 0;
  const todas = ativas.size === CATEGORIAS.length;

  return (
    <section className="mi">
      <div className="mi-map" ref={box} />

      <div className="mi-card reveal">
        <h2>{titulo}</h2>
        <p className="mi-sub">{subtitulo}</p>
        <ul className="mi-cats">
          {CATEGORIAS.filter((c) => contagem[c.id]).map((c) => (
            <li key={c.id}>
              <button className={todas || ativas.has(c.id) ? 'on' : ''} onClick={() => toggle(c.id)} aria-pressed={ativas.has(c.id)}>
                <i dangerouslySetInnerHTML={{ __html: svg(c.icone, 18) }} />
                {c.nome}
              </button>
            </li>
          ))}
        </ul>
        <button className="mi-all" onClick={verTodos}>
          <i dangerouslySetInnerHTML={{ __html: svg('todos', 22) }} />
          Ver todos
        </button>
      </div>

      {l && (
        <div className="mi-info" key={sel}>
          <button className="mi-x" onClick={() => setSel(null)} aria-label="Fechar">×</button>
          <p className="mi-cat">{cat?.nome}</p>
          <h3>{l.nome}</h3>
          {l.foto && <img src={l.foto} alt={l.nome} />}
          {l.texto && <p>{l.texto}</p>}
          <p className="mi-dist">
            <b>{fmtKm(dist)}</b> do Icon Sailor
            <small>em linha reta · ≈ {Math.max(1, Math.round((dist * 1.3) / 4.8 * 60))} min a pé · ≈ {Math.max(1, Math.round((dist * 1.3) / 35 * 60))} min de carro</small>
          </p>
        </div>
      )}

      {editar && (
        <div className="mi-edit">
          <b>Modo de edição</b> · clique no mapa para copiar as coordenadas
          {aviso && <code>{aviso}</code>}
        </div>
      )}
    </section>
  );
}
