import TourVisita from '@/components/TourVisita';

export const metadata = { title: 'Tour virtual' };

// Lista de divisões + pré-visualização. A visita 360° abre em /tour/t4 (dados em data/tour360.js).
export default function Tour() {
  return <TourVisita />;
}
