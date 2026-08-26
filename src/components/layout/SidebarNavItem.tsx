import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { NavItem } from '@/components/layout/nav-items'

type SidebarNavItemProps = {
  item: NavItem
  expanded: boolean
  onNavigate?: () => void
}

function SidebarNavItem({ item, expanded, onNavigate }: SidebarNavItemProps) {
  const location = useLocation()
  const hasChildren = !!item.children?.length
  const isChildActive = item.children?.some((child) => location.pathname === child.path) ?? false
  const [open, setOpen] = useState(isChildActive)

  useEffect(() => {
    if (isChildActive) setOpen(true)
  }, [isChildActive])

  function toggleOpen() {
    setOpen((value) => !value)
  }

  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-xl text-sm font-medium transition-colors',
      expanded ? 'w-full px-3 py-2.5' : 'size-11 justify-center',
      isActive || (hasChildren && isChildActive)
        ? 'bg-primary text-primary-foreground'
        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
    )

  if (hasChildren && expanded) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={toggleOpen}
          className={cn(
            'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
            isChildActive
              ? 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
        >
          <span className="flex items-center gap-3">
            <item.icon className="size-4.5 shrink-0" />
            <span className="whitespace-nowrap">{item.label}</span>
          </span>
          <ChevronDown className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')} />
        </button>

        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-200 ease-in-out',
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <div className="mt-1 grid gap-1 pl-8">
              {item.children?.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  end
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )
                  }
                >
                  {child.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const link = (
    <NavLink
      to={hasChildren ? (item.children?.[0]?.path ?? item.path) : item.path}
      end
      onClick={onNavigate}
      className={linkClassName}
    >
      <item.icon className="size-4.5 shrink-0" />
      {expanded && <span className="whitespace-nowrap">{item.label}</span>}
    </NavLink>
  )

  if (expanded) return link

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}

export default SidebarNavItem
