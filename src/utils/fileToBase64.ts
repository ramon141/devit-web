import { createContentMismatchError, hasValidFileSignature } from '@/utils/hasValidFileSignature'

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '')
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Valida a assinatura do arquivo antes do envio, como o backend faz
export async function fileToBase64(file: File): Promise<string> {
  if (!(await hasValidFileSignature(file))) {
    throw createContentMismatchError()
  }

  return readAsBase64(file)
}
