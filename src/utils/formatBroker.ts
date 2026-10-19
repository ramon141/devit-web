import type { Property, PropertyWithRelations, User } from '@/api/generated/models'

type BrokerLike = Pick<User, 'fullName' | 'brokerCode'> | null | undefined

const EMPTY_BROKER_LABEL = '—'

// Corretor sempre aparece com o código na frente quando ele existe
export function formatBroker(broker: BrokerLike): string {
  if (!broker) return EMPTY_BROKER_LABEL

  return broker.brokerCode ? `${broker.brokerCode} - ${broker.fullName}` : broker.fullName
}

// Propostas, vendas e locações trazem o imóvel com o corretor responsável já carregado
export function formatPropertyBroker(property?: Property | null): string {
  return formatBroker((property as PropertyWithRelations | undefined)?.responsibleBroker)
}
