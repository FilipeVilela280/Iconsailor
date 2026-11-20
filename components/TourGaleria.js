'use client';
// Página Tour: galeria de divisões. Clicar num cartão abre o 360° nessa divisão.
// As divisões vêm de data/tour360.js (o mesmo ficheiro do visualizador).
import { useState } from 'react';
import Link from 'next/link';
import { TITULO, PISOS, DIVISOES, PRIMEIRA } from '@/data/tour360';
import './TourGaleria.css';

// Pré-visualização a partir da própria imagem 360 (centrada na vista inicial)
const preview = (d) => {
  const yaw = d.inicio?.yaw ?? 0;
  const x = (((yaw + 180) % 360) + 360) % 360 / 360 * 100;
  return { backgroundImage: `url(${d.capa || d.imagem})`, backgroundPosition: d.capa ? 'center' : `${x}% 54%`, '--x': `${x}%` };
};

export default function TourGaleria() {
  const [piso, setPiso] = useState('todos');
  const lista = DIVISOES.filter((d) => piso === 'todos' || d.piso === piso);
  const nomePiso = (id) => PISOS.find((p) => p.id === id)?.nome;

  return (
    <main className="tg">
      <header className="tg-head wrap">
        <div>
          <p className="eyebrow">Visita virtual 360°</p>
          <h1 className="h1">Entre. <em>Olhe à volta.</em></h1>
        </div>
        <div className="tg-intro">
          <p className="lead">Percorra o {TITULO} divisão a divisão, como se lá estivesse. Escolha por onde começar.</p>
          <Link href={`/tour/t4?cena=${PRIMEIRA}`} className="btn solid">Começar a visita →</Link>
        </div>
      </header>

      <nav className="tg-filter wrap" aria-label="Filtrar por piso">
        <span>{TITULO} · {DIVISOES.length} divisões</span>
        <div>
          {[{ id: 'todos', nome: 'Todas' }, ...PISOS].map((p) => (
            <button key={p.id} className={piso === p.id ? 'on' : ''} onClick={() => setPiso(p.id)}>{p.nome}</button>
          ))}
        </div>
      </nav>

      <section className="tg-grid wrap">
        {lista.map((d, i) => (
          <Link key={d.id} href={`/tour/t4?cena=${d.id}`} className={`tg-card ${i === 0 ? 'big' : ''}`}>
            <span className="tg-img" style={preview(d)} />
            <span className="tg-badge">360°</span>
            <span className="tg-txt">
              <small>{nomePiso(d.piso)}</small>
              <b>{d.nome}</b>
              <em>Entrar →</em>
            </span>
          </Link>
        ))}
      </section>

      <p className="tg-note wrap">
        Visitas 360° do T1 e do T2 em breve. Até lá, veja as plantas e a galeria de cada fração em{' '}
        <Link href="/disponibilidade">Disponibilidade</Link>.
      </p>
    </main>
  );
}
