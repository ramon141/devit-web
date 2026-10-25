import { createContext, useContext } from 'react'
import type { MutableRefObject } from 'react'

// Só existe na edição: o botão "Salvar" marca que a etapa deve continuar
// aberta depois de gravar, em vez de avançar para a próxima
export type PropertySaveModeContextValue = {
  stayRef: MutableRefObject<boolean>
}

export const PropertySaveModeContext = createContext<PropertySaveModeContextValue | undefined>(
  undefined
)

export function usePropertySaveMode() {
  return useContext(PropertySaveModeContext)
}
