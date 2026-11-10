import { Suspense } from 'react';
import TourSwitch from '@/components/TourSwitch';

export const metadata = { title: 'Tour virtual' };

export default function Tour() {
  return (
    <main>
      <Suspense fallback={<div className="tour" />}>
        <TourSwitch />
      </Suspense>
    </main>
  );
}
