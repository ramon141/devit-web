import { useState } from 'react'
import { useSalesRentalsReportControllerUpcomingRenewals } from '@/api/generated/api'

export function useUpcomingRenewals() {
  const [days, setDays] = useState('30')
  const parsedDays = Number(days)
  const effectiveDays = Number.isInteger(parsedDays) && parsedDays > 0 ? parsedDays : 30

  const { data, isLoading } = useSalesRentalsReportControllerUpcomingRenewals({
    days: effectiveDays,
  })

  return {
    contracts: data ?? [],
    isLoading,
    days,
    setDays,
  }
}
