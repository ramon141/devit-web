import { lazy, Suspense } from 'react'
import type { ReactElement } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { PageHeaderProvider } from '@/contexts/PageHeaderContext'
import { Auth } from '@/auth'
import { useSessionRenewal } from '@/hooks/useSessionRenewal'
import { CRM_BASE_PATH } from '@/lib/crmBasePath'

const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Login'))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/ResetPassword'))
const Componentes = lazy(() => import('@/pages/Componentes'))
const Agenda = lazy(() => import('@/pages/Agenda'))
const ClientiPage = lazy(() => import('@/pages/Clientes/page'))
const LeadsPage = lazy(() => import('@/pages/Clientes/Leads/page'))
const ClienteScheda = lazy(() => import('@/pages/Clientes/Scheda'))
const Imoveis = lazy(() => import('@/pages/Imoveis'))
const ImovelScheda = lazy(() => import('@/pages/Imoveis/Scheda'))
const Proposte = lazy(() => import('@/pages/Proposte'))
const VenditePage = lazy(() => import('@/pages/Operazioni/Vendite/page'))
const LocazioniPage = lazy(() => import('@/pages/Operazioni/Locazioni/page'))
const AdeguamentiCanonePage = lazy(() => import('@/pages/Operazioni/Locazioni/Adeguamenti/page'))
const ScadenziarioPage = lazy(() => import('@/pages/Operazioni/Locazioni/Scadenziario/page'))
const Marketing = lazy(() => import('@/pages/Marketing'))
const Statistiche = lazy(() => import('@/pages/Statistiche'))
const Notifiche = lazy(() => import('@/pages/Notifiche'))
const UtentiPage = lazy(() => import('@/pages/Amministrazione/Utenti/page'))
const FilialiPage = lazy(() => import('@/pages/Amministrazione/Filiali/page'))
const CategoriePage = lazy(() => import('@/pages/Amministrazione/Categorie/page'))
const ZonePage = lazy(() => import('@/pages/Amministrazione/Zone/page'))
const VideoHomePage = lazy(() => import('@/pages/Amministrazione/VideoHome/page'))
const AuditPage = lazy(() => import('@/pages/Amministrazione/Audit/page'))
const ProprietariPage = lazy(() => import('@/pages/Amministrazione/Proprietari/page'))
const AreaProprietariLogin = lazy(() => import('@/pages/Site/AreaProprietari/Login'))
const AreaProprietariDashboard = lazy(() => import('@/pages/Site/AreaProprietari/Dashboard'))
const Profilo = lazy(() => import('@/pages/Profilo'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Shell = lazy(() => import('@/components/layout/Shell'))
const SiteLayout = lazy(() => import('@/pages/Site/components/SiteLayout'))
const SiteHome = lazy(() => import('@/pages/Site/Home'))
const SiteProperties = lazy(() => import('@/pages/Site/Properties'))
const SitePropertyDetail = lazy(() => import('@/pages/Site/PropertyDetail'))
const SiteZones = lazy(() => import('@/pages/Site/Zones'))
const SiteZoneDetail = lazy(() => import('@/pages/Site/ZoneDetail'))
const SiteChiSiamo = lazy(() => import('@/pages/Site/ChiSiamo'))
const SiteCalendari = lazy(() => import('@/pages/Site/Calendari'))
const SiteRichieste = lazy(() => import('@/pages/Site/Richieste'))
const SiteContatti = lazy(() => import('@/pages/Site/Contatti'))
const SiteNews = lazy(() => import('@/pages/Site/News'))
const SitePrivacyCookies = lazy(() => import('@/pages/Site/PrivacyCookies'))

export type RouteConfig = {
  path: string
  element: ReactElement
}

// Sito pubblico (senza login): usa SiteLayout invece dello Shell del CRM
const siteRoutes: RouteConfig[] = [
  { path: '/', element: <SiteHome /> },
  { path: '/immobili', element: <SiteProperties /> },
  { path: '/property/:slug', element: <SitePropertyDetail /> },
  // links antigos (por id) continuam abrindo o imóvel
  { path: '/immobile/:slug', element: <SitePropertyDetail /> },
  { path: '/zone', element: <SiteZones /> },
  { path: '/zone/:zona', element: <SiteZoneDetail /> },
  { path: '/chi-siamo', element: <SiteChiSiamo /> },
  { path: '/calendari', element: <SiteCalendari /> },
  { path: '/vendita', element: <Navigate to="/immobili?contract=sale" replace /> },
  { path: '/affitto', element: <Navigate to="/immobili?contract=rent" replace /> },
  { path: '/richieste', element: <SiteRichieste /> },
  { path: '/contatti', element: <SiteContatti /> },
  { path: '/news', element: <SiteNews /> },
  { path: '/privacy-cookies', element: <SitePrivacyCookies /> },
  { path: '/area-proprietari/login', element: <AreaProprietariLogin /> },
  { path: '/area-proprietari', element: <AreaProprietariDashboard /> },
]

// Rotte del gestionale, relative a CRM_BASE_PATH (prefissate in AppRoutes)
const routes: RouteConfig[] = [
  { path: '/', element: <Home /> },
  { path: '/agenda', element: <Agenda /> },
  { path: '/clienti', element: <ClientiPage /> },
  { path: '/clienti/richieste', element: <LeadsPage /> },
  { path: '/clienti/:id', element: <ClienteScheda /> },
  { path: '/proprieta', element: <Imoveis /> },
  { path: '/proprieta/nuovo', element: <ImovelScheda /> },
  { path: '/proprieta/:id', element: <ImovelScheda /> },
  { path: '/proposte', element: <Proposte /> },
  { path: '/operazioni', element: <Navigate to={`${CRM_BASE_PATH}/operazioni/vendite`} replace /> },
  { path: '/operazioni/vendite', element: <VenditePage /> },
  { path: '/operazioni/locazioni', element: <LocazioniPage /> },
  { path: '/operazioni/adeguamenti-canone', element: <AdeguamentiCanonePage /> },
  { path: '/operazioni/scadenziario', element: <ScadenziarioPage /> },
  { path: '/marketing', element: <Marketing /> },
  { path: '/statistiche', element: <Statistiche /> },
  { path: '/notifiche', element: <Notifiche /> },
  { path: '/profilo', element: <Profilo /> },
  { path: '/amministrazione', element: <Navigate to={`${CRM_BASE_PATH}/amministrazione/utenti`} replace /> },
  { path: '/amministrazione/utenti', element: <UtentiPage /> },
  { path: '/amministrazione/filiali', element: <FilialiPage /> },
  { path: '/amministrazione/categorie', element: <CategoriePage /> },
  { path: '/amministrazione/zone', element: <ZonePage /> },
  { path: '/amministrazione/video-home', element: <VideoHomePage /> },
  { path: '/amministrazione/audit', element: <AuditPage /> },
  { path: '/amministrazione/proprietari', element: <ProprietariPage /> },
  { path: '/componenti', element: <Componentes /> },
]

function toAbsoluteCrmPath(path: string): string {
  return path === '/' ? CRM_BASE_PATH : `${CRM_BASE_PATH}${path}`
}

// Layout persistente: Sidebar/Header non rimontano più ad ogni navigazione,
// solo il contenuto dentro <Outlet/> (vedi Shell)
function PrivateRoute() {
  useSessionRenewal()

  if (!Auth.isAuthenticated()) return <Navigate to={`${CRM_BASE_PATH}/login`} replace />

  return (
    <PageHeaderProvider>
      <Suspense fallback={null}>
        <Shell />
      </Suspense>
    </PageHeaderProvider>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <Suspense fallback={null}>
      <Routes location={location}>
      <Route path={`${CRM_BASE_PATH}/login`} element={<Login />} />
      <Route path={`${CRM_BASE_PATH}/forgot-password`} element={<ForgotPassword />} />
      <Route path={`${CRM_BASE_PATH}/reset-password`} element={<ResetPassword />} />

      <Route element={<SiteLayout />}>
        {siteRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route element={<PrivateRoute />}>
        {routes.map((route) => (
          <Route key={route.path} path={toAbsoluteCrmPath(route.path)} element={route.element} />
        ))}
      </Route>

      <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
