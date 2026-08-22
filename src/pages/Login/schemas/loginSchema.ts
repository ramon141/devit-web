import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, "L'e-mail è obbligatoria").email('E-mail non valida'),
  password: z.string().min(6, 'La password deve contenere almeno 6 caratteri'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
