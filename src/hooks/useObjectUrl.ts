import { useEffect, useState } from 'react'

// Gera uma URL temporária para o arquivo e a libera quando ele muda
export function useObjectUrl(file?: File) {
  const [objectUrl, setObjectUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!file) {
      setObjectUrl(undefined)
      return
    }

    const url = URL.createObjectURL(file)
    setObjectUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [file])

  return objectUrl
}
