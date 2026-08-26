import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import { getPersonRoleOptions, type PersonFormValues } from '@/pages/Clientes/schemas/personSchema'

type PersonFormFieldsProps = {
  form: UseFormReturn<PersonFormValues>
}

function PersonFormFields({ form }: PersonFormFieldsProps) {
  const { t } = useTranslation('clientes')
  const { register, control } = form
  const { errors } = useFormState({ control })
  const personRoleOptions = getPersonRoleOptions(t)

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormFieldWrapper
        label={t('personFormFields.name')}
        required
        error={errors.name?.message}
      >
        <Input
          {...register('name')}
          placeholder={t('personFormFields.namePlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('personFormFields.role')}
        required
        error={errors.role?.message}
      >
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={personRoleOptions}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('personFormFields.email')} error={errors.email?.message}>
        <Input
          {...register('email')}
          type="email"
          placeholder={t('personFormFields.emailPlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('personFormFields.birthDate')}
        error={errors.birthDate?.message}
      >
        <Input {...register('birthDate')} type="date" />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('personFormFields.phone')} error={errors.phone?.message}>
        <Input
          {...register('phone')}
          placeholder={t('personFormFields.phonePlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('personFormFields.secondaryPhone')}
        error={errors.secondaryPhone?.message}
      >
        <Input
          {...register('secondaryPhone')}
          placeholder={t('personFormFields.phonePlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('personFormFields.documentType')}
        error={errors.documentType?.message}
      >
        <Input
          {...register('documentType')}
          placeholder={t('personFormFields.documentTypePlaceholder')}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('personFormFields.documentNumber')}
        error={errors.documentNumber?.message}
      >
        <Input {...register('documentNumber')} />
      </FormFieldWrapper>

      <div className="sm:col-span-2">
        <FormFieldWrapper label={t('personFormFields.notes')} error={errors.notes?.message}>
          <Textarea {...register('notes')} rows={3} />
        </FormFieldWrapper>
      </div>

      <div className="sm:col-span-2">
        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              {t('personFormFields.active')}
            </label>
          )}
        />
      </div>

      <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
        <FormFieldWrapper label={t('personFormFields.country')} error={errors.country?.message}>
          <Input
            {...register('country')}
            placeholder={t('personFormFields.countryPlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('personFormFields.city')} error={errors.city?.message}>
          <Input
            {...register('city')}
            placeholder={t('personFormFields.cityPlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('personFormFields.region')} error={errors.region?.message}>
          <Input
            {...register('region')}
            placeholder={t('personFormFields.regionPlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('personFormFields.postalCode')}
          error={errors.postalCode?.message}
        >
          <Input
            {...register('postalCode')}
            placeholder={t('personFormFields.postalCodePlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('personFormFields.street')} error={errors.street?.message}>
          <Input
            {...register('street')}
            placeholder={t('personFormFields.streetPlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label={t('personFormFields.number')} error={errors.number?.message}>
          <Input
            {...register('number')}
            placeholder={t('personFormFields.numberPlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('personFormFields.neighborhood')}
          error={errors.neighborhood?.message}
        >
          <Input
            {...register('neighborhood')}
            placeholder={t('personFormFields.neighborhoodPlaceholder')}
          />
        </FormFieldWrapper>

        <FormFieldWrapper
          label={t('personFormFields.complement')}
          error={errors.complement?.message}
        >
          <Input
            {...register('complement')}
            placeholder={t('personFormFields.complementPlaceholder')}
          />
        </FormFieldWrapper>
      </div>
    </div>
  )
}

export default PersonFormFields
