// Páginas que carregam dados de forma assíncrona avisam o motor quando o
// conteúdo montou, para ele reinicializar as revelações e o dossiê.
export const CASA_REFRESH_EVENT = 'casa:refresh'

export function notifyCasaRefresh() {
  window.dispatchEvent(new Event(CASA_REFRESH_EVENT))
}
