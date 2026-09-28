import { gsap } from 'gsap'
import { DOSSIER_PIECES } from './shared'

// Peças do dossiê (fotos, ficha, relacionados) e a pasta Devit que as carrega

export type Rest = { left: number; top: number; w: number; h: number }

export type CarryItem = {
  el: HTMLElement
  clone: HTMLElement
  cx: number
  cy: number
  rot: number
  fit: number
}

export function isVisible(element: Element) {
  const rect = element.getBoundingClientRect()

  return rect.width > 0 && rect.height > 0
}

export function dossierPieces() {
  return Array.from(document.querySelectorAll<HTMLElement>(DOSSIER_PIECES)).filter(isVisible)
}

function rotationOf(element: Element) {
  const matrix = getComputedStyle(element).transform
  if (!matrix || matrix === 'none') return 0

  const [a = 1, b = 0] = (matrix.match(/-?[\d.]+/g) ?? []).map(Number)

  return (Math.atan2(b, a) * 180) / Math.PI
}

/** Onde a pasta para (encostada à esquerda, centrada na vertical), em pixels de tela. */
export function carryRest(carry: HTMLElement): Rest {
  const restLeft = Math.min(window.innerWidth * 0.06, 64)
  gsap.set(carry, { xPercent: 0, x: restLeft, yPercent: -50, y: 0, scale: 1, opacity: 1 })

  const rect = carry.getBoundingClientRect()

  return { left: rect.left, top: rect.top, w: carry.offsetWidth, h: carry.offsetHeight }
}

/**
 * Uma cópia visual da peça, dentro da pasta (entre o corpo e a capa), nas
 * coordenadas locais da pasta. É a cópia que viaja; a peça real fica no lugar,
 * invisível, e reaparece quando a cópia chega.
 */
export function carryClone(element: HTMLElement, rest: Rest, inside: HTMLElement): CarryItem {
  const rect = element.getBoundingClientRect()
  const width = element.offsetWidth
  const height = element.offsetHeight
  const clone = element.cloneNode(true) as HTMLElement

  clone.querySelectorAll('iframe, video, script').forEach((node) => node.remove())
  clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'))
  clone.removeAttribute('id')
  clone.classList.add('carry-piece', 'no-transition')

  // a peça real pode estar escondida; a cópia nunca
  clone.style.opacity = ''
  clone.style.visibility = ''

  const cx = rect.left + rect.width / 2 - rest.left
  const cy = rect.top + rect.height / 2 - rest.top

  clone.style.cssText +=
    `;position:absolute;left:${cx - width / 2}px;top:${cy - height / 2}px;` +
    `width:${width}px;height:${height}px;margin:0;z-index:auto;`
  inside.appendChild(clone)

  return {
    el: element,
    clone,
    cx,
    cy,
    rot: rotationOf(element),
    fit: Math.min((rest.w * 0.7) / width, (rest.h * 0.7) / height, 0.75),
  }
}

/** Onde cada cópia fica dentro da pasta (coordenadas locais): uma pilha de papéis no centro. */
export function insidePosition(rest: Rest, item: CarryItem, index: number) {
  return {
    x: rest.w / 2 + ((index % 3) - 1) * rest.w * 0.03 - item.cx,
    y: rest.h / 2 + ((index % 2) - 0.5) * rest.h * 0.04 - item.cy,
    rot: ((index % 5) - 2) * 3.5,
  }
}
