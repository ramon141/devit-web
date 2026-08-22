import type { ReactElement } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Componentes from '@/pages/Componentes'
import NotFound from '@/pages/NotFound'

export type RouteConfig = {
  path: string
  element: ReactElement
  isPrivate?: boolean
}

const routes: RouteConfig[] = [
  {
    path: '/',
    element: <Home />,
    isPrivate: false,
  },
  {
    path: '/login',
    element: <Login />,
    isPrivate: false,
  },
  {
    path: '/componenti',
    element: <Componentes />,
    isPrivate: false,
  },
]

function AppRoutes() {
  const location = useLocation()

  return (
    <Routes location={location}>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
