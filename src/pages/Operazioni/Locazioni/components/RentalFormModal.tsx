import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import type { RentalContractWithRelations } from '@/api/generated/models'
import { useRentalContractForm } from '@/pages/Operazioni/Locazioni/hooks/useRentalContractForm'
import RentalFormFields from '@/pages/Operazioni/Locazioni/components/RentalFormFields'

type RentalFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract?: RentalContractWithRelations | null
}

function RentalFormModal({ open, onOpenChange, contract }: RentalFormModalProps) {
  const { form, isSubmitting, onSubmit } = useRentalContractForm({
    contract,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={contract ? 'Modifica contratto' : 'Nuovo contratto'}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <RentalFormFields form={form} />

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

export default RentalFormModal
