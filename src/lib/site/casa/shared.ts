export const DOSSIER_PIECES = '.dossier .print, .dossier .dossier-folder, .dossier [data-card]'

export function isReduced() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isMobile() {
  return window.matchMedia('(max-width: 767px)').matches
}
