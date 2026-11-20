'use client';
// Carrossel simples de imagens: setas, pontos, arrastar no telemóvel e passagem automática.
// Uso: <Carousel slides={[{ src: '/img/...jpg', cap: 'Legenda' }, ...]} />
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import './Carousel.css';

export default function Carousel({ slides, interval = 5000, ratio = '4 / 5', sizes = '(max-width: 900px) 100vw, 50vw' }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(null);
  const n = slides.length;
  const go = (d) => setI((v) => (v + d + n) % n);

  useEffect(() => {
    if (paused || n < 2 || !interval) return;
    const t = setTimeout(() => go(1), interval);
    return () => clearTimeout(t);
  }, [i, paused, n, interval]);

  return (
    <div
      className="carousel reveal"
      style={{ aspectRatio: ratio }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (startX.current == null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        startX.current = null;
      }}
    >
      {slides.map((s, k) => (
        <figure key={s.src} className={`car-slide ${k === i ? 'on' : ''}`} aria-hidden={k !== i}>
          <Image src={s.src} alt={s.cap || ''} fill sizes={sizes} style={{ objectFit: 'cover' }} priority={k === 0} />
          {s.cap && <figcaption>{s.cap}</figcaption>}
        </figure>
      ))}
      {n > 1 && (
        <>
          <button className="car-nav p" aria-label="Anterior" onClick={() => go(-1)}>‹</button>
          <button className="car-nav n" aria-label="Seguinte" onClick={() => go(1)}>›</button>
          <div className="car-dots">
            {slides.map((s, k) => (
              <button key={s.src} className={k === i ? 'on' : ''} aria-label={`Imagem ${k + 1}`} onClick={() => setI(k)} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
