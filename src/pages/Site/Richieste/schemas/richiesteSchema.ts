import { z } from 'zod'

export const richiesteSchema = z.object({
  requestType: z.enum(['search', 'valuation']),
  desiredCity: z.string().min(2, 'Inserisci la città'),
  maxBudget: z.string().optional(),
  name: z.string().min(2, 'Inserisci il tuo nome completo'),
  email: z.string().email('Inserisci un indirizzo email valido'),
  phone: z.string().min(6, 'Inserisci un numero di telefono valido'),
  message: z.string().min(5, 'Descrivi la tua richiesta'),
  acceptTerms: z.boolean().refine((value) => value, {
    message: 'Devi accettare i termini sulla privacy',
  }),
})

export type RichiesteFormValues = z.infer<typeof richiesteSchema>
