import type { ImageSourcePropType } from 'react-native';

export type ProductStatus = 'available' | 'reserved';

export type StoreProduct = {
  id: string;
  name: string;
  description: string;
  category: string;
  sizes: string[];
  status: ProductStatus;
  mainImage: ImageSourcePropType;
  gallery: ImageSourcePropType[];
  pickupInfo: string;
  notes: string[];
};

const produtoLoja1 = require('../assets/images/ProdutoLoja1.jpg');
const produtoLoja2 = require('../assets/images/ProdutoLoja2.jpg');
const produtoLoja3 = require('../assets/images/ProdutoLoja3.jpg');
const produtoLoja4 = require('../assets/images/ProdutoLoja4.jpg');
const produtoLoja5 = require('../assets/images/ProdutoLoja5.jpg');

const PICKUP_INFO =
  'A retirada é combinada presencialmente com a equipe Legacy, normalmente em encontros, GCs ou eventos informados pelo ministério.';

const NOTES_AVAILABLE = [
  'A solicitação não envolve pagamento online.',
  'A peça fica sujeita à confirmação de disponibilidade.',
  'A equipe entrará em contato para alinhar separação e retirada.',
];

const NOTES_RESERVED = [
  'Este item está esgotado no momento.',
  'Você ainda pode demonstrar interesse para ser avisado sobre nova disponibilidade.',
  'Não há pagamento online, carrinho ou checkout pelo aplicativo.',
];

export const storeProducts: StoreProduct[] = [
  {
    id: 'moletom-legacy-rebel',
    name: 'Moletom Legacy Rebel',
    description:
      'Moletom oversized preto com bordado "Rebel Minds" — uma peça que representa a identidade da comunidade Legacy: ousada, intencional e transformadora.',
    category: 'Moletons',
    sizes: ['P', 'M', 'G', 'GG'],
    status: 'available',
    mainImage: produtoLoja1,
    gallery: [produtoLoja1],
    pickupInfo: PICKUP_INFO,
    notes: NOTES_AVAILABLE,
  },
  {
    id: 'bone-legacy-phoenix',
    name: 'Boné Legacy Phoenix',
    description:
      'Boné preto com fênix vermelha bordada. Simboliza renovação e propósito — peça de identidade da família Legacy, ideal para uso no dia a dia.',
    category: 'Acessórios',
    sizes: ['Único'],
    status: 'available',
    mainImage: produtoLoja2,
    gallery: [produtoLoja2],
    pickupInfo: PICKUP_INFO,
    notes: NOTES_AVAILABLE,
  },
  {
    id: 'shoulder-bag-legacy',
    name: 'Shoulder Bag Legacy',
    description:
      'Bolsa crossbody preta com detalhes e fivelas vermelhas. Compacta e funcional, com patch exclusivo da comunidade — para quem leva o propósito onde for.',
    category: 'Bolsas',
    sizes: ['Único'],
    status: 'reserved',
    mainImage: produtoLoja3,
    gallery: [produtoLoja3],
    pickupInfo:
      'Quando voltar a ficar disponível, a retirada será presencial mediante combinação com a equipe Legacy.',
    notes: NOTES_RESERVED,
  },
  {
    id: 'moletom-legacy-fire',
    name: 'Moletom Legacy Fire',
    description:
      'Moletom vermelho Legacy — uma peça que carrega cor, identidade e fogo. Para quem não tem medo de aparecer e representar a comunidade com boldness.',
    category: 'Moletons',
    sizes: ['P', 'M', 'G', 'GG'],
    status: 'available',
    mainImage: produtoLoja4,
    gallery: [produtoLoja4],
    pickupInfo: PICKUP_INFO,
    notes: NOTES_AVAILABLE,
  },
  {
    id: 'meias-legacy-athlete',
    name: 'Meias Legacy Athlete',
    description:
      'Meias brancas com listras e bordado em vermelho. Detalhes que fazem a diferença — para completar o look com identidade de quem pertence à família Legacy.',
    category: 'Acessórios',
    sizes: ['35-38', '39-43'],
    status: 'available',
    mainImage: produtoLoja5,
    gallery: [produtoLoja5],
    pickupInfo: PICKUP_INFO,
    notes: NOTES_AVAILABLE,
  },
];

export function getProductById(id?: string | string[]) {
  const productId = Array.isArray(id) ? id[0] : id;
  return storeProducts.find((product) => product.id === productId);
}
