import type { ImageSourcePropType } from 'react-native'

export const PRODUCT_IMAGES: Record<string, ImageSourcePropType> = {
  produtoLoja1: require('../assets/images/ProdutoLoja1.jpg'),
  produtoLoja2: require('../assets/images/ProdutoLoja2.jpg'),
  produtoLoja3: require('../assets/images/ProdutoLoja3.jpg'),
  produtoLoja4: require('../assets/images/ProdutoLoja4.jpg'),
  produtoLoja5: require('../assets/images/ProdutoLoja5.jpg'),
}

export const DEFAULT_PRODUCT_IMAGE: ImageSourcePropType =
  require('../assets/images/ProdutoLoja1.jpg')
