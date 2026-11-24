import type { ReactNode } from 'react'

type CollapsibleSectionProps = {
  open: boolean
  children: ReactNode
}

// Anima a altura (0 ↔ auto) e a opacidade; fechado fica inerte (sem foco nem cliques)
function CollapsibleSection({ open, children }: CollapsibleSectionProps) {
  const state = open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'

  return (
    <div
      inert={!open}
      className={`grid transition-all duration-300 ease-in-out ${state}`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

export default CollapsibleSection
