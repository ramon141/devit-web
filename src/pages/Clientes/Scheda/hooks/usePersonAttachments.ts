import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import {
  getPersonAttachmentControllerFindQueryKey,
  usePersonAttachmentControllerCreate,
  usePersonAttachmentControllerDeleteById,
  usePersonAttachmentControllerFind,
} from '@/api/generated/api'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function usePersonAttachments(personId: string) {
  const { t } = useTranslation('clientes')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { uploadFile } = useAttachmentUpload()
  const { mutateAsync: createLink } = usePersonAttachmentControllerCreate()
  const { mutateAsync: deleteLink } = usePersonAttachmentControllerDeleteById()

  const { data: attachments, isLoading } = usePersonAttachmentControllerFind({
    filter: { where: { personId }, include: [{ relation: 'attachment' }] },
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPersonAttachmentControllerFindQueryKey() })
  }

  async function addFile(file: File) {
    const attachment = await uploadFile(file, 'person-attachments')
    return createLink({ data: { personId, attachmentId: attachment.id ?? '' } })
  }

  function uploadFiles(files: File[]) {
    promisePopup(Promise.all(files.map(addFile)), {
      pending: t('usePersonAttachments.pendingUpload'),
      success: () => {
        invalidate()
        return t('usePersonAttachments.successUpload')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('usePersonAttachments.errorUpload')),
    })
  }

  function removeAttachment(id: string) {
    promisePopup(deleteLink({ id }), {
      pending: t('usePersonAttachments.pendingDelete'),
      success: () => {
        invalidate()
        return t('usePersonAttachments.successDelete')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('usePersonAttachments.errorDelete')),
    })
  }

  return {
    attachments: attachments ?? [],
    isLoading,
    uploadFiles,
    removeAttachment,
  }
}
