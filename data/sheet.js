// Estados e preços das frações lidos de uma folha Google Sheets.
// Só corre no servidor (é chamado em app/layout.js). Ver README → "Estados das frações".
//
// A folha tem de ter, na 1.ª linha, pelo menos as colunas:  Fração | Estado | Preço
//   Fração → letra (A…I) ou código (0.1, 2.2…)
//   Estado → Disponível · Reservado · Vendido
//   Preço  → opcional. Vazio = "Sob consulta". Ex.: 350000  ou  350.000 €
import { UNITS } from './units';

const REVALIDATE = 60; // segundos entre leituras da folha

const norm = (s) => String(s ?? '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// aceita o link "Publicar na Web → CSV" ou o link normal da folha (partilhada como "Qualquer pessoa com o link")
export function csvUrl(url) {
  if (!url) return null;
  const m = url.match(/docs\.google\.com\/spreadsheets\/d\/([^/]+)\/(edit|view)?/);
  if (m && m[1] !== 'e') {
    const gid = (url.match(/[#&?]gid=(\d+)/) || [])[1];
    return `https://docs.google.com/spreadsheets/d/${m[1]}/export?format=csv${gid ? `&gid=${gid}` : ''}`;
  }
  if (url.includes('/pub') && !/output=csv/.test(url)) {
    const u = url.replace('/pubhtml', '/pub');
    return u + (u.includes('?') ? '&' : '?') + 'output=csv';
  }
  return url;
}

// CSV simples com suporte para aspas ("350.000,00 €")
export function parseCSV(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',' || c === ';') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}

const ESTADO = (s) => {
  const n = norm(s);
  if (n.startsWith('disp') || n === 'd') return 'd';
  if (n.startsWith('res') || n === 'r') return 'r';
  if (n.startsWith('vend') || n === 'v') return 'v';
  return null;
};

const PRECO = (s) => {
  const t = String(s ?? '').trim();
  if (!t) return null;
  if (/^\d+([.,]\d+)?$/.test(t)) {
    return Number(t.replace(',', '.')).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  }
  return t; // texto livre, ex.: "350.000 €" ou "Sob consulta"
};

// Converte o CSV em { A: { st: 'd', price: '350 000 €' }, … }
export function toStatuses(rows) {
  if (!rows.length) throw new Error('Folha vazia');
  const head = rows[0].map(norm);
  const col = (...names) => head.findIndex((h) => names.some((n) => h.startsWith(n)));
  const cF = col('fracao', 'unidade', 'id'), cE = col('estado'), cP = col('preco', 'valor');
  if (cF < 0 || cE < 0) throw new Error('A folha tem de ter as colunas "Fração" e "Estado" na 1.ª linha');
  const out = {};
  for (const r of rows.slice(1)) {
    const key = String(r[cF] ?? '').trim();
    const u = UNITS.find((x) => norm(x.id) === norm(key) || x.code === key.replace(',', '.'));
    if (!u) continue;
    const st = ESTADO(r[cE]);
    if (!st) { console.warn(`[folha] Estado inválido para a fração ${u.id}: "${r[cE]}" — mantém-se o de units.js`); continue; }
    out[u.id] = { st, price: cP >= 0 ? PRECO(r[cP]) : null };
  }
  if (!Object.keys(out).length) throw new Error('Nenhuma fração reconhecida na folha');
  return out;
}

export async function getStatuses() {
  const url = csvUrl(process.env.SHEET_CSV_URL);
  if (!url) return null; // sem folha configurada → usa os estados de data/units.js
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (/^\s*</.test(text)) throw new Error('A folha não está publicada/partilhada (recebido HTML em vez de CSV)');
    return toStatuses(parseCSV(text));
  } catch (e) {
    console.error('[folha] Não foi possível ler os estados:', e.message);
    // Em produção (fora do build) lança o erro de propósito: a Vercel mantém a última versão boa
    // da página em vez de mostrar estados errados. No build e em desenvolvimento usa units.js.
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build') throw e;
    return null;
  }
}
