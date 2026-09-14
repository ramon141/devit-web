import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardDescription } from '@/components/ui/card'
import JoyrideWrapper from '@/components/JoyrideWrapper'
import TourFab from '@/components/TourFab'
import { useMarketingTour } from '@/pages/Marketing/hooks/useMarketingTour'
import ChannelStatusDashboard from '@/pages/Marketing/components/ChannelStatusDashboard'
import WhatsappConnectionCard from '@/pages/Marketing/components/WhatsappConnectionCard'
import SendCampagnaTab from '@/pages/Marketing/components/SendCampagnaTab'
import ModelliTab from '@/pages/Marketing/components/ModelliTab'
import RimozioniTab from '@/pages/Marketing/components/RimozioniTab'
import StoricoTab from '@/pages/Marketing/components/StoricoTab'

function Marketing() {
  const { t } = useTranslation('marketing')
  const { run, stepIndex, tourKey, steps, handleJoyrideCallback, startTour } = useMarketingTour()

  return (
    <AppLayout
      title={t('index.title')}
      description={t('index.description')}
      breadcrumbItems={[{ label: t('index.breadcrumb') }]}
    >
      <JoyrideWrapper
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        tourKey={tourKey}
        onEvent={handleJoyrideCallback}
      />
      <TourFab onClick={startTour} />

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger id="marketing-tab-dashboard" value="dashboard">{t('index.dashboardTab')}</TabsTrigger>
          <TabsTrigger id="marketing-tab-invia" value="invia">{t('index.inviaTab')}</TabsTrigger>
          <TabsTrigger id="marketing-tab-storico" value="storico">{t('index.storicoTab')}</TabsTrigger>
          <TabsTrigger id="marketing-tab-modelli" value="modelli">{t('index.modelliTab')}</TabsTrigger>
          <TabsTrigger id="marketing-tab-rimozioni" value="rimozioni">{t('index.rimozioniTab')}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Tabs defaultValue="email">
            <TabsList>
              <TabsTrigger value="email">{t('index.emailTab')}</TabsTrigger>
              <TabsTrigger value="whatsapp">{t('index.whatsappTab')}</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <ChannelStatusDashboard channel="email" />
            </TabsContent>

            <TabsContent value="whatsapp" className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardDescription>{t('index.whatsappHint')}</CardDescription>
                </CardHeader>
              </Card>
              <WhatsappConnectionCard />
              <ChannelStatusDashboard channel="whatsapp" />
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="invia">
          <SendCampagnaTab />
        </TabsContent>

        <TabsContent value="storico">
          <StoricoTab />
        </TabsContent>

        <TabsContent value="modelli">
          <ModelliTab />
        </TabsContent>

        <TabsContent value="rimozioni">
          <RimozioniTab />
        </TabsContent>
      </Tabs>
    </AppLayout>
  )
}

export default Marketing
