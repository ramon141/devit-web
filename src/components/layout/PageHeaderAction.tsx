import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { usePageHeader } from '@/contexts/PageHeaderContext'

type PageHeaderActionProps = {
  children: ReactNode
}

// Desktop: renderiza a ação dentro do section title (slot do DesktopHeader).
// Mobile: o header desktop fica oculto, então a ação aparece inline na página.
function PageHeaderAction({ children }: PageHeaderActionProps) {
  const { actionSlot } = usePageHeader()

  return (
    <>
      {actionSlot && createPortal(children, actionSlot)}
      <div className="mb-3 flex justify-end lg:hidden">{children}</div>
    </>
  )
}

export default PageHeaderAction
