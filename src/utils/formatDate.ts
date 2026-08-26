import dayjs from 'dayjs'

export function formatDate(value?: string | Date | null) {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

export function formatDateTime(value?: string | Date | null) {
  return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '—'
}
