import type { ReactNode } from 'react'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import DesktopLayout from '@/components/layout/DesktopLayout'
import MobileLayout from '@/components/layout/MobileLayout'

type AppLayoutProps = {
  title: string
  description?: string
  children: ReactNode
}

function AppLayout({ title, description, children }: AppLayoutProps) {
  const isDesktop = useIsDesktop()

  if (isDesktop) {
    return (
      <DesktopLayout title={title} description={description}>
        {children}
      </DesktopLayout>
    )
  }

  return <MobileLayout title={title}>{children}</MobileLayout>
}

export default AppLayout
