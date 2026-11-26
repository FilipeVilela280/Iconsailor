// =====================================================================
// TOUR VIRTUAL 360° — T4 DUPLEX
// Este é o ÚNICO ficheiro que precisa de editar para corrigir o tour.
//
// COMO CORRIGIR SEM ADIVINHAR NÚMEROS:
//   Abra o tour com  ?editar=1  no fim do endereço, por exemplo
//     http://localhost:3000/tour/t4?editar=1
//   · Clique numa porta/passagem da imagem 360 → aparece (e fica copiada)
//     uma linha pronta:  { para: '', yaw: 87, pitch: -6 },
//     Cole-a em "ligacoes" da divisão onde está e escreva o id de destino em "para".
//   · Clique na planta → aparece  planta: { x: 34, y: 61 }  para colar na divisão.
//   · O botão "Copiar vista inicial" dá o  inicio: { yaw, pitch }  da vista atual.
//
// CAMPOS DE CADA DIVISÃO
//   id       nome interno (sem espaços); é o que se escreve em "para"
//   nome     o que aparece no site
//   piso     'piso1' ou 'piso2'
//   imagem   ficheiro 360° (equirretangular 2:1) em /public/img/tour360/
//   planta   posição do ponto na planta, em % (x da esquerda, y de cima)
//   inicio   para onde a câmara olha ao entrar (yaw = esquerda/direita, pitch = cima/baixo)
//   ligacoes setas para outras divisões: para = id de destino, yaw/pitch = onde fica a seta
//   capa     (opcional) imagem normal para o cartão na página Tour, ex: '/img/interiores/t4-sala.jpg'.
//            Sem capa, o cartão usa a própria imagem 360 virada para o "inicio".
//
// Imagens 360 atualizadas a 26/11 (2576×1288). Terraços e quarto do piso 2 são novos:
// confirme as setas e os pontos na planta com ?editar=1
// Para trocar uma imagem por uma de melhor qualidade, basta gravar o novo
// ficheiro com o mesmo nome em /public/img/tour360/.
// =====================================================================

export const TITULO = 'T4 Duplex';
export const SUBTITULO = 'Visita virtual 360°';

// Divisão onde o tour começa
export const PRIMEIRA = 'p2-sala';

export const PISOS = [
  { id: 'piso1', nome: 'Piso 1', planta: '/img/tour360/plantas/piso-1.jpg', entrada: 'p1-corredor-escada' },
  { id: 'piso2', nome: 'Piso 2', planta: '/img/tour360/plantas/piso-2.jpg', entrada: 'p2-sala' },
];

