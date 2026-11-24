import { toggleBoxEndClass } from '@/lib/toggleBox'
import { useMemo } from 'react'
import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import AvatarUpload from '@/components/AvatarUpload'
import { useBranchControllerFind } from '@/api/generated/api'
import { getAccessLevelOptions, type UserFormValues } from '@/pages/Amministrazione/Utenti/schemas/userSchema'
import { BROKER_COLORS } from '@/constants/brokerColors'
import { cn } from '@/lib/utils'
import { STABLE_DATA } from '@/constants/queryOptions'

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
  const { data: branches } = useBranchControllerFind({ filter: { order: ['name ASC'] } }, STABLE_DATA)
  const accessLevelOptions = useMemo(() => getAccessLevelOptions(t), [t])
  const branchOptions = (branches ?? []).map((branch) => ({
    value: branch.id ?? '',
    label: branch.name,
  }))

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div id="modal-field-avatar" className="sm:col-span-2">
        <AvatarUpload
          label={t('userFormFields.avatarLabel')}
          value={avatarFiles}
          onChange={setAvatarFiles}
          currentUrl={avatarUrl}
          fallbackText={initials(watch('fullName') ?? '')}
          hint={isEditing ? t('userFormFields.avatarHint') : undefined}
        />
      </div>

      <FormFieldWrapper
        id="modal-field-fullName"
        label={t('userFormFields.fullNameLabel')}
        required
        error={errors.fullName?.message}
      >
        <Input {...register('fullName')} placeholder={t('userFormFields.fullNamePlaceholder')} />
      </FormFieldWrapper>

      <FormFieldWrapper
        id="modal-field-email"
        label={t('userFormFields.emailLabel')}
        required
        error={errors.email?.message}
      >
        <Input {...register('email')} type="email" placeholder={t('userFormFields.emailPlaceholder')} />
      </FormFieldWrapper>

      <FormFieldWrapper
        id="modal-field-accessLevel"
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

      <FormFieldWrapper id="modal-field-branch" label={t('userFormFields.branchLabel')} error={errors.branchId?.message}>
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

      <div className="sm:col-span-2">
        <FormFieldWrapper
          id="modal-field-calendarColor"
          label={t('userFormFields.calendarColorLabel')}
          hint={t('userFormFields.calendarColorHint')}
          error={errors.calendarColor?.message}
        >
          <Controller
            control={control}
            name="calendarColor"
            render={({ field }) => (
              <div className="flex flex-wrap items-center gap-2">
                {BROKER_COLORS.map((color) => (
                  <button
                    key={color.key}
                    type="button"
                    aria-label={t(`brokerColors.${color.key}`)}
                    title={t(`brokerColors.${color.key}`)}
                    onClick={() => field.onChange(field.value === color.value ? '' : color.value)}
                    className={cn(
                      'size-6 rounded-full ring-2 ring-offset-2 ring-offset-background',
                      field.value === color.value ? 'ring-foreground' : 'ring-transparent',
                    )}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            )}
          />
        </FormFieldWrapper>
      </div>

      <FormFieldWrapper
        id="modal-field-password"
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
          <label id="modal-field-active" className={toggleBoxEndClass}>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
            <span className="text-sm">{t('userFormFields.activeLabel')}</span>
          </label>
        )}
      />
    </div>
  )
}

export default UserFormFields
