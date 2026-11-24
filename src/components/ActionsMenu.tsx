import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { MoreVerticalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type ActionsMenuItem = {
  label: string
  icon: ReactNode
  onClick?: () => void
  // Para itens que navegam (ex: <Link />)
  render?: ReactElement
  destructive?: boolean
  // Cor do ícone (o item pinta os descendentes no hover, por isso a variável com !)
  color?: string
}

type ActionsMenuProps = {
  items: ActionsMenuItem[]
  ariaLabel: string
}

const ITEM_CLASS = [
  'cursor-pointer gap-2 py-1.5',
  'focus:bg-accent data-highlighted:bg-accent',
].join(' ')

const TRIGGER_CLASS = [
  'cursor-pointer rounded-full transition-colors',
  'hover:bg-primary/25 aria-expanded:bg-primary/25',
].join(' ')

// Botão de três pontinhos que abre um menu com as ações da linha.
function ActionsMenu({ items, ariaLabel }: ActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={ariaLabel}
            className={TRIGGER_CLASS}
          >
            <MoreVerticalIcon className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-40">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            className={ITEM_CLASS}
            variant={item.destructive ? 'destructive' : 'default'}
            onClick={item.onClick}
            render={item.render}
          >
            <span
              className="flex **:text-(--icon-color)!"
              style={{ '--icon-color': item.color } as CSSProperties}
            >
              {item.icon}
            </span>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ActionsMenu
