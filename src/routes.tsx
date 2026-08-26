import type { ReactElement } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Componentes from '@/pages/Componentes'
import Agenda from '@/pages/Agenda'
import ClientiPage from '@/pages/Clientes/page'
import LeadsPage from '@/pages/Clientes/Leads/page'
import ClienteScheda from '@/pages/Clientes/Scheda'
import Imoveis from '@/pages/Imoveis'
import ImovelScheda from '@/pages/Imoveis/Scheda'
import Proposte from '@/pages/Proposte'
import VenditePage from '@/pages/Operazioni/Vendite/page'
import LocazioniPage from '@/pages/Operazioni/Locazioni/page'
import AdeguamentiCanonePage from '@/pages/Operazioni/Locazioni/Adeguamenti/page'
import ScadenziarioPage from '@/pages/Operazioni/Locazioni/Scadenziario/page'
import RegistrazioniPage from '@/pages/Operazioni/Locazioni/Registrazioni/page'
import Marketing from '@/pages/Marketing'
import Statistiche from '@/pages/Statistiche'
import Notifiche from '@/pages/Notifiche'
import UtentiPage from '@/pages/Amministrazione/Utenti/page'
import FilialiPage from '@/pages/Amministrazione/Filiali/page'
import CategoriePage from '@/pages/Amministrazione/Categorie/page'
import BannerPage from '@/pages/Amministrazione/Banner/page'
import AuditPage from '@/pages/Amministrazione/Audit/page'
import Profilo from '@/pages/Profilo'
import NotFound from '@/pages/NotFound'
import Shell from '@/components/layout/Shell'
import { PageHeaderProvider } from '@/contexts/PageHeaderContext'
import { Auth } from '@/auth'

export type RouteConfig = {
  path: string
  element: ReactElement
}

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
  { path: '/operazioni', element: <Navigate to="/operazioni/vendite" replace /> },
  { path: '/operazioni/vendite', element: <VenditePage /> },
  { path: '/operazioni/locazioni', element: <LocazioniPage /> },
  { path: '/operazioni/adeguamenti-canone', element: <AdeguamentiCanonePage /> },
  { path: '/operazioni/scadenziario', element: <ScadenziarioPage /> },
  { path: '/operazioni/registrazioni', element: <RegistrazioniPage /> },
  { path: '/marketing', element: <Marketing /> },
  { path: '/statistiche', element: <Statistiche /> },
  { path: '/notifiche', element: <Notifiche /> },
  { path: '/profilo', element: <Profilo /> },
  { path: '/amministrazione', element: <Navigate to="/amministrazione/utenti" replace /> },
  { path: '/amministrazione/utenti', element: <UtentiPage /> },
  { path: '/amministrazione/filiali', element: <FilialiPage /> },
  { path: '/amministrazione/categorie', element: <CategoriePage /> },
  { path: '/amministrazione/banner', element: <BannerPage /> },
  { path: '/amministrazione/audit', element: <AuditPage /> },
  { path: '/componenti', element: <Componentes /> },
]

// Layout persistente: Sidebar/Header non rimontano più ad ogni navigazione,
// solo il contenuto dentro <Outlet/> (vedi Shell)
function PrivateRoute() {
  if (!Auth.isAuthenticated()) return <Navigate to="/login" replace />

  return (
    <PageHeaderProvider>
      <Shell />
    </PageHeaderProvider>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <Routes location={location}>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
