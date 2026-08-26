import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getCalendarEventAttachmentControllerFindQueryKey,
  useCalendarEventAttachmentControllerCreate,
  useCalendarEventAttachmentControllerDeleteById,
  useCalendarEventAttachmentControllerFind,
} from '@/api/generated/api'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { useToast } from '@/contexts/ToastContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export function useCalendarEventAttachments(calendarEventId: string) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
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
    toastPromise(Promise.all(files.map(addFile)), {
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
