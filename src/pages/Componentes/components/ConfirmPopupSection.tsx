import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import ConfirmPopup from '@/components/ConfirmPopup'
import { useConfirmPopup } from '@/hooks/useConfirmPopup'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function ConfirmPopupSection() {
  const { t } = useTranslation('componentes')
  const { open, setOpen, loading, openConfirm, withLoading } =
    useConfirmPopup()
  const [deleted, setDeleted] = useState(false)

  function handleConfirm() {
    withLoading(async () => {
      await new Promise((resolve) => setTimeout(resolve, 900))
      setDeleted(true)
    })
  }

  return (
    <ComponentSection
      id="confirm-popup"
      title={t('confirmPopup.title')}
      description={t('confirmPopup.description')}
    >
      <div className="flex items-center gap-3">
        <Button variant="destructive" onClick={openConfirm}>
          <Trash2 />
          {t('confirmPopup.deleteProperty')}
        </Button>
        {deleted && (
          <span className="text-sm text-muted-foreground">
            {t('confirmPopup.deletedMessage')}
          </span>
        )}
      </div>

      <ConfirmPopup
        open={open}
        onOpenChange={setOpen}
        variant="destructive"
        title={t('confirmPopup.confirmTitle')}
        description={t('confirmPopup.confirmDescription')}
        confirmLabel={t('confirmPopup.confirmLabel')}
        loading={loading}
        onConfirm={handleConfirm}
      />
    </ComponentSection>
  )
}

export default ConfirmPopupSection
