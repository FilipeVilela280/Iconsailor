'use client';
// Página Tour: um separador por tipologia.
//  · Tipologias COM 360° (por agora o T4): lista de divisões + pré-visualização + planta → abre o 360°.
//  · Tipologias SEM 360°: os renders da tipologia (data/types.js → gal) com a mesma apresentação.
// Para ligar o 360° de outra tipologia, acrescente-a em VISITAS_360 (abaixo).
import { useMemo, useState } from 'react';
import Link from 'next/link';
import * as T4 from '@/data/tour360';
import { TYPES, TYPE_ORDER, img, plan } from '@/data/types';
import { UNITS, extTotal, m2 } from '@/data/units';
import './TourVisita.css';

// Tipologias que já têm visita 360° (chave = id em data/types.js)
const VISITAS_360 = {
  T4: { pisos: T4.PISOS, divisoes: T4.DIVISOES, primeira: T4.PRIMEIRA, rota: '/tour/t4' },
};
const INICIAL = 'T4';

// Nomes das imagens dos renders (gal em data/types.js) → nome a mostrar
const NOMES = {
  sala: 'Sala', jantar: 'Zona de refeições', cozinha: 'Cozinha', 'cozinha-ilha': 'Cozinha com ilha',
  quarto: 'Quarto', varanda: 'Varanda', 'sala-ripado': 'Sala · detalhe ripado', 'sala-varanda': 'Sala e varanda',
  'wc-azul': 'Casa de banho', 'wc-verde': 'Casa de banho', 'cobertura-piscina': 'Terraço com piscina', 'cobertura-terraco': 'Terraço',
};
const nomeImagem = (n) => NOMES[n] || NOMES[Object.keys(NOMES).sort((a, b) => b.length - a.length).find((k) => n.endsWith(k))] || n;

const posX = (d) => ((((d.inicio?.yaw ?? 0) + 180) % 360) + 360) % 360 / 360 * 100;
const intervalo = (vals) => {
  const a = Math.min(...vals), b = Math.max(...vals);
  return a === b ? m2(a) : `${m2(a).replace(' m²', '')} – ${m2(b)}`;
};

