import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/utils/formatDate'
import { useCampaignDetail } from '@/pages/Marketing/hooks/useCampaignDetail'
import type { CommunicationLogWithRelations } from '@/api/generated/models'

type CampaignDetailDialogProps = {
  campaignId: string | null
  onClose: () => void
}

function recipientLabel(log: CommunicationLogWithRelations) {
  const recipient = log.person ?? log.lead

  return recipient ? `${recipient.name} (${recipient.email ?? '—'})` : '—'
}

function CampaignDetailDialog({ campaignId, onClose }: CampaignDetailDialogProps) {
  const { t } = useTranslation('marketing')
  const { logs, isLoading } = useCampaignDetail(campaignId)
  const [previewLog, setPreviewLog] = useState<CommunicationLogWithRelations | null>(null)

  return (
    <>
      <Dialog open={!!campaignId} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('campaignDetailDialog.title')}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('campaignDetailDialog.recipient')}</TableHead>
                  <TableHead>{t('campaignDetailDialog.status')}</TableHead>
                  <TableHead>{t('campaignDetailDialog.sentAt')}</TableHead>
                  <TableHead>{t('campaignDetailDialog.readAt')}</TableHead>
                  <TableHead>{t('campaignDetailDialog.clickedAt')}</TableHead>
                  <TableHead>{t('campaignDetailDialog.content')}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {!isLoading && logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      {t('campaignDetailDialog.empty')}
                    </TableCell>
                  </TableRow>
                )}

                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{recipientLabel(log)}</TableCell>
                    <TableCell>
                      <Badge variant={log.status === 'failed' ? 'destructive' : 'secondary'}>
                        {log.status ?? '—'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(log.sentAt)}</TableCell>
                    <TableCell>{log.readAt ? formatDate(log.readAt) : '—'}</TableCell>
                    <TableCell>{log.clickedAt ? formatDate(log.clickedAt) : '—'}</TableCell>
                    <TableCell>
                      <button
                        type="button"
                        className="text-primary underline underline-offset-4"
                        onClick={() => setPreviewLog(log)}
                      >
                        {t('campaignDetailDialog.viewContent')}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewLog} onOpenChange={(open) => !open && setPreviewLog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t('campaignDetailDialog.contentTitle')}</DialogTitle>
          </DialogHeader>

          {previewLog && (
            <iframe
              title="campaign-content-preview"
              sandbox=""
              srcDoc={previewLog.content}
              className="h-[60vh] w-full rounded-lg border border-border bg-white"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CampaignDetailDialog
