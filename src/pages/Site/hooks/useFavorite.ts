import { useState } from 'react'

const FAVORITES_KEY = 'site_favorites'

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeFavorites(ids: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
}

// ponytail: preferiti solo lato client (localStorage), niente sync con account/backend
export function useFavorite(propertyId: string) {
  const [isFavorite, setIsFavorite] = useState(() => readFavorites().includes(propertyId))

  function toggle() {
    const current = readFavorites()
    const next = current.includes(propertyId)
      ? current.filter((id) => id !== propertyId)
      : [...current, propertyId]

    writeFavorites(next)
    setIsFavorite(next.includes(propertyId))
  }

  return { isFavorite, toggle }
}
