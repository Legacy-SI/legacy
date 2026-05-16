import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type ProductCardProps = {
  id: string;
  name: string;
  category: string;
  sizes: string[];
  status: 'available' | 'reserved';
  image: ImageSourcePropType;
};

const statusCopy = {
  available: {
    label: 'Disponível',
    action: 'Solicitar reserva',
  },
  reserved: {
    label: 'Esgotado',
    action: 'Ver detalhes',
  },
};

export default function ProductCard({
  id,
  name,
  category,
  sizes,
  status,
  image,
}: ProductCardProps) {
  const router = useRouter();
  const copy = statusCopy[status];

  const handlePress = () => {
    router.push({
      pathname: '/screens/ProductDetailsScreen',
      params: { id },
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.card}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${name}`}
    >
      <View style={styles.imageWrap}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.82)']}
          style={styles.gradient}
        />

        <View style={[styles.statusBadge, status === 'reserved' && styles.statusReserved]}>
          <View style={[styles.statusDot, status === 'reserved' && styles.statusDotReserved]} />
          <Text style={styles.statusText}>{copy.label}</Text>
        </View>

        <View style={styles.overlayContent}>
          <Text style={styles.overlayCategory}>{category}</Text>
          <Text numberOfLines={2} style={styles.overlayName}>
            {name}
          </Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.sizesRow}>
          {sizes.slice(0, 5).map((size) => (
            <View key={size} style={styles.sizeChip}>
              <Text style={styles.sizeChipText}>{size}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.actionBar, status === 'reserved' && styles.actionBarDark]}>
          <Text style={styles.actionText}>{copy.action}</Text>
          <Feather name="arrow-right" size={14} color="#FFFFFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,
    marginRight: 14,
    borderRadius: 14,
    backgroundColor: '#111111',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  imageWrap: {
    height: 265,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 999,
    backgroundColor: '#FF0033',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusReserved: {
    backgroundColor: 'rgba(20,20,20,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  statusDotReserved: {
    backgroundColor: '#AAAAAA',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  overlayContent: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
  },
  overlayCategory: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  overlayName: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 23,
  },
  bottom: {
    padding: 12,
    gap: 10,
  },
  sizesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sizeChip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  sizeChipText: {
    color: '#AAAAAA',
    fontSize: 12,
    fontWeight: '700',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0033',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  actionBarDark: {
    backgroundColor: '#2A2A2A',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
