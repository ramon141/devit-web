import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getHomeBannerControllerFindQueryKey,
  useHomeBannerControllerUpdateById,
} from '@/api/generated/api'
import type { HomeBannerWithRelations } from '@/api/generated/models'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

type UseReorderBannersProps = {
  banners: HomeBannerWithRelations[]
}

// Move o banner arrastado para a posição do banner alvo e regrava displayOrder
export function useReorderBanners({ banners }: UseReorderBannersProps) {
  const { t } = useTranslation('amministrazione')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { mutateAsync: update } = useHomeBannerControllerUpdateById()

  function buildOrderedList(fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return null

    if (fromIndex >= banners.length || toIndex >= banners.length) return null

    const ordered = [...banners]
    const moved = ordered[fromIndex]

    if (!moved) return null

    ordered.splice(fromIndex, 1)
    ordered.splice(toIndex, 0, moved)

    return ordered
  }

  function reorder(fromIndex: number, toIndex: number) {
    const ordered = buildOrderedList(fromIndex, toIndex)

    if (!ordered) return

    const changed = ordered.filter((banner, index) => banner.displayOrder !== index + 1)

    if (!changed.length) return

    const promise = Promise.all(
      changed.map((banner) =>
        update({
          id: banner.id ?? '',
          data: { displayOrder: ordered.indexOf(banner) + 1 },
        })
      )
    )

    promisePopup(promise, {
      pending: t('reorderBanners.pending'),
      success: () => {
        queryClient.invalidateQueries({ queryKey: getHomeBannerControllerFindQueryKey() })
        return t('reorderBanners.success')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('reorderBanners.error')),
    })
  }

  return { reorder }
}
