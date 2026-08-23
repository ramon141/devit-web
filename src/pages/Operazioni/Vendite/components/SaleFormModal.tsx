import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import type { SaleWithRelations } from '@/api/generated/models'
import { useSaleForm } from '@/pages/Operazioni/Vendite/hooks/useSaleForm'
import SaleFormFields from '@/pages/Operazioni/Vendite/components/SaleFormFields'

type SaleFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  sale?: SaleWithRelations | null
}

function SaleFormModal({ open, onOpenChange, sale }: SaleFormModalProps) {
  const { form, isSubmitting, onSubmit } = useSaleForm({
    sale,
    onSaved: () => onOpenChange(false),
  })

  return (
    <ModalRegister open={open} onOpenChange={onOpenChange} title={sale ? 'Modifica vendita' : 'Nuova vendita'}>
      <form onSubmit={onSubmit} className="grid gap-4">
        <SaleFormFields form={form} />

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

export default SaleFormModal
