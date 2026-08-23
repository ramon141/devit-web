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
import Marketing from '@/pages/Marketing'
import Statistiche from '@/pages/Statistiche'
import Notifiche from '@/pages/Notifiche'
import UtentiPage from '@/pages/Amministrazione/Utenti/page'
import FilialiPage from '@/pages/Amministrazione/Filiali/page'
import CategoriePage from '@/pages/Amministrazione/Categorie/page'
import BannerPage from '@/pages/Amministrazione/Banner/page'
import AuditPage from '@/pages/Amministrazione/Audit/page'
import NotFound from '@/pages/NotFound'
import { Auth } from '@/auth'

export type RouteConfig = {
  path: string
  element: ReactElement
  isPrivate?: boolean
}

const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Home />,
    isPrivate: true,
  },
  {
    path: '/login',
    element: <Login />,
    isPrivate: false,
  },
  {
    path: '/agenda',
    element: <Agenda />,
    isPrivate: true,
  },
  {
    path: '/clienti',
    element: <ClientiPage />,
    isPrivate: true,
  },
  {
    path: '/clienti/richieste',
    element: <LeadsPage />,
    isPrivate: true,
  },
  {
    path: '/clienti/:id',
    element: <ClienteScheda />,
    isPrivate: true,
  },
  {
    path: '/proprieta',
    element: <Imoveis />,
    isPrivate: true,
  },
  {
    path: '/proprieta/nuovo',
    element: <ImovelScheda />,
    isPrivate: true,
  },
  {
    path: '/proprieta/:id',
    element: <ImovelScheda />,
    isPrivate: true,
  },
  {
    path: '/proposte',
    element: <Proposte />,
    isPrivate: true,
  },
  {
    path: '/operazioni',
    element: <Navigate to="/operazioni/vendite" replace />,
    isPrivate: true,
  },
  {
    path: '/operazioni/vendite',
    element: <VenditePage />,
    isPrivate: true,
  },
  {
    path: '/operazioni/locazioni',
    element: <LocazioniPage />,
    isPrivate: true,
  },
  {
    path: '/marketing',
    element: <Marketing />,
    isPrivate: true,
  },
  {
    path: '/statistiche',
    element: <Statistiche />,
    isPrivate: true,
  },
  {
    path: '/notifiche',
    element: <Notifiche />,
    isPrivate: true,
  },
  {
    path: '/amministrazione',
    element: <Navigate to="/amministrazione/utenti" replace />,
    isPrivate: true,
  },
  {
    path: '/amministrazione/utenti',
    element: <UtentiPage />,
    isPrivate: true,
  },
  {
    path: '/amministrazione/filiali',
    element: <FilialiPage />,
    isPrivate: true,
  },
  {
    path: '/amministrazione/categorie',
    element: <CategoriePage />,
    isPrivate: true,
  },
  {
    path: '/amministrazione/banner',
    element: <BannerPage />,
    isPrivate: true,
  },
  {
    path: '/amministrazione/audit',
    element: <AuditPage />,
    isPrivate: true,
  },
  {
    path: '/componenti',
    element: <Componentes />,
    isPrivate: true,
  },
]

function RouteComponent({ element, isPrivate }: RouteConfig) {
  if (!isPrivate) return element
  if (!Auth.isAuthenticated()) return <Navigate to="/login" replace />

  return element
}

function AppRoutes() {
  const location = useLocation()

  return (
    <Routes location={location}>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<RouteComponent {...route} />}
        />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
