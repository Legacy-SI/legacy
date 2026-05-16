import { Feather, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductCard from '../../../components/store/ProductCard';
import { storeProducts } from '../../../constants/storeProducts';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GC_CARD_WIDTH = SCREEN_WIDTH - 32;

const events = [
  { uri: require('../../../assets/images/ImgProxEventoThree.png') },
  { uri: require('../../../assets/images/ImgProxEventoFour.png') },
];

const gcGroups = [
  {
    id: '1',
    name: 'GC LEGACY FLAME',
    initial: 'F',
    leaders: '',
    day: 'Quarta-feira às 20h',
    distance: '',
    isClosest: false,
    address: 'Alameda Ohio, 193, Tamboré, Barueri, SP, Brasil',
    gradientColors: ['#CC0022', '#200005'] as const,
  },
  {
    id: '2',
    name: 'GC LEGACY SOLDIERS',
    initial: 'S',
    leaders: '',
    day: 'Quinta-feira às 20h',
    distance: '',
    isClosest: false,
    address: 'Avenida Copacabana, 268, sala 1906',
    gradientColors: ['#1040DD', '#000820'] as const,
  },
  {
    id: '3',
    name: 'GC LEGACY VISION',
    initial: 'V',
    leaders: '',
    day: 'Quarta-feira às 20h',
    distance: '',
    isClosest: false,
    address: 'Rua Bonnard, 132, Condomínio Acqua Park, Apto 272, Bloco C, Green Valley',
    gradientColors: ['#0DB350', '#001810'] as const,
  },
];

const GC_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfqNqmBL6ZkIECPjNwjGdnLZ_JamYNR_0v6WjllROjSXjW5zQ/viewform';

const socialLinks = {
  globe: 'https://bio.site/legacyalphaville',
  instagram: 'https://www.instagram.com/legacyalphaville',
  whatsapp: 'https://chat.whatsapp.com/Bbur8Y6zQBpGOkqxdfVb4q',
};

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleOpenMaps = (address: string) => {
    const encoded = encodeURIComponent(address);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      bounces={false}
      overScrollMode="never"
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LEGACY</Text>
        <View style={styles.headerActions}>
          <Text style={styles.headerWelcome}>BEM-VINDO</Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
            accessibilityLabel="Sair"
          >
            <Feather name="log-out" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>PRÓXIMOS EVENTOS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.eventScroll}>
        {events.map((item, index) => (
          <Image key={index} source={item.uri} style={styles.eventImage} resizeMode="cover" />
        ))}
      </ScrollView>

      <View style={styles.gcBannerCard}>
        <ImageBackground
          source={require('../../../assets/images/ImgProxEventoTwo.jpg')}
          style={styles.gcBannerBg}
          imageStyle={styles.gcBannerImg}
        >
          <View style={styles.gcBannerOverlay}>
            <View style={styles.gcBadge}>
              <View style={styles.gcBadgeDot} />
              <Text style={styles.gcBadgeText}>COMUNIDADE</Text>
            </View>
            <Text style={styles.gcBannerTitle}>
              {'A IGREJA ALÉM\n'}
              <Text style={styles.gcBannerTitleRed}>DO DOMINGO</Text>
            </Text>
            <Text style={styles.gcBannerDesc}>
              Os GCs se reúnem nas casas durante a semana. Role para o lado e encontre o grupo
              mais próximo de você.
            </Text>
          </View>
        </ImageBackground>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.gcScroll}
        contentContainerStyle={styles.gcScrollContent}
        snapToInterval={SCREEN_WIDTH}
        decelerationRate="fast"
      >
        {gcGroups.map((gc) => (
          <LinearGradient key={gc.id} colors={gc.gradientColors} style={styles.gcCard}>
            <Text style={styles.gcCardDecoLetter}>{gc.initial}</Text>
            <View style={styles.gcCardContent}>
              {gc.distance ? (
                <View style={gc.isClosest ? styles.gcDistanceBadgeClosest : styles.gcDistanceBadgeNormal}>
                  <Text style={styles.gcDistanceText}>
                    {gc.isClosest ? `MAIS PRÓXIMO - ${gc.distance}` : gc.distance}
                  </Text>
                </View>
              ) : null}
              <Text style={styles.gcCardName}>{gc.name}</Text>
              {gc.leaders ? (
                <View style={styles.gcCardInfoRow}>
                  <Feather name="user" size={14} color="#fff" />
                  <Text style={styles.gcCardInfoText}>Líderes: {gc.leaders}</Text>
                </View>
              ) : null}
              <View style={styles.gcCardInfoRow}>
                <Feather name="calendar" size={14} color="#fff" />
                <Text style={styles.gcCardInfoText}>{gc.day}</Text>
              </View>
              <TouchableOpacity
                style={styles.gcLocationBtn}
                onPress={() => handleOpenMaps(gc.address)}
              >
                <Feather name="map-pin" size={16} color="#000" />
                <Text style={styles.gcLocationBtnText}>VER LOCALIZAÇÃO</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>

      <View style={styles.gcFormCard}>
        <View style={styles.gcFormAccent} />
        <View style={styles.gcFormContent}>
          <Feather name="map-pin" size={22} color="#FF0033" style={styles.gcFormIcon} />
          <Text style={styles.gcFormTitle}>Nenhum GC perto de você?</Text>
          <Text style={styles.gcFormDesc}>
            Preencha o formulário e em breve um de nossos líderes vai te conectar à família Legacy.
          </Text>
          <TouchableOpacity style={styles.gcFormBtn} onPress={() => handleOpenLink(GC_FORM_URL)}>
            <Text style={styles.gcFormBtnText}>QUERO FAZER PARTE</Text>
            <Feather name="arrow-right" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.storeSection}>
        <View style={styles.storeHeader}>
          <View style={styles.storeEyebrowRow}>
            <View style={styles.storeEyebrowDot} />
            <Text style={styles.storeEyebrow}>CATÁLOGO SOLIDÁRIO</Text>
          </View>
          <Text style={styles.storeTitle}>Conheça nossa loja</Text>
          <Text style={styles.storeDescription}>
            Veja as peças disponíveis, escolha um tamanho e solicite a separação para retirada
            presencial. Sem carrinho, checkout ou pagamento online pelo app.
          </Text>
        </View>

        <View style={styles.storeFlow}>
          <View style={styles.storeFlowStep}>
            <View style={styles.storeFlowCircle}>
              <Feather name="search" size={15} color="#FFFFFF" />
            </View>
            <Text style={styles.storeFlowLabel}>{'Escolha\na peça'}</Text>
          </View>
          <View style={styles.storeFlowLine} />
          <View style={styles.storeFlowStep}>
            <View style={styles.storeFlowCircle}>
              <Feather name="bookmark" size={15} color="#FFFFFF" />
            </View>
            <Text style={styles.storeFlowLabel}>{'Solicite\nreserva'}</Text>
          </View>
          <View style={styles.storeFlowLine} />
          <View style={styles.storeFlowStep}>
            <View style={styles.storeFlowCircle}>
              <Feather name="map-pin" size={15} color="#FFFFFF" />
            </View>
            <Text style={styles.storeFlowLabel}>{'Retire\npresencial'}</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storeProductList}
        >
          {storeProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              sizes={product.sizes}
              status={product.status}
              image={product.mainImage}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerDivider} />

        <Text style={styles.footerBrand}>LEGACY</Text>

        <View style={styles.footerSocials}>
          <TouchableOpacity
            style={styles.footerSocialBtn}
            onPress={() => handleOpenLink(socialLinks.instagram)}
            accessibilityLabel="Abrir Instagram"
          >
            <FontAwesome name="instagram" size={24} color="#FF0033" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerSocialBtn}
            onPress={() => handleOpenLink(socialLinks.whatsapp)}
            accessibilityLabel="Abrir WhatsApp"
          >
            <FontAwesome name="whatsapp" size={24} color="#FF0033" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.footerSocialBtn}
            onPress={() => handleOpenLink(socialLinks.globe)}
            accessibilityLabel="Abrir site"
          >
            <Feather name="globe" size={24} color="#FF0033" />
          </TouchableOpacity>
        </View>

        <Text style={styles.footerCopy}>© 2026 Legacy </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 0,
  },
  header: {
    backgroundColor: '#FF0033',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerWelcome: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginLeft: 10,
    padding: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF0033',
    marginTop: 30,
    marginBottom: 10,
  },
  eventScroll: {
    paddingHorizontal: 10,
  },
  eventImage: {
    width: 170,
    height: 220,
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  gcBannerCard: {
    width: '90%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 30,
  },
  gcBannerBg: {
    width: '100%',
    height: 220,
  },
  gcBannerImg: {
    opacity: 0.1,
  },
  gcBannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,10,10,0.92)',
    paddingHorizontal: 24,
    paddingVertical: 33,
    justifyContent: 'center',
  },
  gcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(160,0,30,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  gcBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FF0033',
    marginRight: 7,
  },
  gcBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  gcBannerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 32,
    marginBottom: 10,
  },
  gcBannerTitleRed: {
    color: '#FF0033',
  },
  gcBannerDesc: {
    color: '#BBBBBB',
    fontSize: 13,
    lineHeight: 19,
  },
  gcScroll: {
    marginTop: 14,
    width: '100%',
  },
  gcScrollContent: {
    paddingHorizontal: 0,
  },
  gcCard: {
    width: GC_CARD_WIDTH,
    marginTop: 20,
    marginHorizontal: 16,
    height: 380,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gcCardDecoLetter: {
    position: 'absolute',
    top: -20,
    right: 8,
    fontSize: 180,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.06)',
  },
  gcCardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  gcDistanceBadgeClosest: {
    backgroundColor: '#FF0033',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  gcDistanceBadgeNormal: {
    backgroundColor: 'rgba(60,60,60,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  gcDistanceText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  gcCardName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gcCardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  gcCardInfoText: {
    color: '#EEEEEE',
    fontSize: 13,
  },
  gcLocationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 13,
    marginTop: 14,
    gap: 8,
  },
  gcLocationBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.6,
  },
  gcFormCard: {
    width: '90%',
    marginTop: 30,
    borderRadius: 12,
    backgroundColor: '#111111',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  gcFormAccent: {
    width: 5,
    backgroundColor: '#FF0033',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  gcFormContent: {
    flex: 1,
    padding: 20,
  },
  gcFormIcon: {
    marginBottom: 10,
  },
  gcFormTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  gcFormDesc: {
    color: '#AAAAAA',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },
  gcFormBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0033',
    borderRadius: 30,
    paddingVertical: 13,
    gap: 8,
  },
  gcFormBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: 0.6,
  },
  storeSection: {
    width: '100%',
    marginTop: 34,
    backgroundColor: '#111111',
    paddingTop: 24,
    paddingBottom: 32,
  },
  storeHeader: {
    paddingHorizontal: 16,
  },
  storeEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },
  storeEyebrowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0033',
    marginRight: 8,
  },
  storeEyebrow: {
    color: '#FF0033',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  storeTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  storeDescription: {
    color: '#AAAAAA',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  storeFlow: {
    marginHorizontal: 16,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  storeFlowStep: {
    flex: 1,
    alignItems: 'center',
  },
  storeFlowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF0033',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  storeFlowLabel: {
    color: '#BBBBBB',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 17,
  },
  storeFlowLine: {
    width: 32,
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginTop: 22,
  },
  storeProductList: {
    paddingLeft: 16,
    paddingRight: 2,
    paddingTop: 18,
  },
  footer: {
    width: '100%',
    backgroundColor: '#0D0D0D',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,0,51,0.2)',
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerDivider: {
    width: 36,
    height: 3,
    backgroundColor: '#FF0033',
    borderRadius: 2,
    marginBottom: 24,
  },
  footerBrand: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 5,
    marginBottom: 6,
  },
 
  footerSocials: {
    flexDirection: 'row',
    gap: 36,
    marginBottom: 36,
  },
  footerSocialBtn: {
    marginTop: 12,
    alignItems: 'center',
    gap: 8,
  },
  footerCopy: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});
