import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

type PropertyFormFooterProps = {
  isSubmitting: boolean
  id?: string
}

// Rodapé do wizard: salva a aba atual e avança para a próxima
function PropertyFormFooter({ isSubmitting, id }: PropertyFormFooterProps) {
  const { t } = useTranslation('imoveis')
  const navigate = useNavigate()

  return (
    <div id={id} className="flex justify-end gap-2 sm:col-span-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/gestionale/proprieta')}
      >
        {t('formFields.cancel')}
      </Button>

      <Button type="submit" disabled={isSubmitting}>
        {t('formFields.next')}
      </Button>
    </div>
  )
}

export default PropertyFormFooter
