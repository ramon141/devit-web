import { useSyncExternalStore } from 'react'

const query = '(min-width: 1024px)'

function subscribe(callback: () => void) {
  const mediaQuery = window.matchMedia(query)
  mediaQuery.addEventListener('change', callback)
  return () => mediaQuery.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia(query).matches
}

export function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true)
}
