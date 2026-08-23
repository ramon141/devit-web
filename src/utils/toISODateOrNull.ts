import dayjs from 'dayjs'

// O devit-api espera date-time completo (ISO), mas os inputs type="date" só dão "YYYY-MM-DD"
export function toISODateOrNull(value?: string | null): string | null {
  if (!value) return null

  return dayjs(value).toISOString()
}
