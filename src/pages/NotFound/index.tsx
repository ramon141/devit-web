import { ArrowLeftIcon, HomeIcon, SearchXIcon } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Auth } from '@/auth'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'
import { OwnerPortalAuth } from '@/lib/ownerPortalAuth'

type HomeTarget = {
  to: string
  labelKey: string
}

function getHomeTarget(pathname: string): HomeTarget {
  if (Auth.isAuthenticated()) {
    return { to: CRM_BASE_PATH, labelKey: 'notFound.goDashboard' }
  }

  if (OwnerPortalAuth.isAuthenticated()) {
    return { to: '/area-proprietari', labelKey: 'notFound.goOwnerArea' }
  }

  if (pathname.startsWith(CRM_BASE_PATH)) {
    return { to: `${CRM_BASE_PATH}/login`, labelKey: 'notFound.goLogin' }
  }

  return { to: '/', labelKey: 'notFound.goSite' }
}

function NotFound() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const home = getHomeTarget(pathname)

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-background px-6 text-center">
      <div className="pointer-events-none absolute size-[480px] rounded-full bg-accent blur-3xl" />

      <div className="relative flex items-center gap-3 text-[9rem] font-bold leading-none tracking-tight text-foreground sm:text-[12rem]">
        <span>4</span>

        <span className="flex size-28 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg sm:size-40">
          <SearchXIcon className="size-14 sm:size-20" />
        </span>

        <span>4</span>
      </div>

      <div className="relative flex flex-col gap-2">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          {t('notFound.title')}
        </h1>

        <p className="max-w-md text-muted-foreground">
          {t('notFound.message')}
        </p>
      </div>

      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeftIcon data-icon="inline-start" />
          {t('notFound.back')}
        </Button>

        <Button nativeButton={false} render={<Link to={home.to} />}>
          <HomeIcon data-icon="inline-start" />
          {t(home.labelKey)}
        </Button>
      </div>
    </section>
  )
}

export default NotFound
