import { XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'

type PinRevealDialogProps = {
  pin: string | null
  onClose: () => void
}

// PIN só é exibido uma vez (na criação ou reset) — nunca fica recuperável depois.
function PinRevealDialog({ pin, onClose }: PinRevealDialogProps) {
  const { t } = useTranslation('amministrazione')

  return (
    <ModalRegister
      open={!!pin}
      onOpenChange={(open) => !open && onClose()}
      title={t('proprietari.pinDialog.title')}
    >
        <p className="text-center text-3xl font-bold tracking-widest">{pin}</p>
        <p className="text-center text-sm text-muted-foreground">{t('proprietari.pinDialog.warning')}</p>

        <Button onClick={onClose} className="mt-2 w-full">
          <XIcon data-icon="inline-start" />
          {t('proprietari.pinDialog.close')}
        </Button>
    </ModalRegister>
  )
}

export default PinRevealDialog
