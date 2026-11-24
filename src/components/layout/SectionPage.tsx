import type { ReactNode } from 'react'
import AppLayout from '@/components/layout/AppLayout'

type SectionPageProps = {
  title: string
  description?: string
  children: ReactNode
}

// Página de subitem de sidebar (ex: Amministrazione > Utenti)
function SectionPage({ title, description, children }: SectionPageProps) {
  return (
    <AppLayout title={title} description={description}>
      {children}
    </AppLayout>
  )
}

export default SectionPage
