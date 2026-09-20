import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

type PropertyFormFooterProps = {
  isSubmitting: boolean
  id?: string
  onBack?: () => void
  isLast?: boolean
}

// Rodapé do wizard: salva a aba atual e avança para a próxima
function PropertyFormFooter({ isSubmitting, id, onBack, isLast }: PropertyFormFooterProps) {
  const { t } = useTranslation('imoveis')
  const navigate = useNavigate()

  return (
    <div id={id} className="flex shrink-0 justify-end gap-2 border-t bg-background p-4 pr-20">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/gestionale/proprieta')}
      >
        {t('formFields.cancel')}
      </Button>

      {onBack && (
        <Button type="button" variant="outline" onClick={onBack}>
          {t('formFields.back')}
        </Button>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isLast ? t('formFields.finish') : t('formFields.next')}
      </Button>
    </div>
  )
}

export default PropertyFormFooter
