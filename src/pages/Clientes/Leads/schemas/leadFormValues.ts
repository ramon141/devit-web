import type { Lead } from '@/api/generated/models'
import type { LeadFormValues } from '@/pages/Clientes/Leads/schemas/leadSchema'

export const emptyLeadFormValues: LeadFormValues = {
  name: '',
  phone: '',
  email: '',
  firstContactAt: '',
  status: 'new',
  source: undefined,
  requestType: undefined,
  desiredCity: '',
  maxBudget: '',
  subject: '',
  lossReason: '',
  notes: '',
  assignedToId: '',
  purpose: undefined,
  categoryId: '',
  expiresAt: '',
  minBudget: '',
  minAreaSqm: '',
  maxAreaSqm: '',
  minRooms: '',
  maxRooms: '',
  minBedrooms: '',
  maxBedrooms: '',
  minBathrooms: '',
  maxBathrooms: '',
  minFloor: '',
  maxFloor: '',
  wantsElevator: false,
  wantsParking: false,
  wantsTerrace: false,
  wantsBalcony: false,
  neighborhoodIds: [],
}

function numberToField(value?: number | null): string {
  return value != null ? String(value) : ''
}

// Faixas e características da richiesta como valores do formulário
function leadCriteriaToFormValues(lead: Lead) {
  return {
    minBudget: numberToField(lead.minBudget),
    minAreaSqm: numberToField(lead.minAreaSqm),
    maxAreaSqm: numberToField(lead.maxAreaSqm),
    minRooms: numberToField(lead.minRooms),
    maxRooms: numberToField(lead.maxRooms),
    minBedrooms: numberToField(lead.minBedrooms),
    maxBedrooms: numberToField(lead.maxBedrooms),
    minBathrooms: numberToField(lead.minBathrooms),
    maxBathrooms: numberToField(lead.maxBathrooms),
    minFloor: numberToField(lead.minFloor),
    maxFloor: numberToField(lead.maxFloor),
    wantsElevator: !!lead.wantsElevator,
    wantsParking: !!lead.wantsParking,
    wantsTerrace: !!lead.wantsTerrace,
    wantsBalcony: !!lead.wantsBalcony,
  }
}

export function leadToFormValues(lead: Lead, neighborhoodIds: string[]): LeadFormValues {
  return {
    name: lead.name,
    phone: lead.phone ?? '',
    email: lead.email ?? '',
    firstContactAt: lead.firstContactAt?.slice(0, 10) ?? '',
    status: lead.status ?? 'new',
    source: lead.source ?? undefined,
    requestType: lead.requestType ?? undefined,
    desiredCity: lead.desiredCity ?? '',
    maxBudget: numberToField(lead.maxBudget),
    subject: lead.subject ?? '',
    lossReason: lead.lossReason ?? '',
    notes: lead.notes ?? '',
    assignedToId: lead.assignedToId ?? '',
    purpose: lead.purpose ?? undefined,
    categoryId: lead.categoryId ?? '',
    expiresAt: lead.expiresAt?.slice(0, 10) ?? '',
    ...leadCriteriaToFormValues(lead),
    neighborhoodIds,
  }
}
