import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import {
  getSaleDocumentControllerFindQueryKey,
  useSaleDocumentControllerCreate,
  useSaleDocumentControllerDeleteById,
  useSaleDocumentControllerFind,
} from '@/api/generated/api'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useSaleDocuments(saleId: string) {
  const { t } = useTranslation('operazioni')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { uploadFile } = useAttachmentUpload()
  const { mutateAsync: createLink } = useSaleDocumentControllerCreate()
  const { mutateAsync: deleteLink } = useSaleDocumentControllerDeleteById()

  const { data: documents, isLoading } = useSaleDocumentControllerFind({
    filter: { where: { saleId }, include: [{ relation: 'attachment' }], order: ['generatedAt DESC'] },
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getSaleDocumentControllerFindQueryKey() })
  }

  async function addFile(file: File, type: string) {
    const attachment = await uploadFile(file, 'sale-documents')
    return createLink({
      data: {
        saleId,
        attachmentId: attachment.id ?? '',
        type: type || null,
        generatedAt: new Date().toISOString(),
      },
    })
  }

  function uploadFiles(files: File[], type: string) {
    promisePopup(Promise.all(files.map((file) => addFile(file, type))), {
      pending: t('vendite.hooks.documents.uploading'),
      success: () => {
        invalidate()
        return t('vendite.hooks.documents.uploadSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('vendite.hooks.documents.uploadError')),
    })
  }

  function removeDocument(id: string) {
    promisePopup(deleteLink({ id }), {
      pending: t('vendite.hooks.documents.deleting'),
      success: () => {
        invalidate()
        return t('vendite.hooks.documents.deleteSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('vendite.hooks.documents.deleteError')),
    })
  }

  return {
    documents: documents ?? [],
    isLoading,
    uploadFiles,
    removeDocument,
  }
}
