import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getProductById, storeProducts } from '../../../constants/storeProducts';

const WHATSAPP_LINK = 'https://chat.whatsapp.com/Bbur8Y6zQBpGOkqxdfVb4q';

const statusCopy = {
  available: {
    label: 'Disponível',
    action: 'Solicitar reserva presencial',
    description: 'A equipe confirma a peça e combina a retirada com você.',
  },
  reserved: {
    label: 'Esgotado',
    action: 'Demonstrar interesse',
    description: 'Este item está esgotado, mas você pode sinalizar interesse para ser avisado quando voltar.',
  },
};

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const product = useMemo(() => getProductById(id) ?? storeProducts[0], [id]);
  const [selectedImage, setSelectedImage] = useState(product.mainImage);
  const copy = statusCopy[product.status];

  const handlePrimaryAction = () => {
    Alert.alert(
      product.status === 'available' ? 'Solicitação registrada' : 'Interesse registrado',
      `${copy.description}\n\nNão há pagamento online, carrinho ou checkout pelo aplicativo.`,
      [
        { text: 'Depois', style: 'cancel' },
        {
          text: 'Falar no WhatsApp',
          onPress: () => Linking.openURL(WHATSAPP_LINK),
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
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

      <Image source={selectedImage} style={styles.mainImage} resizeMode="cover" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gallery}
      >
        {product.gallery.map((image, index) => (
          <TouchableOpacity
            key={`${product.id}-${index}`}
            activeOpacity={0.85}
            onPress={() => setSelectedImage(image)}
            style={styles.thumbnailButton}
          >
            <Image source={image} style={styles.thumbnail} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.productHeader}>
        <View style={styles.statusBadge}>
          <View
            style={[
              styles.statusDot,
              product.status === 'reserved' && styles.statusDotReserved,
            ]}
          />
          <Text style={styles.statusText}>{copy.label}</Text>
        </View>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tamanhos disponíveis</Text>
        <View style={styles.sizeList}>
          {product.sizes.map((size) => (
            <View key={size} style={styles.sizeChip}>
              <Text style={styles.sizeText}>{size}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoPanel}>
        <Feather name="map-pin" size={22} color="#FF0033" />
        <View style={styles.infoTextWrap}>
          <Text style={styles.infoTitle}>Retirada presencial</Text>
          <Text style={styles.infoText}>{product.pickupInfo}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Observações importantes</Text>
        {product.notes.map((note) => (
          <View key={note} style={styles.noteRow}>
            <Feather name="check-circle" size={16} color="#FF0033" />
            <Text style={styles.noteText}>{note}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.primaryButton,
          product.status === 'reserved' && styles.primaryButtonDark,
        ]}
        onPress={handlePrimaryAction}
      >
        <Text style={styles.primaryButtonText}>{copy.action}</Text>
        <Feather name="arrow-right" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingBottom: 32,
  },
  header: {
    paddingTop: 18,
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
  gallery: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 10,
  },
  thumbnailButton: {
    width: 74,
    height: 74,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
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
    marginBottom: 14,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0033',
  },
  statusDotReserved: {
    backgroundColor: '#222222',
  },
  statusText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
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
  sizeChip: {
    minWidth: 46,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  sizeText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '800',
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
  primaryButtonDark: {
    backgroundColor: '#111111',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});

