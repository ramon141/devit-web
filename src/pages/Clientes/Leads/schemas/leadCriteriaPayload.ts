import { toNumberOrNull } from '@/utils/toNumberOrNull'
import type { LeadFormValues } from '@/pages/Clientes/Leads/schemas/leadSchema'

// Converte os campos numéricos de faixa (string no form) para número ou null
export function buildLeadCriteriaPayload(values: LeadFormValues) {
  return {
    minBudget: toNumberOrNull(values.minBudget),
    minAreaSqm: toNumberOrNull(values.minAreaSqm),
    maxAreaSqm: toNumberOrNull(values.maxAreaSqm),
    minRooms: toNumberOrNull(values.minRooms),
    maxRooms: toNumberOrNull(values.maxRooms),
    minBedrooms: toNumberOrNull(values.minBedrooms),
    maxBedrooms: toNumberOrNull(values.maxBedrooms),
    minBathrooms: toNumberOrNull(values.minBathrooms),
    maxBathrooms: toNumberOrNull(values.maxBathrooms),
  }
}
