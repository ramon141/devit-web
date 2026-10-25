import { LinkIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  useMarketingWhatsappControllerQrCode,
  useMarketingWhatsappControllerStatus,
} from '@/api/generated/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useWhatsappWebhook, type WhatsappTarget } from '@/pages/Marketing/hooks/useWhatsappWebhook'

const POLL_INTERVAL_MS = 4000
const CONNECTED_POLL_INTERVAL_MS = 30000

interface WhatsappConnectionCardProps {
  target: WhatsappTarget
}

function WhatsappConnectionCard({ target }: WhatsappConnectionCardProps) {
  const { t } = useTranslation('marketing')

  const status = useMarketingWhatsappControllerStatus(
    { target },
    {
      query: {
        refetchInterval: (query) =>
          query.state.data?.connected ? CONNECTED_POLL_INTERVAL_MS : POLL_INTERVAL_MS,
      },
    },
  )
  const connected = status.data?.connected ?? false

  const webhook = useWhatsappWebhook(target)

  const qrCode = useMarketingWhatsappControllerQrCode(
    { target },
    {
      query: { enabled: !connected, refetchInterval: connected ? false : POLL_INTERVAL_MS },
    },
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(`whatsappConnection.title.${target}`)}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {status.isError && <p className="text-sm text-destructive">{t('whatsappConnection.error')}</p>}

        {!status.isError && connected && (
          <p className="text-sm font-medium text-emerald-600">{t('whatsappConnection.connected')}</p>
        )}

        {!webhook.isLoading && !webhook.isError && (
          <div className="grid gap-2 border-t pt-4">
            <p className="text-sm font-medium">{t('whatsappConnection.webhookTitle')}</p>

            {webhook.configured ? (
              <p className="text-sm text-emerald-600">{t(`whatsappConnection.webhookConfigured.${target}`)}</p>
            ) : (
              <div className="grid gap-2">
                <p className="text-sm text-muted-foreground">{t(`whatsappConnection.webhookMissing.${target}`)}</p>

                {webhook.expectedUrl && (
                  <p className="break-all text-xs text-muted-foreground">{webhook.expectedUrl}</p>
                )}

                <Button
                  type="button"
                  className="justify-self-start"
                  disabled={webhook.isRegistering}
                  onClick={webhook.onRegister}
                >
                  <LinkIcon data-icon="inline-start" />
                  {t('whatsappConnection.webhookRegister')}
                </Button>
              </div>
            )}
          </div>
        )}

        {!status.isError && !connected && (
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">{t('whatsappConnection.scanHint')}</p>
            {qrCode.data?.qrCodeBase64 && (
              <img
                src={qrCode.data.qrCodeBase64}
                alt={t('whatsappConnection.qrCodeAlt')}
                width={256}
                height={256}
                className="h-64 w-64"
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WhatsappConnectionCard
