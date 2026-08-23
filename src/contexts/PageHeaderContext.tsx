import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type PageHeader = {
  title: string
  description?: string
}

type PageHeaderContextValue = {
  header: PageHeader
  setPageHeader: (header: PageHeader) => void
}

const emptyHeader: PageHeader = { title: '' }

const PageHeaderContext = createContext<PageHeaderContextValue | undefined>(undefined)

// Permette all'AppLayout (dentro delle rotte) di comunicare titolo/descrizione
// alla Shell persistente (fuori dalle rotte), senza che la Sidebar rimonti ad ogni navigazione
function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<PageHeader>(emptyHeader)

  const value = useMemo(() => ({ header, setPageHeader: setHeader }), [header])

  return <PageHeaderContext.Provider value={value}>{children}</PageHeaderContext.Provider>
}

function usePageHeader() {
  const context = useContext(PageHeaderContext)
  if (!context) throw new Error('usePageHeader deve essere usato dentro PageHeaderProvider')
  return context
}

export { PageHeaderProvider, usePageHeader }
