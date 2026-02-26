import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export async function buscarCNPJ(cnpj) {
  const cnpjNumbers = cnpj.replace(/\D/g, '')
  try {
    const res = await fetch(
      `https://brasilapi.com.br/api/cnpj/v1/${cnpjNumbers}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Accept: 'application/json',
        },
        cache: 'no-store',
      },
    )

    if (!res.ok) throw new Error('CNPJ não encontrado')
    const data = await res.json()

    return {
      name: data.razao_social,
      fantasyName: data.nome_fantasia,
      email: data.email,
      phone: data.ddd_telefone_1,
      address: data.logradouro,
      number: data.numero,
      district: data.bairro,
      city: data.municipio,
      state: data.uf,
      zipCode: data.cep,
    }
  } catch (error) {
    console.error('Erro ao buscar CNPJ:', error)
    throw error
  }
}

export function formatarCNPJ(value) {
  let c = value.replace(/\D/g, '')
  if (c.length > 14) c = c.slice(0, 14)
  c = c.replace(/^(\d{2})(\d)/, '$1.$2')
  c = c.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
  c = c.replace(/\.(\d{3})(\d)/, '.$1/$2')
  c = c.replace(/(\d{4})(\d)/, '$1-$2')
  return c
}

export function validarCNPJ(value) {
  const cnpjNumbers = value.replace(/\D/g, '')

  if (cnpjNumbers.length !== 14) return false
  if (/^(\d)\1+$/.test(cnpjNumbers)) return false

  let tamanho = cnpjNumbers.length - 2
  let numeros = cnpjNumbers.substring(0, tamanho)
  const digitos = cnpjNumbers.substring(tamanho)

  let soma = 0
  let pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)

  if (resultado !== Number(digitos.charAt(0))) return false

  tamanho += 1
  numeros = cnpjNumbers.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)

  return resultado === Number(digitos.charAt(1))
}
