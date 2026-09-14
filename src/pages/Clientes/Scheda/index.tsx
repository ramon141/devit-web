import { useState } from 'react'
import { Link, useParams } from 'react-router'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { usePersonControllerFindById } from '@/api/generated/api'
import { useSchedaTour, SCHEDA_TAB_BY_STEP } from '@/pages/Clientes/Scheda/hooks/useSchedaTour'
import { useSchedaTourTabSync } from '@/pages/Clientes/Scheda/hooks/useSchedaTourTabSync'
import SchedaDati from '@/pages/Clientes/Scheda/components/SchedaDati'
import SchedaAllegati from '@/pages/Clientes/Scheda/components/SchedaAllegati'
import SchedaImmobili from '@/pages/Clientes/Scheda/components/SchedaImmobili'
import SchedaAgenda from '@/pages/Clientes/Scheda/components/SchedaAgenda'
import SchedaComunicazioni from '@/pages/Clientes/Scheda/components/SchedaComunicazioni'

function Scheda() {
  const { t } = useTranslation('clientes')
  const { id } = useParams<{ id: string }>()
  const personId = id ?? ''
  const { data: person } = usePersonControllerFindById(personId, undefined, {
    query: { enabled: !!personId },
  })
  const [activeTab, setActiveTab] = useState('dati')
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour } = useSchedaTour()

  useSchedaTourTabSync({ run, stepIndex, activeTab, setActiveTab, tabByStep: SCHEDA_TAB_BY_STEP })

  return (
    <AppLayout
      title={person?.name ?? t('scheda.defaultTitle')}
      description={t('scheda.description')}
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
            <BreadcrumbLink render={<Link to="/gestionale/clienti" />}>
              {t('scheda.breadcrumbClients')}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{person?.name ?? '...'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {person && (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as string)}>
          <TabsList>
            <TabsTrigger id="cliente-scheda-tab-dati" value="dati">
              {t('scheda.tabDati')}
            </TabsTrigger>
            <TabsTrigger id="cliente-scheda-tab-allegati" value="allegati">
              {t('scheda.tabAllegati')}
            </TabsTrigger>
            <TabsTrigger id="cliente-scheda-tab-immobili" value="immobili">
              {t('scheda.tabImmobili')}
            </TabsTrigger>
            <TabsTrigger id="cliente-scheda-tab-agenda" value="agenda">
              {t('scheda.tabAgenda')}
            </TabsTrigger>
            <TabsTrigger id="cliente-scheda-tab-comunicazioni" value="comunicazioni">
              {t('scheda.tabComunicazioni')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dati">
            <SchedaDati person={person} />
          </TabsContent>
          <TabsContent value="allegati">
            <SchedaAllegati personId={personId} />
          </TabsContent>
          <TabsContent value="immobili">
            <SchedaImmobili personId={personId} />
          </TabsContent>
          <TabsContent value="agenda">
            <SchedaAgenda personId={personId} />
          </TabsContent>
          <TabsContent value="comunicazioni">
            <SchedaComunicazioni personId={personId} />
          </TabsContent>
        </Tabs>
      )}
    </AppLayout>
  )
}

export default Scheda