export const DIVISOES = [
  // ------------------------------ PISO 2 ------------------------------
  {
    id: 'p2-sala',
    nome: 'Sala e jantar',
    piso: 'piso2',
    imagem: '/img/tour360/p2-sala.jpg',
    planta: { x: 34, y: 79 },
    inicio: { yaw: -40, pitch: -5 },
    ligacoes: [
      { para: 'p2-cozinha', yaw: 9, pitch: -6 },
      { para: 'p2-corredor-escada', yaw: 49, pitch: -6 },
      { para: 'terraco-1', yaw: -167, pitch: -6 },
    ],
  },
  {
    id: 'p2-cozinha',
    nome: 'Cozinha',
    piso: 'piso2',
    imagem: '/img/tour360/p2-cozinha.jpg',
    planta: { x: 11, y: 80 },
    inicio: { yaw: 0, pitch: -5 },
    ligacoes: [
      { para: 'p2-sala', yaw: 168, pitch: -8 },
    ],
  },
  {
    id: 'terraco-1',
    nome: 'Terraço · jantar',
    piso: 'piso2',
    imagem: '/img/tour360/terraco-1.jpg',
    planta: { x: 85, y: 66 },
    inicio: { yaw: -15, pitch: 0 },
    ligacoes: [
      { para: 'p2-sala', yaw: -15, pitch: -4 },
      { para: 'terraco-2', yaw: 70, pitch: -10 },
    ],
  },
  {
    id: 'terraco-2',
    nome: 'Terraço · piscina',
    piso: 'piso2',
    imagem: '/img/tour360/terraco-2.jpg',
    planta: { x: 66, y: 30 },
    inicio: { yaw: 0, pitch: 0 },
    ligacoes: [
      { para: 'terraco-1', yaw: -84, pitch: -10 },
      { para: 'p2-quarto', yaw: 5, pitch: -4 },
    ],
  },
  {
    id: 'p2-corredor-escada',
    nome: 'Hall e escada',
    piso: 'piso2',
    imagem: '/img/tour360/p2-corredor-escada.jpg',
    planta: { x: 25, y: 62 },
    inicio: { yaw: -100, pitch: -5 },
    ligacoes: [
      { para: 'p2-sala', yaw: -108, pitch: -8 },
      { para: 'escada', yaw: -9, pitch: -14 },
      { para: 'p2-corredor-quartos', yaw: 50, pitch: -6 },
    ],
  },
  {
    id: 'p2-corredor-quartos',
    nome: 'Corredor dos quartos',
    piso: 'piso2',
    imagem: '/img/tour360/p2-corredor-quartos.jpg',
    planta: { x: 19, y: 49 },
    inicio: { yaw: 0, pitch: -5 },
    ligacoes: [
      { para: 'p2-corredor-escada', yaw: -95, pitch: -8 },
      { para: 'p2-casa-de-banho', yaw: 13, pitch: -8 },
      { para: 'p2-armario-quarto', yaw: 97, pitch: -8 },
      { para: 'p2-casa-de-banho-2', yaw: 142, pitch: -8 },
    ],
  },
  {
    id: 'p2-armario-quarto',
    nome: 'Quarto · roupeiro',
    piso: 'piso2',
    imagem: '/img/tour360/p2-armario-quarto.jpg',
    planta: { x: 22, y: 36 },
    inicio: { yaw: 30, pitch: -3 },
    ligacoes: [
      { para: 'p2-corredor-quartos', yaw: 176, pitch: -8 },
      { para: 'p2-casa-de-banho-2', yaw: -164, pitch: -8 },
      { para: 'p2-quarto', yaw: 90, pitch: -8 },
    ],
  },
  {
    id: 'p2-quarto',
    nome: 'Quarto · piso 2',
    piso: 'piso2',
    imagem: '/img/tour360/p2-quarto.jpg',
    planta: { x: 38, y: 33 },
    inicio: { yaw: 0, pitch: -5 },
    ligacoes: [
      { para: 'p2-armario-quarto', yaw: -144, pitch: -8 },
      { para: 'terraco-2', yaw: 71, pitch: -6 },
    ],
  },
  {
    id: 'p2-casa-de-banho',
    nome: 'Casa de banho',
    piso: 'piso2',
    imagem: '/img/tour360/p2-casa-de-banho.jpg',
    planta: { x: 36, y: 50 },
    inicio: { yaw: 0, pitch: -5 },
    ligacoes: [
      { para: 'p2-corredor-quartos', yaw: -166, pitch: -8 },
    ],
  },
  {
    id: 'p2-casa-de-banho-2',
    nome: 'Casa de banho do quarto',
    piso: 'piso2',
    imagem: '/img/tour360/p2-casa-de-banho-2.jpg',
    planta: { x: 7, y: 50 },
    inicio: { yaw: 0, pitch: -5 },
    ligacoes: [
      { para: 'p2-corredor-quartos', yaw: -170, pitch: -8 },
      { para: 'p2-armario-quarto', yaw: 160, pitch: -8 },
    ],
  },

  // ------------------------------ ESCADA ------------------------------
  {
    id: 'escada',
    nome: 'Escada',
    piso: 'piso1',
    imagem: '/img/tour360/escada.jpg',
    planta: { x: 33, y: 50 },
    inicio: { yaw: 20, pitch: 5 },
    ligacoes: [
      { para: 'p2-corredor-escada', yaw: 27, pitch: 12 },
      { para: 'p1-corredor-escada', yaw: -18, pitch: -24 },
    ],
  },

  // ------------------------------ PISO 1 ------------------------------
  {
    id: 'p1-corredor-escada',
    nome: 'Corredor e escada',
    piso: 'piso1',
    imagem: '/img/tour360/p1-corredor-escada.jpg',
    planta: { x: 70, y: 52 },
    inicio: { yaw: 27, pitch: -3 },
    ligacoes: [
      { para: 'p1-quarto-1', yaw: -94, pitch: -8 },
      { para: 'escada', yaw: 27, pitch: -4 },
      { para: 'p1-quarto-2', yaw: 88, pitch: -8 },
      { para: 'p1-casa-de-banho', yaw: -172, pitch: -8 },
    ],
  },
  {
    id: 'p1-quarto-1',
    nome: 'Quarto 1',
    piso: 'piso1',
    imagem: '/img/tour360/p1-quarto-1.jpg',
    planta: { x: 35, y: 15 },
    inicio: { yaw: 0, pitch: -5 },
    ligacoes: [
      { para: 'p1-armario-quarto', yaw: -113, pitch: -8 },
    ],
  },
  {
    id: 'p1-armario-quarto',
    nome: 'Quarto 1 · roupeiro',
    piso: 'piso1',
    imagem: '/img/tour360/p1-armario-quarto.jpg',
    planta: { x: 22, y: 35 },
    inicio: { yaw: 20, pitch: -3 },
    ligacoes: [
      { para: 'p1-quarto-1', yaw: 117, pitch: -10 },
      { para: 'p1-corredor-escada', yaw: -164, pitch: -8 },
    ],
  },
  {
    id: 'p1-quarto-2',
    nome: 'Quarto 2 (suite)',
    piso: 'piso1',
    imagem: '/img/tour360/p1-quarto-2.jpg',
    planta: { x: 70, y: 75 },
    inicio: { yaw: 80, pitch: -5 },
    ligacoes: [
      { para: 'p1-casa-de-banho-suite', yaw: -135, pitch: -8 },
      { para: 'p1-corredor-escada', yaw: -114, pitch: -8 },
    ],
  },
  {
    id: 'p1-casa-de-banho-suite',
    nome: 'Casa de banho da suite',
    piso: 'piso1',
    imagem: '/img/tour360/p1-casa-de-banho-suite.jpg',
    planta: { x: 25, y: 67 },
    inicio: { yaw: -120, pitch: -5 },
    ligacoes: [
      { para: 'p1-quarto-2', yaw: 171, pitch: -8 },
    ],
  },
  {
    id: 'p1-casa-de-banho',
    nome: 'Casa de banho',
    piso: 'piso1',
    imagem: '/img/tour360/p1-casa-de-banho.jpg',
    planta: { x: 82, y: 40 },
    inicio: { yaw: -60, pitch: -5 },
    ligacoes: [
      { para: 'p1-corredor-escada', yaw: 0, pitch: -8 },
    ],
  },
];
