'use client';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

/**
 * Efeitos globais do site:
 *  - animação "reveal" ao fazer scroll (.reveal)
 *  - vídeos que tocam só quando visíveis (video[data-auto])
 *  - lightbox de imagens (elementos com data-lb + data-src)
 *  - lightbox de vídeos (elementos com data-clip)
 *  - evento global "lightbox" para abrir plantas a partir de qualquer componente
 */
export function openLightbox(list, index = 0) {
  window.dispatchEvent(new CustomEvent('lightbox', { detail: { list, index } }));
}

export default function SiteEffects() {
  const path = usePathname();
  const [lb, setLb] = useState(null); // { list:[{src,cap,plan}], index }
  const [clip, setClip] = useState(null);

  // reveal + autoplay
  useEffect(() => {
    window.scrollTo(0, 0);
    const reveal = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); reveal.unobserve(en.target); }
    }), { threshold: 0.12 });
    const vids = new IntersectionObserver((es) => es.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) v.play()?.catch(() => {}); else v.pause();
    }), { threshold: 0.25 });
    const scan = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => reveal.observe(el));
      document.querySelectorAll('video[data-auto]').forEach((v) => vids.observe(v));
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { reveal.disconnect(); vids.disconnect(); mo.disconnect(); };
  }, [path]);

  // cliques delegados
  useEffect(() => {
    const onClick = (e) => {
      const f = e.target.closest('[data-lb]');
      if (f) {
        const scope = f.closest('main') || document;
        const all = [...scope.querySelectorAll('[data-lb]')];
        setLb({ list: all.map((x) => ({ src: x.dataset.src, cap: x.dataset.cap })), index: all.indexOf(f) });
        return;
      }
      const c = e.target.closest('[data-clip]');
      if (c) setClip(c.dataset.clip);
    };
    const onEvt = (e) => setLb(e.detail);
    document.addEventListener('click', onClick);
    window.addEventListener('lightbox', onEvt);
    return () => { document.removeEventListener('click', onClick); window.removeEventListener('lightbox', onEvt); };
  }, []);

  const move = useCallback((d) => setLb((s) => s && { ...s, index: (s.index + d + s.list.length) % s.list.length }), []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setLb(null); setClip(null); }
      if (e.key === 'ArrowRight') move(1);
      if (e.key === 'ArrowLeft') move(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  const cur = lb && lb.list[lb.index];
  return (
    <>
      <div className={`lb ${lb ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && setLb(null)}>
        <button className="x" onClick={() => setLb(null)}>×</button>
        {lb && lb.list.length > 1 && <button className="nb p" onClick={() => move(-1)}>‹</button>}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {cur && <img src={cur.src} alt={cur.cap || ''} className={cur.plan ? 'planimg' : ''} />}
        {lb && lb.list.length > 1 && <button className="nb n" onClick={() => move(1)}>›</button>}
        <div className="cap">{cur?.cap}</div>
      </div>
      <div className={`vlb ${clip ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && setClip(null)}>
        <button className="x" onClick={() => setClip(null)}>×</button>
        {clip && <video src={`/video/${clip}.mp4`} controls autoPlay loop playsInline />}
      </div>
    </>
  );
}
