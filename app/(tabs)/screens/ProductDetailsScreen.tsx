import { Feather } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DEFAULT_PRODUCT_IMAGE, PRODUCT_IMAGES } from '../../../constants/productImages'
import { ApiProduct, useReservation } from '../../../contexts/ReservationContext'
import { api } from '../../../services/api'

const PICKUP_INFO =
  'A retirada é combinada presencialmente com a equipe Legacy, normalmente em encontros, GCs ou eventos informados pelo ministério.'

export default function ProductDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const { addItem, reservation, isLoading: reservationLoading } = useReservation()

  const insets = useSafeAreaInsets()
  const [product, setProduct] = useState<ApiProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [reserving, setReserving] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!id) return
    api
      .get<ApiProduct>(`/products/${id}`)
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const isOutOfStock = product ? product.stockQuantity === 0 : false
  const cartItem = reservation?.items.find((item) => item.productId === product?.id)
  const isInCart = Boolean(cartItem)

  const image = product
    ? (PRODUCT_IMAGES[product.imageUrl] ?? DEFAULT_PRODUCT_IMAGE)
    : DEFAULT_PRODUCT_IMAGE

  const needsSizeSelection = (product?.sizes ?? []).length > 0
  const canReserve = !needsSizeSelection || selectedSize !== null

  const handleReserve = async () => {
    if (!product) return
    if (needsSizeSelection && !selectedSize) {
      Alert.alert('Selecione um tamanho', 'Escolha o tamanho desejado antes de reservar.')
      return
    }
    try {
      setReserving(true)
      await addItem(product.id, quantity, selectedSize ?? undefined)
      Alert.alert(
        'Reserva feita!',
        `${quantity}x ${product.name}${selectedSize ? ` — Tam. ${selectedSize}` : ''}\n\nRetirada presencial com a equipe Legacy.`,
      )
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Não foi possível reservar'
      Alert.alert('Erro ao reservar', message)
    } finally {
      setReserving(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#FF0033" size="large" />
      </View>
    )
  }

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Feather name="alert-circle" size={48} color="#CCCCCC" />
        <Text style={styles.errorText}>Produto não encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backFallback}>
          <Text style={styles.backFallbackText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <Feather name="chevron-left" size={26} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da peça</Text>
        <View style={styles.headerSpacer} />
      </View>

      <Image source={image} style={styles.mainImage} contentFit="cover" />

      <View style={styles.productHeader}>
        <View style={[styles.statusBadge, isOutOfStock && styles.statusBadgeEsgotado]}>
          <View style={[styles.statusDot, isOutOfStock && styles.statusDotEsgotado]} />
          <Text style={styles.statusText}>{isOutOfStock ? 'Esgotado' : 'Disponível'}</Text>
        </View>

        {!isOutOfStock && (
          <Text style={styles.stockCount}>{product.stockQuantity} unidades disponíveis</Text>
        )}

        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Tamanhos disponíveis
          {needsSizeSelection && !selectedSize && (
            <Text style={styles.sizeHint}> — selecione um</Text>
          )}
        </Text>
        <View style={styles.sizeList}>
          {product.sizes.map((size) => {
            const isSelected = selectedSize === size
            return (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(isSelected ? null : size)}
                style={[styles.sizeChip, isSelected && styles.sizeChipSelected]}
                activeOpacity={0.7}
              >
                <Text style={[styles.sizeText, isSelected && styles.sizeTextSelected]}>
                  {size}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* Quantity selector */}
      {!isOutOfStock && (
        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>Quantidade</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              <Feather name="minus" size={18} color={quantity <= 1 ? '#CCCCCC' : '#111111'} />
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{quantity}</Text>

            <TouchableOpacity
              style={[
                styles.qtyBtn,
                quantity >= (product?.stockQuantity ?? 1) && styles.qtyBtnDisabled,
              ]}
              onPress={() =>
                setQuantity((q) => Math.min(product?.stockQuantity ?? 1, q + 1))
              }
              disabled={quantity >= (product?.stockQuantity ?? 1)}
            >
              <Feather
                name="plus"
                size={18}
                color={quantity >= (product?.stockQuantity ?? 1) ? '#CCCCCC' : '#111111'}
              />
            </TouchableOpacity>

            <Text style={styles.qtyStock}>
              {product?.stockQuantity} disponíveis
            </Text>
          </View>
        </View>
      )}

      <View style={styles.infoPanel}>
        <Feather name="map-pin" size={22} color="#FF0033" />
        <View style={styles.infoTextWrap}>
          <Text style={styles.infoTitle}>Retirada presencial</Text>
          <Text style={styles.infoText}>{PICKUP_INFO}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Observações importantes</Text>
        {[
          'A solicitação não envolve pagamento online.',
          'A peça fica sujeita à confirmação de disponibilidade.',
          'A equipe entrará em contato para alinhar separação e retirada.',
        ].map((note) => (
          <View key={note} style={styles.noteRow}>
            <Feather name="check-circle" size={16} color="#FF0033" />
            <Text style={styles.noteText}>{note}</Text>
          </View>
        ))}
      </View>

      {/* Primary action button */}
      {isOutOfStock ? (
        <View style={[styles.primaryButton, styles.primaryButtonDisabled]}>
          <Feather name="x-circle" size={18} color="#888888" />
          <Text style={[styles.primaryButtonText, styles.primaryButtonTextDisabled]}>
            PRODUTO ESGOTADO
          </Text>
        </View>
      ) : isInCart ? (
        <View style={[styles.primaryButton, styles.primaryButtonInCart]}>
          <Feather name="check-circle" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>
            NO CARRINHO ({cartItem?.quantity} {cartItem?.quantity === 1 ? 'un.' : 'uns.'})
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.primaryButton}
          onPress={handleReserve}
          disabled={reserving || reservationLoading}
        >
          {reserving ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Feather name="bookmark" size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>RESERVAR ESTE ITEM</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    color: '#555555',
    fontWeight: '700',
  },
  backFallback: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
  },
  backFallbackText: {
    color: '#111111',
    fontWeight: '700',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '800',
  },
  headerSpacer: {
    width: 42,
  },
  mainImage: {
    width: '100%',
    height: 410,
    backgroundColor: '#F2F2F2',
  },
  productHeader: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 999,
    backgroundColor: '#FFF1F4',
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginBottom: 8,
  },
  statusBadgeEsgotado: {
    backgroundColor: '#F5F5F5',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0033',
  },
  statusDotEsgotado: {
    backgroundColor: '#AAAAAA',
  },
  statusText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  stockCount: {
    color: '#66BB6A',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  category: {
    color: '#777777',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  name: {
    color: '#111111',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 7,
    lineHeight: 34,
  },
  description: {
    color: '#555555',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 12,
  },
  sizeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeHint: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF0033',
  },
  sizeChip: {
    minWidth: 46,
    height: 42,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  sizeChipSelected: {
    borderColor: '#FF0033',
    backgroundColor: '#FF0033',
  },
  sizeText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '800',
  },
  sizeTextSelected: {
    color: '#FFFFFF',
  },
  quantitySection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnDisabled: {
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
  },
  qtyValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111111',
    minWidth: 32,
    textAlign: 'center',
  },
  qtyStock: {
    fontSize: 12,
    color: '#66BB6A',
    fontWeight: '700',
    marginLeft: 4,
  },
  infoPanel: {
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 8,
    backgroundColor: '#111111',
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6,
  },
  infoText: {
    color: '#D6D6D6',
    fontSize: 13,
    lineHeight: 19,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    marginBottom: 10,
  },
  noteText: {
    flex: 1,
    color: '#555555',
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    marginHorizontal: 16,
    marginTop: 26,
    borderRadius: 8,
    backgroundColor: '#FF0033',
    minHeight: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButtonDisabled: {
    backgroundColor: '#F0F0F0',
  },
  primaryButtonInCart: {
    backgroundColor: '#2E7D32',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  primaryButtonTextDisabled: {
    color: '#888888',
  },
})
