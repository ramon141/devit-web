import { useFormState } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useUserControllerFind } from '@/api/generated/api'
import ModalRegister from '@/components/ModalRegister'
import FormModalFooter from '@/components/FormModalFooter'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import ControlledTextarea from '@/components/ControlledTextarea'
import ControlledSelectField from '@/components/ControlledSelectField'
import { formatBroker } from '@/utils/formatBroker'
import { useTransferBroker } from '@/pages/Imoveis/hooks/useTransferBroker'

type PropertyTransferBrokerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  propertyId: string
  currentBrokerId?: string | null
}

// Só a gestão abre este modal: troca o responsável com motivo obrigatório
function PropertyTransferBrokerModal({
  open,
  onOpenChange,
  propertyId,
  currentBrokerId,
}: PropertyTransferBrokerModalProps) {
  const { t } = useTranslation('imoveis')
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } }, { query: { enabled: open } })
  const { form, isSubmitting, onSubmit } = useTransferBroker({
    open,
    propertyId,
    onSaved: () => onOpenChange(false),
  })
  const { errors } = useFormState({ control: form.control })

  const brokerOptions = (users ?? []).flatMap((user) =>
    user.id && user.id !== currentBrokerId && user.active !== false
      ? [{ value: user.id, label: formatBroker(user) }]
      : [],
  )

  return (
    <ModalRegister
      open={open}
      onOpenChange={onOpenChange}
      title={t('broker.transfer.title')}
      description={t('broker.transfer.description')}
    >
      <form onSubmit={onSubmit} className="grid w-full gap-4">
        <ControlledSelectField
          control={form.control}
          name="newBrokerId"
          label={t('broker.transfer.newBroker')}
          placeholder={t('broker.transfer.newBrokerPlaceholder')}
          options={brokerOptions}
          error={errors.newBrokerId?.message}
          required
        />

        <FormFieldWrapper label={t('broker.transfer.reason')} error={errors.reason?.message} required>
          <ControlledTextarea control={form.control} name="reason" rows={3} />
        </FormFieldWrapper>

        <FormModalFooter
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          submitLabel={t('broker.transfer.confirm')}
        />
      </form>
    </ModalRegister>
  )
}

export default PropertyTransferBrokerModal
