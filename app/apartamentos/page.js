import Image from 'next/image';
import Link from 'next/link';
import SeaLines from '@/components/SeaLines';
import { Hero, Figure, Clip } from '@/components/Media';
import Carousel from '@/components/Carousel';
import { TYPES, TYPE_ORDER, plan } from '@/data/types';

export const metadata = { title: 'Apartamentos' };

const MATERIALS = [
  ['oak', 'Carvalho natural', 'Pavimento em soalho de carvalho e ripados em madeira maciça.', '/img/materiais/carvalho.jpg'],
  ['tile', 'Azulejo verde-água', 'Cerâmica vidrada artesanal na fachada e nas cozinhas.', '/img/materiais/azulejo-verde.jpg'],
  ['terr', 'Terrazzo claro', 'Pavimentos e paredes das casas de banho em grande formato.', '/img/materiais/terrazzo.jpg'],
  ['trav', 'Betão travertino', 'Estrutura de fachada em tom areia, mate e intemporal.', '/img/materiais/betao-travertino.jpg'],
  ['blue', 'Azul atlântico', 'Azulejo de banho em tons profundos de oceano.', '/img/materiais/azulejo-azul.jpg'],
];
const FEELINGS = [
  ['momento-luz', 'Luz', 'Vãos generosos que trazem o céu da Barra para dentro de casa.'],
  ['momento-quarto', 'Calma', 'Tons naturais, texturas suaves e um silêncio que convida a abrandar.'],
  ['momento-varanda', 'Brisa', 'Varandas que prolongam a sala para o exterior.'],
  ['momento-sala', 'Família', 'Espaços para crescer — apenas nove apartamentos exclusivos num lugar com alma.'],
];

export default function Apartamentos() {
  return (
    <main>
      <Hero short image="/img/interiores/t4-sala.jpg" eyebrow="Apartamentos">
        <h1>Interiores <em>que respiram.</em></h1>
      </Hero>

      <section className="blk">
        <div className="wrap split">
          <div className="reveal">
            <p className="eyebrow">Luz e serenidade</p>
            <h2 className="h2">O privilégio <em>de abrandar.</em></h2>
            <p className="lead">Sob a luz da Praia da Barra, os dias ganham um ritmo próprio, embalados pelo oceano e pela tranquilidade da ria. Em cada espaço, uma harmonia silenciosa une o exterior ao conforto privado um estilo de vida feito de despertares calmos e da paz de saber que a pressa do mundo fica sempre à porta.</p>
            
          </div>
          <Figure className="tall" src="/img/interiores/t2-1-varanda.jpg" cap="Varanda · T2.1" />
        </div>
      </section>

      <section className="blk" style={{ background: 'var(--white)' }}>
        <div className="wrap">
          <p className="eyebrow">Tipologias</p>
          <h2 className="h2">Cinco plantas, <em>uma para cada forma de viver.</em></h2>
          <div className="types">
            {TYPE_ORDER.map((k) => {
              const t = TYPES[k];
              return (
                <Link key={k} href={`/disponibilidade?tipo=${k === 'T4' ? 'T4' : t.name}`} className="type reveal">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="pl"><img src={plan(t.plans[0])} alt={`Planta ${t.name}`} loading="lazy" /></div>
                  <div className="tx"><h4>{t.name}</h4><small className="type-units">Frações {t.units}</small><p>{t.desc}</p><span className="go">Ver frações →</span></div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="blk">
        <div className="wrap mosaic">
          <Figure className="m4" src="/img/interiores/t4-cozinha.jpg" cap="Cozinha e jantar · T4 Duplex" sizes="65vw" />
          <Figure className="m3" src="/img/interiores/t2-quarto.jpg" cap="Quarto · T2" sizes="35vw" />
          <Figure className="m2" src="/img/interiores/t2-1-cozinha-ilha.jpg" cap="Cozinha · T2.1" sizes="40vw" />
          <Figure className="m1" src="/img/interiores/t4-quarto.jpg" cap="Suite · T4 Duplex" sizes="60vw" />
        </div>
      </section>

      <section className="blk" style={{ background: 'var(--white)' }}>
        <div className="wrap">
          <p className="eyebrow">Materiais</p>
          <h2 className="h2">Uma paleta <em>tirada da costa.</em></h2>
          <div className="mats">
            {MATERIALS.map(([sw, h, p, src]) => (
              <div key={sw} className="mat reveal">
                <div className={`sw ${sw}`}>
                  {src && <Image src={src} alt={h} fill sizes="(max-width: 900px) 50vw, 20vw" style={{ objectFit: 'cover' }} />}
                </div>
                <h4>{h}</h4>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="blk">
        <div className="wrap split rev">
          <div className="reveal">
            <p className="eyebrow">Casas de banho</p>
            <h2 className="h2">Um ritual <em>diário de spa.</em></h2>
            <p className="lead">Bases de duche ao nível do chão, torneiras encastradas em preto mate, móveis suspensos em carvalho e uma parede de azulejo vidrado que muda com a luz.</p>
          </div>
          <Carousel
            slides={[
              { src: '/img/interiores/wc-verde.jpg', cap: 'Casa de banho · azulejo verde' },
              { src: '/img/interiores/wc-azul.jpg', cap: 'Casa de banho · azulejo azul' },
            ]}
          />
        </div>
      </section>

      <section className="blk dark sea">
        <SeaLines />
        <div className="wrap">
          <p className="eyebrow">Sentir</p>
          <h2 className="h2">Mais do que metros quadrados, <em>uma forma de estar.</em></h2>
          <div className="clips feelings">
            {FEELINGS.map(([clip, h, p]) => (
              <div key={clip} className="reveal">
                <Clip name={clip} style={{ aspectRatio: '4/5' }} zoom={false} />
                <h3 className="feel-h">{h}</h3>
                <p className="feel-p">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
