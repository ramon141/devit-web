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
  finishLabelKey?: string
  skipSavedToast?: boolean
}

// Moldura das etapas sem formulário próprio: conteúdo rolável + rodapé padrão
function PropertyStepFrame({
  id,
  children,
  onBack,
  onNext,
  isLast,
  finishLabelKey,
  skipSavedToast,
}: PropertyStepFrameProps) {
  const { t } = useTranslation('imoveis')
  const { promisePopup } = usePromisePopup()

  // Essas etapas salvam na hora; o toast confirma ao avançar
  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!skipSavedToast) {
      promisePopup(Promise.resolve(), { pending: '', success: t('formFields.saved'), error: '' })
    }

    onNext()
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto p-1">{children}</div>

      <PropertyFormFooter
        id={id}
        isSubmitting={false}
        onBack={onBack}
        isLast={isLast}
        finishLabelKey={finishLabelKey}
      />
    </form>
  )
}

export default PropertyStepFrame
