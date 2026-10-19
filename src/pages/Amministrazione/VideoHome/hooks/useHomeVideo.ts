import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  getHomeVideoControllerCurrentQueryKey,
  getPublicHomeVideoControllerCurrentQueryKey,
  useHomeVideoControllerCurrent,
  useHomeVideoControllerRemove,
} from '@/api/generated/api'
import type { HomeVideoControllerReplace200 } from '@/api/generated/models'
import { api } from '@/api/mutator'
import { usePromisePopup } from '@/contexts/PromisePopupContext'
import { getErrorMessageFromRequest, type ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

const MP4_MIME = 'video/mp4'

// O envio é binário (MP4 cru); o cliente gerado só tipa corpo JSON, por isso a chamada direta
function uploadVideo(file: File) {
  return api
    .put<HomeVideoControllerReplace200>('/home-video', file, {
      headers: { 'Content-Type': MP4_MIME },
      params: { fileName: file.name },
    })
    .then((response) => response.data)
}

export function useHomeVideo() {
  const { t } = useTranslation('amministrazione')
  const queryClient = useQueryClient()
  const { promisePopup } = usePromisePopup()
  const { data, isLoading } = useHomeVideoControllerCurrent()
  const { mutateAsync: replace, isPending: isPublishing } = useMutation({ mutationFn: uploadVideo })
  const { mutateAsync: remove, isPending: isResetting } = useHomeVideoControllerRemove()

  function refresh() {
    queryClient.invalidateQueries({ queryKey: getHomeVideoControllerCurrentQueryKey() })
    queryClient.invalidateQueries({ queryKey: getPublicHomeVideoControllerCurrentQueryKey() })
  }

  function publish(file: File, onDone: () => void) {
    promisePopup(
      replace(file),
      {
        pending: t('videoHome.publishing'),
        success: () => {
          refresh()
          onDone()
          return t('videoHome.published')
        },
        error: (error: AxiosError<ApiErrorResponse>) =>
          getErrorMessageFromRequest(error, t('videoHome.publishError')),
      }
    )
  }

  function reset() {
    promisePopup(remove(), {
      pending: t('videoHome.resetting'),
      success: () => {
        refresh()
        return t('videoHome.resetDone')
      },
      error: (error: AxiosError<ApiErrorResponse>) =>
        getErrorMessageFromRequest(error, t('videoHome.resetError')),
    })
  }

  return {
    video: data?.video ?? null,
    isLoading,
    isBusy: isPublishing || isResetting,
    publish,
    reset,
  }
}
