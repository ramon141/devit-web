import AppLayout from '@/components/layout/AppLayout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ChannelStatusDashboard from '@/pages/Marketing/components/ChannelStatusDashboard'

function Marketing() {
  return (
    <AppLayout
      title="Marketing"
      description="Monitora le comunicazioni inviate ai clienti"
      breadcrumbItems={[{ label: 'Marketing' }]}
    >
      <Tabs defaultValue="email">
        <TabsList>
          <TabsTrigger value="email">E-mail Marketing</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <ChannelStatusDashboard channel="email" />
        </TabsContent>

        <TabsContent value="whatsapp" className="grid gap-4">
          <Card>
            <CardHeader>
              <CardDescription>
                Per inviare un messaggio, vai alla scheda dell'immobile o del cliente.
              </CardDescription>
            </CardHeader>
          </Card>
          <ChannelStatusDashboard channel="whatsapp" />
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Prossimamente</CardTitle>
          <CardDescription>
            Area del proprietario, Customer Satisfaction, Gestim Analytics, Rivista dell'agenzia,
            Watermark e Gestione pubblicità.
          </CardDescription>
        </CardHeader>
      </Card>
    </AppLayout>
  )
}

export default Marketing
