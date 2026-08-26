import { useFormState } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
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
  const { t } = useTranslation('operazioni')
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
      title={`${t('locazioni.renewModal.title')}${contractNumber ? ` ${contractNumber}` : ''}`}
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormFieldWrapper
          label={t('locazioni.renewModal.newEndDateLabel')}
          required
          error={errors.newEndDate?.message}
        >
          <Input {...register('newEndDate')} type="date" />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('locazioni.renewModal.newAmountLabel')}
          error={errors.newAmount?.message}
        >
          <Input
            {...register('newAmount')}
            type="number"
            step="0.01"
            placeholder={t('locazioni.renewModal.newAmountPlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('locazioni.renewModal.noteLabel')} error={errors.note?.message}>
          <Textarea {...register('note')} rows={3} />
        </FormFieldWrapper>

        <FormModalFooter
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          submitLabel={t('locazioni.renewModal.submitLabel')}
        />
      </form>
    </ModalRegister>
  )
}

export default RentalRenewModal
