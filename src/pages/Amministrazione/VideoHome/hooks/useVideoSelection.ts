import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const HOME_VIDEO_MAX_MB = 40
export const HOME_VIDEO_MAX_SECONDS = 60
const MP4_MIME = 'video/mp4'
const BYTES_PER_MB = 1024 * 1024

function readDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const probe = document.createElement('video')

    probe.preload = 'metadata'
    probe.onloadedmetadata = () => {
      URL.revokeObjectURL(url)
      resolve(probe.duration)
    }
    probe.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('unreadable'))
    }
    probe.src = url
  })
}

// Valida o arquivo escolhido (tipo, tamanho e duração) antes de permitir a publicação
export function useVideoSelection() {
  const { t } = useTranslation('amministrazione')
  const [file, setFile] = useState<File | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)

  async function validate(candidate: File): Promise<string | undefined> {
    if (candidate.type !== MP4_MIME) return t('videoHome.errors.type')

    if (candidate.size > HOME_VIDEO_MAX_MB * BYTES_PER_MB) return t('videoHome.errors.size')

    try {
      const duration = await readDuration(candidate)

      if (duration > HOME_VIDEO_MAX_SECONDS) return t('videoHome.errors.duration')
    } catch {
      return t('videoHome.errors.unreadable')
    }

    return undefined
  }

  async function select(files: File[]) {
    const candidate = files[0]

    setFile(undefined)
    setError(undefined)

    if (!candidate) return

    const problem = await validate(candidate)

    if (problem) {
      setError(problem)
      return
    }

    setFile(candidate)
  }

  function clear() {
    setFile(undefined)
    setError(undefined)
  }

  return { file, error, select, clear }
}
