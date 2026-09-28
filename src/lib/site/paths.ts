// Rotas do site público (sem prefixo de idioma: o idioma vem do localStorage)

// Landing estática servida de public/vendi-con-noi
export const SELL_URL = '/vendi-con-noi/index.html'

export const SITE_PATHS = {
  home: '/',
  properties: '/immobili',
  property: (id: string) => `/immobile/${id}`,
  zones: '/zone',
  zone: (slug: string) => `/zone/${slug}`,
  about: '/chi-siamo',
  calendars: '/calendari',
  contact: '/contatti',
  requests: '/richieste',
  news: '/news',
  privacy: '/privacy-cookies',
  ownerArea: '/area-proprietari/login',
}

export const PROPERTY_PATH = /^\/immobile\//
