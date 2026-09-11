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
import { usePropertyDraft } from '@/pages/Imoveis/contexts/PropertyDraftContext'
import { fileToBase64 } from '@/utils/fileToBase64'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

type ApiError = AxiosError<ApiErrorResponse>

export function usePropertyDocuments(propertyId: string) {
  const { t } = useTranslation('imoveis')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { draft, setDraftBlock } = usePropertyDraft()
  const { uploadFile } = useAttachmentUpload()
  const { mutateAsync: createLink } = usePropertyDocumentControllerCreate()
  const { mutateAsync: deleteLink } = usePropertyDocumentControllerDeleteById()

  const { data: documents, isLoading } = usePropertyDocumentControllerFind(
    { filter: { where: { propertyId }, include: [{ relation: 'attachment' }] } },
    { query: { enabled: !!propertyId } }
  )

  const draftDocuments = draft.documents.map((document, index) => ({
    id: String(index),
    label: document.label ?? document.originalName,
    createdAt: '',
    attachment: {
      url: `data:${document.mimeType};base64,${document.bodyBase64}`,
      originalName: document.originalName,
    },
  }))

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: getPropertyDocumentControllerFindQueryKey() })
  }

  async function addFile(file: File) {
    const attachment = await uploadFile(file, 'property-documents')
    return createLink({
      data: { propertyId, attachmentId: attachment.id ?? '', label: file.name },
    })
  }

  async function addDraftFiles(files: File[]) {
    const items = await Promise.all(
      files.map(async (file) => ({
        originalName: file.name,
        mimeType: file.type,
        bodyBase64: await fileToBase64(file),
        label: file.name,
      }))
    )

    setDraftBlock('documents', [...draft.documents, ...items])
  }

  function uploadFiles(files: File[]) {
    const promise = propertyId
      ? Promise.all(files.map(addFile)).then(() => undefined)
      : addDraftFiles(files)

    promisePopup(promise, {
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
    const promise = propertyId
      ? deleteLink({ id })
      : Promise.resolve(
          setDraftBlock('documents', draft.documents.filter((_, index) => String(index) !== id))
        )

    promisePopup(promise, {
      pending: t('scheda.documentiTab.pendingDelete'),
      success: () => {
        invalidate()
        return t('scheda.documentiTab.successDelete')
      },
      error: (error: ApiError) =>
        getErrorMessageFromRequest(error, t('scheda.documentiTab.errorDelete')),
    })
  }

  return { documents: propertyId ? (documents ?? []) : draftDocuments, isLoading, uploadFiles, removeDocument }
}
