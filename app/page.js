import Image from 'next/image';
import SeaLines from '@/components/SeaLines';
import Link from 'next/link';
import { Hero, Clip, Figure } from '@/components/Media';
import { Arrow, Play } from '@/components/Icons';

const PATHS = [
  ['/apartamentos', '/img/interiores/t4-cozinha.jpg', 'Interiores e plantas', 'Apartamentos'],
  ['/disponibilidade', '/img/exterior/ext-fachada.jpg', 'Frações e áreas', 'Disponibilidade'],
  ['/tour', '/img/exterior/cobertura-piscina.jpg', 'Visita interativa', 'Tour virtual'],
];

export default function Home() {
  return (
    <main>
      <Hero video="drone-farol" eyebrow="Novo empreendimento · Gafanha da Nazaré">
        <h1>Entre a Ria <em>e o Mar.</em></h1>
        <p>Nove apartamentos exclusivos entre a Ria e o Oceano, com o Farol da Barra no horizonte. Onde o mar inspira o quotidiano.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/disponibilidade" className="btn light">Ver disponibilidade <Arrow /></Link>
          <Link href="/video" className="btn light">Ver o filme <Play style={{ width: 12, height: 12 }} /></Link>
        </div>
      </Hero>

      <section className="blk">
        <div className="wrap split">
          <div className="reveal">
            <p className="eyebrow">Onde o mar inspira o quotidiano</p>
            <h2 className="h2">Um território <em>moldado pela água.</em></h2>
            <p className="lead">Profundamente ligada à tradição marítima portuguesa, a Gafanha da Nazaré preserva uma identidade cultural autêntica — na gastronomia, nas tradições locais e na relação histórica com o mar. A poucos minutos das praias da Barra e da Costa Nova, oferece um estilo de vida onde natureza e bem-estar coexistem em perfeita harmonia.</p>
            <p className="lead">T1, T2 e um T4 Duplex no topo com piscina privativa pensados para viver o ano inteiro ou para os dias longos de verão.</p>
            <div style={{ marginTop: 34 }}><Link href="/projeto" className="btn">Conhecer o projeto <Arrow /></Link></div>
          </div>
          <Figure src="/img/exterior/fachada-principal.jpg" alt="Fachada principal do Icon Sailor" cap="Fachada principal" className="tall" />
        </div>
        <div className="wrap stats reveal">
          <div><b>9</b><span>Residências</span></div>
          <div><b>T2–T4</b><span>Duplex com piscina</span></div>
          <div><b>5</b><span>Andares</span></div>
          <div><b>Ria</b><span>e Oceano à porta</span></div>
        </div>
      </section>

      <section className="blk dark sea">
        <SeaLines />
        <div className="wrap">
          <p className="eyebrow">Explorar</p>
          <h2 className="h2">Três formas de <em>conhecer a sua casa.</em></h2>
          <div className="paths">
            {PATHS.map(([href, src, small, title]) => (
              <Link key={href} href={href} className="path reveal">
                <Image src={src} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
                <div className="t"><small>{small}</small><h3>{title}</h3></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="blk sea">
        <SeaLines light />
        <p className="quote reveal">“Acordar com a luz da Ria, adormecer com o som do mar.”<small>Praia da Barra · Ílhavo</small></p>
      </section>
    </main>
  );
}
