import { useTranslation } from 'react-i18next'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import ComponentSection from '@/pages/Componentes/components/ComponentSection'

function BreadcrumbSection() {
  const { t } = useTranslation('componentes')

  return (
    <ComponentSection
      id="breadcrumb"
      title={t('breadcrumb.title')}
      description={t('breadcrumb.description')}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/gestionale">{t('breadcrumb.dashboard')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/gestionale/proprieta">{t('breadcrumb.properties')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t('breadcrumb.currentPage')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </ComponentSection>
  )
}

export default BreadcrumbSection
