import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link } from 'react-router'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { usePropertyControllerFindById } from '@/api/generated/api'
import { usePropertyForm } from '@/pages/Imoveis/hooks/usePropertyForm'
import PropertyFormFields from '@/pages/Imoveis/components/PropertyFormFields'
import { PropertyDraftProvider } from '@/pages/Imoveis/contexts/PropertyDraftProvider'
import { getNextStepValue } from '@/pages/Imoveis/schemas/propertySteps'
import {
  usePropertySchedaTour,
  PROPERTY_TAB_STEP_RANGES,
} from '@/pages/Imoveis/Scheda/hooks/usePropertySchedaTour'

function PropertyScheda() {
  const { t } = useTranslation('imoveis')
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isNew = !id

  const { data: property } = usePropertyControllerFindById(
    id ?? '',
    { filter: { include: [{ relation: 'category' }, { relation: 'address' }, { relation: 'owner' }] } },
    { query: { enabled: !isNew } }
  )

  const [activeTab, setActiveTab] = useState('generale')

  const { form, isSubmitting, onSubmit } = usePropertyForm({
    property,
    initialCategoryId: isNew ? (searchParams.get('categoryId') ?? undefined) : undefined,
    onSaved: (savedId) => {
      if (isNew) navigate(`/gestionale/proprieta/${savedId}`, { replace: true })
      setActiveTab((current) => getNextStepValue(t, current))
    },
  })

  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour } = usePropertySchedaTour()

  // Sincroniza a aba visível com o step atual do tour (equivalente a abrir um
  // modal automaticamente), já que o Joyride só aponta pra elementos já visíveis
  useEffect(() => {
    if (!run) return

    const tabForStep = Object.entries(PROPERTY_TAB_STEP_RANGES).find(
      ([, [start, end]]) => stepIndex >= start && stepIndex < end,
    )

    if (tabForStep) setActiveTab(tabForStep[0])
  }, [run, stepIndex])

  return (
    <AppLayout
      title={property?.title ?? t('scheda.pageTitle')}
      description={t('scheda.pageDescription')}
    >
      <JoyrideWrapper
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        tourKey={tourKey}
        onEvent={handleJoyrideCallback}
      />
      <TourFab onClick={startTour} />

      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/gestionale/proprieta" />}>{t('scheda.breadcrumbList')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{property?.title ?? t('scheda.pageTitle')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PropertyFormFields
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        propertyId={property?.id}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
      />
    </AppLayout>
  )
}

function PropertySchedaPage() {
  return (
    <PropertyDraftProvider>
      <PropertyScheda />
    </PropertyDraftProvider>
  )
}

export default PropertySchedaPage
