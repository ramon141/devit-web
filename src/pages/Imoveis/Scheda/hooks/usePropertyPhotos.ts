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
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { usePropertyDraft } from '@/pages/Imoveis/contexts/PropertyDraftContext'
import { fileToBase64 } from '@/utils/fileToBase64'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

type ApiError = AxiosError<ApiErrorResponse>

export function usePropertyPhotos(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { draft, setDraftBlock } = usePropertyDraft()
  const { uploadFile } = useAttachmentUpload()
  const { mutateAsync: createLink } = usePropertyPhotoControllerCreate()
  const { mutateAsync: deleteLink } = usePropertyPhotoControllerDeleteById()
  const { mutateAsync: updateLink } = usePropertyPhotoControllerUpdateById()

  const { data: photos, isLoading } = usePropertyPhotoControllerFind(
    { filter: { where: { propertyId }, include: [{ relation: 'attachment' }] } },
    { query: { enabled: !!propertyId } }
  )

  // No rascunho a prévia sai do próprio base64 e o índice faz as vezes de id
  const draftPhotos = draft.photos.map((photo, index) => ({
    id: String(index),
    caption: photo.caption,
    cover: photo.cover,
    attachment: {
      url: `data:${photo.mimeType};base64,${photo.bodyBase64}`,
      originalName: photo.originalName,
    },
  }))

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyPhotoControllerFindQueryKey() })
  }

  async function addFile(file: File) {
    const attachment = await uploadFile(file, 'property-photos')
    return createLink({ data: { propertyId, attachmentId: attachment.id ?? '' } })
  }

  async function addDraftFiles(files: File[]) {
    const items = await Promise.all(
      files.map(async (file) => ({
        originalName: file.name,
        mimeType: file.type,
        bodyBase64: await fileToBase64(file),
        cover: false,
      }))
    )

    setDraftBlock('photos', [...draft.photos, ...items])
  }

  function uploadFiles(files: File[]) {
    const promise = propertyId
      ? Promise.all(files.map(addFile)).then(() => undefined)
      : addDraftFiles(files)

    promisePopup(promise, {
      pending: t('scheda.fotoTab.pendingUpload'),
      success: () => {
        invalidate()
        return t('scheda.fotoTab.successUpload')
      },
      error: (error: ApiError) => getErrorMessageFromRequest(error, t('scheda.fotoTab.errorUpload')),
    })
  }

  function removePhoto(id: string) {
    const promise = propertyId
      ? deleteLink({ id })
      : Promise.resolve(setDraftBlock('photos', draft.photos.filter((_, index) => String(index) !== id)))

    promisePopup(promise, {
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

    const promise = propertyId
      ? Promise.all(updates).then(() => undefined)
      : Promise.resolve(
          setDraftBlock('photos', draft.photos.map((photo, index) => ({ ...photo, cover: String(index) === id })))
        )

    promisePopup(promise, {
      pending: t('scheda.fotoTab.pendingCover'),
      success: () => {
        invalidate()
        return t('scheda.fotoTab.successCover')
      },
      error: (error: ApiError) => getErrorMessageFromRequest(error, t('scheda.fotoTab.errorCover')),
    })
  }

  return { photos: propertyId ? (photos ?? []) : draftPhotos, isLoading, uploadFiles, removePhoto, setCover }
}
