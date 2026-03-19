import { z } from 'zod'

export const orderSchema = z.object({
  status: z.enum(['1', '2', '3', '4']),
  description: z.string().min(1, 'Descrição é obrigatória'),
  clientName: z.string().min(1, 'Nome do cliente é obrigatório'),
  clientCPF: z.string().min(1, 'CPF é obrigatório'),
  clientPhone: z.string().min(1, 'Telefone é obrigatório'),
  vehicleBrand: z.string().min(1, 'Marca é obrigatória'),
  vehicleModel: z.string().min(1, 'Modelo é obrigatório'),
  vehicleYear: z.coerce.number().int(),
  vehiclePlate: z.string().min(1, 'Placa é obrigatória'),
  vehicleType: z.enum(['carro', 'moto']),
  vehicleEngine: z.string().min(1, 'Motorização é obrigatória'),
})
