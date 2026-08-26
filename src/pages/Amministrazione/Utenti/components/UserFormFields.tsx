import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import AvatarUpload from '@/components/AvatarUpload'
import { useBranchControllerFind } from '@/api/generated/api'
import { accessLevelOptions, type UserFormValues } from '@/pages/Amministrazione/Utenti/schemas/userSchema'

type UserFormFieldsProps = {
  form: UseFormReturn<UserFormValues>
  isEditing: boolean
  avatarFiles: File[]
  setAvatarFiles: (files: File[]) => void
  avatarUrl?: string
}

function initials(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase()
}

function UserFormFields({ form, isEditing, avatarFiles, setAvatarFiles, avatarUrl }: UserFormFieldsProps) {
  const { t } = useTranslation('amministrazione')
  const { register, control, watch } = form
  const { errors } = useFormState({ control })
  const { data: branches } = useBranchControllerFind({ filter: { order: ['name ASC'] } })
  const branchOptions = (branches ?? []).map((branch) => ({
    value: branch.id ?? '',
    label: branch.name,
  }))

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <AvatarUpload
          label={t('userFormFields.avatarLabel')}
          value={avatarFiles}
          onChange={setAvatarFiles}
          currentUrl={avatarUrl}
          fallbackText={initials(watch('fullName') ?? '')}
          hint={isEditing ? t('userFormFields.avatarHint') : undefined}
        />
      </div>

      <FormFieldWrapper label={t('userFormFields.fullNameLabel')} required error={errors.fullName?.message}>
        <Input {...register('fullName')} placeholder={t('userFormFields.fullNamePlaceholder')} />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('userFormFields.emailLabel')} required error={errors.email?.message}>
        <Input {...register('email')} type="email" placeholder={t('userFormFields.emailPlaceholder')} />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={t('userFormFields.accessLevelLabel')}
        required
        error={errors.accessLevel?.message}
      >
        <Controller
          control={control}
          name="accessLevel"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={accessLevelOptions}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label={t('userFormFields.branchLabel')} error={errors.branchId?.message}>
        <Controller
          control={control}
          name="branchId"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={branchOptions}
              placeholder={t('userFormFields.branchPlaceholder')}
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={isEditing ? t('userFormFields.passwordEditLabel') : t('userFormFields.passwordLabel')}
        required={!isEditing}
        error={errors.password?.message}
      >
        <Input {...register('password')} type="password" placeholder="••••••••" />
      </FormFieldWrapper>

      <Controller
        control={control}
        name="active"
        render={({ field }) => (
          <div className="flex items-center gap-2 self-end pb-1.5">
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            <span className="text-sm">{t('userFormFields.activeLabel')}</span>
          </div>
        )}
      />
    </div>
  )
}

export default UserFormFields
