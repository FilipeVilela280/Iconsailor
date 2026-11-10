'use client';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { TYPES } from '@/data/types';
import { UNITS, FLOORS, ST_NAME, extTotal, m2, floorLabel, unitsOnFloor } from '@/data/units';
import { KeyPlan, Elevation } from './BuildingSchema';
import UnitModal from './UnitModal';

const TY_FILTERS = [['all', 'Todas'], ['T1', 'T1'], ['T2', 'T2'], ['T4', 'T4 Duplex']];

export default function Availability() {
  const params = useSearchParams();
  const [ty, setTy] = useState('all');
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [floor, setFloor] = useState(1);
  const [hl, setHl] = useState(null);
  const [open, setOpen] = useState(null);
  const [withForm, setWithForm] = useState(false);

  useEffect(() => {
    const t = params.get('tipo'); if (t) setTy(t);
    if (params.get('contacto')) { setOpen(UNITS.find((u) => u.st === 'd').id); setWithForm(true); }
  }, [params]);

  const pass = useCallback((u) => (ty === 'all' || u.ty === ty) && (!onlyAvail || u.st === 'd'), [ty, onlyAvail]);
  const rows = UNITS.filter(pass);
  const select = (id) => { setWithForm(false); setOpen(id); };
  const hover = (id) => {
    setHl(id);
    const u = UNITS.find((x) => x.id === id);
    if (u && !(u.floors || [u.floor]).includes(floor)) setFloor(u.floor);
  };
  const count = (f) => unitsOnFloor(f).filter((u) => u.st === 'd').length;

  return (
    <>
      <div className="filters">
        {TY_FILTERS.map(([k, l]) => (
          <button key={k} className={`chip ${ty === k ? 'on' : ''}`} onClick={() => setTy(k)}>{l}</button>
        ))}
        <span className="sep" />
        <button className={`chip ${onlyAvail ? 'on' : ''}`} onClick={() => setOnlyAvail(!onlyAvail)}>Só disponíveis</button>
      </div>

      <div className="avail-grid">
        <aside className="bldg">
          <h4>Escolha o piso</h4>
          <p className="s">Clique no alçado ou nos separadores</p>
          <Elevation floors={[floor]} onPick={setFloor} />
          <div className="floor-tabs">
            {FLOORS.map((f) => (
              <button key={f.n} className={floor === f.n ? 'on' : ''} onClick={() => setFloor(f.n)}>
                {f.n === 3 ? 'Recuado' : f.name}<small>{count(f.n)} disp.</small>
              </button>
            ))}
          </div>
          <div className="keyplan">
            <KeyPlan floor={floor} selected={hl} filter={pass} onSelect={select} onHover={setHl} />
          </div>
          <div className="legend">
            <span><i style={{ background: '#9CC5B2' }} />Disponível</span>
            <span><i style={{ background: '#E3C794' }} />Reservado</span>
            <span><i style={{ background: '#D9A89B' }} />Vendido</span>
          </div>
        </aside>

        <div style={{ overflowX: 'auto' }}>
          <table className="units">
            <thead>
              <tr><th>Fração</th><th>Piso</th><th>Tipologia</th><th>Área int.</th><th className="hm">Área ext.</th><th className="hm">Total</th><th>Estado</th><th /></tr>
            </thead>
            <tbody>
              {rows.length ? rows.map((u) => (
                <tr key={u.id} className={`row ${hl === u.id ? 'hl' : ''}`} onClick={() => select(u.id)} onMouseEnter={() => hover(u.id)}>
                  <td className="fr">{u.id}<small className="code">{u.code}</small></td>
                  <td>{floorLabel(u).replace(' · Recuado', '')}</td>
                  <td className="ty">{TYPES[u.model].name}</td>
                  <td>{m2(u.int)}</td>
                  <td className="hm">{m2(extTotal(u))}</td>
                  <td className="hm">{m2(u.int + extTotal(u))}</td>
                  <td><span className={`st ${u.st}`}>{ST_NAME[u.st]}</span></td>
                  <td><span className="go">Ficha →</span></td>
                </tr>
              )) : (
                <tr><td colSpan={8} style={{ padding: '30px 12px', color: '#6B6A63' }}>Sem frações para este filtro.</td></tr>
              )}
            </tbody>
          </table>
          <p className="note">* Áreas retiradas das plantas de projeto, sujeitas a confirmação. Valores sob consulta. Informação não vinculativa.</p>
        </div>
      </div>

      <UnitModal unitId={open} startWithForm={withForm} onClose={() => setOpen(null)} onSelect={select} />
    </>
  );
}
