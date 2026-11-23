'use client';
import { UNITS } from '@/data/units';

// Aplica os estados/preços vindos da folha Google Sheets a data/units.js
// antes de o resto da página ser desenhado. Sem folha (data = null) nada muda.
export default function UnitStatus({ data, children }) {
  if (data) {
    for (const u of UNITS) {
      const s = data[u.id];
      if (s) { u.st = s.st; u.price = s.price; }
    }
  }
  return children;
}
