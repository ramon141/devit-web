import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNavBar from '@/components/layout/BottomNavBar'

type MobileLayoutProps = {
  title: string
  children: ReactNode
}

function MobileLayout({ title, children }: MobileLayoutProps) {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <MobileHeader title={title} />

      <main
        key={pathname}
        className="m-4 flex-1 overflow-auto rounded-2xl bg-card p-4 ring-1 ring-border animate-in fade-in slide-in-from-bottom-2 duration-300"
        style={{ marginBottom: 'calc(64px + 1rem + env(safe-area-inset-bottom))' }}
      >
        {children}
      </main>

      <BottomNavBar />
    </div>
  )
}

export default MobileLayout
