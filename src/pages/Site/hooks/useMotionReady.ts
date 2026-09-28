import { useEffect } from 'react'
import { notifyCasaRefresh } from '@/lib/site/casa/events'

// Chame com `true` quando o conteúdo da página (vindo de query) já foi renderizado
export function useMotionReady(ready: boolean) {
  useEffect(() => {
    if (ready) notifyCasaRefresh()
  }, [ready])
}
