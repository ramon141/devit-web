import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLocation, useNavigate } from 'react-router'
import {
  collectDossier,
  deployDossier,
  flyIn,
  flyOut,
  initCasa,
  mistArm,
  mistIn,
  mistOut,
  openFolder,
  warmFly,
} from '@/lib/site/casa'
import { CASA_REFRESH_EVENT } from '@/lib/site/casa/events'
import { DOSSIER_PIECES } from '@/lib/site/casa/shared'
import { PROPERTY_PATH } from '@/lib/site/paths'

type Pending = null | 'mist' | Promise<void>

const LANDING = '/vendi-con-noi'
const SAFETY_MS = 12500

// dossiê já entregue: initCasa esconde as peças de novo, então é preciso mostrá-las
function showDossier() {
  if (document.querySelector(DOSSIER_PIECES)) {
    gsap.set(DOSSIER_PIECES, { clearProps: 'opacity,visibility' })
  }
}

function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// a pasta inteira é clicável: um clique em qualquer ponto dela vale pelo link do título
function findLink(event: MouseEvent) {
  const target = event.target as Element
  const card = target.closest('[data-card]')

  return target.closest('a') ?? card?.querySelector<HTMLAnchorElement>('a.folder-link') ?? null
}

function isPlainClick(event: MouseEvent) {
  const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey

  return !event.defaultPrevented && event.button === 0 && !modified
}

function internalUrl(link: HTMLAnchorElement) {
  const href = link.getAttribute('href')
  const opensElsewhere = link.target === '_blank' || link.hasAttribute('download')

  if (opensElsewhere || !href || !href.startsWith('/') || href.startsWith('//')) return null

  const url = new URL(link.href, location.href)
  const samePage = url.pathname === location.pathname && url.search === location.search

  return samePage ? null : url
}

/**
 * Liga o movimento (lib/site/casa) a cada troca de rota e cuida das transições:
 * um clique numa pasta de imóvel abre a pasta e faz o voo (vídeo) até a ficha;
 * qualquer outro link interno passa pela névoa. A navegação do router acontece
 * atrás da transição. Não renderiza nada.
 */
function HouseLights() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const navigating = useRef<Pending>(null)

  // qualquer troca de página (rota ou query: paginação, filtros, ordem) volta ao topo
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  // página nova montada: fecha a transição que estava aberta
  useEffect(() => {
    let cleanup = initCasa()
    let deployPending = false
    let deployDelay = 0.15

    const deployIfDossier = () => {
      if (!document.querySelector('.dossier')) {
        deployPending = true

        return
      }

      deployPending = false
      deployDossier(deployDelay)
    }

    const pending = navigating.current
    navigating.current = null

    if (pending === 'mist') {
      mistOut()
      deployDelay = 0.5
      deployIfDossier()
    } else if (pending) {
      deployDelay = 0.55
      pending.then(() => {
        flyOut()
        deployIfDossier()
      })
    } else {
      deployIfDossier()
    }

    // conteúdo assíncrono montou: reinicia revelações e, se preciso, o dossiê
    const refresh = () => {
      cleanup()
      cleanup = initCasa()

      if (deployPending) deployIfDossier()
      else showDossier()
    }

    window.addEventListener(CASA_REFRESH_EVENT, refresh)

    return () => {
      window.removeEventListener(CASA_REFRESH_EVENT, refresh)
      cleanup()
    }
  }, [pathname])

  useEffect(() => {
    const go = (url: URL) => navigate(url.pathname + url.search)

    const safety = () =>
      setTimeout(() => {
        const pending = navigating.current
        if (!pending) return

        navigating.current = null
        if (pending === 'mist') mistOut()
        else flyOut()
      }, SAFETY_MS)

    // 1) pasta de imóvel: a pasta vem para a tela, branco, e o voo começa na névoa
    const openProperty = (card: Element, url: URL) => {
      openFolder(card).then(() => {
        const flight = flyIn(() => {
          if (navigating.current) return

          navigating.current = flight ?? 'mist'
          go(url)
        })

        if (flight) {
          safety()

          return
        }

        mistArm()
        navigating.current = 'mist'
        go(url)
        safety()
      })
    }

    const leave = (url: URL) => {
      if (url.pathname.startsWith(LANDING)) {
        location.href = url.href

        return
      }

      navigating.current = 'mist'
      go(url)
      safety()
    }

    // 2) saindo da ficha: tudo se recolhe na pasta; 3) qualquer outro link: a névoa
    const closeAndLeave = (url: URL) => {
      collectDossier().then((collected) => {
        if (collected) {
          mistArm()
          leave(url)

          return
        }

        mistIn().then(() => leave(url))
      })
    }

    const onClick = (event: MouseEvent) => {
      if (!isPlainClick(event) || isReducedMotion()) return

      const link = findLink(event)
      const url = link ? internalUrl(link) : null
      if (!link || !url) return

      // fase de captura + stopPropagation: o <Link> do router não chega a ver o clique
      event.preventDefault()
      event.stopPropagation()

      // mesma rota (paginação, filtros, ordem): sem névoa, só troca a query
      if (url.pathname === location.pathname) {
        go(url)

        return
      }

      const card = link.closest('[data-card]')
      const isLanding = url.pathname.startsWith(LANDING)

      if (card && PROPERTY_PATH.test(url.pathname) && !isLanding) openProperty(card, url)
      else closeAndLeave(url)
    }

    // aquece o vídeo do voo assim que o visitante se aproxima de uma pasta
    const warm = (event: Event) => {
      if ((event.target as Element).closest?.('[data-card]')) warmFly()
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('pointerenter', warm, true)
    document.addEventListener('touchstart', warm, { capture: true, passive: true })

    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('pointerenter', warm, true)
      document.removeEventListener('touchstart', warm, true)
    }
  }, [navigate])

  return null
}

export default HouseLights
