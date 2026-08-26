import { z } from 'zod'

export const contattiSchema = z.object({
  name: z.string().min(2, 'Inserisci il tuo nome completo'),
  email: z.string().email('Inserisci un indirizzo email valido'),
  phone: z.string().min(6, 'Inserisci un numero di telefono valido'),
  subject: z.string().optional(),
  message: z.string().min(5, 'Scrivi il tuo messaggio'),
  acceptPrivacy: z.boolean().refine((value) => value, {
    message: 'Devi accettare la Privacy e Cookie Policy',
  }),
})

export type ContattiFormValues = z.infer<typeof contattiSchema>
