import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPropertyPhotoControllerFindQueryKey,
  usePropertyPhotoControllerCreate,
  usePropertyPhotoControllerDeleteById,
  usePropertyPhotoControllerFind,
  usePropertyPhotoControllerUpdateById,
} from '@/api/generated/api'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

type ApiError = AxiosError<ApiErrorResponse>

export function usePropertyPhotos(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { uploadFile } = useAttachmentUpload()
  const { mutateAsync: createLink } = usePropertyPhotoControllerCreate()
  const { mutateAsync: deleteLink } = usePropertyPhotoControllerDeleteById()
  const { mutateAsync: updateLink } = usePropertyPhotoControllerUpdateById()

  const { data: photos, isLoading } = usePropertyPhotoControllerFind({
    filter: { where: { propertyId }, include: [{ relation: 'attachment' }] },
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyPhotoControllerFindQueryKey() })
  }

  async function addFile(file: File) {
    const attachment = await uploadFile(file, 'property-photos')
    return createLink({ data: { propertyId, attachmentId: attachment.id ?? '' } })
  }

  function uploadFiles(files: File[]) {
    toastPromise(Promise.all(files.map(addFile)), {
      pending: t('scheda.fotoTab.pendingUpload'),
      success: () => {
        invalidate()
        return t('scheda.fotoTab.successUpload')
      },
      error: (error: ApiError) => getErrorMessageFromRequest(error, t('scheda.fotoTab.errorUpload')),
    })
  }

  function removePhoto(id: string) {
    toastPromise(deleteLink({ id }), {
      pending: t('scheda.fotoTab.pendingDelete'),
      success: () => {
        invalidate()
        return t('scheda.fotoTab.successDelete')
      },
      error: (error: ApiError) => getErrorMessageFromRequest(error, t('scheda.fotoTab.errorDelete')),
    })
  }

  function setCover(id: string) {
    const updates = (photos ?? []).map((photo) =>
      updateLink({ id: photo.id ?? '', data: { cover: photo.id === id } }),
    )

    toastPromise(Promise.all(updates), {
      pending: t('scheda.fotoTab.pendingCover'),
      success: () => {
        invalidate()
        return t('scheda.fotoTab.successCover')
      },
      error: (error: ApiError) => getErrorMessageFromRequest(error, t('scheda.fotoTab.errorCover')),
    })
  }

  return { photos: photos ?? [], isLoading, uploadFiles, removePhoto, setCover }
}
