import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import NotFoundState from '@/components/NotFoundState'
import { usePropertyControllerFindById } from '@/api/generated/api'
import { usePropertyForm } from '@/pages/Imoveis/hooks/usePropertyForm'
import PropertyDuplicateModal from '@/pages/Imoveis/components/PropertyDuplicateModal'
import PropertyFormFields from '@/pages/Imoveis/components/PropertyFormFields'
import { PropertySaveModeContext } from '@/pages/Imoveis/contexts/PropertySaveModeContext'
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
  const stayRef = useRef(false)
  const saveMode = useMemo(() => (isNew ? undefined : { stayRef }), [isNew])

  const { form, isSubmitting, onSubmit, duplicateInfo, closeDuplicate } = usePropertyForm({
    property,
    initialCategoryId: isNew ? (searchParams.get('categoryId') ?? undefined) : undefined,
    onSaved: (savedId) => {
      if (isNew) navigate(`/gestionale/proprieta/${savedId}`, { replace: true })
      if (stayRef.current) {
        stayRef.current = false
        return
      }

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
      <TourFab onClick={startTour} className="bottom-24 lg:right-[20.5rem] lg:bottom-6" />

      <PropertyDuplicateModal info={duplicateInfo} onClose={closeDuplicate} />

      <div className="flex h-full min-h-0 flex-col lg:-mb-16 lg:h-auto lg:flex-1">
        {notFound ? (
          <NotFoundState
            message={t('scheda.notFound')}
            backLabel={t('scheda.breadcrumbList')}
            backTo="/gestionale/proprieta"
          />
        ) : (
          <PropertySaveModeContext.Provider value={saveMode}>
            <PropertyFormFields
              form={form}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              propertyId={property?.id}
              property={property}
              responsibleBrokerId={property?.responsibleBrokerId ?? undefined}
              activeTab={activeTab}
              onActiveTabChange={setActiveTab}
            />
          </PropertySaveModeContext.Provider>
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
