import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import type { PersonWithRelations } from '@/api/generated/models'
import { usePersonForm } from '@/pages/Clientes/hooks/usePersonForm'
import PersonFormFields from '@/pages/Clientes/components/PersonFormFields'

type PersonFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  person?: PersonWithRelations | null
}

function PersonFormModal({ open, onOpenChange, person }: PersonFormModalProps) {
  const { t } = useTranslation('clientes')
  const { form, isSubmitting, onSubmit } = usePersonForm({
    person,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={person ? t('personFormModal.editTitle') : t('personFormModal.newTitle')}
      description={t('personFormModal.description')}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <PersonFormFields form={form} />

        <FormModalFooter onCancel={() => onOpenChange(false)} isSubmitting={isSubmitting} />
      </form>
    </ModalRegister>
  )
}

export default PersonFormModal
