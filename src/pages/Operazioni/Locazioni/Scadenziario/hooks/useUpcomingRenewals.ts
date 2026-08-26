import { useState } from 'react'
import { useSalesRentalsReportControllerUpcomingRenewals } from '@/api/generated/api'

export function useUpcomingRenewals() {
  const [days, setDays] = useState('30')

  const { data, isLoading } = useSalesRentalsReportControllerUpcomingRenewals({
    days: Number(days) || 30,
  })

  return {
    contracts: data ?? [],
    isLoading,
    days,
    setDays,
  }
}
