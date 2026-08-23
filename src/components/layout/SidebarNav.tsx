import { cn } from '@/lib/utils'
import { getNavItems } from '@/components/layout/nav-items'
import SidebarNavItem from '@/components/layout/SidebarNavItem'

type SidebarNavProps = {
  expanded: boolean
  onNavigate?: () => void
}

function SidebarNav({ expanded, onNavigate }: SidebarNavProps) {
  return (
    <nav className={cn('flex w-full flex-col gap-1', !expanded && 'items-center')}>
      {getNavItems().map((item) => (
        <SidebarNavItem key={item.path} item={item} expanded={expanded} onNavigate={onNavigate} />
      ))}
    </nav>
  )
}

export default SidebarNav
