import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SiteEffects from '@/components/SiteEffects';
// Fontes instaladas localmente (sem depender do Google Fonts)
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource-variable/manrope';
import './globals.css';


export const metadata = {
  metadataBase: new URL('https://www.iconsailor.pt'),
  title: { default: 'Icon Sailor · Praia da Barra', template: '%s · Icon Sailor' },
  description: 'Icon Sailor — nove apartamentos exclusivos T2 a T4 Duplex entre a Ria de Aveiro e o Oceano, na Gafanha da Nazaré (Praia da Barra).',
  icons: { icon: '/icon.svg' },
  openGraph: { title: 'Icon Sailor · Praia da Barra', images: ['/img/exterior/ext-tres-quartos.jpg'], locale: 'pt_PT', type: 'website' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <Navbar />
        {children}
        <Footer />
        <SiteEffects />
      </body>
    </html>
  );
}
