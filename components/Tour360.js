'use client';
// Tour virtual 360° com navegação entre divisões e pelas plantas.
// A configuração (divisões, ligações, posições) está em data/tour360.js.
// Visualizador: Pannellum (MIT), copiado para /public/vendor/pannellum/.
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { TITULO, SUBTITULO, PRIMEIRA, PISOS, DIVISOES } from '@/data/tour360';
import './Tour360.css';

// Movimento — ajuste aqui (tempos em milissegundos)
const MOV = {
  campo: 100,        // abertura normal da câmara (graus)
  aproximar: 55,     // quanto a câmara "avança" para a porta antes de mudar de divisão
  virar: 650,        // tempo a virar/avançar para a porta
  fade: 800,         // tempo da passagem entre divisões
  chegada: 1300,     // tempo a afastar ao chegar à nova divisão
  parado: 4000,      // tempo parado até começar a rodar sozinho
  velocidade: -2.2,  // velocidade da rotação automática (negativo = para a esquerda)
};

const byId = Object.fromEntries(DIVISOES.map((d) => [d.id, d]));
const r1 = (n) => Math.round(n);

// Carrega o Pannellum uma só vez
let loader;
function loadPannellum() {
  if (typeof window === 'undefined') return Promise.reject();
  if (window.pannellum) return Promise.resolve(window.pannellum);
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = '/vendor/pannellum/pannellum.css';
      document.head.appendChild(css);
      const s = document.createElement('script');
      s.src = '/vendor/pannellum/pannellum.js';
      s.onload = () => resolve(window.pannellum);
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }
  return loader;
}

// Seta das ligações (HTML dentro do 360)
function hotspot(div, args) {
  div.classList.add('t360-hs');
  div.innerHTML = `<span class="t360-hs-dot"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2"/></svg></span><span class="t360-hs-label">${args.nome}</span>`;
}

