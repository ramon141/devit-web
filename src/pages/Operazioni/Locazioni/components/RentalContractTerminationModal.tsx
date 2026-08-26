import { useFormState } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
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
  const { t } = useTranslation('operazioni')
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
      title={`${t('locazioni.terminationModal.title')}${contractNumber ? ` ${contractNumber}` : ''}`}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormFieldWrapper
          label={t('locazioni.terminationModal.terminationDateLabel')}
          required
          error={errors.terminationDate?.message}
        >
          <Input {...register('terminationDate')} type="date" />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('locazioni.terminationModal.reasonLabel')} error={errors.reason?.message}>
          <Textarea {...register('reason')} rows={3} />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('locazioni.terminationModal.penaltyLabel')}
          error={errors.penaltyAmount?.message}
        >
          <Input {...register('penaltyAmount')} type="number" step="0.01" />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('locazioni.terminationModal.requestedByLabel')}
          error={errors.requestedBy?.message}
        >
          <Input
            {...register('requestedBy')}
            placeholder={t('locazioni.terminationModal.requestedByPlaceholder')}
          />
        </FormFieldWrapper>

        <FormModalFooter
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          submitLabel={t('locazioni.terminationModal.submitLabel')}
          submitVariant="destructive"
        />
      </form>
    </ModalRegister>
  )
}

export default RentalContractTerminationModal
