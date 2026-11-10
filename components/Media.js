import Image from 'next/image';
import { Play } from './Icons';

/** Hero com vídeo ou imagem de fundo */
export function Hero({ video, image, eyebrow, short, children, bgPosition }) {
  return (
    <header className={`hero ${short ? 'short' : ''}`}>
      {video ? (
        <video className="bg" src={`/video/${video}.mp4`} poster={`/video/${video}.jpg`} autoPlay muted loop playsInline />
      ) : (
        <Image className="bg" src={image} alt="" fill priority sizes="100vw" style={{ objectFit: 'cover', objectPosition: bgPosition || 'center' }} />
      )}
      <div className="inner wrap">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {children}
      </div>
      {!short && <div className="scroll-cue">Descobrir</div>}
    </header>
  );
}

/** Imagem com legenda que abre no lightbox */
export function Figure({ src, alt = '', cap, className = '', style, sizes = '(max-width: 900px) 100vw, 50vw' }) {
  return (
    <figure className={`figure reveal ${className}`} style={style} data-lb data-src={src} data-cap={cap || alt}>
      <Image src={src} alt={alt || cap || ''} fill sizes={sizes} style={{ objectFit: 'cover' }} />
      {cap && <figcaption>{cap}</figcaption>}
    </figure>
  );
}

/** Clipe de vídeo que toca quando visível e abre em grande ao clicar */
export function Clip({ name, cap, className = '', style, showPlay }) {
  return (
    <figure className={`clipfig reveal ${className}`} style={style} data-clip={name}>
      <video src={`/video/${name}.mp4`} poster={`/video/${name}.jpg`} muted loop playsInline data-auto preload="none" />
      {cap && <figcaption>{cap}</figcaption>}
      {showPlay && <span className="play"><Play style={{ width: 12, height: 12, color: '#fff' }} /></span>}
    </figure>
  );
}
