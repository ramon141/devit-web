import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { Trash2Icon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import ConfirmPopup from '@/components/ConfirmPopup'
import DashboardCard from '@/pages/Home/components/DashboardCard'
import PropertySummaryItem from '@/pages/Home/components/PropertySummaryItem'
import {
  getPropertiesReportControllerDormantQueryKey,
  usePropertyControllerDeleteById,
} from '@/api/generated/api'
import type { PropertiesReportControllerDormant200Item } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

type DormantPropertiesCardProps = {
  properties: PropertiesReportControllerDormant200Item[]
  isLoading?: boolean
}

function DormantPropertiesCard({ properties, isLoading }: DormantPropertiesCardProps) {
  const { t } = useTranslation('home')
  const [deleteTarget, setDeleteTarget] = useState<PropertiesReportControllerDormant200Item | null>(
    null
  )
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: deleteProperty } = usePropertyControllerDeleteById()

  function confirmDelete() {
    if (!deleteTarget?.id) return

    const promise = deleteProperty({ id: deleteTarget.id })
    promisePopup(promise, {
      pending: t('dormantPropertiesCard.deleting'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getPropertiesReportControllerDormantQueryKey() })
        return t('dormantPropertiesCard.deleteSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('dormantPropertiesCard.deleteError')),
    })
    setDeleteTarget(null)
  }

  return (
    <DashboardCard
      title={t('dormantPropertiesCard.title')}
      count={properties.length}
      isLoading={isLoading}
    >
      {properties.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('dormantPropertiesCard.empty')}</p>
      )}

      {properties.map((property) => (
        <PropertySummaryItem
          key={property.id}
          property={property}
          date={property.createdAt}
          dateLabel={t('dormantPropertiesCard.insertedAt')}
          action={
            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(property)}>
              <Trash2Icon className="size-4 text-destructive" />
            </Button>
          }
        />
      ))}

      <ConfirmPopup
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('dormantPropertiesCard.confirmTitle')}
        description={t('dormantPropertiesCard.confirmDescription', {
          name: deleteTarget?.title ?? deleteTarget?.code,
        })}
        variant="destructive"
        confirmLabel={t('dormantPropertiesCard.confirmLabel')}
        onConfirm={confirmDelete}
      />
    </DashboardCard>
  )
}

export default DormantPropertiesCard
