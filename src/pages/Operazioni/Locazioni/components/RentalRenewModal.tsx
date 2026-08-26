import { useFormState } from 'react-hook-form'
import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { useRenewRentalContract } from '@/pages/Operazioni/Locazioni/hooks/useRenewRentalContract'

type RentalRenewModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  contractId?: string
  contractNumber?: string
}

function RentalRenewModal({ open, onOpenChange, contractId, contractNumber }: RentalRenewModalProps) {
  const { form, isSubmitting, onSubmit } = useRenewRentalContract({
    contractId,
    onRenewed: () => onOpenChange(false),
  })
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={`Proroga contratto${contractNumber ? ` ${contractNumber}` : ''}`}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormFieldWrapper label="Nuova data di fine" required error={errors.newEndDate?.message}>
          <Input {...register('newEndDate')} type="date" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Nuovo valore dell'affitto" error={errors.newAmount?.message}>
          <Input
            {...register('newAmount')}
            type="number"
            step="0.01"
            placeholder="Lascia vuoto per mantenere il valore attuale"
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="Osservazione" error={errors.note?.message}>
          <Textarea {...register('note')} rows={3} />
        </FormFieldWrapper>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Proroga
          </Button>
        </div>
      </form>
    </ModalRegister>
  )
}

export default RentalRenewModal
