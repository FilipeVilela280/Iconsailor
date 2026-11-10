'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Brand } from './Icons';

const LINKS = [
  ['/projeto', 'Projeto'],
  ['/apartamentos', 'Apartamentos'],
  ['/disponibilidade', 'Disponibilidade'],
  ['/localizacao', 'Localização'],
  ['/video', 'Vídeo'],
  ['/tour', 'Tour 360'],
];
const HERO_PAGES = ['/', '/projeto', '/apartamentos', '/localizacao'];

export default function Navbar() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [path]);

  useEffect(() => setOpen(false), [path]);

  const solid = path !== '/tour' && (!HERO_PAGES.includes(path) || scrolled);

  return (
    <nav className={`nav ${solid ? 'solid' : ''}`}>
      <div className="wrap">
        <Link href="/" aria-label="Icon Sailor — início"><Brand /></Link>
        <div className={`menu ${open ? 'open' : ''}`}>
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className={path === href ? 'on' : ''}>{label}</Link>
          ))}
          <Link href="/disponibilidade?contacto=1" className="cta">Agendar visita</Link>
        </div>
        <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
