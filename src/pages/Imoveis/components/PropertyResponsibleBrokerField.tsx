import { type Control, type FieldErrors } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useUserControllerFind } from '@/api/generated/api'
import ControlledSelectField from '@/components/ControlledSelectField'
import { formatBroker } from '@/utils/formatBroker'
import type { PropertyFormValues } from '@/pages/Imoveis/schemas/propertySchema'

type PropertyResponsibleBrokerFieldProps = {
  control: Control<PropertyFormValues>
  errors: FieldErrors<PropertyFormValues>
}

// Só a gestão cadastra o imóvel já em nome de outro corretor; vazio = quem está cadastrando
function PropertyResponsibleBrokerField({ control, errors }: PropertyResponsibleBrokerFieldProps) {
  const { t } = useTranslation('imoveis')
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })

  const options = (users ?? []).flatMap((user) =>
    user.id && user.active !== false ? [{ value: user.id, label: formatBroker(user) }] : [],
  )

  return (
    <ControlledSelectField
      control={control}
      name="responsibleBrokerId"
      label={t('broker.label')}
      placeholder={t('broker.createPlaceholder')}
      options={options}
      error={errors.responsibleBrokerId?.message}
    />
  )
}

export default PropertyResponsibleBrokerField
