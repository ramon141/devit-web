import type { ReactNode } from 'react'
import AppLayout from '@/components/layout/AppLayout'

type SectionPageProps = {
  title: string
  description?: string
  parentLabel: string
  parentPath: string
  children: ReactNode
}

// Página de subitem de sidebar (ex: Amministrazione > Utenti), com breadcrumb padrão
function SectionPage({ title, description, parentLabel, parentPath, children }: SectionPageProps) {
  const breadcrumbItems =
    title === parentLabel
      ? [{ label: title }]
      : [{ label: parentLabel, path: parentPath }, { label: title }]

  return (
    <AppLayout title={title} description={description} breadcrumbItems={breadcrumbItems}>
      {children}
    </AppLayout>
  )
}

export default SectionPage
