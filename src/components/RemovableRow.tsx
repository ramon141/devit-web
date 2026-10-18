import type { ReactNode } from 'react'
import { XIcon } from 'lucide-react'
import ConfirmDeleteButton from '@/components/ConfirmDeleteButton'
import { Button } from '@/components/ui/button'

type RemovableRowProps = {
  onRemove: () => void
  icon?: ReactNode
  confirmName?: string
  children: ReactNode
}

// Com confirmName, a remoção só acontece depois de confirmada num popup
function RemovableRow({ onRemove, icon, confirmName, children }: RemovableRowProps) {
  const defaultIcon = icon ?? <XIcon className="size-4" />

  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2 ring-1 ring-border">
      {children}

      {confirmName === undefined ? (
        <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove}>
          {defaultIcon}
        </Button>
      ) : (
        <ConfirmDeleteButton name={confirmName} onConfirm={onRemove} icon={defaultIcon} />
      )}
    </div>
  )
}

export default RemovableRow
