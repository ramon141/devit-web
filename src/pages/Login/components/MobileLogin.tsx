import type { UseFormReturn } from 'react-hook-form'
import type { LoginFormValues } from '@/pages/Login/schemas/loginSchema'
import devitLogo from '@/assets/logos/devit-logo.png'
import MobileLoginForm from '@/pages/Login/components/MobileLoginForm'

type MobileLoginProps = {
  form: UseFormReturn<LoginFormValues>
  onSubmit: () => void
  loading: boolean
  error?: string
}

function MobileLogin({ form, onSubmit, loading, error }: MobileLoginProps) {
  return (
    <div
      className="flex min-h-dvh w-full flex-col"
      style={{
        background:
          'radial-gradient(circle at center, color-mix(in oklch, var(--devit-navy), white 8%) 0%, var(--devit-navy) 100%)',
      }}
    >
      <div
        className="flex flex-1 flex-col items-center justify-center px-6"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}
      >
        <img src={devitLogo} alt="Devit" className="h-auto w-[200px]" />
      </div>

      <div
        className="rounded-t-3xl bg-card px-6 pt-8"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 32px)' }}
      >
        <MobileLoginForm form={form} onSubmit={onSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default MobileLogin
