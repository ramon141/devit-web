import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type WidgetSelectionFabProps = {
  onClick: () => void
  className?: string
}

// Botão flutuante "+" que abre o modal de seleção de widgets do painel
function WidgetSelectionFab({ onClick, className }: WidgetSelectionFabProps) {
  return (
    <div className={cn('fixed right-[4.5rem] bottom-6 z-50', className)}>
      <Button size="icon-lg" className="rounded-full shadow-lg" onClick={onClick}>
        <Plus />
      </Button>
    </div>
  )
}

export default WidgetSelectionFab
