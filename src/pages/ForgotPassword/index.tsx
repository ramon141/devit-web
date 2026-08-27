import { Link } from 'react-router'
import { Loader2, MailCheck } from 'lucide-react'
import { useFormState } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import devitFavicon from '@/assets/logos/devit-favicon.png'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { useForgotPasswordForm } from '@/pages/ForgotPassword/hooks/useForgotPasswordForm'

const underlineInputClass =
  'w-full border-0 border-b-2 border-border bg-transparent pt-1 pb-2 text-sm ' +
  'text-foreground placeholder-muted-foreground/60 outline-none transition-colors duration-200 focus:border-primary'

function ForgotPassword() {
  const { t } = useTranslation('login')
  const { form, loading, error, sent, onSubmit } = useForgotPasswordForm()
  const { register, control } = form
  const { errors } = useFormState({ control })

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-muted/40 p-8">
      <div className="w-full max-w-[420px] rounded-3xl bg-card p-10 ring-1 ring-border">
        <img src={devitFavicon} alt="Devit" className="mb-6 size-12 rounded-2xl" />

        {sent ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <MailCheck className="size-10 text-primary" />
            <p className="text-sm text-muted-foreground">{t('forgotPasswordPage.sentMessage')}</p>
            <Link
              to={`${CRM_BASE_PATH}/login`}
              className="mt-4 text-sm font-semibold text-primary hover:underline"
            >
              {t('forgotPasswordPage.backToLogin')}
            </Link>
          </div>
        ) : (
          <>
            <h2 className="mb-1 text-2xl font-bold text-foreground">
              {t('forgotPasswordPage.title')}
            </h2>
            <p className="mb-8 text-sm text-muted-foreground">
              {t('forgotPasswordPage.subtitle')}
            </p>

            <form onSubmit={onSubmit} className="flex flex-col gap-7">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="mb-2 block text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                >
                  {t('desktopLoginForm.emailLabel')}
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder={t('desktopLoginForm.emailPlaceholder')}
                  aria-invalid={!!errors.email}
                  className={underlineInputClass}
                  {...register('email')}
                />
                {errors.email && (
                  <span className="mt-1.5 block text-xs text-destructive">
                    {errors.email.message}
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
                {t('forgotPasswordPage.submit')}
              </button>
            </form>

            <Link
              to={`${CRM_BASE_PATH}/login`}
              className="mt-8 block w-full text-center text-sm text-primary hover:underline"
            >
              {t('forgotPasswordPage.backToLogin')}
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
