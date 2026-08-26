import { Controller, useFormState, type UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import FormFieldWrapper from '@/components/FormFieldWrapper'
import SelectField from '@/components/SelectField'
import FileUpload from '@/components/FileUpload'
import { useBranchControllerFind } from '@/api/generated/api'
import { accessLevelOptions, type UserFormValues } from '@/pages/Amministrazione/Utenti/schemas/userSchema'

type UserFormFieldsProps = {
  form: UseFormReturn<UserFormValues>
  isEditing: boolean
  avatarFiles: File[]
  setAvatarFiles: (files: File[]) => void
}

function UserFormFields({ form, isEditing, avatarFiles, setAvatarFiles }: UserFormFieldsProps) {
  const { register, control } = form
  const { errors } = useFormState({ control })
  const { data: branches } = useBranchControllerFind({ filter: { order: ['name ASC'] } })
  const branchOptions = (branches ?? []).map((branch) => ({
    value: branch.id ?? '',
    label: branch.name,
  }))

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FileUpload
          label="Foto profilo"
          value={avatarFiles}
          onChange={setAvatarFiles}
          accept="image/*"
          hint={isEditing ? 'Lascia vuoto per mantenere la foto attuale' : undefined}
        />
      </div>

      <FormFieldWrapper label="Nome completo" required error={errors.fullName?.message}>
        <Input {...register('fullName')} placeholder="Mario Rossi" />
      </FormFieldWrapper>

      <FormFieldWrapper label="E-mail" required error={errors.email?.message}>
        <Input {...register('email')} type="email" placeholder="mario@devit.it" />
      </FormFieldWrapper>

      <FormFieldWrapper label="Livello di accesso" required error={errors.accessLevel?.message}>
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

      <FormFieldWrapper label="Filiale" error={errors.branchId?.message}>
        <Controller
          control={control}
          name="branchId"
          render={({ field }) => (
            <SelectField
              value={field.value}
              onValueChange={field.onChange}
              options={branchOptions}
              placeholder="Nessuna filiale"
            />
          )}
        />
      </FormFieldWrapper>

      <FormFieldWrapper
        label={isEditing ? 'Nuova password (opzionale)' : 'Password'}
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
            <span className="text-sm">Utente attivo</span>
          </div>
        )}
      />
    </div>
  )
}

export default UserFormFields
