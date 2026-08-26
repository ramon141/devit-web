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
  return (
    <ComponentSection
      id="breadcrumb"
      title="Breadcrumb"
      description="Indica la posizione attuale all'interno della gerarchia delle pagine."
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/gestionale">Bacheca</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/gestionale/proprieta">Proprietà</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Villa in Parco Esclusivo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </ComponentSection>
  )
}

export default BreadcrumbSection
