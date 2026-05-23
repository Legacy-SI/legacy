import { Feather } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { DEFAULT_PRODUCT_IMAGE, PRODUCT_IMAGES } from '../../constants/productImages'
import { ReservationItem, useReservation } from '../../contexts/ReservationContext'

function CartItemRow({
  item,
  onRemove,
  onDecrement,
}: {
  item: ReservationItem
  onRemove: () => void
  onDecrement: () => void
}) {
  const image = PRODUCT_IMAGES[item.product.imageUrl] ?? DEFAULT_PRODUCT_IMAGE

  return (
    <View style={styles.itemRow}>
      <Image source={image} style={styles.itemImage} contentFit="cover" />
      <View style={styles.itemInfo}>
        <Text numberOfLines={1} style={styles.itemName}>
          {item.product.name}
        </Text>
        <Text style={styles.itemCategory}>{item.product.category}</Text>
        {item.size && (
          <View style={styles.itemSizeBadge}>
            <Text style={styles.itemSizeText}>Tam. {item.size}</Text>
          </View>
        )}
        <Text style={styles.itemQty}>
          {item.quantity} {item.quantity === 1 ? 'unidade' : 'unidades'}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          onPress={onDecrement}
          style={[styles.qtyActionBtn, item.quantity <= 1 && styles.qtyActionBtnDisabled]}
          disabled={item.quantity <= 1}
          accessibilityLabel="Diminuir quantidade"
        >
          <Feather name="minus" size={15} color={item.quantity <= 1 ? '#CCCCCC' : '#555555'} />
        </TouchableOpacity>
        <Text style={styles.qtyActionValue}>{item.quantity}</Text>
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn} accessibilityLabel="Remover item">
          <Feather name="trash-2" size={16} color="#FF0033" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

type CartModalProps = {
  visible: boolean
  onClose: () => void
}

export default function CartModal({ visible, onClose }: CartModalProps) {
  const { reservation, isLoading, itemCount, addItem, removeItem, cancelReservation } = useReservation()

  const items = reservation?.items ?? []

  const handleRemove = (itemId: string, name: string) => {
    Alert.alert('Remover item', `Remover "${name}" da reserva?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removeItem(itemId) },
    ])
  }

  const handleCancelAll = () => {
    Alert.alert(
      'Cancelar reserva',
      'Tem certeza? Todos os itens serão devolvidos ao estoque.',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Cancelar tudo',
          style: 'destructive',
          onPress: async () => {
            await cancelReservation()
            onClose()
          },
        },
      ],
    )
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Minha Reserva</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={22} color="#111111" />
            </TouchableOpacity>
          </View>

          {isLoading && (
            <View style={styles.centered}>
              <ActivityIndicator color="#FF0033" size="large" />
            </View>
          )}

          {!isLoading && items.length === 0 && (
            <View style={styles.centered}>
              <Feather name="shopping-bag" size={52} color="#DDDDDD" />
              <Text style={styles.emptyTitle}>Nenhuma reserva ativa</Text>
              <Text style={styles.emptyDesc}>
                Adicione produtos disponíveis para reservar presencialmente.
              </Text>
            </View>
          )}

          {!isLoading && items.length > 0 && (
            <>
              <Text style={styles.countText}>
                {itemCount} {itemCount === 1 ? 'item reservado' : 'itens reservados'}
              </Text>

              <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                style={styles.list}
                renderItem={({ item }) => (
                  <CartItemRow
                    item={item}
                    onRemove={() => handleRemove(item.id, item.product.name)}
                    onDecrement={() =>
                      addItem(item.productId, item.quantity - 1, item.size ?? undefined)
                    }
                  />
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />

              <TouchableOpacity style={styles.cancelAllBtn} onPress={handleCancelAll}>
                <Feather name="x-circle" size={16} color="#FF0033" />
                <Text style={styles.cancelAllText}>Cancelar toda a reserva</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.notice}>
            <Feather name="map-pin" size={13} color="#888888" />
            <Text style={styles.noticeText}>
              Retirada presencial com a equipe Legacy. Sem pagamento online.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDDDDD',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#111111',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333333',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 20,
  },
  countText: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  list: {
    flexGrow: 0,
    maxHeight: 380,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F2F2F2',
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111111',
  },
  itemCategory: {
    fontSize: 11,
    color: '#888888',
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  itemSizeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 3,
  },
  itemSizeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#333333',
  },
  itemQty: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '600',
    marginTop: 2,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyActionBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyActionBtnDisabled: {
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
  },
  qtyActionValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111111',
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
  cancelAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FF0033',
    borderRadius: 8,
    paddingVertical: 13,
    gap: 8,
  },
  cancelAllText: {
    color: '#FF0033',
    fontSize: 14,
    fontWeight: '800',
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#888888',
    lineHeight: 17,
  },
})
