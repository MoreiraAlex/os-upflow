import { prisma } from '../src/lib/prisma.js'

async function main() {
  const workshops = [
    { name: 'teste1' },
    { name: 'teste2' },
    { name: 'teste3' },
    { name: 'teste4' },
  ]

  for (const workshop of workshops) {
    await prisma.workshop.upsert({
      where: { name: workshop.name },
      update: {},
      create: workshop,
    })
  }

  console.log('Oficinas inseridas com sucesso!')
}

main().catch((e) => {
  console.error('Erro no seed:', e)
  process.exit(1)
})
