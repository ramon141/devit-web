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
import NotFoundState from '@/components/NotFoundState'
import { usePropertyControllerFindById } from '@/api/generated/api'
import { usePropertyForm } from '@/pages/Imoveis/hooks/usePropertyForm'
import PropertyBrokerHeader from '@/pages/Imoveis/components/PropertyBrokerHeader'
import PropertyDuplicateModal from '@/pages/Imoveis/components/PropertyDuplicateModal'
import PropertyRegistrationInfo from '@/pages/Imoveis/components/PropertyRegistrationInfo'
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

  const { data: property, isLoading, isError } = usePropertyControllerFindById(
    id ?? '',
    {
      filter: {
        include: [
          { relation: 'category' },
          { relation: 'address' },
          { relation: 'owner' },
          { relation: 'createdBy' },
          { relation: 'lastChangedBy' },
          { relation: 'responsibleBroker' },
        ],
      },
    },
    { query: { enabled: !isNew, retry: false } }
  )
  const notFound = !isNew && !isLoading && (isError || !property)

  const [activeTab, setActiveTab] = useState('generale')

  const { form, isSubmitting, onSubmit, duplicateInfo, closeDuplicate } = usePropertyForm({
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
      <TourFab onClick={startTour} className="bottom-24 lg:bottom-6" />

      <PropertyDuplicateModal info={duplicateInfo} onClose={closeDuplicate} />

      <div className="flex h-full min-h-0 flex-col">
        <Breadcrumb className="mb-4 shrink-0">
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

        {property && (
          <div className="mb-3 grid shrink-0 gap-2">
            <PropertyBrokerHeader property={property} />
            <PropertyRegistrationInfo property={property} />
          </div>
        )}

        {notFound ? (
          <NotFoundState
            message={t('scheda.notFound')}
            backLabel={t('scheda.breadcrumbList')}
            backTo="/gestionale/proprieta"
          />
        ) : (
          <PropertyFormFields
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            propertyId={property?.id}
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
          />
        )}
      </div>
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
