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
import { usePersonControllerFindById } from '@/api/generated/api'
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

  return (
    <AppLayout
      title={person?.name ?? t('scheda.defaultTitle')}
      description={t('scheda.description')}
    >
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
        <Tabs defaultValue="dati">
          <TabsList>
            <TabsTrigger value="dati">{t('scheda.tabDati')}</TabsTrigger>
            <TabsTrigger value="allegati">{t('scheda.tabAllegati')}</TabsTrigger>
            <TabsTrigger value="immobili">{t('scheda.tabImmobili')}</TabsTrigger>
            <TabsTrigger value="agenda">{t('scheda.tabAgenda')}</TabsTrigger>
            <TabsTrigger value="comunicazioni">{t('scheda.tabComunicazioni')}</TabsTrigger>
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
