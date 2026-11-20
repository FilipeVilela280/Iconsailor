// =====================================================================
// MAPA DA LOCALIZAÇÃO — locais à volta do Icon Sailor
// Este é o ÚNICO ficheiro a editar para mudar pontos, textos ou fotos.
//
// ACERTAR UMA POSIÇÃO SEM ADIVINHAR:
//   Abra  /localizacao?editar=1  e clique no sítio certo do mapa.
//   Fica copiado  lat: 40.64021, lng: -8.74260,  — cole por cima no local.
//
// ⚠ As posições marcadas "aprox." foram estimadas e devem ser confirmadas.
//
// CAMPOS DE CADA LOCAL
//   cat     categoria (id de CATEGORIAS)
//   nome    nome que aparece
//   texto   uma frase curta (opcional)
//   foto    imagem em /public/img/mapa/... (opcional; sem foto aparece só o texto)
//   lat/lng coordenadas
// =====================================================================

export const PROJETO = {
  nome: 'Icon Sailor',
  texto: 'Rua da Praia, Praia da Barra',
  lat: 40.6402,
  lng: -8.7426,
};

// A vista inicial ajusta-se sozinha para mostrar todos os locais.

// Fundo do mapa (CARTO Voyager, gratuito com atribuição).
// Para uso comercial intenso, considere uma chave MapTiler/Mapbox e troque o URL.
export const MAPA_FUNDO = {
  url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  atribuicao: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
};

export const CATEGORIAS = [
  { id: 'educacao', nome: 'Educação', icone: 'educacao' },
  { id: 'saude', nome: 'Saúde', icone: 'saude' },
  { id: 'verdes', nome: 'Espaços verdes', icone: 'verdes' },
  { id: 'praias', nome: 'Praias', icone: 'praias' },
  { id: 'cultura', nome: 'Cultura', icone: 'cultura' },
  { id: 'comercio', nome: 'Comércio', icone: 'comercio' },
  { id: 'transportes', nome: 'Transportes', icone: 'transportes' },
  { id: 'acessos', nome: 'Acessos', icone: 'acessos' },
];

export const LOCAIS = [
  // ---------- Praias ----------
  { cat: 'praias', nome: 'Praia da Barra', texto: 'Areal extenso junto ao farol, com bandeira azul e boas condições para surf.', lat: 40.6402, lng: -8.7492 }, // aprox.
  { cat: 'praias', nome: 'Praia da Costa Nova', texto: 'Os palheiros às riscas e o passeio entre o mar e a Ria.', lat: 40.6128, lng: -8.7533 }, // aprox.
  { cat: 'praias', nome: 'Praia do Jardim Oudinot', texto: 'Praia fluvial tranquila na margem da Ria.', lat: 40.6457, lng: -8.7193 }, // aprox.

  // ---------- Cultura ----------
  { cat: 'cultura', nome: 'Farol da Barra', texto: 'O farol mais alto de Portugal, aberto a visitas.', lat: 40.64282, lng: -8.74780 },
  { cat: 'cultura', nome: 'Forte da Barra', texto: 'Antigo forte na entrada da barra de Aveiro.', lat: 40.64503, lng: -8.73291 },
  { cat: 'cultura', nome: 'Navio-Museu Santo André', texto: 'Antigo arrastão bacalhoeiro convertido em museu.', lat: 40.6441, lng: -8.7163 }, // aprox.
  { cat: 'cultura', nome: 'Museu Marítimo de Ílhavo', texto: 'A história da pesca do bacalhau e da Ria.', lat: 40.6047, lng: -8.6672 }, // aprox.

  // ---------- Espaços verdes ----------
  { cat: 'verdes', nome: 'Jardim Oudinot', texto: 'Cerca de 11 ha de jardins, desporto, parque infantil e marina.', lat: 40.6448, lng: -8.7175 }, // aprox.
  { cat: 'verdes', nome: 'Passadiço sobre a Ria', texto: 'Percurso pedonal sobre a Ria, ideal para caminhadas ao fim do dia.', lat: 40.6362, lng: -8.7398 }, // aprox.

  // ---------- Educação ----------
  { cat: 'educacao', nome: 'EB Farol da Barra', texto: 'Escola básica do 1.º ciclo.', lat: 40.6416, lng: -8.7448 }, // aprox.
  { cat: 'educacao', nome: 'CASCI · Pré-escolar e creche', texto: 'Creche e jardim de infância na Barra.', lat: 40.6430, lng: -8.7404 }, // aprox.
  { cat: 'educacao', nome: 'Escola Secundária da Gafanha da Nazaré', texto: '3.º ciclo e secundário.', lat: 40.6328, lng: -8.7128 }, // aprox.
  { cat: 'educacao', nome: 'Universidade de Aveiro', texto: 'Campus universitário de Santiago.', lat: 40.6303, lng: -8.6576 }, // aprox.

  // ---------- Saúde ----------
  { cat: 'saude', nome: 'Centro de Saúde da Gafanha da Nazaré', texto: 'Extensão do Centro de Saúde de Ílhavo.', lat: 40.6372, lng: -8.7150 }, // aprox.
  { cat: 'saude', nome: 'Hospital de Aveiro', texto: 'Hospital Infante D. Pedro.', lat: 40.6347, lng: -8.6562 }, // aprox.

  // ---------- Comércio ----------
  { cat: 'comercio', nome: 'Comércio da Gafanha da Nazaré', texto: 'Supermercados, farmácias e serviços do dia a dia.', lat: 40.6355, lng: -8.7160 }, // aprox.
  { cat: 'comercio', nome: 'Fórum Aveiro', texto: 'Centro comercial ao ar livre no centro da cidade.', lat: 40.6417, lng: -8.6536 }, // aprox.

  // ---------- Transportes ----------
  { cat: 'transportes', nome: 'Estação de Aveiro', texto: 'Comboios para o Porto, Coimbra e Lisboa.', lat: 40.6437, lng: -8.6412 }, // aprox.

  // ---------- Acessos ----------
  { cat: 'acessos', nome: 'A25 · ligação a Aveiro', texto: 'Acesso rápido à A25, A1 e A17.', lat: 40.6372, lng: -8.7000 }, // aprox.
];
