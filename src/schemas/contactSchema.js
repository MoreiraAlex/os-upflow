import { z } from 'zod'

export const contactSchema = z.object({
  phone: z
    .string()
    .min(10, 'Número inválido')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => /^(\d{10,11})$/.test(val), {
      message: 'Número deve conter 10 ou 11 dígitos',
    }),

  name: z.string().min(1, 'Nome é obrigatório'),
})
