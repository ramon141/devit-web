import { Link } from 'react-router'
import devitLogo from '@/assets/logos/devit-logo.png'
import SidebarNav from '@/components/layout/SidebarNav'

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link to="/" className="flex items-center">
          <img src={devitLogo} alt="Devit" className="h-8 w-auto" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>

      <div className="border-t border-sidebar-border p-4">
        <p className="px-3 text-xs text-sidebar-foreground/50">
          Devit Servizi Immobiliari
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
