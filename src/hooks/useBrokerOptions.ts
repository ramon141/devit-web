import { useUserControllerFind } from '@/api/generated/api'
import { formatBroker } from '@/utils/formatBroker'

// Corretores ativos, com o id como valor, para selects de "corretor responsável"
export function useBrokerOptions() {
  const { data: users } = useUserControllerFind({ filter: { order: ['fullName ASC'] } })

  return (users ?? []).flatMap((user) =>
    user.id && user.brokerCode && user.active !== false
      ? [{ value: user.id, label: formatBroker(user) }]
      : [],
  )
}
