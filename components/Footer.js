'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brand } from './Icons';
import { CONTACTS, PROMOTER, LEGAL, telHref } from '@/data/contacts';

export default function Footer() {
  const path = usePathname();
  if (path.startsWith('/tour/')) return null; // visita 360° em ecrã inteiro
  return (
    <footer>
      <div className="wrap">
        <div className="cols">
          <div>
            <Link href="/"><Brand style={{ color: '#F3EFE8', display: 'flex' }} /></Link>
            <p style={{ marginTop: 22, fontSize: '.9rem', maxWidth: '34ch', opacity: 0.75 }}>
              Nove apartamentos exclusivos entre a Ria de Aveiro e o Oceano Atlântico, na Gafanha da Nazaré.
            </p>
            <h5 style={{ marginTop: 30 }}>Promotor</h5>
            <p className="promoter">{PROMOTER.name}</p>
            <p style={{ fontSize: '.85rem', opacity: 0.75, marginTop: 6 }}>{PROMOTER.address[0]}<br />{PROMOTER.address[1]}</p>
            <a href={PROMOTER.site} target="_blank" rel="noopener noreferrer">{PROMOTER.siteLabel} ↗</a>
          </div>
          <div>
            <h5>Explorar</h5>
            <Link href="/projeto">Projeto</Link>
            <Link href="/apartamentos">Apartamentos</Link>
            <Link href="/disponibilidade">Disponibilidade</Link>
            <Link href="/localizacao">Localização</Link>
            <Link href="/video">Vídeo</Link>
            <Link href="/tour">Tour virtual</Link>
          </div>
          {CONTACTS.map((c) => (
            <div key={c.name} className="contact-card">
              <h5>{c.role}</h5>
              <p className="cname">{c.name}</p>
              <a href={telHref(c.tel)}>{c.tel}</a>
              <a href={'mailto:' + c.email}>{c.email}</a>
            </div>
          ))}
        </div>
        <p className="legal-note">{LEGAL}</p>
        <div className="legal">
          <span>© 2026 Icon Sailor · Promoção {PROMOTER.name}. Todos os direitos reservados.</span>
          <span>Imagens 3D meramente ilustrativas</span>
        </div>
      </div>
    </footer>
  );
}
