import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DropCapHeading from '@/pages/Site/components/DropCapHeading'
import { formatAmount } from '@/utils/formatAmount'
import { ownerPortalApi, OwnerPortalAuth } from '@/lib/ownerPortalAuth'

type OwnerProperty = {
  id: string
  code: string
  title: string
  purpose: string
  status: string
  salePrice?: number | null
  rentPrice?: number | null
  updatedAt: string
}

function useOwnerProperties() {
  return useQuery({
    queryKey: ['owner-portal-properties'],
    queryFn: async () => {
      const { data } = await ownerPortalApi.get<OwnerProperty[]>('/owner-portal/me/properties')
      return data
    },
  })
}

function AreaProprietariDashboard() {
  const { t } = useTranslation('site')
  const { data: properties, isLoading } = useOwnerProperties()

  if (!OwnerPortalAuth.isAuthenticated()) return <Navigate to="/area-proprietari/login" replace />

  function logout() {
    OwnerPortalAuth.removeToken()
    window.location.href = '/area-proprietari/login'
  }

  return (
    <div className="bg-muted/40 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-between">
          <DropCapHeading as="h1" text={t('areaProprietari.dashboard.title')} className="text-2xl font-bold" />
          <Button variant="outline" onClick={logout}>
            {t('areaProprietari.dashboard.logout')}
          </Button>
        </div>

        {isLoading && <p className="mt-6 text-muted-foreground">{t('areaProprietari.dashboard.loading')}</p>}

        {!isLoading && properties?.length === 0 && (
          <p className="mt-6 text-muted-foreground">{t('areaProprietari.dashboard.empty')}</p>
        )}

        <div className="mt-6 grid gap-4">
          {properties?.map((property) => (
            <div key={property.id} className="flex items-center justify-between rounded-xl bg-card p-4 shadow-sm">
              <div>
                <p className="font-medium">{property.title}</p>
                <p className="text-sm text-muted-foreground">{property.code}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {formatAmount(property.salePrice ?? property.rentPrice ?? 0)}
                </span>
                <Badge variant="secondary">{property.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AreaProprietariDashboard
