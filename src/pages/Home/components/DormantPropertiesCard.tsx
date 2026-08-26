import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { Trash2Icon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import ConfirmPopup from '@/components/ConfirmPopup'
import DashboardCard from '@/pages/Home/components/DashboardCard'
import {
  getPropertiesReportControllerDormantQueryKey,
  usePropertyControllerDeleteById,
} from '@/api/generated/api'
import type { PropertiesReportControllerDormant200Item } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

type DormantPropertiesCardProps = {
  properties: PropertiesReportControllerDormant200Item[]
}

function DormantPropertiesCard({ properties }: DormantPropertiesCardProps) {
  const { t } = useTranslation('home')
  const [deleteTarget, setDeleteTarget] = useState<PropertiesReportControllerDormant200Item | null>(
    null
  )
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { mutateAsync: deleteProperty } = usePropertyControllerDeleteById()

  function confirmDelete() {
    if (!deleteTarget?.id) return

    const promise = deleteProperty({ id: deleteTarget.id })
    toastPromise(promise, {
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
    <DashboardCard title={t('dormantPropertiesCard.title')} count={properties.length}>
      {properties.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('dormantPropertiesCard.empty')}</p>
      )}

      {properties.map((property) => (
        <div
          key={property.id}
          className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-muted/50"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{property.title ?? property.code}</p>
            <p className="text-xs text-muted-foreground">{property.code}</p>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(property)}>
            <Trash2Icon className="size-4 text-destructive" />
          </Button>
        </div>
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
