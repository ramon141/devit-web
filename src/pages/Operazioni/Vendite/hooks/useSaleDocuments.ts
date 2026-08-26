import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getSaleDocumentControllerFindQueryKey,
  useSaleDocumentControllerCreate,
  useSaleDocumentControllerDeleteById,
  useSaleDocumentControllerFind,
} from '@/api/generated/api'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useSaleDocuments(saleId: string) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
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
    toastPromise(Promise.all(files.map((file) => addFile(file, type))), {
      pending: 'Caricamento documenti...',
      success: () => {
        invalidate()
        return 'Documenti caricati con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il caricamento dei documenti'),
    })
  }

  function removeDocument(id: string) {
    toastPromise(deleteLink({ id }), {
      pending: 'Eliminazione documento...',
      success: () => {
        invalidate()
        return 'Documento eliminato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione del documento'),
    })
  }

  return {
    documents: documents ?? [],
    isLoading,
    uploadFiles,
    removeDocument,
  }
}
