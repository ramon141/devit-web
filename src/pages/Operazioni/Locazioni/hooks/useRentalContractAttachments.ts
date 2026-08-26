import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('operazioni')
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
      pending: t('locazioni.hooks.attachments.uploading'),
      success: () => {
        invalidate()
        return t('locazioni.hooks.attachments.uploadSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('locazioni.hooks.attachments.uploadError')),
    })
  }

  function removeAttachment(id: string) {
    toastPromise(deleteLink({ id }), {
      pending: t('locazioni.hooks.attachments.deleting'),
      success: () => {
        invalidate()
        return t('locazioni.hooks.attachments.deleteSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('locazioni.hooks.attachments.deleteError')),
    })
  }

  return {
    attachments: attachments ?? [],
    uploadFiles,
    removeAttachment,
  }
}
