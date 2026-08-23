import { z } from 'zod'
import { UserControllerCreateBodyAccessLevel } from '@/api/generated/models'

export const accessLevelOptions = [
  { value: UserControllerCreateBodyAccessLevel.admin, label: 'Amministratore' },
  { value: UserControllerCreateBodyAccessLevel.broker, label: 'Agente' },
]

export const userSchema = z.object({
  fullName: z.string().min(2, 'Inserisci almeno 2 caratteri'),
  email: z.email('E-mail non valida'),
  accessLevel: z.enum(UserControllerCreateBodyAccessLevel, { error: 'Seleziona un livello' }),
  branchId: z.string().optional(),
  active: z.boolean(),
  password: z
    .string()
    .optional()
    .refine((value) => !value || value.length >= 6, 'La password deve contenere almeno 6 caratteri'),
})

export type UserFormValues = z.infer<typeof userSchema>
