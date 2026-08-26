import { useTranslation } from 'react-i18next'
import AppLayout from '@/components/layout/AppLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ChannelStatusDashboard from '@/pages/Marketing/components/ChannelStatusDashboard'

function Marketing() {
  const { t } = useTranslation('marketing')

  return (
    <AppLayout
      title={t('index.title')}
      description={t('index.description')}
      breadcrumbItems={[{ label: t('index.breadcrumb') }]}
    >
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
          <ChannelStatusDashboard channel="whatsapp" />
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('index.comingSoonTitle')}</CardTitle>
          <CardDescription>{t('index.comingSoonDescription')}</CardDescription>
        </CardHeader>
      </Card>
    </AppLayout>
  )
}

export default Marketing
