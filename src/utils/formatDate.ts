import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

const ITALY_TIME_ZONE = 'Europe/Rome'

const UTC_MIDNIGHT = /^\d{4}-\d{2}-\d{2}(T00:00:00(\.000)?Z)?$/

// Datas sem hora chegam como meia-noite UTC; formatar em UTC evita voltar um dia
export function formatDate(value?: string | Date | null) {
  if (!value) return '—'

  if (typeof value === 'string' && UTC_MIDNIGHT.test(value)) {
    return dayjs.utc(value).format('DD/MM/YYYY')
  }

  return dayjs(value).format('DD/MM/YYYY')
}

export function formatDateTime(value?: string | Date | null) {
  return value ? dayjs(value).tz(ITALY_TIME_ZONE).format('DD/MM/YYYY HH:mm:ss') : '—'
}
