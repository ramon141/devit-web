import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getHomeBannerControllerCountQueryKey,
  getHomeBannerControllerFindQueryKey,
  useHomeBannerControllerCreate,
  useHomeBannerControllerUpdateById,
} from '@/api/generated/api'
import type { HomeBanner } from '@/api/generated/models'
import { useToast } from '@/contexts/ToastContext'
import { useAttachmentUpload } from '@/hooks/useAttachmentUpload'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'
import { emptyStringsToNull } from '@/utils/emptyStringsToNull'
import { toNumberOrNull } from '@/utils/toNumberOrNull'
import { toISODateOrNull } from '@/utils/toISODateOrNull'
import { bannerSchema, type BannerFormValues } from '@/pages/Amministrazione/Banner/schemas/bannerSchema'

const emptyValues: BannerFormValues = {
  title: '',
  subtitle: '',
  targetLink: '',
  displayOrder: '',
  active: true,
  startDate: '',
  endDate: '',
}

type UseBannerFormProps = {
  banner?: HomeBanner | null
  onSaved: () => void
}

export function useBannerForm({ banner, onSaved }: UseBannerFormProps) {
  const queryClient = useQueryClient()
  const { toastPromise } = useToast()
  const { uploadFile } = useAttachmentUpload()
  const { mutateAsync: create, isPending: creating } = useHomeBannerControllerCreate()
  const { mutateAsync: update, isPending: updating } = useHomeBannerControllerUpdateById()
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imageError, setImageError] = useState<string | undefined>(undefined)

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: emptyValues,
  })

  useEffect(() => {
    setImageFiles([])
    form.reset(
      banner
        ? {
            title: banner.title,
            subtitle: banner.subtitle ?? '',
            targetLink: banner.targetLink ?? '',
            displayOrder: banner.displayOrder != null ? String(banner.displayOrder) : '',
            active: banner.active ?? true,
            startDate: banner.startDate?.slice(0, 10) ?? '',
            endDate: banner.endDate?.slice(0, 10) ?? '',
          }
        : emptyValues
    )
  }, [banner, form])

  function invalidateList() {
    queryClient.invalidateQueries({ queryKey: getHomeBannerControllerFindQueryKey() })
    queryClient.invalidateQueries({ queryKey: getHomeBannerControllerCountQueryKey() })
  }

  async function saveBanner(values: BannerFormValues) {
    const cleaned = emptyStringsToNull(values)
    const data = {
      title: values.title,
      subtitle: cleaned.subtitle,
      targetLink: cleaned.targetLink,
      displayOrder: toNumberOrNull(values.displayOrder),
      active: values.active,
      startDate: toISODateOrNull(values.startDate),
      endDate: toISODateOrNull(values.endDate),
    }

    if (imageFiles[0]) {
      const attachment = await uploadFile(imageFiles[0], 'banners')
      const fullData = { ...data, attachmentId: attachment.id ?? '' }
      return banner?.id ? update({ id: banner.id, data: fullData }) : create({ data: fullData })
    }

    return update({ id: banner?.id ?? '', data })
  }

  function onSubmit(values: BannerFormValues) {
    if (!banner && !imageFiles[0]) {
      setImageError('Seleziona un’immagine per il banner')
      return
    }
    setImageError(undefined)

    toastPromise(saveBanner(values), {
      pending: banner ? 'Salvataggio banner...' : 'Creazione banner...',
      success: () => {
        invalidateList()
        onSaved()
        return banner ? 'Banner aggiornato con successo!' : 'Banner creato con successo!'
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, 'Errore durante il salvataggio del banner'),
    })
  }

  return {
    form,
    imageFiles,
    setImageFiles,
    imageError,
    isSubmitting: creating || updating,
    onSubmit: form.handleSubmit(onSubmit),
  }
}
