import { gsap } from 'gsap'
import { isReduced } from './shared'
import { whiteIn } from './mist'

/**
 * Abre a pasta clicada e a traz para a tela: a capa cai, as fotos saem, e a
 * pasta inteira cresce em direção ao visitante enquanto a tela fica branca.
 * Resolve quando a tela está branca.
 */
export function openFolder(card: Element | null) {
  if (!card || isReduced()) return Promise.resolve()

  card.classList.add('is-open')
  const rect = card.getBoundingClientRect()
  const dx = window.innerWidth / 2 - (rect.left + rect.width / 2)
  const dy = window.innerHeight / 2 - (rect.top + rect.height / 2)

  gsap.set(card, { zIndex: 60, position: 'relative', transformOrigin: '50% 50%' })

  // senão o clip da seção corta a pasta crescendo
  const room = card.closest<HTMLElement>('.room')
  if (room) room.style.overflow = 'visible'

  return new Promise<void>((resolve) => {
    gsap
      .timeline({ onComplete: resolve })
      .to(card, { x: dx, y: dy, scale: 3.4, duration: 0.9, ease: 'power2.in' }, 0.1)
      .add(whiteIn(0.45), 0.55)
  })
}
