// O jsdom não implementa estas APIs do navegador, usadas pelos componentes
// (Radix, Recharts, hooks de media query, GSAP).

class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

class IntersectionObserverStub {
  readonly root = null
  readonly rootMargin = ''
  readonly scrollMargin = ''
  readonly thresholds: number[] = []
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

// Desktop por padrão: todas as media queries casam (ex.: min-width: 1024px).
// Para testar mobile, sobrescreva window.matchMedia dentro do teste.
const matchMediaStub = (query: string): MediaQueryList => ({
  matches: true,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})

export function installBrowserPolyfills() {
  window.matchMedia = matchMediaStub
  window.ResizeObserver = ResizeObserverStub
  window.IntersectionObserver = IntersectionObserverStub
  window.scrollTo = () => {}

  Element.prototype.scrollIntoView = () => {}
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}

  URL.createObjectURL = () => 'blob:test'
  URL.revokeObjectURL = () => {}
}
