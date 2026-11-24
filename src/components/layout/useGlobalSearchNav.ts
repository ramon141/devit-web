import { useCallback, useMemo, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { getNavItems } from '@/components/layout/nav-items'

const RECENTS_KEY = 'global-search-recents'
const MAX_RECENTS = 5

export type NavOption = {
  path: string
  labelKey: string
  parentKey?: string
  icon: LucideIcon
}

function readRecents(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]')

    return Array.isArray(parsed) ? parsed.filter((p): p is string => typeof p === 'string') : []
  } catch {
    return []
  }
}

// Achata o menu: itens com filhos viram uma opção por filho, com o pai como contexto
function flattenNav(): NavOption[] {
  return getNavItems().flatMap((item) =>
    item.children
      ? item.children.map((child) => ({
          path: child.path,
          labelKey: child.label,
          parentKey: item.label,
          icon: item.icon,
        }))
      : [{ path: item.path, labelKey: item.label, icon: item.icon }]
  )
}

export function useGlobalSearchNav() {
  const [recentPaths, setRecentPaths] = useState<string[]>(readRecents)
  const options = useMemo(() => flattenNav(), [])

  const pushRecent = useCallback((path: string) => {
    setRecentPaths((prev) => {
      const next = [path, ...prev.filter((p) => p !== path)].slice(0, MAX_RECENTS)

      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
      } catch {
        // ponytail: sem localStorage, recentes ficam só em memória
      }

      return next
    })
  }, [])

  const recents = recentPaths
    .map((path) => options.find((o) => o.path === path))
    .filter((o): o is NavOption => Boolean(o))

  return { options, recents, pushRecent }
}
