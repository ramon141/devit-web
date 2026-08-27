import { useState } from 'react'
import { Link } from 'react-router'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useFormState } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import devitFavicon from '@/assets/logos/devit-favicon.png'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { cn } from '@/lib/utils'
import { useResetPasswordForm } from '@/pages/ResetPassword/hooks/useResetPasswordForm'

const underlineInputClass = cn(
  'w-full border-0 border-b-2 border-border bg-transparent pt-1 pb-2 text-sm',
  'text-foreground placeholder-muted-foreground/60 outline-none transition-colors duration-200',
  'focus:border-primary'
)

function ResetPassword() {
  const { t } = useTranslation('login')
  const { form, loading, error, tokenMissing, onSubmit } = useResetPasswordForm()
  const [showPassword, setShowPassword] = useState(false)
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-muted/40 p-8">
      <div className="w-full max-w-[420px] rounded-3xl bg-card p-10 ring-1 ring-border">
        <img src={devitFavicon} alt="Devit" className="mb-6 size-12 rounded-2xl" />

        {tokenMissing ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-destructive">{t('resetPasswordPage.tokenMissing')}</p>
            <Link
              to={`${CRM_BASE_PATH}/forgot-password`}
              className="mt-2 text-sm font-semibold text-primary hover:underline"
            >
              {t('forgotPasswordPage.title')}
            </Link>
          </div>
        ) : (
          <>
            <h2 className="mb-1 text-2xl font-bold text-foreground">
              {t('resetPasswordPage.title')}
            </h2>
            <p className="mb-8 text-sm text-muted-foreground">
              {t('resetPasswordPage.subtitle')}
            </p>

            <form onSubmit={onSubmit} className="flex flex-col gap-7">
              <div>
                <label
                  htmlFor="reset-password"
                  className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  {t('resetPasswordPage.passwordLabel')}
                </label>
                <div className="relative">
                  <input
                    id="reset-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('desktopLoginForm.passwordPlaceholder')}
                    aria-invalid={!!errors.password}
                    className={cn(underlineInputClass, 'pr-8')}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-0 bottom-2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    <span className="sr-only">{t('desktopLoginForm.togglePasswordSr')}</span>
                  </button>
                </div>
                {errors.password && (
                  <span className="mt-1.5 block text-xs text-destructive">
                    {errors.password.message}
                  </span>
                )}
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {t('resetPasswordPage.passwordHint')}
                </p>
              </div>

              <div>
                <label
                  htmlFor="reset-confirm-password"
                  className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  {t('resetPasswordPage.confirmPasswordLabel')}
                </label>
                <input
                  id="reset-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('desktopLoginForm.passwordPlaceholder')}
                  aria-invalid={!!errors.confirmPassword}
                  className={underlineInputClass}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <span className="mt-1.5 block text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/85 disabled:opacity-50"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                {t('resetPasswordPage.submit')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
