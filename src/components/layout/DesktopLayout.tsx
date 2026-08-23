import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import Sidebar from '@/components/layout/Sidebar'
import DesktopHeader from '@/components/layout/DesktopHeader'

type DesktopLayoutProps = {
  title: string
  description?: string
  children: ReactNode
}

function DesktopLayout({ title, description, children }: DesktopLayoutProps) {
  const { pathname } = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <DesktopHeader title={title} description={description} />

        <div className="mr-4 mb-4 flex-1 overflow-hidden rounded-xl bg-card ring-1 ring-border">
          <div
            key={pathname}
            className="h-full overflow-auto p-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopLayout
