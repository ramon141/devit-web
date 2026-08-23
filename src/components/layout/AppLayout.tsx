import { useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { usePageHeader } from '@/contexts/PageHeaderContext'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export type BreadcrumbEntry = {
  label: string
  path?: string
}

type AppLayoutProps = {
  title: string
  description?: string
  breadcrumbItems?: BreadcrumbEntry[]
  children: ReactNode
}

// Pubblica titolo/descrizione alla Shell persistente (vedi PageHeaderContext) e
// renderizza il breadcrumb + contenuto della pagina
function AppLayout({ title, description, breadcrumbItems, children }: AppLayoutProps) {
  const { setPageHeader } = usePageHeader()

  useLayoutEffect(() => {
    setPageHeader({ title, description })
  }, [title, description, setPageHeader])

  return (
    <>
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumb className="mb-4 animate-in fade-in slide-in-from-top-1 duration-300">
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1

              return (
                <span key={item.label} className="contents">
                  <BreadcrumbItem>
                    {isLast || !item.path ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink render={<Link to={item.path} />}>{item.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </span>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {children}
    </>
  )
}

export default AppLayout
