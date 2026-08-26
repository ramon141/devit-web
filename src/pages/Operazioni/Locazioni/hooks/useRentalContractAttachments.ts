import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getContractAttachmentControllerFindQueryKey,
  useContractAttachmentControllerCreate,
  useContractAttachmentControllerDeleteById,
  useContractAttachmentControllerFind,
} from '@/api/generated/api'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useRentalContractAttachments(contractId: string) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { uploadFile } = useAttachmentUpload()
  const { mutateAsync: createLink } = useContractAttachmentControllerCreate()
  const { mutateAsync: deleteLink } = useContractAttachmentControllerDeleteById()

  const { data: attachments } = useContractAttachmentControllerFind({
    filter: { where: { contractId }, include: [{ relation: 'attachment' }] },
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getContractAttachmentControllerFindQueryKey() })
  }

  async function addFile(file: File) {
    const attachment = await uploadFile(file, 'contract-attachments')
    return createLink({ data: { contractId, attachmentId: attachment.id ?? '' } })
  }

  function uploadFiles(files: File[]) {
    toastPromise(Promise.all(files.map((file) => addFile(file))), {
      pending: 'Caricamento allegati...',
      success: () => {
        invalidate()
        return 'Allegati caricati con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il caricamento degli allegati'),
    })
  }

  function removeAttachment(id: string) {
    toastPromise(deleteLink({ id }), {
      pending: 'Eliminazione allegato...',
      success: () => {
        invalidate()
        return 'Allegato eliminato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante l’eliminazione dell’allegato'),
    })
  }

  return {
    attachments: attachments ?? [],
    uploadFiles,
    removeAttachment,
  }
}
