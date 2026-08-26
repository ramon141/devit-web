import { useFormState } from 'react-hook-form'
import ModalRegister from '@/components/ModalRegister'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import { useTerminateRentalContract } from '@/pages/Operazioni/Locazioni/hooks/useTerminateRentalContract'

type RentalContractTerminationModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  contractId?: string
  contractNumber?: string
}

function RentalContractTerminationModal({
  open,
  onOpenChange,
  contractId,
  contractNumber,
}: RentalContractTerminationModalProps) {
  const { form, isSubmitting, onSubmit } = useTerminateRentalContract({
    contractId,
    onTerminated: () => onOpenChange(false),
  })
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={`Rescindi contratto${contractNumber ? ` ${contractNumber}` : ''}`}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormFieldWrapper label="Data di rescissione" required error={errors.terminationDate?.message}>
          <Input {...register('terminationDate')} type="date" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Motivo" error={errors.reason?.message}>
          <Textarea {...register('reason')} rows={3} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Penale" error={errors.penaltyAmount?.message}>
          <Input {...register('penaltyAmount')} type="number" step="0.01" />
        </FormFieldWrapper>

        <FormFieldWrapper label="Richiesto da" error={errors.requestedBy?.message}>
          <Input {...register('requestedBy')} placeholder="Nome del richiedente" />
        </FormFieldWrapper>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button type="submit" variant="destructive" disabled={isSubmitting}>
            Rescindi
          </Button>
        </div>
      </form>
    </ModalRegister>
  )
}

export default RentalContractTerminationModal
