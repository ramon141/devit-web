export const DOSSIER_PIECES = '.dossier .print, .dossier .dossier-folder, .dossier [data-card]'

type NetworkInformation = { saveData?: boolean; effectiveType?: string }
type DeviceNavigator = Navigator & { connection?: NetworkInformation; deviceMemory?: number }

export function isMobile() {
  return window.matchMedia('(max-width: 767px)').matches
}

// Economia de dados ou conexão 2G: vídeos e animações pesadas ficam desligados
export function isSaveData() {
  const connection = (navigator as DeviceNavigator).connection

  return Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? '')
}

// Celular com pouca memória ou poucos núcleos não aguenta as animações do GSAP
function isWeakMobile() {
  const device = navigator as DeviceNavigator
  const lowMemory = device.deviceMemory !== undefined && device.deviceMemory <= 4
  const fewCores = navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 4

  return isMobile() && (lowMemory || fewCores)
}

// Sem animações pesadas: usuário pediu menos movimento, economia de dados ou celular fraco
export function isReduced() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return prefersReduced || isSaveData() || isWeakMobile()
}
