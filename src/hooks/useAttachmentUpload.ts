import { useAttachmentControllerCreate } from '@/api/generated/api'
import { fileToBase64 } from '@/utils/fileToBase64'

export function useAttachmentUpload() {
  const { mutateAsync: createAttachment, isPending } = useAttachmentControllerCreate()

  async function uploadFile(file: File, folder?: string) {
    const bodyBase64 = await fileToBase64(file)

    return createAttachment({
      data: { originalName: file.name, mimeType: file.type, bodyBase64, folder },
    })
  }

  return { uploadFile, isUploading: isPending }
}
