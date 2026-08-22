import type { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'

type AppLayoutProps = {
  title: string
  description?: string
  children: ReactNode
}

function AppLayout({ title, description, children }: AppLayoutProps) {
  return (
    <div className="flex h-svh w-full overflow-hidden bg-muted/40">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} description={description} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
