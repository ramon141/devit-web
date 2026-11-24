import { useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { usePageHeader } from '@/contexts/PageHeaderContext'

type AppLayoutProps = {
  title: string
  description?: string
  children: ReactNode
}

// Pubblica titolo/descrizione alla Shell persistente (vedi PageHeaderContext) e
// renderizza il contenuto della pagina
function AppLayout({ title, description, children }: AppLayoutProps) {
  const { setPageHeader } = usePageHeader()

  useLayoutEffect(() => {
    setPageHeader({ title, description })
  }, [title, description, setPageHeader])

  return (
    <>
      {children}
    </>
  )
}

export default AppLayout
