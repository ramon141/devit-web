import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DOSSIER_PIECES, isMobile, isReduced } from './shared'

gsap.registerPlugin(ScrollTrigger, SplitText)

/**
 * O movimento do site: títulos linha a linha, blocos que entram ao rolar,
 * cards em sequência, arcos da marca em paralaxe e vídeos que acendem quando
 * chegam na tela. Só transform/opacity. `initCasa` devolve a função de limpeza.
 */

function splitTitles() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((element) => {
    if (element.dataset.splitDone) return
    element.dataset.splitDone = '1'

    const split = new SplitText(element, { type: 'lines', mask: 'lines', linesClass: 'split-line' })
    const isHero = element.closest('[data-hero]')

    gsap.from(split.lines, {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.09,
      ease: 'power4.out',
      ...(isHero
        ? { delay: 0.15 }
        : { scrollTrigger: { trigger: element, start: 'top 88%', once: true } }),
    })
  })

  ScrollTrigger.refresh()
}

function playVideosOnce(kills: Array<() => void>) {
  document.querySelectorAll<HTMLVideoElement>('[data-play-once]').forEach((video) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return

        video.play().catch(() => undefined)
        observer.disconnect()
      },
      { threshold: 0.45 }
    )

    observer.observe(video)
    kills.push(() => observer.disconnect())
  })
}

function revealBatch(elements: HTMLElement[], start: string, y: number, duration: number) {
  if (elements.length === 0) return

  gsap.set(elements, { autoAlpha: 0, y })

  ScrollTrigger.batch(elements, {
    start,
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, { autoAlpha: 1, y: 0, duration, stagger: 0.08, ease: 'power3.out', overwrite: true })
    },
  })
}

function revealBlocks() {
  const outsideDossier = (element: Element) => !element.closest('.dossier')

  const items = gsap.utils
    .toArray<HTMLElement>('.room-inner > *, [data-reveal]')
    .filter(
      (element) =>
        element.tagName !== 'SCRIPT' &&
        !element.querySelector('[data-card]') &&
        !element.hasAttribute('data-split') &&
        outsideDossier(element)
    )
  const cards = gsap.utils.toArray<HTMLElement>('[data-card]').filter(outsideDossier)

  // na ficha, as peças nascem escondidas: deployDossier as traz de dentro da pasta
  if (document.querySelector(DOSSIER_PIECES)) gsap.set(DOSSIER_PIECES, { autoAlpha: 0 })
  revealBatch(items, 'top 90%', 30, 1.1)
  revealBatch(cards, 'top 92%', 48, 1.2)
}

function parallax(selector: string, from: number, to: number) {
  gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
    gsap.fromTo(
      element,
      { yPercent: from },
      {
        yPercent: to,
        ease: 'none',
        scrollTrigger: {
          trigger: element.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
  })
}

export function initCasa() {
  const kills: Array<() => void> = []
  let cancelled = false

  const context = gsap.context(() => {
    if (!isReduced()) {
      const run = () => {
        if (!cancelled) splitTitles()
      }

      if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(run)
      else run()
    }

    if (!isReduced()) playVideosOnce(kills)

    if (!isReduced()) {
      revealBlocks()
      parallax('.arch-decor', 16, -16)
      if (!isMobile()) parallax('[data-parallax]', -8, 8)
    }
  })

  ScrollTrigger.refresh()

  return () => {
    cancelled = true
    kills.forEach((kill) => kill())
    context.revert()
    document.querySelectorAll<HTMLElement>('[data-split-done]').forEach((element) => {
      delete element.dataset.splitDone
    })
  }
}
