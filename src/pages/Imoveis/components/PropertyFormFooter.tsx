import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, SaveIcon, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePropertySaveMode } from '@/pages/Imoveis/contexts/PropertySaveModeContext'

type PropertyFormFooterProps = {
  isSubmitting: boolean
  id?: string
  onBack?: () => void
  isLast?: boolean
  finishLabelKey?: string
}

// Rodapé do wizard: salva a aba atual e avança para a próxima
function PropertyFormFooter({
  isSubmitting,
  id,
  onBack,
  isLast,
  finishLabelKey = 'formFields.finish',
}: PropertyFormFooterProps) {
  const { t } = useTranslation('imoveis')
  const navigate = useNavigate()
  const saveMode = usePropertySaveMode()

  return (
    <div id={id} className="flex shrink-0 justify-center gap-2 border-t bg-background p-4">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/gestionale/proprieta')}
      >
        <XIcon data-icon="inline-start" />
        {t('formFields.cancel')}
      </Button>

      {onBack && (
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeftIcon data-icon="inline-start" />
          {t('formFields.back')}
        </Button>
      )}

      {saveMode && !isLast && (
        <Button
          type="submit"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => {
            saveMode.stayRef.current = true
          }}
        >
          <SaveIcon data-icon="inline-start" />
          {t('formFields.finish')}
        </Button>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        onClick={() => {
          if (saveMode) saveMode.stayRef.current = false
        }}
      >
        {isLast ? (
          <>
            <CheckIcon data-icon="inline-start" />
            {t(finishLabelKey)}
          </>
        ) : (
          <>
            {t('formFields.next')}
            <ArrowRightIcon data-icon="inline-end" />
          </>
        )}
      </Button>
    </div>
  )
}

export default PropertyFormFooter
