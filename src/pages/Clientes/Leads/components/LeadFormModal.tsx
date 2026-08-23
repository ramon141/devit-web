import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import type { Lead } from '@/api/generated/models'
import { useLeadForm } from '@/pages/Clientes/Leads/hooks/useLeadForm'
import LeadFormFields from '@/pages/Clientes/Leads/components/LeadFormFields'

type LeadFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null
}

function LeadFormModal({ open, onOpenChange, lead }: LeadFormModalProps) {
  const { form, isSubmitting, onSubmit } = useLeadForm({
    lead,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister open={open} onOpenChange={onOpenChange} title={lead ? 'Modifica richiesta' : 'Nuova richiesta'}>
      <form onSubmit={onSubmit} className="grid gap-4">
        <LeadFormFields form={form} />

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

export default LeadFormModal
