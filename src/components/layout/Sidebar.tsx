import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import devitLogo from '@/assets/logos/devit-logo.png'
import devitFavicon from '@/assets/logos/devit-favicon.png'
import SidebarNav from '@/components/layout/SidebarNav'
import { cn } from '@/lib/utils'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

function Sidebar() {
  const [expanded, setExpanded] = useState(true)

  return (
    <aside
      className={cn(
        'relative m-4 hidden shrink-0 self-stretch rounded-2xl bg-sidebar ring-1 ring-sidebar-border transition-all duration-300 lg:flex lg:flex-col',
        expanded ? 'w-64 items-start px-3 py-5' : 'w-20 items-center py-5'
      )}
    >
      <Link to={CRM_BASE_PATH} className={cn('mb-4 flex', expanded ? 'px-2' : '')}>
        <img
          src={expanded ? devitLogo : devitFavicon}
          alt="Devit"
          className={expanded ? 'h-8 w-auto' : 'size-9 rounded-lg'}
        />
      </Link>

      <div className="w-full flex-1 overflow-y-auto">
        <SidebarNav expanded={expanded} />
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="absolute top-10 -right-3 z-10 flex size-6 items-center justify-center rounded-full bg-background text-sidebar ring-1 ring-border"
      >
        {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        <span className="sr-only">
          {expanded ? 'Comprimi il menu' : 'Espandi il menu'}
        </span>
      </button>
    </aside>
  )
}

export default Sidebar
