import { describe, expect, it } from 'vitest'
import type { Lead } from '@/api/generated/models'
import { buildLeadCriteriaPayload } from '@/pages/Clientes/Leads/schemas/leadCriteriaPayload'
import { emptyLeadFormValues, leadToFormValues } from '@/pages/Clientes/Leads/schemas/leadFormValues'
import type { LeadFormValues } from '@/pages/Clientes/Leads/schemas/leadSchema'

const base: LeadFormValues = { ...emptyLeadFormValues, name: 'Maria Rossi' }

const FEATURES = [
  'wantsElevator', 'wantsParking', 'wantsTerrace', 'wantsBalcony', 'wantsGarden',
  'wantsCondominium', 'wantsLowFloor', 'wantsMidFloor', 'wantsHighFloor',
  'wantsTopFloor', 'wantsBarrierFree',
] as const

describe('buildLeadCriteriaPayload', () => {
  it('T063 envia faixas vazias como null e características como null', () => {
    const payload = buildLeadCriteriaPayload(base)

    expect(Object.values(payload).every((value) => value === null)).toBe(true)
    expect(Object.keys(payload)).toHaveLength(22)
  })

  it('T064 mantém o 0 como valor informado e não como vazio', () => {
    const payload = buildLeadCriteriaPayload({ ...base, minRooms: '0' })

    expect(payload.minRooms).toBe(0)
    expect(payload.maxRooms).toBeNull()
  })

  it('T065 envia só elevador e garagem como exigência e o resto como null', () => {
    const payload = buildLeadCriteriaPayload({
      ...base,
      wantsElevator: true,
      wantsParking: true,
    })

    expect(payload.wantsElevator).toBe(true)
    expect(payload.wantsParking).toBe(true)

    for (const feature of FEATURES.filter((item) => !['wantsElevator', 'wantsParking'].includes(item))) {
      expect(payload[feature]).toBeNull()
      expect(payload[feature]).not.toBe(false)
    }
  })

  it('T066 desmarcar uma característica salva depois volta a ser indiferente', () => {
    const saved: Lead = {
      id: 'l1',
      name: 'Maria',
      wantsTerrace: true,
      createdAt: '2030-01-01T00:00:00Z',
      updatedAt: '2030-01-01T00:00:00Z',
    }
    const reopened = leadToFormValues(saved, [])

    expect(reopened.wantsTerrace).toBe(true)

    const payload = buildLeadCriteriaPayload({ ...reopened, wantsTerrace: false })

    expect(payload.wantsTerrace).toBeNull()
    expect(leadToFormValues({ ...saved, wantsTerrace: null }, []).wantsTerrace).toBe(false)
  })
})
