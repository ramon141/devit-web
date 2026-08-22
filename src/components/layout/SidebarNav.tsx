import { NavLink } from 'react-router'
import { cn } from '@/lib/utils'
import { navItems } from '@/components/layout/nav-items'

type SidebarNavProps = {
  onNavigate?: () => void
}

function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              isActive &&
                'bg-sidebar-accent text-sidebar-primary hover:text-sidebar-primary'
            )
          }
        >
          <item.icon className="size-4.5 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default SidebarNav
