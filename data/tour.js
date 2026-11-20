// Ecrã inicial do tour: imagem do edifício com um marcador por tipologia.
// pin = [x, y] do ponto no edifício (0 a 1 na imagem) · lift = altura da linha até ao círculo (0 a 1)
// slides: img = nome da imagem (ver data/types.js → img())
//         video = clipe opcional (ex.: gerado no Higgsfield) em /public/video/tour/… — se existir, substitui a imagem
//         pano  = (futuro) imagem 360° equirretangular em /public/img/360/…
// scene = cena do tour interativo onde "Entrar na visita" começa

export const TOUR_COVER = 'ext-esquina';

// Animação de entrada: a câmara parte da vista frontal e roda até à vista de esquina (TOUR_COVER).
// ORBIT_FROM = imagem de partida · ORBIT_VIDEO = vídeo opcional com o movimento real
// (ex.: gerado no Higgsfield com 1.º frame = vista frontal e último frame = vista de esquina).
// Se ORBIT_VIDEO existir, é usado em vez da rotação simulada.
export const ORBIT_FROM = 'ext-fachada';
export const ORBIT_VIDEO = null; // ex.: '/video/tour/orbita.mp4'

export const TOUR_TYPES = [
  {
    k: 'T4', label: 'T4 Duplex', tipo: 'T4', units: ['H'], pin: [0.29, 0.33], lift: 0.14, scene: 't4-sala',
    tour360: '/tour/t4', // visita 360° (data/tour360.js)
    blurb: 'Não é apenas um apartamento. É um refúgio onde o horizonte encontra o mar — 180,72 m² em dois pisos, terraço com piscina e vista para a Ria e o Farol.',
    slides: [
      { img: 'cobertura-piscina', cap: 'Terraço com piscina' },
      { img: 't4-sala', cap: 'Sala' },
      { img: 't4-cozinha', cap: 'Cozinha e jantar' },
      { img: 't4-jantar', cap: 'Sala de jantar' },
      { img: 't4-quarto', cap: 'Suite' },
      { img: 'cobertura-terraco', cap: 'Miradouro sobre a Ria' },
    ],
  },
  {
    k: 'T2', label: 'T2', tipo: 'T2', units: ['A', 'C', 'D', 'F', 'G', 'I'], pin: [0.69, 0.45], lift: 0.2, scene: 't21-cozinha',
    blurb: 'Seis apartamentos com dois quartos, varandas generosas e cozinha aberta para a sala.',
    slides: [
      { img: 't2-1-cozinha', cap: 'Cozinha e sala' },
      { img: 't2-1-varanda', cap: 'Varanda' },
      { img: 't2-2-sala', cap: 'Sala com ripado' },
      { img: 't2-sala', cap: 'Sala e jantar' },
      { img: 't2-quarto', cap: 'Quarto' },
      { img: 'wc-verde', cap: 'Casa de banho' },
    ],
  },
  {
    k: 'T1', label: 'T1', tipo: 'T1', units: ['B', 'E'], pin: [0.23, 0.6], lift: 0.16, scene: 't23-sala',
    blurb: 'Dois apartamentos de um quarto, com cozinha ampla e zona de refeições.',
    slides: [
      { img: 't2-3-sala', cap: 'Sala e cozinha' },
      { img: 't2-3-jantar', cap: 'Zona de refeições' },
      { img: 'wc-azul', cap: 'Casa de banho' },
    ],
  },
];
