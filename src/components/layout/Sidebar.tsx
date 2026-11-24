import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import devitLogo from '@/assets/logos/devit-logo.png'
import devitFavicon from '@/assets/logos/devit-favicon.png'
import SidebarNav from '@/components/layout/SidebarNav'
import { useSidebarWidth } from '@/components/layout/useSidebarWidth'
import { cn } from '@/lib/utils'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

function Sidebar() {
  const { t } = useTranslation('common')
  const {
    width,
    isCollapsed,
    isResizing,
    handleResizeMouseDown,
    toggleCollapsed,
  } = useSidebarWidth()
  const expanded = !isCollapsed

  return (
    <aside
      style={{ width }}
      className={cn(
        'relative m-4 hidden shrink-0 self-stretch rounded-2xl bg-sidebar ring-1 ring-sidebar-border lg:flex lg:flex-col',
        !isResizing && 'transition-[width] duration-300',
        expanded ? 'items-start px-3 py-5' : 'items-center py-5'
      )}
    >
      <Link to={CRM_BASE_PATH} className={cn('mb-4 flex', expanded ? 'px-2' : '')}>
        <img
          src={expanded ? devitLogo : devitFavicon}
          alt="Devit"
          className={expanded ? 'h-8 w-auto' : 'size-9 rounded-lg'}
        />
      </Link>

      <div className="thin-scrollbar w-full flex-1 overflow-y-auto">
        <SidebarNav expanded={expanded} />
      </div>

      <button
        type="button"
        onClick={toggleCollapsed}
        className="absolute top-10 -right-3 z-10 flex size-6 items-center justify-center rounded-full bg-background text-sidebar ring-1 ring-border"
      >
        {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        <span className="sr-only">
          {expanded ? t('sidebar.collapseMenu') : t('sidebar.expandMenu')}
        </span>
      </button>

      <div
        onMouseDown={handleResizeMouseDown}
        className="absolute top-0 -right-1 h-full w-2 cursor-col-resize rounded-full hover:bg-primary/40"
      />
    </aside>
  )
}

export default Sidebar
