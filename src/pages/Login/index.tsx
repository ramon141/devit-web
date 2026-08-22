import { useLoginForm } from '@/pages/Login/hooks/useLoginForm'
import LoginPanel from '@/pages/Login/components/LoginPanel'
import LoginForm from '@/pages/Login/components/LoginForm'

function Login() {
  const { form, loading, error, onSubmit } = useLoginForm()

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 p-4 md:p-8">
      <div className="isolate flex w-full max-w-[860px] flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-border md:min-h-[540px] md:flex-row">
        <LoginPanel />
        <LoginForm form={form} onSubmit={onSubmit} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default Login
