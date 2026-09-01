import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DropCapHeading from '@/pages/Site/components/DropCapHeading'
import { ownerPortalApi, OwnerPortalAuth } from '@/lib/ownerPortalAuth'

function AreaProprietariLogin() {
  const { t } = useTranslation('site')
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (OwnerPortalAuth.isAuthenticated()) return <Navigate to="/area-proprietari" replace />

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const { data } = await ownerPortalApi.post<{ token: string }>('/owner-portal/login', {
        email,
        pin,
      })
      OwnerPortalAuth.setToken(data.token)
      navigate('/area-proprietari')
    } catch {
      setError(t('areaProprietari.login.invalidCredentials'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-muted/40 py-16">
      <div className="mx-auto max-w-sm px-4">
        <DropCapHeading as="h1" text={t('areaProprietari.login.title')} className="text-2xl font-bold" />
        <p className="mt-2 text-muted-foreground">{t('areaProprietari.login.intro')}</p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4 rounded-xl bg-card p-6 shadow-sm">
          <div>
            <Label htmlFor="owner-email">{t('areaProprietari.login.emailLabel')}</Label>
            <Input
              id="owner-email"
              type="email"
              required
              className="mt-1.5"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="owner-pin">{t('areaProprietari.login.pinLabel')}</Label>
            <Input
              id="owner-pin"
              type="password"
              inputMode="numeric"
              required
              className="mt-1.5"
              value={pin}
              onChange={(event) => setPin(event.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {t('areaProprietari.login.submit')}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AreaProprietariLogin
