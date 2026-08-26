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

      <div className="flex min-w-0 flex-1 flex-col px-5">
        <DesktopHeader title={title} description={description} />

        <div
          key={pathname}
          className="mb-4 flex-1 overflow-y-auto overflow-x-hidden px-1 -mx-1 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default DesktopLayout
