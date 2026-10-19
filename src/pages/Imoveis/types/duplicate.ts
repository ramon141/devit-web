import type { AxiosError } from 'axios'
import type { PropertyControllerCreate409ErrorDetailsItem } from '@/api/generated/models'
import type { ApiErrorResponse } from '@/utils/getErrorMessageFromRequest'

export type PropertyDuplicateViolation = PropertyControllerCreate409ErrorDetailsItem

export type PropertyDuplicateInfo = {
  violations: PropertyDuplicateViolation[]
  message: string
}

const CONFLICT_STATUS = 409

// O backend devolve as violações em `details` apenas nos bloqueios por duplicidade (409)
export function extractDuplicateInfo(error: AxiosError<ApiErrorResponse>): PropertyDuplicateInfo | null {
  if (error.response?.status !== CONFLICT_STATUS) return null

  const apiError = error.response.data?.error
  const violations = apiError?.details as PropertyDuplicateViolation[] | undefined

  if (!violations?.length) return null

  return { violations, message: apiError?.message ?? '' }
}
