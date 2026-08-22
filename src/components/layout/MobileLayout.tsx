import type { ReactNode } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import BottomNavBar from '@/components/layout/BottomNavBar'

type MobileLayoutProps = {
  title: string
  children: ReactNode
}

function MobileLayout({ title, children }: MobileLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <MobileHeader title={title} />

      <main
        className="m-4 flex-1 overflow-auto rounded-2xl bg-card p-4 ring-1 ring-border"
        style={{ marginBottom: 'calc(64px + 1rem + env(safe-area-inset-bottom))' }}
      >
        {children}
      </main>

      <BottomNavBar />
    </div>
  )
}

export default MobileLayout
