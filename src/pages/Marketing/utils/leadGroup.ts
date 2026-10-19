import { normalizeText } from '@/utils/normalizeText'

export type GroupKind = 'lead' | 'person'

export type GroupCandidate = {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  street?: string | null
}

export type OptedOutContacts = {
  emails: Set<string>
  phones: Set<string>
}

export type GroupPartition = {
  eligible: GroupCandidate[]
  withoutContact: number
  optedOut: number
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function matchesStreet(candidate: GroupCandidate, streets: string[]): boolean {
  if (streets.length === 0) return true

  const candidateStreet = normalizeText(candidate.street ?? '')

  return streets.some((street) => candidateStreet.includes(normalizeText(street)))
}

export function isContactOptedOut(candidate: GroupCandidate, optedOut: OptedOutContacts): boolean {
  const email = candidate.email?.trim().toLowerCase()
  const phone = onlyDigits(candidate.phone ?? '')

  return (!!email && optedOut.emails.has(email)) || (!!phone && optedOut.phones.has(phone))
}

// Separa quem pode receber no canal de quem fica de fora (sem contato ou descadastrado)
export function partitionCandidates(
  candidates: GroupCandidate[],
  isEmail: boolean,
  isOptedOut: (candidate: GroupCandidate) => boolean,
): GroupPartition {
  const result: GroupPartition = { eligible: [], withoutContact: 0, optedOut: 0 }

  candidates.forEach((candidate) => {
    if (!(isEmail ? candidate.email : candidate.phone)) {
      result.withoutContact += 1
    } else if (isOptedOut(candidate)) {
      result.optedOut += 1
    } else {
      result.eligible.push(candidate)
    }
  })

  return result
}
