// Frações do Icon Sailor — áreas retiradas das plantas de arquitetura.
// st: 'd' disponível · 'r' reservado · 'v' vendido   ← ESTADOS DE EXEMPLO, atualizar
// zone: posição no piso (usada na planta-chave): 'norte' · 'poente' · 'nascente'
// rooms: [nome, m²] · ext: [nome, m²]

export const UNITS = [
  // ---------- PISO 0 ----------
  { id: 'A', code: '0.1', floor: 0, zone: 'nascente', ty: 'T2', model: 'T2A', int: 60.62, st: 'd', price: null,
    ext: [['Varanda', 3.86]],
    rooms: [['Sala', 13.39], ['Cozinha', 6.79], ['Quarto', 11.36], ['Quarto', 9.89], ['I.S.', 4.33], ['Hall', 5.23]] },
  { id: 'B', code: '0.2', floor: 0, zone: 'poente', ty: 'T1', model: 'T1', int: 64.12, st: 'v', price: null,
    ext: [['Varanda', 13.62]],
    rooms: [['Sala / Cozinha', 21.97], ['Sala', 12.03], ['Quarto', 12.31], ['I.S.', 4.50], ['Hall', 1.79]] },
  { id: 'C', code: '0.3', floor: 0, zone: 'norte', ty: 'T2', model: 'T2C', int: 82.84, st: 'r', price: null,
    ext: [['Varanda', 25.73]],
    rooms: [['Sala', 16.81], ['Cozinha', 10.14], ['Quarto', 14.95], ['Quarto', 10.26], ['I.S.', 5.01], ['I.S.', 3.62], ['Hall', 8.65]] },

  // ---------- PISO 1 ----------
  { id: 'D', code: '1.1', floor: 1, zone: 'nascente', ty: 'T2', model: 'T2D', int: 78.01, st: 'd', price: null,
    ext: [['Varanda', 19.47], ['Varanda', 1.77]],
    rooms: [['Sala', 19.92], ['Cozinha', 6.54], ['Quarto', 14.43], ['Quarto', 12.26], ['I.S.', 4.47], ['I.S.', 3.56], ['Hall', 4.55]] },
  { id: 'E', code: '1.2', floor: 1, zone: 'poente', ty: 'T1', model: 'T1', int: 64.12, st: 'd', price: null,
    ext: [['Varanda', 2.27]],
    rooms: [['Sala / Cozinha', 21.97], ['Sala', 12.03], ['Quarto', 12.31], ['I.S.', 4.50], ['Hall', 1.79]] },
  { id: 'F', code: '1.3', floor: 1, zone: 'norte', ty: 'T2', model: 'T2C', int: 79.39, st: 'v', price: null,
    ext: [['Varanda', 25.48]],
    rooms: [['Sala', 16.81], ['Cozinha', 10.14], ['Quarto', 14.95], ['Quarto', 10.26], ['I.S.', 5.01], ['I.S.', 3.62], ['Hall', 5.85]] },

  // ---------- PISO 2 ----------
  { id: 'G', code: '2.1', floor: 2, zone: 'nascente', ty: 'T2', model: 'T2D', int: 78.01, st: 'd', price: null,
    ext: [['Varanda', 16.00], ['Varanda', 2.27], ['Varanda', 1.82]],
    rooms: [['Sala', 19.92], ['Cozinha', 6.54], ['Quarto', 14.43], ['Quarto', 12.26], ['I.S.', 4.47], ['I.S.', 3.56], ['Hall', 4.55]] },
  { id: 'H', code: '2.2', floor: 2, floors: [2, 3], zone: 'poente', ty: 'T4', model: 'T4', int: 180.72, st: 'd', price: null,
    ext: [['Terraço com piscina', 135.20], ['Varanda', 1.78]],
    levels: [
      { name: 'Piso 2 · 64,12 m²', rooms: [['Quarto', 14.87], ['Quarto', 12.02], ['Closet', 6.02], ['I.S.', 4.76], ['I.S.', 3.27], ['Hall', 11.02]] },
      { name: 'Piso 3 · 116,60 m²', rooms: [['Sala', 32.72], ['Cozinha', 12.00], ['Quarto', 16.53], ['Quarto', 12.93], ['I.S.', 4.02], ['I.S.', 3.75], ['Hall', 14.84], ['Hall', 1.84]] },
    ] },
  { id: 'I', code: '2.3', floor: 2, zone: 'norte', ty: 'T2', model: 'T2C', int: 79.39, st: 'r', price: null,
    ext: [['Varanda', 25.48]],
    rooms: [['Sala', 16.81], ['Cozinha', 10.14], ['Quarto', 14.95], ['Quarto', 10.26], ['I.S.', 5.01], ['I.S.', 3.62], ['Hall', 5.85]] },
];

export const FLOORS = [
  { n: 0, name: 'Piso 0', tech: 'piso-0' },
  { n: 1, name: 'Piso 1', tech: 'piso-1' },
  { n: 2, name: 'Piso 2', tech: 'piso-2' },
  { n: 3, name: 'Piso 3 · Recuado', tech: 'piso-3-recuado' },
];

export const ST_NAME = { d: 'Disponível', r: 'Reservado', v: 'Vendido' };
export const ST_FILL = { d: '#9CC5B2', r: '#E3C794', v: '#D9A89B' };

// utilitários
export const extTotal = (u) => u.ext.reduce((s, [, a]) => s + a, 0);
export const m2 = (n) => n.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m²';
export const floorLabel = (u) => (u.floors ? 'Pisos 2 + 3' : FLOORS[u.floor].name);
export const unitsOnFloor = (f) => UNITS.filter((u) => u.floor === f || u.floors?.includes(f));
