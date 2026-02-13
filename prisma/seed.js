import { prisma } from '../src/lib/prisma.js'

async function main() {
  const workshops = [
    { name: 'teste1' },
    { name: 'teste2' },
    { name: 'teste3' },
    { name: 'teste4' },
  ]

  for (const workshopData of workshops) {
    const workshop = await prisma.workshop.upsert({
      where: { name: workshopData.name },
      update: {},
      create: workshopData,
    })

    const orders = [
      {
        number: 1,
        status: 'open',
        client: 'João Silva',
        vehicle: 'Gol 1.6',
        description: 'Troca de óleo',
      },
      {
        number: 2,
        status: 'in_progress',
        client: 'Maria Souza',
        vehicle: 'Civic 2019',
        description: 'Revisão geral',
      },
      {
        number: 3,
        status: 'done',
        client: null,
        vehicle: 'Onix',
        description: 'Alinhamento e balanceamento',
      },
    ]

    for (const order of orders) {
      await prisma.serviceOrder.upsert({
        where: {
          workshopId_number: {
            workshopId: workshop.id,
            number: order.number,
          },
        },
        update: {},
        create: {
          ...order,
          workshopId: workshop.id,
        },
      })
    }
  }

  console.log('Oficinas e ordens de serviço inseridas com sucesso!')
}

main().catch((e) => {
  console.error('Erro no seed:', e)
  process.exit(1)
})
