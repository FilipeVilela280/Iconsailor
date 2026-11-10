# Icon Sailor — Next.js

Site do empreendimento Icon Sailor (Praia da Barra), em **Next.js (App Router) + React + JavaScript**.

## Começar
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # produção
```
Para publicar: ligar a pasta a um repositório GitHub e importar em **vercel.com** (deploy automático).

## Estrutura
```
app/
  layout.js              → fontes, metadados, Navbar, Footer
  globals.css            → estilos (cores no bloco :root)
  page.js                → Início                      /
  projeto/page.js        → Projeto (exteriores)        /projeto
  apartamentos/page.js   → Interiores, tipologias      /apartamentos
  disponibilidade/page.js→ Frações, plantas, ficha     /disponibilidade?tipo=T2.1
  localizacao/page.js    → Mapa e distâncias           /localizacao
  video/page.js          → Filme YouTube + clipes      /video
  tour/page.js           → Tour virtual                /tour?cena=t4-piscina
components/
  Navbar, Footer, Icons (logótipo)
  Media.js               → Hero, Figure (imagem + lightbox), Clip (vídeo)
  SiteEffects.js         → animações ao scroll, lightbox, vídeos automáticos
  Availability.js        → filtros + tabela + esquema do edifício
  BuildingSchema.js      → esquema SVG das frações
  UnitModal.js           → ficha da fração (galeria, planta, contacto)
  TourViewer.js          → tour virtual
  YouTubeFilm.js, LocationMap.js
data/
  types.js               → tipologias (plantas, fotos, quartos…)
  units.js               → frações (áreas, estados…)  ← DADOS DE EXEMPLO
  scenes.js              → cenas e pontos do tour
  media.js               → id do YouTube, clipes, distâncias
public/
  img/exterior, img/interiores, img/plantas, video/, logo.svg
```

## Formulário de contacto
O formulário em `components/UnitModal.js` ainda não envia. Para ligar:
criar `app/api/contacto/route.js` (ex.: com Resend ou Nodemailer) e fazer `fetch('/api/contacto', { method:'POST', body })` no `onSubmit`.
