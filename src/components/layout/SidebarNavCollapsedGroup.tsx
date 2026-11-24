import { useState } from 'react'
import type { ReactElement } from 'react'
import { NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { NavItem } from '@/components/layout/nav-items'

type SidebarNavCollapsedGroupProps = {
  item: NavItem
  trigger: ReactElement
  onNavigate?: () => void
}

// Sidebar recolhida: ao passar o mouse no ícone abre o submenu ao lado
function SidebarNavCollapsedGroup({
  item,
  trigger,
  onNavigate,
}: SidebarNavCollapsedGroupProps) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)

  function handleNavigate() {
    setOpen(false)
    onNavigate?.()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger openOnHover delay={50} closeDelay={150} render={trigger} />
      <PopoverContent side="right" align="start" sideOffset={12} className="w-56 gap-1 p-2">
        <span className="px-2 py-1 text-xs font-medium text-muted-foreground">
          {t(item.label)}
        </span>

        {item.children?.map((child) => (
          <NavLink
            key={child.path}
            to={child.path}
            end
            onClick={handleNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              )
            }
          >
            <child.icon className="size-4 shrink-0" />
            {t(child.label)}
          </NavLink>
        ))}
      </PopoverContent>
    </Popover>
  )
}

export default SidebarNavCollapsedGroup
