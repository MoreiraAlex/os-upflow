import { z } from 'zod'

export const orderSchema = z.object({
  client: z.string().optional(),
  vehicle: z.string().min(1, 'Veículo é obrigatório'),
  status: z.enum(['1', '2', '3', '4']),
  description: z.string().optional(),
})
