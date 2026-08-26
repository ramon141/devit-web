import { Eye, EyeOff, User } from 'lucide-react'
import type { FieldError, UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { LoginFormValues } from '@/pages/Login/schemas/loginSchema'
import { cn } from '@/lib/utils'

const filledInputClass = cn(
  'h-[52px] w-full rounded-2xl border-0 bg-foreground/[0.06] px-4 pr-11 text-sm',
  'text-foreground outline-none placeholder:text-muted-foreground/70'
)

const mobileLabelClass = 'mb-2 block text-sm font-semibold text-foreground'

type EmailFieldProps = {
  register: UseFormRegister<LoginFormValues>
  error?: FieldError
}

export function MobileEmailField({ register, error }: EmailFieldProps) {
  const { t } = useTranslation('login')

  return (
    <div className="mb-4">
      <label htmlFor="login-email" className={mobileLabelClass}>
        {t('mobileFormFields.emailLabel')}
      </label>
      <div className="relative">
        <input
          id="login-email"
          type="email"
          placeholder={t('mobileFormFields.emailPlaceholder')}
          aria-invalid={!!error}
          className={filledInputClass}
          {...register('email')}
        />
        <User className="absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
      {error && <span className="mt-1.5 block text-xs text-destructive">{error.message}</span>}
    </div>
  )
}

type PasswordFieldProps = {
  register: UseFormRegister<LoginFormValues>
  error?: FieldError
  showPassword: boolean
  onTogglePassword: () => void
}

export function MobilePasswordField({
  register,
  error,
  showPassword,
  onTogglePassword,
}: PasswordFieldProps) {
  const { t } = useTranslation('login')

  return (
    <div className="mb-4">
      <label htmlFor="login-password" className={mobileLabelClass}>
        {t('mobileFormFields.passwordLabel')}
      </label>
      <div className="relative">
        <input
          id="login-password"
          type={showPassword ? 'text' : 'password'}
          placeholder={t('mobileFormFields.passwordPlaceholder')}
          aria-invalid={!!error}
          className={filledInputClass}
          {...register('password')}
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showPassword ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          <span className="sr-only">{t('mobileFormFields.togglePasswordSr')}</span>
        </button>
      </div>
      {error && <span className="mt-1.5 block text-xs text-destructive">{error.message}</span>}

      <div className="mt-2 flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs text-primary">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={onTogglePassword}
            className="size-3.5 accent-primary"
          />
          {t('mobileFormFields.showPassword')}
        </label>
        <button type="button" className="text-xs text-primary hover:underline">
          {t('mobileFormFields.forgotPassword')}
        </button>
      </div>
    </div>
  )
}
