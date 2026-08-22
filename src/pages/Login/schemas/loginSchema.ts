import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, "L'e-mail è obbligatoria").email('E-mail non valida'),
  password: z.string().min(1, 'La password è obbligatoria'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
