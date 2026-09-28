import { gsap } from 'gsap'
import { isReduced } from './shared'

// A névoa entre páginas e o "branco" que faz a ponte entre uma cena e outra

function query<T extends HTMLElement>(selector: string) {
  return document.querySelector<T>(selector)
}

/** A tela fica branca (tween, para encaixar numa timeline). */
export function whiteIn(duration = 0.4) {
  const white = query('.white')
  if (!white) return gsap.to({}, { duration: 0 })

  white.classList.add('is-active')

  return gsap.fromTo(white, { opacity: 0 }, { opacity: 1, duration, ease: 'power2.in' })
}

/** O branco some (sobre o vídeo do voo ou sobre a névoa). */
export function whiteOut(duration = 0.6) {
  const white = query('.white')
  if (!white || !white.classList.contains('is-active')) return

  gsap.to(white, {
    opacity: 0,
    duration,
    ease: 'power2.out',
    onComplete: () => white.classList.remove('is-active'),
  })
}

/** Esconde a pasta depois da transição. */
export function carryReset() {
  query('.carry')?.classList.remove('is-active')
}

/** Deixa a névoa pronta atrás do branco, para a página nova abrir com ela. */
export function mistArm() {
  const mist = query('.mist')
  if (!mist) return

  mist.classList.add('is-active')
  gsap.set(mist, { opacity: 1 })
  gsap.set(mist.querySelectorAll('.mist-cloud'), { scale: 1.15, opacity: 1 })
}

/** A névoa fecha: nuvens entram das bordas e cobrem a tela. */
export function mistIn() {
  const mist = query('.mist')
  if (!mist || isReduced()) return Promise.resolve()

  mist.classList.add('is-active')
  const clouds = mist.querySelectorAll('.mist-cloud')
  const main = document.getElementById('main')

  return new Promise<void>((resolve) => {
    gsap
      .timeline({ onComplete: resolve })
      .fromTo(mist, { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power2.out' }, 0)
      .fromTo(
        clouds,
        { scale: 0.55, opacity: 0 },
        { scale: 1.15, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'power2.out' },
        0
      )
      .to(main, { autoAlpha: 0.2, y: -10, duration: 0.5, ease: 'power2.in' }, 0)
  })
}

/** A névoa abre: as nuvens se afastam e a página nova sobe do fundo. */
export function mistOut() {
  const mist = query('.mist')
  if (!mist || !mist.classList.contains('is-active')) return

  const clouds = mist.querySelectorAll('.mist-cloud')
  const main = document.getElementById('main')
  whiteOut(0.5)
  carryReset()

  gsap
    .timeline({
      onComplete: () => {
        mist.classList.remove('is-active')
        gsap.set(main, { clearProps: 'all' })
      },
    })
    .fromTo(main, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.1)
    .to(clouds, { scale: 1.9, opacity: 0, duration: 0.9, stagger: 0.05, ease: 'power2.inOut' }, 0)
    .to(mist, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 0.25)
}
