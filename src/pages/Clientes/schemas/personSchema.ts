import { z } from 'zod'
import { NewPersonRole } from '@/api/generated/models'

export const personRoleOptions = [
  { value: NewPersonRole.owner, label: 'Proprietario' },
  { value: NewPersonRole.tenant, label: 'Inquilino' },
  { value: NewPersonRole.buyer, label: 'Acquirente' },
  { value: NewPersonRole.guarantor, label: 'Garante' },
  { value: NewPersonRole.contact, label: 'Contatto' },
]

export const personSchema = z.object({
  name: z.string().min(2, 'Inserisci almeno 2 caratteri'),
  role: z.enum(NewPersonRole, { error: 'Seleziona un ruolo' }),
  email: z.email('E-mail non valida').optional().or(z.literal('')),
  phone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  documentType: z.string().optional(),
  documentNumber: z.string().optional(),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
})

export type PersonFormValues = z.infer<typeof personSchema>
