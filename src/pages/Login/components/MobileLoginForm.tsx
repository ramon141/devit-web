import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useFormState, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { LoginFormValues } from '@/pages/Login/schemas/loginSchema'
import { MobileEmailField, MobilePasswordField } from '@/pages/Login/components/MobileFormFields'

type MobileLoginFormProps = {
  form: UseFormReturn<LoginFormValues>
  onSubmit: () => void
  loading: boolean
  error?: string
}

function MobileLoginForm({ form, onSubmit, loading, error }: MobileLoginFormProps) {
  const { t } = useTranslation('login')
  const [showPassword, setShowPassword] = useState(false)
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <form onSubmit={onSubmit} className="w-full">
      <MobileEmailField register={register} error={errors.email} />
      <MobilePasswordField
        register={register}
        error={errors.password}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((value) => !value)}
      />

      {error && (
        <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-primary bg-transparent py-3.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-primary/10 disabled:opacity-50"
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {t('mobileLoginForm.submit')}
      </button>
    </form>
  )
}

export default MobileLoginForm
