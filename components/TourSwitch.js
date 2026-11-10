'use client';
import { useSearchParams } from 'next/navigation';
import TourHub from './TourHub';
import TourViewer from './TourViewer';

/** /tour → ecrã inicial com as tipologias · /tour?cena=… → visita interativa */
export default function TourSwitch() {
  const cena = useSearchParams().get('cena');
  return cena ? <TourViewer /> : <TourHub />;
}
