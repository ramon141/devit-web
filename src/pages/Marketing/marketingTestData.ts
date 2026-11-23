import {
  getCommunicationTemplateControllerFindResponseMock,
  getLeadControllerFindResponseMock,
  getMarketingCampaignControllerListResponseMock,
  getPersonControllerFindResponseMock,
} from '@/api/generated/api.msw'
import type {
  CommunicationTemplateWithRelations,
  LeadWithRelations,
  MarketingCampaignControllerList200Item,
  PersonWithRelations,
} from '@/api/generated/models'

// Fábricas de dados para os testes de Marketing: partem do mock do orval e fixam só o que importa.

export function makePerson(overrides: Partial<PersonWithRelations>): PersonWithRelations {
  return {
    ...getPersonControllerFindResponseMock()[0],
    address: undefined,
    ...overrides,
  } as PersonWithRelations
}

export function makeLead(overrides: Partial<LeadWithRelations>): LeadWithRelations {
  return { ...getLeadControllerFindResponseMock()[0], ...overrides } as LeadWithRelations
}

export function makeTemplate(
  overrides: Partial<CommunicationTemplateWithRelations>,
): CommunicationTemplateWithRelations {
  return {
    ...getCommunicationTemplateControllerFindResponseMock()[0],
    ...overrides,
  } as CommunicationTemplateWithRelations
}

export function makeCampaign(
  overrides: Partial<MarketingCampaignControllerList200Item>,
): MarketingCampaignControllerList200Item {
  return { ...getMarketingCampaignControllerListResponseMock()[0], ...overrides }
}

// Pega o item de um índice ou falha com erro claro (evita undefined nos testes).
export function at<T>(list: T[], index: number): T {
  const item = list[index]

  if (item === undefined) throw new Error(`item ${index} não encontrado`)

  return item
}
