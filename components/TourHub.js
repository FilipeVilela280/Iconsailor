'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { TOUR_COVER, TOUR_TYPES, ORBIT_FROM, ORBIT_VIDEO } from '@/data/tour';
import { UNITS, ST_NAME, m2 } from '@/data/units';
import { img } from '@/data/types';
import { Arrow } from './Icons';

const AUTOPLAY_MS = 6000;

/** Ecrã inicial do tour: edifício com marcadores por tipologia + caixa com as imagens dessa tipologia */
export default function TourHub() {
  const router = useRouter();
  const [sel, setSel] = useState(null);   // tipologia selecionada (k)
  const [i, setI] = useState(0);          // slide atual
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState('front'); // front → orbit → done
  const [run, setRun] = useState(0);           // incrementa para repetir a animação

  const t = TOUR_TYPES.find((x) => x.k === sel);
  const slides = t?.slides || [];
  const go = useCallback((d) => setI((n) => (n + d + slides.length) % slides.length), [slides.length]);

  // animação de entrada: vista frontal → rotação → vista de esquina com marcadores
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setPhase('done'); setReady(true); return; }
    setReady(false); setPhase('front');
    if (ORBIT_VIDEO) return; // o vídeo avisa quando acaba (onEnded)
    const t1 = setTimeout(() => setPhase('orbit'), 1400);
    const t2 = setTimeout(() => { setPhase('done'); setReady(true); }, 1400 + 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [run]);
  const skip = () => { if (phase !== 'done') { setPhase('done'); setReady(true); } };
  useEffect(() => { setI(0); }, [sel]);
  useEffect(() => {
    if (!t || paused) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [t, paused, go, i]);
  useEffect(() => {
    const onKey = (e) => {
      if (!t) return;
      if (e.key === 'Escape') setSel(null);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [t, go]);

  const units = t ? UNITS.filter((u) => t.units.includes(u.id)) : [];
  const areas = units.map((u) => u.int);
  const avail = units.filter((u) => u.st === 'd').length;

  return (
    <div className={`hub ${ready ? 'ready' : ''} ${t ? 'has-sel' : ''} ph-${phase}`}>
      {/* ---------- animação de entrada ---------- */}
      {phase !== 'done' && (
        <div className="hub-orbit" onClick={skip} title="Clique para saltar">
          {ORBIT_VIDEO ? (
            <video src={ORBIT_VIDEO} autoPlay muted playsInline onEnded={skip} />
          ) : (
            <div className="hub-front">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(ORBIT_FROM)} alt="" draggable={false} />
            </div>
          )}
          <span className="hub-skip">Saltar ›</span>
        </div>
      )}
      {/* ---------- imagem do edifício com marcadores ---------- */}
      <div className="hub-stage" onClick={(e) => e.target === e.currentTarget && setSel(null)}>
        <div className="hub-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(TOUR_COVER)} alt="Icon Sailor" draggable={false} />
          {TOUR_TYPES.map((p, k) => (
            <button key={p.k} className={`hub-pin ${sel === p.k ? 'on' : ''}`}
              style={{ left: `${p.pin[0] * 100}%`, top: `${(p.pin[1] - p.lift) * 100}%`, '--lift-n': p.lift, '--d': `${0.5 + k * 0.18}s` }}
              onClick={() => setSel(sel === p.k ? null : p.k)} aria-label={`Ver ${p.label}`}>
              <span className="c">{p.label}</span>
              <span className="l" />
              <span className="dot" />
            </button>
          ))}
        </div>
      </div>

      {/* ---------- título e botões de tipologia ---------- */}
      <div className="hub-top">
        <small>Tour virtual</small>
        <h2>Escolha a sua <em>casa.</em></h2>
        <p>Toque num marcador do edifício ou numa tipologia para ver as imagens.</p>
      </div>
      <div className="hub-bar">
        {TOUR_TYPES.map((p) => (
          <button key={p.k} className={sel === p.k ? 'on' : ''} onClick={() => setSel(sel === p.k ? null : p.k)}>
            {p.label}<small>{p.units.length} {p.units.length === 1 ? 'fração' : 'frações'}</small>
          </button>
        ))}
        <button className="ghost" onClick={() => { setSel(null); setRun((n) => n + 1); }}>↻ Rodar câmara</button>
        <button className="ghost" onClick={() => router.push('/tour?cena=fachada')}>Visita completa →</button>
      </div>

      {/* ---------- caixa da tipologia ---------- */}
      <aside className={`hub-box ${t ? 'open' : ''}`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {t && (
          <>
            <button className="x" aria-label="Fechar" onClick={() => setSel(null)}>×</button>
            <div className="hub-slides">
              {slides.map((s, k) => (
                <div key={t.k + s.img} className={`hub-slide ${k === i ? 'on' : ''}`}>
                  {s.video
                    ? <video src={s.video} poster={img(s.img)} muted loop playsInline autoPlay={k === i} />
                    : /* eslint-disable-next-line @next/next/no-img-element */ <img src={img(s.img)} alt={s.cap} />}
                </div>
              ))}
              <span className="hub-cap" key={`${t.k}${i}`}>{slides[i]?.cap}</span>
              {slides.length > 1 && <>
                <button className="nb p" onClick={() => go(-1)} aria-label="Anterior">‹</button>
                <button className="nb n" onClick={() => go(1)} aria-label="Seguinte">›</button>
              </>}
              <div className="hub-dots">
                {slides.map((s, k) => (
                  <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={s.cap}>
                    {k === i && !paused && <i style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />}
                  </button>
                ))}
              </div>
            </div>
            <div className="hub-info">
              <small>Frações {t.units.join(' · ')}</small>
              <h3>{t.label}</h3>
              <p>{t.blurb}</p>
              <dl>
                <div><dt>Área interior</dt><dd>{areas.length > 1 && Math.min(...areas) !== Math.max(...areas) ? `${m2(Math.min(...areas))} – ${m2(Math.max(...areas))}` : m2(areas[0])}</dd></div>
                <div><dt>Disponíveis</dt><dd>{avail} de {units.length}</dd></div>
              </dl>
              <div className="hub-units">
                {units.map((u) => <span key={u.id} className={`st ${u.st}`} title={ST_NAME[u.st]}>{u.id}</span>)}
              </div>
              <div className="hub-acts">
                <button className="btn solid" onClick={() => router.push(`/tour?cena=${t.scene}`)}>Entrar na visita <Arrow /></button>
                <Link className="btn" href={`/disponibilidade?tipo=${t.tipo}`}>Ver frações</Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
