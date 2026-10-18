import { useState } from 'react'
import type { ReactNode } from 'react'
import { Trash2Icon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ConfirmPopup from '@/components/ConfirmPopup'
import { Button } from '@/components/ui/button'

type ConfirmDeleteButtonProps = {
  name: string
  onConfirm: () => void
  icon?: ReactNode
  className?: string
}

// Botão de lixeira que só executa a exclusão depois de confirmada no popup
function ConfirmDeleteButton({ name, onConfirm, icon, className }: ConfirmDeleteButtonProps) {
  const { t } = useTranslation('common')
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type="button" variant="ghost" size="icon-sm" className={className} onClick={() => setOpen(true)}>
        {icon ?? <Trash2Icon className="size-4 text-destructive" />}
      </Button>

      <ConfirmPopup
        open={open}
        onOpenChange={setOpen}
        title={t('attachmentListManager.deleteTitle')}
        description={t('attachmentListManager.deleteDescription', { name })}
        variant="destructive"
        confirmLabel={t('attachmentListManager.deleteConfirm')}
        onConfirm={() => {
          onConfirm()
          setOpen(false)
        }}
      />
    </>
  )
}

export default ConfirmDeleteButton
