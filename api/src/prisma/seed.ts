import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const products = [
  {
    name: 'Moletom Legacy Rebel',
    description:
      'Moletom oversized preto com bordado "Rebel Minds" — uma peça que representa a identidade da comunidade Legacy: ousada, intencional e transformadora.',
    imageUrl: 'produtoLoja1',
    category: 'Moletons',
    sizes: ['P', 'M', 'G', 'GG'],
    stockQuantity: 10,
  },
  {
    name: 'Boné Legacy Phoenix',
    description:
      'Boné preto com fênix vermelha bordada. Simboliza renovação e propósito — peça de identidade da família Legacy, ideal para uso no dia a dia.',
    imageUrl: 'produtoLoja2',
    category: 'Acessórios',
    sizes: ['Único'],
    stockQuantity: 15,
  },
  {
    name: 'Shoulder Bag Legacy',
    description:
      'Bolsa crossbody preta com detalhes e fivelas vermelhas. Compacta e funcional, com patch exclusivo da comunidade — para quem leva o propósito onde for.',
    imageUrl: 'produtoLoja3',
    category: 'Bolsas',
    sizes: ['Único'],
    stockQuantity: 0,
  },
  {
    name: 'Moletom Legacy Fire',
    description:
      'Moletom vermelho Legacy — uma peça que carrega cor, identidade e fogo. Para quem não tem medo de aparecer e representar a comunidade com boldness.',
    imageUrl: 'produtoLoja4',
    category: 'Moletons',
    sizes: ['P', 'M', 'G', 'GG'],
    stockQuantity: 8,
  },
  {
    name: 'Meias Legacy Athlete',
    description:
      'Meias brancas com listras e bordado em vermelho. Detalhes que fazem a diferença — para completar o look com identidade de quem pertence à família Legacy.',
    imageUrl: 'produtoLoja5',
    category: 'Acessórios',
    sizes: ['35-38', '39-43'],
    stockQuantity: 20,
  },
]

async function main() {
  const count = await prisma.product.count()

  if (count > 0) {
    console.log(`Seed ignorado: ${count} produto(s) já existem no banco.`)
    return
  }

  const created = await prisma.product.createMany({ data: products })
  console.log(`✅ Seed concluído! ${created.count} produtos criados.`)
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
