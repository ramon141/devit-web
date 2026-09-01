import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardDescription } from '@/components/ui/card'
import ChannelStatusDashboard from '@/pages/Marketing/components/ChannelStatusDashboard'
import WhatsappConnectionCard from '@/pages/Marketing/components/WhatsappConnectionCard'
import SendCampagnaTab from '@/pages/Marketing/components/SendCampagnaTab'
import ModelliTab from '@/pages/Marketing/components/ModelliTab'
import RimozioniTab from '@/pages/Marketing/components/RimozioniTab'

function Marketing() {
  const { t } = useTranslation('marketing')

  return (
    <AppLayout
      title={t('index.title')}
      description={t('index.description')}
      breadcrumbItems={[{ label: t('index.breadcrumb') }]}
    >
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">{t('index.dashboardTab')}</TabsTrigger>
          <TabsTrigger value="invia">{t('index.inviaTab')}</TabsTrigger>
          <TabsTrigger value="modelli">{t('index.modelliTab')}</TabsTrigger>
          <TabsTrigger value="rimozioni">{t('index.rimozioniTab')}</TabsTrigger>
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
