import { PlusIcon, SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type ListToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  onNewClick?: () => void
  newLabel?: string
}

// Barra padrão de busca + botão "Nuovo" usada em toda tela de listagem
function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Cerca...',
  onNewClick,
  newLabel = 'Nuovo',
}: ListToolbarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9"
        />
      </div>

      {onNewClick && (
        <Button onClick={onNewClick} className="gap-1.5">
          <PlusIcon className="size-4" />
          {newLabel}
        </Button>
      )}
    </div>
  )
}

export default ListToolbar
