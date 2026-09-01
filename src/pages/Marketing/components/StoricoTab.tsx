import { useTranslation } from 'react-i18next'
import DataTable, { type DataTableColumn } from '@/components/DataTable'
import type { MarketingCampaignControllerList200Item } from '@/api/generated/models'
import { formatDate } from '@/utils/formatDate'
import { useCampaignHistory } from '@/pages/Marketing/hooks/useCampaignHistory'

function StoricoTab() {
  const { t } = useTranslation('marketing')
  const { campaigns, isLoading } = useCampaignHistory()

  const columns: DataTableColumn<MarketingCampaignControllerList200Item>[] = [
    { header: t('storicoTab.campaign'), cell: (row) => row.campaignId ?? '—' },
    { header: t('storicoTab.channel'), cell: (row) => t(`templateChannelOptions.${row.channel}`) },
    { header: t('storicoTab.sentAt'), cell: (row) => formatDate(row.sentAt) },
    { header: t('storicoTab.total'), cell: (row) => row.total ?? 0 },
    { header: t('storicoTab.sent'), cell: (row) => row.sent ?? 0 },
    { header: t('storicoTab.failed'), cell: (row) => row.failed ?? 0 },
    { header: t('storicoTab.read'), cell: (row) => row.read ?? 0 },
  ]

  return (
    <DataTable
      columns={columns}
      data={campaigns}
      keyExtractor={(row) => row.campaignId ?? ''}
      isLoading={isLoading}
      emptyMessage={t('storicoTab.empty')}
    />
  )
}

export default StoricoTab
