import { useTranslation } from 'react-i18next'
import {
  useMarketingWhatsappControllerQrCode,
  useMarketingWhatsappControllerStatus,
} from '@/api/generated/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const POLL_INTERVAL_MS = 4000

function WhatsappConnectionCard() {
  const { t } = useTranslation('marketing')

  const status = useMarketingWhatsappControllerStatus({
    query: { refetchInterval: POLL_INTERVAL_MS },
  })
  const connected = status.data?.connected ?? false

  const qrCode = useMarketingWhatsappControllerQrCode({
    query: { enabled: !connected, refetchInterval: connected ? false : POLL_INTERVAL_MS },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('whatsappConnection.title')}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {status.isError && <p className="text-sm text-destructive">{t('whatsappConnection.error')}</p>}

        {!status.isError && connected && (
          <p className="text-sm font-medium text-emerald-600">{t('whatsappConnection.connected')}</p>
        )}

        {!status.isError && !connected && (
          <div className="grid gap-2">
            <p className="text-sm text-muted-foreground">{t('whatsappConnection.scanHint')}</p>
            {qrCode.data?.qrCodeBase64 && (
              <img
                src={qrCode.data.qrCodeBase64}
                alt={t('whatsappConnection.qrCodeAlt')}
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
