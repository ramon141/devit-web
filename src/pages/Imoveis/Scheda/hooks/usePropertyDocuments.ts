import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPropertyDocumentControllerFindQueryKey,
  usePropertyDocumentControllerCreate,
  usePropertyDocumentControllerDeleteById,
  usePropertyDocumentControllerFind,
} from '@/api/generated/api'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

type ApiError = AxiosError<ApiErrorResponse>

export function usePropertyDocuments(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { uploadFile } = useAttachmentUpload()
  const { mutateAsync: createLink } = usePropertyDocumentControllerCreate()
  const { mutateAsync: deleteLink } = usePropertyDocumentControllerDeleteById()

  const { data: documents, isLoading } = usePropertyDocumentControllerFind({
    filter: { where: { propertyId }, include: [{ relation: 'attachment' }] },
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyDocumentControllerFindQueryKey() })
  }

  async function addFile(file: File) {
    const attachment = await uploadFile(file, 'property-documents')
    return createLink({
      data: { propertyId, attachmentId: attachment.id ?? '', label: file.name },
    })
  }

  function uploadFiles(files: File[]) {
    promisePopup(Promise.all(files.map(addFile)), {
      pending: t('scheda.documentiTab.pendingUpload'),
      success: () => {
        invalidate()
        return t('scheda.documentiTab.successUpload')
      },
      error: (error: ApiError) =>
        getErrorMessageFromRequest(error, t('scheda.documentiTab.errorUpload')),
    })
  }

  function removeDocument(id: string) {
    promisePopup(deleteLink({ id }), {
      pending: t('scheda.documentiTab.pendingDelete'),
      success: () => {
        invalidate()
        return t('scheda.documentiTab.successDelete')
      },
      error: (error: ApiError) =>
        getErrorMessageFromRequest(error, t('scheda.documentiTab.errorDelete')),
    })
  }

  return { documents: documents ?? [], isLoading, uploadFiles, removeDocument }
}
