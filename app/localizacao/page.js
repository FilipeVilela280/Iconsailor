import { Suspense } from 'react';
import { Hero, Figure, Clip } from '@/components/Media';
import MapaInterativo from '@/components/MapaLocal';

export const metadata = { title: 'Localização' };

export default function Localizacao() {
  return (
    <main>
      <Hero short video="drone-ria" eyebrow="Localização">
        <h1>Gafanha da Nazaré, <em>Praia da Barra.</em></h1>
      </Hero>

      <section className="blk">
        <div className="wrap split reveal">
          <div>
            <p className="eyebrow">O lugar</p>
            <h2 className="h2">Entre o Atlântico <em>e a Ria de Aveiro.</em></h2>
          </div>
          <div>
            <p className="lead">Viver aqui é abraçar a dualidade perfeita: de um lado, a energia revigorante do Atlântico; do outro, a serenidade intemporal da Ria de Aveiro. Uma localização estratégica que combina o isolamento tranquilo da praia com ligações rápidas a Aveiro e ao Porto.</p>
            <p className="lead">Os canais, sapais e zonas húmidas da Ria acolhem uma biodiversidade singular — uma ligação permanente à natureza e ao ritmo das marés.</p>
            <p className="coords">Latitude 40.6402 · Longitude −8.7426</p>
          </div>
        </div>
      </section>

      {/* Mapa interativo — pontos e textos em data/mapa-locais.js */}
      <Suspense fallback={<section className="mi" />}>
        <MapaInterativo />
      </Suspense>

      <section className="blk">
        <div className="wrap mosaic">
          <Clip className="m1" name="drone-farol" cap="Para poente · Farol e Atlântico" />
          <Figure className="m2" src="/img/exterior/cobertura-terraco.jpg" cap="Para nascente · Ria de Aveiro" sizes="40vw" />
        </div>
      </section>
    </main>
  );
}
