import type { FormEvent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import PropertyFormFooter from '@/pages/Imoveis/components/PropertyFormFooter'

type PropertyStepFrameProps = {
  id: string
  children: ReactNode
  onBack?: () => void
  onNext: () => void
  isLast?: boolean
}

// Moldura das etapas sem formulário próprio: conteúdo rolável + rodapé padrão
function PropertyStepFrame({ id, children, onBack, onNext, isLast }: PropertyStepFrameProps) {
  const { t } = useTranslation('imoveis')
  const { promisePopup } = usePromisePopup()

  // Essas etapas salvam na hora; o toast confirma ao avançar
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    promisePopup(Promise.resolve(), { pending: '', success: t('formFields.saved'), error: '' })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto p-1">{children}</div>

      <PropertyFormFooter
        id={id}
        isSubmitting={false}
        onBack={onBack}
        isLast={isLast}
      />
    </form>
  )
}

export default PropertyStepFrame
