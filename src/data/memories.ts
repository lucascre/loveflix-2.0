// src/data/memories.ts

// Adicionei a propriedade 'videoSrc' para ser compatível com suas memórias em vídeo.
export interface Memory {
  id: string;
  title: string;
  date: string; // Formato 'YYYY-MM-DD'
  description: string;
  coverImage: string; // Caminho para a imagem principal
  galleryImages?: string[]; // Imagens adicionais
  videoSrc?: string; // (NOVO) Caminho para o vídeo
  location?: { name: string; lat: number; lng: number; };
}

export const memories: Memory[] = [
  // --- SEÇÃO: EU E VOCÊ ---
  {
    id: 'o-inicio',
    title: 'O Início',
    date: '2025-03-04', // Assumindo a data do seu contador
    description: 'Dia do seu Aniversário, dia mais feliz para nós dois aonde começou nossa jornada.',
    coverImage: '/images/euevc_1.jpg',
  },
  {
    id: 'aniversario-tia',
    title: 'Aniversário da Tia',
    date: '2025-05-01',
    description: 'Dia do Aniversário da minha tia, aproveitamos muito!',
    coverImage: '/images/euevc_2.webp',
    galleryImages: ['/images/euevc_2.webp'],
  },
  {
    id: 'passeio-incrivel',
    title: 'Passeio Incrível',
    date: '2025-05-11',
    description: 'Fomos jantar em casal com minha irmã nesse dia incrível.',
    coverImage: '/images/euevc_3.webp',
    galleryImages: ['/images/euevc_3.webp'],
  },
  {
    id: 'cineminha-a-dois',
    title: 'Cineminha',
    date: '2025-05-31',
    description: 'Só eu e meu amor, naquele dia que ficou marcado no meu coração. Fomos ao cinema, rimos, nos abraçamos e vivemos momentos que eu nunca vou esquecer. Sem dúvida, o melhor dia da minha vida.',
    coverImage: '/images/euevc_2.jpg',
    galleryImages: ['/images/euevc_2.jpg'],
  },

  // --- SEÇÃO: MOMENTOS MÁGICOS COM AS CRIANÇAS ---
  {
    id: 'cineminha-em-casa',
    title: 'Cineminha em Casa',
    date: '2025-04-06',
    description: 'Uma noite especial cheia de doces, risadas e muito amor no cineminha. Nada como curtir um filminho juntinhos!',
    coverImage: '/images/momentos_1.jpg',
    galleryImages: [
        '/images/momentos_1.jpg',
        '/images/momentos_2.jpg',
        '/images/momentos_3.jpg',
        '/images/momentos_4.jpg',
        '/images/momentos_5.jpg',
        '/images/momentos_6.jpg'
    ],
  },
  {
    id: 'passeio-na-praca',
    title: 'Passeio na Praça',
    date: '2025-04-06',
    description: 'Brincadeiras, correria e muitos sorrisos ao ar livre. Momentos simples que viram lembranças eternas.',
    coverImage: '/images/momentos_7.jpg',
    galleryImages: [
        '/images/momentos_7.jpg',
        '/images/momentos_8.jpg',
        '/images/momentos_9.jpg',
        '/images/momentos_10.jpg',
        '/images/momentos_11.jpg',
        '/images/momentos_12.jpg',
        '/images/momentos_13.jpg'
    ],
  },
  {
    id: 'dia-da-pascoa',
    title: 'Dia da Páscoa',
    date: '2025-04-20',
    description: 'Doces, ovos de chocolate e olhinhos brilhando de alegria. Uma Páscoa cheia de amor e união!',
    coverImage: '/images/momentos_14.jpg',
    galleryImages: [
        '/images/momentos_14.jpg',
        '/images/momentos_15.jpg',
        '/images/momentos_16.jpg',
        '/images/momentos_25.jpg'
    ],
  },
  {
    id: 'aniversario-tia-com-criancas',
    title: 'Aniversário da Tia',
    date: '2025-05-01',
    description: 'Um dia cheio de alegria, bolo gostoso. As crianças se divertiram e espalharam sorrisos por onde passaram!',
    coverImage: '/images/momentos_20.jpg',
    galleryImages: [
        '/images/momentos_20.jpg',
        '/images/momentos_17.jpg',
        '/images/momentos_18.jpg',
        '/images/momentos_19.jpg',
        '/images/momentos_21.jpg',
        '/images/momentos_22.jpg',
        '/images/momentos_23.jpg',
        '/images/momentos_24.jpg'
    ],
  },
  {
    id: 'se-divertindo',
    title: 'Se Divertindo',
    date: '2025-05-11',
    description: 'O dia em que meus pais viraram crianças de novo! A corrida de cadeira de rodas rendeu muitas risadas e mostrou que alegria não tem idade.',
    coverImage: '/images/momentos_27.png',
    videoSrc: '/videos/momentos_26.mp4', // Assumindo que o vídeo ficará na pasta /public/videos/
  },
  {
    id: 'ohana',
    title: 'Ohana',
    date: '2025-05-31',
    description: "Um dia mágico com muita nostalgia e diversão! Rimos, nos emocionamos e nos lembramos que 'ohana significa família, e família nunca abandona ou esquece'. Foi especial do começo ao fim!",
    coverImage: '/images/momentos_29.jpg',
    galleryImages: [
        '/images/momentos_28.jpg',
        '/images/momentos_29.jpg',
        '/images/momentos_30.jpg',
        '/images/momentos_31.jpg'
    ],
    // 👇 ADICIONE ESTE BLOCO DE CÓDIGO
  location: {
    name: 'Cinépolis', // O nome que aparecerá no pop-up do mapa
    lat: -22.31598132329178,                // O primeiro número que você copiou
    lng: -49.06660326030202                  // O segundo número que você copiou
  }
  },
];