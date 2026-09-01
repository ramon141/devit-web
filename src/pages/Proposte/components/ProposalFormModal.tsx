import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { useProposalForm } from '@/pages/Proposte/hooks/useProposalForm'
import ProposalFormFields from '@/pages/Proposte/components/ProposalFormFields'
import ProposalAttachmentsManager from '@/pages/Proposte/components/ProposalAttachmentsManager'
import ProposalBuyersManager from '@/pages/Proposte/components/ProposalBuyersManager'

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

      {proposal?.id && (
        <div className="mt-4 grid gap-4 border-t pt-4">
          <ProposalBuyersManager proposalId={proposal.id} />
          <ProposalAttachmentsManager proposalId={proposal.id} />
        </div>
      )}
    </ModalRegister>
  )
}

export default ProposalFormModal
