import { Suspense } from 'react';
import Tour360 from '@/components/Tour360';

export const metadata = { title: 'T4 Duplex · Visita 360°' };

export default function TourT4() {
  return (
    <main>
      <Suspense fallback={<div className="t360" />}>
        <Tour360 />
      </Suspense>
    </main>
  );
}