export default function Tour360() {
  const params = useSearchParams();
  const editar = params.get('editar') === '1';
  // ?cena=id abre diretamente nessa divisão (vem da galeria do Tour)
  const inicial = useRef(byId[params.get('cena')] ? params.get('cena') : PRIMEIRA).current;
  const box = useRef(null);
  const viewer = useRef(null);
  const irRef = useRef(() => {});
  const chegada = useRef(false);   // true enquanto a próxima cena deve "afastar" ao carregar
  const aMudar = useRef(false);    // true durante a transição
  const ultimoToque = useRef(Date.now());
  const [atual, setAtual] = useState(inicial);
  const [piso, setPiso] = useState(byId[inicial].piso);
  const [painel, setPainel] = useState(true);
  const [rodar, setRodar] = useState(true);
  const [erro, setErro] = useState(false);
  const [aviso, setAviso] = useState('');
  const [proporcao, setProporcao] = useState({}); // largura/altura de cada planta, para caberem todas no mesmo quadrado

  const copiar = useCallback((txt) => {
    navigator.clipboard?.writeText(txt).catch(() => {});
    setAviso(txt);
  }, []);

  // Cria o visualizador
  useEffect(() => {
    let alive = true;
    loadPannellum()
      .then((pannellum) => {
        if (!alive || !box.current) return;
        const scenes = {};
        for (const d of DIVISOES) {
          scenes[d.id] = {
            title: d.nome,
            panorama: d.imagem,
            yaw: d.inicio?.yaw ?? 0,
            pitch: d.inicio?.pitch ?? 0,
            hfov: MOV.campo,
            hotSpots: (d.ligacoes || [])
              .filter((l) => byId[l.para])
              .map((l) => ({
                type: 'info',
                yaw: l.yaw,
                pitch: l.pitch ?? -8,
                createTooltipFunc: hotspot,
                createTooltipArgs: { nome: byId[l.para].nome },
                clickHandlerFunc: () => irRef.current(l.para, l.yaw, l.pitch ?? -8),
              })),
          };
        }
        const v = pannellum.viewer(box.current, {
          default: { firstScene: inicial, sceneFadeDuration: MOV.fade, autoLoad: true },
          scenes,
          showControls: false,
          showFullscreenCtrl: false,
          mouseZoom: true,
          minHfov: 50,
          maxHfov: 120,
          friction: 0.12,
          compass: false,
        });
        v.on('scenechange', (id) => {
          setAtual(id);
          setPiso(byId[id].piso);
        });
        // ao chegar a uma divisão: afasta suavemente (efeito de "entrar")
        const afastar = () => {
          if (chegada.current) {
            chegada.current = false;
            v.setHfov(MOV.campo, MOV.chegada);
            setTimeout(() => { aMudar.current = false; }, MOV.chegada);
          }
        };
        v.on('scenechangefadedone', afastar);
        v.on('load', () => setTimeout(afastar, MOV.fade + 50)); // reserva, se o fade não disparar
        v.on('error', () => setErro(true));
        viewer.current = v;
      })
      .catch(() => setErro(true));
    return () => {
      alive = false;
      try { viewer.current?.destroy(); } catch {}
      viewer.current = null;
    };
  }, []);

  // Modo de edição: clique na imagem 360 → linha de ligação pronta a colar
  useEffect(() => {
    if (!editar || !box.current) return;
    const el = box.current;
    let down = null;
    const onDown = (e) => { down = [e.clientX, e.clientY]; };
    const onUp = (e) => {
      if (!down || !viewer.current) return;
      const moved = Math.hypot(e.clientX - down[0], e.clientY - down[1]);
      down = null;
      if (moved > 5 || e.target.closest('.t360-hs')) return;
      const [pitch, yaw] = viewer.current.mouseEventToCoords(e);
      copiar(`{ para: '', yaw: ${r1(yaw)}, pitch: ${r1(pitch)} },`);
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
    };
  }, [editar, copiar]);

  // Rotação suave quando ninguém mexe
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const mexeu = () => {
      ultimoToque.current = Date.now();
      viewer.current?.stopAutoRotate();
    };
    const evs = ['pointerdown', 'wheel', 'touchstart', 'keydown'];
    evs.forEach((e) => el.addEventListener(e, mexeu, { passive: true }));
    const t = setInterval(() => {
      const v = viewer.current;
      if (!v || !rodar || aMudar.current) return;
      if (Date.now() - ultimoToque.current > MOV.parado && !v.getConfig().autoRotate) v.startAutoRotate(MOV.velocidade);
    }, 500);
    if (!rodar) viewer.current?.stopAutoRotate();
    return () => {
      clearInterval(t);
      evs.forEach((e) => el.removeEventListener(e, mexeu));
    };
  }, [rodar]);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(''), editar ? 6000 : 2500);
    return () => clearTimeout(t);
  }, [aviso, editar]);

  // Muda de divisão com movimento: vira para a porta, avança, cruza e afasta ao chegar
  const ir = (id, yaw, pitch) => {
    const v = viewer.current;
    if (!byId[id] || !v || aMudar.current || id === v.getScene()) return;
    aMudar.current = true;
    ultimoToque.current = Date.now();
    v.stopAutoRotate();
    const destino = byId[id];
    const entrar = () => {
      chegada.current = true;
      v.loadScene(id, destino.inicio?.pitch ?? 0, destino.inicio?.yaw ?? 0, MOV.aproximar + 10);
    };
    if (typeof yaw === 'number') v.lookAt(pitch ?? -8, yaw, MOV.aproximar, MOV.virar, entrar);
    else { v.setHfov(MOV.aproximar + 10, MOV.virar * 0.6); setTimeout(entrar, MOV.virar * 0.6); }
    setTimeout(() => { aMudar.current = false; }, MOV.virar + MOV.fade + MOV.chegada + 400); // segurança
  };
  irRef.current = ir;
  const zoom = (d) => viewer.current && viewer.current.setHfov(viewer.current.getHfov() + d);
  const ecra = () => {
    const el = document.querySelector('.t360');
    if (!document.fullscreenElement) el?.requestFullscreen?.(); else document.exitFullscreen?.();
  };

  const pisoAtual = PISOS.find((p) => p.id === piso) || PISOS[0];
  const divisoesPiso = DIVISOES.filter((d) => d.piso === pisoAtual.id);
  const d = byId[atual];

  const cliquePlanta = (e) => {
    if (!editar) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    copiar(`planta: { x: ${r1(x)}, y: ${r1(y)} },`);
  };

  return (
    <div className={`t360 ${painel ? 'with-panel' : ''}`}>
      <div className="t360-view" ref={box} />
      {erro && <p className="t360-erro">Não foi possível carregar a visita 360°.</p>}

      {/* Barra de topo */}
      <div className="t360-top">
        <div className="t360-title">
          <Link href="/tour" className="t360-back">← Tour</Link>
          <span>
            <b>{TITULO}</b> · {SUBTITULO}
          </span>
          <h1>{d?.nome}</h1>
        </div>
        <div className="t360-tools">
          <button onClick={() => zoom(-12)} aria-label="Aproximar">+</button>
          <button onClick={() => zoom(12)} aria-label="Afastar">−</button>
          <button className={rodar ? 'on' : ''} onClick={() => setRodar(!rodar)} aria-label="Movimento automático" title="Movimento automático quando está parado">⟳</button>
          <button onClick={ecra} aria-label="Ecrã inteiro">⛶</button>
          <button className="t360-toggle" onClick={() => setPainel(!painel)}>{painel ? 'Esconder planta' : 'Ver planta'}</button>
        </div>
      </div>

      {/* Painel com a planta */}
      <aside className="t360-panel" aria-label="Planta">
        <div className="t360-tabs">
          {PISOS.map((p) => (
            <button
              key={p.id}
              className={p.id === pisoAtual.id ? 'on' : ''}
              onClick={() => { setPiso(p.id); if (byId[atual]?.piso !== p.id) ir(p.entrada); }}
            >
              {p.nome}
            </button>
          ))}
        </div>

        {/* Moldura quadrada igual para todas as plantas; os pontos ficam por cima da imagem */}
        <div className="t360-plan-frame">
        <div
          className={`t360-plan ${editar ? 'edit' : ''}`}
          onClick={cliquePlanta}
          style={(() => {
            const r = proporcao[pisoAtual.planta] || 1;
            return { aspectRatio: r, width: r >= 1 ? '100%' : 'auto', height: r >= 1 ? 'auto' : '100%' };
          })()}
        >
          <img
            src={pisoAtual.planta}
            alt={`Planta ${pisoAtual.nome}`}
            draggable={false}
            onLoad={(e) => {
              const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
              if (w && h) setProporcao((p) => ({ ...p, [pisoAtual.planta]: w / h }));
            }}
          />
          {divisoesPiso.map((x) => (
            <button
              key={x.id}
              className={`t360-pin ${x.id === atual ? 'on' : ''}`}
              style={{ left: `${x.planta?.x ?? 50}%`, top: `${x.planta?.y ?? 50}%` }}
              onClick={(e) => { if (editar) return; e.stopPropagation(); ir(x.id); }}
              title={x.nome}
            >
              <span>{x.nome}</span>
            </button>
          ))}
        </div>
        </div>

        <ul className="t360-list">
          {divisoesPiso.map((x) => (
            <li key={x.id}>
              <button className={x.id === atual ? 'on' : ''} onClick={() => ir(x.id)}>{x.nome}</button>
            </li>
          ))}
        </ul>
      </aside>

      <p className="t360-hint">Arraste para olhar à volta · clique nas setas para mudar de divisão</p>

      {/* Modo de edição */}
      {editar && (
        <div className="t360-edit">
          <b>Modo de edição</b>
          <span>Divisão: <code>{atual}</code></span>
          <span>Clique numa porta da imagem → linha de ligação · clique na planta → posição do ponto</span>
          <button onClick={() => {
            const v = viewer.current;
            if (v) copiar(`inicio: { yaw: ${r1(v.getYaw())}, pitch: ${r1(v.getPitch())} },`);
          }}>Copiar vista inicial</button>
        </div>
      )}
      {aviso && (
        <div className="t360-toast">
          {editar ? <>Copiado: <code>{aviso}</code></> : aviso}
        </div>
      )}
    </div>
  );
}
