'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SCENES, GROUP_ORDER, GROUP_PLAN } from '@/data/scenes';
import { img, plan } from '@/data/types';

const ORDER = Object.keys(SCENES);
const ICON = {
  go: <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="#fff" strokeWidth="2" />,
  up: <path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="#fff" strokeWidth="2" />,
  info: <g fill="#fff"><circle cx="12" cy="7" r="1.6" /><rect x="10.8" y="10" width="2.4" height="8" rx="1" /></g>,
};

/** Tour virtual: arrastar para explorar, zoom, pontos clicáveis entre cenas */
export default function TourViewer() {
  const params = useSearchParams();
  const router = useRouter();
  const [cur, setCur] = useState(() => (SCENES[params.get('cena')] ? params.get('cena') : 'fachada'));
  const [shown, setShown] = useState(null);   // cena cuja imagem já está carregada
  const [fading, setFading] = useState(false);
  const [auto, setAuto] = useState(false);
  const [hint, setHint] = useState(true);

  const stageRef = useRef(null), panoRef = useRef(null), stripRef = useRef(null);
  const st = useRef({ iw: 1, ih: 1, base: 1, zoom: 1.25, tx: 0, ty: 0, vx: 0, drag: false, lx: 0, ly: 0, drift: 1, auto: false });

  const size = () => { const r = stageRef.current.getBoundingClientRect(); return { w: r.width, h: r.height }; };
  const apply = useCallback(() => {
    const s = st.current, { w, h } = size(), sc = s.base * s.zoom;
    s.tx = Math.min(0, Math.max(w - s.iw * sc, s.tx));
    s.ty = Math.min(0, Math.max(h - s.ih * sc, s.ty));
    const p = panoRef.current;
    p.style.width = s.iw * sc + 'px'; p.style.height = s.ih * sc + 'px';
    p.style.transform = `translate(${s.tx}px,${s.ty}px)`;
  }, []);
  const layout = useCallback((center) => {
    const s = st.current, { w, h } = size();
    s.base = Math.max(w / s.iw, h / s.ih);
    if (center) { const sc = s.base * s.zoom; s.tx = (w - s.iw * sc) / 2; s.ty = (h - s.ih * sc) / 2; }
    apply();
  }, [apply]);

  // carregar cena
  useEffect(() => {
    let alive = true;
    setFading(true);
    const im = new Image();
    im.onload = () => setTimeout(() => {
      if (!alive) return;
      Object.assign(st.current, { iw: im.naturalWidth, ih: im.naturalHeight, zoom: 1.25 });
      setShown(cur); layout(true); setFading(false);
    }, shown ? 300 : 0);
    im.src = img(SCENES[cur].img);
    stripRef.current?.querySelector(`[data-s="${cur}"]`)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur]);

  // mudar de cena via URL (?cena=)
  useEffect(() => { const c = params.get('cena'); if (c && SCENES[c]) setCur(c); }, [params]);

  // inércia + deriva automática
  useEffect(() => {
    let raf;
    const loop = () => {
      const s = st.current;
      if (!s.drag) {
        if (Math.abs(s.vx) > 0.05) { s.tx += s.vx; s.vx *= 0.94; apply(); }
        else if (s.auto) {
          s.tx -= 0.35 * s.drift;
          const { w } = size(), pw = s.iw * s.base * s.zoom;
          if (s.tx <= w - pw + 1) s.drift = -1; if (s.tx >= -1) s.drift = 1;
          apply();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onResize = () => layout(false);
    window.addEventListener('resize', onResize);
    const t = setTimeout(() => setHint(false), 3800);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, [apply, layout]);

  // visita automática
  useEffect(() => {
    st.current.auto = auto;
    if (!auto) return;
    const id = setInterval(() => setCur((c) => ORDER[(ORDER.indexOf(c) + 1) % ORDER.length]), 7000);
    return () => clearInterval(id);
  }, [auto]);

  // wheel zoom (listener não-passivo)
  const zoomBy = useCallback((f, cx, cy) => {
    const s = st.current, r = stageRef.current.getBoundingClientRect();
    cx = cx == null ? r.width / 2 : cx - r.left; cy = cy == null ? r.height / 2 : cy - r.top;
    const old = s.base * s.zoom; s.zoom = Math.min(2.6, Math.max(1, s.zoom * f)); const sc = s.base * s.zoom;
    s.tx = cx - (cx - s.tx) * sc / old; s.ty = cy - (cy - s.ty) * sc / old; apply();
  }, [apply]);
  useEffect(() => {
    const el = stageRef.current;
    const onWheel = (e) => { e.preventDefault(); zoomBy(e.deltaY < 0 ? 1.1 : 1 / 1.1, e.clientX, e.clientY); };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomBy]);

  const down = (e) => {
    if (e.target.closest('.hs')) return;
    Object.assign(st.current, { drag: true, lx: e.clientX, ly: e.clientY, vx: 0 });
    stageRef.current.setPointerCapture(e.pointerId); stageRef.current.classList.add('drag'); setHint(false);
  };
  const move = (e) => {
    const s = st.current; if (!s.drag) return;
    const dx = e.clientX - s.lx, dy = e.clientY - s.ly;
    s.tx += dx; s.ty += dy; s.vx = dx; s.lx = e.clientX; s.ly = e.clientY; apply();
  };
  const up = () => { st.current.drag = false; stageRef.current.classList.remove('drag'); };

  const goTo = (id) => { setAuto(false); setCur(id); };
  const fullscreen = () => {
    try {
      const el = stageRef.current.parentElement;
      if (document.fullscreenElement) document.exitFullscreen();
      else (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el)?.catch?.(() => {});
    } catch { /* ignorar */ }
  };

  const scene = SCENES[cur];
  const shownScene = shown && SCENES[shown];
  const group = scene.g;

  return (
    <div className="tour">
      <div className="stage" ref={stageRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div className={`pano swap ${fading ? 'fadeout' : ''}`} ref={panoRef}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {shownScene && <img src={img(shownScene.img)} alt={shownScene.t} draggable={false} />}
          <div style={{ position: 'absolute', inset: 0 }}>
            {shownScene?.hs.map((h, i) => (
              <div key={shown + i} className={`hs ${h.info ? 'info' : ''}`} style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
                onClick={() => h.to && goTo(h.to)}>
                <div className="dot"><svg viewBox="0 0 24 24">{ICON[h.info ? 'info' : (h.ic || 'go')]}</svg></div>
                <div className="lbl">{h.info || h.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hint" style={{ opacity: hint ? 1 : 0 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M8 12h8M4 12l3-3M4 12l3 3M20 12l-3-3M20 12l-3 3" /></svg>
        Arraste para explorar · clique nos pontos
      </div>

      <div className="top">
        <div className="scene-title"><small>{scene.g}</small><h2>{scene.t}</h2><p>{scene.d}</p></div>
        <div className="tools">
          <button className="tbtn back" title="Voltar ao edifício" onClick={() => router.push('/tour')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          </button>
          <button className={`tbtn ${auto ? 'on' : ''}`} title="Visita automática" onClick={() => { setAuto(!auto); setHint(false); }}>
            <svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
          </button>
          <button className="tbtn" title="Aproximar" onClick={() => zoomBy(1.2)}><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg></button>
          <button className="tbtn" title="Afastar" onClick={() => zoomBy(1 / 1.2)}><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M5 12h14" /></svg></button>
          <button className="tbtn" title="Ecrã inteiro" onClick={fullscreen}><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg></button>
        </div>
      </div>

      <div className="minimap">
        <small>Planta</small>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={plan(GROUP_PLAN[group])} alt="" style={{ width: '100%', marginTop: 8, background: '#fff', padding: 4 }} />
      </div>

      <div className="bottom">
        <div className="groups">
          {GROUP_ORDER.map((g) => (
            <button key={g} className={g === group ? 'on' : ''} onClick={() => goTo(ORDER.find((k) => SCENES[k].g === g))}>{g}</button>
          ))}
        </div>
        <div className="strip" ref={stripRef}>
          {ORDER.filter((k) => SCENES[k].g === group).map((k) => (
            <button key={k} data-s={k} className={k === cur ? 'on' : ''} onClick={() => goTo(k)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(SCENES[k].img)} alt="" /><span>{SCENES[k].t}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
