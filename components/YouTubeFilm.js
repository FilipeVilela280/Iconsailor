'use client';
import { useState } from 'react';
import { YOUTUBE_ID } from '@/data/media';
import { Play } from './Icons';

/** Filme do YouTube: só carrega o player depois do clique (mais rápido e sem cookies até lá) */
export default function YouTubeFilm({ poster = '/video/drone-farol.jpg', title = 'Entre a Ria e o Mar' }) {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      <div className={`film reveal ${playing ? 'playing' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt="Filme Icon Sailor" />
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title="Filme Icon Sailor" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen
          />
        ) : (
          <button className="big" aria-label="Reproduzir filme" onClick={() => setPlaying(true)}>
            <Play style={{ color: 'var(--tile)' }} />
          </button>
        )}
        <div className="ttl"><small>Filme do empreendimento</small><h3>{title}</h3></div>
      </div>
      <p className="note" style={{ marginTop: 14 }}>
        Também disponível no <a href={`https://www.youtube.com/watch?v=${YOUTUBE_ID}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>YouTube ↗</a>
      </p>
    </>
  );
}
