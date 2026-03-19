import { auth } from '../src/lib/auth.js'

async function main() {
  try {
    await auth.api.signUpEmail({
      body: {
        email: 'bot@osupflow.com',
        password: '8V292fC56xJ0',
        username: 'bot',
        name: 'bot',
        displayUsername: 'bot',
      },
    })
  } catch (err) {
    console.error(err)
  }
}

main().catch((e) => {
  console.error('Erro no seed:', e)
  process.exit(1)
})
