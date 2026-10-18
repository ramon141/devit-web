import { AxiosError, type InternalAxiosRequestConfig } from 'axios'

const SIGNATURE_BYTES = 12

const SIGNATURES: Record<string, RegExp> = {
  'image/png': /^89504e470d0a1a0a/,
  'image/jpeg': /^ffd8ff/,
  'image/gif': /^47494638(37|39)61/,
  'image/webp': /^52494646[0-9a-f]{8}57454250/,
  'application/pdf': /^25504446/,
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

// Espelha o backend: o conteúdo precisa corresponder ao tipo declarado
export async function hasValidFileSignature(file: File) {
  const signature = SIGNATURES[file.type]

  if (!signature) return true

  const header = await file.slice(0, SIGNATURE_BYTES).arrayBuffer()

  return signature.test(toHex(header))
}

const CONTENT_MISMATCH_CODE = 'error_message_file_content_mismatch'
const UNPROCESSABLE_STATUS = 422

// Mesmo formato de erro do backend, para que getErrorMessageFromRequest traduza a mensagem
export function createContentMismatchError() {
  return new AxiosError('File content mismatch', 'ERR_BAD_REQUEST', undefined, undefined, {
    data: { error: { statusCode: UNPROCESSABLE_STATUS, code: CONTENT_MISMATCH_CODE } },
    status: UNPROCESSABLE_STATUS,
    statusText: 'Unprocessable Entity',
    headers: {},
    config: { headers: {} } as InternalAxiosRequestConfig,
  })
}
