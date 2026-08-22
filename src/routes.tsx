import type { ReactElement } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Componentes from '@/pages/Componentes'
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
