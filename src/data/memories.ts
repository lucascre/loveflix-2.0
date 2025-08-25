// src/data/memories.ts
export interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  coverImage: string;
  galleryImages?: string[];
  location?: { name: string; lat: number; lng: number; };
}

export const memories: Memory[] = [
  {
    id: 'primeiro-encontro-no-cafe',
    title: 'Nosso Primeiro Encontro',
    date: '2023-05-20',
    description: 'O dia em que tudo começou, no Café Aconchego. A conversa fluiu tão fácil que nem vimos as horas passarem. Foi ali que soube que algo especial estava nascendo.',
    coverImage: '/images/memoria1.jpg',
    location: { name: 'Café Aconchego', lat: -22.329, lng: -49.071 },
  },
  {
    id: 'primeira-viagem-praia-juntos',
    title: 'Nossa Viagem para a Praia',
    date: '2024-01-15',
    description: 'A primeira vez que vimos o mar juntos com as crianças. A alegria no rosto delas construindo castelos de areia foi inesquecível! Um dia perfeito.',
    coverImage: '/images/memoria2.jpg',
    location: { name: 'Ubatuba, SP', lat: -23.4339, lng: -45.0711 },
  },
];