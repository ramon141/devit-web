import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type PinRevealDialogProps = {
  pin: string | null
  onClose: () => void
}

// PIN só é exibido uma vez (na criação ou reset) — nunca fica recuperável depois.
function PinRevealDialog({ pin, onClose }: PinRevealDialogProps) {
  const { t } = useTranslation('amministrazione')

  return (
    <Dialog open={!!pin} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('proprietari.pinDialog.title')}</DialogTitle>
        </DialogHeader>

        <p className="text-center text-3xl font-bold tracking-widest">{pin}</p>
        <p className="text-center text-sm text-muted-foreground">{t('proprietari.pinDialog.warning')}</p>

        <Button onClick={onClose} className="mt-2">
          {t('proprietari.pinDialog.close')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default PinRevealDialog
