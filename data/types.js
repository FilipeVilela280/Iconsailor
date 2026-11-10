// Modelos de planta do Icon Sailor (cada modelo pode repetir-se em vários pisos).
// plans → /public/img/plantas · gal → /public/img/interiores ou /exterior

const EXTERIOR = ['aerea-farol', 'aerea-ria', 'ext-tres-quartos', 'ext-esquina', 'ext-fachada', 'cobertura-piscina', 'cobertura-terraco', 'entrada-lobby'];

export const img = (n) => `/img/${EXTERIOR.includes(n) ? 'exterior' : 'interiores'}/${n}.jpg`;
export const plan = (n) => `/img/plantas/${n}.jpg`;

export const TYPES = {
  T1: {
    name: 'T1', units: 'B · E', plans: ['t2-3'], planNames: ['Planta'], tour: 't23-sala',
    desc: 'Cozinha ampla com zona de refeições, sala independente e quarto com I.S.',
    gal: ['t2-3-sala', 't2-3-jantar', 'wc-azul'],
  },
  T2A: {
    name: 'T2', units: 'A', plans: ['t2'], planNames: ['Planta'], tour: 't2-sala',
    desc: 'Piso 0, sala e cozinha em open space, dois quartos.',
    gal: ['t2-sala', 't2-cozinha', 't2-quarto', 'wc-verde'],
  },
  T2C: {
    name: 'T2', units: 'C · F · I', plans: ['t2-1'], planNames: ['Planta'], tour: 't21-cozinha',
    desc: 'Frente norte com varanda corrida de 25 m², suite e segundo quarto.',
    gal: ['t2-1-cozinha', 't2-1-sala', 't2-1-cozinha-ilha', 't2-1-varanda', 'wc-azul'],
  },
  T2D: {
    name: 'T2', units: 'D · G', plans: ['t2-2'], planNames: ['Planta'], tour: 't22-sala',
    desc: 'Planta em L, sala de 20 m² e varandas a nascente e a sul.',
    gal: ['t2-2-sala', 't2-2-sala-ripado', 't2-2-sala-varanda', 'wc-verde'],
  },
  T4: {
    name: 'T4 Duplex', units: 'H', plans: ['t4-duplex-piso2', 't4-duplex-piso1'], planNames: ['Piso 2 · Quartos', 'Piso 3 · Sala e terraço'], tour: 't4-sala',
    desc: 'Dois pisos, quatro quartos, terraço de 135 m² com piscina privativa.',
    gal: ['t4-sala', 't4-jantar', 't4-cozinha', 't4-quarto', 'cobertura-piscina', 'cobertura-terraco'],
  },
};

export const TYPE_ORDER = ['T1', 'T2A', 'T2C', 'T2D', 'T4'];
