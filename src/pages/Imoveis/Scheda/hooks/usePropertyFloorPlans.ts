import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPropertyFloorPlanControllerFindQueryKey,
  usePropertyFloorPlanControllerCreate,
  usePropertyFloorPlanControllerDeleteById,
  usePropertyFloorPlanControllerFind,
} from '@/api/generated/api'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

type ApiError = AxiosError<ApiErrorResponse>

export function usePropertyFloorPlans(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { uploadFile } = useAttachmentUpload()
  const { mutateAsync: createLink } = usePropertyFloorPlanControllerCreate()
  const { mutateAsync: deleteLink } = usePropertyFloorPlanControllerDeleteById()

  const { data: floorPlans } = usePropertyFloorPlanControllerFind(
    { filter: { where: { propertyId }, include: [{ relation: 'attachment' }] } },
    { query: { enabled: !!propertyId } }
  )

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyFloorPlanControllerFindQueryKey() })
  }

  async function addFile(file: File) {
    const attachment = await uploadFile(file, 'property-floor-plans')
    return createLink({ data: { propertyId, attachmentId: attachment.id ?? '' } })
  }

  function uploadFiles(files: File[]) {
    const promise = Promise.all(files.map(addFile)).then(() => undefined)

    promisePopup(promise, {
      pending: t('scheda.floorPlans.pendingUpload'),
      success: () => {
        invalidate()
        return t('scheda.floorPlans.successUpload')
      },
      error: (error: ApiError) =>
        getErrorMessageFromRequest(error, t('scheda.floorPlans.errorUpload')),
    })
  }

  function removeFloorPlan(id: string) {
    promisePopup(deleteLink({ id }), {
      pending: t('scheda.floorPlans.pendingDelete'),
      success: () => {
        invalidate()
        return t('scheda.floorPlans.successDelete')
      },
      error: (error: ApiError) =>
        getErrorMessageFromRequest(error, t('scheda.floorPlans.errorDelete')),
    })
  }

  return { floorPlans: floorPlans ?? [], uploadFiles, removeFloorPlan }
}
