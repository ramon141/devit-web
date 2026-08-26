import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { useProposalForm } from '@/pages/Proposte/hooks/useProposalForm'
import ProposalFormFields from '@/pages/Proposte/components/ProposalFormFields'

type ProposalFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  proposal?: PurchaseProposalWithRelations | null
}

function ProposalFormModal({ open, onOpenChange, proposal }: ProposalFormModalProps) {
  const { t } = useTranslation('proposte')
  const { form, isSubmitting, onSubmit } = useProposalForm({
    proposal,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={proposal ? t('formModal.editTitle') : t('formModal.newTitle')}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <ProposalFormFields form={form} />

        <FormModalFooter onCancel={() => onOpenChange(false)} isSubmitting={isSubmitting} />
      </form>
    </ModalRegister>
  )
}

export default ProposalFormModal
