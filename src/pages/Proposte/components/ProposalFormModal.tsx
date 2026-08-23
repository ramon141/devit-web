import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import type { PurchaseProposalWithRelations } from '@/api/generated/models'
import { useProposalForm } from '@/pages/Proposte/hooks/useProposalForm'
import ProposalFormFields from '@/pages/Proposte/components/ProposalFormFields'

type ProposalFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  proposal?: PurchaseProposalWithRelations | null
}

function ProposalFormModal({ open, onOpenChange, proposal }: ProposalFormModalProps) {
  const { form, isSubmitting, onSubmit } = useProposalForm({
    proposal,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={proposal ? 'Modifica proposta' : 'Nuova proposta'}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <ProposalFormFields form={form} />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Salva
          </Button>
        </div>
      </form>
    </ModalRegister>
  )
}

export default ProposalFormModal
