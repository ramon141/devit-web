import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCalendarEventAttachmentControllerFindQueryKey,
  useCalendarEventAttachmentControllerCreate,
  useCalendarEventAttachmentControllerDeleteById,
  useCalendarEventAttachmentControllerFind,
} from '@/api/generated/api'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useCalendarEventAttachments(calendarEventId: string) {
  const { t } = useTranslation('agenda')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { uploadFile } = useAttachmentUpload()
  const { mutateAsync: createLink } = useCalendarEventAttachmentControllerCreate()
  const { mutateAsync: deleteLink } = useCalendarEventAttachmentControllerDeleteById()

  const { data: attachments } = useCalendarEventAttachmentControllerFind({
    filter: { where: { calendarEventId }, include: [{ relation: 'attachment' }] },
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getCalendarEventAttachmentControllerFindQueryKey() })
  }

  async function addFile(file: File) {
    const attachment = await uploadFile(file, 'calendar-event-attachments')
    return createLink({ data: { calendarEventId, attachmentId: attachment.id ?? '' } })
  }

  function uploadFiles(files: File[]) {
    promisePopup(Promise.all(files.map(addFile)), {
      pending: t('agenda:toasts.attachments.uploading'),
      success: () => {
        invalidate()
        return t('agenda:toasts.attachments.uploadSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('agenda:toasts.attachments.uploadError')),
    })
  }

  function removeAttachment(id: string) {
    promisePopup(deleteLink({ id }), {
      pending: t('agenda:toasts.attachments.deleting'),
      success: () => {
        invalidate()
        return t('agenda:toasts.attachments.deleteSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('agenda:toasts.attachments.deleteError')),
    })
  }

  return {
    attachments: attachments ?? [],
    uploadFiles,
    removeAttachment,
  }
}