export default function TourVisita() {
  const [tipo, setTipo] = useState(INICIAL);
  const [ativaPorTipo, setAtivaPorTipo] = useState({});
  const t = TYPES[tipo];
  const v = VISITAS_360[tipo];
  const fracoes = UNITS.filter((u) => u.model === tipo);

  // Itens da lista: divisões 360 ou imagens da galeria
  const itens = useMemo(() => {
    if (v) return v.divisoes.map((d) => ({ ...d, href: `${v.rota}?cena=${d.id}` }));
    return t.gal.map((g) => ({ id: g, nome: nomeImagem(g), foto: img(g), href: '/disponibilidade' }));
  }, [tipo]); // eslint-disable-line react-hooks/exhaustive-deps

  const primeiroPiso = v ? v.divisoes.find((x) => x.id === v.primeira)?.piso : null;
  const grupos = v
    ? [...v.pisos]
        .sort((a, b) => (b.id === primeiroPiso) - (a.id === primeiroPiso))
        .map((p) => ({ id: p.id, nome: p.nome, itens: itens.filter((x) => x.piso === p.id) }))
    : [{ id: 'g', nome: 'Imagens', itens }];

  const ativaId = ativaPorTipo[tipo] || (v ? v.primeira : itens[0]?.id);
  const ativa = itens.find((x) => x.id === ativaId) || itens[0];
  const setAtiva = (id) => setAtivaPorTipo((s) => ({ ...s, [tipo]: id }));
  const piso = v?.pisos.find((p) => p.id === ativa?.piso);
  let n = 0;

  return (
    <main className="tv">
      <header className="tv-head wrap">
        <div>
          <p className="eyebrow">Visita virtual</p>
          <h1>{t.name}{tipo !== 'T4' && <span> · {t.units}</span>}</h1>
          <p className="tv-desc">{t.desc}</p>
        </div>
        <dl className="tv-stats">
          <div><dt>Área interior</dt><dd>{intervalo(fracoes.map((u) => u.int))}</dd></div>
          {fracoes.some((u) => u.ext?.length) && <div><dt>Área exterior</dt><dd>{intervalo(fracoes.map(extTotal))}</dd></div>}
          <div><dt>{fracoes.length > 1 ? 'Frações' : 'Fração'}</dt><dd>{t.units}</dd></div>
          <div><dt>{v ? 'Divisões em 360°' : 'Imagens'}</dt><dd>{itens.length}</dd></div>
        </dl>
      </header>

      {/* Separadores de tipologia */}
      <nav className="tv-tabs wrap" aria-label="Tipologias">
        {TYPE_ORDER.map((k) => (
          <button key={k} className={k === tipo ? 'on' : ''} onClick={() => setTipo(k)}>
            <b>{TYPES[k].name}</b>
            <small>{TYPES[k].units.includes('·') ? `Frações ${TYPES[k].units}` : `Fração ${TYPES[k].units}`}</small>
            <i className={VISITAS_360[k] ? 'is360' : ''}>{VISITAS_360[k] ? '360°' : 'Imagens'}</i>
          </button>
        ))}
      </nav>

      <section className="tv-main wrap" key={tipo}>
        <aside className="tv-side">
          {grupos.map((g) => (
            <div key={g.id} className="tv-group">
              <h2>{g.nome}</h2>
              <ul>
                {g.itens.map((x) => {
                  n += 1;
                  return (
                    <li key={x.id}>
                      <Link href={x.href} className={x.id === ativa?.id ? 'on' : ''}
                        onMouseEnter={() => setAtiva(x.id)} onFocus={() => setAtiva(x.id)}
                        onClick={(e) => { if (!v) { e.preventDefault(); setAtiva(x.id); } }}>
                        <span className="tv-n">{String(n).padStart(2, '0')}</span>
                        <span className="tv-name">{x.nome}</span>
                        <span className="tv-go">→</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Planta da tipologia (no T4, a do piso da divisão escolhida) — todas no mesmo formato */}
          <div className="tv-plan">
            <p>{v ? `Planta · ${piso?.nome}` : 'Planta'}</p>
            <div className="tv-plan-img">
              <img src={v ? piso?.planta : plan(t.plans[0])} alt={`Planta ${t.name}`} />
            </div>
          </div>
        </aside>

        {/* Pré-visualização grande */}
        {v ? (
          <Link href={ativa.href} className="tv-preview" aria-label={`Entrar: ${ativa.nome}`}>
            <span key={ativa.id} className="tv-pano"
              style={ativa.capa
                ? { backgroundImage: `url(${ativa.capa})`, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'none' }
                : { backgroundImage: `url(${ativa.imagem})`, '--x': `${posX(ativa)}%` }} />
            <span className="tv-badge">360°</span>
            <span className="tv-cap">
              <small>{piso?.nome}</small>
              <b>{ativa.nome}</b>
              <span className="btn solid">Entrar na visita →</span>
            </span>
          </Link>
        ) : (
          <div className="tv-preview tv-still">
            <span key={ativa?.id} className="tv-photo" style={{ backgroundImage: `url(${ativa?.foto})` }} />
            <span className="tv-badge">Visita 360° em breve</span>
            <span className="tv-cap">
              <small>{t.name} · {t.units.includes('·') ? 'Frações' : 'Fração'} {t.units}</small>
              <b>{ativa?.nome}</b>
              <Link href="/disponibilidade" className="btn solid">Ver plantas e frações →</Link>
            </span>
          </div>
        )}
      </section>

      <footer className="tv-foot wrap">
        <p>{v ? 'Arraste para olhar à volta, use as setas para passar de divisão em divisão e a planta para saltar de piso.' : 'Imagens meramente ilustrativas. A visita 360° desta tipologia estará disponível em breve.'}</p>
        <p><Link href="/disponibilidade">Disponibilidade e preços</Link></p>
      </footer>
    </main>
  );
}
