import type { ReactNode } from 'react'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

type RemovableRowProps = {
  onRemove: () => void
  icon?: ReactNode
  children: ReactNode
}

function RemovableRow({ onRemove, icon, children }: RemovableRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 ring-1 ring-border">
      {children}
      <Button variant="ghost" size="icon-sm" onClick={onRemove}>
        {icon ?? <XIcon className="size-4" />}
      </Button>
    </div>
  )
}

export default RemovableRow
