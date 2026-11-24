import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import Feedback from '@/pages/Clientes/Feedback'
import type { PersonWithRelations } from '@/api/generated/models'

type PersonFeedbackModalProps = {
  person: PersonWithRelations | null
  onOpenChange: (open: boolean) => void
}

// Lista os feedbacks de um cliente sem sair da listagem
function PersonFeedbackModal({ person, onOpenChange }: PersonFeedbackModalProps) {
  const { t } = useTranslation('clientes')

  return (
    <ModalRegister
      open={!!person}
      onOpenChange={onOpenChange}
      title={t('personFeedbackModal.title', { name: person?.name })}
    >
      {person?.id && <Feedback personId={person.id} hideFilters />}
    </ModalRegister>
  )
}

export default PersonFeedbackModal
