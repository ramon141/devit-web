import { useLayoutEffect, useRef, type RefObject } from 'react'
import { gsap } from 'gsap'

const MAIN_TILT = -1.2

type FlipState = { from: DOMRect; mainFrom: DOMRect; prevMain: number }

function center(rect: DOMRect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

// a transição CSS do hover não pode brigar com o tween
function fly(element: HTMLElement, from: gsap.TweenVars, to: gsap.TweenVars) {
  element.classList.add('no-transition')

  gsap.fromTo(element, from, {
    ...to,
    duration: 0.65,
    ease: 'power3.out',
    clearProps: 'transform,zIndex',
    onComplete: () => element.classList.remove('no-transition'),
  })
}

function flyFrom(target: DOMRect, source: DOMRect, rotation: number, zIndex: number): gsap.TweenVars {
  const to = center(target)
  const origin = center(source)

  return {
    x: origin.x - to.x,
    y: origin.y - to.y,
    scale: source.width / target.width,
    rotation,
    zIndex,
  }
}

/**
 * FLIP: depois da troca, a nova foto grande voa do lugar da pequena e a antiga
 * grande voa para a pilha. `remember` guarda as posições antes da troca.
 */
export function usePhotoFlip(rootRef: RefObject<HTMLDivElement | null>, main: number) {
  const flip = useRef<FlipState | null>(null)

  const remember = (small: HTMLElement) => {
    const mainElement = rootRef.current?.querySelector<HTMLElement>('.print--main')
    if (!mainElement) return

    flip.current = {
      from: small.getBoundingClientRect(),
      mainFrom: mainElement.getBoundingClientRect(),
      prevMain: main,
    }
  }

  useLayoutEffect(() => {
    const state = flip.current
    flip.current = null

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!state || !rootRef.current || reduced) return

    const mainElement = rootRef.current.querySelector<HTMLElement>('.print--main')
    const backElement = rootRef.current.querySelector<HTMLElement>(
      `.print--small[data-index="${state.prevMain}"]`
    )

    if (mainElement) {
      fly(
        mainElement,
        flyFrom(mainElement.getBoundingClientRect(), state.from, 0, 40),
        { x: 0, y: 0, scale: 1, rotation: MAIN_TILT }
      )
    }

    if (backElement) {
      const rotation = parseFloat(backElement.style.getPropertyValue('--r')) || 0

      fly(
        backElement,
        flyFrom(backElement.getBoundingClientRect(), state.mainFrom, MAIN_TILT, 39),
        { x: 0, y: 0, scale: 1, rotation }
      )
    }
  }, [main, rootRef])

  return remember
}
