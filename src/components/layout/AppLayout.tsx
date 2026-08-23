import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useIsDesktop } from '@/hooks/useIsDesktop'
import DesktopLayout from '@/components/layout/DesktopLayout'
import MobileLayout from '@/components/layout/MobileLayout'
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

function AppLayout({ title, description, breadcrumbItems, children }: AppLayoutProps) {
  const isDesktop = useIsDesktop()

  const content = (
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

  if (isDesktop) {
    return (
      <DesktopLayout title={title} description={description}>
        {content}
      </DesktopLayout>
    )
  }

  return <MobileLayout title={title}>{content}</MobileLayout>
}

export default AppLayout
