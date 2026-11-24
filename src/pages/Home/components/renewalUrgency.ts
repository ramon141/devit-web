import dayjs from 'dayjs'

const CRITICAL_DAYS = 7
const WARNING_DAYS = 15

export type RenewalUrgency = {
  daysLeft: number
  accentClassName: string
  badgeClassName: string
}

// Urgência pelos dias até o fim do contrato: vermelho (<= 7), âmbar (<= 15), verde (resto)
export function getRenewalUrgency(dueDate?: string | null): RenewalUrgency {
  const daysLeft = dayjs(dueDate).startOf('day').diff(dayjs().startOf('day'), 'day')

  if (daysLeft <= CRITICAL_DAYS) {
    return {
      daysLeft,
      accentClassName: 'border-l-4 border-l-red-500',
      badgeClassName: 'bg-red-50 text-red-700',
    }
  }

  if (daysLeft <= WARNING_DAYS) {
    return {
      daysLeft,
      accentClassName: 'border-l-4 border-l-amber-500',
      badgeClassName: 'bg-amber-50 text-amber-700',
    }
  }

  return {
    daysLeft,
    accentClassName: 'border-l-4 border-l-emerald-500',
    badgeClassName: 'bg-emerald-50 text-emerald-700',
  }
}
