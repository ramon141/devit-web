import { NavLink } from 'react-router'
import { cn } from '@/lib/utils'
import { navItems } from '@/components/layout/nav-items'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type SidebarNavProps = {
  expanded: boolean
  onNavigate?: () => void
}

function SidebarNav({ expanded, onNavigate }: SidebarNavProps) {
  return (
    <nav className={cn('flex flex-col gap-1', expanded ? 'w-full' : 'items-center')}>
      {navItems.map((item) => {
        const link = (
          <NavLink
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl text-sm font-medium transition-colors',
                expanded ? 'w-full px-3 py-2.5' : 'size-11 justify-center',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )
            }
          >
            <item.icon className="size-4.5 shrink-0" />
            {expanded && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        )

        if (expanded) return <span key={item.path}>{link}</span>

        return (
          <Tooltip key={item.path}>
            <TooltipTrigger render={link} />
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </nav>
  )
}

export default SidebarNav
