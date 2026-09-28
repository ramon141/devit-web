/**
 * O mapa estático do golfo (public/img/mappa-napoli.jpg): 2048×1280, tiles
 * OpenStreetMap z14 costurados e dessaturados, de Pozzuoli a Torre del Greco.
 * Projeção Web Mercator — estas funções colocam um par lat/lng em % da imagem.
 * Serve ao mapa da home e ao "dove si trova" da ficha, e funciona sem chave
 * de API nem scripts externos.
 */
export const MAP = {
  src: '/img/mappa-napoli.jpg',
  width: 2048,
  height: 1280,
  north: 40.91351257612758,
  south: 40.74725696280421,
  west: 14.1064453125,
  east: 14.4580078125,
};

const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));

/** posição em % da imagem (x da esquerda, y do topo) */
export function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - MAP.west) / (MAP.east - MAP.west)) * 100;
  const y = ((mercY(MAP.north) - mercY(lat)) / (mercY(MAP.north) - mercY(MAP.south))) * 100;
  return { x, y };
}

export const inMap = (lat: number, lng: number) =>
  lat <= MAP.north && lat >= MAP.south && lng >= MAP.west && lng <= MAP.east;

export const googleMapsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(5)},${lng.toFixed(5)}`;

export const googleEmbedUrl = (lat: number, lng: number, zoom = 16) =>
  `https://www.google.com/maps?q=${lat.toFixed(5)},${lng.toFixed(5)}&z=${zoom}&output=embed`;
