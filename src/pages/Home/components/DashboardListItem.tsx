import type { ReactNode } from 'react'

type DashboardListItemProps = {
  children: ReactNode
  accentClassName?: string
}

// Linha padrão das listas da Bacheca: cartão com borda e hover suave
function DashboardListItem({ children, accentClassName }: DashboardListItemProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2.5 transition-colors hover:bg-accent/40 ${accentClassName ?? ''}`}
    >
      {children}
    </div>
  )
}

export default DashboardListItem
