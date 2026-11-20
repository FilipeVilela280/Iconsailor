'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TYPES, img, plan } from '@/data/types';
import { UNITS, FLOORS, ST_NAME, extTotal, m2, floorLabel } from '@/data/units';
import { KeyPlan, Elevation } from './BuildingSchema';
import { Arrow } from './Icons';
import ParkingPlan from './ParkingPlan';
import { spotsOf, parkingArea, SPOT_TYPE } from '@/data/parking';
import { openLightbox } from './SiteEffects';

/** Ficha da fração no estilo "folha de planta": dados à esquerda, planta ao centro */
export default function UnitModal({ unitId, onClose, onSelect, startWithForm }) {
  const u = UNITS.find((x) => x.id === unitId);
  const t = u && TYPES[u.model];
  const [tab, setTab] = useState('planta');
  const [i, setI] = useState(0);
  const [showForm, setShowForm] = useState(!!startWithForm);
  const [sent, setSent] = useState(false);
  const [view, setView] = useState(null); // andar escolhido no alçado (null = o da fração)
  const formRef = useRef(null);

  useEffect(() => { setTab(startWithForm ? 'contacto' : 'planta'); setI(0); setShowForm(!!startWithForm); setSent(false); setView(null); }, [unitId, startWithForm]);
  useEffect(() => {
    document.body.style.overflow = u ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [u, onClose]);
  useEffect(() => { if (showForm) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [showForm]);

  if (!u) return null;
  const ext = extTotal(u);
  const floors = u.floors || [u.floor];
  const techImgs = [...floors.map((f) => ({ src: `/img/plantas/tecnicas/${FLOORS[f].tech}.jpg`, cap: `Planta técnica · ${FLOORS[f].name}`, plan: 1 })),
    { src: '/img/plantas/tecnicas/estacionamento.jpg', cap: 'Planta técnica · Estacionamento', plan: 1 }];
  const list = tab === 'fotos' ? t.gal.map((n) => ({ src: img(n) }))
    : tab === 'tecnica' ? techImgs
    : t.plans.map((p, k) => ({ src: plan(p), cap: t.planNames[k], plan: 1 }));
  const cur = list[Math.min(i, list.length - 1)];
  const go = (d) => setI((i + d + list.length) % list.length);
  const setTabSafe = (k) => { setTab(k); setI(0); };
  const levels = u.levels || [{ name: null, rooms: u.rooms }];
  const spots = spotsOf(u.id);
  const lug = (n) => `${n} ${n === 1 ? 'lugar' : 'lugares'}`;

  const printSheet = () => {
    // espera que todas as fotografias estejam carregadas antes de abrir a impressão
    const imgs = [...document.querySelectorAll('.s2-print img')];
    Promise.all(imgs.map((im) => (im.complete ? 0 : new Promise((r) => { im.onload = im.onerror = r; })))).then(() => window.print());
  };

  return createPortal(
    <div className="modal open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet2">
        <button className="x" aria-label="Fechar" onClick={onClose}>×</button>

        {/* ---------- coluna de dados ---------- */}
        <aside className="s2-side">
          <div className="s2-brand"><span>ICON <i>SAILOR</i></span></div>
          <div className="s2-badge">{t.name} · {u.id}<small>Fração {u.code}</small></div>
          <span className={`st ${u.st}`}>{ST_NAME[u.st]}</span>

          <dl className="s2-areas">
            <div><dt>Área interior<small>Interior area</small></dt><dd>{m2(u.int)}</dd></div>
            <div><dt>Área exterior<small>Exterior area</small></dt><dd>{m2(ext)}</dd></div>
            <div className="tot"><dt>Área total<small>Total area</small></dt><dd>{m2(u.int + ext)}</dd></div>
          </dl>

          <div className="s2-block">
            <h6>Alçado <small>/ Clique num andar</small></h6>
            <Elevation
              floors={floors}
              current={view}
              size="100%"
              onPick={(f) => setView(floors.includes(f) ? null : f)}
            />
          </div>
          <div className="s2-block">
            {view === null ? (
              <>
                <h6>{floorLabel(u)} <small>/ Floor</small></h6>
                <div className="s2-keys">
                  {floors.map((f) => (
                    <div key={f}>
                      <KeyPlan floor={f} selected={u.id} mono onSelect={(id) => id !== u.id && onSelect(id)} />
                      {floors.length > 1 && <small>{FLOORS[f].name}</small>}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h6>{FLOORS[view].name} <small>/ Escolha uma fração</small></h6>
                <div className="s2-keys">
                  <div>
                    <KeyPlan floor={view} onSelect={(id) => id !== u.id && onSelect(id)} />
                  </div>
                </div>
                <button className="s2-back" onClick={() => setView(null)}>← Voltar à fração {u.id}</button>
              </>
            )}
          </div>
          <div className="s2-block s2-park" onClick={() => setTabSafe('garagem')}>
            <h6>Estacionamento <small>/ Parking</small></h6>
            <div className="s2-parkrow">
              <div className="s2-parkmap"><ParkingPlan unit={u.id} mini /></div>
              <div className="s2-parkinfo">
                <b>{m2(parkingArea(u.id))}</b>
                <small>{lug(spots.length)}</small>
                <span>Nº {spots.map((s) => s.n).join(' · ')}</span>
              </div>
            </div>
          </div>
          <div className="s2-meta">
            <div><span>Preço</span><b>{u.price ? u.price : 'Sob consulta'}</b></div>
            <div><span>Estacionamento</span><b>{lug(spots.length)}</b></div>
          </div>
        </aside>

        {/* ---------- planta / fotos / áreas ---------- */}
        <section className="s2-main">
          <div className="s2-tabs">
            {[['planta', 'Planta'], ['fotos', 'Fotografias'], ['garagem', 'Garagem'], ['areas', 'Áreas'], ['contacto', 'Contacto']].map(([k, l]) => (
              <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTabSafe(k)}>{l}</button>
            ))}
          </div>

          {['planta', 'tecnica', 'fotos'].includes(tab) && (
            <div className={`s2-view ${tab === 'fotos' ? 'photo' : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cur.src} alt={cur.cap || ''} onClick={() => tab !== 'fotos' && openLightbox(list, i)} />
              {cur.cap && <span className="s2-cap">{cur.cap}</span>}
              {list.length > 1 && <><button className="nb p" onClick={() => go(-1)}>‹</button><button className="nb n" onClick={() => go(1)}>›</button></>}
              {tab !== 'fotos' && <span className="s2-hint">Clique para ampliar</span>}
            </div>
          )}

          {tab === 'garagem' && (
            <div className="s2-garage">
              <div className="s2-garage-map"><ParkingPlan unit={u.id} onPick={(id) => id !== u.id && onSelect(id)} /></div>
              <div className="s2-garage-list">
                <h6>Lugares da fração {u.id}</h6>
                {spots.map((s) => (
                  <div key={s.n} className="spot">
                    <span className="num">Nº {s.n}</span>
                    <span className="typ">{SPOT_TYPE[s.t]}</span>
                    <b>{m2(s.a)}</b>
                  </div>
                ))}
                <div className="spot tot"><span className="num">Total</span><span className="typ">{lug(spots.length)}</span><b>{m2(parkingArea(u.id))}</b></div>
                <p>Estacionamento à cota +0,40, com acesso direto ao elevador. Os lugares de outras frações aparecem a branco.</p>
              </div>
            </div>
          )}

          {tab === 'areas' && (
            <div className="s2-rooms">
              {levels.map((lv, k) => (
                <table key={k}>
                  {lv.name && <caption>{lv.name}</caption>}
                  <tbody>
                    {lv.rooms.map(([n, a], j) => <tr key={j}><td>{n}</td><td>{m2(a)}</td></tr>)}
                  </tbody>
                </table>
              ))}
              <table>
                <caption>Exterior</caption>
                <tbody>{u.ext.map(([n, a], j) => <tr key={j}><td>{n}</td><td>{m2(a)}</td></tr>)}</tbody>
              </table>
            </div>
          )}

          {tab === 'contacto' && (
            <form ref={formRef} className="contact s2-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <input required placeholder="Nome" name="nome" />
              <input required type="email" placeholder="Email" name="email" />
              <input placeholder="Telefone" name="telefone" />
              <textarea name="mensagem" placeholder="Mensagem" defaultValue={`Olá, gostaria de receber informação sobre a fração ${u.id} (${t.name}, ${floorLabel(u)}).`} />
              <button className="btn solid" type="submit" style={{ justifyContent: 'center' }}>Enviar pedido</button>
              {sent && <div className="ok" style={{ display: 'block' }}>Obrigado! O formulário ainda não está ligado a um email — ver README.</div>}
            </form>
          )}

          {/* ---------- versão para impressão (só aparece ao imprimir) ---------- */}
          <div className="s2-print">
            <div className="pp-plans">
              {t.plans.map((p, k) => (
                <figure key={p}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={plan(p)} alt="" />
                  {t.plans.length > 1 && <figcaption>{t.planNames[k]}</figcaption>}
                </figure>
              ))}
            </div>
            <div className="pp-page">
              <div className="pp-head"><span>ICON <i>SAILOR</i></span><b>{t.name} · {u.id} · Fotografias</b></div>
              <div className="pp-photos">
                {t.gal.map((n) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={n} src={img(n)} alt="" />
                ))}
              </div>
            </div>
            <div className="pp-page">
              <div className="pp-head"><span>ICON <i>SAILOR</i></span><b>{t.name} · {u.id} · Estacionamento</b></div>
              <div className="pp-garage">
                <ParkingPlan unit={u.id} />
                <div className="s2-garage-list">
                  {spots.map((sp) => (
                    <div key={sp.n} className="spot"><span className="num">Nº {sp.n}</span><span className="typ">{SPOT_TYPE[sp.t]}</span><b>{m2(sp.a)}</b></div>
                  ))}
                  <div className="spot tot"><span className="num">Total</span><span className="typ">{lug(spots.length)}</span><b>{m2(parkingArea(u.id))}</b></div>
                </div>
              </div>
              <p className="s2-legal">Sem escala. Informação, imagens e áreas meramente indicativas, sujeitas a alteração sem aviso prévio; não têm valor contratual.</p>
            </div>
          </div>

          <div className="s2-foot">
            <Link href={`/tour?cena=${t.tour}`} className="btn solid">Tour virtual <Arrow /></Link>
            <button className="btn" onClick={() => setTabSafe('contacto')}>Pedir informação</button>
            <button className="btn" onClick={printSheet}>Imprimir ficha</button>
            <p className="s2-legal">Sem escala. Informação, imagens e áreas meramente indicativas, sujeitas a alteração sem aviso prévio; não têm valor contratual.</p>
          </div>
        </section>
      </div>
    </div>
  , document.body);
}
