import Link from 'next/link';
import SeaLines from '@/components/SeaLines';
import { Hero, Figure, Clip } from '@/components/Media';
import { Arrow } from '@/components/Icons';
import FeatureIcon from '@/components/FeatureIcons';
import { PROJECT } from '@/data/contacts';

export const metadata = { title: 'Projeto' };

// Características do catálogo (ícones em components/FeatureIcons.js)
const FEATURES = [
  ['vista', 'Vistas para a Ria', 'Vãos generosos orientados para a Ria de Aveiro e o horizonte.'],
  ['garagem', 'Garagem', 'Estacionamento privativo, com boxes fechadas no T4 Duplex.'],
  ['vmc', 'VMC · Renovação de ar', 'Ventilação mecânica controlada, para ar sempre renovado.'],
  ['terraco', 'Terraços', 'Terraço de 135 m² com piscina privativa no T4 Duplex.'],
  ['varanda', 'Amplas varandas', 'Todas as frações com espaço exterior generoso.'],
];

export default function Projeto() {
  return (
    <main>
      <Hero short video="fachada-rua" eyebrow="Projeto">
        <h1>Arquitetura <em>com maré.</em></h1>
      </Hero>

      <section className="blk">
        <div className="wrap split">
          <div className="reveal">
            <p className="eyebrow">Entre a Ria e o Oceano</p>
            <h2 className="h2">Uma fachada <em>que nasce da água.</em></h2>
            <p className="lead">Entre a ria e o oceano, a Gafanha da Nazaré revela uma forte ligação à água e à tradição marítima. Uma identidade que inspira a fachada do Icon Sailor, revestida em azulejo porcelânico.</p>
            <p className="lead">Uma grelha em betão de tom travertino repete-se piso a piso, criando varandas profundas, sombra natural e privacidade.</p>
          </div>
          <Figure className="tall" src="/img/exterior/ext-tres-quartos.jpg" cap="Fachada nascente · Fim de tarde" />
        </div>
      </section>

      <section className="blk" style={{ paddingTop: 0 }}>
        <div className="wrap mosaic">
          <Figure className="m1" src="/img/exterior/aerea-farol.jpg" cap="Vista aérea · Farol da Barra" sizes="60vw" />
          <Figure className="m2" src="/img/exterior/ext-esquina.jpg" cap="Esquina" sizes="40vw" />
          <Figure className="m3" src="/img/exterior/cobertura-terraco.jpg" cap="Terraço · Vista Ria" sizes="35vw" />
          <Figure className="m4" src="/img/exterior/cobertura-piscina.jpg" cap="T4 Duplex · Piscina privativa" sizes="65vw" />
        </div>
      </section>

      <section className="blk sea" style={{ background: 'var(--white)' }}>
        <SeaLines light />
        <div className="wrap split rev">
          <div className="reveal">
            <p className="eyebrow">Hall de entrada</p>
            <h2 className="h2">A chegada <em>é já uma experiência.</em></h2>
            <p className="lead">Design sofisticado, texturas orgânicas e a alma da Costa de Prata. Um teto em metal ondulado que lembra a superfície da água, painéis de madeira e escadas em terrazzo claro. O elevador serve todos os pisos e a garagem.</p>
          </div>
          <Figure className="tall" src="/img/exterior/entrada-lobby.jpg" cap="Hall de entrada" />
        </div>
      </section>

      <section className="blk">
        <div className="wrap">
          <p className="eyebrow">Características</p>
          <h2 className="h2">Pensado ao <em>detalhe.</em></h2>
          <div className="feat feat5 reveal">
            {FEATURES.map(([ic, h, p]) => (
              <div key={h}><FeatureIcon name={ic} /><h4>{h}</h4><p>{p}</p></div>
            ))}
          </div>
          <div className="credits reveal">
            <div><span>Arquitetura</span><b>{PROJECT.architect}</b></div>
            <div><span>Construção</span><b>{PROJECT.builder}</b></div>
            <div><span>Andares</span><b>{PROJECT.floors}</b></div>
            <div><span>Apartamentos</span><b>{PROJECT.units} exclusivos</b></div>
          </div>
        </div>
      </section>

      <section className="blk dark sea">
        <SeaLines />
        <div className="wrap split rev">
          <div className="reveal">
            <p className="eyebrow">T4 Duplex</p>
            <h2 className="h2">Entre dois horizontes: <em>a experiência duplex.</em></h2>
            <p className="lead">Com 180,72 m², o T4 Duplex foi pensado para famílias que valorizam a privacidade e a convivência em grande escala. O piso inferior acolhe as áreas de descanso; o superior abre-se por completo para terraços panorâmicos com piscina. Uma verdadeira moradia suspensa no topo da Praia da Barra.</p>
            <div style={{ marginTop: 34 }}><Link href="/tour?cena=t4-piscina" className="btn light">Visitar em tour <Arrow /></Link></div>
          </div>
          <Clip name="drone-ria" cap="Drone · Cobertura e Ria" className="wide" />
        </div>
      </section>
    </main>
  );
}
