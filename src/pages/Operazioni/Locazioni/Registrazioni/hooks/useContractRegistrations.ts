import dayjs from 'dayjs'
import { useRentalContractControllerFind } from '@/api/generated/api'

export function useContractRegistrations() {
  const today = dayjs().toISOString()

  const { data, isLoading } = useRentalContractControllerFind({
    filter: {
      where: {
        or: [{ registeredAt: null }, { renewalDueDate: { lt: today } }],
      },
      include: [{ relation: 'property' }, { relation: 'tenant' }],
      order: ['startDate DESC'],
    },
  })

  return {
    contracts: data ?? [],
    isLoading,
  }
}
