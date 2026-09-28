import type { Agent } from './types'

/**
 * WhatsApp ufficiale Devit (confermato da Dora il 15/09): attivo h24.
 * È il numero che compare nelle schede immobile e nei contatti.
 */
export const DEVIT_WHATSAPP = { display: '+39 376 211 8296', digits: '393762118296', h24: true }

// Os dois sócios fundadores (DE + VIT) são texto fixo do site: não existem na API
export const AGENTS: Agent[] = [
  {
    id: 'angelo-de-santis',
    name: 'Angelo De Santis',
    role: {
      it: 'Socio fondatore · Quartieri nobili',
      pt: 'Sócio fundador · Bairros nobres',
    },
  },
  {
    id: 'massimiliano-vitale',
    name: 'Massimiliano Vitale',
    role: {
      it: 'Socio fondatore · Ville & zona vesuviana',
      pt: 'Sócio fundador · Vilas e zona vesuviana',
    },
  },
]
