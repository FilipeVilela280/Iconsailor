// Lugares de estacionamento — retirados da planta de estacionamento (cota +0,40).
// n = número do lugar (numeração proposta, confirmar) · u = fração · a = área m²
// t: 'd' descoberto · 'c' coberto · 'b' box fechada
// r = [x, y, largura, altura] na planta esquemática (caixa 1043 × 1043)

export const SPOTS = [
  // ---------- Estacionamento descoberto (137,14 m²) ----------
  { n: 1, u: 'C', a: 14.73, t: 'd', r: [15, 10, 143, 230] },
  { n: 2, u: 'F', a: 15.93, t: 'd', r: [158, 10, 157, 230] },
  { n: 3, u: 'B', a: 11.99, t: 'd', r: [315, 10, 117, 230] },
  { n: 4, u: 'E', a: 11.98, t: 'd', r: [432, 10, 121, 230] },
  { n: 5, u: 'A', a: 11.98, t: 'd', r: [553, 10, 115, 230] },
  { n: 6, u: 'H', a: 11.98, t: 'd', r: [668, 10, 122, 230] },
  { n: 7, u: 'I', a: 14.46, t: 'd', r: [848, 62, 172, 175] },
  // ---------- Estacionamento coberto (276,90 m²) ----------
  { n: 8, u: 'D', a: 12.24, t: 'c', r: [22, 578, 128, 237] },
  { n: 9, u: 'D', a: 11.48, t: 'c', r: [22, 815, 128, 215] },
  { n: 10, u: 'G', a: 12.24, t: 'c', r: [150, 578, 125, 237] },
  { n: 11, u: 'G', a: 11.48, t: 'c', r: [150, 815, 125, 215] },
  { n: 12, u: 'I', a: 12.88, t: 'c', r: [275, 578, 120, 252] },
  { n: 13, u: 'H', a: 28.53, t: 'b', r: [512, 598, 188, 428] },
  { n: 14, u: 'H', a: 25.80, t: 'b', r: [700, 598, 150, 428] },
];

export const SPOT_TYPE = { d: 'Descoberto', c: 'Coberto', b: 'Box fechada' };

export const spotsOf = (unitId) => SPOTS.filter((s) => s.u === unitId);
export const parkingArea = (unitId) => spotsOf(unitId).reduce((t, s) => t + s.a, 0);
