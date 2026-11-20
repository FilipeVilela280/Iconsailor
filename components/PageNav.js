'use client';
// Botão "página seguinte" no fim de cada página.
// Para mudar a ordem ou os nomes, edite a lista PAGES.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Arrow } from './Icons';
import './PageNav.css';

const PAGES = [
  ['/', 'Início'],
  ['/projeto', 'Projeto'],
  ['/apartamentos', 'Apartamentos'],
  ['/disponibilidade', 'Disponibilidade'],
  ['/localizacao', 'Localização'],
  ['/video', 'Vídeo'],
  ['/tour', 'Tour 360'],
];
const HIDE = ['/tour']; // páginas sem botão

export default function PageNav() {
  const path = usePathname();
  const i = PAGES.findIndex(([href]) => href === path);
  if (i === -1 || HIDE.includes(path)) return null;
  const [href, label] = PAGES[(i + 1) % PAGES.length];

  return (
    <div className="pagenav">
      <Link href={href} className="pagenav-btn">{label} <Arrow /></Link>
    </div>
  );
}
