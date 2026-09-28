import { gsap } from 'gsap'
import { carryClone, carryRest, dossierPieces, insidePosition, type CarryItem, type Rest } from './carry'
import { whiteIn } from './mist'
import { DOSSIER_PIECES, isReduced } from './shared'

type CarryParts = { carry: HTMLElement; front: HTMLElement; inside: HTMLElement }

function carryParts(): CarryParts | null {
  const dossier = document.querySelector('.dossier')
  const carry = document.querySelector<HTMLElement>('.carry')
  const front = carry?.querySelector<HTMLElement>('.carry-front')
  const inside = carry?.querySelector<HTMLElement>('.carry-inside')

  if (!dossier || !carry || !front || !inside) return null

  return { carry, front, inside }
}

function flyPiecesIntoCarry(rest: Rest, inside: HTMLElement) {
  const items = dossierPieces().map((element) => carryClone(element, rest, inside))
  gsap.set(
    items.map((item) => item.el),
    { autoAlpha: 0 }
  )

  items.forEach((item, index) => {
    const target = insidePosition(rest, item, index)

    gsap.fromTo(
      item.clone,
      { rotation: item.rot, scale: 1, x: 0, y: 0 },
      {
        x: target.x,
        y: target.y,
        scale: item.fit,
        rotation: target.rot,
        duration: 0.8,
        ease: 'power2.inOut',
        delay: (items.length - 1 - index) * 0.06,
      }
    )
  })
}

/**
 * Saindo da ficha: uma pasta Devit entra pela esquerda; tudo que está sobre a
 * mesa voa para dentro dela, a capa fecha por cima e a pasta fechada vem para
 * a tela enquanto o branco toma conta. Resolve quando a tela está branca;
 * false se não há dossiê nesta página.
 */
export function collectDossier() {
  const parts = carryParts()
  if (!parts || isReduced()) return Promise.resolve(false)

  const { carry, front, inside } = parts
  carry.classList.add('is-active')
  inside.innerHTML = ''

  const rest = carryRest(carry)
  gsap.set(carry, { xPercent: -120 })
  gsap.set(front, { rotationX: -84 })

  const fade = Array.from(
    document.querySelectorAll('.dossier nav, .dossier .print-tag, .dossier .print-hint, .dossier h2')
  )
  // a capa fecha logo depois de a última peça pousar
  const frontAt = 0.55 + 0.8 + Math.max(0, dossierPieces().length - 1) * 0.06 + 0.15

  return new Promise<boolean>((resolve) => {
    gsap
      .timeline({ onComplete: () => resolve(true) })
      .to(carry, { xPercent: 0, duration: 0.6, ease: 'power3.out' }, 0)
      .to(fade, { autoAlpha: 0, duration: 0.3 }, 0)
      .add(() => flyPiecesIntoCarry(rest, inside), 0.55)
      .to(front, { rotationX: 0, duration: 0.55, ease: 'power3.inOut' }, frontAt)
      .to(
        carry,
        { x: () => window.innerWidth / 2 - rest.w / 2, scale: 3, duration: 0.85, ease: 'power2.in' },
        '>-0.1'
      )
      .add(whiteIn(0.45), '<0.4')
  })
}

function stackClonesInside(items: CarryItem[], rest: Rest) {
  items.forEach((item, index) => {
    const target = insidePosition(rest, item, index)
    gsap.set(item.clone, { x: target.x, y: target.y, scale: item.fit, rotation: target.rot })
  })
}

function deployTimeline(parts: CarryParts, items: CarryItem[], all: HTMLElement[], delay: number) {
  const { carry, front, inside } = parts
  const outAt = delay + 1.05
  const endAt = outAt + 0.85 + Math.max(0, items.length - 1) * 0.06

  const timeline = gsap.timeline({
    onComplete: () => {
      carry.classList.remove('is-active')
      inside.innerHTML = ''
      gsap.set(all, { clearProps: 'opacity,visibility' })
    },
  })

  // 1) a pasta entra fechada; 2) a capa abre: as peças estão lá dentro
  timeline
    .to(carry, { xPercent: 0, duration: 0.55, ease: 'power3.out' }, delay)
    .to(front, { rotationX: -84, duration: 0.5, ease: 'power3.inOut' }, delay + 0.5)

  // 3) cada cópia sai da pasta e cresce até o lugar da peça real, que reaparece na chegada
  items.forEach((item, index) => {
    timeline.to(
      item.clone,
      {
        x: 0,
        y: 0,
        scale: 1,
        rotation: item.rot,
        duration: 0.85,
        ease: 'power3.out',
        onComplete: () => {
          gsap.set(item.el, { autoAlpha: 1 })
          item.clone.remove()
        },
      },
      outAt + index * 0.06
    )
  })

  // 4) a pasta vazia sai pela esquerda
  timeline.to(carry, { xPercent: -120, duration: 0.5, ease: 'power3.in' }, endAt - 0.2)
}

/**
 * Chegando na ficha: a pasta Devit entra pela esquerda fechada, a capa abre e
 * tudo que está sobre a mesa sai de dentro dela, crescendo até o seu lugar.
 * `delay` espera a transição anterior (voo ou névoa) terminar de se dissolver.
 */
export function deployDossier(delay = 0) {
  const all = Array.from(document.querySelectorAll<HTMLElement>(DOSSIER_PIECES))
  const parts = carryParts()

  if (!parts || isReduced()) {
    gsap.set(all, { clearProps: 'all' })

    return
  }

  const { carry, front, inside } = parts
  carry.classList.add('is-active')
  inside.innerHTML = ''

  const rest = carryRest(carry)
  gsap.set(front, { rotationX: 0 }) // chega fechada

  // as cópias já esperam dentro da pasta; as peças reais ficam invisíveis
  const pieces = dossierPieces()
  gsap.set(all, { autoAlpha: 0 })

  const items = pieces.map((element) => carryClone(element, rest, inside))
  stackClonesInside(items, rest)
  gsap.set(carry, { xPercent: -120 })

  deployTimeline(parts, items, all, delay)
}
