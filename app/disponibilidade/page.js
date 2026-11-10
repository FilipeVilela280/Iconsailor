import { Suspense } from 'react';
import Availability from '@/components/Availability';

export const metadata = { title: 'Disponibilidade' };

export default function Disponibilidade() {
  return (
    <main>
      <section className="blk" style={{ paddingTop: 'calc(var(--nav-h) + 70px)' }}>
        <div className="wrap">
          <p className="eyebrow">Disponibilidade</p>
          <h2 className="h2">Encontre a <em>sua residência.</em></h2>
          <p className="lead">Selecione uma fração no esquema do edifício ou na lista para ver áreas, fotografias, planta, localização no edifício e tour virtual.</p>
          <Suspense fallback={null}>
            <Availability />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
