import { useMemo, useState, type ReactNode } from 'react'
import {
  emptyPropertyDraft,
  PropertyDraftContext,
  type PropertyDraft,
  type PropertyDraftContextValue,
} from '@/pages/Imoveis/contexts/PropertyDraftContext'

export function PropertyDraftProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<PropertyDraft>(emptyPropertyDraft)

  const value = useMemo<PropertyDraftContextValue>(
    () => ({
      draft,
      setDraftBlock: (key, blockValue) => setDraft((current) => ({ ...current, [key]: blockValue })),
      resetDraft: () => setDraft(emptyPropertyDraft),
    }),
    [draft]
  )

  return <PropertyDraftContext.Provider value={value}>{children}</PropertyDraftContext.Provider>
}

