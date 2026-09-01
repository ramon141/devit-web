import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { api } from '@/api/mutator'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

const ENDPOINT = '/purchase-proposal-attachments'

// Tipo local até `npm run api:generate` gerar PurchaseProposalAttachmentWithRelations.
export type ProposalAttachment = {
  id?: string
  label?: string | null
  proposalId: string
  attachmentId: string
  attachment?: { url?: string | null; originalName?: string | null }
}

function queryKey(proposalId: string) {
  return ['purchase-proposal-attachments', proposalId]
}

export function useProposalAttachments(proposalId: string) {
  const { t } = useTranslation('proposte')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { uploadFile } = useAttachmentUpload()

  const { data: attachments } = useQuery({
    queryKey: queryKey(proposalId),
    enabled: !!proposalId,
    queryFn: async () => {
      const filter = { where: { proposalId }, include: [{ relation: 'attachment' }], order: ['createdAt DESC'] }
      const { data } = await api.get<ProposalAttachment[]>(ENDPOINT, {
        params: { filter },
      })
      return data
    },
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: queryKey(proposalId) })
  }

  async function addFile(file: File) {
    const attachment = await uploadFile(file, 'purchase-proposal-attachments')
    return api.post(ENDPOINT, { proposalId, attachmentId: attachment.id ?? '' })
  }

  function uploadFiles(files: File[]) {
    promisePopup(Promise.all(files.map(addFile)), {
      pending: t('attachments.uploading'),
      success: () => {
        invalidate()
        return t('attachments.uploadSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('attachments.uploadError')),
    })
  }

  function removeAttachment(id: string) {
    promisePopup(api.delete(`${ENDPOINT}/${id}`), {
      pending: t('attachments.deleting'),
      success: () => {
        invalidate()
        return t('attachments.deleteSuccess')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('attachments.deleteError')),
    })
  }

  return { attachments: attachments ?? [], uploadFiles, removeAttachment }
}
