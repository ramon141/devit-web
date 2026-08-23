import { Outlet } from 'react-router'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import { usePageHeader } from '@/contexts/PageHeaderContext'
import DesktopLayout from '@/components/layout/DesktopLayout'
import MobileLayout from '@/components/layout/MobileLayout'

// Sidebar/Header persistenti: renderizzati una sola volta per la sessione privata,
// non rimontano ad ogni navigazione (a differenza delle pagine dentro <Outlet/>)
function Shell() {
  const isDesktop = useIsDesktop()
  const { header } = usePageHeader()

  if (isDesktop) {
    return (
      <DesktopLayout title={header.title} description={header.description}>
        <Outlet />
      </DesktopLayout>
    )
  }

  return (
    <MobileLayout title={header.title}>
      <Outlet />
    </MobileLayout>
  )
}

export default Shell
