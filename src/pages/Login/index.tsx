import { useIsDesktop } from '@/hooks/useIsDesktop'
import { useLoginForm } from '@/pages/Login/hooks/useLoginForm'
import DesktopLogin from '@/pages/Login/components/DesktopLogin'
import MobileLogin from '@/pages/Login/components/MobileLogin'

function Login() {
  const isDesktop = useIsDesktop()
  const { form, loading, error, onSubmit } = useLoginForm()

  if (isDesktop) {
    return <DesktopLogin form={form} onSubmit={onSubmit} loading={loading} error={error} />
  }

  return <MobileLogin form={form} onSubmit={onSubmit} loading={loading} error={error} />
}

export default Login
