import { useLocation } from 'react-router'
import ToastViewport from '@/components/ToastViewport'

// Mostra a rota atual e os avisos (toasts) para os testes conferirem
export function RouteAndToasts() {
  const location = useLocation()

  return (
    <>
      <output data-testid="route">{location.pathname}</output>
      <ToastViewport />
    </>
  )
}
