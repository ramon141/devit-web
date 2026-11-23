import { useLocation } from 'react-router'

// Mostra o endereço atual do roteador para os testes verificarem redirecionamentos.
export function LocationProbe() {
  const location = useLocation()

  return <div data-testid="location">{location.pathname}</div>
}
