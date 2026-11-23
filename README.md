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
  units.js               → frações (áreas, divisões; estados de reserva)
  sheet.js               → lê estados e preços da folha Google Sheets
  scenes.js              → cenas e pontos do tour
  media.js               → id do YouTube, clipes, distâncias
public/
  img/exterior, img/interiores, img/plantas, video/, logo.svg
```

## Formulário de contacto
O formulário em `components/UnitModal.js` ainda não envia. Para ligar:
criar `app/api/contacto/route.js` (ex.: com Resend ou Nodemailer) e fazer `fetch('/api/contacto', { method:'POST', body })` no `onSubmit`.

## Estados das frações (Google Sheets)
O estado (Disponível / Reservado / Vendido) e o preço de cada fração vêm de uma folha Google Sheets
que o cliente controla. O site lê a folha a cada **60 segundos** — não é preciso novo deploy.
Se a folha não estiver configurada, usa os estados de `data/units.js`. Se a folha falhar em produção,
a Vercel continua a mostrar a última versão correta.

**1. Criar a folha** (na conta Google do cliente)
- Google Sheets → Ficheiro → Importar → carregar `docs/estados-fracoes.csv` → "Substituir folha".
- Selecionar a coluna **Estado** → Dados → Validação de dados → *Menu pendente* com
  `Disponível`, `Reservado`, `Vendido` (evita erros de escrita).
- Colunas obrigatórias: **Fração** e **Estado**. **Preço** é opcional (vazio = "Sob consulta";
  aceita `350000` ou texto como `350.000 €`). As outras colunas (Notas…) são ignoradas pelo site.
- Não mudar a letra na coluna Fração nem o nome dos cabeçalhos.

**2. Publicar a folha**
- Ficheiro → Partilhar → **Publicar na Web** → escolher a folha → formato **Valores separados por vírgulas (.csv)** → Publicar.
- Copiar o link (termina em `output=csv`).
  *(Em alternativa: Partilhar → "Qualquer pessoa com o link: Leitor" e usar o link normal da folha.)*

**3. Ligar ao site**
- No computador: copiar `.env.example` para `.env.local` e colar o link em `SHEET_CSV_URL`. Reiniciar `npm run dev`.
- Na Vercel: Project → Settings → Environment Variables → `SHEET_CSV_URL` = o mesmo link
  (Production e Preview) → depois **Redeploy** uma vez.

**Para o cliente:** mudar o Estado na folha → o site atualiza em 1–2 minutos
(o Google também demora até ~1 min a publicar a alteração).
