import { useEffect, useRef, useState, type VideoHTMLAttributes } from 'react'
import { isMobile, isReduced, isSaveData } from '@/lib/site/casa/shared'

type SiteVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'poster' | 'src' | 'children'> & {
  // nome do arquivo em /video, sem sufixo: gera name-720/name-1080 em webm
  name: string
  poster: string
  // só baixa quando o vídeo se aproxima da tela
  lazy?: boolean
  // vídeo configurado no gestionale (webm), tem prioridade sobre o padrão
  customSrc?: string | null
}

// Vídeo do site: Só WebM, versão menor no celular, e sem
// baixar nada com economia de dados ou pedido de menos movimento (fica o poster)
function SiteVideo({ name, poster, lazy = false, customSrc, ...rest }: SiteVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [visible, setVisible] = useState(!lazy)
  const skip = isReduced() || isSaveData()
  const size = isMobile() ? '720' : '1080'

  useEffect(() => {
    const video = ref.current
    if (!lazy || visible || !video) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setVisible(true)
      },
      { rootMargin: '300px' },
    )

    observer.observe(video)

    return () => observer.disconnect()
  }, [lazy, visible])

  return (
    <video key={customSrc ?? size} ref={ref} poster={poster} {...rest} autoPlay={!skip && rest.autoPlay}>
      {visible && !skip && customSrc ? <source src={customSrc} type="video/webm" /> : null}
      {visible && !skip ? <source src={`/video/${name}-${size}.webm`} type="video/webm" /> : null}
    </video>
  )
}

export default SiteVideo
