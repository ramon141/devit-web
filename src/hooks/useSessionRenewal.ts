import { useEffect } from 'react'
import { api } from '@/api/mutator'
import { Auth } from '@/auth'

const RENEWAL_INTERVAL_MS = 30 * 60 * 1000

// Renova o cookie de sessão enquanto o usuário mantém o gestionale aberto.
export function useSessionRenewal(): void {
  useEffect(() => {
    if (!Auth.isAuthenticated()) return

    const timer = window.setInterval(() => {
      void api.post('/auth/refresh').catch(() => undefined)
    }, RENEWAL_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [])
}
