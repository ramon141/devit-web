import { gsap } from 'gsap'
import { whiteOut } from './mist'
import { isReduced } from './shared'

const H264 = 'video/mp4; codecs="avc1.640028"'
const PLAYBACK_RATE = 1 // o vídeo já traz a rampa de velocidade; 1 = natural

/** Aquece o vídeo do voo (chamado no primeiro toque/hover numa pasta). */
export function warmFly() {
  const video = document.querySelector<HTMLVideoElement>('.fly-video')
  if (!video || video.preload === 'auto') return

  video.preload = 'auto'
  video.load()
}

function startVideo(video: HTMLVideoElement, onFail: () => void) {
  video.currentTime = 0
  video.defaultPlaybackRate = PLAYBACK_RATE
  video.playbackRate = PLAYBACK_RATE

  video
    .play()
    .then(() => {
      video.playbackRate = PLAYBACK_RATE
      whiteOut(0.7)
    })
    .catch(onFail)
}

/**
 * Toca o voo em tela cheia. `onNavigate` é chamado quando o vídeo passa da
 * metade (a página nova monta atrás do vídeo). Devolve uma Promise que resolve
 * no fim do vídeo, ou null se não dá para voar (sem vídeo, reduced-motion) e
 * aí quem chama usa a névoa. Um clique no vídeo pula para o fim.
 */
export function flyIn(onNavigate: () => void) {
  const fly = document.querySelector<HTMLElement>('.fly')
  const video = fly?.querySelector('video')

  if (!fly || !video || isReduced()) return null
  if (!video.canPlayType || !video.canPlayType(H264)) return null

  fly.classList.add('is-active')
  gsap.set(fly, { opacity: 1 }) // já está debaixo do branco

  return new Promise<void>((resolve) => {
    let navigated = false
    let done = false

    const navigate = () => {
      if (navigated) return

      navigated = true
      onNavigate()
    }
    const onTime = () => {
      if (video.duration && video.currentTime >= video.duration * 0.55) navigate()
    }
    const finish = () => {
      if (done) return

      done = true
      video.removeEventListener('timeupdate', onTime)
      resolve()
    }
    const skip = () => {
      navigate()
      finish()
    }
    const begin = () => {
      video.addEventListener('timeupdate', onTime)
      video.addEventListener('ended', skip, { once: true })
      startVideo(video, skip)
    }

    if (video.readyState >= 1) begin()
    else video.addEventListener('loadedmetadata', begin, { once: true })

    fly.onclick = () => {
      video.pause()
      skip()
    }

    // rede lenta: sem metadados em 2,5 s segue sem o vídeo; a 11 s nunca prende o visitante
    setTimeout(() => {
      if (video.readyState < 1) skip()
    }, 2500)
    setTimeout(skip, 11000)
  })
}

/** O vídeo se funde na página nova (cujo fundo é o último frame dele). */
export function flyOut() {
  const fly = document.querySelector<HTMLElement>('.fly')
  if (!fly || !fly.classList.contains('is-active')) return

  const video = fly.querySelector('video')
  const main = document.getElementById('main')

  gsap
    .timeline({
      onComplete: () => {
        fly.classList.remove('is-active')
        fly.onclick = null
        video?.pause()
        gsap.set(main, { clearProps: 'all' })
      },
    })
    .fromTo(main, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1)
    .to(fly, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 0.15)
}
