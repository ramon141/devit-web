import type { UseFormReturn } from 'react-hook-form'
import type { LoginFormValues } from '@/pages/Login/schemas/loginSchema'
import LoginPanel from '@/pages/Login/components/LoginPanel'
import DesktopLoginForm from '@/pages/Login/components/DesktopLoginForm'

type DesktopLoginProps = {
  form: UseFormReturn<LoginFormValues>
  onSubmit: () => void
  loading: boolean
  error?: string
}

function DesktopLogin({ form, onSubmit, loading, error }: DesktopLoginProps) {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-muted/40 p-8">
      <div className="isolate flex min-h-[520px] w-full max-w-[820px] overflow-hidden rounded-3xl bg-card ring-1 ring-border">
        <LoginPanel />
        <DesktopLoginForm form={form} onSubmit={onSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default DesktopLogin
