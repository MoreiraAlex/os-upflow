import { z } from 'zod'

export const contactSchema = z.object({
  phone: z
    .string()
    .transform((v) => v.replace(/\D/g, ''))
    .refine((v) => /^(\d{2})9\d{8}$/.test(v), {
      message: 'Informe um WhatsApp válido (DDD + número)',
    }),

  name: z.string().min(1, 'Nome é obrigatório'),
})
